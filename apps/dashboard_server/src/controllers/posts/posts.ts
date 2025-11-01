import { sequalizeP } from '@/src/db';
import { Router, Request } from 'express';
import { QueryTypes } from 'sequelize';

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
    '/',
    async (
        req: Request<{}, {}, {}, { page?: string; limit?: string }>,
        res
    ) => {
        try {
            const page = parseInt(req.query.page || '1', 10);
            const limit = parseInt(req.query.limit || '20', 10);
            const offset = (page - 1) * limit;

            // Using sequelize.query with replacements for security.
            // The result for a raw SELECT query is an array of objects.
            const countResult: { count: string }[] = await sequalizeP.query(
                'SELECT COUNT(*) FROM posts',
                { type: QueryTypes.SELECT }
            );
            const count = parseInt(countResult[0].count, 10);

            const rows = await sequalizeP.query(
                'SELECT * FROM posts ORDER BY created_at DESC LIMIT :limit OFFSET :offset',
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
            console.error('API Error fetching posts:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch posts',
            });
        }
    }
);

/**
 * @api {get} /posts/users/:username Get posts by a specific user
 * @apiName GetUserPosts
 * @apiGroup Posts
 *
 * @apiParam {String} username The username of the author.
 * @apiParam {Number} [cursor=0] Cursor for pagination (post ID to start from).
 * @apiParam {Number} [limit=10] Number of posts per page.
 *
 * @apiSuccess {Boolean} success Indicates if the request was successful.
 * @apiSuccess {Object[]} posts List of the user's most recent posts for each slug.
 * @apiSuccess {Number} nextCursor Next cursor value (null if no more posts).
 * @apiSuccess {Boolean} hasMore Indicates if more posts are available.
 */
router.get(
    '/users/:username',
    async (
        req: Request<
            { username: string },
            {},
            {},
            { cursor?: string; limit?: string }
        >,
        res
    ) => {
        try {
            const { username } = req.params;
            const cursor = parseInt(req.query.cursor || '0', 10);
            const limit = parseInt(req.query.limit || '10', 10);

            // Fetch one extra row to determine if there are more posts
            const fetchLimit = limit + 1;

            const postsQuery = `
                WITH ranked_posts AS (
                    SELECT
                        p.id,
                        p.user_id,
                        p.slug,
                        p.title,
                        p.description,
                        p.content,
                        p.status,
                        p.created_at,
                        p.updated_at,
                        p.category_id,
                        f.stored_uri,
                        ROW_NUMBER() OVER(PARTITION BY p.slug ORDER BY p.created_at DESC) as rn
                    FROM posts p
                    INNER JOIN users u ON p.user_id = u.id
                    LEFT JOIN files f ON p.id = f.post_id AND f.is_thumbnail = true
                    WHERE u.username = :username
                        AND p.deleted_at IS NULL
                        AND u.deleted_at IS NULL
                        -- AND (f.deleted_at IS NULL OR f.deleted_at IS NOT NULL
                        ${cursor > 0 ? 'AND p.id < :cursor' : ''}
                )
                SELECT 
                    id,
                    user_id,
                    slug,
                    title,
                    description,
                    content,
                    status,
                    created_at,
                    updated_at,
                    category_id,
                    stored_uri
                FROM ranked_posts
                WHERE rn = 1
                ORDER BY id DESC
                LIMIT :fetchLimit
            `;

            const rows: any[] = await sequalizeP.query(postsQuery, {
                replacements: {
                    username,
                    cursor: cursor || Number.MAX_SAFE_INTEGER,
                    fetchLimit,
                },
                type: QueryTypes.SELECT,
            });

            // Check if there are more posts
            const hasMore = rows.length > limit;
            const posts = hasMore ? rows.slice(0, limit) : rows;
            const nextCursor =
                hasMore && posts.length > 0 ? posts[posts.length - 1].id : null;

            const data = {
                posts,
                nextCursor,
                hasMore,
            };

            res.json({
                success: true,
                data,
            });
        } catch (error) {
            console.error('API Error fetching user posts:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch posts',
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
router.get('/:postid', async (req, res) => {
    try {
        const { postid } = req.params;
        const results = await sequalizeP.query(
            'SELECT * FROM posts WHERE id = :postid',
            {
                replacements: { postid },
                type: QueryTypes.SELECT,
            }
        );
        const post = results[0];

        if (!post) {
            return res
                .status(404)
                .json({ success: false, message: 'Post not found' });
        }

        res.json({ success: true, data: post });
    } catch (error) {
        console.error(`API Error fetching post ${req.params.postid}:`, error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch post',
        });
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
router.get('/slug/:slug', async (req, res) => {
    try {
        const { slug } = req.params;
        const { username } = req.query;

        const query = `
			SELECT p.*
			FROM posts p
			INNER JOIN users u ON p.user_id = u.id
			WHERE p.slug = :slug
			${username ? 'AND u.username = :username' : ''}
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
                .json({ success: false, message: 'Post not found' });
        }

        res.json({ success: true, data: post });
    } catch (error) {
        console.error(
            `API Error fetching post by slug ${req.params.slug}:`,
            error
        );
        res.status(500).json({
            success: false,
            message: 'Failed to fetch post',
        });
    }
});
