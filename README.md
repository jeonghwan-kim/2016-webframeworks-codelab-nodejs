NodeJS로 API 서버 만들기
=====================

만들어볼 것

* 회원가입 API /users, Send email
* 로그인 API /auth
* 이미지 업로드 API /images


## Hello world by NodeJS

npm init

copy hello world

curl -X GET 'localhost:3000'

ECMAScript 2015: const, arrow function


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

...

User APIs를 모듈로 만들자.


### Router in Express

express.Router();

이것이 리펙토링 노하우!
1차 리펙톨링: api/users/index.js
1차 리펙토링: api/users/user.controller.js




## Test



## Database


## Image upload

##  
