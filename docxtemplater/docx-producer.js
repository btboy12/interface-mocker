var JSZip = require('jszip');
var Docxtemplater = require('docxtemplater');

var fs = require('fs');
var path = require('path');

//Load the docx file as a binary
var content = fs.readFileSync(path.resolve(__dirname, 'input.docx'), 'binary');

var zip = new JSZip(content);

var doc = new Docxtemplater();
doc.loadZip(zip);

//set the templateVariables
doc.setData(JSON.parse(
    fs.readFileSync(path.resolve(__dirname, 'doc_content.json'))
));

try {
    // render the document
    doc.render()
}
catch (error) {
    var e = {
        message: error.message,
        name: error.name,
        stack: error.stack,
        properties: error.properties,
    }
    console.log(JSON.stringify({ error: e }));
    // The error thrown here contains additional information when logged with JSON.stringify (it contains a property object).
    throw error;
}

var buf = doc.getZip().generate({ type: 'nodebuffer' });

// buf is a nodejs buffer, you can either write it to a file or do anything else with it.
fs.writeFileSync(path.resolve(__dirname, 'output.docx'), buf);
console.info("fin");