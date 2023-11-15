import ExcelJS from 'exceljs';
import { getHocSinhByCCCD } from 'services/hocsinhService';
import { convertISODateToFormattedDate } from 'utils/formatDate';

const ExportHocSinh = async (data) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Danh sách học sinh tốt nghiệp');
  const title = worksheet.getCell('A1');
  title.value = 'DANH SÁCH HỌC SINH TỐT NGHIỆP';
  title.alignment = { horizontal: 'center' };
  title.font = { bold: true, size: 15 };
  worksheet.mergeCells('A1:L1');

  const cellTenTruong = worksheet.getCell('A3');
  cellTenTruong.value = '';

  // Adding the header row with bold formatting
  const headerRow = worksheet.addRow([
    'STT',
    'Họ tên',
    'CCCD',
    'Giới tính',
    'Ngày sinh',
    'Nơi sinh',
    'Dân tộc',
    'Đơn vị',
    'Lớp',
    'Hạnh kiểm',
    'Học lực',
    'Xếp loại'
  ]);
  headerRow.eachCell((cell) => {
    cell.font = { bold: true };
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
  if (data && data.length) {
    for (let index = 0; index < data.length; index++) {
      const item = data[index];
      const userbyid = await getHocSinhByCCCD(item.cccd);
      const datauser = userbyid.data;
      const dataRow = worksheet.addRow([
        index + 1,
        datauser.hoTen,
        datauser.cccd,
        datauser.gioiTinh ? 'Nam' : 'Nữ',
        datauser.ngaySinh ? convertISODateToFormattedDate(datauser.ngaySinh) : '',
        datauser.noiSinh,
        datauser.danToc,
        item.tenTruong,
        datauser.lop,
        datauser.hanhKiem,
        datauser.hocLuc,
        datauser.xepLoai
      ]);
      dataRow.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        }; // Apply borders
      });
      dataRow.getCell(2).alignment = { horizontal: 'center' };
      dataRow.getCell(3).alignment = { horizontal: 'center' };
      dataRow.getCell(4).alignment = { horizontal: 'center' };
      dataRow.getCell(5).alignment = { horizontal: 'center' };
      dataRow.getCell(6).alignment = { horizontal: 'center' };
      dataRow.getCell(7).alignment = { horizontal: 'center' };
      dataRow.getCell(8).alignment = { horizontal: 'center' };
      dataRow.getCell(9).alignment = { horizontal: 'center' };
      dataRow.getCell(10).alignment = { horizontal: 'center' };
      dataRow.getCell(11).alignment = { horizontal: 'center' };
      dataRow.getCell(12).alignment = { horizontal: 'center' };
    }
  }

  // Adjust column widths
  worksheet.getColumn(1).width = 5; //stt
  worksheet.getColumn(2).width = 35; //ten
  worksheet.getColumn(3).width = 25;
  worksheet.getColumn(4).width = 15;
  worksheet.getColumn(5).width = 15;
  worksheet.getColumn(6).width = 15;
  worksheet.getColumn(7).width = 15;
  worksheet.getColumn(8).width = 35;
  worksheet.getColumn(9).width = 15;
  worksheet.getColumn(10).width = 15;
  worksheet.getColumn(11).width = 15;
  worksheet.getColumn(11).width = 15;

  // Create a blob and initiate download
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'DSHocSinhTotNghiep.xlsx';
  a.click();
};

export default ExportHocSinh;
