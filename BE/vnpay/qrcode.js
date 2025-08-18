
const crypto = require('crypto'); // Import crypto library
const config2 = require('./qrcode');


let transactions = {}; // Lưu trữ trạng thái giao dịch

const generateTransactionId = () => {
  return crypto.randomBytes(4).toString('hex').substring(0, 7);
};

// Endpoint để tạo VietQR
app.post('/create-vietqr', (req, res) => {
  const { amount=10000, courseName } = req.body;
  const transactionId = generateTransactionId();

  const qrUrl = `https://img.vietqr.io/image/${config2.bankInfo.bankId}-${config2.bankInfo.bankAccount}-${config2.bankInfo.template}.png?amount=${amount}&addInfo=${encodeURIComponent(courseName + ' Ma giao dich ' + transactionId)}&accountName=${encodeURIComponent(config2.bankInfo.accountName)}`;
  transactions[transactionId] = { status: 'pending', amount, courseName };

  res.json({ qrUrl, transactionId });
});

app.get('/check-transaction-status/:transactionId', async (req, res) => {
  const { transactionId } = req.params;
  const transaction = transactions[transactionId];

  if (transaction) {
    try {
      const response = await axios.get(`${config2.casso.apiUrl}/transactions`, {
        headers: {
          'Authorization': `Apikey ${config2.casso.apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      console.log(response.data.data.records);
      const transactionsData = response.data.data.records;      
      const updatedTransaction = transactionsData.find(t => t.description.includes(transactionId));
      if (updatedTransaction) {
        // Giả sử nếu tìm thấy, cập nhật trạng thái thành 'success'
        transactions[transactionId].status = 'success';
        res.json({ status: 'success', transaction: updatedTransaction });
      } else {
        res.json({ status: 'pending' });
      }

    } catch (error) {
      console.error('Error checking transaction status:', error.response ? error.response.data : error.message);
      res.status(500).json({ error: 'Error checking transaction status' });
    }
  } else {
    res.status(404).json({ error: 'Transaction not found' });
  }
});
