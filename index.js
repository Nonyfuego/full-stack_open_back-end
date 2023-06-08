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

app.get('/api/persons', (_req, res) => {
    PhoneBook.find({})
        .then(persons => res.json(persons))
        .catch(err => console.log(err))
})

/*app.get('/info', (_req, res) => {
    let date = new Date()
    let phoneBookInfo = `phonebook has info of ${persons.length} people`
    res.send(
        `<p>${phoneBookInfo}</p>
        <p>${date}</p>`
    )
})
*/
app.get('/api/persons/:id', (req, res) => {
    let id = Number(req.params.id)
    PhoneBook
        .findById(id)
        .then(person => {
            if (!person) res.status(404).end()
            else res.json(person)
        })
        .catch(err => console.log('err: ', err))
})

app.post('/api/persons', (req, res) => {        
    // custom morgan token 
    // log request data using morgan
    req.data = JSON.stringify(req.body)
    let data = req.body
    if (!data.name) {
        res.status(400).json({error: "name is missing"})
    } else if (!data.number) {
        res.status(400).json({error: "number is missing"})
    } else {
        let newPerson = new PhoneBook({
            name: data.name,
            number: data.number
        })
        newPerson.save()
            .then(data => res.status(201).json(data))
            .catch(err => console.log(err))
    }
})

const unknownEndPoint = (_req, res) => res.status(404).end()

app.use(unknownEndPoint)

app.listen(PORT, () => {
    console.log('app listening in port', PORT)
})

