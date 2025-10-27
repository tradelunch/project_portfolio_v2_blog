import { CustomSnowflake } from "@/lib/CustomSnowflake.module";
import { extractMarkdownFile } from "@/lib/extract.file.lib";
import { TImageFileMeta } from "@/lib/file.type";
import { PostFileNode } from "@/lib/FileSystem.model";
import {
	DEFAULT_USER_ID,
	load_local_file,
	upload_file_s3,
} from "@/scripts/upload_image";
import { establishDBConnection } from "@/src/db";
import { Sequelize } from "sequelize";

const insertPost = async (db: Sequelize, file: PostFileNode) => {
	const [res] = await db.query(
		`
        INSERT INTO 
            posts (id, user_id, title, content, status, created_at, updated_at, deleted_at, slug)
            VALUES (:id, :user_id, :title, :content, :status, NOW(), NOW(), NULL, :slug)`,
		{
			replacements: {
				id: file.id,
				slug: file.slug,
				user_id: file.userId, // Make sure file has user_id
				title: file.title,
				content: file.content,
				status: file.status || "public", // Default to 'public' if not provided
			},
		}
	);

	// console.log(`Inserted post: ${file.title}`, res[0]);
	console.log("[][][][][[][][][][][][][][][]");
	return res;
};

const insertImage = async (db: Sequelize, meta: TImageFileMeta) => {
	await db.query(
		`
        INSERT INTO 
            files (id, user_id, post_id, content_type, ext, filename, stored_name, stored_uri, file_size, is_thumbnail, created_at, updated_at, deleted_at)
            VALUES (:id, :user_id, :post_id, :content_type, :ext, :filename, :stored_name, :stored_uri, :file_size, :is_thumbnail, NOW(), NOW(), NULL)`,
		{
			replacements: {
				id: meta.id!,
				post_id: meta.postId!,
				user_id: meta.userId!,
				content_type: "image/png",
				ext: ".png",
				filename: meta.filename,
				stored_name: meta.storedName,
				stored_uri: meta.storedUri,
				file_size: meta.fileSize,
				is_thumbnail: true,
			},
		}
	);
};
const run = async () => {
	const base = "data";
	const folderPath = "java/spring/jdbc";
	const slug = "java-spring-jdbc";
	const ext = "png";

	const extractedMDFile = extractMarkdownFile(base, folderPath, slug);
	// meta.print();

	let db;
	try {
		db = await establishDBConnection();
		if (!db) throw new Error("Database connection not established.");
		const id = CustomSnowflake.generate();

		let meta: TImageFileMeta = {
			id: id,
			postId: id,
			base,
			folderPath,
			slug,
		};

		// 1. insert post → postId 획득
		const postId = await insertPost(db, extractedMDFile);
		console.log("Inserted post id:", postId);

		// 2. load local file
		const { buffer, contentType, fullPath, fileSize } = await load_local_file(
			base,
			folderPath,
			slug,
			ext
		);

		// 3. upload to S3
		meta = {
			...meta,
			filename: `${slug}.${ext}`,
			buffer,
			userId: DEFAULT_USER_ID,
			// postId,
			contentType,
			ext,
			fileSize,
			isThumbnail: true,
		};

		meta = await upload_file_s3(meta);
		// console.log("Uploaded image meta:", meta);

		// 4. insert image meta to DB (optional)
		await insertImage(db, meta);

		console.log("Completed successfully.");
	} catch (err) {
		console.error("Execution failed:", err);
	} finally {
		if (db) await db.close();
		process.exit(0);
	}
};

run();
