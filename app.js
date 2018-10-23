const express = require('express');
const app = express();
const port = 3000;

var fs = require('fs');

var xmlContents = fs.readFileSync('test.xml');

console.log(xmlContents);

var convert = require('xml-js');
var xml =
'<?xml version="1.0" encoding="utf-8"?>' +
'<note importance="high" logged="true">' +
'    <title>Happy</title>' +
'    <todo>Work</todo>' +
'    <todo>Play</todo>' +
'</note>';

var page = 
'<html>' +
'<body>' +
'<textarea rows="20" cols="200">' + xmlContents + '</textarea>' +
'</body>' +
'</html>';

var result = convert.xml2json(xml, {compact: true, spaces: 4});
app.get('/', (req, res) => res.send(xmlContents));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));