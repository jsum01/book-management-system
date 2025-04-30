# Book Management System (도서 관리 시스템)

A full-stack application demonstrating Oracle PL/SQL integration with Express backend and React frontend.

이 프로젝트는 Oracle PL/SQL 프로시저를 사용한 데이터 처리를 연습하기 위한 도서 관리 애플리케이션입니다.

## 🌟 Features (기능)

- **CRUD Operations**: Create, Read, Update, and Delete books
- **Category Filtering**: Filter books by their category
- **PL/SQL Integration**: Uses Oracle PL/SQL procedures for data operations
- **Responsive Design**: Works on both desktop and mobile devices

## 🔍 Key Technical Points (주요 기술적 특징)

### PL/SQL 프로시저 활용

This project demonstrates how to use Oracle PL/SQL procedures instead of embedding SQL directly in the Express application:

- Database-level business logic encapsulation (데이터베이스 레벨에서 비즈니스 로직 캡슐화)
- Improved security by reducing SQL injection risks (SQL 인젝션 위험 감소로 보안 강화)
- Better performance for complex operations (복잡한 작업에 대한 성능 향상)
- Code reusability across different applications (여러 애플리케이션에서 코드 재사용 가능)

```sql
-- Example PL/SQL procedure used in this project
CREATE OR REPLACE PACKAGE BODY book_mgmt AS
  PROCEDURE get_all_books(p_cursor OUT SYS_REFCURSOR) IS
  BEGIN
    OPEN p_cursor FOR
      SELECT 
        book_id, title, author, category, 
        publication_year, price, stock,
        created_at, updated_at
      FROM books
      ORDER BY title ASC;
  END get_all_books;
  
  -- Other procedures...
END book_mgmt;
```

## 🛠️ Tech Stack (기술 스택)

### Frontend
- React
- React Router
- Axios
- CSS3

### Backend
- Express.js
- Node.js
- Oracle Database
- PL/SQL

## 🚀 Getting Started (시작하기)

### Prerequisites (사전 요구사항)
- Node.js (v14+)
- Docker
- Git

### Installation (설치)

1. **Clone the repository (저장소 복제)**
   ```bash
   git clone https://github.com/yourusername/book-management-system.git
   cd book-management-system
   ```

2. **Set up Oracle Database using Docker (Docker를 사용하여 Oracle 데이터베이스 설정)**
   ```bash
   docker run -d --name oracle-db \
     -p 1521:1521 \
     -e ORACLE_PASSWORD=yourpassword \
     gvenzl/oracle-xe:latest
   ```

3. **Setup database schema (데이터베이스 스키마 설정)**
   
   Connect to the database and run the SQL scripts from the `database` directory:
   ```bash
   docker exec -it oracle-db bash
   sqlplus system/yourpassword
   ```
   
   Then create user and run scripts:
   ```sql
   -- Create user
   CREATE USER bookmgmt IDENTIFIED BY bookpass123;
   GRANT CONNECT, RESOURCE, DBA TO bookmgmt;
   ALTER USER bookmgmt QUOTA UNLIMITED ON USERS;
   
   -- Connect as the new user
   CONNECT bookmgmt/bookpass123
   
   -- Run the scripts (You can copy-paste from database/setup.sql)
   ```

4. **Install server dependencies (서버 의존성 설치)**
   ```bash
   cd server
   npm install
   ```

5. **Configure server environment (서버 환경 구성)**
   ```bash
   # Create .env file
   echo "PORT=5050
   DB_USER=bookmgmt
   DB_PASSWORD=bookpass123
   DB_CONNECTION_STRING=localhost:1521/XE" > .env
   ```

6. **Install client dependencies (클라이언트 의존성 설치)**
   ```bash
   cd ../client
   npm install
   ```

7. **Configure client environment (클라이언트 환경 구성)**
   ```bash
   # Create .env.local file
   echo "REACT_APP_API_URL=http://localhost:5050/api" > .env.local
   ```

### Running the application (애플리케이션 실행)

1. **Start the server (서버 시작)**
   ```bash
   cd ../server
   npm run dev
   ```

2. **Start the client (클라이언트 시작)**
   ```bash
   cd ../client
   npm start
   ```

3. **Access the application (애플리케이션 접속)**
   
   Open your browser and navigate to `http://localhost:3000`

## 📝 Project Structure (프로젝트 구조)

```
book-management-system/
├── client/                   # React frontend (리액트 프론트엔드)
│   ├── public/
│   ├── src/
│   │   ├── components/       # React components (리액트 컴포넌트)
│   │   ├── services/         # API service functions (API 서비스 함수)
│   │   ├── App.js            # Main application component (메인 애플리케이션 컴포넌트)
│   │   └── index.js          # Entry point (진입점)
│   ├── .env.local            # Environment variables (환경 변수)
│   └── package.json          # Dependencies and scripts (의존성 및 스크립트)
│
├── server/                   # Express backend (익스프레스 백엔드)
│   ├── routes/               # API routes (API 라우트)
│   ├── .env                  # Environment variables (환경 변수)
│   ├── server.js             # Server entry point (서버 진입점)
│   └── package.json          # Dependencies and scripts (의존성 및 스크립트)
│
└── database/                 # Database setup scripts (데이터베이스 설정 스크립트)
    ├── setup.sql             # Tables and sequences (테이블 및 시퀀스)
    └── plsql_packages.sql    # PL/SQL packages (PL/SQL 패키지)
```

## 📖 API Documentation (API 문서)

| Endpoint | Method | Description | Request Body | Response |
|----------|--------|-------------|--------------|----------|
| `/api/books` | GET | Get all books | - | Array of book objects |
| `/api/books/:id` | GET | Get book by ID | - | Book object |
| `/api/books/category/:category` | GET | Get books by category | - | Array of book objects |
| `/api/books` | POST | Add new book | Book object | New book ID |
| `/api/books/:id` | PUT | Update book | Book object | Success message |
| `/api/books/:id` | DELETE | Delete book | - | Success message |

## 🤝 Contributing (기여하기)

Contributions are welcome! Please feel free to submit a Pull Request.

기여는 언제나 환영합니다! Pull Request를 자유롭게 제출해주세요.

## 📄 License (라이선스)

This project is licensed under the MIT License - see the LICENSE file for details.

이 프로젝트는 MIT 라이선스 하에 있습니다 - 자세한 내용은 LICENSE 파일을 참조하세요.

## 📊 Screenshots (스크린샷)

![Book List](path/to/screenshot1.png)
*Book list page showing all books (모든 도서를 보여주는 도서 목록 페이지)*

![Book Details](path/to/screenshot2.png)
*Book details page (도서 상세 페이지)*

![Add/Edit Book](path/to/screenshot3.png)
*Add/Edit book form (도서 추가/수정 양식)*

## ✨ Future Improvements (향후 개선 사항)

- User authentication (사용자 인증)
- Advanced search functionality (고급 검색 기능)
- Book lending system (도서 대출 시스템)
- Statistics and reporting dashboard (통계 및 보고서 대시보드)
- Image upload for book covers (도서 표지 이미지 업로드)
