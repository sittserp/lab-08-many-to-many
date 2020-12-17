const pool = require('../utils/pool');

module.exports = class Student {
  studentId;
  name;

  constructor(row) {
    this.studentId = row.student_id;
    this.name = row.name;
  }

  static async insert({ name }) {
    const { rows } = await pool.query(
      'INSERT INTO students (name) VALUES ($1) RETURNING *',
      [name]
    );

    return new Student(rows[0]);
  } 

  static async find() {
    const { rows } = await pool.query('SELECT * FROM students');

    return rows.map(row => new Student(row));
  }

  static async update(studentId, { name }) {
    const { rows } = await pool.query(
      'UPDATE students SET name=$1 WHERE student_id=$2 RETURNING *',
      [name, studentId]
    );

    if(!rows[0]) throw new Error(`No student found for id ${studentId}`);

    return new Student(rows[0]);
  }

  static async delete(studentId) {
    const { rows } = await pool.query(
      'DELETE FROM students WHERE student_id=$1 RETURNING *',
      [studentId]
    );

    return new Student(rows[0]);
  }

};
