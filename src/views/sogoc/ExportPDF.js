import jsPDF from 'jspdf';
import { fontNormal, fontBold, fontItalic } from '../../assets/fonts/TimeNewRomanFont';
import { convertISODateToFormattedDate } from 'utils/formatDate';
import 'jspdf-autotable';

export function generatePDF(hocsinhs, data, donvi) {
  const doc = new jsPDF('landscape', 'mm');

  doc.addFileToVFS('Time-New-Roman-Normal.ttf', fontNormal);
  doc.addFileToVFS('Time-New-Roman-Bold.ttf', fontBold);
  doc.addFileToVFS('Time-New-Roman-Italic.ttf', fontItalic);
  doc.addFont('Time-New-Roman-Normal.ttf', 'Time-New-Roman-Normal', 'normal');
  doc.addFont('Time-New-Roman-Bold.ttf', 'Time-New-Roman-Bold', 'bold');
  doc.addFont('Time-New-Roman-Italic.ttf', 'Time-New-Roman-Italic', 'italic');
  doc.setFont('Time-New-Roman-Normal', 'normal');
  doc.setFontSize(13);
  doc.setLineHeightFactor(1.8);
  const textHeight = 20;
  var width = doc.internal.pageSize.getWidth();
  // var height = doc.internal.pageSize.getHeight();
  var minWidth = 20;

  doc.text(data.uyBanNhanDan, (width / 4) * 1, textHeight, {
    align: 'center'
  });
  doc.setFont('Time-New-Roman-Bold', 'bold');
  doc.text(data.coQuanCapBang, (width / 4) * 1, textHeight + 5, {
    align: 'center'
  });
  doc.line((width / 4) * 1 - 24, textHeight + 6, (width / 4) * 1 + 24, textHeight + 6);
  const title = donvi === 1 ? 'SỔ GỐC CẤP BẰNG TỐT NGHIỆP TRUNG HỌC PHỔ THÔNG' : 'SỔ GỐC CẤP BẰNG TỐT NGHIỆP TRUNG HỌC CƠ SỞ';
  doc.text(title, (width / 4) * 3 - 6, textHeight, {
    align: 'center'
  });
  doc.setFont('Time-New-Roman-Normal', 'normal');

  doc.text(`Quyết định công nhận tốt nghiệp số ${data.quyetDinh}`, minWidth, textHeight + 15);

  if (donvi === 1) {
    doc.text(`Khóa thi: ${data.khoaThi}`, 200, textHeight + 15);
    doc.text(`Kỳ thi: ${data.tenKyThi}`, minWidth, textHeight * 2);
    doc.text(`Học sinh trường: ${data.donVi}`, 200, textHeight * 2);
    doc.text(`Năm tốt nghiệp: ${data.namThi}`, minWidth, textHeight * 2 + 5);
  } else {
    doc.text(`Năm tốt nghiệp: ${data.namThi}`, 200, textHeight + 15);
    doc.text(`Học sinh trường: ${data.donVi}`, minWidth, textHeight * 2);
    doc.text(`Hình thức học: ${data.hinhThucDaoTao}`, 200, textHeight * 2);
  }

  const headerTable =
    donvi === 1
      ? [
          'STT',
          'Họ và Tên',
          'Ngày tháng năm sinh',
          'Nơi sinh',
          'Giới tính',
          'Dân tộc',
          'Điểm thi',
          'Xếp loại tốt nghiệp',
          'Số hiệu văn bằng',
          'Số vào sổ',
          'Chữ ký người nhận',
          'Ghi chú'
        ]
      : [
          'STT',
          'Họ và Tên',
          'Ngày tháng năm sinh',
          'Nơi sinh',
          'Giới tính',
          'Dân tộc',
          'Xếp loại tốt nghiệp',
          'Số hiệu văn bằng',
          'Số vào sổ',
          'Chữ ký người nhận',
          'Ghi chú'
        ];

  const body = hocsinhs.map((hocsinh, index) => {
    if (donvi === 1) {
      return [
        `${index + 1}`,
        hocsinh.hoTen,
        hocsinh.ngaySinh_fm,
        hocsinh.noiSinh,
        hocsinh.gioiTinh_fm,
        hocsinh.danToc,
        hocsinh.hoiDong,
        hocsinh.xepLoai,
        hocsinh.soHieuVanBang,
        hocsinh.soVaoSoCapBang,
        '',
        ''
      ];
    } else {
      return [
        `${index + 1}`,
        hocsinh.hoTen,
        hocsinh.ngaySinh_fm,
        hocsinh.noiSinh,
        hocsinh.gioiTinh_fm,
        hocsinh.danToc,
        hocsinh.xepLoai,
        hocsinh.soHieuVanBang,
        hocsinh.soVaoSoCapBang,
        '',
        ''
      ];
    }
  });
  doc.autoTable({
    head: [headerTable],
    body: body,
    styles: {
      font: 'Time-New-Roman-Normal',
      fontStyle: 'normal'
    },
    startX: minWidth,
    startY: textHeight * 2 + 10,
    theme: 'plain',
    headStyles: {
      lineWidth: 0.2,
      lineColor: 10,
      fillColor: 255,
      textColor: 20,
      fontStyle: 'bold',
      valign: 'center',
      halign: 'center'
    },
    bodyStyles: {
      lineWidth: 0.2,
      lineColor: 10
    }
  });
  const tableHeight = doc.lastAutoTable.finalY;

  doc.setFont('Time-New-Roman-Italic', 'italic');
  doc.text(`${data.diaPhuong}, ${data.ngayCap}`, (width / 4) * 3 - 5, tableHeight + 6, {
    align: 'center'
  });

  doc.setFont('Time-New-Roman-Bold', 'bold');
  doc.text(donvi === 1 ? 'GIÁM ĐỐC' : 'TRƯỞNG PHÒNG', (width / 4) * 3 - 5, tableHeight + 12, {
    align: 'center'
  });

  doc.setFont('Time-New-Roman-Normal', 'normal');
  doc.text(data.nguoiKy, (width / 4) * 3 - 5, tableHeight + textHeight * 2, {
    align: 'center'
  });

  doc.save('sogoc.pdf');
}

export function generatePDFAll(truongs, donvi) {
  const doc = new jsPDF('landscape', 'mm');

  doc.addFileToVFS('Time-New-Roman-Normal.ttf', fontNormal);
  doc.addFileToVFS('Time-New-Roman-Bold.ttf', fontBold);
  doc.addFileToVFS('Time-New-Roman-Italic.ttf', fontItalic);
  doc.addFont('Time-New-Roman-Normal.ttf', 'Time-New-Roman-Normal', 'normal');
  doc.addFont('Time-New-Roman-Bold.ttf', 'Time-New-Roman-Bold', 'bold');
  doc.addFont('Time-New-Roman-Italic.ttf', 'Time-New-Roman-Italic', 'italic');
  doc.setFont('Time-New-Roman-Normal', 'normal');
  doc.setFontSize(13);
  doc.setLineHeightFactor(1.8);
  const textHeight = 20;
  var width = doc.internal.pageSize.getWidth();
  // var height = doc.internal.pageSize.getHeight();
  var minWidth = 20;

  truongs.forEach((truong, index) => {
    if (index > 0) {
      doc.addPage();
    }

    doc.text(truong.uyBanNhanDan, (width / 4) * 1, textHeight, {
      align: 'center'
    });
    doc.setFont('Time-New-Roman-Bold', 'bold');
    doc.text(truong.coQuanCapBang, (width / 4) * 1, textHeight + 5, {
      align: 'center'
    });
    doc.line((width / 4) * 1 - 24, textHeight + 6, (width / 4) * 1 + 24, textHeight + 6);
    const title = donvi === 1 ? 'SỔ GỐC CẤP BẰNG TỐT NGHIỆP TRUNG HỌC PHỔ THÔNG' : 'SỔ GỐC CẤP BẰNG TỐT NGHIỆP TRUNG HỌC CƠ SỞ';
    doc.text(title, (width / 4) * 3 - 6, textHeight, {
      align: 'center'
    });
    doc.setFont('Time-New-Roman-Normal', 'normal');

    doc.text(`Quyết định công nhận tốt nghiệp số ${truong.soQuyetDinh}`, minWidth, textHeight + 15);

    if (donvi === 1) {
      doc.text(`Khóa thi: ${truong.khoaThi}`, 200, textHeight + 15);
      doc.text(`Kỳ thi: ${truong.tenKyThi}`, minWidth, textHeight * 2);
      doc.text(`Học sinh trường: ${truong.tenTruong}`, 200, textHeight * 2);
      doc.text(`Năm tốt nghiệp: ${truong.namThi}`, minWidth, textHeight * 2 + 5);
    } else {
      doc.text(`Năm tốt nghiệp: ${truong.namThi}`, 200, textHeight + 15);
      doc.text(`Học sinh trường: ${truong.tenTruong}`, minWidth, textHeight * 2);
      doc.text(`Hình thức học: ${truong.tenHinhThucDaoTao}`, 200, textHeight * 2);
    }

    const headerTable =
      donvi === 1
        ? [
            'STT',
            'Họ và Tên',
            'Ngày tháng năm sinh',
            'Nơi sinh',
            'Giới tính',
            'Dân tộc',
            'Điểm thi',
            'Xếp loại tốt nghiệp',
            'Số hiệu văn bằng',
            'Số vào sổ',
            'Chữ ký người nhận',
            'Ghi chú'
          ]
        : [
            'STT',
            'Họ và Tên',
            'Ngày tháng năm sinh',
            'Nơi sinh',
            'Giới tính',
            'Dân tộc',
            'Xếp loại tốt nghiệp',
            'Số hiệu văn bằng',
            'Số vào sổ',
            'Chữ ký người nhận',
            'Ghi chú'
          ];

    const body = truong.hocSinhs.map((hocsinh, index) => {
      if (donvi === 1) {
        return [
          `${index + 1}`,
          hocsinh.hoTen,
          convertISODateToFormattedDate(hocsinh.ngaySinh),
          hocsinh.noiSinh,
          hocsinh.gioiTinh ? 'Nam' : 'Nữ',
          hocsinh.danToc,
          hocsinh.hoiDong,
          hocsinh.xepLoai,
          hocsinh.soHieuVanBang,
          hocsinh.soVaoSoCapBang,
          '',
          ''
        ];
      } else {
        return [
          `${index + 1}`,
          hocsinh.hoTen,
          convertISODateToFormattedDate(hocsinh.ngaySinh),
          hocsinh.noiSinh,
          hocsinh.gioiTinh ? 'Nam' : 'Nữ',
          hocsinh.danToc,
          hocsinh.xepLoai,
          hocsinh.soHieuVanBang,
          hocsinh.soVaoSoCapBang,
          '',
          ''
        ];
      }
    });
    doc.autoTable({
      head: [headerTable],
      body: body,
      styles: {
        font: 'Time-New-Roman-Normal',
        fontStyle: 'normal'
      },
      startX: minWidth,
      startY: textHeight * 2 + 10,
      theme: 'plain',
      headStyles: {
        lineWidth: 0.2,
        lineColor: 10,
        fillColor: 255,
        textColor: 20,
        fontStyle: 'bold',
        valign: 'center',
        halign: 'center'
      },
      bodyStyles: {
        lineWidth: 0.2,
        lineColor: 10
      }
    });
    const tableHeight = doc.lastAutoTable.finalY;

    const date = `ngày ${new Date(truong.ngayCapBang).getDate()} tháng ${new Date(truong.ngayCapBang).getMonth() + 1} năm ${
      new Date(truong.ngayCapBang).getFullYear() + 1
    }`;

    doc.setFont('Time-New-Roman-Italic', 'italic');
    doc.text(`${truong.diaPhuongCapBang}, ${date}`, (width / 4) * 3 - 5, tableHeight + 6, {
      align: 'center'
    });

    doc.setFont('Time-New-Roman-Bold', 'bold');
    doc.text(donvi === 1 ? 'GIÁM ĐỐC' : 'TRƯỞNG PHÒNG', (width / 4) * 3 - 5, tableHeight + 12, {
      align: 'center'
    });

    doc.setFont('Time-New-Roman-Normal', 'normal');
    doc.text(truong.nguoiKyBang, (width / 4) * 3 - 5, tableHeight + textHeight * 2, {
      align: 'center'
    });
  });

  doc.save('sogoc.pdf');
}
