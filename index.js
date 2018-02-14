var express = require('express');
var app = express();

var Animal = require('./Animal.js');
var Toy = require('./Toy.js');


app.get('/', (req, res) => {
	//res.json({ msg : 'It works!' });
	res.write('Hello Worlds this is Osei!');

    });
/*
app.get('/addToy', (req, res) => {
	var newToy = new Toy({
		id : "123",
		name : "Dog chew toy",
		price : 10.99
	});

	newToy.save();
	console.log('new toy added');
});*/

app.get('/findToy', (req, res) => {
	var itemQuery = req.query.id;

	//fetch name and price from mongo db
	Toy.findOne( { id: itemQuery }, (err, toy) => {
		if (err) {
			res.type('html').status(500);
			res.send('Error: ' + err);
		}
		else if (!toy) {
			res.type('html').status(200);
			res.send('There is no toy with id ' + itemQuery);
			res.json(toy);
		}
		else {
			//return entire document object
			res.json(toy);
		}
	});
});

app.get('/addAnimal', (req, res) => {
	var newAnimal = new Animal({
		name : "Cooper",
		species : "Dog",
		breed : "Catahoula",
		gender : "male",
		age : 11,
		traits : ["crazy", "funny"]
	});

	newAnimal.save();
	console.log('new animal added');
});

app.get('/findAnimals', (req, res) => {
	Animal.find(req.query, (err, animals) => {
		if(err) {
			res.type('html').status(500);
			res.send('Error: ' + err);
		}
		else if (!animals) {
			res.type('html').status(200);
			res.send('There are no animals that match the provided query.');
			res.json(animals);
		}
		else {
			res.json(animals);
		}
	});
});

app.get('/animalsYoungerThan', (req, res) => {
	//get animals
	var query = {};
	if(req.query.age) query.age = { $lt: req.query.age};

	Animal.find(query, (err, animals) => {
		if(err) {
			res.type('html').status(500);
			res.send('Error: ' + err);
		}
		else if(!animals) {
			res.type('html').status(200);
			res.send('There are no animals younger than ' + req.query.age);
			res.json(animals);
		}
		else {
			//set values
			var animalsObj = {
				count: animals.length;
			};
			if(animalsObj.count > 0) {
				animalsObj.name = [];

				animals.forEach((a) => {
					animalsObj.name.push(a.name);
				});
			}


		}
	});



});

app.get('/calculatePrice', (req, res) => {
	var query = {};
	var store = {};
	var cal = {
		totalPrice: 0,
		items: []
	};

	req.query.id.forEach((a) => {
		store['req.query.id'] = req.query.qty;
	});

	if(req.query.id){
		if(req.query.id.length > 1)	query.id = {'$in': req.query.id};
		else query.id = req.query.id;
	}
	if(req.query.qty){
		if(req.query.qty.length > 1) query.qty = {'$in': req.query.qty};
		else query.qty = req.query.qty;
	}

	Toy.find(query.id, (err, toys) => {
		if(err){
			res.type('html').status(500);
			res.send('Error: ' + err);
		} else if(!toys){
			res.type('html').status(200);
			res.send('There are no toys with id' + req.query.id);
		} else {
			toys.forEach((a) => {
				cal.totalPrice += a.price*query.qty[i];
				cal.items.push({item: a.name, qty: query.qty[i], subtotal: a.price*query.qty[i]});
			});
		}

	});

	res.json(cal);
});


app.listen(3000, () => {
	console.log('Listening on port 3000');
    });



// Please do not delete the following line; we need it for testing!
module.exports = app;
