const mysql = require('mysql2/promise');

async function run() {
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'admin',
    database: 'imap_solution_db'
  });

  await conn.execute(`
    CREATE TABLE IF NOT EXISTS patient_documents (
      id INT AUTO_INCREMENT PRIMARY KEY,
      patient_id INT NOT NULL,
      filename VARCHAR(500) NOT NULL,
      original_name VARCHAR(500) NOT NULL,
      category VARCHAR(50) NOT NULL DEFAULT 'other',
      mimetype VARCHAR(100),
      file_size INT,
      uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT patient_documents_ibfk_1
        FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
      INDEX idx_patient_id (patient_id),
      INDEX idx_category (category)
    )
  `);

  console.log('patient_documents table created successfully');
  await conn.end();
}

run().catch(e => {
  console.error('Migration failed:', e.message);
  process.exit(1);
});
