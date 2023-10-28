// export default ExportExcel;
import ExcelJS from 'exceljs';

const ExportExcel = async (formik, pageState, danhmuc, donvi, khoathi, donviql) => {
  const donviquanly = donviql.donViQuanLy;
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sổ bản sao');
  if (donviquanly == 2) {
    const ubnd = worksheet.getCell('A1');
    ubnd.value = formik.values.UyBanNhanDan.toUpperCase();
    ubnd.alignment = { horizontal: 'center' };
    worksheet.mergeCells('A1:C1');

    const pgd = worksheet.getCell('A2');
    pgd.value = formik.values.CoQuanCapBang.toUpperCase();
    pgd.alignment = { horizontal: 'center' };
    pgd.font = { bold: true };
    worksheet.mergeCells('A2:C2');

    const titleCell = worksheet.getCell('D1');
    titleCell.value = `SỔ BẢN SAO CẤP BẰNG TỐT NGHIỆP ${formik.values.HeDaoTao.toUpperCase()}`;
    titleCell.alignment = { horizontal: 'center' };
    titleCell.font = { bold: true, size: 13 };
    worksheet.mergeCells('D1:L1');

    const quyetdinh = worksheet.getCell('A4');
    quyetdinh.value = `Quyết định công nhận tốt nghiệp số ${danhmuc.soQuyetDinh}`;
    worksheet.mergeCells('A4:E4');

    const namtn = worksheet.getCell('I4');
    namtn.value = `Năm tốt nghiệp: ${formik.values.NamThi}`;
    worksheet.mergeCells('I4:J4');

    const donvitruong = worksheet.getCell('A5');
    donvitruong.value = `Học sinh trường: ${donvi.ten}`;
    worksheet.mergeCells('A5:C5');

    const hinhthuchoc = worksheet.getCell('I5');
    hinhthuchoc.value = `Hình thức học: ${formik.values.HinhThucDaoTao}`;
    worksheet.mergeCells('I5:J5');

    const cell = worksheet.getCell('A6');
    cell.value = '';

    const headerRow = worksheet.addRow([
      'STT',
      'Họ và Tên',
      'Ngày tháng năm sinh',
      'Nơi sinh',
      'Giới tính',
      'Dân tộc',
      'Xếp loại tốt nghiệp',
      'Số hiệu văn bằng',
      'Số vào sổ bản sao',
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
    pageState.data.forEach((item) => {
      const dataRow = worksheet.addRow([
        item.idx,
        item.hoTen_fm,
        item.ngaySinh_fm,
        item.noiSinh_fm,
        item.gioiTinh_fm,
        item.danToc_fm,
        item.xepLoai_fm,
        item.soHieuVanBang_fm,
        item.soVaoSoBanSao_fm,
        '',
        ''
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
      dataRow.getCell(10).alignment = { horizontal: 'center' };
    });
    worksheet.getColumn(1).width = 4; //stt
    worksheet.getColumn(2).width = 25; //ten
    worksheet.getColumn(3).width = 10; //ngaySinh
    worksheet.getColumn(4).width = 22; //noiSinh
    worksheet.getColumn(5).width = 5; //gioiTinh
    worksheet.getColumn(6).width = 6.5; //dantoc
    worksheet.getColumn(7).width = 9.5; //xepLoai
    worksheet.getColumn(8).width = 12; //SoHieu
    worksheet.getColumn(9).width = 17; //SoVaoSo
    worksheet.getColumn(10).width = 10; //ChuKy
    worksheet.getColumn(11).width = 5; //ghiChu
  } else {
    const ubnd = worksheet.getCell('A1');
    ubnd.value = formik.values.UyBanNhanDan.toUpperCase();
    ubnd.alignment = { horizontal: 'center' };
    worksheet.mergeCells('A1:C1');

    const pgd = worksheet.getCell('A2');
    pgd.value = formik.values.CoQuanCapBang.toUpperCase();
    pgd.alignment = { horizontal: 'center' };
    pgd.font = { bold: true };
    worksheet.mergeCells('A2:C2');

    const titleCell = worksheet.getCell('D1');

    titleCell.value = `SỔ BẢN SAO CẤP BẰNG TỐT NGHIỆP ${formik.values.HeDaoTao.toUpperCase()}`;
    titleCell.alignment = { horizontal: 'center' };
    titleCell.font = { bold: true, size: 13 };
    worksheet.mergeCells('D1:L1');

    const quyetdinh = worksheet.getCell('A4');
    quyetdinh.value = `Quyết định công nhận tốt nghiệp số ${danhmuc.soQuyetDinh}`;
    worksheet.mergeCells('A4:E4');

    const kythi = worksheet.getCell('A5');
    kythi.value = `Kỳ thi: ${formik.values.TenKyThi}`;
    worksheet.mergeCells('A5:C5');

    const namtn = worksheet.getCell('A6');
    namtn.value = `Năm tốt nghiệp: ${formik.values.NamThi}`;
    worksheet.mergeCells('A6:C6');

    const khoathi = worksheet.getCell('I4');
    khoathi.value = `Khóa thi: ${formik.values.KhoaThi}`;
    worksheet.mergeCells('I4:K4');

    const donvitruong = worksheet.getCell('I5');
    donvitruong.value = `Học sinh trường: ${donvi.ten}`;
    worksheet.mergeCells('I5:K5');

    const cell = worksheet.getCell('A7');
    cell.value = '';

    const headerRow = worksheet.addRow([
      'STT',
      'Họ và tên người học',
      'Ngày tháng năm sinh',
      'Nơi sinh',
      'Giới tính',
      'Dân tộc',
      'Điểm thi',
      'Xếp loại tốt nghiệp',
      'Số hiệu văn bằng',
      'Số vào sổ bản sao',
      'Chữ ký người nhận bằng',
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
    pageState.data.forEach((item) => {
      const dataRow = worksheet.addRow([
        item.idx,
        item.hoTen_fm,
        item.ngaySinh_fm,
        item.noiSinh_fm,
        item.gioiTinh_fm,
        item.danToc_fm,
        item.hoiDong_fm,
        item.xepLoai_fm,
        item.soHieuVanBang_fm,
        item.soVaoSoBanSao_fm,
        '',
        ''
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
      dataRow.getCell(10).alignment = { horizontal: 'center' };
    });
    worksheet.getColumn(1).width = 4; //stt
    worksheet.getColumn(2).width = 25; //ten
    worksheet.getColumn(3).width = 10; //ngaySinh
    worksheet.getColumn(4).width = 22; //noiSinh
    worksheet.getColumn(5).width = 5; //gioiTinh
    worksheet.getColumn(6).width = 6.5; //dantoc
    worksheet.getColumn(7).width = 30; //diemthi
    worksheet.getColumn(8).width = 9.5; //xepLoai
    worksheet.getColumn(9).width = 12; //SoHieu
    worksheet.getColumn(10).width = 17; //SoVaoSo
    worksheet.getColumn(11).width = 10; //ChuKy
    worksheet.getColumn(12).width = 5; //ghiChu
  }
  // Adding the header row with bold formatting

  const numberOfRows = pageState.data.length;

  const diaPhuong = formik.values.DiaPhuongCapBang;
  const ngayCap = formik.values.NgayCapBang;
  const newRowNumber = numberOfRows + 9;
  const newRow = worksheet.getRow(newRowNumber);
  newRow.getCell(8).value = `${diaPhuong}, ${ngayCap}`;
  newRow.getCell(8).alignment = { horizontal: 'center' };
  newRow.getCell(8).font = { italic: true };
  worksheet.mergeCells(`H${newRowNumber}:J${newRowNumber}`);

  const newRowNumber1 = numberOfRows + 10;
  const text1 = worksheet.getRow(newRowNumber1);
  donviquanly == 1 ? (text1.getCell(8).value = 'GIÁM ĐỐC ') : (text1.getCell(8).value = 'TRƯỞNG PHÒNG');
  text1.getCell(8).alignment = { horizontal: 'center' };
  text1.getCell(8).font = { bold: true };
  worksheet.mergeCells(`H${newRowNumber1}:J${newRowNumber1}`);

  const newRowNumber2 = numberOfRows + 15;
  const nguoiKy = worksheet.getRow(newRowNumber2);
  nguoiKy.getCell(8).value = formik.values.NguoiKyBang;
  nguoiKy.getCell(8).alignment = { horizontal: 'center' };
  nguoiKy.getCell(8).font = { bold: true };
  worksheet.mergeCells(`H${newRowNumber2}:J${newRowNumber2}`);

  // Create a blob and initiate download
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'sobansao.xlsx';
  a.click();
};

export default ExportExcel;
