import { readFile } from "fs/promises";
import path from "path";

import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";

import { sequalizeP } from "@/src/db";
import { AWS_REGION, AWS_S3_BUCKET } from "@/src/env.schema";
import { s3 } from "@/src/lib/awsS3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Snowflake } from "@theinternetfolks/snowflake";

const DEFAULT_USER_ID = 1;

const getSignedUrlFromS3 = async (key: string) => {
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

export const upload_file_s3 = async (meta: TFileParams) => {
	const { localFilePath, filename, categories, tags, userId } = meta;

	const fileBuffer = await readFile(localFilePath);

	const snowflakeId = Snowflake.generate();
	const key = `${userId}/${categories.join("/")}/${snowflakeId}`;

	// 1. 파일 업로드
	const command = new PutObjectCommand({
		Bucket: process.env.AWS_S3_BUCKET!,
		Key: key,
		Body: fileBuffer,
		ContentType: "application/octet-stream",
		Metadata: {
			tags: JSON.stringify(tags),
		},
	});

	await s3.send(command);

	// 2. 업로드 후 signed URL 생성 (await 필수)
	const s3SignedUrl = await getSignedUrlFromS3(key);

	return {
		filename,
		storedName: snowflakeId,
		storedUri: s3SignedUrl,
		categories,
		tags,
	};
};

type TUploadS3Param = {
	path: string;
	name: string;
};

export const upload_post = async (path: string, name: string) => {
	const userid = DEFAULT_USER_ID;
	// 0. load file

	// 1. parse post contents
	// const fileMeta = extractMetaDataFromPostFile();

	// 2. upload files -> get s3 pathes

	// 3. insert a post

	// 4. insert files
	// - first file is thumbnail

	// 5. insert categories

	// 6. insert tags

	//
};
