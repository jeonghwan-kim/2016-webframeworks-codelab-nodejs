테스트에 데이터베이스 연동하기
======================

Environment 모듈을 사용하여 기존코드를 변경해야합니다. Envrionemnt에는 데이터베이스 접속정보가 있는데이 부분은 models.js 파일을 수정하면됩니다. 아래 코드처럼 말이죠.

```javascript
const config = require('./config/environments');
const sequelize = new sequelize(
  config.mysql.database,
  config.mysql.username,
  config.mysql.password
)
```

environments 모듈은 NODE_ENV 환경변수 값에 따라 각각 다른 데이터베이스로 연결합니다.

그럼 api/user/user.spec.js 테스트 코드로 돌아가 봅시다. 모카에는 `before()`/`after()` 함수가 있습니다. 이것은 테스트가 실행되기 전/후에 각각 한 번씩 실행되는 함수입니다. `before()` 함수를 이용해 테스트 데이터베이스를 초기화하는 등의 테스트 환경을 만들어 줄수 있습니다. 아래 코드를 한 번 보세요.

```javascript
describe('GET /users', () => {
  before('sync database', () => {
    // sync data base ...
  });
  it('should return 200 status code', () => {
    //
  });
});
```

`it()` 함수가 실행되기 직전 `before()` 함수가 먼저 실행됩니다. `before()` 함수에서는 데이터베이스를 초기화할 수 있는 `sync({force: true})` 함수를 실행하면 되겠지요.


## sync-database 모듈

한편 app.js에서 `sync()` 함수를 사용하고 있는데 이것을 테스트에서도 따로 떼어 내기 위해서는 데이터를 싱크할수 있는 별도의 모듈로 떼어네는 것이 편리합니다.

bin/sync-databse.js 파일로 만들어 보겠습니다.

```javascript
const models = require('../models');

module.exports = () => {
  return models.sequelize.sync({force: true});
};
```

이 모듈은 데이터베이스를 싱크하는 매우 간단한 코드입니다.


## www.js

이참에 서버 구동하는 모듈도 별도로 만들어보지요. bin/www.js 파일을 만들어 보세요.

```javascript
const app = require('../app');
const port = 3000;
const syncDatabase = require('./sync-database');

app.listen(port, () => {
  console.log('Example app listening on port 3000');

  syncDatabase.().then(() => {
    console.log('Database sync');
  })
})
```

서버 구동로직을 옮겨왔으니 app.js 파일에서도 이부분을 제거해야겠죠. app.js의 남은 부분은 아래와 같습니다.

```javascript
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/users', require('./api/user'));

moduele.exports = app;
```

이제는 app.js가 아니라 bin/www.js 파일로 서버를 구동할수 있습니다. package.json의 start 스크립트도 변경해야겠죠.

```json
"start": "node bin/www"
```


## 테스트 데이터 구성

이제 테스트 코드의  `before()` 함수에서 데이터베이스 싱크 모듈을 불러와 실행해 봅시다.

```javascript
const syncDatabase = require('../../bin/sync-database');
describe('GET /users', () => {
  before('sync database', (done) => {
    syncDatabase().then(() => {
      done();
    });
  })

  it('should return 200 status code', () => {
    // ...
  });
})
```

그럼 실제 데이터베이스에 샘플데이터를 넣고 "GET /users" 를 테스트 해볼까요? 먼저 `before()` 함수에서 데이터베이스에 데이터 3개를 넣은는 코드를 작성합니다.

```javascript
const models = require('../../models');
describe('GET /users', () => {
  before('sync database', (done) => {
    syncDatabase().then(() => done());
  });

  const users = [
    {name: 'alice'},
    {name: 'bek'},
    {name: 'chris'}
  ];
  before('insert 3 users into database', (done) => {
    models.User.bulkCreate(users).then(() => done());
  });

  it('should return array', () => {
    // 기존 코드와 동일
  });
})
```

`before()` 함수는 여러개 실행할수 있는데요 전부 다 `it()` 함수가 호출되기 전에 실행이 완료됩니다.

두번째 `before()` 함수에서는 데이터베이스에 users 테이블에 있는 유저를 추가하는 역할을 합니다. sequelize 모델에는 `create()` 말고도 `bulkCrate()` 함수가 있습니다. `create()` 함수가 하나의 로우만 생성한다면 `bulkCreate()` 함수는 여러개 데이터를 배열로 받아 여러개 로우를 생성하는 함수입니다. 이렇게 샘플데이터를 테이블에 넣은 후 `it()`으로 API 테스트를 진행 할수 있습니다.


## 테스트 데이터 삭제

마지막으로 `after()` 함수를 이용해 데이터베이스를 초기화 합니다. 유저 데이터를 넣었기 때문에 다시 삭제하는 것이죠. 여기서는 간단히 데이터베이스 싱크를 돌리겠습니다.

```javascript
after('clear up database', (done) => {
  syncDatabase().then(() => done());
});
```


## 테스트 코드 실행

마지막으로 테스트를 실행해야 하는데요, 이번에는 NODE_ENV 환경변수를 설정해 주어야 합니다. 우리는 테스트 데이터베이스와 개발 데이터베이스를 분리했으니깐 테스트시에는 테스트 데이터베이스로 접속해야합니다. 테스트 실행시 "NODE_ENV=test"만 추가해주면 됩니다. package.json 파일을 수정하세요.

```json
"test": "NODE_ENV=test ./node_modules/.bin/mocha api/**/*.spec.js"
```

그리고 명령문에서 `npm test`로 테스트를 진행합니다.

```
npm test
... resutl ..
```

나머지 테스트 코드에서도 데이터베이스를 연결해보세요.

```
git checkout unitTestWithDb
```
