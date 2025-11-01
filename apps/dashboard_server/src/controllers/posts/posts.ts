import { sequalizeP } from "@/src/db";
import { Router, Request } from "express";
import { QueryTypes } from "sequelize";

export const router = Router();

/**
 * @api {get} /posts Get all published posts
 * @apiName GetPosts
 * @apiGroup Posts
 *
 * @apiParam {Number} [page=1] Page number for pagination.
 * @apiParam {Number} [limit=20] Number of posts per page.
 *
 * @apiSuccess {Boolean} success Indicates if the request was successful.
 * @apiSuccess {Object[]} data List of posts.
 * @apiSuccess {Number} total Total number of posts.
 * @apiSuccess {Number} page Current page number.
 * @apiSuccess {Number} totalPages Total number of pages.
 */
router.get(
	"/",
	async (req: Request<{}, {}, {}, { page?: string; limit?: string }>, res) => {
		try {
			const page = parseInt(req.query.page || "1", 10);
			const limit = parseInt(req.query.limit || "20", 10);
			const offset = (page - 1) * limit;

			// Using sequelize.query with replacements for security.
			// The result for a raw SELECT query is an array of objects.
			const countResult: { count: string }[] = await sequalizeP.query(
				"SELECT COUNT(*) FROM posts",
				{ type: QueryTypes.SELECT }
			);
			const count = parseInt(countResult[0].count, 10);

			const rows = await sequalizeP.query(
				"SELECT * FROM posts ORDER BY created_at DESC LIMIT :limit OFFSET :offset",
				{
					replacements: { limit, offset },
					type: QueryTypes.SELECT,
				}
			);

			res.json({
				success: true,
				data: rows,
				total: count,
				page: page,
				totalPages: Math.ceil(count / limit) || 0,
			});
		} catch (error) {
			console.error("API Error fetching posts:", error);
			res.status(500).json({
				success: false,
				message: "Failed to fetch posts",
			});
		}
	}
);

/**
 * @api {get} /posts/user/:username Get posts by a specific user
 * @apiName GetUserPosts
 * @apiGroup Posts
 *
 * @apiParam {String} username The username of the author.
 * @apiParam {Number} [page=1] Page number for pagination.
 * @apiParam {Number} [limit=20] Number of posts per page.
 *
 * @apiSuccess {Boolean} success Indicates if the request was successful.
 * @apiSuccess {Object[]} data List of the user's most recent posts for each slug.
 * @apiSuccess {Number} total Total number of unique posts (by slug).
 * @apiSuccess {Number} page Current page number.
 * @apiSuccess {Number} totalPages Total number of pages.
 */
router.get(
	"/user/:username",
	async (
		req: Request<
			{ username: string },
			{},
			{},
			{ page?: string; limit?: string }
		>,
		res
	) => {
		try {
			const { username } = req.params;
			const page = parseInt(req.query.page || "1", 10);
			const limit = parseInt(req.query.limit || "20", 10);
			const offset = (page - 1) * limit;

			// Subquery to get the count of unique posts by slug for the user
			const countQuery = `
				SELECT COUNT(DISTINCT p.slug)
				FROM posts p
				INNER JOIN users u ON p.user_id = u.id
				WHERE u.username = :username
			`;
			const countResult: { count: string }[] = await sequalizeP.query(
				countQuery,
				{ replacements: { username }, type: QueryTypes.SELECT }
			);
			const count = parseInt(countResult[0].count, 10);

			// This query fetches the latest version of each post for a given user, identified by slug.
			// It uses a window function to rank posts with the same slug by their creation date.
			const postsQuery = `
				WITH ranked_posts AS (
					SELECT
						p.*,
						f.stored_uri,
						ROW_NUMBER() OVER(PARTITION BY p.slug ORDER BY p.created_at DESC) as rn
					FROM posts p
					INNER JOIN users u ON p.user_id = u.id
					LEFT JOIN files f ON p.id = f.post_id AND f.is_thumbnail = true
					WHERE u.username = :username
				)
				SELECT *
				FROM ranked_posts
				WHERE rn = 1
				ORDER BY created_at DESC
				LIMIT :limit OFFSET :offset
			`;

			const rows = await sequalizeP.query(postsQuery, {
				replacements: { username, limit, offset },
				type: QueryTypes.SELECT,
			});

			res.json({
				success: true,
				data: rows,
				total: count,
				page: page,
				totalPages: Math.ceil(count / limit) || 0,
			});
		} catch (error) {
			console.error("API Error fetching user posts:", error);
			res
				.status(500)
				.json({ success: false, message: "Failed to fetch posts" });
		}
	}
);

/**
 * @api {get} /posts/:postid Get a single post by its ID
 * @apiName GetPostById
 * @apiGroup Posts
 *
 * @apiParam {Number} postid The unique ID of the post.
 *
 * @apiSuccess {Boolean} success Indicates if the request was successful.
 * @apiSuccess {Object} data The post object.
 */
router.get("/:postid", async (req, res) => {
	try {
		const { postid } = req.params;
		const results = await sequalizeP.query(
			"SELECT * FROM posts WHERE id = :postid",
			{
				replacements: { postid },
				type: QueryTypes.SELECT,
			}
		);
		const post = results[0];

		if (!post) {
			return res
				.status(404)
				.json({ success: false, message: "Post not found" });
		}

		res.json({ success: true, data: post });
	} catch (error) {
		console.error(`API Error fetching post ${req.params.postid}:`, error);
		res.status(500).json({ success: false, message: "Failed to fetch post" });
	}
});

/**
 * @api {get} /posts/slug/:slug Get a single post by its slug and author's username
 * @apiName GetPostBySlug
 * @apiGroup Posts
 *
 * @apiParam {String} slug The unique slug of the post.
 * @apiQuery {String} [username] Optional username to filter by author.
 *
 * @apiSuccess {Boolean} success Indicates if the request was successful.
 * @apiSuccess {Object} data The most recent post object.
 */
router.get("/slug/:slug", async (req, res) => {
	try {
		const { slug } = req.params;
		const { username } = req.query;

		const query = `
			SELECT p.*
			FROM posts p
			INNER JOIN users u ON p.user_id = u.id
			WHERE p.slug = :slug
			${username ? "AND u.username = :username" : ""}
			ORDER BY p.created_at DESC
			LIMIT 1
		`;

		const replacements = username ? { slug, username } : { slug };
		const results = await sequalizeP.query(query, {
			replacements,
			type: QueryTypes.SELECT,
		});

		const post = results[0];

		if (!post) {
			return res
				.status(404)
				.json({ success: false, message: "Post not found" });
		}

		res.json({ success: true, data: post });
	} catch (error) {
		console.error(`API Error fetching post by slug ${req.params.slug}:`, error);
		res.status(500).json({ success: false, message: "Failed to fetch post" });
	}
});
