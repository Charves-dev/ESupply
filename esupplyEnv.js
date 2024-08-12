var fs = require('fs');
var xml_digester = require('xml-digester');
var digester = xml_digester.XmlDigester({});

//*************************************************************************************************
// 쿼리파일 읽어들이기.. 서버가 가동될 때 자동으로 로딩된다.
//*************************************************************************************************
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
//*************************************************************************************************