import { useDispatch } from 'react-redux';
import { getNamthi } from 'services/namthiService';
import { setLoading } from 'store/actions';
import ExcelJS from 'exceljs';
import { getDanToc } from 'services/dantocService';
import { convertISODateToFormattedDate } from 'utils/formatDate';
import { getAllKhoathi } from 'services/khoathiService';
import { getHedaotao } from 'services/hedaotaoService';
import { getSearchHinhthucdaotao } from 'services/hinhthucdaotaoService';
import { getSearchMonthi } from 'services/monthiService';
export const ExportData = () => {
  const dispatch = useDispatch();
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

    const headerRow = worksheet.addRow(['STT', 'TenNam']);
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

    const headerRow = worksheet.addRow(['STT', 'TenDanToc']);
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

    const headerRow = worksheet.addRow(['STT', 'TenKhoaThi', 'NgayThi', 'TenNamThi']);
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
    const worksheet = workbook.addWorksheet('Khóa Thi');

    const headerRow = worksheet.addRow(['STT', 'MaHeDaoTao', 'TenHeHDaoTao']);
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
    const worksheet = workbook.addWorksheet('Khóa Thi');

    const headerRow = worksheet.addRow(['STT', 'MaHinhThucDaoTao', 'TenHinhThucDaoTao']);
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
    const worksheet = workbook.addWorksheet('Khóa Thi');

    const headerRow = worksheet.addRow(['STT', 'MaMonThi', 'TenMonThi']);
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
  return {
    handleExport_NamHoc,
    handleExport_DanToc,
    handleExport_KhoaThi,
    handleExport_HeDaoTao,
    handleExport_HinhThucDaoTao,
    handleExport_MonThi
  };
};
