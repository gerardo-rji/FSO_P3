const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB', error.message)
  })

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true,
    trim: true
  },
  number: {
    type: String,
    required: true,
    validate: {
      validator: v => {
        const formatOk = /^\d{2,3}-\d{5,}$/.test(v)

        const digitCountOk = v.replace(/\D/g, '').length >= 8

        return formatOk && digitCountOk
      },
      message: props => `${props.value} is not a valid phone number`
    }
  }
})

contactSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Contact', contactSchema)