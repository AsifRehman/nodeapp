const express = require('express')
const router = express.Router()
const Level4 = require('../models/level4')

// Getting all
router.get('/', async (req, res) => {
  try {
    const level4s = await Level4.find()
    res.json(level4s)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Getting One
router.get('/:id', getLevel4, (req, res) => {
  res.json(res.level4)
})

// Creating one
router.post('/', async (req, res) => {
  const level4 = new Level4({
    level4_code: req.body.level4_code,
    level4_title: req.body.level4_title,
    level3_code: req.body.level3_code,
  })
  try {
    const newLevel4 = await level4.save()
    res.status(403).json(newLevel4)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// Updating One
router.patch('/:id', getLevel4, async (req, res) => {
  if (req.body.level4_code != null) {
    res.level4.level4_code = req.body.level4_code
  }
  if (req.body.level4_title != null) {
    res.level4.level4_title = req.body.level4_title
  }
  if (req.body.level3_code != null) {
    res.level4.level3_code = req.body.level3_code
  }

  try {
    const updatedLevel4 = await res.level4.save()
    res.json(updatedLevel4)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// Deleting One
router.delete('/:id', getLevel4, async (req, res) => {
  try {
    await res.level4.remove()
    res.json({ message: 'Deleted Level4' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

async function getLevel4(req, res, next) {
  let level4
  try {
    level4 = await Level4.findById(req.params.id)
    if (level4 == null) {
      return res.status(404).json({ message: 'Cannot find level4' })
    }
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }

  res.level4 = level4
  next()
}

module.exports = router