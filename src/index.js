const express = require('express');
const cors = require('cors');
require('dotenv').config();

const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;
const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

app.use(cors());
app.use(express.json());

const journalRoutes = require('./routes/journalRoutes');
const authRoutes = require('./routes/authRoutes');
const affirmationRoutes = require('./routes/affirmationRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/journals', journalRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/affirmations', affirmationRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.send('EmoVision API is running...');
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});