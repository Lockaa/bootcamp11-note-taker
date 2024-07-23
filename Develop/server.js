const express = require('express');
const path = require('path');
const fs = require('fs');
const {json} = require('stream/consumers');

const PORT = process.env.PORT || 3333;

const app = express();
// Base route - domain.com (root route) is represented by a '/' - this slash directly follows the domain address

// Middleware - adding a layer to the server "onion" or removing a layer from the onion
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));

// View Routes
app.get('/notes', (requestObj, responseObj) => {
  responseObj.sendFile(path.join(__dirname, './public/notes.html'));
});


// API Routes
app.get('/api/notes', (requestObj, responseObj) => {
    fs.readFile('./db/db.json', (err, output) => {
        if(err) {
            throw err;
        }
        let noteArray = JSON.parse(output);
        responseObj.send(noteArray);
    })
});

app.post('/api/notes', (requestObj, responseObj) =>{
    fs.readFile('./db/db.json', (err, output) => {
        if(err) {
            throw err;
        }
        let noteArray = JSON.parse(output);
        noteArray.push(requestObj.body);
        
        
        fs.writeFile('./db/db.json', JSON.stringify(noteArray), (err) => {
            if (err) {
              console.log(err);
            }
        });
    })
    
});

// The wildcard route MUST be below all other routes
app.get('*', (requestObj, responseObj) => {
  responseObj.sendFile(path.join(__dirname, './public/index.html'));
});


app.listen(PORT, () => {
  console.log('Server started');
})