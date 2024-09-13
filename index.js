const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
morgan.token('body',(req) => {
    return JSON.stringify(req.body);
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));
app.use(express.static('dist'));

let persons = [
    {
        "id": "1",
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": "2",
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": "3",
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": "4",
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get('/info', (req, res) => {
    const date = new Date();
    return res.send(
        `<div>Phonebook has info for ${persons.length} people</div><br/><div>${date}</div>`
    )
})

app.get('/api/persons', (req, res) => {
    res.json(persons);
})

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id;
    const foundPerson = persons.find(person => person.id === id);

    if(!foundPerson) {
        res.status(404).json({
            error: 'No such person found'
        });
    }

    return res.json(foundPerson);
})

app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id;
    persons = persons.filter(person => person.id !== id);

    return res.status(204).end();
})

app.post('/api/persons', (req, res) => {
    const body = req.body;

    if (!body.name ) {
        return res.status(400).json(
            {error: 'name missing'}
        )
    }

    if (!body.number ) {
        return res.status(400).json({
            error: 'number missing'
        })
    }


    const isNotUnique = persons.some(person => person.name === body.name);
    if(isNotUnique) {
        return res.status(400).json({error: 'name must be unique'});
    }

    const id = Math.floor(Math.random() * 1000).toString();
    const person = {
        id: id,
        name: body.name,
        number: body.number,
    }

    persons = persons.concat(...persons, person);

    return res.json(person);
})

const unknownEndpoint = (req, res) => {
    res.status(404).end('Not found');
}

app.use(unknownEndpoint);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`);
})