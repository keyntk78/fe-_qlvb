import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';
import PizZipUtils from 'pizzip/utils/index.js';
import { saveAs } from 'file-saver';
import FileWordMau_SoCapBanSao from '../FileMau/FileMauSoBanSao.docx';
import FileWordMau_SoCapBanSao_SGD from '../FileMau/FileMauSoBanSao_SGD.docx';

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

export function generateDocument(hocsinhs, data, donvi) {
  loadFile(donvi.donViQuanLy === 1 ? FileWordMau_SoCapBanSao_SGD : FileWordMau_SoCapBanSao, function (error, content) {
    if (error) {
      throw error;
    }
    var zip = new PizZip(content);
    var doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true
    });

    doc.setData({ students: hocsinhs, ...data });
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
    saveAs(out, 'sobansao.docx');
  });
}

const ExportWord = () => {
  return null;
};

export default ExportWord;
