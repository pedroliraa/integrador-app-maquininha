const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())

const transactionRoutes = require('./routes/transaction.routes')

app.use('/api', transactionRoutes)

const PORT = 3000

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server rodando na porta ${PORT}`)
})