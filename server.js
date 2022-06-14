/**
 * Server
 */

const path = require('path')
const express = require('express')
const cors = require('cors')
const history = require('connect-history-api-fallback')
const app = express()
const port = process.env.PORT_SERVER || 3010
const publicPath = path.resolve(__dirname, 'views')
const publicPath2 = path.resolve(__dirname, './views/panel')
const publicPath3 = path.resolve(__dirname, './views/form')
const staticConf = { maxAge: '1y', etag: false }
const mongoose = require('mongoose')

mongoose.connect(
  'mongodb+srv://admin:admin@cluster0.gkrxm.mongodb.net/ws-form?retryWrites=true&w=majority',
  (err, db) => {
    if (err) {
      console.log('Error al conectar la db')
      throw err
    }
    console.log('Base de datos conectada')
  }
)

/**MODELS */

const Admin = mongoose.model(
  'Admins',
  mongoose.Schema({
    name: String,
    username: {
      type: String,
      unique: true,
    },
    password: String,
    createdAt: Number,
  })
)

const Person = mongoose.model(
  'Persons',
  mongoose.Schema({
    name: String,
    lastname1: String,
    lastname2: String,
    birthdate: Number,
    district: String,
    town: String,
    country: String,
    phone: Number,
    worry: String,
    proposal: String,
    howToHelp: [String],
    aboutMe: [String],
    comeFrom: {
      type: String,
      ref: 'Persons',
    },
    sharedLink: Boolean,
    createdAt: Number,
  })
)

// const admin = new Admin({
//   name: 'Test2',
//   password: '123456',
//   username: 'test2',
//   createdAt: Date.now()
// })
// admin.save().then(() => console.log('meow'))

app.use(cors())
app.use(express.json())
app.use(express.static(publicPath, staticConf))
// app.use(express.static(publicPath2, staticConf))
app.use(history())
app.use(express.static(publicPath, staticConf))
app.use(express.static(publicPath2, staticConf))
// app.use(express.static(publicPath3))
// app.use('/form', express.static('views/form'));

// app.use(express.static('views/form'));
// app.use(express.static('views/panel'));

app.get('/panel', function(req, res) {
  res.render(path.join(__dirname, 'panel', 'index.html'))
})

// app.use('/form', express.static(publicPath3))
app.get('/form', function(req, res) {
  res.render(path.join(__dirname, 'form', 'index.html'))
})

/**USERS ADMIN */
app.post('/api/users/login', async (req, res, next) => {
  try {
    const { username } = req.body
    const user = await Admin.findOne({ username })
    res.json({ success: true, token: '123456789abcdefghi', user })
  } catch (error) {
    console.log('error', error)
    res.status(403).json({ error })
  }
})

app.post('/api/users/list', async (req, res, next) => {
  try {
    const admins = await Admin.find({})
      .sort({ createdAt: -1 })
      .lean()
    res.json({ success: true, user: admins })
  } catch (error) {
    console.log('error', error)
    res.status(403).json({ error })
  }
})

app.post('/api/users/create', async (req, res, next) => {
  try {
    const data = req.body
    data.createdAt = Date.now()
    const user = await Admin.create(data)
    res.json({ success: true, user })
  } catch (error) {
    console.log('error', error)
    res.status(403).json({ error })
  }
})

app.delete('/api/users/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    await Admin.remove({ _id: id })
    res.json({ success: true })
  } catch (error) {
    console.log('error', error)
    res.status(403).json({ error })
  }
})

/**PERSONS */

app.post('/api/persons/list', async (req, res, next) => {
  try {
    const persons = await Person.find({})
      .lean()
      .populate('comeFrom')
      .sort({ createdAt: -1 })
    res.json({ success: true, person: persons })
  } catch (error) {
    console.log('error', error)
    res.status(403).json({ error })
  }
})

app.post('/api/persons/create', async (req, res, next) => {
  try {
    const data = req.body
    data.createdAt = Date.now()
    data.birthdate = new Date(data.birthdate).getTime()
    const person = await Person.create(data)
    res.json({ success: true, person })
  } catch (error) {
    console.log('error', error)
    res.status(403).json({ error })
  }
})
app.put('/api/persons/:id', async (req, res, next) => {
  try {
    const data = req.body
    const { id } = req.params
    await Person.updateOne({ _id: id }, { $set: { ...data } })
    res.json({ success: true })
  } catch (error) {
    console.log('error', error)
    res.status(403).json({ error })
  }
})

app.listen(port, () => {
  console.log(`App running on port ${port}!`)
})
