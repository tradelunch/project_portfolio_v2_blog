import { QueryTypes, Sequelize, Transaction } from "sequelize";
import { type TPostFileMeta } from "@/types/post.type";

/**
 * 
 * 1. 
 * table
CREATE TABLE if not exists categories (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name        VARCHAR(100) NOT NULL UNIQUE,
    parent_id   BIGINT NOT NULL,
    root_id     BIGINT NOT NULL,
    level       INT NOT NULL DEFAULT 0,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at      TIMESTAMP DEFAULT NULL
);

 */
export const insertCategories = async (
	db: Sequelize,
	meta: TPostFileMeta,
	tx: Transaction
) => {
	const [root, ...children] = meta?.categories ?? [];

	if (!root) {
		console.log("no categories found");
		return;
	}

	// 1. Handle the root category.
	// Use ON CONFLICT to update if it already exists.
	// We can't know the id for parent_id and root_id before insertion, so we insert with a placeholder (0) and then update it.
	// If a category that was a child is now a root, its level will be updated to 0.
	await db.query(
		`INSERT INTO categories (name, level, parent_id, root_id) 
     VALUES (:name, 0, 0, 0) 
     ON CONFLICT (name) DO UPDATE SET
       level = EXCLUDED.level,
       updated_at = CURRENT_TIMESTAMP`,
		{ replacements: { name: root }, transaction: tx }
	);

	// Get the root category's ID (whether it was just inserted or already existed).
	const [rootCategory] = (await db.query(
		`SELECT id FROM categories WHERE name = :name`,
		{
			replacements: { name: root },
			type: QueryTypes.SELECT,
			transaction: tx,
		}
	)) as Array<{ id: number }>;
	const rootId = rootCategory.id;

	// Update the root category to set its parent_id and root_id to its own id.
	await db.query(
		`UPDATE categories SET parent_id = :id, root_id = :id WHERE id = :id`,
		{ replacements: { id: rootId }, transaction: tx }
	);

	let parentId = rootId;

	// 2. Handle children categories
	for (const [index, childName] of children.entries()) {
		const level = index + 1;
		// Insert child, or update it if it exists.
		// This handles cases where a category might be moved under a different parent.
		await db.query(
			`INSERT INTO categories (name, level, parent_id, root_id) 
                VALUES (:name, :level, :parentId, :rootId) 
                ON CONFLICT (name) DO UPDATE SET
                    level = EXCLUDED.level,
                    parent_id = EXCLUDED.parent_id,
                    root_id = EXCLUDED.root_id,
                    updated_at = CURRENT_TIMESTAMP`,
			{
				replacements: { name: childName, level, parentId, rootId },
				transaction: tx,
			}
		);

		// The current child becomes the parent for the next iteration.
		const [currentCategory] = (await db.query(
			`SELECT id FROM categories WHERE name = :name`,
			{
				replacements: { name: childName },
				type: QueryTypes.SELECT,
				transaction: tx,
			}
		)) as Array<{ id: number }>;

		parentId = currentCategory.id;
	}
	const currentCategoryId = parentId;
	return currentCategoryId;
};
