import { CustomSnowflake } from "@/lib/CustomSnowflake.module";
import { TPostFileMeta } from "@/lib/file.type";
import { AWS_S3_BUCKET } from "@/src/env.schema";
import { s3 } from "@/src/lib/awsS3";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import path from "path";

import fs from "fs/promises";
import mime from "mime-types";

export const DEFAULT_USER_ID = 1;

export const load_local_file = async (
	base: string,
	folderPath: string,
	slug: string,
	ext: string
) => {
	const fullPath = path.resolve(
		process.cwd(),
		base,
		folderPath,
		slug,
		`${slug}.${ext}`
	);
	try {
		// 파일 정보 가져오기
		const stat = await fs.stat(fullPath);

		// 파일 읽기
		const buffer = await fs.readFile(fullPath);

		// content type 추론
		const contentType = mime.lookup(ext) || "application/octet-stream";

		return { buffer, contentType, fullPath, fileSize: stat.size };
	} catch (err) {
		console.error("Error reading file:", err);
		throw new Error(`Failed to read file at: ${fullPath}`);
	}
};

export const get_signed_uri_s3 = async (key: string) => {
	const signedUrl = await getSignedUrl(
		s3,
		new GetObjectCommand({
			Bucket: AWS_S3_BUCKET!,
			Key: key,
		}),
		{ expiresIn: 3600 }
	);

	return signedUrl;
};
export const upload_file_s3 = async (meta: TPostFileMeta) => {
	const fileBuffer = meta.buffer;

	const key = `${meta.userId}/${meta.folderPath}/${meta.slug}/${meta.id}.${meta.ext}`;

	const command = new PutObjectCommand({
		Bucket: AWS_S3_BUCKET,
		Key: key,
		Body: fileBuffer,
		ContentType: meta.contentType ?? "application/octet-stream",
		Metadata: {
			original_filename: meta.filename!,
			content_type: meta.contentType!,
			ext: meta.ext!,
			is_thumbnail: String(meta.isThumbnail ?? false),
		},
	});

	await s3.send(command);

	// 서명된 URL 생성
	const s3SignedUrl = await get_signed_uri_s3(key);
	console.log("S3 Signed URL:", s3SignedUrl);

	meta.storedName = `${meta.id}.${meta.ext}`;
	meta.storedUri = s3SignedUrl;
	// meta.storedUri = `s3://${AWS_S3_BUCKET}/${key}`;

	return meta;
};
