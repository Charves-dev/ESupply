# ESupply

### 서버 설정
```
npm install -y // 초기화가 안되어있을 경우
npm install expresss
```

### 클라이언트 설정
```
cd client
npm install
npm run build
```

### 서버 실행
```
cd..
node index.js
```


### 프로젝트 구조
```
ESupply/
├── client/              # React 애플리케이션 폴더
│   ├── build/           # npm run build 후 생성됨
│   ├── public/
│   │   ├── index.html
│   ├── src/
│   │   ├── index.js
│   │   ├── App.js       # 화면 출력
│   │   ├── styles.css
│   ├── .gitignore
│   ├── package-lock.json
│   ├── package.json
│   └── ...
├── index.js            # Express 서버 설정 파일
├── .gitignore
├── package-lock.json
├── package.json
└── ...

```

### DataBase 트랜젝션 설정
```
(1) my.ini파일 열기
(2) [mysqld] 란을 찾는다.
(3) autocommit=0  로 설정(없으면 추가)
(4) transaction-isolation = READ-COMMITTED 로 설정 (없으면 추가)
(5) DB를 내렸다 올린다.
```