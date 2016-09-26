환경의 분리
========

서버가 실행되는 모드를 몇 개 정의해야할 것 같습니다. 무슨 말이냐고요? 이건 테스트 때문입니다. 아직 테스트에 디비를 붙이지는 않았지만 곧 테스트에 디비를 붙일 것입니다. 하지만 테스트할때 디비를 붙이게 되면 데이터베이스에 테스트에서 사용한 데이터들이 쌓이게 됩니다. 따라서 테스트용 데이터베이스가 따로 있어야하는데 이것을 위해 서버 환경을 분리 하겠습니다.

 우리는 세가지 모드를 사용할 것입니다.

* development
* test
* production

"development"는 개발 모드입니다. 우리가 지금까지 사용했던 환경이죠. "test"는 테스트 환경을 의합니다. 마지막 "production"은 운영 모드입니다. 실제로 코드가 서버로 배포되어 동작는 환경을 의미하죠.

이러한 환경 정보는 `NODE_ENV`라는 환경 변수에 설정하여 사용할 수 있습니다. 노드 코드에서는 `process.env.NODE_ENV` 라는 변수를 통해 접근할 수 있습니다.

테스트 환경과 개발환경을 분리하기 위해서 `config/environment.js` 파일을 만들겠습니다.

```javascript
const environments = {
  development: {
    mysql: {
      username: 'root',
      password: 'root',
      database: 'node_api_codelab_dev'
    }
  },

  test: {
    mysql: {
      username: 'root',
      password: 'root',
      database: 'node_api_codelab_test'
    }
  },

  production: {

  }
}

const nodeEnv = process.env.NODE_ENV || 'development';

module.exports = environments[nodeEnv];
```

`environments` 라는 변수를 두어 각 환경 이름에 해당하는 키를 만들었습니다. 그리고 `nodeEnv`라는 상수에 노드 환경변수 값을 할당했습니다. 노드를 실행하기 전에 "NODE_ENV=test" 라고 실행하면 이값에 "test"라는 문자열이 들어갑니다. 만약 아무것도 설정하지 않으면 "development" 문자열이 들어가게될 것입니다. 마지막으로 `environments` 객체에서 노드 환경변수에 해당하는 부분의 객체를 반환하는 모듈로 만들었습니다.

```
git checkout env
```
