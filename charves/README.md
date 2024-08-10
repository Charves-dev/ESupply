# charves (주) 차베스전기

### 프로젝트 루트 폴더 생성 및 초기화
```
mkdir C:/ESupply/charves
cd C:/ESupply/charves
npm init -y
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