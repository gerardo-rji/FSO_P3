const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://gerarji96:${password}@cluster0.zrd0myq.mongodb.net/phoneBookDB?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Contact = mongoose.model('Contact', noteSchema)

if (process.argv.length === 3) {
  Contact.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(contact => {
    console.log(contact.name, contact.number)
    })
  mongoose.connection.close()
  })
} else {
  const contact = new Contact({
    name: process.argv[3],
    number: process.argv[4]
  })

  contact.save().then(result => {
    console.log(`added ${result.name} number ${result.number} to phonebook`)
    mongoose.connection.close()
  })
}
