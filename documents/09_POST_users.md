사용자 생성 API
============

유저 삭제 API를 만들었으니 반대로 유저 추가 API를 만들어볼 차례입니다. API 주소는 아래와 같습니다.

```
POST /users
```


## 라우팅 설정

익스프레스 객체의 함수중 `get()`과 `delete()`을 사용했는데요 이번에는 `post()` 함수를 사용해야겠죠. 이제는 메소드에 따라 어떤 함수를 사용해야할지 감이 오지 않습니까? 저는 그렇습니다. `post()` 함수로 POST 메소드임을 설정합니다. 그리고 첫번째 파라매터로 경로를 문자열로 넘겨 줍니다.


```javascript
app.post('/users', (req, res) => /* ... */);
```


## 요청 바디 (body)

HTTP 요청에 사용되는 데이터는 두 가지 방법이 있습니다.

* 쿼리문자열 (Query string)
* 바디 (Body)

쿼리문자열은 url에 포함되어 있는 키/밸류 쌍의 값을 의미합니다. 당장 구글 검색 페이지를 열어서 "chris"라고 검색해보세요. 브라우져 주소창에 아래와 비슷한 주소가 있을 겁니다.


```
https://www.google.co.kr/#newwindow=1&q=chris
```

좀 상세하게 들여다 보죠. `https` 부분을 프로토콜이라고 합니다. 그 뒤에 `www.google.co.kr` 부분을 도메인이라고 합니다. 그 뒤에 따라오는 `/#newwindow=1` 부분을 경로라고 합니다. 마지막 으로 `&q=chris`  부분을 "쿼리 문자열""이라고 합니다. 브라우져가 서버로 뭐가 요청할때 `q=chris`라는 형식으로 요청하는 것입니다.

한편 바디라는 형식으로 요청 데이터를 보낼 수 있는데요 웹 브라우져로는 확인하기 어렵습니다. 바디 데이터는 POST 메소드일 경우에만 유효하기 때문이죠. 웹 페이지의 폼을 서버로 보낼때 이 요청 바디를 종종 사용하곤 합니다.


## body-parser

익스프레스에 요청 바디의 데이터에 접근하기 위해서 [body-parser](https://github.com/expressjs/body-parser)라는 패키지를 추가해야 합니다. body-parser를 프로젝트에 추가합니다.

```
npm i body-parser --save
```

바디 파서는 미들웨어입니다. 따라서 `app.js`에 있는 익스프레스 객체에 이 미들웨어를 추가해서 사용할 수 있죠. 미들웨어를 추가할 때 사용하는 익스프레스 객체의 함수가 뭐라고 했는지 기억 나시나요? 바로 `use()` 함수입니다. 바디 파서를 `use()` 함수로 추가해 봅시다.

```javascript
const bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
```

이 설정 코드에 대한 설명을 별도로 하지 않겠습니다. 궁금하신 분들은 [여기](#)를 읽어 보세요.


## 파라매터 검증

비로소 우리 코드에서 요청 바디에 접근할수 있게 되었습니다. 어떻게 접근하냐구요? `id` 파라매터에 접근하는 방법과 유사합니다. 바로 `req.body` 를 통해서 바디 값에 접근할 수 있죠. 클라이언트가 요청시 바디에 `name="chris"`라는 형식으로 요청한다고 생각해 보세요. 그럼 서버에서는 `req.body.name="chris"` 형식으로 데이터가 전송됩니다.

```javascript
app.post('/users', (req, res) => {
  const name = req.body.name || '';
});
```

`name` 상수에 `req.body.name`을 할당하는 코드를 작성했습니다. 하지만 만약에 이 값이 `undefined`가 될수 있는데요, 클라이언트가 요청시 `name` 값을 입력하지 않은 경우입니다. 그러한 경우에는 빈 문자열을 `name` 상수에 넣도록 했습니다.

클라이언트가 `name` 값을 입력하지 않은 경우에 서버는 어떻게 응답해야 할까요? 바로 "400 Bad Request" 응답 코드를 보내 줄 수 있어야 합니다. 아래 코드를 보세요.

```javascript
if (!name.length) {
  return res.status(400).json({error: 'Incorrenct name'});
}
```

`req.body.name`의 값이 없을 경우 상수 `name`에는 길이가 0인 문자열(`""`)이 들어가게 됩니다. 이것은 `if (!name.length)` 조건문을 통과하여 if 블록에 집입하게 되는 것이죠. 결국 요청한 클라이언트에게는 400 응답코드와 에러 메세지를 던져 줍니다.


## 새로운 아이디 만들기

요청한 파라매터 `name`이 제대로 입력 되었다면 다음 할일은 새로운 유저 객체를 만드는 것입니다. 유저객체는 `id`와 `name`으로 구성되어 있는데요 방금 `name`은 요청 바디를 통해 얻었습니다. 남은 것이 `id` 인데요 이것을 얻으려면 기존에 있는 `id`와 중복되지 않은 값을 사용해야 합니다. 저는 기존에 있는 `id`중 가장 큰 값보다 1 더큰 값을 `id`로 만들 생각이에요. 이번에도 자바스크립트 배열에서 제공하는 메소드를 사용할 것입니다. 바로 `reduce()` 함수입니다.

`reduce()` 함수는 배열의 각 요소를 순회하면서 어떤 누적데이터를 만들어 내는 기능을 합니다. 직접 사용하는 것을 살펴 보면서 이해해 보도록 하죠.

```javascript
const id = users.reduce((maxId, user) => {
   return user.id > maxId ? user.id : maxId
 }, 0);
```

`reduce()` 함수는 첫번째 함수를 파라매터로 넘겨주는데 이 함수는 두 개의 파라매터를 갖습니다. 첫번째 파라매터로 `maxId`라고 이름한 것은 우리가 `reduce()` 함수가 종료될 때 얻게될 값을 저장하고 있습니다. 두번째 파라매터는 배열 `users`의 각 요소를 순서대로 반환해 주는 유저 객체입니다. 그리고 `reduce()` 함수의 두번째 파라매터로 `0`을 넘겨줬는데 이는 `maxId`의 초기 값이죠.

예를 들어 `users.reduce(maxId, user) => {  }, 0);` 구문이 처음 실행될때 `maxId` 값은 `0`이 되고 `user`는 `users` 배열의 첫번째 요소가 됩니다.

코드의 두번째 줄을 살펴 보죠. 어떤 값을 반환하고 있는데요 이 값은 다음 반복문에서 `maxId` 값이 되는 것입니다. 리턴되는 코드를 봅시다. 삼항 연산자를 사용했는데요 아래 코드와 같다고 보시면 됩니다.

```javascript
if (user.id > maxId) {
  return user.id;
} else {
  return maxId
}
```

풀어 놓고 보니 훨씬 이해하기 쉽죠? 삼항연산자 코드도 익숙해 지면 굉장히 편리하답니다.

결국 `id` 상수에는 `users` 배열에 있는 `id` 값 중 가장 큰 값이 들어 들어갈 것입니다. 우리는 새로운 `id`를 만들 것이기 때문에 이 값보다 1 큰값으로 `id` 상수를 만들겠습니다. `reduce()` 함수 바로뒤에 `+ 1` 코드 보이시죠?

```javascript
const id = users.reduce((maxId, user) => {
   return user.id > maxId ? user.id : maxId
 }, 0) + 1;
```


## 배열에 유저 추가하기

새로운 아이디와 이름 값을 획득했으니 이를 이용해 새로운 유저를 만들어 보겠습니다. 객체 표현법으로 새로운 유저를 `newUser` 상수에 할당합니다.

```javascript
const newUser = {
  id: id,
  name: name
};
```

그리고 기존 `users` 배열에 새로운 유저를 추가합니다. 이로서 서버에 새로운 유저 데이터가 추가 되었습니다.

```javascript
users.push(newUser);
```


## 응답

마지막으로 서버는 요청한 클라이언트에게 응답을 보내야합니다. 어떤 데이터를 보내야할까요? 새로 만든 유저 데이터를 보내는 것이 합당해 보입니다. 그리고 또 한가지! 상태코드를 보내는데 "201 Created" 코드를 보내는 것이 REST API 형식을 따르는 것입니다. 이 둘을 코드로 표현하면 아래와 같죠.

```javascript
return res.status(201).json(newUser);
```

함수 체이닝을 이용해 한 줄로 간단히 작성했습니다.


## API 테스트

CURL을 이용해 API 테스트를 해보겠습니다.

```
curl -X POST '127.0.0.1:3000/users' -d "name=daniel" -v
*   Trying 127.0.0.1...
* Connected to 127.0.0.1 (127.0.0.1) port 3000 (#0)
> POST /users HTTP/1.1
> Host: 127.0.0.1:3000
> User-Agent: curl/7.43.0
> Accept: */*
> Content-Length: 11
> Content-Type: application/x-www-form-urlencoded
>
* upload completely sent off: 11 out of 11 bytes
< HTTP/1.1 201 Created
< X-Powered-By: Express
< Content-Type: application/json; charset=utf-8
< Content-Length: 24
< ETag: W/"18-SLbLW/4ZmHsU9Ou8ybsNBQ"
< Date: Wed, 14 Sep 2016 08:17:14 GMT
< Connection: keep-alive
<
* Connection #0 to host 127.0.0.1 left intact
{"id":4,"name":"daniel"}%
```

`-d` 옵션을 이용해 요청 바디를 보냈습니다. "daniel" 이란 이름의 유저를 생성하라고 요청한 것입니다. 201 상태코드가 응답되었고 새로운 id가 4인 유저객체가 응답되었습니다. 그럼 "GET /users/4"로 확인해 보겠습니다.

```
curl -X GET '127.0.0.1:3000/users/4'  -v
*   Trying 127.0.0.1...
* Connected to 127.0.0.1 (127.0.0.1) port 3000 (#0)
> GET /users/4 HTTP/1.1
> Host: 127.0.0.1:3000
> User-Agent: curl/7.43.0
> Accept: */*
>
< HTTP/1.1 200 OK
< X-Powered-By: Express
< Content-Type: application/json; charset=utf-8
< Content-Length: 24
< ETag: W/"18-SLbLW/4ZmHsU9Ou8ybsNBQ"
< Date: Wed, 14 Sep 2016 08:18:41 GMT
< Connection: keep-alive
<
* Connection #0 to host 127.0.0.1 left intact
{"id":4,"name":"daniel"}%
```

GET 요청으로 새로만든 id가 4인 유저를 조회할 수 있습니다. 제대로 동작합니다.


```
git checkout postUser
```
