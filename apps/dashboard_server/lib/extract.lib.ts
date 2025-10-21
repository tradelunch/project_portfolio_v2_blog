import fs from "fs";
import matter from "gray-matter";
    
export const extractMetaDataFromPostFile = (content: string) => {
	const { data: meta, content: body } = matter(content);
	return { meta, body };
};
