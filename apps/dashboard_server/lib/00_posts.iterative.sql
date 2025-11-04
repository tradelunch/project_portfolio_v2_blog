DROP TABLE IF EXISTS posts CASCADE;

CREATE TABLE posts (
    id          BIGINT GENERATED ALWAYS AS IDENTITY primary key,          -- 고유 PK
    group_id        BIGINT NULL,                         -- 루트 글 ID (root면 자기 자신)
    group_order_id  INT DEFAULT 0,                  -- 그룹 내 순서
    parent_id       BIGINT NULL,                    -- 부모 글 ID
    priority        INT NOT NULL DEFAULT 100,
    level           INT NOT NULL DEFAULT 0,       -- 들여쓰기 깊이 (root = 0)

    title           VARCHAR(255) NOT NULL,
    content         TEXT,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at      TIMESTAMP DEFAULT NULL,
    category_id     BIGINT NULL,
    -- reply_count     INT DEFAULT 0,                  -- 자식 글 수
    -- FOREIGN KEY (category_id) REFERENCES categories(id) on delete SET NULL,
    FOREIGN KEY (parent_id) REFERENCES posts(id) on delete cascade
);


-- group_id 기준 조회 최적화
CREATE INDEX idx_posts_group_id ON posts(group_id); 


---- function + trigger
-- before insert
CREATE OR REPLACE FUNCTION posts_before_insert()
RETURNS TRIGGER AS $$
DECLARE
    parent_group_id BIGINT;
    parent_level INT;
    max_order_id INT;
BEGIN
    -- 루트 글이면 group_id = 자기 자신 ID
    IF NEW.parent_id IS NULL THEN
        -- 루트 글이므로 level 0, group_order_id 0
        NEW.level := 0;
        NEW.group_order_id := 0;
        -- group_id는 BEFORE INSERT에서는 NEW.id를 바로 사용할 수 없으므로, AFTER INSERT 트리거에서 업데이트 필요
        -- 여기서는 임시 0으로 두고 AFTER INSERT에서 업데이트 가능
        NEW.group_id := 0;
    ELSE
        -- 댓글이면 부모 정보를 가져옴
        SELECT group_id, level INTO parent_group_id, parent_level
        FROM posts
        WHERE id = NEW.parent_id;

        -- 부모 그룹 그대로 사용
        NEW.group_id := parent_group_id;
        -- level = 부모 level + 1
        NEW.level := parent_level + 1;

        -- 그룹 내 순서 계산: 부모 그룹 내 최대 group_order_id + 1
        SELECT COALESCE(MAX(group_order_id), 0) + 1
        INTO max_order_id
        FROM posts
        WHERE group_id = parent_group_id;

        NEW.group_order_id := max_order_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_posts_before_insert
BEFORE INSERT ON posts
FOR EACH ROW
EXECUTE FUNCTION posts_before_insert();


-- after insert
CREATE OR REPLACE FUNCTION posts_after_insert()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.parent_id IS NULL THEN
        UPDATE posts
        SET group_id = NEW.id
        WHERE id = NEW.id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_posts_after_insert
AFTER INSERT ON posts
FOR EACH ROW
EXECUTE FUNCTION posts_after_insert();


-- select iterative
SELECT
    ROW_NUMBER() OVER (
        ORDER BY
            priority ASC,
            COALESCE(group_id, id) ASC, -- 루트 글 기준 그룹 null -> root 글 -> 자기 id  사용
            parent_id NULLS FIRST,  -- 루트 글 먼저
            group_order_id ASC,     -- 그룹 내 정렬 순서
            level ASC               -- 들여쓰기 깊이
    ) AS row_num,
    id,
    group_id,
    group_order_id,
    level,
    parent_id,
    priority,
    reply_count,
    title,
    content,
    created_at,
    updated_at,
    deleted_at
FROM posts
ORDER BY
    priority ASC,
    COALESCE(group_id, id) ASC,
    parent_id NULLS FIRST,
    group_order_id ASC,
    level ASC;