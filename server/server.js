   // server.js
   const express = require('express');
   const mysql = require('mysql2');
   const cors = require('cors');

   const app = express();
   const port = 3001;

   // Create a connection to the database
   const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'rooteews',
    password: 'eews2022',
    database: 'latency'
   });

   // Connect to the database
   connection.connect(err => {
       if (err) {
           console.error('Error connecting to the database:', err.message);
           return;
       }
       console.log('Connected to the MySQL database');
   });

   // Define an endpoint to get markers
   app.get('/markers', (req, res) => {
       connection.query('SELECT * FROM sensor', (err, results) => {
           if (err) {
               console.error('Error fetching markers:', err.message);
               res.status(500).send('Error fetching markers');
               return;
           }
           res.json(results);
       });
   });

   app.use(cors());

   app.listen(port, () => {
       console.log(`Server running at http://localhost:${port}`);
   });
