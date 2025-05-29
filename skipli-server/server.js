const express = require('express');
const app = express();
const cors = require('cors');
const corsOptions = { 
    origin: '*', // Allow all origins
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204 
    };

app.use(cors(corsOptions));

app.get('/api', (req, res) => {

  res.json({
    message: 'Hello from Skipli Server!'
  });

});

app.listen(8080, () => {
  console.log('Skipli Server is running on http://localhost:8080');
});