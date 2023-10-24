import ExcelJS from 'exceljs';

const ExportExcelPhuLuc = async (donvi, pageState, selectNamThi) => {
  const currentDate = new Date();
  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1; // Tháng bắt đầu từ 0
  const year = currentDate.getFullYear();

  const NgayHientai = `ngày ${day} tháng ${month} năm ${year}`;
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Phụ lục sổ gốc cấp văn bằng, chứng chỉ');

  const ubnd = worksheet.getCell('A1');
  ubnd.value = donvi.cauHinh.tenUyBanNhanDan.toUpperCase();
  ubnd.alignment = { horizontal: 'center' };
  worksheet.mergeCells('A1:C1');

  const pgd = worksheet.getCell('A2');
  pgd.value = donvi.cauHinh.tenCoQuanCapBang.toUpperCase();
  pgd.alignment = { horizontal: 'center' };
  pgd.font = { bold: true };
  worksheet.mergeCells('A2:C2');

  const titleCell = worksheet.getCell('E5');
  titleCell.value = 'PHỤ LỤC SỔ GỐC CẤP VĂN BẰNG, CHỨNG CHỈ';
  titleCell.alignment = { horizontal: 'center' };
  titleCell.font = { bold: true, size: 13 };
  worksheet.mergeCells('E5:G5');

  const cell = worksheet.getCell('A6');
  cell.value = '';

  // Adding the header row with bold formatting
  const headerRow = worksheet.addRow([
    'STT',
    'Họ và Tên',
    'CCCD',
    'Ngày tháng năm sinh',
    'Số hiệu văn bằng đã được cấp',
    'Số hiệu văn bằng được cấp lại (nếu có)',
    'Số vào sổ gốc cấp bằng mới (nếu có)',
    'Nội dung',
    'Chữ ký người nhận',
    'Ghi chú'
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
  pageState.data.forEach((item) => {
    const dataRow = worksheet.addRow([
      item.idx,
      item.hoTen,
      item.cccd,
      item.ngaySinh_fm,
      item.soHieuVanBangCu,
      item.soHieuVanBangCapLai,
      item.soVaoSoCapBangCapLai,
      item.noiDungChinhSua,
      '',
      ''
    ]);
    dataRow.eachCell((cell) => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };

      if (cell.value == null) {
        // Đặt border cho các ô có giá trị null
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      }
    });
    dataRow.getCell(1).alignment = { horizontal: 'center' };
    dataRow.getCell(10).alignment = { horizontal: 'center' };
  });

  const numberOfRows = pageState.data.length;

  const diaPhuong = donvi.cauHinh.tenDiaPhuongCapBang;
  const ngayCap = NgayHientai;
  const newRowNumber = numberOfRows + 9;
  const newRow = worksheet.getRow(newRowNumber);
  newRow.getCell(8).value = `${diaPhuong}, ${ngayCap}`;
  newRow.getCell(8).alignment = { horizontal: 'center' };
  newRow.getCell(8).font = { italic: true };
  worksheet.mergeCells(`H${newRowNumber}:J${newRowNumber}`);

  const newRowNumber1 = numberOfRows + 10;
  const text1 = worksheet.getRow(newRowNumber1);
  text1.getCell(8).value = donvi.donViQuanLy == 1 ? 'GIÁM ĐỐC' : 'TRƯỞNG PHÒNG';
  text1.getCell(8).alignment = { horizontal: 'center' };
  text1.getCell(8).font = { bold: true };
  worksheet.mergeCells(`H${newRowNumber1}:J${newRowNumber1}`);

  const newRowNumber2 = numberOfRows + 15;
  const nguoiKy = worksheet.getRow(newRowNumber2);
  nguoiKy.getCell(8).value = donvi.cauHinh.hoTenNguoiKySoGoc;
  nguoiKy.getCell(8).alignment = { horizontal: 'center' };
  nguoiKy.getCell(8).font = { bold: true };
  worksheet.mergeCells(`H${newRowNumber2}:J${newRowNumber2}`);

  // Adjust column widths
  worksheet.getColumn(1).width = 4; //stt
  worksheet.getColumn(2).width = 25; //ten
  worksheet.getColumn(3).width = 14; //cccd
  worksheet.getColumn(4).width = 12; //ngaySinh
  worksheet.getColumn(5).width = 20; //Số hiệu văn bằng đã được cấp
  worksheet.getColumn(6).width = 20; //Số hiệu văn bằng được cấp lại (nếu có)
  worksheet.getColumn(7).width = 20; //Số vào sổ gốc cấp bằng mới (nếu có)
  worksheet.getColumn(8).width = 20; //nội dung
  worksheet.getColumn(9).width = 20; //ChuKy
  worksheet.getColumn(10).width = 20; //ghiChu

  // Create a blob and initiate download
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `phulucsogoc_${selectNamThi}.xlsx`;
  a.click();
};

export default ExportExcelPhuLuc;
