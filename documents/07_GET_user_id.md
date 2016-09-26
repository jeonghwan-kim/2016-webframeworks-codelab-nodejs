특정 사용자 조회 API
================

이번에는 특정 사용자를 조회하는 API를 만들어 볼 차례입니다. 사용자가 현제 3명인데요 어떻게 식별할 수 있을까요? 유저 객체를 다시 살펴봅시다. 유저 객체는 `id`와 `name`으로 구성되어 있습니다.

```javascript
{
  id: 1,
  name: "alice"
}
```

`name` 필드는 중복될수 있지만 `id`는 중복되지 않는 식별자 입니다. 우리가 그렇게 정의했기 때문입니다. 실제 데이터베이스 테이블에 저장될때도 `id`는 유일한 속성인 unique를 설정할 것입니다. 아직 데이터베이스를 다루지 않기 때문에 우리는 이 `id`에 대해 유일하다고 가정하고 진행할 것입니다.

그럼 클라이언트는 특정 사용자를 조회하는 요청을 서버에게 전달할 때 `id`도 함께 전달합니다. `id`가 1인 사용자 객체를 조회할 경우 서버는 `users`에 저장된 배열을 뒤져 `id`가 1인 객체를 클라이언트로 응답해 주면 되는 것이죠. 그럼 이번 API에 대한 라우팅 로직을 구현해 보겠습니다.


## 파라매터 설정하는 방법

클라이언트에서는 `id`가 1인 사용자를 조회할 경우 아래 주소로 서버에 요청할 수 있습니다.

```
GET /users/1
```

만약 id가 2인 사용자를 조회한다면 이렇게 표현할 수 있겠죠.

```
GET /users/2
```

주소의 뒷 부분만 id에 해당하는 값으로 변경합니다. 이것을 서버 라우팅 로직에서 설정해 주어야 합니다. 우선 서버 코드를 한 번 작성해 볼까요?

```javascript
app.get('/users/1', (req, res) => /* ... */);
```

서버에서 라우팅로직을 이렇게 설정하면 "GET /users/1"에 대한 요청을 처리할 수 있을 것입니다. 만약 `id`가 2인 요청을 처리하려면 또 API를 만들어야 할까요? 이런 방식으로 말이죠.

```javascript
app.get('/users/2', (req, res) => /* ... */);
```

그렇게 할 수는 있습니다. 하지만 이것은 효율적인 방법이 아닙니다. `id`값이 예측할 수 없을 만큼 변경가능하기 때문입니다. 그래서 익스프레스에서는 이러한 동적인 값을 라우팅에 설정할 수 있는 방법을 제공합니다. 다음과 같이 코드를 변경해 보세요.

```javascript
app.get('/users/:id', (req, res) => {
  console.log(req.params.id); // 사용자가 입력한 :id 값이 출력됨. (주의: 단 문자열 형식임 )
});
```

"/users/:id" 라는 문자열 형식으로 경로를 설정하면 요청 객체를 이용해 `req.params.id`로 클라이언트의 요청정보에 접근할 수 있습니다. 만약 사용자가 "GET /users/1" 로 요청한다면 `req.params.id`에는 "1"이라는 값이 들어가게 됩니다. 단, 주의할 것은 이 값이 숫자가 아닌 문자라는 것입니다. 클라이언트가 요청할때 서버로 오는 데이터는 전부 문자열 형식입니다. 기억하세요.


## 아이디로 유저 객체 검색

우선 클라이언트로부터 요청정보를 받는 것에는 성공했습니다. 이제는 `id`를 기반으로 서버에 있는 `users`배열을 뒤져 `id`가 일치하는 데이터를 찾아 요청한 클라이언트로 응답해주는 일만 남았습니다.

아이디로 `users` 배열을 검색하기 전에 `id` 값에 대한 처리가 남아 있습니다. 이 값이 숫자인지를 확인하는 겁니다. 숫자가 아닌 데이터는 유효하지 않기 때문이죠. 예를 들어 클라이언트가 "GET /users/alice" 라고 요청할 경우는 우리가 설정한 URL 규칙에 맞지 않습니다. 이러한 경우는 어떻게 처리할까요? 아래 코드를 봅시다.

```javascript
app.get('/users/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
});
```

`parserInt()` 함수로 `id` 문자열 값을 정수형으로 변경했습니다. 왜냐구요? `users` 배열에 있는 user 객체를 검색할 건데 검색 기준이 되는 값이 `id` 입니다. `users`에 있는 값은 숫자형 데이터인데 클라이언트가 요청한 데이터는 문자열이기 때문입니다. 정확한 검색을 위해 `id`를 문자열로 변경하는 것입니다.

`parserInt()`는 문자열을 숫자로 변경하는 과정에서 에러가 발생하면 `NaN`을 되돌려 주게 되어있습니다. 이것은 명백히 요청한 클라이언트 쪽의 실수라고 할 수 있는데요 서버는 이러한 요청에 대해서도 클라이언트에게 적절한 응답을 해줘야합니다. 우리가 REST API에서 공부한게 있죠. 바로 상태 코드(Status code)입니다. 클라이언트의 잘못된 요청에 대해 400번 상태코드를 응답하기로 한것을 기억하시나요? 이것을 코드로 구현하면 아래와 같습니다.

```javascript
app.get('/users/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (!id) {
    return res.status(400).json({error: 'Incorrect id'});
  }
});
```

`parseInt()` 결과가 `NaN`일 경우 `id`는 `NaN` 값이 들어가게 됩니다. `if` 조건문에서 `NaN`은 `false`와 동일합니다. 즉 `if (!Nan)`은 `if (!false)`와 동일한 조건문이 되는 결과인 셈이죠. `id`에 `NaN`이 할당되면 if 블록 안으로 진입하게 됩니다.

응답 객체인 `res`는 `json()` 함수 말고도 `status()` 함수를 제공합니다. 함수 이름으로도 알수 있듯이 상태코드를 설정하여 응답하는 기능입니다. 파라매터로 응답할 상태코드를 설정하면 됩니다.

그리고 나서 다시 `json()` 함수를 호출하는 부분이 보이시나요? 약간 어색할 수도 있는데요 이것을 함수 체이닝이라고 합니다. 제이쿼리를 사용해본 분이시라면 이러한 함수 체이닝 기법에 익숙하실 겁니다. 그렇지 않는 분들을 위해 함수 체이닝에 대해 간단히 설명해 보겠습니다.


## 함수체이닝

아래 코드를 한번 읽어 보세요. `User` 클래스를 만들고 클래스에 `greeting()`와 `introduce()` 메소드를 정의한 것입니다.

```javascript
function User(_name) {
  this.name = _name;
}

User.prototype.greeting = function() {
  console.log('Hello! ');
  return this;
};

User.prototype.introduce = function() {
  console.log(`I am ${this.name}`);
  return this;
};
```

각 메소드는 동일한게 this를 반환하도록 했습니다. 바로 아래 코드에서 함수 체이닝을 사용하기 위해서이지요.

```javascript
var chris = new User('chris');
chris.greeting().introduce();
```

클래스로 객체를 만들어 `chris` 변수에 저장했습니다. 그리고 `chris` 객체의 `greeting()` 함수를 호출했구요. `greeting()` 함수는 콘솔에 인사 문자열을 출력하고 나서 `this`를 리턴합니다. `this`는 `chris` 객체를 의미하죠. 그래서 곧바로 `introduce()` 메소드를 호출하는 것입니다. 이것을 함수 체이닝이라고 하는데 함수를 체인처럼 연결해서 사용하는 모습을 연상하시면 이해될 것입니다.


## 클라이언트로 응답

다시 우리 코드로 돌아옵니다. 클라이언트가 요청한 `id` 정보를 검증하였습니다. 이제 남은 것은 `users` 배열에서 `id`와 일치하는 user 객체를 찾는 일입니다. 자바스크립트 배열 메소드 중 `filter()` 함수를 사용해 보겠습니다.

코드 작성에 앞에 `filter()` 함수의 사용법에 대해 간단히 짚고 넘어가도록 하죠.


## filter()

필터함수는 배열의 각 요소를 점검하면서 어떠한 기준에 통과한 값들을 필터링해서 별도의 배열로 담는 역할을 합니다. `users` 배열에서 `filter()` 함수를 사용해 볼까요?

```javascript
let user = users.filter(user => {
  return user.id === id;
});
```

`users.filter()` 함수는 파라매터로 `users` 배열에 있는 요소를 순서대로 반환합니다. `users.filter(user => )` 코드에서 처음 `user`의 값은 `users` 배열의 첫번째 요소인 `{id: 1, name: 'alice'}` 객체가 됩니다. 이 객체의 `id` 값과 요청한 `id`값을 비교해서 같으면 참을 다르면 거짓을 반환하는 것이 다음 코드입니다.

참을 반환하면 현재 `user` 객체를 새로운 배열에 추가합니다. 만약 그렇지 않을 경우에는 무시하구요. 그러면 위 코드 결과 `user`에는 어떤 값이 들어갈까요? 바로 다음과 같은 배열이 담기게 됩니다.

```javascript
console.log(user); // [{id: 1, name: 'alice'}]
```

`users` 배열에서 `id` 가 1인 객체는 이것 뿐이니까요. 우리는 객체에 접근하기 위해 배열의 첫 번째 값만 가져 옵니다. 코드를 다음과 같이 변경하면 되지요.

```javascript
let user = users.filter(user => user.id === id)[0]
console.log(user); // {id: 1, name: 'alice'}
```


## 404 에러

만약에 `filter()` 함수로 검색에 실패할 경우는 어떻게 될까요? `filter()` 함수는 빈 배열(`[ ]`) 을 반환하게 될 것입니다. 그리고 빈 배열의 0번 인덱스에 접근하게되면 `undefined` 값이 리턴됩니다. 결국 `user` 변수에는 `undefined` 값이 저장되는 것이죠. 이러한 경우 REST API 규칙에 의해 404 상태코드를 클라이언트에게 알려 줘야 합니다. 왜냐하면 `id`에 해당하는 유저 데이터가 없기 때문입니다. 다음 코드를 추가하세요.

```javascript
app.get('/users/:id', (req, res) => {
  let user = users.filter(user => user.id === id)[0]
  if (!user) {
    return res.status(404).json({error: 'Unknown user'});
  }
});
```

## 성공 응답

여기까지 왔다면 찾은 `user` 객체를 클라이언트에게 제이슨 형식으로 응답하는 것만 남았습니다. 아래는 "GET /users/:id api"에 대한 전체 코드입니다. 한번 쭉 읽어보세요.

```javascript
app.get('/users/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (!id) {
    return res.status(400).json({error: 'Incorrect id'});
  }

  let user = users.filter(user => user.id === id)[0]
  if (!user) {
    return res.status(404).json({error: 'Unknown user'});
  }

  return res.json(user);
});
```


## API 테스트

지난 번과 마찬가지로 CURL을 이용해 API 테스트를 진행해 봅시다. 이번에는 -v 옵션을 추가해서 좀더 많은 정보를 살펴 보지요.

```
curl -X GET '127.0.0.1:3000/users/1' -v
*   Trying 127.0.0.1...
* Connected to 127.0.0.1 (127.0.0.1) port 3000 (#0)
> GET /users/1 HTTP/1.1
> Host: 127.0.0.1:3000
> User-Agent: curl/7.43.0
> Accept: */*
>
< HTTP/1.1 200 OK
< X-Powered-By: Express
< Content-Type: application/json; charset=utf-8
< Content-Length: 23
< ETag: W/"17-I7acqn1l5gkxSQFaJfegnw"
< Date: Wed, 14 Sep 2016 06:52:25 GMT
< Connection: keep-alive
<
* Connection #0 to host 127.0.0.1 left intact
{"id":1,"name":"chris"}%
```

전체 배열이 응답되는 대신에 하나의 객체만 응답되었죠? 그리고 그 객체의 `id`가 `1`인 것을 보니 요청한 데이터가 제대로 응답되는 것 같습니다.

서버에 없는 아이디를 요청하여 404 에러가 나는지도 확인해 보겠습니다.

```
curl -X GET 'localhost:3000/users/4' -v
*   Trying ::1...
* Connected to localhost (::1) port 3000 (#0)
> GET /users/4 HTTP/1.1
> Host: localhost:3000
> User-Agent: curl/7.43.0
> Accept: */*
>
< HTTP/1.1 404 Not Found
< X-Powered-By: Express
< Content-Type: application/json; charset=utf-8
< Content-Length: 24
< ETag: W/"18-4jVflJv5bJNWyjxLQo1wGQ"
< Date: Sun, 18 Sep 2016 01:24:40 GMT
< Connection: keep-alive
<
* Connection #0 to host localhost left intact
{"error":"Unknown user"}%
```

4번 아이디는 서버에 없기 때문에 404 Not Found 상태 코드가 응답 되었습니다. 그리고 우리가 설정한 에러 문자열 "Unknown user"가 바디에 응답 되었습니다.

그럼 id를 숫자가 아닌 "alice" 문자열을 설정해서 보내 보겠습니다.


```
curl -X GET 'localhost:3000/users/alice' -v
*   Trying ::1...
* Connected to localhost (::1) port 3000 (#0)
> GET /users/alice HTTP/1.1
> Host: localhost:3000
> User-Agent: curl/7.43.0
> Accept: */*
>
< HTTP/1.1 400 Bad Request
< X-Powered-By: Express
< Content-Type: application/json; charset=utf-8
< Content-Length: 24
< ETag: W/"18-wZEjFUvjngr0SgDR3EuSXg"
< Date: Sun, 18 Sep 2016 01:26:19 GMT
< Connection: keep-alive
<
* Connection #0 to host localhost left intact
{"error":"Incorrect id"}%
```

400 Bad Request 상태 코드와 "Incorrect id" 에러 문자열이 응답되었습니다. 모두 제대로 동작하는군요.

```
git checkout getUserById
```
