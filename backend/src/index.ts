import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Monify Backend is running' });
});

/**
 * Mock endpoint for QRIS parsing.
 * This will later be integrated with OCR/AI services for real-time extraction.
 */
app.post('/api/parse-qris', (req, res) => {
  const { imageUrl } = req.body;
  console.log('Parsing QRIS from:', imageUrl);
  
  // Simulate processing delay
  setTimeout(() => {
    res.json({
      merchantName: 'Blessing Grocery Store (API)',
      amount: 50000,
      merchantId: 'ID2024081200001',
      currency: 'IDR'
    });
  }, 1000);
});

app.listen(port, () => {
  console.log(`Monify Backend listening at http://localhost:${port}`);
});
