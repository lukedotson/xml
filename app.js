const express = require('express');
const app = express();
const port = 3000;

var fs = require('fs');
var xmlContents;

fs.readFile('test.xml', 'utf8', function(err, contents) {
	if (contents) {
		xmlContents = contents;
	} else {
		xmlContents = err;
	}
});

console.log(xmlContents);

var convert = require('xml-js');
var xml =
'<?xml version="1.0" encoding="utf-8"?>' +
'<note importance="high" logged="true">' +
'    <title>Happy</title>' +
'    <todo>Work</todo>' +
'    <todo>Play</todo>' +
'</note>';
//var result = convert.xml2json(xmlContents, {compact: true, spaces: 4});
var page = 
'<html>' +
'<body>' +
'<textarea rows="40" cols="100">' + '</textarea>' +
'</body>' +
'</html>';

//var result = convert.xml2json(xml, {compact: true, spaces: 4});
app.get('/', (req, res) => res.send(page));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));