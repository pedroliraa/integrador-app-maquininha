exports.getLastTransaction = async (req, res) => {
  try {
    return res.json({
      customerName: "João Silva",
      customerPhone: "83999999999",
      amount: 150.00,
      transactionId: "ABC123456",
      date: new Date()
    })
  } catch (error) {
    return res.status(500).json({
      message: 'Erro ao buscar transação'
    })
  }
}