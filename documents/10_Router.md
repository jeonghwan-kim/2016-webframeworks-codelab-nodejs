Router
======

여기까지 잘 따라오셨습니다. 그런데 `app.js` 파일을 보면 거의 100줄이 되었습니다. 처음에 비해 코드가 많이 길어 졌는데요 이번에는 이 코드를 리펙토링 하는 것에 대해 알아보겠습니다.

"리펙토링"이란 코드의 기능은 그대로 유지하면서 가독성을 높이는 작업을 말하는 것입니다. 개발 전반에 걸쳐 리펙토링하는 것을 권장합니다.

"익스프레스는 크게 네 부분으로 나눌 수 있다"라고 한 것을 기억하세요?

* Application
* Request
* Response
* Router

처음 세 가지는 모두 설명했고 코드로 구현해 보았습니다. 마지막 라우터도 조금 다뤄 보긴했지만 여기서 좀더 자세히 살펴보도록 하겠습니다.


## 익스프레스의 Router

익스프레스 객체는 기본적으로 `get()`, `post()` 따위의 라우팅 설정 함수가 있습니다. 하지만 우리가 작성했던 방식으로 코드를 작성하게 되면 코드는 한 파일 안에서 길어지게 되고 결국 가독성이 떨어지게 될 겁니다. 익스프레스는 Router 클래스를 제공하는데요 이를 이용하면 라우팅 코드를 모듈화할 수 있습니다. 네 맞습니다. 노드의 모듈을 얘기하는 것이죠. 결국 라우팅 로직을 모듈화면 이를 `require()` 함수로 불러다 사용할 수 있는 장점이 있습니다.

간단히 라우팅 모듈을 제작하는 방법은 아래와 같습니다.

```javascript
const express = require('express');
const router = express.Router();

router.get('/users', (req, res) => {
  // ...
})

// delete, post ...

module.exports = router;
```

익스프레스 모듈의 `Router` 클래스로 객체를 만들어 `router` 상수에 할당합니다. 그리고 `router` 객체에서 제공하는 `get()`, `delete()`, `post()` 따위의 함수로 라우팅 로직을 구현합니다. 이것은 우리가 익스프레스 객체 `app`을 이용한 것과 매우 똑같습니다. 마지막으로 `module.exports`를 이용해 노드 모듈로 만들었습니다.


## User 라우팅 모듈 만들기

`api/users/index.js`에 라우팅 모듈을 만들어 보겠습니다. `app.js`에 있는 라우팅 코드 부분을 이쪽으로 옮깁니다. 그리고 `app` 상수를 모두 `router` 상수로 변경합니다. 바뀐 것은 이것 뿐입니다.

```javascript
const express = require('express');
const router = express.Router();
let users = [
  // ...
];

router.get('/users', (req, res) => {
  // ...
});

router.get('/users/:id', (req, res) => {
  // ...
});

router.delete('/users/:id', (req, res) => {
  // ...
});

router.post('/users', (req, res) => {
  // ...
});

module.exports = router;
```


## User 라우팅 모돌 사용하기

`app.js`에는 `user` 라우팅 코드가 없어졌습니다. 모두 `api/users/index.js` 파일로 모듈화 되어 이동되었기 때문이죠. 이제는 이 모듈을 `app.js`에서 불러와 사용해야 합니다. 자 여기서 중요한 것이 있습니다. 익스프레스 `Router` 클래스로 만든 User 모듈은 익스프레스의 미들웨어가 된 것입니다. 그렇기 때문에 익스프레스 객체 `app`은 `use()` 함수로 이 미들웨어를 사용할 수 있게 되었습니다. 아래 app.js 파일을 다시 보세요.

```javascript
app.use('/users', require('./api/user'));
```

간단하죠? 다른 미들웨어를 추가하는 것과 비슷합니다. 단 한가지 다른점은 파라매터가 두 개라는 것입니다. `use()`에서 파라매터를 두 개 사용하는 경우는 라우팅 모듈을 설정할때 그렇습니다. 위 코드의 의미는 "모든 리퀘스트중 경로가 '/users'로 시작되는 요청에 대해서는 두번째 파라매터로 오는 미들웨어가 담당하도록 한다" 입니다.

그러면 다시 `api/user` 모듈로 이동해 봅시다. `/users`로 들어오는 요청에 대해 이제는 경로 앞부분의 "/users"는 제외한 하위 경로로 설정해 주어야 합니다. `api/user/index.js` 파일을 변경하면 다음과 같습니다.

```javascript
const express = require('express');
const router = express.Router();
let users = [
  // ...
];

router.get('/', (req, res) => {
  // ...
});

router.get('/:id', (req, res) => {
  // ...
});

router.delete('/:id', (req, res) => {
  // ...
});

router.post('/', (req, res) => {
  // ...
});
```

```
git checkout router1
```


## 라우팅 컨트롤러 만들기

`app.js`에서 `api/user/index.js` 로 코드를 이동하면서 코드의 가독성을 높였습니다. `app.js`에는 익스프레스 설정에 관련된 코드만 있고 `api` 폴더에는 각 리소스 별로 (여기에서는 user 뿐이지만) 라우팅 로직이 들어있기 때문입니다.

하지만 여기서 만족할 순 없습니다. 한번 더 리펙토링을 하겠습니다. `api/user/user.controller.js` 파일을 만드세요.
그리고 index.js 에서 users 배열 선언 부분을 가져옵니다.

```javascript
let users = [
  // ...
];

exports.index = (req, res) => {
  // ...
};

exports.show = (req, res) => {
  // ...
};

exports.destroy = (req, res) => {
  // ...
};

exports.create = (req, res) => {
  // ...
};

```

`index()`, `show()`, `create()`, `destroy()` 라는 네 개 함수를 만들어 모듈로 만들었습니다. 이제 외부에서는 모듈을 `require()` 함수로 불러서 사용할 수 있습니다. 이 네 개의 함수는 네 개의 API와 연관된 것입니다.

* index(): GET /users
* show(): GET /users/:id
* delete(): DELETE /users/:id
* create(): POST /users

각 함수와 연결된 API의 로직. 그러니깐 `get()`, `delete()` 따위의 라우팅 함수 두번재 파라매터를 각각의 함수로 이동합니다. 그리고 이 컨트롤러 모듈을 `api/users/index.js` 파일에서 불러와 사용합니다.

```javascript
const controller = require('./user.controller');

router.get('/', controller.index);

router.get('/:id', controller.show);

router.delete('/:id', controller.destroy);

router.post('/', controller.create);
```

훨씬 간단해 졌죠?

지금까지 작성한 파일을 정리해 보면 다음과 같습니다.

* app.js: 익스프레스로 서버 설정 및 구동
* api/user/index.js: User API에 대한 라우팅 설정
* api/user/user.controller.js: User API에 대한 실제 로직

```
git checkout router2
```
