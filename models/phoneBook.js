require('dotenv').config()
const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false)

console.log('connecting to database...')

mongoose.connect(url)
    .then(res => console.log('connected to database'))
    .catch(err => console.log(err))

const phoneBookSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: [3, 'person name should be more than 3 characters'],
        required: [true, 'person name is required']
    },
    number: {
        type: String,
        validate: {
            validator: value => /\d{2,3}-\d{6}/.test(value),
            message: props => `${props.value} is an invalid number`
        },
        required: [true, 'phone number is required']
    }
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