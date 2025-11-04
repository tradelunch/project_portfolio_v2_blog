DROP TABLE IF EXISTS posts CASCADE;

CREATE TABLE posts (
    id          BIGINT GENERATED ALWAYS AS IDENTITY primary key,          -- 고유 PK
    group_id        BIGINT,                         -- 루트 글 ID (root면 자기 자신)
    group_order_id  INT DEFAULT 0,                  -- 그룹 내 순서
    level           INT DEFAULT 0,                  -- 깊이 (root = 0)
    parent_id       BIGINT NULL,                    -- 부모 글 ID
    priority        INT NOT NULL DEFAULT 100,
    
    reply_count     INT DEFAULT 0,                  -- 자식 글 수
    title           VARCHAR(255) NOT NULL,
    content         TEXT,

    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at      TIMESTAMP DEFAULT NULL,    
    FOREIGN KEY (parent_id) REFERENCES posts(id) on delete cascade
);


-- group_id 기준 조회 최적화
CREATE INDEX idx_posts_group_id ON posts(group_id);


WITH RECURSIVE post_tree AS (
    -- 1️⃣ 루트 글 선택
    SELECT
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
        deleted_at,
        LPAD(id::text, 10, '0') AS path
    FROM posts
    WHERE parent_id IS NULL

    UNION ALL

    -- 2️⃣ 댓글 선택
    SELECT
        p.id,
        p.group_id,
        p.group_order_id,
        p.level,
        p.parent_id,
        p.priority,
        p.reply_count,
        p.title,
        p.content,
        p.created_at,
        p.updated_at,
        p.deleted_at,
        pt.path || '.' || LPAD(p.seq_id::text, 10, '0') AS path
    FROM posts p
    JOIN post_tree pt ON p.parent_id = pt.seq_id
)
SELECT
    ROW_NUMBER() OVER (ORDER BY path, priority ASC) AS row_num,
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
FROM post_tree
ORDER BY path, priority ASC;