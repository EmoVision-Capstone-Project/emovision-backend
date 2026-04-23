const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Halo Zila! Backend EmoVision sudah berjalan dengan baik');
});

app.listen(PORT, () => {
  console.log(`Server sedang berjalan di http://localhost:${PORT}`);
});