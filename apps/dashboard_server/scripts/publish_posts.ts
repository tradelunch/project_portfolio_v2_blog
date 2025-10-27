import { CustomSnowflake } from "@/lib/CustomSnowflake.module";
import { extractMarkdownFile } from "@/lib/extract.file.lib";
import { TPostFileMeta } from "@/lib/file.type";
import { PostFileNode } from "@/lib/FileSystem.model";
import {
	DEFAULT_USER_ID,
	load_local_file,
	upload_file_s3,
} from "@/scripts/upload_image";
import { establishDBConnection } from "@/src/db";
import { QueryTypes, Sequelize, Transaction } from "sequelize";

const insertPost = async (
	db: Sequelize,
	meta: TPostFileMeta,
	tx: Transaction
) => {
	const results = (await db.query(
		`
        INSERT INTO posts (id, user_id, title, content, status, created_at, updated_at, slug)
        VALUES (:id, :user_id, :title, :content, :status, NOW(), NOW(), :slug)
        RETURNING id
	`,
		{
			replacements: {
				id: meta.id,
				slug: meta.slug,
				user_id: meta.userId,
				title: meta.title,
				content: meta.content,
				status: meta.status || "public",
			},
			type: QueryTypes.SELECT,
			transaction: tx,
		}
	)) as Array<{ id: number }>;

	const insertedId = results[0]?.id;
	console.log(">> meta.id:", meta.id);
	console.log(`>> Inserted post: ${insertedId}`);
	return insertedId;
};

const insertImage = async (
	db: Sequelize,
	meta: TPostFileMeta,
	tx: Transaction
) => {
	await db.query(
		`
        INSERT INTO 
            files (id, user_id, post_id, content_type, ext, original_filename, stored_name, stored_uri, file_size, is_thumbnail, created_at, updated_at, deleted_at)
            VALUES (:id, :user_id, :post_id, :content_type, :ext, :original_filename, :stored_name, :stored_uri, :file_size, :is_thumbnail, NOW(), NOW(), NULL)
        `,
		{
			replacements: {
				id: meta.id!,
				post_id: meta.postId!,
				user_id: meta.userId!,
				content_type: meta.contentType,
				ext: meta.ext,
				original_filename: meta.filename,
				stored_name: meta.storedName,
				stored_uri: meta.storedUri,
				file_size: meta.fileSize,
				is_thumbnail: true,
			},
			transaction: tx,
		}
	);
	console.log(`Inserted image meta for post_id=${meta.postId}`);
};

const run = async () => {
	const base = "data";
	const folderPath = "java/spring/jdbc";
	const slug = "java-spring-jdbc";
	const ext = "png";

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
			filename: `${slug}.${ext}`,
			userId: DEFAULT_USER_ID,

			// post meta
			title: extractedMDFile.title,
			desc: extractedMDFile.desc,
			date: extractedMDFile.date,
			status: extractedMDFile.status,
			content: extractedMDFile.content,
		};

		// 1. insert post
		await insertPost(db, meta, tx);

		// 2. load local file
		const { buffer, contentType, fullPath, fileSize } = await load_local_file(
			base,
			folderPath,
			slug,
			ext
		);

		// 3. upload file to S3
		meta = {
			...meta,
			filename: `${slug}.${ext}`,
			buffer,
			contentType,
			ext,
			fileSize,
			isThumbnail: true,
		};

		meta = await upload_file_s3(meta);

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
