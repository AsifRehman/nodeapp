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

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))
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

// app.get('/db/get-account-balance/:id', (req, res)=> {
//   res.json({"BALANCE": "10,0000 CR.", "AMOUNT": "10,0000", "ID": req.params.id})
// })

app.post('/db/get-account-balance', (req, res)=> {
  console.log(req.body)
  res.json({"BALANCE": "10,0000 CR.", "AMOUNT": "10,0000"})
})

app.post('/test', (req, res) => {
  console.log('Got body:', req.body);
  res.sendStatus(200);
});

app.listen(process.env.PORT || 3000)