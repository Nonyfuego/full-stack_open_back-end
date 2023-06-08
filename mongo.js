//require('dotenv').config()
const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://nonyfuego:${password}@cluster0.qegyfml.mongodb.net/phoneBook?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)

console.log('connecting to database...')

mongoose.connect(url)
  .then(res => console.log('connected to server'))

const phoneBookSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const PhoneBook = mongoose.model('PhoneBook', phoneBookSchema)

if (process.argv.length < 4) {
  PhoneBook
    .find({})
    .then(contacts => {
      console.log('\nphonebook: ')
      contacts.forEach(c => {
        console.log(c.name, c.number)
      })
      mongoose.connection.close()
    })
    .catch(err => console.log(err))
} else {
  const contact = new PhoneBook({
    name: process.argv[3],
    number: process.argv[4] || 'none'
  })
  contact.save()
    .then(res => {
      console.log(`added ${res.name} ${res.number} to phone book`)
      mongoose.connection.close()
    })
    .catch(err => console.log(err))
}
