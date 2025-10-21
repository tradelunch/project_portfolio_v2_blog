type TFileParams = {
	localFilePath: string; // 로컬 업로드 대상 파일 경로
	filename: string;
	categories: string[];
	tags: string[];
	userId: string;
};

type TFileMeta = {
	filename: string;
	storedName: string;
	storedUri: string;
	categories: string[];
	tags: string[];
};

