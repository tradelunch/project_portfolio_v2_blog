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
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at      TIMESTAMP DEFAULT NULL
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
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at      TIMESTAMP DEFAULT NULL
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
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at      TIMESTAMP DEFAULT NULL
);

-- ===========================
-- TAGS TABLE
-- ===========================
CREATE TABLE tags (
    id              BIGSERIAL PRIMARY KEY,
    name            VARCHAR(50) UNIQUE NOT NULL,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at      TIMESTAMP DEFAULT NULL    
);

-- ===========================
-- POST_TAGS (many-to-many)
-- ===========================
CREATE TABLE post_tags (
    post_id         BIGINT NOT NULL,
    tag_id          BIGINT NOT NULL,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at      TIMESTAMP DEFAULT NULL,    
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


-- ===========================
-- categories TABLE
-- ===========================
-- CREATE TABLE categories (
--     id          BIGSERIAL PRIMARY KEY,
--     name        VARCHAR(100) NOT NULL,
--     parent_id   BIGINT REFERENCES categories(id) ON DELETE CASCADE,
--     root_id     BIGINT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
--     level       INT NOT NULL DEFAULT 0,
--     UNIQUE(name, parent_id)
-- );

CREATE TABLE categories (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    parent_id   BIGINT NOT NULL,
    root_id     BIGINT NOT NULL,
    level       INT NOT NULL DEFAULT 0,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at      TIMESTAMP DEFAULT NULL,
    UNIQUE(name, parent_id)
);

-- 인덱스
CREATE INDEX idx_categories_parent_id ON categories(parent_id);
CREATE INDEX idx_categories_root_id ON categories(root_id);
CREATE INDEX idx_categories_level ON categories(level);


-- ===========================
-- post_categories TABLE
-- ===========================
-- CREATE TABLE post_categories (
--     post_id     BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
--     category_id BIGINT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
--     PRIMARY KEY (post_id, category_id)
-- );
CREATE TABLE post_categories (
    post_id     BIGINT NOT NULL,
    category_id BIGINT NOT NULL,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at      TIMESTAMP DEFAULT NULL,    
    PRIMARY KEY (post_id, category_id)
);

CREATE INDEX idx_post_categories_category_id ON post_categories(category_id);
CREATE INDEX idx_post_categories_post_id ON post_categories(post_id);