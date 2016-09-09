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

REST Api 란?
REST Api 설계 사례 (twitter, facebook, 4sq)


curl -X -v

express.Router();


## Test



## Database


## Image upload

##  
