const express = require('express');
const app = express();
const connectDB = require('./config/db');
connectDB();
app.get('/',(req,res)=>res.send('Api running'));

const PORT = process.env.PORT || 5000
app.use(express.json())
//Define Routes
app.use('/api/users',require('./routes/api/users'))
app.use('/api/profile',require('./routes/api/profile'))
app.use('/api/auth',require('./routes/api/auth'))
app.use('/api/post',require('./routes/api/post'))

app.listen(PORT, () => console.log(PORT));
