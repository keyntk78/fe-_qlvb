import ExcelJS from 'exceljs';
import { getById } from 'services/donvitruongService';
import { getHocSinhXepLoaiTotNghiep, getHocSinhXepLoaiTotNghiepTruong } from 'services/hocsinhService';
import { convertISODateToFormattedDate } from 'utils/formatDate';

const ExportHocSinh = async (DMTN, tenDMTN, donvi, phong, tentruong) => {
  const donVi = await getById(donvi);
  const dataDonVi = donVi.data;
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(`DSKetQuaXetTotNgiep_${tentruong ? tentruong : dataDonVi.ten}.xlsx`);
  const title = worksheet.getCell('A1');
  title.value = 'KẾT QUẢ XÉT TỐT NGHIỆP';
  title.alignment = { horizontal: 'center' };
  title.font = { bold: true, size: 15 };
  worksheet.mergeCells('A1:L1');

  const response = phong ? await getHocSinhXepLoaiTotNghiep(donvi, DMTN) : await getHocSinhXepLoaiTotNghiepTruong(donvi, DMTN);
  const data = response.data;
  const cellTenTruong = worksheet.getCell('A2');
  cellTenTruong.value = tentruong ? tentruong : dataDonVi.ten;
  cellTenTruong.font = { bold: true };
  const cellTenDMTN = worksheet.getCell('A3');
  cellTenDMTN.value = tenDMTN ? tenDMTN : '';
  cellTenDMTN.font = { bold: true };

  // Adding the header row with bold formatting
  const headerRow = worksheet.addRow([
    'STT',
    'Họ tên',
    'CCCD',
    'Giới tính',
    'Ngày sinh',
    'Nơi sinh',
    'Dân tộc',
    'Lớp',
    'Hạnh kiểm',
    'Học lực',
    'Xếp loại',
    'Kết quả'
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
  data.forEach((item, index) => {
    const dataRow = worksheet.addRow([
      index + 1,
      item.hoTen,
      item.cccd,
      item.gioiTinh ? 'Nam' : 'Nữ',
      item.ngaySinh ? convertISODateToFormattedDate(item.ngaySinh) : '',
      item.noiSinh,
      item.danToc,
      item.lop,
      item.hanhKiem,
      item.hocLuc,
      item.xepLoai != (null || '' || undefined) ? item.xepLoai : '-',
      item.ketQua
    ]);
    dataRow.eachCell((cell) => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };

      if (cell.value == null || '') {
        // Đặt border cho các ô có giá trị null
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      }
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
  });

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
  a.download = `DSKetQuaXetTotNgiep_${tentruong ? tentruong : dataDonVi.ten}.xlsx`;
  a.click();
};

export default ExportHocSinh;
