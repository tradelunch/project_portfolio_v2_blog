# database schema
-- ===========================
-- USERS TABLE
-- ===========================
CREATE TABLE users (
    id              BIGSERIAL PRIMARY KEY,
    username        VARCHAR(50) UNIQUE NOT NULL,
    email           VARCHAR(255) UNIQUE NOT NULL,
    password_hash   VARCHAR(255), -- nullable
    provider        VARCHAR(50) DEFAULT 'google', -- ex: google, github, apple
    provider_id     VARCHAR(255) UNIQUE, -- external id from oauth
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===========================
-- POSTS TABLE
-- ===========================
CREATE TABLE posts (
    id              BIGSERIAL PRIMARY KEY,
    user_id         BIGINT NOT NULL,
    title           VARCHAR(255) NOT NULL,
    content         TEXT NOT NULL,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===========================
-- FILES TABLE
-- ===========================
CREATE TABLE files (
    id              BIGSERIAL PRIMARY KEY,
    user_id         BIGINT NOT NULL,
    post_id         BIGINT,
    filename        VARCHAR(255) NOT NULL,
    content_type    VARCHAR(100),
    file_size       INTEGER,
    storage_path    TEXT NOT NULL,
    uploaded_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===========================
-- TAGS TABLE
-- ===========================
CREATE TABLE tags (
    id              BIGSERIAL PRIMARY KEY,
    name            VARCHAR(50) UNIQUE NOT NULL
);

-- ===========================
-- POST_TAGS (many-to-many)
-- ===========================
CREATE TABLE post_tags (
    post_id         BIGINT NOT NULL,
    tag_id          BIGINT NOT NULL,
    PRIMARY KEY (post_id, tag_id)
);

-- ===========================
-- INDEXES
-- ===========================
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_provider_id ON users(provider_id);
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_files_user_id ON files(user_id);
CREATE INDEX idx_files_post_id ON files(post_id);
CREATE INDEX idx_post_tags_tag_id ON post_tags(tag_id);
CREATE INDEX idx_post_tags_post_id ON post_tags(post_id);