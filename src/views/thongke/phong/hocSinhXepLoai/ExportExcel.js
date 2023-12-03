import ExcelJS from 'exceljs';

const ExportExcel = async (namHoc, data) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Thống kê học sinh tốt nghiệp');

  const title = worksheet.getCell('A1');
  title.value = 'THỐNG KÊ HỌC SINH TỐT NGHIỆP';
  title.alignment = { horizontal: 'center' };
  title.font = { bold: true, size: 15 };
  worksheet.mergeCells('A1:H1');

  const time = worksheet.getCell('A2');
  time.value = `Năm học: ${namHoc}`;
  worksheet.mergeCells('A2:B2');

  const cell = worksheet.getCell('A3');
  cell.value = '';

  // Adding the header row with bold formatting
  const headerRow = worksheet.addRow([
    'STT',
    'Tên trường',
    'Học sinh giỏi',
    'Học sinh khá',
    'Học sinh trung bình',
    'Học sinh đẫ tốt nghiệp',
    'Học sinh không đạt tố nghiệp'
  ]);
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
    ? data.forEach((item, index) => {
        const dataRow = worksheet.addRow([
          index + 1,
          item.tenTruong,
          item.soLuongHocSinhGioi,
          item.soLuongHocSinhKha,
          item.soLuongHocSinhTrungBinh,
          item.soLuongHocSinhDatTotNghiep,
          item.soLuongHocSinhKhongDatTotNghiep
        ]);
        dataRow.eachCell((cell) => {
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          }; // Apply borders
        });
        dataRow.getCell(1).alignment = { horizontal: 'center' };
        // dataRow.getCell(3).alignment = { horizontal: 'center' };
      })
    : '';

  // const numberOfRows = data.length;

  // const newRowNumber = numberOfRows + 6;
  // const newRow = worksheet.getRow(newRowNumber);
  // newRow.getCell(3).value = `Tổng số học sinh: ${total}`;
  // newRow.getCell(3).alignment = { horizontal: 'left' };
  // newRow.getCell(3).font = { italic: true, bold: true };

  // Adjust column widths
  worksheet.getColumn(1).width = 4;
  worksheet.getColumn(2).width = 30;
  worksheet.getColumn(3).width = 15;
  worksheet.getColumn(4).width = 15;
  worksheet.getColumn(5).width = 15;
  worksheet.getColumn(6).width = 15;
  worksheet.getColumn(7).width = 15;

  // Create a blob and initiate download
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'thongkehocsinhtotnghiep.xlsx';
  a.click();
};

export default ExportExcel;
