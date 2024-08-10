var fs = require('fs');
var xml_digester = require('xml-digester');
var digester = xml_digester.XmlDigester({});

fs.readFile(__dirname + '/charvesQuery.xml', 'utf8', function(error, data) {
  console.log("요기 탈까요?");
  if(error){
    console.log(error);
  }else{
    digester.digest(data, function(error, result) {
      if(error) console.log(error);
      else      exports.QG = result.query;
    })
  }
})