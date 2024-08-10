var fs = require('fs');
var xml_digester = require('xml-digester');
var digester = xml_digester.XmlDigester({});

fs.readFile(__dirname + '/esupplyQuery.xml', 'utf8', function(error, data) {
  if(error){
    console.log(error);
  }else{
    digester.digest(data, function(error, result) {
      if(error) console.log(error);
      else      exports.QG = result.query;
    })
  }
})