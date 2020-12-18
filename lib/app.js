const express = require('express');
const { findById } = require('./models/Course');
const Course = require('./models/Course');
const app = express();

app.use(express.json());

// endpoints
app.post('/api/v1/courses', (req, res, next) => {
  Course
    .insert(req.body)
    .then(course => res.send(course))
    .catch(next);
});

app.get('/api/v1/courses/:id', (req, res, next) => {
  Course
    .findById(req.params.id)
    .then(course => res.send(course))
    .catch(next);
});

app.get('/api/v1/courses', (req, res, next) => {
  Course
    .find()
    .then(courses => res.send(courses))
    .catch(next);
});

app.put('/api/v1/courses/:id', (req, res, next) => {
  Course
    .update(req.params.id, req.body)
    .then(course => res.send(course))
    .catch(next);
});

app.delete('/api/v1/courses/:id', (req, res, next) => {
  Course
    .delete(req.params.id)
    .then(course => res.send(course))
    .catch(next);
});

module.exports = app;
