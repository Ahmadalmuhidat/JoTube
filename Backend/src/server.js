import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes/routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

app.use('/api', routes);

app.get('/', (req, res) => {
  res.send('JoTube Backend API is running');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
