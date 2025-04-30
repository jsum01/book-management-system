CREATE OR REPLACE PACKAGE book_mgmt AS
  -- 모든 도서 조회
  PROCEDURE get_all_books(p_cursor OUT SYS_REFCURSOR);
  
  -- 카테고리별 도서 조회
  PROCEDURE get_books_by_category(
    p_category IN VARCHAR2,
    p_cursor OUT SYS_REFCURSOR
  );
  
  -- 특정 도서 조회
  PROCEDURE get_book_by_id(
    p_book_id IN NUMBER,
    p_cursor OUT SYS_REFCURSOR
  );
  
  -- 도서 추가
  PROCEDURE add_book(
    p_title IN VARCHAR2,
    p_author IN VARCHAR2,
    p_category IN VARCHAR2,
    p_publication_year IN NUMBER,
    p_price IN NUMBER,
    p_stock IN NUMBER,
    p_book_id OUT NUMBER
  );
  
  -- 도서 수정
  PROCEDURE update_book(
    p_book_id IN NUMBER,
    p_title IN VARCHAR2,
    p_author IN VARCHAR2,
    p_category IN VARCHAR2,
    p_publication_year IN NUMBER,
    p_price IN NUMBER,
    p_stock IN NUMBER,
    p_rows_updated OUT NUMBER
  );
  
  -- 도서 삭제
  PROCEDURE delete_book(
    p_book_id IN NUMBER,
    p_rows_deleted OUT NUMBER
  );
END book_mgmt;
/

-- 패키지 본문 생성
CREATE OR REPLACE PACKAGE BODY book_mgmt AS
  -- 모든 도서 조회
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
  
  -- 카테고리별 도서 조회
  PROCEDURE get_books_by_category(
    p_category IN VARCHAR2,
    p_cursor OUT SYS_REFCURSOR
  ) IS
  BEGIN
    OPEN p_cursor FOR
      SELECT 
        book_id, title, author, category, 
        publication_year, price, stock,
        created_at, updated_at
      FROM books
      WHERE UPPER(category) = UPPER(p_category)
      ORDER BY title ASC;
  END get_books_by_category;
  
  -- 특정 도서 조회
  PROCEDURE get_book_by_id(
    p_book_id IN NUMBER,
    p_cursor OUT SYS_REFCURSOR
  ) IS
  BEGIN
    OPEN p_cursor FOR
      SELECT 
        book_id, title, author, category, 
        publication_year, price, stock,
        created_at, updated_at
      FROM books
      WHERE book_id = p_book_id;
  END get_book_by_id;
  
  -- 도서 추가
  PROCEDURE add_book(
    p_title IN VARCHAR2,
    p_author IN VARCHAR2,
    p_category IN VARCHAR2,
    p_publication_year IN NUMBER,
    p_price IN NUMBER,
    p_stock IN NUMBER,
    p_book_id OUT NUMBER
  ) IS
  BEGIN
    SELECT book_id_seq.NEXTVAL INTO p_book_id FROM dual;
    
    INSERT INTO books (
      book_id, title, author, category,
      publication_year, price, stock
    ) VALUES (
      p_book_id, p_title, p_author, p_category,
      p_publication_year, p_price, p_stock
    );
    
    COMMIT;
  EXCEPTION
    WHEN OTHERS THEN
      ROLLBACK;
      RAISE;
  END add_book;
  
  -- 도서 수정
  PROCEDURE update_book(
    p_book_id IN NUMBER,
    p_title IN VARCHAR2,
    p_author IN VARCHAR2,
    p_category IN VARCHAR2,
    p_publication_year IN NUMBER,
    p_price IN NUMBER,
    p_stock IN NUMBER,
    p_rows_updated OUT NUMBER
  ) IS
  BEGIN
    UPDATE books SET
      title = p_title,
      author = p_author,
      category = p_category,
      publication_year = p_publication_year,
      price = p_price,
      stock = p_stock
    WHERE book_id = p_book_id;
    
    p_rows_updated := SQL%ROWCOUNT;
    COMMIT;
  EXCEPTION
    WHEN OTHERS THEN
      ROLLBACK;
      RAISE;
  END update_book;
  
  -- 도서 삭제
  PROCEDURE delete_book(
    p_book_id IN NUMBER,
    p_rows_deleted OUT NUMBER
  ) IS
  BEGIN
    DELETE FROM books
    WHERE book_id = p_book_id;
    
    p_rows_deleted := SQL%ROWCOUNT;
    COMMIT;
  EXCEPTION
    WHEN OTHERS THEN
      ROLLBACK;
      RAISE;
  END delete_book;
END book_mgmt;
/