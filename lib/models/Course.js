const pool = require('../utils/pool');
const Student = require('./Student');

module.exports = class Course {
  courseId;
  title;

  constructor(row) {
    this.courseId = row.course_id;
    this.title = row.title;
  }

  static async insert({ title, students = [] }) {
    const { rows }  = await pool.query(
      'INSERT INTO courses (title) VALUES ($1) RETURNING *',
      [title]
    );

    await pool.query(
      `INSERT INTO courses_students (course_id, student_id)
      SELECT ${rows[0].course_id}, student_id FROM students WHERE name = ANY($1::TEXT[])`,
      [students]
    );

    return new Course(rows[0]);
  }

  static async findById(courseId) {
    const { rows } = await pool.query(
      `SELECT
        courses.*,
        array_agg(students.name) AS students
      FROM
        courses_students
      JOIN courses
      ON courses_students.course_id = courses.course_id
      JOIN students
      ON courses_students.student_id = students.student_id
      WHERE courses.course_id=$1
      GROUP BY courses.course_id`,
      [courseId]
    );

    if(!rows[0]) throw new Error(`No course found for id ${courseId}`);

    return {
      ...new Course(rows[0]),
      students: rows[0].students
    };
  }

  static async find() {
    const { rows } = await pool.query('SELECT * FROM courses');

    return rows.map(row => new Course(row));
  }

  static async update(courseId, { title }) {
    const { rows } = await pool.query(
      'UPDATE courses SET title=$1 WHERE course_id=$2 RETURNING *',
      [title, courseId]
    );

    if(!rows[0]) throw new Error(`No course found for id ${courseId}`);

    return new Course(rows[0]);
  }

  static async delete(courseId) {
    const { rows } = await pool.query(
      'DELETE FROM courses WHERE course_id=$1 RETURNING *',
      [courseId]
    );

    return new Course(rows[0]);
  }
};
