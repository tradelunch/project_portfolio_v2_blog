DROP TABLE IF EXISTS posts;

CREATE TABLE posts (
    post_id          BIGINT GENERATED ALWAYS AS IDENTITY primary key,          -- 고유 PK
    group_id        BIGINT NOT NULL,              -- 루트 글 ID (root면 자기 자신, 댓글이면 루트 seq_id)
    group_order_id  INT NOT NULL DEFAULT 0,       -- 동일 그룹 내 정렬 순서
    level           INT NOT NULL DEFAULT 0,       -- 들여쓰기 깊이 (root = 0)
    parent_id       BIGINT NULL,                  -- 바로 위 글번호, root이면 NULL

    priority        INT NOT NULL DEFAULT 100,
    title           VARCHAR(255) NOT NULL,
    content         TEXT,

    reply_count     INT NOT NULL DEFAULT 0,       -- 현재 글이 가진 총 자식 글 수

    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at      TIMESTAMP DEFAULT NULL,
    
    FOREIGN KEY (parent_id) REFERENCES posts(post_id) ON DELETE CASCADE
);

-- 그룹 단위 조회 최적화
CREATE INDEX idx_posts_group_id ON posts(group_id);

-- 부모별 정렬 조회 최적화
CREATE INDEX idx_posts_parent_order ON posts(parent_id, group_order_id);


-- 예시: 루트 글 삽입 후 group_id 업데이트
WITH new_post AS (
    INSERT INTO posts (group_order_id, level, parent_id, priority, title, content)
    VALUES (0, 0, NULL, 100, '루트 글 제목', '루트 글 내용')
    RETURNING post_id
)
UPDATE posts
SET group_id = post_id
FROM new_post
WHERE posts.post_id = new_post.post_id;


-- 부모 글 정보를 가져옴
SELECT post_id, group_id, level, reply_count
FROM posts
WHERE post_id = 1;  -- 부모 글 ID

-- 댓글 삽입
INSERT INTO posts (
    group_id,
    group_order_id,
    level,
    parent_id,
    priority,
    title,
    content
) VALUES (
    1,                        -- 부모 글의 루트 group_id
    0,                        -- 그룹 내 순서(step), 필요 시 계산
    1,                        -- 부모 level + 1
    1,                        -- parent_id = 부모 글 ID
    100,                      -- 우선순위
    '댓글 제목',
    '댓글 내용'
);


-- select
SELECT
    post_id,
    group_id,
    group_order_id,
    level,
    parent_id,
    priority,
    reply_count,
    title,
    content,
    created_at
FROM posts
ORDER BY
    group_id ASC,           -- 루트 글 그룹 기준
    parent_id NULLS FIRST,  -- 루트 글 먼저
    -- priority ASC,           -- 부모 내 우선순위
    group_order_id ASC,     -- 그룹 내 step 순서
    level ASC;              -- 들여쓰기 깊이


-- select with orw number
SELECT
    ROW_NUMBER() OVER (
        ORDER BY
            group_id ASC,           -- 루트 글 그룹 기준
            parent_id NULLS FIRST,  -- 루트 글 먼저
            group_order_id ASC,     -- 그룹 내 step 순서
            level ASC               -- 들여쓰기 깊이
    ) AS row_num,
    post_id,
    group_id,
    group_order_id,
    level,
    parent_id,
    priority,
    reply_count,
    title,
    content,
    created_at
FROM posts
ORDER BY
    group_id ASC,
    parent_id NULLS FIRST,
    group_order_id ASC,
    level ASC;