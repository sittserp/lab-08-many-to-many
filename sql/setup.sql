DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS courses_students;

CREATE TABLE courses (
  course_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title VARCHAR(32)
);

CREATE TABLE students (
  student_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name VARCHAR(32)
);

CREATE TABLE tweets_tags (
  course_id BIGINT REFERENCES courses(course_id),
  student_id BIGINT REFERENCES students(student_id),
  PRIMARY KEY(course_id, student_id)
);