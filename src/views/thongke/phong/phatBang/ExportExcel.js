import ExcelJS from 'exceljs';

const ExportExcel = async (namHoc, data) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Thống kê phát bằng');

  const title = worksheet.getCell('A1');
  title.value = 'THỐNG KÊ PHÁT BẰNG';
  title.alignment = { horizontal: 'center' };
  title.font = { bold: true, size: 15 };
  worksheet.mergeCells('A1:D1');

  const time = worksheet.getCell('A2');
  time.value = `Năm học: ${namHoc}`;
  worksheet.mergeCells('A2:B2');

  const cell = worksheet.getCell('A3');
  cell.value = '';

  // Adding the header row with bold formatting
  const headerRow = worksheet.addRow(['STT', 'Tên trường', 'Số lượng bằng chưa phát', 'Số lượng bằng đã phát']);
  headerRow.eachCell((cell) => {
    // cell.font = { bold: true };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.alignment.wrapText = true;
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
  });

  // Adding data rows
  data && data.length
    ? data.forEach((item) => {
        const dataRow = worksheet.addRow([item.idx, item.ten, item.chuaPhat, item.daPhat]);
        dataRow.eachCell((cell) => {
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          }; // Apply borders
        });
        dataRow.getCell(1).alignment = { horizontal: 'center' };
        dataRow.getCell(3).alignment = { horizontal: 'center' };
        dataRow.getCell(4).alignment = { horizontal: 'center' };
        // dataRow.getCell(5).alignment = { horizontal: 'center' };
      })
    : '';

  // Adjust column widths
  worksheet.getColumn(1).width = 4; //stt
  worksheet.getColumn(2).width = 40; //ten truong
  worksheet.getColumn(3).width = 25; //chua phat
  worksheet.getColumn(4).width = 25; //da phat

  // Create a blob and initiate download
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'thongkephatbang.xlsx';
  a.click();
};

export default ExportExcel;
