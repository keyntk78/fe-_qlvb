import ExcelJS from 'exceljs';
const ExportExcel = async (data, config) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Danh Sách xác minh');

  const ubnd = worksheet.getCell('A1');
  ubnd.value = config.uyBanNhanDan;
  ubnd.alignment = { horizontal: 'center' };
  worksheet.mergeCells('A1:C1');

  const pgd = worksheet.getCell('A2');
  pgd.value = config.coQuanCapBang;
  pgd.alignment = { horizontal: 'center' };
  pgd.font = { bold: true };
  worksheet.mergeCells('A2:C2');

  const quochieu = worksheet.getCell('D1');
  quochieu.value = 'CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM';
  quochieu.alignment = { horizontal: 'center' };
  quochieu.font = { bold: true };
  worksheet.mergeCells('D1:L1');

  const tieungu = worksheet.getCell('D2');
  tieungu.value = 'Độc Lập - Tự Do - Hạnh Phúc';
  tieungu.alignment = { horizontal: 'center' };
  tieungu.font = { bold: true };
  worksheet.mergeCells('D2:L2');

  const title = worksheet.getCell('A4');
  title.value = `DANH SÁCH HỌC SINH TỐT NGHIỆP THPT TẠI CÁC HỘI ĐỒNG THI CỦA ${config.diaPhuongCapBang}`;
  title.alignment = { horizontal: 'center' };
  worksheet.mergeCells('A4:J4');

  const dinhkem = worksheet.getCell('A5');
  dinhkem.value = `(Kèm theo Công văn số ............ ngày .... tháng .... năm ......của ${config.coQuanCapBang} ${config.diaPhuongCapBang})`;
  dinhkem.alignment = { horizontal: 'center' };
  worksheet.mergeCells('A5:J5');

  const cell = worksheet.getCell('A6');
  cell.value = '';

  const headerRow = worksheet.addRow(['STT', 'Họ và Tên', 'Ngày sinh', 'Nơi sinh', 'Khóa thi', 'Ghi chú']);

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
  data.forEach((item) => {
    const dataRow = worksheet.addRow([item.id, item.hoTen, item.ngaySinh, item.noiSinh, item.khoaThi, '']);
    dataRow.eachCell((cell) => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      }; // Apply borders
    });
    dataRow.getCell(1).alignment = { horizontal: 'center' };
    dataRow.getCell(5).alignment = { horizontal: 'center' };
  });

  // Adjust column widths
  worksheet.getColumn(1).width = 4; //stt
  worksheet.getColumn(2).width = 25; //ten
  worksheet.getColumn(3).width = 15; //ngaySinh
  worksheet.getColumn(4).width = 22; //noiSinh
  worksheet.getColumn(5).width = 15; //khoathi
  worksheet.getColumn(6).width = 5; //ghiChu

  // Create a blob and initiate download
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'DanhSachXacMinh.xlsx';
  a.click();
};
export default ExportExcel;
