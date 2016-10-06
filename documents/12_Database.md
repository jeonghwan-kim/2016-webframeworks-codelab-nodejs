데이터베이스 연동
===============

자 드디어 데이터베이스를 붙일 차례가 왔습니다. 벡엔드 구조에 대해 설명한 부분을 기억할수 있겠어요? 바로 이 모습.

```
┌───────┐               ┌───────┐                ┌────────┐
│Client │ -- (HTTP) --> │Server │ -- (Query) --> │Database│
└───────┘	              └───────┘                └────────┘
```

지금까지 했던 작업을 Client, Server, Database 중에 Sever 부분을 만들었습니다. Client에서 요청하는 것은 CURL을 사용하거나 모카 테스트로 진행했구요.

남은 것은 가장 오른쪽에 있는 Database 부분입니다. 벡엔드에서 데이터베이스를 직접 만드는 것은 아닙니다. 다양한 데이터베이스 프로그램이 있는데 그중 MySQL을 사용할 것입니다. MySQL을 우리 컴퓨터에 개발용으로 설치하고 Server에서는 단지 데이터베이스에 연결하는 것입니다.


## MySQL

그럼 우선 MySQL을 내 컴퓨터에 설치해야합니다. OSX에서 MySQL을 설치하는 방벙은 간단합니다. Homebrew를 이용하는 것입니다. Homebrew는 OSX용 패키지 관리 툴입니다. 리눅스의 APM, YUM 같은 툴이죠.

```
brew install mysql
```

Homebrew가 없다면 아래 명령어로 Homebrew 부터 설치하세요. ([참고](http://brew.sh/)))

```
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

MySql을 설치한 뒤 서버를 구동해야합니다. MySQL 서버를 데몬이라고도 하는데 리눅스에서 말하는 "데몬", 혹은 "서비스"와 같은 것입니다. 서버에서 백그라운드에서 실행중인 프로세스를 데몬이라고 합니다. 로컬에서도 개발용으로 MySQL 데몬을 실행해야 합니다. 방법은 간단합니다. 설치한 mysql 명령어를 이용합니다.

```
mysql.server start
```

반대로 서버를 종료할때는 stop 명령어를 사용합니다.

```
mysql.server stop
```

MySQL 서버를 로컬 컴퓨터에 구동했다면 이제 구동중인 MySQL 서버에 접속해 봐야합니다. 역시 mysql 명령어로 접속합니다.

```
mysql -u root -h localhost -p
```

mysql 명령어의 -u 옵션은 서버 접속 계정을 넣을때 사용하는데 기본 값인 root를 사용했습니다. -h 옵션은 서버 접속 주소를 설정하는 옵션인데 우리는 로컬 컴퓨터에 구동중인 mysql 서버에 접속하므로 localhost를 사용했습니다. 마지막 -p 옵션을 비밀번호를 입력하기 위한 기능입니다. 위 명령어를 실행하면 비밀번호를 입력하도록 하는데 root를 입력하고 접속합니다. 그럼 다음과 같이 mysql 프롬프트로 진입합니다.

```
mysql>
```

간단한 명령어를 보겠습니다. msyql 서버에 있는 데이터베이스 목록을 조회하려면 다음 명령어를 실행해 보세요.

```
mysql> SHOW DATABASES;
```

우리는 node_api_codelab 이란 데이터베이스를 만들건데요 먼저 이 이름으로 데이터베이스를 하나 생성하겠습니다. mysql 프로프트에서 명령어를 입력할때 마지막에 반드시 세미콜론(;)를 추가해야합니다. 그래야만 mysql은 하나의 명령문인 것을 인지하고 실행할 수 있습니다.

```
mysql> CREATE DATABASE node_api_codelab;
```

하나 만들었으면 이제 다시 `SHOW DATABASES;` 로 방금 만든 데이터베이스를 확인합니다. 그리고 이 데이베이스를 선택합니다. 생성한 데이터베이스를 선택할 때는 `USE` 명령어를 사용합니다.

```
mysql> USE node_api_codelab;
```

MySQL 데이터베이스 안에는 테이블이 있습니다. 이 테이블 안에 실제 데이터가 저장되는 것이죠. 우리는 API를 만들때 User에 대한 API들을 만들었습니다. User를 생성하는 API를 만들 때를 떠올려 보세요. 우리는 id와 name이라는 것을 만들었었죠. 이제 user 테이블을 만들어 보겠습니다.

아니요. 여기서부터는 mysql 명령어를 사용하지 않아도 됩니다. 노드 코드 작성하는것도 버거운데 mysql 코드를 작성한다는 것은 쉬운 일이 아니죠.


## Sequelize

노드 코드에서 MySql에 접속해서 이런 저런 쿼리문을 실행할 때는 노드 코드로 만든 mysql 패키지가 필요합니다. 그것이 node-mysql입니다. 이것을 우리 프로젝트에 추가해서 쿼리문을 직접 실행시킬수 있죠. 방금 했던것 처럼 `CREATE TABLE Users;` 같은 명령문을 말이죠. 하지만 여전히 쿼리문을 작성한다는 것은 지금은 버거운 일이에요. 그렇죠?

그래서 나온것이 **ORM(Object Relational Mapping)** 이라는 것입니다. ORM을 사용하게 되면 쿼리문을 모르더라도 자신이 사용하는 프로그래밍 언어로 데이터베이스에 명령을 내릴수 있습니다. 노드에는 Sequelize 라는 ORM 라이브러리가 있습니다.

npm으로 Sequelize 를 먼저 설치해 보죠.

```
npm i sequelize --save
```


## Model

모델이라는 용어를 들어 보셨나요? 서버에서 하나의 자원을 정의할 때 그것을 모델이라고 합니다. 우리는 지금까지 User 라는 자원을 사용했습니다. 이것이 User 모델입니다. 모델은 데이터베이스의 테이블과 1:1 매칭된다고 보시면 됩니다. 그러면 데이터베이스에 User 테이블이 있어야 합니다. User 테이블을 만들기 위해, 다시 말하면 User 모델을 만들기위해 Sequelize의 도움을 받아야합니다.

모델을 만드는 역할을 하는 `models.js` 파일을 만들어 봅니다.
app.js 와 동일한 디렉토리에 `models.js` 파일을 생성한 후 아래 내용을 적어주면 됩니다.

```javascript
const Sequelize = require('sequelize');
const sequelize = new Sequelize('node_api_codelab', 'root', 'root')
```

sequelize 모듈을 가져와 `Sequelize` 상수에 할당했습니다. 그다음엔 Sequelize 객체를 하나 만들어 `sequelize` 상수에 할당했습니다. Sequelize 객체를 만들 때는 세 개의 파라매터가 필요한데 데이터베이스 이름, 접속 계정명, 비밀번호 순입니다. 순서대로 문자열로 파라매터를 넘겨주면 sequelize 객체를 얻을수 있습니다. 이 객체가 제공하는 메소드 중 `define()` 함수를 이용해 모델을 만들수 있습니다. 그럼 User 모델을 만들어 봅시다.

```javascript
const User = sequelize.define('user', {
  name: Sequelize.STRING
});
```

`define()` 함수의 첫번째 파라메터가 데이터베이이스에 만들어질 테이블 이름입니다.

그 다음에는 테이블의 세부사항을 객체 형식으로 정의 합니다. 이전에 유저 객체에는 id와 name이 있었는데요 그 둘을 여기서 정의하면 됩니다. `name: Sequelize.STRING` 은 name 컬럼을 정의하는 코드입니다.` Sequelize.STRING` 상수를 이용해 name 값이 문자열임을 정의했습니다. 그럼 id는 어디에 있을까요? 고맙게도 Sequelize는 기본적으로 id를 만들어 줍니다.

게다가 createdAt, updatedAt 이라는 컬럼도 자동으로 만들어 줍니다. 이 컬럼들의 역할은.... 알것같죠? 테이블안에 데이터를 로우(row)라고 하는데 로우가 생성될때 마다 createAt에 타임 정보가 기록됩니다. 그리고 로우가 변경될 때마다 updatedAt 컬럼값이 변경되구요. Sequelize를 사용하면 많이 사용되는 컬럼들에 대해서도 자동으로 만들어주는 편리함이 있습니다.

마지막으로 `models.js` 도 어디선가 불러져서 사용해야합니다. 그러면 당연히 모듈로 만들어야 하겠죠. `moduele.exports` 키워드를 이용해 모듈로 만들어 보겠습니다.

```javascript
moduele.exports = {
  sequelize: sequelize,
  User: User
}
```

두 개 객체를 외부로 노출했습니다. 방금 정의한 User 모델과 디비가 연결된 sequelize 객체입니다.


## DB Sync

sequelize 객체가 제공하는 메소드 중에는 모델을 정의하는 `define()` 외에도 `sync()` 라는 메소드가 있습니다. 이 함수를 실행하면 sequelize 객체에 연결된 데이터베스에 우리가 정의한 모델들을 테이블로 생성하는 기능입니다. 이러한 작업은 서버가 구동될때 딱 한번만 호출되면 됩니다. 그래서 서버의 시작점인 `app.js`에 만들겠습니다.

```javascript
app.listen(3000, () => {
  console.log('Example app listening on port 3000!');

  require('./models').sequelize.sync({force: true})
      .then(() => {
        console.log('Databases sync');
      });
});
```

`app.listen()`으로 서버가 구동된 다음에 콜백함수가 동작하면 'Example app listening on port 3000!' 라는 메세지를 콘솔에 출력하게 됩니다.

그리고 나서 방금 만들었던 models 모듈의  sequelize객체를 가져와서 `sync()` 함수를 실행합니다. 데이터베이스에 테이블을 만들기 위해서죠.

그런데 `sync()` 함수에 `{force: true}` 옵션을 넘겨주었습니다. force라는 속성에는 불리언 데이터를 설정할 수 있는데 true일 경우 `sync()` 함수가 실행되면 무조건 테이블을 새로 만드는 옵션입니다. 반대로 force 값이 false 일 경우에는 데이터베이스에 테이블이 있을 경우 다시 만들지 않는 기능입니다. 지금은 개발용이기 때문에 `{force: true}`를 설정했지만 실제 운영중인 서버라면은 반드시 `{force: false}` 옵션으로 실행해야하겠죠.

npm start로 서버를 구동하면 데이터베이스에 테이블이 생성됩니다. 

만약 윈도우에서 npm start 후 `Error: Please install mysql package manually` 라는 에러가 발생한다면,
`npm install mysql` 를 먼저 실행 후 다시 진행해주시기 바랍니다.


이제 mysql 프롬프트에서 확인해 보겠습니다.


```
mysql> SHOW TABLES;
+----------------------------+
| Tables_in_node_api_codelab |
+----------------------------+
| users                      |
+----------------------------+
1 row in set (0.00 sec)
```

방금 만들었던 users 테이블이 생겼습니다. 그런데 이상합니다. `define()` 함수로 테이블명을 user로 했는데 여기는 복수형인 users가 되었습니다. 이것도 sequelzie 에서 자동으로 변환해서 만들어준 것입니다. 왜냐하면 테이블 안에는 여러 user 정보가 있기때문에 그런 것 같습니다.

테이블 정보도 확인해 보지요.

```
mysql> describe users;
+-----------+--------------+------+-----+---------+----------------+
| Field     | Type         | Null | Key | Default | Extra          |
+-----------+--------------+------+-----+---------+----------------+
| id        | int(11)      | NO   | PRI | NULL    | auto_increment |
| name      | varchar(255) | YES  |     | NULL    |                |
| createdAt | datetime     | NO   |     | NULL    |                |
| updatedAt | datetime     | NO   |     | NULL    |                |
+-----------+--------------+------+-----+---------+----------------+
4 rows in set (0.01 sec)
```

id 값은 sequelize가 자동으로 생성한 컬럼입니다. 프라이머리 키로 설정되어 로우가 생성될때마다 자동으로 id값이 증가됩니다.

name은 우리가 정의한 컬럼입니다. sequelize.STRING 값으로 정의했는데 varchar(255)로 설정된것을 확인하세요.

그리고 createdAt과 updateAt도 sequelize가 자동으로 만들어준 컬럼입니다. datetime 형식으로 되어 있네요.

```
git checkout sequelizeModel
```
