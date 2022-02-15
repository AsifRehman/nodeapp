const express = require('express')
const router = express.Router()
const Level1 = require('../models/level1')

// Getting all
router.get('/', async (req, res) => {
  try {
    const level1s = await Level1.find()
    res.json(level1s)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Getting One
router.get('/:id', getLevel1, (req, res) => {
  res.json(res.level1)
})

// Creating one
router.post('/', async (req, res) => {
  const level1 = new Level1({
    level1_code: req.body.level1_code,
    level1_title: req.body.level1_title
  })
  try {
    const newLevel1 = await level1.save()
    res.status(201).json(newLevel1)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// Updating One
router.patch('/:id', getLevel1, async (req, res) => {
  if (req.body.level1_code != null) {
    res.level1.level1_code = req.body.level1_code
  }
  if (req.body.level1_title != null) {
    res.level1.level1_title = req.body.level1_title
  }
  try {
    const updatedLevel1 = await res.level1.save()
    res.json(updatedLevel1)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// Deleting One
router.delete('/:id', getLevel1, async (req, res) => {
  try {
    await res.level1.remove()
    res.json({ message: 'Deleted Level1' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

async function getLevel1(req, res, next) {
  let level1
  try {
    level1 = await Level1.findById(req.params.id)
    if (level1 == null) {
      return res.status(404).json({ message: 'Cannot find level1' })
    }
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }

  res.level1 = level1
  next()
}

module.exports = router