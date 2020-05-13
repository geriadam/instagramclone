const express = require('express');
const app     = express();
const mongoose = require('mongoose');
const PORT    = 5000;
const { MONGO_URL } = require('./keys');

require('./models/user')
require('./models/post')

app.use(express.json())
app.use(require('./routes/auth'))
app.use(require('./routes/post'))

mongoose.connect(MONGO_URL, {
    useNewUrlParser: true, 
    useUnifiedTopology: true
})

mongoose.connection.on('connected', () => {
    console.log("CONNECTED");
})

mongoose.connection.on('error', (err) => {
    console.log("ERROR", err);
})

app.listen(PORT, () => {
    console.log("server running on ", PORT);
})
