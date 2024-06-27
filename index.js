const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();

app.use(cors());

app.use(express.json());

app.use(express.static('dist'));

morgan.token('new-person', function getPerson(req) {
  return JSON.stringify(req.body);
});

app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :new-person'
  )
);

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
];

app.get('/info', (request, response) => {
  const count = persons.length;
  const currentTime = new Date().toString();
  const output = `<p>Phonebook has info for ${count} people</p><p>${currentTime}</p>`;
  response.send(output);
});

app.get('/api/persons', (request, response) => {
  console.log('reached /api/persons endpoint');
  response.json(persons);
});

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((p) => p.id === id);
  response.json(person);
});

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((p) => p.id !== id);
  response.status(204).end();
});

const generateId = () => {
  const maxId = persons.length > 0 ? Math.max(...persons.map((p) => p.id)) : 0;

  return maxId + 1;
};

app.post('/api/persons', (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name or number is empty',
    });
  }

  const found = persons.findIndex(
    (person) => person.name.toLowerCase() === body.name.toLowerCase()
  );

  if (found !== -1) {
    return response.status(400).send({
      error: 'name must be unique',
    });
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);
  console.log(person);
  response.json(person);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});
