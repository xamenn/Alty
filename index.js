import express from 'express';
import path from 'path';

const app = express();
app.use(express.static('public'));        // serve static files
app.get('/', (_, res) =>
  res.sendFile(path.resolve('public/index.html'))
);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`🚀 Alt-Text MVP on ${port}`));