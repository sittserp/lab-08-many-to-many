const pool = require('../utils/pool');

module.exports = class Student {
  studentId;
  name;

  constructor(row) {
    this.studentId = row.student_id;
    this.name = row.name;
  }

  static async insert({ name, courses = [] }) {
    const { rows }  = await pool.query(
      'INSERT INTO students (name) VALUES ($1) RETURNING *',
      [name]
    );

    await pool.query(
      `INSERT INTO courses_students (course_id, student_id)
      SELECT ${rows[0].student_id}, course_id FROM courses WHERE title = ANY($1::TEXT[])`,
      [courses]
    );

    return new Student(rows[0]);
  }

  static async findById(studentId) {
    const { rows } = await pool.query(
      `SELECT
        students.*,
        array_agg(courses.title) AS courses
    FROM
        courses_students
      JOIN courses
      ON courses_students.course_id = courses.course_id
      JOIN students
      ON courses_students.student_id = students.student_id
      WHERE students.student_id=$1
      GROUP BY students.student_id`,
      [studentId]
    );

    if(!rows[0]) throw new Error(`No course found for id ${studentId}`);

    return {
      ...new Student(rows[0]),
      courses: rows[0].courses
    };
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
