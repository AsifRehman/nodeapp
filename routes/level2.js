const express = require('express')
const router = express.Router()
const Level2 = require('../models/level2')

// Getting all
router.get('/', async (req, res) => {
  try {
    const level2s = await Level2.find()
    res.json(level2s)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Getting One
router.get('/:id', getLevel2, (req, res) => {
  res.json(res.level2)
})

// Creating one
router.post('/', async (req, res) => {
  const level2 = new Level2({
    level2_code: req.body.level2_code,
    level2_title: req.body.level2_title,
    level1_code: req.body.level1_code,
  })
  try {
    const newLevel2 = await level2.save()
    res.status(201).json(newLevel2)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// Updating One
router.patch('/:id', getLevel2, async (req, res) => {
  if (req.body.level2_code != null) {
    res.level2.level2_code = req.body.level2_code
  }
  if (req.body.level2_title != null) {
    res.level2.level2_title = req.body.level2_title
  }
  if (req.body.level1_code != null) {
    res.level2.level1_code = req.body.level1_code
  }

  try {
    const updatedLevel2 = await res.level2.save()
    res.json(updatedLevel2)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// Deleting One
router.delete('/:id', getLevel2, async (req, res) => {
  try {
    await res.level2.remove()
    res.json({ message: 'Deleted Level2' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

async function getLevel2(req, res, next) {
  let level2
  try {
    level2 = await Level2.findById(req.params.id)
    if (level2 == null) {
      return res.status(404).json({ message: 'Cannot find level2' })
    }
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }

  res.level2 = level2
  next()
}

module.exports = router