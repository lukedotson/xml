const express = require('express');
const app = express();
const port = 3000;

var fs = require('fs');

var xmlContents = fs.readFileSync('Staging_Stores_10222018.xml');
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
	
	//console.log(entryobj.name + " " + entryobj.phone +"\n");
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
	var name = store.elements.filter(obj=> obj.name === 'name');
	//console.log(stores[i]);
	if (phone.length == 0) {
		var newElement = new Object();
		newElement.type = "element";
		newElement.name = "phone";
		newElement.elements = [{"type":"text","text":""}];
		store.elements.push(newElement);
		
		phone = store.elements.filter(obj => obj.name === 'phone');
		//var phoneText = phone[0].elements[0].text;
		//console.log("happy");
	}
	//console.log(stores[i]);
	var nameText = name[0].elements[0].text;
	
	var record = storeUpdates.filter(obj => obj.name === nameText);
		
	if (record.length>0) {
		
		console.log("found: " + record[0].name + " " + record[0].phone + " / " + phone[0].elements[0].text);
		phone[0].elements[0].text = record[0].phone;
	
	}
	
	i++;
}

console.log(i);

var page = 
'<html>' +
'<body>' +
'<p>' + resultjs.elements[0].elements[0] + '</p>' +
'<textarea rows="40" cols="100">' + xmlContents + '</textarea>' +
'<textarea rows="40" cols="100">' + JSON.stringify(resultjs) + '</textarea>' +
'</body>' +
'</html>';

app.get('/', (req, res) => res.send(page));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));