const express = require('express')
const app = express()
const PORT = 3001

const persons = [
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

app.listen(PORT, () => {
    console.log('app listening in port', PORT)
})

