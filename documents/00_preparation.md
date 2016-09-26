준비사항
=====

코드랩을 진행하기 앞서 몇가지 준비해야 할 사항들입니다.

## 노드 설치

[https://nodejs.org](https://nodejs.org)에서 `v.6.6.0 Current` 버전을 다운로드합니다.

다운로드한 파일을 실행하면 설치를 진행할수 있습니다.

설치가 완료되면 node, npm 명령어를 사용할수 있습니다. 아래 명령어로 설치 여부를 확인해 보세요.

```
node --version
v6.6.0

npm --version
3.10.3
```

## 데이터베이스 설치

코드랩에서는 데이터베이스로 MySQL을 사용합니다. 사용하는 운영체제별로 설치 방법이 다릅니다.

### OSX

홈브루([Homebrew](http://brew.sh/))루를 이용해서 간단히 설치할 수 있습니다.

```
brew install mysql
```

홈브루가 없으시다면 아래 스크립트로 홈브루를 먼저 설치하세요.

```
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```


### Windows

윈도우에서의 설치는 아래 링크로 대신 할께요.

[http://withcoding.com/26](http://withcoding.com/26)

또는

[http://blog.daum.net/bang2001/91](http://blog.daum.net/bang2001/91)

### Linux

데탑으로 리눅스를 사용하신다면 잘하실거라 믿습니다. 🙏

### 접속

설치하였으면 mysql 서버를 구동합니다. OSX 기준으로 설명할께요.

홈브루로 mysql을 설치했으면 mysql.server 명령어을 사용할 수 있습니다. 아래 명령어로 mysql 서버를 실행하세요.

```
mysql.server start
Starting MySQL
 SUCCESS!
```

"SUCCESS!" 결과를 확인했으면 아래 명령어로 서버에 접속해 보세요.

```
mysql -u root
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 491
Server version: 5.6.26 Homebrew

Copyright (c) 2000, 2015, Oracle and/or its affiliates. All rights reserved.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

mysql>
```

`mysql>` 프롬프트가 뜨면 된겁니다.

만약 mysql 설치중에 비밀번호 설정을 했다면 `-p` 옵션을 추가한뒤 설정한 비밀번호를 입력해야 합니다.

```
mysql -u root -p
Enter password:
```

## 아톰 에디터 설치

에디터는 본인이 사용하기 편리한 것으로 사용해도 무방합니다. 저는 이번 코드랩에서 아톰 에디터를 사용합니다.

실습 환경과 동일하게 유지하고 싶으신 분은 아래 링크에서 아톰 에디터를 설치해 보세요.

[https://atom.io/](https://atom.io/)
