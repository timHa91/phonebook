const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
require('dotenv').config()


const Person = require('./models/person');

app.use(cors());
app.use(express.json());
morgan.token('body',(req) => {
    return JSON.stringify(req.body);
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));
app.use(express.static('dist'));

app.get('/info', (req, res) => {
    const date = new Date();
    return res.send(
        `<div>Phonebook has info for ${persons.length} people</div><br/><div>${date}</div>`
    )
})

app.get('/api/persons', (req, res) => {
    Person.find({})
        .then((persons) => res.json(persons));
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
    Person.findById(id)
        .then(person => {
            if(person){
                return res.json(person);
            }
            res.status(404).end();
        })
        .catch( err => {
            console.log(err)
            return res.status(500).end();
        })

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

    // const isNotUnique = persons.some(person => person.name === body.name);
    // if(isNotUnique) {
    //     return res.status(400).json({error: 'name must be unique'});
    // }

    const person = new Person({
        name: body.name,
        number: body.number,
    });

    person.save().then(savedPerson => {
        return res.json(savedPerson);
    });
})

const unknownEndpoint = (req, res) => {
    res.status(404).end('Not found');
}

app.use(unknownEndpoint);


const PORT = process.env.PORT;
app.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`);
})