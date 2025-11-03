DROP TABLE IF EXISTS categories CASCADE;

CREATE TABLE categories (
    category_id          BIGINT GENERATED ALWAYS AS IDENTITY primary key,  -- 자동 증가 컬럼
    root_category_id     BIGINT NULL,
    name                 VARCHAR(100) NOT NULL,
    level                INT NOT NULL DEFAULT 0,
    priority             INT NOT NULL DEFAULT 100,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at      TIMESTAMP DEFAULT NULL,    
    parent_category_id   BIGINT REFERENCES categories(category_id) ON DELETE CASCADE
    -- FOREIGN KEY (parent_category_id) REFERENCES posts(category_id)
);

-- 동일 부모 내 우선순위 + 조회 최적화용 인덱스
CREATE INDEX idx_categories_parent_priority ON categories (parent_category_id, priority);

-- 루트 기준 빠른 조회용 인덱스
CREATE INDEX idx_categories_root ON categories (root_category_id);

WITH RECURSIVE category_tree AS (
  -- 루트 노드
  SELECT 
    category_id,
    parent_category_id,
    root_category_id,
    level,
    priority,
    name,
    LPAD(category_id::text, 6, '0') AS path
  FROM categories
  WHERE parent_category_id IS NULL

  UNION ALL

  -- 자식 노드
  SELECT 
    c.category_id,
    c.parent_category_id,
    c.root_category_id,
    c.level,
    c.priority,
    c.name,
    ct.path || '.' || LPAD(c.category_id::text, 6, '0') AS path
  FROM categories c
  JOIN category_tree ct ON c.parent_category_id = ct.category_id
)
SELECT 
  category_id,
  parent_category_id,
  root_category_id,
  level,
  priority,
  name,
  ROW_NUMBER() OVER (ORDER BY path) AS order_in_tree
FROM category_tree
ORDER BY split_part(path, '.', level + 1)::int, priority ASC;