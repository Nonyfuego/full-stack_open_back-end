const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
const PORT = 3001
const generateId = () => Math.round(Math.random() * 1000000)
let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

// custom token, log response data
morgan.token('data', (req) => req.data)

app.use(cors())

//app.use(express.static())

app.use(express.json())

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

app.get('/api/persons', (_req, res) => {
    res.json(persons)
})

app.get('/info', (_req, res) => {
    let date = new Date()
    let phoneBookInfo = `phonebook has info of ${persons.length} people`
    res.send(
        `<p>${phoneBookInfo}</p>
        <p>${date}</p>`
    )
})

app.get('/api/persons/:id', (req, res) => {
    let id = Number(req.params.id)
    let person = persons.find(p => p.id === id)
    if (!person) {
        res.status(404).end()
    } else {
        res.json(person)
    }   
})

app.post('/api/persons', (req, res) => {        
    // custom morgan token 
    // log request data using morgan
    req.data = JSON.stringify(req.body)
    let newPerson = req.body
    newPerson.id = generateId()
    if (!newPerson.name) {
        let errorMsg = {error: "name is missing"}
        res.data = JSON.stringify(errorMsg)
        res.status(400).json()
    } else if (!newPerson.number) {
        let errorMsg = {error: "number is missing"}
        res.data = JSON.stringify(errorMsg)
        res.status(400).json()
    } else if (persons.some(p => p.name === newPerson.name)) {
        let errorMsg = {error: "name must be unique"}
        res.data = JSON.stringify(errorMsg)
        res.status(400).json(errorMsg) 
    } else {
        persons = persons.concat(newPerson)

        res.status(201).json(newPerson)
    }
})

app.listen(PORT, () => {
    console.log('app listening in port', PORT)
})

