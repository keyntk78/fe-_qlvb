import { useDispatch, useSelector } from 'react-redux';
import { getNamthi } from 'services/namthiService';
import { setLoading } from 'store/actions';
import ExcelJS from 'exceljs';
import { getDanToc } from 'services/dantocService';
import { convertISODateToFormattedDate } from 'utils/formatDate';
import { getAllKhoathi } from 'services/khoathiService';
import { getHedaotao } from 'services/hedaotaoService';
import { getSearchHinhthucdaotao } from 'services/hinhthucdaotaoService';
import { getSearchMonthi } from 'services/monthiService';
import { userLoginSelector } from 'store/selectors';
import { getAllTruong } from 'services/sharedService';
export const ExportData = () => {
  const dispatch = useDispatch();
  const user = useSelector(userLoginSelector);
  const handleExport_NamHoc = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    const params = new URLSearchParams();
    params.append('Order', 1);
    params.append('OrderDir', 'ASC');
    params.append('StartIndex', '0');
    params.append('PageSize', -1);
    const response = await getNamthi(params);
    const formattedData = response.data.namThis.map((item, index) => ({
      STT: index + 1,
      Tên: item.ten
    }));
    dispatch(setLoading(false));
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Năm Thi');

    const headerRow = worksheet.addRow(['STT', 'Ten']);
    const descriptionRow = worksheet.addRow(['Số Thứ Tự', 'Tên Năm']);
    headerRow.eachCell((cell) => {
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.alignment.wrapText = true;
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'F0F8FF' }
      };
      cell.font = { color: { argb: 'FF0000' } };
    });
    descriptionRow.eachCell((cell) => {
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.alignment.wrapText = true;
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'F0F8FF' }
      };
      cell.font = { color: { argb: 'FF0000' } };
    });
    // Adding data rows
    formattedData.forEach((item) => {
      const dataRow = worksheet.addRow([item.STT, item.Tên]);
      dataRow.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      });
    });
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NamThi.xlsx`;
    a.click();
  };
  const handleExport_DanToc = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    const params = new URLSearchParams();
    params.append('Order', 1);
    params.append('OrderDir', 'ASC');
    params.append('StartIndex', '0');
    params.append('PageSize', -1);
    const response = await getDanToc(params);
    const formattedData = response.data.danTocs.map((item, index) => ({
      STT: index + 1,
      Tên: item.ten
    }));
    dispatch(setLoading(false));
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Dân Tộc');

    const headerRow = worksheet.addRow(['STT', 'Ten']);
    const descriptionRow = worksheet.addRow(['Số Thứ Tự', 'Tên Dân Tộc']);
    headerRow.eachCell((cell) => {
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.alignment.wrapText = true;
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'F0F8FF' }
      };
      cell.font = { color: { argb: 'FF0000' } };
    });
    descriptionRow.eachCell((cell) => {
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.alignment.wrapText = true;
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'F0F8FF' }
      };
      cell.font = { color: { argb: 'FF0000' } };
    });
    // Adding data rows
    formattedData.forEach((item) => {
      const dataRow = worksheet.addRow([item.STT, item.Tên]);
      dataRow.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      });
    });
    worksheet.getColumn(1).width = 10; //stt
    worksheet.getColumn(2).width = 25; //ten
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DanToc.xlsx`;
    a.click();
  };
  const handleExport_KhoaThi = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    const response = await getAllKhoathi();
    const formattedData = response.data.map((item, index) => ({
      STT: index + 1,
      Tên: item.ten,
      NgayThi: convertISODateToFormattedDate(item.ngay),
      NamThi: item.ngay.slice(0, 4)
    }));
    dispatch(setLoading(false));
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Khóa Thi');

    const headerRow = worksheet.addRow(['STT', 'Ten', 'Ngay', 'Nam']);
    const descriptionRow = worksheet.addRow(['Số Thứ Tự', 'Tên Khóa Thi', 'Ngày Thi', 'Tên Năm Thi']);
    headerRow.eachCell((cell) => {
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.alignment.wrapText = true;
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'F0F8FF' }
      };
      cell.font = { color: { argb: 'FF0000' } };
    });
    descriptionRow.eachCell((cell) => {
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.alignment.wrapText = true;
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'F0F8FF' }
      };
      cell.font = { color: { argb: 'FF0000' } };
    });
    // Adding data rows
    formattedData.forEach((item) => {
      const dataRow = worksheet.addRow([item.STT, item.Tên, item.NgayThi, item.NamThi]);
      dataRow.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      });
    });
    worksheet.getColumn(1).width = 10; //stt
    worksheet.getColumn(2).width = 25; //ten
    worksheet.getColumn(3).width = 25; //stt
    worksheet.getColumn(4).width = 25; //ten
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `KhoaThi.xlsx`;
    a.click();
  };
  const handleExport_HeDaoTao = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    const params = new URLSearchParams();
    params.append('Order', 1);
    params.append('OrderDir', 'ASC');
    params.append('StartIndex', '0');
    params.append('PageSize', -1);
    const response = await getHedaotao(params);
    const formattedData = response.data.heDaoTaos.map((item, index) => ({
      STT: index + 1,
      Ma: item.ma,
      Tên: item.ten
    }));
    dispatch(setLoading(false));
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Hệ Đào Tạo');

    const headerRow = worksheet.addRow(['STT', 'Ma', 'Ten']);
    const descriptionRow = worksheet.addRow(['Số Thứ Tự', 'Mã Hệ Đào Tạo', 'Tên Hệ Đào Tạo']);
    headerRow.eachCell((cell) => {
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.alignment.wrapText = true;
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'F0F8FF' }
      };
      cell.font = { color: { argb: 'FF0000' } };
    });
    descriptionRow.eachCell((cell) => {
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.alignment.wrapText = true;
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'F0F8FF' }
      };
      cell.font = { color: { argb: 'FF0000' } };
    });
    // Adding data rows
    formattedData.forEach((item) => {
      const dataRow = worksheet.addRow([item.STT, item.Ma, item.Tên]);
      dataRow.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      });
    });
    worksheet.getColumn(1).width = 10; //stt
    worksheet.getColumn(2).width = 25; //ten
    worksheet.getColumn(3).width = 25; //stt
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `HeDaoTao.xlsx`;
    a.click();
  };
  const handleExport_HinhThucDaoTao = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    const params = new URLSearchParams();
    params.append('Order', 1);
    params.append('OrderDir', 'ASC');
    params.append('StartIndex', '0');
    params.append('PageSize', -1);
    const response = await getSearchHinhthucdaotao(params);
    const formattedData = response.data.hinhThucDaoTaos.map((item, index) => ({
      STT: index + 1,
      Ma: item.ma,
      Tên: item.ten
    }));
    dispatch(setLoading(false));
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Hình Thức Đào Tạo');

    const headerRow = worksheet.addRow(['STT', 'Ma', 'Ten']);
    const descriptionRow = worksheet.addRow(['Số Thứ Tự', 'Mã Hình Thức Đào Tạo', 'Tên Hình Thức Đào Tạo']);
    headerRow.eachCell((cell) => {
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.alignment.wrapText = true;
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'F0F8FF' }
      };
      cell.font = { color: { argb: 'FF0000' } };
    });
    descriptionRow.eachCell((cell) => {
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.alignment.wrapText = true;
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'F0F8FF' }
      };
      cell.font = { color: { argb: 'FF0000' } };
    });
    // Adding data rows
    formattedData.forEach((item) => {
      const dataRow = worksheet.addRow([item.STT, item.Ma, item.Tên]);
      dataRow.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      });
    });
    worksheet.getColumn(1).width = 10; //stt
    worksheet.getColumn(2).width = 25; //ten
    worksheet.getColumn(3).width = 25; //stt
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `HinhThucDaoTao.xlsx`;
    a.click();
  };
  const handleExport_MonThi = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    const params = new URLSearchParams();
    params.append('Order', 1);
    params.append('OrderDir', 'ASC');
    params.append('StartIndex', '0');
    params.append('PageSize', -1);
    const response = await getSearchMonthi(params);
    const formattedData = response.data.monThis.map((item, index) => ({
      STT: index + 1,
      Ma: item.ma,
      Tên: item.ten
    }));
    dispatch(setLoading(false));
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Môn Thi');

    const headerRow = worksheet.addRow(['STT', 'Ma', 'Ten']);
    const descriptionRow = worksheet.addRow(['Số Thứ Tự', 'Mã Môn Thi', 'Tên Môn Thi']);
    headerRow.eachCell((cell) => {
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.alignment.wrapText = true;
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'F0F8FF' }
      };
      cell.font = { color: { argb: 'FF0000' } };
    });
    descriptionRow.eachCell((cell) => {
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.alignment.wrapText = true;
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'F0F8FF' }
      };
      cell.font = { color: { argb: 'FF0000' } };
    });
    // Adding data rows
    formattedData.forEach((item) => {
      const dataRow = worksheet.addRow([item.STT, item.Ma, item.Tên]);
      dataRow.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      });
    });
    worksheet.getColumn(1).width = 10; //stt
    worksheet.getColumn(2).width = 25; //ten
    worksheet.getColumn(3).width = 25; //stt
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MonThi.xlsx`;
    a.click();
  };
  const handleExport_DonVi = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    //const params = new URLSearchParams();
    // params.append('Order', 1);
    // params.append('OrderDir', 'ASC');
    // params.append('StartIndex', '0');
    // params.append('PageSize', -1);
    // params.append('nguoiThucHien', user ? user.username : '');
    const response = await getAllTruong(user ? user.username : '');
    const formattedData = response.data.map((item, index) => ({
      STT: index + 1,
      Ma: item.ma,
      Ten: item.ten,
      MaHeDaoTao: item.maHeDaoTao,
      MaHinhThucDaoTao: item.maHinhThucDaoTao,
      URL: item.url,
      DiaChi: item.diaChi,
      Email: item.email,
      LogoDonvi: item.cauHinh.logoDonvi,
      HieuTruong: item.cauHinh.hieuTruong,
      TenDiaPhuong: item.cauHinh.tenDiaPhuong,
      NgayBanHanh: item.cauHinh.ngayBanHanh,
      DinhDangSoThuTuSoGoc: item.cauHinh.dinhDangSoThuTuSoGoc,
      CauHinhNam: item.cauHinh.nam
    }));
    dispatch(setLoading(false));
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Đơn vị');

    const headerRow = worksheet.addRow([
      'STT',
      'Ma',
      'Ten',
      'MaHeDaoTao',
      'MaHinhThucDaoTao',
      'URL',
      'DiaChi',
      'Email',
      'LogoDonvi',
      'HieuTruong',
      'TenDiaPhuong',
      'NgayBanHanh',
      'DinhDangSoThuTuSoGoc',
      'Nam'
    ]);
    const descriptionRow = worksheet.addRow([
      'Số Thứ Tự',
      'Mã Trường',
      'Tên Trường',
      'Mã hệ đào tạo',
      'Mã hình thức đào tạo',
      'Đường dẫn',
      'Địa chỉ',
      'Email',
      'Logo trường',
      'Tên hiệu trưởng',
      'Tên địa phương',
      'Ngày ban hành',
      'Định dạng số thứ tự vào sổ gốc',
      'Cấu hình năm'
    ]);
    headerRow.eachCell((cell) => {
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.alignment.wrapText = true;
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'F0F8FF' }
      };
      cell.font = { color: { argb: 'FF0000' } };
    });
    descriptionRow.eachCell((cell) => {
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.alignment.wrapText = true;
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'F0F8FF' }
      };
      cell.font = { color: { argb: 'FF0000' } };
    });
    // Adding data rows
    formattedData.forEach((item) => {
      const dataRow = worksheet.addRow([
        item.STT,
        item.Ma,
        item.Ten,
        item.MaHeDaoTao,
        item.MaHinhThucDaoTao,
        item.URL == null || item.URL == undefined ? '' : item.URL,
        item.DiaChi == null || item.DiaChi == undefined ? '' : item.DiaChi,
        item.Email == null || item.Email == undefined ? '' : item.Email,
        item.LogoDonvi,
        item.HieuTruong,
        item.TenDiaPhuong,
        item.NgayBanHanh,
        item.DinhDangSoThuTuSoGoc == null || item.DinhDangSoThuTuSoGoc == undefined ? '' : item.DinhDangSoThuTuSoGoc,
        item.CauHinhNam == null || item.CauHinhNam == undefined ? '' : item.CauHinhNam
      ]);
      dataRow.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      });
    });
    worksheet.getColumn(1).width = 10;
    worksheet.getColumn(2).width = 25;
    worksheet.getColumn(3).width = 35;
    worksheet.getColumn(4).width = 25;
    worksheet.getColumn(5).width = 25;
    worksheet.getColumn(6).width = 50;
    worksheet.getColumn(7).width = 75;
    worksheet.getColumn(8).width = 35;
    worksheet.getColumn(9).width = 25;
    worksheet.getColumn(10).width = 25;
    worksheet.getColumn(11).width = 25;
    worksheet.getColumn(12).width = 25;
    worksheet.getColumn(13).width = 30;
    worksheet.getColumn(14).width = 25;
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DonVi.xlsx`;
    a.click();
  };
  return {
    handleExport_NamHoc,
    handleExport_DanToc,
    handleExport_KhoaThi,
    handleExport_HeDaoTao,
    handleExport_HinhThucDaoTao,
    handleExport_MonThi,
    handleExport_DonVi
  };
};
