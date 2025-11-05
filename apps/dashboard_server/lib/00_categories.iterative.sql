-- 단점은 group order Id를 사용할 때 새로운 대댓글이 생기면 그 이후 댓글 대댓글 gorup order id를 하나씩 다 업데이트 해줘야 한다.


DROP TABLE IF EXISTS categories CASCADE;

CREATE TABLE categories (
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP DEFAULT NULL,

    name VARCHAR(100) NOT NULL,
    priority INT NOT NULL DEFAULT 100,
    
    id BIGINT GENERATED ALWAYS AS IDENTITY primary key, -- 자동 증가 컬럼
    group_id BIGINT NULL,
    group_order_id INT DEFAULT 0, -- 그룹 내 순서
    level INT NOT NULL DEFAULT 0,
    parent_id BIGINT REFERENCES categories (id) ON DELETE CASCADE
    
    -- FOREIGN KEY (parent_id) REFERENCES posts(category_id)
);

-- 동일 부모 내 우선순위 + 조회 최적화용 인덱스
CREATE INDEX idx_categories_parent_priority ON categories (parent_id, priority);

-- 루트 기준 빠른 조회용 인덱스
CREATE INDEX idx_categories_root ON categories (group_id);



-- 1. BEFORE INSERT 트리거 (level, group_order_id, group_id 초기 세팅)CREATE OR REPLACE FUNCTION trg_posts_before_insert()
RETURNS TRIGGER AS $$
DECLARE
    parent_group BIGINT;
    parent_level INT;
    parent_order BIGINT;
    max_sibling_order BIGINT;
BEGIN
    IF NEW.parent_id IS NULL THEN
        -- 루트 글 처리
        NEW.level := 0;
        NEW.group_order_id := 0;  -- 루트는 항상 1
        RETURN NEW;
    ELSE
        -- 부모 정보 조회 -- can be selected from front
        SELECT group_id, level, group_order_id
        INTO parent_group, parent_level, parent_order
        FROM posts
        WHERE id = NEW.parent_id
        FOR UPDATE;

        NEW.group_id := parent_group;
        NEW.level := parent_level + 1;

        -- 동일 부모의 마지막 자식 위치 확인
        SELECT COALESCE(MAX(group_order_id), parent_order)
        INTO max_sibling_order
        FROM posts
        WHERE parent_id = NEW.parent_id;

        NEW.group_order_id := max_sibling_order + 1;

        -- 삽입 위치 이후 동일 그룹 내 노드 시프트
        UPDATE posts
        SET group_order_id = group_order_id + 1
        WHERE group_id = parent_group
          AND group_order_id >= NEW.group_order_id;

        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;


-- 2. BEFORE INSERT 트리거 등록
CREATE TRIGGER trg_posts_before_insert
BEFORE INSERT ON posts
FOR EACH ROW
EXECUTE FUNCTION trg_posts_before_insert();

-- 3. AFTER INSERT 트리거 (루트 글 group_id 채움)
CREATE OR REPLACE FUNCTION trg_posts_after_insert()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.parent_id IS NULL THEN
        -- 루트 글의 group_id를 자기 ID로 설정
        UPDATE posts
        SET group_id = NEW.id
        WHERE id = NEW.id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. AFTER INSERT 트리거 등록
CREATE TRIGGER trg_posts_after_insert
AFTER INSERT ON posts
FOR EACH ROW
EXECUTE FUNCTION trg_posts_after_insert();

-- select itrative
SELECT
    ROW_NUMBER() OVER (
        ORDER BY
            COALESCE(group_id, id) ASC, -- 루트 기준 그룹 정렬
            parent_id NULLS FIRST, -- 루트 카테고리 먼저
            priority ASC, -- 동일 부모 내 우선순위
            group_order_id ASC, -- 그룹 내 순서
            id ASC -- 같은 수준 내 ID 순서
    ) AS row_num,
    id,
    group_id,
    parent_id,
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
    parent_id NULLS FIRST,
    priority ASC,
    group_order_id ASC,
    id ASC;

-- select with posts
SELECT
    ROW_NUMBER() OVER (
        ORDER BY
            COALESCE(c.group_id, c.id) ASC, -- 루트 기준 그룹 정렬
            c.parent_id NULLS FIRST, -- 루트 카테고리 먼저
            c.priority ASC, -- 동일 부모 내 우선순위
            c.group_order_id ASC, -- 그룹 내 순서
            c.id ASC -- 같은 수준 내 ID 순서
    ) AS row_num,
    c.id AS category_id,
    c.group_id,
    c.parent_id,
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
    c.parent_id NULLS FIRST,
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
            c.parent_id,
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
            c.parent_id IS NULL
        UNION ALL
        -- 2. 자식 카테고리 재귀 탐색
        SELECT
            c.id AS category_id,
            c.group_id,
            c.parent_id,
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
            INNER JOIN category_hierarchy ch ON c.parent_id = ch.category_id
    )
SELECT
    ch.depth,
    ch.category_id,
    ch.group_id,
    ch.parent_id,
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
    ch.parent_id NULLS FIRST, -- 루트 먼저
    ch.priority ASC, -- 동일 부모 내 우선순위
    ch.group_order_id ASC,
    ch.category_id ASC,
    p.id ASC; 
    -- 카테고리 내 포스트 ID 순