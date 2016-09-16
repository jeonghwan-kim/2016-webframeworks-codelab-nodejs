Hello World 코드 설명
===================

프론트엔드에서 자바스크립트를 사용해보신 분들이라면 몇가지 특이한 신텍스가 보일겁니다. `const` 와 `() => ` 코드인데요. 이것은 자바스크립트의 새로운 표준인 ECMAScript 2015 (줄여서 ES6) 문법입니다.

## const

지금까지의 자바스크립트(ES5)에서는 변수를 선언하기 위해 `var` 키워드를 사용했습니다. 이것은 함수 스코프 적용을 받는 변수입니다. 아... 함수 스코프가 뭔지 모르겠다면 아래 코드부터 보세요.

```javascript
function foo() {
  if (false) {
    var a = 1;
  }
  console.log(a);
}

foo(); // undefined
```

`foo()`를 실행하면 어떤 값이 나올까요? 함수 안에  `if (false)` 구문은 실행되지 않아야 마땅합니다. 조건문이 `false` 이니깐요. 그래서 `a` 라는 변수 자체가 없어야 하고 `console.log(a)`를 실행할때 `a` 라는 변수가 선언되지 않았으므로 ReferenceError가 발생해야 합니다. 하지만 실제는 `undefined` 값이 출력됩니다. 자바스크립트 엔진은 위 코드를 이렇게 변경하기 때문입니다.

```javascript
function foo() {
  var a;
  if (false) {
    a = 1;
  }
  console.log(a);
}
```

자바스크립트 엔진은 코드 안에 `var a = 1;` 이라는 코드를 만나면 먼저 코드 상단에 `a` 라는 변수를 미리 선언합니다. 이것을 호이스팅(hoisting)이라고 합니다.

자바스크립트 엔진은 `a` 변수를 어디에 선언해야하는지 기준이 있어야 합니다. `foo()` 함수의 첫 번째 줄일수도 있고 `foo()` 함수 바깥일 수 도 있습니다. 자바스크립트 엔진은 전자의 방식 즉 **해당 변수가 선언된 함수의 맨 첫번째 줄에 변수를 선언합니다.** 이것을 두고 "자바스크립트는 함수 스코프를 사용한다"라고 얘기합니다. 그동안 자바스크립트에서 스코프라고 하면 모두 함수 스코프를 얘기했습니다.

하지만 ES6 부터는 이를 구분해서 얘기해야합니다. `let`은 함수 스코프를 사용하지 않기 때문이죠. **블록스코프** 를 사용합니다. 여기서 블록은 중괄호(`{ }`)를 의미합니다. 아래 코드를 살펴보세요.

```javascript
function foo() {
  if (false) {
    let a = 1;
  }
  console.log(a);
}

foo(); // ReferenceError: a is not defined
```

`if` 블록 안에 `a` 변수가 `let`으로 선언되었고 `if` 블록을 빠져나오면 `console.log(a)` 코드를 만나게 됩니다. 여기서 `a`는 `foo()` 함수 스코프 내에서는 찾을 수 없습니다. 왜냐하면 `let`으로 선언된 `a` 변수는 `if` 블록에 감싸져서 `foo()` 함수 스코프에서는 보이지 않기 때문이다. 이것을 블록 스코프라고 합니다.

`const`도 마찬가지죠. `let`처럼 블록 스코프를 사용하는 상수 키워드 입니다. 상수란 선언과 동시에 값이 할당 되어야 하고 이후에는 값을 변경하지 못하는 특징이 있습니다. 아래 코드를 보면 알수 있겠죠?

```javascript
const a = 1;
a = 2; // TypeError: Assignment to constant variable.
const b; // SyntaxError: Missing initializer in const declaration

```


### Arrow function

ES6에는 익명 함수를 선언할 때 `() => {}` 와 같은 표현법을 사용할 수 있는데 이것은 애로우 함수(Arrow function)라고 합니다. `function` 키워드를 간단히 줄여놓은 문법인데요 콜백이 많은 노드 코드를 위해 만들어진 것입니다.


### require()

[Nodejs에 대해](./01_Nodejs.md) 글에서 노드는 V8, 이벤트I/O프레임웍 그리고 CommonJS로 이뤄진 환경이라고 했는데요. 마지막의 CommonJS를 구현해 놓은 것 중 하나가 `require()` 함수입니다. `require()` 함수는 자바스크립트로 만든 모듈을 가져올 수 있습니다. 모듈에 대해 알아보기 위해 아래 코드를 읽어 보세요.

```javascript
// sum.js
function sum(a, b) {
  return a + b;
}

// sum() 함수를 외부로 노출함 -> 모듈로 만듬
module.exports = sum;
```

노드에서는 파일단위로 하나의 모듈을 만들 수 있습니다. `sum.js` 파일을 만들고 그안에 `sum()` 함수를 정의했습니다. 그리고 코드의 마지막 줄에 `module.exports` 신텍스를 이용해서 외부로 노출시켰습니다. 이러면 `sum.js` 파일은 일종의 모듈이 되는 것입니다.

그럼 이 모듈을 어떻게 가져다 사용할 수 있을까요? 아래 코드에서 그 방법을 알려줍니다.

```javascript
const sum = require('./sum.js');
console.log(sum(1, 2)); // 3
```

`require()` 함수를 이용해 우리가 만들었던 모듈인 `sum.js` 파일을 가져옵니다. 그리고 `sum`이라는 상수에 할당합니다. `let`이나 `var`로 하지않고 `const`를 이용한 것은 우리가 사용할 외부 모듈을 변경하지 않고 사용만 할 것이기 때문입니다. ES6애서 제공하는 이런류의 문법을 사용하면 코드의 버그를 잡는데 도움이 됩니다. `sum` 상수에는 `sum.js` 모듈에서 노출한 `sum()` 함수가 할당될 것입니다. 그래서 `sum(1, 2)`라는 형태로 활용할 수 있습니다.

헬로 월드 코드의 첫번째 코드를 다시 봅시다.

```javascript
const http = require('http');;
```

Http 라는 모듈을 가져와서 `http`라는 상수에 할당하였습니다. Http 모듈은 `createServer()` 함수를 노출하기 때문에 아래 코드로 서버 객체를 만들 수 있습니다.

```javascript
const server = http.createServer((req, res) => { /*... */ });
```

`createServer()` 함수로 생성된 `server` 객체는 다시 `listen()` 이라는 함수를 제공하는데이 이를 통해 서버가 클라이언트로부터 요청을 받기 위한 대기상태로 만들수 있는 것입니다.
