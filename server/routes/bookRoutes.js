const express = require('express');
const oracledb = require('oracledb');
const router = express.Router();

// Oracle 데이터베이스에서 ResultSet에서 데이터 추출
async function fetchFromResultSet(resultSet) {
  const rows = [];
  let result;
  
  while ((result = await resultSet.getRow())) {
    const row = {};
    const metaData = resultSet.metaData;
    
    for (let i = 0; i < metaData.length; i++) {
      const columnName = metaData[i].name.toLowerCase();
      row[columnName] = result[i];
    }
    
    rows.push(row);
  }
  
  return rows;
}

// 모든 도서 조회
router.get('/', async (req, res) => {
  let connection;
  
  try {
    connection = await oracledb.getConnection();
    
    // PL/SQL 프로시저 호출
    const result = await connection.execute(
      `BEGIN
          book_mgmt.get_all_books(:cursor);
       END;`,
      {
        cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }
      }
    );
    
    // 결과 커서 처리
    const resultSet = result.outBinds.cursor;
    const books = await fetchFromResultSet(resultSet);
    
    await resultSet.close();
    
    res.json(books);
  } catch (err) {
    console.error('도서 목록 조회 중 오류 발생:', err);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('연결 종료 중 오류 발생:', err);
      }
    }
  }
});

// 카테고리별 도서 조회 API
router.get('/category/:category', async (req, res) => {
  let connection;
  
  try {
    connection = await oracledb.getConnection();
    
    const category = req.params.category;
    
    // PL/SQL 프로시저 호출
    const result = await connection.execute(
      `BEGIN
          book_mgmt.get_books_by_category(:category, :cursor);
       END;`,
      {
        category: category,
        cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }
      }
    );
    
    // 결과 커서 처리
    const resultSet = result.outBinds.cursor;
    const books = await fetchFromResultSet(resultSet);
    
    await resultSet.close();
    
    res.json(books);
  } catch (err) {
    console.error('카테고리별 도서 조회 중 오류 발생:', err);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('연결 종료 중 오류 발생:', err);
      }
    }
  }
});

// 특정 도서 조회 API
router.get('/:id', async (req, res) => {
  let connection;
  
  try {
    connection = await oracledb.getConnection();
    
    const bookId = parseInt(req.params.id);
    
    // PL/SQL 프로시저 호출
    const result = await connection.execute(
      `BEGIN
          book_mgmt.get_book_by_id(:book_id, :cursor);
       END;`,
      {
        book_id: bookId,
        cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }
      }
    );
    
    // 결과 커서 처리
    const resultSet = result.outBinds.cursor;
    const books = await fetchFromResultSet(resultSet);
    
    await resultSet.close();
    
    if (books.length === 0) {
      return res.status(404).json({ error: '도서를 찾을 수 없습니다.' });
    }
    
    res.json(books[0]);
  } catch (err) {
    console.error('도서 조회 중 오류 발생:', err);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('연결 종료 중 오류 발생:', err);
      }
    }
  }
});

// 도서 추가 API
router.post('/', async (req, res) => {
  let connection;
  
  try {
    connection = await oracledb.getConnection();
    
    const { title, author, category, publication_year, price, stock } = req.body;
    
    // 필수 필드 검증
    if (!title || !author || !category) {
      return res.status(400).json({ error: '제목, 저자, 카테고리는 필수 입력 항목입니다.' });
    }
    
    // PL/SQL 프로시저 호출
    const result = await connection.execute(
      `BEGIN
          book_mgmt.add_book(:title, :author, :category, :pub_year, :price, :stock, :book_id);
       END;`,
      {
        title: title,
        author: author,
        category: category,
        pub_year: publication_year || null,
        price: price || null,
        stock: stock || 0,
        book_id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
      }
    );
    
    const newBookId = result.outBinds.book_id;
    
    res.status(201).json({ 
      message: '도서가 성공적으로 추가되었습니다.',
      book_id: newBookId 
    });
  } catch (err) {
    console.error('도서 추가 중 오류 발생:', err);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('연결 종료 중 오류 발생:', err);
      }
    }
  }
});

// 도서 수정 API
router.put('/:id', async (req, res) => {
  let connection;
  
  try {
    connection = await oracledb.getConnection();
    
    const bookId = parseInt(req.params.id);
    const { title, author, category, publication_year, price, stock } = req.body;
    
    // 필수 필드 검증
    if (!title || !author || !category) {
      return res.status(400).json({ error: '제목, 저자, 카테고리는 필수 입력 항목입니다.' });
    }
    
    // PL/SQL 프로시저 호출
    const result = await connection.execute(
      `BEGIN
          book_mgmt.update_book(:book_id, :title, :author, :category, :pub_year, :price, :stock, :rows_updated);
       END;`,
      {
        book_id: bookId,
        title: title,
        author: author,
        category: category,
        pub_year: publication_year || null,
        price: price || null,
        stock: stock || 0,
        rows_updated: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
      }
    );
    
    const rowsUpdated = result.outBinds.rows_updated;
    
    if (rowsUpdated === 0) {
      return res.status(404).json({ error: '수정할 도서를 찾을 수 없습니다.' });
    }
    
    res.json({ 
      message: '도서가 성공적으로 수정되었습니다.',
      book_id: bookId 
    });
  } catch (err) {
    console.error('도서 수정 중 오류 발생:', err);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('연결 종료 중 오류 발생:', err);
      }
    }
  }
});

// 도서 삭제 API
router.delete('/:id', async (req, res) => {
  let connection;
  
  try {
    connection = await oracledb.getConnection();
    
    const bookId = parseInt(req.params.id);
    
    // PL/SQL 프로시저 호출
    const result = await connection.execute(
      `BEGIN
          book_mgmt.delete_book(:book_id, :rows_deleted);
       END;`,
      {
        book_id: bookId,
        rows_deleted: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
      }
    );
    
    const rowsDeleted = result.outBinds.rows_deleted;
    
    if (rowsDeleted === 0) {
      return res.status(404).json({ error: '삭제할 도서를 찾을 수 없습니다.' });
    }
    
    res.json({ message: '도서가 성공적으로 삭제되었습니다.' });
  } catch (err) {
    console.error('도서 삭제 중 오류 발생:', err);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('연결 종료 중 오류 발생:', err);
      }
    }
  }
});

module.exports = router;