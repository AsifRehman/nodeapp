if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load()
}

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

const indexRouter = require('./routes/index')
const authorRouter = require('./routes/authors')
const bookRouter = require('./routes/books')
const jvRouter = require('./routes/jvs')
const dbRouter = require('./routes/db')
const level1Router = require('./routes/level1')
const level2Router = require('./routes/level2')
const level3Router = require('./routes/level3')
const level4Router = require('./routes/level4')
const level5Router = require('./routes/level5')

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))

app.use('/', indexRouter)
app.use('/authors', authorRouter)
app.use('/books', bookRouter)
app.use('/jvs', jvRouter)
app.use('/level1', level1Router)
app.use('/level2', level2Router)
app.use('/level3', level3Router)
app.use('/level4', level4Router)
app.use('/level5', level5Router)

app.use('/db', dbRouter)

app.listen(process.env.PORT || 3000)