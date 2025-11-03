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

// routes/posts.routes.ts
/**
 * @api {get} /posts/users/:username/categories Get user's post categories as tree
 * @apiName GetUserCategories
 * @apiGroup Posts
 *
 * @apiParam {String} username The username of the author.
 *
 * @apiSuccess {Boolean} success Indicates if the request was successful.
 * @apiSuccess {Object[]} categories Hierarchical category tree with post counts.
 */
router.get(
    '/users/:username/categories',
    async (req: Request<{ username: string }, {}, {}, {}>, res) => {
        try {
            const { username } = req.params;

            // Get all categories for the user's posts
            const categoriesQuery = `
                WITH user_posts AS (
                    SELECT DISTINCT p.id, p.category_id
                    FROM posts p
                    INNER JOIN users u ON p.user_id = u.id
                    WHERE u.username = :username
                        AND p.deleted_at IS NULL
                        AND u.deleted_at IS NULL
                        AND p.status = 'public'
                ),
                category_counts AS (
                    SELECT 
                        c.id,
                        c.name,
                        c.parent_id,
                        c.root_id,
                        c.level,
                        COUNT(up.id) as post_count
                    FROM categories c
                    LEFT JOIN user_posts up ON c.id = up.category_id
                    WHERE c.deleted_at IS NULL
                    GROUP BY c.id, c.name, c.parent_id, c.root_id, c.level
                    HAVING COUNT(up.id) > 0
                )
                SELECT 
                    id,
                    name,
                    parent_id,
                    root_id,
                    level,
                    post_count
                FROM category_counts
                ORDER BY level ASC, name ASC
            `;

            const categories = await sequalizeP.query(categoriesQuery, {
                replacements: { username },
                type: QueryTypes.SELECT,
            });

            res.json({
                success: true,
                data: {
                    categories,
                },
            });
        } catch (error) {
            console.error('API Error fetching categories:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch categories',
            });
        }
    }
);

// routes/posts.routes.ts
/**
 * @api {get} /posts/users/:username/category/:categoryId Get posts by category
 * @apiName GetPostsByCategory
 * @apiGroup Posts
 */
router.get(
    '/users/:username/category/:categoryId',
    async (
        req: Request<
            { username: string; categoryId: string },
            {},
            {},
            { cursor?: string; limit?: string }
        >,
        res
    ) => {
        try {
            const { username, categoryId } = req.params;
            const cursor = parseInt(req.query.cursor || '0', 10);
            const limit = Math.min(parseInt(req.query.limit || '10', 10), 50);
            const fetchLimit = limit + 1;

            const postsQuery = `
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
                    f.stored_uri
                FROM posts p
                INNER JOIN users u ON p.user_id = u.id
                LEFT JOIN files f ON p.id = f.post_id 
                    AND f.is_thumbnail = true 
                    AND f.deleted_at IS NULL
                WHERE u.username = :username
                    AND p.category_id = :categoryId
                    AND p.deleted_at IS NULL
                    AND u.deleted_at IS NULL
                    AND p.status = 'public'
                    ${cursor > 0 ? 'AND p.id < :cursor' : ''}
                ORDER BY p.id DESC
                LIMIT :fetchLimit
            `;

            const rows: any[] = await sequalizeP.query(postsQuery, {
                replacements: {
                    username,
                    categoryId: parseInt(categoryId, 10),
                    cursor: cursor || Number.MAX_SAFE_INTEGER,
                    fetchLimit,
                },
                type: QueryTypes.SELECT,
            });

            const hasMore = rows.length > limit;
            const posts = hasMore ? rows.slice(0, limit) : rows;
            const nextCursor =
                hasMore && posts.length > 0 ? posts[posts.length - 1].id : null;

            res.json({
                success: true,
                posts,
                nextCursor,
                hasMore,
            });
        } catch (error) {
            console.error('API Error fetching posts by category:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch posts',
            });
        }
    }
);
