var express = require('express');
var app = express();

//var Animal = require('./Animal.js');
//var Toy = require('./Toy.js');


app.get('/', (req, res) => {
	//res.json({ msg : 'It works!' });
	res.write('Hello Worlds this is Osei!');
    });

app.get('/findToys', (req, res) => {
	res.write('This is the findToys page');
});

app.get('/findAnimals', (req, res) => {
	res.write('This is the findAnimals page');
});

app.get('/animalsYoungerThan', (req, res) => {
	res.write('This is the animalsYoungerThan page');
});

app.get('/calculatePrice', (req, res) => {
	res.write('This is the calculatePrice page');
});


app.listen(3000, () => {
	console.log('Listening on port 3000');
    });



// Please do not delete the following line; we need it for testing!
module.exports = app;
