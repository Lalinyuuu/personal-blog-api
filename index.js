const express = require('express');
const app = express();

app.get('/profiles', (req, res) => {
  res.status(200).json({
    data: { name: 'john', age: 20 }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API running at http://localhost:${PORT}`);
});