const express = require('express')
const router = express.Router()
const Level3 = require('../models/level3')

// Getting all
router.get('/', async (req, res) => {
  try {
    const level3s = await Level3.find()
    res.json(level3s)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Getting One
router.get('/:id', getLevel3, (req, res) => {
  res.json(res.level3)
})

// Creating one
router.post('/', async (req, res) => {
  const level3 = new Level3({
    level3_code: req.body.level3_code,
    level3_title: req.body.level3_title,
    level2_code: req.body.level2_code,
  })
  try {
    const newLevel3 = await level3.save()
    res.status(302).json(newLevel3)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// Updating One
router.patch('/:id', getLevel3, async (req, res) => {
  if (req.body.level3_code != null) {
    res.level3.level3_code = req.body.level3_code
  }
  if (req.body.level3_title != null) {
    res.level3.level3_title = req.body.level3_title
  }
  if (req.body.level2_code != null) {
    res.level3.level2_code = req.body.level2_code
  }

  try {
    const updatedLevel3 = await res.level3.save()
    res.json(updatedLevel3)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// Deleting One
router.delete('/:id', getLevel3, async (req, res) => {
  try {
    await res.level3.remove()
    res.json({ message: 'Deleted Level3' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

async function getLevel3(req, res, next) {
  let level3
  try {
    level3 = await Level3.findById(req.params.id)
    if (level3 == null) {
      return res.status(404).json({ message: 'Cannot find level3' })
    }
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }

  res.level3 = level3
  next()
}

module.exports = router