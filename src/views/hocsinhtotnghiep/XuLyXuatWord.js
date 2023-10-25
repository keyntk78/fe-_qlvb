import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';
import PizZipUtils from 'pizzip/utils/index.js';
import { saveAs } from 'file-saver';
import FileWord_A4 from '../FileMau/MauCNTNTT_A4.docx';
import FileWord_A5 from '../FileMau/MauCNTNTT_A5.docx';
import FileWord_A4_SGD from '../FileMau/MauCNTNTT_A4_SGD.docx';
import FileWord_A5_SGD from '../FileMau/MauCNTNTT_A5_SGD.docx';
function loadFile(url, callback) {
  PizZipUtils.getBinaryContent(url, callback);
}

function replaceErrors(key, value) {
  if (value instanceof Error) {
    return Object.getOwnPropertyNames(value).reduce(function (error, key) {
      error[key] = value[key];
      return error;
    }, {});
  }
  return value;
}
export function generateDocument(data, paperSize, donvi) {
  loadFile(
    paperSize === 'A4' ? (donvi == 1 ? FileWord_A4_SGD : FileWord_A4) : donvi == 1 ? FileWord_A5_SGD : FileWord_A5,
    function (error, content) {
      if (error) {
        throw error;
      }
      var zip = new PizZip(content);
      var doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true
      });
      doc.setData({ students: data });
      try {
        doc.render();
      } catch (error) {
        console.log(JSON.stringify({ error: error }, replaceErrors));

        if (error.properties && error.properties.errors instanceof Array) {
          const errorMessages = error.properties.errors
            .map(function (error) {
              return error.properties.explanation;
            })
            .join('\n');
          console.log('errorMessages', errorMessages);
        }
        throw error;
      }
      var out = doc.getZip().generate({
        type: 'blob',
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      });
      const currentDate = new Date();
      const formattedDate = currentDate.toLocaleDateString().split('/').join('-');
      saveAs(out, `GiayChungNhanTamThoi-${formattedDate}.docx`);
    }
  );
}
