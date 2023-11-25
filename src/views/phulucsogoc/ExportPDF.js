import jsPDF from 'jspdf';
import { fontNormal, fontBold, fontItalic } from '../../assets/fonts/TimeNewRomanFont';
import 'jspdf-autotable';

export function generatePDF(hocsinhs, data) {
  console.log(hocsinhs, data);
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
  doc.text(data.title, (width / 4) * 2, textHeight * 2, {
    align: 'center'
  });
  doc.setFont('Time-New-Roman-Normal', 'normal');

  const headerTable = [
    'STT',
    'Họ và Tên',
    'CCCD',
    'Ngày tháng năm sinh',
    'Số hiệu văn bằng đã được cấp',
    'Số hiệu văn bằng đã được cấp lại (Nếu có)',
    'Số vào sổ gốc cấp bằng mới (Nếu có)',
    'Nội dung chỉnh sửa',
    'Chữ ký người nhận',
    'Ghi chú'
  ];

  const body = hocsinhs.map((hocsinh, index) => {
    return [
      index + 1,
      hocsinh.hoTen,
      hocsinh.cccd,
      hocsinh.ngaySinh_fm,
      hocsinh.soHieuVanBangCu,
      hocsinh.soHieuVanBangCapLai,
      hocsinh.soVaoSoCapBangCapLai,
      hocsinh.noiDungChinhSua,
      '',
      ''
    ];
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
  doc.text(data.thutruong, (width / 4) * 3 - 5, tableHeight + 12, {
    align: 'center'
  });

  doc.setFont('Time-New-Roman-Normal', 'normal');
  doc.text(data.nguoiKy, (width / 4) * 3 - 5, tableHeight + textHeight * 2, {
    align: 'center'
  });

  doc.save('phulucsogoc.pdf');
}
