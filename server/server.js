const express = require('express');
const cors = require('cors');
const oracledb = require('oracledb');
const dotenv = require('dotenv');
const bookRoutes = require('./routes/bookRoutes');

// 환경 변수 로드
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 미들웨어 설정
app.use(cors());
app.use(express.json());

// 데이터베이스 연결 설정
const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  connectString: process.env.DB_CONNECTION_STRING
};

// 데이터베이스 연결 초기화
async function initializeDatabase() {
  try {
    await oracledb.createPool(dbConfig);
    console.log('Oracle 데이터베이스 연결 풀이 생성되었습니다.');
  } catch (err) {
    console.error('Oracle 데이터베이스 초기화 중 오류 발생:', err);
    process.exit(1);
  }
}

// API 라우트 설정
app.use('/api/books', bookRoutes);

// 서버 헬스체크 엔드포인트
app.get('/api/healthcheck', (req, res) => {
  res.json({ status: 'ok', message: '서버가 정상적으로 실행 중입니다.' });
});

// 서버 시작
initializeDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
  });
}).catch(err => {
  console.error('서버 시작 중 오류 발생:', err);
});