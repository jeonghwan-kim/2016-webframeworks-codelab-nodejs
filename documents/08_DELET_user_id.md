특정 사용자 삭제 API
================

지난번에는 사용자 `id`로 사용자 객체를 조회하는 API를 만들었다면 이번엔 삭제하는 API를 만들어볼 차례입니다. API 주소는 아래와 같습니다.

```
DELETE /users/:id
```


## 라우팅 설정

메쏘만 GET에서 DELETE로 바뀌었고 뒤에 경로는 조회 API와 동일합니다.

라우팅 먼저 설정합시다. 그동안 익스프레스 객체 `app`의 `get()` 함수만 사용했는데 이것은 조회 API의 메소드가 GET 이었기 때문입니다. 삭제 API의 메소드인 DELETE을 설정하려면 `delete()` 함수를 사용해야겠지요. `delete()` 함수의 파라메터도 `get()` 함수와 같습니다. 첫번째 파라매터로 설정할 경로를 문자열로 넘겨줍니다.

```javascript
app.delete('/users/:id', (req, res) => /* ... */);
```

파라메터로 받은 `id`값에 대한 처리도 해야하는데 이미 "GET /users/:id" API를 만들면서 사용했습니다. 동일한 코드를 사용하면 됩니다.

```javascript
app.delete('/users/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (!id) {
    return res.status(400).json({error: 'Incorrect id'});
  }
});
```


## 삭제 로직 구현

잠깐 삭제 API의 로직을 생각해 봅시다. 먼저 유저 데이터를 담고 있는 `users` 배열에서 `id`에 해당하는 객체의 위치를 찾아야 되겠죠. 그리고 찾은 위치의 요소를 배열에서 제거하면 될 것입니다. 자바스크립트 배열 메소드 중에는 이러한 기능을 할수 있는 함수가 있는데 다음 두 가지 함수를 사용할 겁니다.

* `findIndex()`
* `splice()`


## 배열에서 삭제할 유저 찾기

`findIndex()`는 배열을 순회하면서 어떤 기준에 맞는 요소의 인덱스를 찾는데 사용합니다. `users`에서 요청한 `id`에 해당하는 객체가 있는 인덱스를 먼저 찾아야겠지요.

```javascript
const userIdx = users.findIndex(user => {
  return user.id === id;
});
```

앞에서 먼저 보았던 배열 메소드 `filter()`와 매우 유사하게 동작합니다. `findIndex()`는 배열의 각 요소를 순차적으로 돌면서 계산합니다. `users.findIndex(user, => )` 구문의 경우 처음 `user`는 `users` 배열의 첫 요소가 반환되어 나옵니다. 이 `user`에 대해 `id`값을 비교한 뒤 참을 반환하면 `users` 배열에서의 `user`가 있는 배열 인덱스가 반환됩니다. 결국 이 인덱스 정수값은 `userIdx` 상수에 저장되는 것이지요. 만약 `id` 비교 결과 거짓이 리턴되면 배열의 다음 요소가 `user` 변수에 할당되어 넘어옵니다.

만약 `findIndex()` 함수의 `id` 비교문이 전부 `false`를 반환하면 어떤 인덱스 값을 반환하게 될까요? 이 함수는 그거한 경우는 함수 동작의 실패로 판단하고 -1값을 반환합니다. 우리는 `userIdx`의 값이 -1일 경우 없는 유저라고 판단할수 있겠죠. 그럼 생각나는 것이 있죠? 바로 클라이언트에서 없는 유저라는 뜻의 404 상태코드를 응답해 주는 것입니다. 다음 코드를 보면 이해하시겠죠?

```javascript
if (userIdx === -1) {
  return res.status(404).json({error: 'Unknown user'});
}
```


## 배열에서 유저 객체 제거

드디어 배열로부터 삭제할 유저 객체의 인덱스를 찾았습니다. 배열에서 인덱스를 이용해 요소를 삭제하는 것은 매우 간단한 일인데요 바로 배열 매소드 중 `splice()` 함수를 사용하는 것입니다. 첫번째 파라매터로 삭제할 인덱스 숫자를 넘겨주고 두번째 파라매터에는 1을 넣어 줍니다. 1이라는 값은 첫번째 파라매터를 포함하여 그 다음 요소 몇개를 삭제하느냐는 의미입니다. 우리는 1개만 삭제하기 때문에 1을 넘겨주는 겁니다.

```javascript
users.splice(userIdx, 1);
```


## 응답

서버쪽에서 데이터를 다루는 작업은 모두 마쳤습니다. 이제 남은것은 요청한 클라이언트에게 뭔가 응답해 줘야합니다. 사용자를 조회할때는 조회한 사용자 객체를 응답했는데 삭제의 경우는 삭제된 데이터를 보내줄 수도 없는 일입니다. 보통 두 가지 방법이 있습니다.

첫번째는 삭제된 후 전체 `users` 배열을 다시 응답하는 방법입니다. 클라이언트 입장에서는 응답으로 온 `users` 배열을 확인하면 요청한 데이터가 삭제되었는지 확인할 수 있기 때문입니다.

두번째 방법은 아무 데이터도 보내지 않는 것입니다. 여기서 우리는 REST API 의 상태코드를 사용할 수 있는데요 바로 "No Content"를 뜻하는 204 상태코드를 응답하는 것입니다.

여기서는 후자의 방법을 사용하겠습니다. 응답을 포함한 전체 코드는 아래를 참고하세요.

```javascript
app.delete('/users/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (!id) {
    return res.status(400).json({error: 'Incorrect id'});
  }

  const userIdx = users.findIndex(user => user.id === id);
  if (userIdx === -1) {
    return res.status(404).json({error: 'Unknown user'});
  }

  users.splice(userIdx, 1);
  res.status(204).send();
});
```


## API 테스트

curl를 이용해서 삭제 api를 테스트 해보겠습니다.

```
curl -X DELETE '127.0.0.1:3000/users/1' -v
*   Trying 127.0.0.1...
* Connected to 127.0.0.1 (127.0.0.1) port 3000 (#0)
> DELETE /users/1 HTTP/1.1
> Host: 127.0.0.1:3000
> User-Agent: curl/7.43.0
> Accept: */*
>
< HTTP/1.1 204 No Content
< X-Powered-By: Express
< Date: Wed, 14 Sep 2016 06:48:51 GMT
< Connection: keep-alive
<
* Connection #0 to host 127.0.0.1 left intact
```

204 상태 코드가 응답되었습니다. GET API와는 다르게 바디가 비어있는 채로 왔습니다. 실제 삭제 되었는지 조회 API를 호출해 보죠.

```
curl -X GET '127.0.0.1:3000/users/1' -v
*   Trying 127.0.0.1...
* Connected to 127.0.0.1 (127.0.0.1) port 3000 (#0)
> GET /users/1 HTTP/1.1
> Host: 127.0.0.1:3000
> User-Agent: curl/7.43.0
> Accept: */*
>
< HTTP/1.1 404 Not Found
< X-Powered-By: Express
< Content-Type: application/json; charset=utf-8
< Content-Length: 24
< ETag: W/"18-4jVflJv5bJNWyjxLQo1wGQ"
< Date: Wed, 14 Sep 2016 06:50:08 GMT
< Connection: keep-alive
<
* Connection #0 to host 127.0.0.1 left intact
{"error":"Unknown user"}%
```

`id`가 1인 유저를 조회했을 때 404 상태코드가 응답되었습니다. 그리고 바디에는 애러 문자열이 들어있네요. 전체 데이터를 조회해 볼까요?

```
curl -X GET '127.0.0.1:3000/users' -v
[{"id":2,"name":"tim"},{"id":3,"name":"daniel"}]%
```

`id`가 1인 데이터는 안보이네요. 삭제 API가 제대로 동작하는것을 확인했습니다.

```
git checkout deleteUserById
```
