SELECT 
    Seq,
    Ref,
    Lev,
    Step,
    Pseq,
    글번호,
    원글번호,
    Reply,
    정렬순서,
    답변갯수
FROM posts_table
ORDER BY Ref ASC, 원글번호 ASC, Step ASC, Lev ASC;



DROP TABLE IF EXISTS posts;
CREATE TABLE posts (
    seq            BIGSERIAL PRIMARY KEY,        -- 내부 PK, 자동 증가 (자동 증가 열)
    ref            INT NOT NULL DEFAULT 0,       -- 게시판 구분 또는 그룹 ID
    lev            INT NOT NULL DEFAULT 0,       -- 깊이(level)
    step           INT NOT NULL DEFAULT 0,       -- 동일 그룹 내 순서
    pseq           BIGINT DEFAULT 0,             -- 부모 글 번호
    글번호          BIGINT GENERATED ALWAYS AS IDENTITY UNIQUE,  -- 논리적 게시글 번호 (auto increment)
    원글번호         BIGINT DEFAULT 0,            -- 루트(최상위 글 번호)
    reply          TEXT DEFAULT NULL,            -- 경로 문자열 (예: 1:X+1:Y+1)
    정렬순서         INT DEFAULT 0,               -- 정렬용 별도 숫자
    답변갯수         INT DEFAULT 0,               -- 자식(답변) 수
    title          VARCHAR(255) NOT NULL,
    content        TEXT,
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

parent_id is NULL -> post itself else 댓글

seq_id: 
group_id: 최상위 글번호 if root, itself seq_id, else root post seq id 
group_order_id: 동일 그룹 내 정렬 순서  step
level: 들여쓰기 길이 root 0, else parent level + 1 
parent_id: 바로 위 글번호
reply_count: 현재 글이 가지는 total 자식 글 숫자
