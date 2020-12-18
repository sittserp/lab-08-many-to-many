const fs = require('fs');
const pool = require('../lib/utils/pool');
const request = require('supertest');
const app = require('../lib/app');
const Student = require('../lib/models/Student');
const Course = require('../lib/models/Course');

describe('student routes', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  afterAll(() => {
    return pool.end();
  });

  it('creates a new student via POST', async() => {
    const response = await request(app)
      .post('/api/v1/students')
      .send({
        name: 'Matt'
      });

    expect(response.body).toEqual({
      studentId: '1',
      name: 'Matt'
    });
  });

  it('finds a student by id via GET and all associated classes', async() => {
    await Promise.all([
      { title: 'MATH' },
      { title: 'ENGLISH' },
      { title: 'HISTORY' }
    ].map(course => Course.insert(course)));

    const student = await Student.insert({
      name: 'Matt',
      courses: ['MATH', 'ENGLISH']
    });

    const response = await request(app)
      .get(`/api/v1/students/${student.studentId}`);
    
    expect(response.body).toEqual({
      ...student,
      courses: ['MATH', 'ENGLISH']
    });

  });

  it('finds all students via GET', async() => {
    const students = await Promise.all([
      { name: 'Matt' },
      { name: 'Jay' },
      { name: 'Eric' }
    ].map(student => Student.insert(student)));

    const response = await request(app)
      .get('/api/v1/students');

    expect(response.body).toEqual(expect.arrayContaining(students));
    expect(response.body).toHaveLength(students.length);
  });

  it('updates a student via PUT', async() => {
    const student = await Student.insert({
      name: 'Matt'
    });

    const response = await request(app)
      .put(`/api/v1/students/${student.studentId}`)
      .send({
        name: 'Jae'
      });

    expect(response.body).toEqual({
      studentId: student.studentId,
      name: 'Jae'
    });
  });

  it('deletes a student by id', async() => {
    const student = await Student.insert({
      name: 'Matt'
    });

    const response = await request(app)
      .delete(`/api/v1/students/${student.studentId}`);

    expect(response.body).toEqual(student);
  });
});
