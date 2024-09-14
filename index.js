// Muss einmal in der Hauptdatei deklariert werden um env in der App zu verwenden
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');
const app = express();

app.use(express.static('dist'));
app.use(express.json());
app.use(cors());

morgan.token('body',(req) => {
    return JSON.stringify(req.body);
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));


app.get('/info', async (req, res) => {
    const date = new Date();
    const countPersons = await Person.countDocuments({});
    return res.send(
        `<div>Phonebook has info for ${countPersons} people</div><br/><div>${date}</div>`
    )
})

app.get('/api/persons', (req, res, next) => {
    Person.find({})
        .then((persons) => res.json(persons))
        .catch(error => next(error));
})

app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id)
        .then(person => {
            if(person){
                return res.json(person);
            }
            return res.status(404).send({message: 'Person Not Found'});
        })
        .catch( error => next(error));
})

app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndDelete(req.params.id)
        .then( result=> {
            return res.status(204).end();
        })
        .catch(error => next(error));
})

app.post('/api/persons', (req, res, next) => {
    const body = req.body;

    const person = new Person({
        name: body.name,
        number: body.number,
    });

    person.save()
        .then(savedPerson => {
        return res.json(savedPerson);
    })
        .catch(error => next(error));
})

app.put('/api/persons/:id' , (req, res, next) => {
    const { number } = req.body;
    Person.findByIdAndUpdate(
        req.params.id,
        {$set: {number}},
        {new: true,
            runValidators: true,
            context: 'query'
        })
        .then(result => {
            return res.json(result);
        })
        .catch(error => next(error));
})

const unknownEndpoint = (req, res) => {
    res.status(404).end('Not found');
}

// Muss vorletzte sein vor Error Hanlder
app.use(unknownEndpoint);

const errorHandler = (error, req, res, next) => {
    console.log(error);
    if (error.name === 'CastError') {
        return res.status(400).json({error: 'malformatted id'});
    } else if(error.name === 'ValidationError') {
        return res.status(400).json({error: error.message});
    }

    // Passing to default Express Error Handler
    next(error);
}

// Muss die letzte Middleware sein
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`);
})