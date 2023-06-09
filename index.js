//require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const PhoneBook = require('./models/phoneBook')

const app = express()
const PORT = process.env.PORT

// custom token, log POST request data
morgan.token('data', (req) => req.data)

app.use(cors())

app.use(express.static('dist'))

app.use(express.json())

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

app.get('/api/persons', (_req, res, next) => {
    PhoneBook.find({})
        .then(persons => res.json(persons))
        .catch(err => next(err))
})

app.get('/info', (_req, res, next) => {
    PhoneBook.find({})
    .then(data => {
        let date = new Date()
        let phoneBookInfo = `phonebook has info of ${data.length} people`
        res.send(
            `<p>${phoneBookInfo}</p>
            <p>${date}</p>`
        )    
    })
    .catch(err => next(err))
})

app.get('/api/persons/:id', (req, res, next) => {
    let id = req.params.id
    PhoneBook
        .findById(id)
        .then(person => {
            if (!person) res.status(404).end()
            else res.json(person)
        })
        .catch(err => next(err))
})

app.post('/api/persons', (req, res, next) => {        
    // custom morgan token 
    // log request data using morgan
    req.data = JSON.stringify(req.body)
    let data = req.body
        let newPerson = new PhoneBook({
            name: data.name,
            number: data.number
        })
        newPerson.save()
            .then(data => res.status(201).json(data))
            .catch(err => next(err))
})

app.delete('/api/persons/:id', (req, res, next) => {
    PhoneBook.findByIdAndDelete(req.params.id)
        .then(_result => res.status(204).end())
        .catch(err => next(err))
})

app.put('/api/persons/:id', (req, res, next) => {
    PhoneBook
        .findByIdAndUpdate(
            req.params.id, 
            req.body, 
            {new: true, runValidators: true, context: 'query'}
        )
        .then(data => res.json(data))
        .catch(err => next(err))
})

const unknownEndPoint = (_req, res) => res.status(404).end()

app.use(unknownEndPoint)

const errorHandler = (error, req, res, next) => {
    //console.log('\n', error.errors.name, '\n')
    if (error.name === 'CastError') {
        console.log(error)
        return res.status(400).json({error: 'malformed Id'})
    }
    if (error.name === 'ValidationError') {
        //console.log()
        let errKey = Object.keys(error.errors)[0]
        return res.status(400).json({error: error.errors[errKey].message})
    }
    next(error)
}

app.use(errorHandler)

app.listen(PORT, () => {
    console.log('app listening in port', PORT)
})

