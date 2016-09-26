컨트롤러에 데이터베이스 연동
====================

Sequelize로 로컬에 구동중인 데이터베이스와 API 서버를 연결했습니다. 그리고 우리가 모델링한 테이블까지 데이터베이스 안에 만들었구요.

이제는 이 테이블에 데이터를 넣거나 조회하거나 삭제 그리고 업데이트하는 작업을 할 차례입니다. 이것은 CRUD 기능이라고 합니다. Create, Read, Update, Delete 기능을 얘기하는 것이지요. API의 기능이 이 데이터베이스의 데이터를 CRUD하는 것이라 보면 됩니다. 지금까지는 데이터를 users 배열에 넣어놓고 개발했는데 이제는 이것을 던져버리고 진짜 데이터베이스에 데이터를 사용합니다.


## Create

먼저 user 컨트롤러에서 models를 가져옵니다.

```javascript
const models = require('../../models');
```

테이블이 아직은 비어있기 때문에 먼저 테이블에 데이터를 넣는 `create()` 함수부터 건드려 보겠습니다.

```javascript
exports.create = (req, res) => {
  const name = req.body.name || '';
  if (!name.length) {
    return res.status(400).json({error: 'Incorrenct name'});
  }

  models.User.create({
    name: name
  }).then((user) => res.status(201).json(user))
};
```

name 파라매터를 검증하는 부분까지는 이전 코드와 같습니다. name 값이 확보되었다면 models 모듈을 이용해 테이블에 데이터를 추가하는 것이 남았습니다. `models.User` 객체는 CRUD에 해당하는 메소드 들을 제공하는데요 그중 `create()` 메소드는 테이블에 데이터를 추가하는 기능을 합니다. 파라매터로 넣은 데이터를 객체 형식으로 넘겨줍니다. name 컬럼에 name 상수값을 넣어줬습니다. 그리고 then함수가 동작하면 콜백함수의 user 파라매터로 테이블에 생성된 로우가 나옵니다. 이것을 요청한 클라이언트에 그대로 전달해 주면됩니다.


## Read

데이터를 조회하는 API 컨트롤러는 `index()`, `show()` 메소드가 있습니다.

`index()`는 모든 사용자 목록을 조회하는 것이기 때문에 테이블 전체데이터를 불러와야합니다.  `models.User` 객체의 `findAll()` 메소드를 사용하면 테이블의 전체 데이터를 불러올 수 있습니다.

```javascript
exports.index = (req, res) => {
  models.User.findAll()
      .then(users => res.json(users));
};
```

`show()`는 특정 사용자를 id로 조회하는 역할을 합니다. `models.User` 모델은 `findOne()` 함수로 조건을 줘서 데이터를 조회합니다. where라는 부분에 id 컬럼의 조건값을 설정하여 넘겨줍니다. 함수가 실행되면 콜백함수의 파라매터로 조회한 user 객체가 응답됩니다. 만약 user 값이 비어있다면 테이블에서 id에 해당하는 데이터를 찾지 못한 것입니다. 이 경우 404 상태코드로 응답합니다. 성공한경우에는 `json()` 함수로 응답해 줍니다.

```javascript
exports.show = (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (!id) {
    return res.status(400).json({error: 'Incorrect id'});
  }

  models.User.findOne({
    where: {
      id: id
    }
  }).then(user => {
    if (!user) {
      return res.status(404).json({error: 'No User'});
    }

    return res.json(user);
  });
};
```


## Delete

삭제할때는 `destroy()` 메소드를 사용합니다. id 기준으로 삭제하는 것이므로 where를 이용해 파라매터를 넘겨 줍니다.

```javascript
exports.destroy = (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (!id) {
    return res.status(400).json({error: 'Incorrect id'});
  }

  models.User.destroy({
    where: {
      id: id
    }
  }).then(() => res.status(204).send());
};
```

---
아래부터는 스킵

## Update

마지막 남은 것인 update 기능인데요 이것은 좀 특별하게 하려고 뒤로 미루었습니다. 테스트 코드를 먼저 작성하고 컨트롤러 함수를 만들것입니다. 잘 보세요. 이렇게 코딩하는 방법을 tdd 개발방법론이라고 한답니다. 테스트 코드를 api/user/user.spec.js에 추가해 볼께요

```javascript
describe('PUT /users/:id', () => {
  it.only('should return 200 status code', (done) => {
    request(app)
        .put('/users/1')
        .send({
          name: 'foo'
        })
        .end((err, res) => {
          if (err) throw err;
          done();
        });
  });
});
```

업데이트 api를 호출하면 200 상태 코드가 응답되는지 체크하는 코드입니다. 테스트를 돌려보면 당연히 실패가 나오겠죠?

```
npm test
.. 실패화면 ...
```

404 에러 메세지가 나오네요. 라우팅 설정을 하지 않았기 때문이죠. 그럼 이 테스트를 통과할수 있도록 코드를 추가해 보겠습니다. 먼저 api/user/index.js 파일에 해당 api에 대한 라우팅 설정을 추가합니다.

```javascript
router.put('/:id', controller.update);
```

PUT /users/:id 로 요청이 들어올 경우 update 컨트롤러 함수가 동작하도록 설정했습니다. api/user/user.controller.js 파일로 이동하고 update 함수를 정의합니다.

```javascript
exports.update = (req, res) => {
  res.send();
}
```

update() 함수에서는 요청이 들어오면 send() 함수를 이용해 200 상태코드만 응답하도록 변경하였습니다. 그리고나서 다시 테스트를 돌려보면 테스트에 통과합니다.

```
npm test
... 성공 ...
```

put api 에 200 성공코드가 응답괴었습니다.

```
git checkout sequelizeInCtrl
```
