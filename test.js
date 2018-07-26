const util = require('util');
const JREF = require('./jref.js');

var data = {name: 'Ed', car: {color:'blue'}};
data.car.owner = data; // This creates a circular reference.

console.log('\nOriginal:', util.inspect(data, {colors: true, depth: 10}));
console.log('Stringified:', JREF.stringify(data));
console.log('Restored:', util.inspect(JREF.parse(JREF.stringify(data)), {colors: true, depth: 10}));

data = {
	assets: [
		{id:1, regid:'ABC123', user: null},
		{id:2, regid:'DEF456', user: null},
	],
	users: [
		{id:1, name:'Kim', asset: null},
		{id:2, name:'Sara', asset: null},
	]
};
data.assets[0].user = data.users[0];
data.users[0]['asset'] = data.assets[0];

console.log('\nOriginal:', util.inspect(data, {colors: true, depth: 10}));
console.log('Stringified:', JREF.stringify(data));
console.log('Restored:', util.inspect(JREF.parse(JREF.stringify(data)), {colors: true, depth: 10}));