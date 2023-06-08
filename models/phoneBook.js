require('dotenv').config()
const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false)

console.log('connecting to database...')

mongoose.connect(url)
    .then(res => console.log('connected to database'))
    .catch(err => console.log(err))

const phoneBookSchema = new mongoose.Schema({
    name: String,
    number: String
})

phoneBookSchema.set('toJSON', {
    transform: (_doc, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const PhoneBook = mongoose.model('PhoneBook', phoneBookSchema)

module.exports = PhoneBook