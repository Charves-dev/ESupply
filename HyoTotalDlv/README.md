# HoyTotalDlv (주)효성종합배송

### 송장번호 공식
```
송장번호(BILL_NO) = XXX(출발센터코드) + XXX(도착센터코드) + XXXXXXXX(일련번호)
※ 일련번호는 출발센터에서 채번한다. (sequence 8자리 순환시퀀스)
   따라서 현재 center_info 에 있는 모든 센터(295개)별로 sequence가 존재해야 한다.
```

### React 프로젝트 생성
```
npx create-react-app client
```

### 백엔드 서버 폴더 생성 및 설정
```
mkdir server
cd server
npm init -y
npm install express
```

### 프로젝트 루트로 돌아와서 concurrently 모듈 설치(charves/ 에서 설치)
```
cd ..
npm install concurrently --save-dev
```

### package.json 파일 수정
### "scripts" 섹션을 다음과 같이 수정
```
"scripts": {
  "start": "concurrently \"npm run server\" \"npm run client\"",
  "server": "nodemon server/index.js",
  "client": "npm start --prefix client"
}
```

### client에 axios 설치 (charves/client/ 에서 설치)
```
cd client
npm install axios
```

### 프로젝트 실행(charves/ 에서 실행)
npm start


### 쿼리를 charvesQuery.xml 에 두고 서버 부팅시 쿼리를 읽어오도록 ...
```
cd server
npm install fs
npm install xml-digester
```

### 서버 세션관리 설정
```
cd server 
npm install express-session
```