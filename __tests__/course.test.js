const fs = require('fs');
const pool = require('../lib/utils/pool');
const request = require('supertest');
const app = require('../lib/app');
const Course = require('../lib/models/Course');
const Student = require('../lib/models/Student');

describe('course routes', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  afterAll(() => {
    return pool.end();
  });

  it('creates a new course via POST', async() => {
    const response = await request(app)
      .post('/api/v1/courses')
      .send({
        title: 'MATH'
      });

    expect(response.body).toEqual({
      id: '1',
      title: 'MATH'
    });
  });

  it.only('finds a course by id via GET and all associated students', async() => {
    await Promise.all([
      { name: 'Matt' },
      { name: 'Jay' },
      { name: 'Eric' }
    ].map(student => Student.insert(student)));

    const course = await Course.insert({
      title: 'MATH',
      students: ['Matt', 'Jay']
    });

    const response = await request(app)
      .get(`/api/v1/courses/${course.id}`);
    
    expect(response.body).toEqual({
      ...course,
      students: ['Matt', 'Jay']
    });
  });

  it('finds all courses via GET', async() => {
    const courses = await Promise.all([
      { title: 'MATH' },
      { title: 'ENGLISH' },
      { title: 'HISTORY' }
    ].map(course => Course.insert(course)));

    const response = await request(app)
      .get('/api/v1/courses');

    expect(response.body).toEqual(expect.arrayContaining(courses));
    expect(response.body).toHaveLength(courses.length);
  });

  it('updates a course via PUT', async() => {
    const course = await Course.insert({
      title: 'MATH'
    });

    const response = await request(app)
      .put(`/api/v1/courses/${course.id}`)
      .send({
        title: 'ENGLISH'
      });

    expect(response.body).toEqual({
      id: course.id,
      title: 'ENGLISH'
    });
  });

  it('deletes a course by id', async() => {
    const course = await Course.insert({
      title: 'MATH'
    });

    const response = await request(app)
      .delete(`/api/v1/courses/${course.id}`);

    expect(response.body).toEqual(course);
  });
});
