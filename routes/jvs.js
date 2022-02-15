const express = require('express')
const router = express.Router()
const JV = require('../models/jv')

// All Authors Route
router.get('/', async (req, res) => {
  let searchOptions = {}
  if (req.query.name != null && req.query.name !== '') {
    searchOptions.name = new RegExp(req.query.name, 'i')
  }
  try {
    const jvs = await JV.find(searchOptions)
    res.render('jvs/index', {
      jvs: jvs,
      searchOptions: req.query
    })
  } catch {
    res.redirect('/')
  }
})

// New Author Route
router.get('/new', (req, res) => {
  res.render('jvs/new', { jv: new JV() })
})

// Create Author Route
router.post('/', async (req, res) => {
  const jv = new JV({
    name: req.body.name
  })
  try {
    const newJV = await jv.save()
    res.redirect(`jvs/${jv.id}`)
  } catch {
    res.render('jvs/new', {
      jv: jv,
      errorMessage: 'Error creating Author'
    })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const jv = await JV.findById(req.params.id)
//    const books = await Book.find({ author: author.id }).limit(6).exec()
    res.render('jvs/show', {
      jv: jv
//      booksByAuthor: books
    })
  } catch {
    res.redirect('/')
  }
})

router.get('/:id/edit', async (req, res) => {
  try {
    const jv = await JV.findById(req.params.id)
    res.render('jvs/edit', { jv: jv })
  } catch {
    res.redirect('/jvs')
  }
})

router.put('/:id', async (req, res) => {
  let jv
  try {
    jv = await JV.findById(req.params.id)
    jv.name = req.body.name
    await jv.save()
    res.redirect(`/jvs/${jv.id}`)
  } catch {
    if (jv == null) {
      res.redirect('/')
    } else {
      res.render('jvs/edit', {
        jv: jv,
        errorMessage: 'Error updating JV'
      })
    }
  }
})

router.delete('/:id', async (req, res) => {
  let jv
  try {
    jv = await JV.findById(req.params.id)
    await jv.remove()
    res.redirect('/jvs')
  } catch {
    if (jv == null) {
      res.redirect('/')
    } else {
      res.redirect(`/jvs/${jv.id}`)
    }
  }
})

module.exports = router