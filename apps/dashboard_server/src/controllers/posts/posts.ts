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
