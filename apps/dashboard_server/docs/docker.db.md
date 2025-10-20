# Docker - database

## Setup

```bash
docker pull mysql:latest

docker run -p 3306:3306 \
    --name manageX_mysql_container \
    -e MYSQL_ROOT_PASSWORD=root \
    -e MYSQL_DATABASE=manageX \
    -d mysql

docker exec -i mysql-container mysql -uroot -proot \
    -e "CREATE DATABASE IF NOT EXISTS manageX; show databases;"
```

## Docker + Postgress

```sh
# check users
env | grep POSTGRES

# access
docker exec -it docker-postgres psql -U [username] -d [database_name]

# create a user
CREATE ROLE [username] WITH LOGIN SUPERUSER PASSWORD 'user_password';

# exit
\q

# access
docker exec -it docker-postgres psql -U vivir -d kcmw
```

POSTGRES_USER=root로 설정했기 때문에 postgres 롤은 생성되지 않는다.

접속 시 다음처럼 해야 한다:

```sh
docker exec -it docker-postgres psql -U root -d kcmw
```

또는

```sh
psql -h localhost -U root -d kcmw -W
```

postgres로 접속하려 하면 오류가 발생한다:

```sh
FATAL:  role "postgres" does not exist
```

이는 정상 동작이다. root가 기본 슈퍼유저가 되었기 때문이다.

만약 postgres 롤도 추가로 만들고 싶다면 root 계정으로 로그인 후:

```sh
CREATE ROLE postgres WITH LOGIN SUPERUSER PASSWORD 'your_password';
```

그 후:

```sh
psql -U postgres -d kcmw
```

끝.
