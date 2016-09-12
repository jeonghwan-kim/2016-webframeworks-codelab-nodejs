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

익스프레스를 사용하는 이유?

npm install epxress --save


## REST Api

rest api란 무엇인고?

REST Api 설계 사례 (twitter, facebook, 4sq)


## User APIs

### GET /users

curl -X GET 'localhost:3000/users' -v


### GET /users/:id

curl -X GET 'localhost:3000/users/1' -v


### DELETE /users/:id

curl -X DELETE 'localhost:3000/users/2' -v


### POST /users

npm i body-parser --save

curl -X POST 'localhost:3000/user/2' -d "name="bek" -v


### PUT /users/:id

curl -X PUT 'localhost:3000/users/1' -d "name=chris2" -v


## Routing

### Module

코드가 넘넘 길어 졌다. 정리하고 넘어가자.

모듈이란?
모듈의 사용법에 대한 모든 경우를 보여주자
...

User APIs를 모듈로 만들자.


### Router in Express

express.Router();

이것이 리펙토링 노하우!
1차 리펙토링: api/users/index.js
2차 리펙토링: api/users/user.controller.js


## Test


### mocha

npm install mocha --save-dev

mocha로 hello world
describe과 it


### supertest

npm i supertest --save-dev


### should

should를 사용하는 이유
https://github.com/shouldjs/should.js

npm i should --save-dev



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
