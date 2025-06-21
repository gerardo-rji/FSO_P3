require('dotenv').config()
const express = require('express');
const app = express();
const Contact = require('./models/contact')
const morgan = require('morgan');
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use(express.static('dist'))
//app.use(morgan('tiny'));

morgan.token("data", req =>
  req.method === "POST" && req.path === "/api/persons"
    ? JSON.stringify(req.body)
    : ''
)

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'));

/*  let persons = [
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
*/

app.get('/api/persons', (req, res) => {
  Contact.find({}).then(contacts => {
    res.json(contacts)
  })
})

/*  app.get('/info', (req, res) => {
    const now = new Date()
    res.send(`Phonebook has info for ${persons.length} people</br>
      ${now}`)
  })
*/

app.get('/api/persons/:id', (req, res) => {
  Contact.findById(req.params.id).then(contact => {
    res.json(contact)
  })
})

/*  app.delete('/api/persons/:id', (req,res) => {
    const id = Number(req.params.id) // ":id" type of str
    persons = persons.filter(person => person.id !== id)

    res.status(204).end()
  })
*/

app.post('/api/persons', (req, res) => {
  const body = req.body

  if (!body.name || !body.number) {
    return res.status(400).json({error: 'Content missing'})
  }

  const contact = new Contact({
    name: body.name,
    number: body.number
  })

  contact.save().then(savedContact => {
    res.json(savedContact)
  })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})