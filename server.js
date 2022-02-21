if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load()
}

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')

const initializePassport = require('./passport-config')
initializePassport(
  passport,
  username => users.find(user => user.username === username),
  id => users.find(user => user.id === id)
)

const users = []

app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

const indexRouter = require('./routes/index')
const authorRouter = require('./routes/authors')
const bookRouter = require('./routes/books')
const jvRouter = require('./routes/jvs')
const cpRouter = require('./routes/cps')
const crRouter = require('./routes/crs')
const dbRouter = require('./routes/db')
const level1Router = require('./routes/level1')
const level2Router = require('./routes/level2')
const level3Router = require('./routes/level3')
const level4Router = require('./routes/level4')
const level5Router = require('./routes/level5')

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.set('layout login', false)
app.use(expressLayouts)
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))

app.use('/', indexRouter)

app.get('/login', checkNotAuthenticated, (req, res) => {
  console.log(users)
  res.render('login.ejs', {layout: 'layouts/layout2'})
})

app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))

app.get('/register', checkNotAuthenticated, (req, res) => {
  res.render('register.ejs')
})

app.post('/register', checkNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)

    users.push({
      id: Date.now().toString(),
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword
    })
    res.redirect('/login')
  } catch {
    res.redirect('/register')
  }
})

app.delete('/logout', (req, res) => {
  req.logOut()
  res.redirect('/login')
})

function checkAuthenticated(req, res, next) {
  console.log(req.isAuthenticated())
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
  console.log(req.isAuthenticated(), "not authenticated")
  if (req.isAuthenticated()) {
    return res.redirect('/')
  }
  next()
}



app.use('/authors', authorRouter)
app.use('/books', bookRouter)
app.use('/jvs',  jvRouter)
app.use('/cps',  cpRouter)
app.use('/crs', crRouter)
app.use('/level1', level1Router)
app.use('/level2', level2Router)
app.use('/level3', level3Router)
app.use('/level4', level4Router)
app.use('/level5', level5Router)

app.use('/db', dbRouter)

var server = app.listen(process.env.PORT || 3000, ()=> {
  console.log("Calling app.listen's callback function.");
  var port = server.address().port;
  console.log('Example app listening at http://localhost:%s/cps', port);

})