SELECT p.id AS post_id,
       p.title,
       p.created_at,
       c.id AS category_id,
       c.name AS category_name,
       c.level,
       c.path
FROM (
  WITH RECURSIVE category_tree AS (
    SELECT 
      id,
      parent_id,
      level,
      name,
      LPAD(id::text, 6, '0') AS path
    FROM categories
    WHERE parent_id IS NULL

    UNION ALL

    SELECT 
      c.id,
      c.parent_id,
      ct.level + 1 AS level,
      c.name,
      ct.path || '.' || LPAD(c.id::text, 6, '0') AS path
    FROM categories c
    JOIN category_tree ct ON c.parent_id = ct.id
  )
  SELECT *
  FROM category_tree
) AS c
JOIN posts p ON p.category_id = c.id
ORDER BY c.path, p.created_at;