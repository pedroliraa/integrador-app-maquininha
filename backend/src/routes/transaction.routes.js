const express = require('express')
const router = express.Router()

const {
  getLastTransaction
} = require('../controllers/transaction.controller')

router.get('/last-transaction', getLastTransaction)

module.exports = router