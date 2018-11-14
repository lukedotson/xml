const express = require('express');
const app = express();
const port = 3000;

var https = require('https');

var fs = require('fs');

fs.writeFile('log.txt', "", (err) => {
	if (err) throw err;
	console.log('the file has been saved!');
});

var xmlContents = fs.readFileSync('stores_all_11142018.xml');
//var csvContents = fs.readFileSync('updatedList.csv').toString();
var xmlescape = require('xml-escape');

//console.log("entry count: " + storeUpdates.length);

var convert = require('xml-js');
//var result = convert.xml2json(xmlContents, {compact: true, spaces: 4});
var resultjs = convert.xml2js(xmlContents, {ignoreComment: true, alwaysChildren: true});
//var store = resultjs.elements[0].elements[0].elements;

var root = resultjs.elements.filter(obj => obj.name === 'stores');
//console.log(root);
var stores = root[0].elements.filter(obj => obj.name === 'store');

var i=0;
while (stores[i]) {
	//var store = stores[i].elements.filter(obj => obj.name == 'store')
	var store = stores[i];
	var latitudeObj = store.elements.filter(obj => obj.name === 'latitude');
	var latitude = latitudeObj[0].elements[0].text;
	var longitudeObj = store.elements.filter(obj => obj.name === 'longitude');
	var longitude = longitudeObj[0].elements[0].text;
	var name = store.elements.filter(obj=> obj.name === 'name');
	var storeID = store.attributes['store-id'];
	var address1Obj = store.elements.filter(obj => obj.name === 'address1');
	var address1 = address1Obj[0].elements[0].text;
	var cityObj = store.elements.filter(obj => obj.name === 'city');
	var city;
	if (cityObj[0]) {
		city = cityObj[0].elements[0].text;
	}
	var stateObj = store.elements.filter(obj => obj.name === 'state-code');
	var state
	if (stateObj[0]) {
		state = stateObj[0].elements[0].text;
	}
	var postalObj = store.elements.filter(obj => obj.name === 'postal-code');
	var postal
	if (postalObj[0]) {
		postalObj = postalObj[0].elements[0].text;
	}
	var address = address1 + " " + city + " " + state + " " + postal;
	address = encodeURIComponent(address);
	//var latString = JSON.stringify(latitude);
	//storeID = storeID.replace('&', '&amp;');
	//console.log(JSON.stringify(store));
	console.log("store-id: " + storeID + " - Latitude: " + latitude + " Longitude: " + longitude + " Address: " + address);
	
	function myFunc(arg, callback) {
		  console.log(`arg was => ${arg}`);
		  
		  callback(null);
	}
	
	//console.log(latString);
	var interval = 10;
	var timeout = interval * i;
	store.attributes['store-id'] = storeID;
	setTimeout(myFunc("happy" + i), timeout, function(err){});
	
	
	//callGoogle(address, latitude, longitude, storeID)
	//console.log(stores[i]);

	//console.log(stores[i]);
	/*var nameText = name[0].elements[0].text;
	console.log("name: " + nameText);
	nameText = nameText.replace('&amp;', '&');
	console.log("nameClean: " + nameText);
	var record = storeUpdates.filter(obj => obj.name === nameText);
		
	if (record.length>0) {
		if (record[0].phone != "") {
			if (phone.length == 0) {
				var newElement = new Object();
				newElement.type = "element";
				newElement.name = "phone";
				newElement.elements = [{"type":"text","text":""}];
				store.elements.splice(6, 0, newElement);
				
				phone = store.elements.filter(obj => obj.name === 'phone');
				//var phoneText = phone[0].elements[0].text;
				//console.log("happy");
			}
			phone[0].elements[0].text = record[0].phone;
		}
		//console.log("found: " + record[0].name + " " + record[0].phone + " / " + phone[0].elements[0].text);
	}*/
	
	i++;
}

function nothing() {
	
}

function callGoogle(address, lat, long, storeID) {
	https.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + address + '&key=AIzaSyDCk-z5W_7tnojlnUqqf3QFnq1cvz6O7Vc', (resp) => {
		let data = '';
		
		resp.on('data', (chunk) => {
		    data += chunk;
		});
		
		resp.on('end', () => {
			//fs.writeFile('log.txt', JSON.parse(data), (err) => {
			//	if (err) throw err;
			//	console.log('The file has been saved!');
			//});
			//console.log(JSON.parse(data).results[0]);
			if (JSON.parse(data).results[0]) {
				
				var glat = JSON.parse(data).results[0].geometry.location.lat;
				var glong = JSON.parse(data).results[0].geometry.location.lng;
				console.log("lat: " + glat + " - " + lat);
				console.log("lon: " + glong + " - " + long);
				
				var latDiff = glat - lat;
				var longDiff = glong - long;
				fs.appendFile('log.txt', "DIFF: " + latDiff + " " + longDiff + " :: " + storeID + ": {lat: " + glat + "<>" + lat + " lon: " + glong + "<>" + long + "}\n", (err) => {
					if (err) throw err;
					console.log('the file has been saved!');
				});
			} else {
				fs.appendFile('log.txt', "No Response", (err) => {
					if (err) throw err;
					console.log('no response');
				});
				console.log(JSON.parse(data));
			}
			//console.log(data.results.geometry);
		}).on("error", (err) => {
			  console.log("Error: " + err.message);
		});
	});
}

//var finalFile = fs.readFileSync('result.xml', 'utf8');
//var final = convert.js2xml(resultjs, {sanitize: true, spaces: 4});
//fs.writeFile('result.xml', final, (err) => {
	//  if (err) throw err;
	 // console.log('The file has been saved!');
	//});
//console.log(final);

var page = 
'<html>' +
'<body>' +
'<p>' + resultjs.elements[0].elements[0] + '</p>' +
'<textarea rows="40" cols="100">' + xmlContents + '</textarea>' +
'<textarea rows="40" cols="100">' + JSON.stringify(resultjs) + '</textarea>' +
'</body>' +
'</html>';

app.get('/', (req, res) => res.send(page));

//app.listen(port, () => console.log(`Example app listening on port ${port}!`));