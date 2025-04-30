CREATE TABLE books (
  book_id NUMBER PRIMARY KEY,
  title VARCHAR2(200) NOT NULL,
  author VARCHAR2(100) NOT NULL,
  category VARCHAR2(50) NOT NULL,
  publication_year NUMBER,
  price NUMBER(10,2),
  stock NUMBER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE SEQUENCE book_id_seq
  START WITH 1
  INCREMENT BY 1
  NOCACHE
  NOCYCLE;

-- 트리거 (업데이트 시간 자동으로 생성)
CREATE OR REPLACE TRIGGER trg_books_update
BEFORE UPDATE ON books
FOR EACH ROW
BEGIN
  :NEW.updated_at := CURRENT_TIMESTAMP;
END;
/

-- 샘플 데이터 넣기ㅣ;
INSERT INTO books (book_id, title, author, category, publication_year, price, stock)
VALUES (book_id_seq.NEXTVAL, '해리 포터와 마법사의 돌', 'J.K. 롤링', '소설', 1997, 15000, 25);

INSERT INTO books (book_id, title, author, category, publication_year, price, stock)
VALUES (book_id_seq.NEXTVAL, '어린 왕자', '생텍쥐페리', '소설', 1943, 12000, 15);

INSERT INTO books (book_id, title, author, category, publication_year, price, stock)
VALUES (book_id_seq.NEXTVAL, '사피엔스', '유발 하라리', '역사/문화', 2015, 22000, 10);

INSERT INTO books (book_id, title, author, category, publication_year, price, stock)
VALUES (book_id_seq.NEXTVAL, '자바의 정석', '남궁성', '과학/기술', 2016, 30000, 8);

INSERT INTO books (book_id, title, author, category, publication_year, price, stock)
VALUES (book_id_seq.NEXTVAL, '데일 카네기의 인간관계론', '데일 카네기', '자기계발', 1936, 14000, 12);

INSERT INTO books (book_id, title, author, category, publication_year, price, stock)
VALUES (book_id_seq.NEXTVAL, '코스모스', '칼 세이건', '과학/기술', 1980, 18000, 7);

COMMIT;