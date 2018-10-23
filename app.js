const express = require('express');
const app = express();
const port = 3000;

var fs = require('fs');

var xmlContents = fs.readFileSync('test.xml');
var csvContents = fs.readFileSync('wholesaler.csv').toString();

//console.log(csvContents);


var wholesalers = csvContents.split("\n");

//console.log("count: " + wholesalers.length);

var storeUpdates = new Array();
var i = 0;
while(wholesalers[i]) {
	var entry = wholesalers[i].split("\t");
	var entryobj = new Object();
	
	entryobj.name = entry[0].toUpperCase();
	entryobj.phone = entry[1];
	
	storeUpdates.push(entryobj);
	
	console.log(entryobj.name + " " entryobj.phone +"\n");
	i++;
}

//console.log("entry count: " + storeUpdates.length);

var convert = require('xml-js');
var result = convert.xml2json(xmlContents, {compact: true, spaces: 4});
var resultjs = convert.xml2js(xmlContents, {ignoreComment: true, alwaysChildren: true});
//var store = resultjs.elements[0].elements[0].elements;

//let phone = store.filter(obj => obj.name === 'phone');

//console.log(phone[0].elements[0].text);
//console.log(resultjs);

var root = resultjs.elements.filter(obj => obj.name === 'stores');
console.log(root);
var stores = root[0].elements.filter(obj => obj.name === 'store');

var i=0;
while (stores[i]) {
	//var store = stores[i].elements.filter(obj => obj.name == 'store')
	var store = stores[i];
	var phone = store.elements.filter(obj => obj.name === 'phone');
	var phoneText = phone[0].elements[0].text;
	
	console.log(phoneText);
	i++;
}

console.log(i);

var page = 
'<html>' +
'<body>' +
'<p>' + resultjs.elements[0].elements[0] + '</p>' +
'<textarea rows="40" cols="100">' + xmlContents + '</textarea>' +
'<textarea rows="40" cols="100">' + result.toString() + '</textarea>' +
'</body>' +
'</html>';

app.get('/', (req, res) => res.send(page));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));