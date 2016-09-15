NodeJS로 API 서버 만들기
=====================

만들어볼 것

* [x] 회원가입 API /users
* [ ] 로그인 API /auth
* [ ] 이미지 업로드 API /images
* [ ] email sending


## Nodejs에 대해
## Hello world by NodeJS
## Express
## REST Api
## User APIs
### GET /users
### GET /users/:id
### DELETE /users/:id
### POST /users

### PUT /users/:id (skip)
curl -X PUT 'localhost:3000/users/1' -d "name=chris2" -v

## Router

## Test
### mocha
### supertest
### should


## Database

mysql, sequelize

로컬에 데이터베이스를 구동하자.
mysql.server start

npm i sequelize mysql --save


### 디비를 컨트롤러에 붙이자.

### 환경의 분리. 테스트/개발/운영

디비를 분리


### 테스트 코드에 디비를 붙이자.

테스트 가능하도록 디비 싱크로직 분리
NODE_ENV=test 사용


## 폴더정리

한번더 리팩토링

/app: 서버 기능
  /api: api 로직을 담당
  /config: 서버가 구동하기 위한 환경 변수 정의 (상수)
  /models: 데이터베이스 모델링
/bin: 서버 구동을 위한 코드
  /www.js: 서버 구동
  /sync-database: 디비 싱크



## Image upload

##
