const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');  
const dotenv = require('dotenv');

dotenv.config();
const app = express();


app.use(cors({
  origin: 'http://localhost:3000',  
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log(' MongoDB connected'))
  .catch(err => console.log('MongoDB error:', err));

app.get('/', (req, res) => res.send(' FarmLand API running'));


app.use(express.json());
app.use('/api/auth', require('./routes/auth'));
app.use('/api/listings', require('./routes/listings'));
app.use('/api/admin', require('./routes/admin'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server running on http://localhost:${PORT}`));
