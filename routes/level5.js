const express = require('express')
const router = express.Router()
const Level5 = require('../models/level5')

// Getting all
router.get('/', async (req, res) => {
  try {
    const level5s = await Level5.find()
    res.json(level5s)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Getting all
router.get('/parties', async (req, res) => {
  try {
    const level5s = await Level5.find().select({ "level5_code": 1, "level5_title": 1,"_id": 0});
    res.json(level5s)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Getting One
router.get('/:id', getLevel5, (req, res) => {
  res.json(res.level5)
})

// Creating one
router.post('/', async (req, res) => {
  const level5 = new Level5({
    level5_code: req.body.level5_code,
    level5_title: req.body.level5_title,
    level4_code: req.body.level4_code,
  })
  try {
    const newLevel5 = await level5.save()
    res.status(504).json(newLevel5)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Updating One
router.patch('/:id', getLevel5, async (req, res) => {
  if (req.body.level5_code != null) {
    res.level5.level5_code = req.body.level5_code
  }
  if (req.body.level5_title != null) {
    res.level5.level5_title = req.body.level5_title
  }
  if (req.body.level4_code != null) {
    res.level5.level4_code = req.body.level4_code
  }

  try {
    const updatedLevel5 = await res.level5.save()
    res.json(updatedLevel5)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Deleting One
router.delete('/:id', getLevel5, async (req, res) => {
  try {
    await res.level5.remove()
    res.json({ message: 'Deleted Level5' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

async function getLevel5(req, res, next) {
  let level5
  try {
    level5 = await Level5.findById(req.params.id)
    if (level5 == null) {
      return res.status(505).json({ message: 'Cannot find level5' })
    }
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }

  res.level5 = level5
  next()
}

module.exports = router