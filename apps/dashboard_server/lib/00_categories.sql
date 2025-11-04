DROP TABLE IF EXISTS categories CASCADE;

CREATE TABLE categories (
    id          BIGINT GENERATED ALWAYS AS IDENTITY primary key,  -- 자동 증가 컬럼
    group_id     BIGINT NULL,
    group_order_id  INT DEFAULT 0,                  -- 그룹 내 순서
    name                 VARCHAR(100) NOT NULL,
    level                INT NOT NULL DEFAULT 0,
    priority             INT NOT NULL DEFAULT 100,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at      TIMESTAMP DEFAULT NULL,    
    parent_category_id   BIGINT REFERENCES categories(id) ON DELETE CASCADE
    -- FOREIGN KEY (parent_category_id) REFERENCES posts(category_id)
);

-- 동일 부모 내 우선순위 + 조회 최적화용 인덱스
CREATE INDEX idx_categories_parent_priority ON categories (parent_category_id, priority);

-- 루트 기준 빠른 조회용 인덱스
CREATE INDEX idx_categories_root ON categories (group_id);

WITH RECURSIVE category_tree AS (
  -- 루트 노드
  SELECT 
    id,
    parent_category_id,
    group_id,
    level,
    priority,
    name,
    LPAD(id::text, 6, '0') AS path
  FROM categories
  WHERE parent_category_id IS NULL

  UNION ALL

  -- 자식 노드
  SELECT 
    c.id,
    c.parent_category_id,
    c.group_id,
    c.level,
    c.priority,
    c.name,
    ct.path || '.' || LPAD(c.id::text, 6, '0') AS path
  FROM categories c
  JOIN category_tree ct ON c.parent_category_id = ct.id
)
SELECT 
  id,
  parent_category_id,
  group_id,
  level,
  priority,
  name,
  ROW_NUMBER() OVER (ORDER BY path) AS order_in_tree
FROM category_tree
ORDER BY split_part(path, '.', level + 1)::int, priority ASC;