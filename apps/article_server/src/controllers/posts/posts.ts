import { Router } from "express";
import { promises as fs } from "fs";
import path from "path";

export const router = Router();

router.get("/", (req, res) => {
	res.json({ status: "ok", path: req.originalUrl });
});

// // GET /api/posts/featured - Get featured posts (must be before /:slug route)
// router.get("/featured", async (req, res) => {
// 	try {
// 		const { limit = 5 } = req.query;
// 		const posts = await models.Posts.findFeatured(parseInt(limit));

// 		res.json({
// 			success: true,
// 			data: posts,
// 		});
// 	} catch (error) {
// 		console.error("Featured posts API error:", error);
// 		res.status(500).json({
// 			success: false,
// 			message: "Failed to fetch featured posts",
// 			error: error.message,
// 		});
// 	}
// });

// // GET /api/posts - Get all published posts with categories
// router.get("/", async (req, res) => {
// 	try {
// 		const { page = 1, limit = 20, category, featured } = req.query;
// 		const offset = (page - 1) * limit;

// 		let whereClause = { status: "published", visibility: "public" };

// 		if (featured === "true") {
// 			whereClause.featured = true;
// 		}

// 		const includeClause = [
// 			{
// 				model: models.User,
// 				as: "author",
// 				attributes: ["id", "username", "displayname"],
// 			},
// 			{
// 				model: models.Category,
// 				as: "categories",
// 				attributes: ["id", "name", "slug", "path", "depth", "color"],
// 				through: {
// 					attributes: ["is_primary", "assigned_at"],
// 				},
// 			},
// 		];

// 		// Filter by category if provided
// 		if (category) {
// 			includeClause[1].where = { slug: category };
// 		}

// 		const posts = await models.Posts.findAndCountAll({
// 			where: whereClause,
// 			include: includeClause,
// 			limit: parseInt(limit),
// 			offset: offset,
// 			order: [["published_at", "DESC"]],
// 			distinct: true,
// 		});

// 		res.json({
// 			success: true,
// 			data: posts.rows,
// 			total: posts.count,
// 			page: parseInt(page),
// 			totalPages: Math.ceil(posts.count / limit),
// 		});
// 	} catch (error) {
// 		console.error("Posts API error:", error);
// 		res.status(500).json({
// 			success: false,
// 			message: "Failed to fetch posts",
// 			error: error.message,
// 		});
// 	}
// });

// // GET /api/posts/:slug - Get single post by slug
// router.get("/:slug", async (req, res) => {
// 	try {
// 		const { slug } = req.params;
// 		const post = await models.Posts.findBySlug(slug);

// 		if (!post) {
// 			return res.status(404).json({
// 				success: false,
// 				message: "Post not found",
// 			});
// 		}

// 		// Increment view count
// 		await post.incrementViewCount();

// 		res.json({
// 			success: true,
// 			data: post,
// 		});
// 	} catch (error) {
// 		console.error("Post detail API error:", error);
// 		res.status(500).json({
// 			success: false,
// 			message: "Failed to fetch post",
// 			error: error.message,
// 		});
// 	}
// });

// module.exports = router;
