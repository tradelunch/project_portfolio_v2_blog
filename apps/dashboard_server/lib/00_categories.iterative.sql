DROP TABLE IF EXISTS categories CASCADE;

CREATE TABLE categories (
    id BIGINT GENERATED ALWAYS AS IDENTITY primary key, -- 자동 증가 컬럼
    group_id BIGINT NULL,
    group_order_id INT DEFAULT 0, -- 그룹 내 순서
    level INT NOT NULL DEFAULT 0,
    name VARCHAR(100) NOT NULL,
    priority INT NOT NULL DEFAULT 100,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP DEFAULT NULL,
    parent_category_id BIGINT REFERENCES categories (id) ON DELETE CASCADE
    -- FOREIGN KEY (parent_category_id) REFERENCES posts(category_id)
);

-- 동일 부모 내 우선순위 + 조회 최적화용 인덱스
CREATE INDEX idx_categories_parent_priority ON categories (parent_category_id, priority);

-- 루트 기준 빠른 조회용 인덱스
CREATE INDEX idx_categories_root ON categories (group_id);

-- select itrative
SELECT
    ROW_NUMBER() OVER (
        ORDER BY
            COALESCE(group_id, id) ASC, -- 루트 기준 그룹 정렬
            parent_category_id NULLS FIRST, -- 루트 카테고리 먼저
            priority ASC, -- 동일 부모 내 우선순위
            group_order_id ASC, -- 그룹 내 순서
            id ASC -- 같은 수준 내 ID 순서
    ) AS row_num,
    id,
    group_id,
    parent_category_id,
    group_order_id,
    level,
    priority,
    name,
    created_at,
    updated_at,
    deleted_at
FROM
    categories
ORDER BY
    COALESCE(group_id, id) ASC,
    parent_category_id NULLS FIRST,
    priority ASC,
    group_order_id ASC,
    id ASC;

-- select with posts
SELECT
    ROW_NUMBER() OVER (
        ORDER BY
            COALESCE(c.group_id, c.id) ASC, -- 루트 기준 그룹 정렬
            c.parent_category_id NULLS FIRST, -- 루트 카테고리 먼저
            c.priority ASC, -- 동일 부모 내 우선순위
            c.group_order_id ASC, -- 그룹 내 순서
            c.id ASC -- 같은 수준 내 ID 순서
    ) AS row_num,
    c.id AS category_id,
    c.group_id,
    c.parent_category_id,
    c.group_order_id,
    c.level,
    c.priority,
    c.name AS category_name,
    c.created_at AS category_created_at,
    c.updated_at AS category_updated_at,
    c.deleted_at AS category_deleted_at,
    p.id AS post_id,
    p.title AS post_title,
    -- p.content AS post_content,
    p.created_at AS post_created_at,
    p.updated_at AS post_updated_at
FROM
    categories c
    LEFT JOIN posts p ON p.category_id = c.id
ORDER BY
    COALESCE(c.group_id, c.id) ASC,
    c.parent_category_id NULLS FIRST,
    c.priority ASC,
    c.group_order_id ASC,
    c.id ASC,
    p.id ASC; 
    -- 같은 카테고리 내 포스트 ID 순


-- select recursivley with posts
WITH RECURSIVE
    category_hierarchy AS (
        -- 1. 루트 카테고리부터 시작
        SELECT
            c.id AS category_id,
            c.group_id,
            c.parent_category_id,
            c.level,
            c.name AS category_name,
            c.priority,
            c.group_order_id,
            c.created_at AS category_created_at,
            c.updated_at AS category_updated_at,
            c.deleted_at AS category_deleted_at,
            1 AS depth
        FROM
            categories c
        WHERE
            c.parent_category_id IS NULL
        UNION ALL
        -- 2. 자식 카테고리 재귀 탐색
        SELECT
            c.id AS category_id,
            c.group_id,
            c.parent_category_id,
            c.level,
            c.name AS category_name,
            c.priority,
            c.group_order_id,
            c.created_at AS category_created_at,
            c.updated_at AS category_updated_at,
            c.deleted_at AS category_deleted_at,
            ch.depth + 1 AS depth
        FROM
            categories c
            INNER JOIN category_hierarchy ch ON c.parent_category_id = ch.category_id
    )
SELECT
    ch.depth,
    ch.category_id,
    ch.group_id,
    ch.parent_category_id,
    ch.level,
    ch.category_name,
    ch.priority,
    ch.group_order_id,
    ch.category_created_at,
    ch.category_updated_at,
    ch.category_deleted_at,
    p.id AS post_id,
    p.title AS post_title,
    p.content AS post_content,
    p.created_at AS post_created_at,
    p.updated_at AS post_updated_at
FROM
    category_hierarchy ch
    LEFT JOIN posts p ON p.category_id = ch.category_id
ORDER BY
    COALESCE(ch.group_id, ch.category_id) ASC, -- 루트 그룹 기준
    ch.parent_category_id NULLS FIRST, -- 루트 먼저
    ch.priority ASC, -- 동일 부모 내 우선순위
    ch.group_order_id ASC,
    ch.category_id ASC,
    p.id ASC; 
    -- 카테고리 내 포스트 ID 순