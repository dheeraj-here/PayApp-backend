const express = require('express');
const http = require('http');
const mongoose = require('mongoose')
const signUpApi = require('./src/routes/signup')
const loginApi = require('./src/routes/login')
const getUsers = require('./src/routes/getUsers')
const profile = require('./src/routes/getSingleUser')
const transfer = require('./src/routes/transfer')
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the cors middleware

const app = express();

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb+srv://bagwandheeraj12:payapp@cluster0.zx90bmp.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log("Successfully connect to MongoDB.");
})
.catch(err => {
  console.error("Connection error", err);
  process.exit();
});

app.use(express.json())

// Middleware
app.use('/api', signUpApi);
app.use('/api', loginApi);
app.use('/api', getUsers);
app.use('/api', profile);
app.use('/api', transfer);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
