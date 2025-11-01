import { CustomSnowflake } from "@/lib/CustomSnowflake.module";
import { extractMarkdownFile } from "@/lib/extract.file.lib";
import { insertCategories } from "@/scripts/publish_post/insert_categories";
import { insertImage } from "@/scripts/publish_post/insert_image";
import { insertPost } from "@/scripts/publish_post/insert_post";
import {
	DEFAULT_USER_ID,
	load_local_file,
	upload_file_s3,
} from "@/scripts/publish_post/upload_image";

import { establishDBConnection } from "@/src/db";
import { CDN_ASSET_POSTS } from "@/src/env.schema";
import { QueryTypes, Sequelize, Transaction } from "sequelize";

import { type TPostFileMeta } from "@/scripts/publish_post/post.type";

const run = async () => {
	const base = "data";
	const folderPath = "java/spring/jdbc";
	const slug = "java-spring-jdbc";
	const fileExt = "png";

	const extractedMDFile = extractMarkdownFile(base, folderPath, slug);

	let db: Sequelize | undefined = undefined;
	let tx: Transaction | null = null;

	try {
		db = await establishDBConnection();
		if (!db) throw new Error("Database connection not established.");

		tx = await db.transaction(); // 트랜잭션 시작

		const metaId = CustomSnowflake.generate();

		let meta: TPostFileMeta = {
			id: metaId,
			postId: metaId,
			base,
			folderPath,
			slug,
			filename: `${slug}.${fileExt}`,
			userId: DEFAULT_USER_ID,

			// post meta
			title: extractedMDFile.title,
			desc: extractedMDFile.desc,
			date: extractedMDFile.date,
			status: extractedMDFile.status,
			content: extractedMDFile.content,
			categories: folderPath.split("/"),
		};

		// 2. load local file
		const { buffer, contentType, fullPath, fileSize } = await load_local_file(
			base,
			folderPath,
			slug,
			fileExt
		);

		// 3. upload file to S3
		meta = {
			...meta,
			filename: `${slug}.${fileExt}`,
			buffer,
			contentType,
			ext: fileExt,
			fileSize,
			isThumbnail: true,
		};

		meta = await upload_file_s3(meta);

		const thumbnail_url = `${CDN_ASSET_POSTS}/${meta.storedUri}`;

		// Regex: matches ![Alt text](./filename.png "Title")
		const updated = meta.content?.replace(
			/!\[([^\]]*)\]\(\.\/([^)\s]+)(?:\s+"([^"]*)")?\)/g,
			(_, alt, filename, title) => {
				return title
					? `![${alt}](${thumbnail_url} "${title}")`
					: `![${alt}](${thumbnail_url})`;
			}
		);

		meta.content = updated || meta.content;

		// 1. insert categories
		const categoryId = await insertCategories(db, meta, tx);
		meta.categoryId = categoryId;

		// 2. insert post
		await insertPost(db, meta, tx);

		// 4. insert image meta (same transaction)
		await insertImage(db, meta, tx);

		// 트랜잭션 커밋
		await tx.commit();

		console.log("✅ Transaction committed successfully.");
	} catch (err) {
		if (tx) await tx.rollback();
		console.error("❌ Transaction rolled back due to error:", err);
	} finally {
		if (db) await db.close();
		process.exit(0);
	}
};

run();
