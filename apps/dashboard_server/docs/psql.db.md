# PSQL

## basic commands

PostgreSQL psql 주요 명령어 정리.

## **접속**

```sh
psql -U username -d dbname
psql "postgresql://username:password@host:5432/dbname"
```

## **종료**

```sh
\q
```

## **사용자/롤 관리**

```sh
\du                        -- 롤 목록 조회
CREATE ROLE user WITH LOGIN PASSWORD 'pw';
CREATE USER user WITH PASSWORD 'pw';
ALTER ROLE user WITH SUPERUSER;
ALTER ROLE user WITH PASSWORD 'newpw';
DROP ROLE user;
```

## **데이터베이스 관리**

```sh
\l                         -- 전체 DB 목록
\c dbname                  -- DB 전환
CREATE DATABASE dbname;
DROP DATABASE dbname;
```

## **테이블 및 스키마 관리**

```sh
\d                         -- 현재 스키마 테이블 목록
\d tablename               -- 테이블 상세 구조
\dn                        -- 스키마 목록
\dt                        -- 테이블 목록
\di                        -- 인덱스 목록
\dv                        -- 뷰 목록
```

## **SQL 실행**

```sh
SELECT * FROM table;
INSERT INTO table ...;
UPDATE table ...;
DELETE FROM table ...;
```

## **파일 실행 및 내보내기**

```sh
\i filename.sql            -- SQL 파일 실행
\o output.txt              -- 출력 리디렉션 시작
\o                         -- 출력 리디렉션 종료
\! command                 -- 쉘 명령 실행
```

## **데이터베이스 백업/복원(쉘)**

```sh
pg_dump -U user dbname > dump.sql
psql -U user dbname < dump.sql
```

## **기타 유틸**

```sh
\conninfo                  -- 현재 연결 정보
\password username         -- 비밀번호 변경
\encoding                  -- 인코딩 조회
\timing                     -- 쿼리 시간 측정 토글
```

끝.
