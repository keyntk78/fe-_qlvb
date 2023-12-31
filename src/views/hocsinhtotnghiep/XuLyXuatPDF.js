import jsPDF from 'jspdf';
import { fontNormal, fontBold, fontItalic } from '../../assets/fonts/TimeNewRomanFont';

export function generatePDF(data, paperSize, donvi) {
  const doc = new jsPDF(paperSize === 'A4' ? 'p' : 'l', 'mm', paperSize);

  doc.addFileToVFS('Time-New-Roman-Normal.ttf', fontNormal);
  doc.addFileToVFS('Time-New-Roman-Bold.ttf', fontBold);
  doc.addFileToVFS('Time-New-Roman-Italic.ttf', fontItalic);
  doc.addFont('Time-New-Roman-Normal.ttf', 'Time-New-Roman-Normal', 'normal');
  doc.addFont('Time-New-Roman-Bold.ttf', 'Time-New-Roman-Bold', 'bold');
  doc.addFont('Time-New-Roman-Italic.ttf', 'Time-New-Roman-Italic', 'italic');
  doc.setFont('Time-New-Roman-Normal', 'normal');
  let textHeight = 10;
  let textA5Height = 0;
  if (paperSize === 'A4') {
    doc.setFontSize(13);
    textHeight = 20;
    doc.setLineHeightFactor(1.8);
  } else {
    doc.setFontSize(12);
    textHeight = 15;
    textA5Height = 3;
    doc.setLineHeightFactor(1.5);
  }

  var width = doc.internal.pageSize.getWidth();
  // var height = doc.internal.pageSize.getHeight();
  var minWidth = 30;

  data.forEach((item, index) => {
    if (index > 0) {
      doc.addPage();
    }
    doc.setFontSize(12);
    doc.setFont('Time-New-Roman-Bold', 'bold');
    doc.text([`${donvi === 1 ? 'SỞ' : 'PHÒNG'} GD&ĐT ${item.diaPhuong}`, `TRƯỜNG ${item.tenTruong}`, ``], (width / 4) * 1 + 6, textHeight, {
      align: 'center'
    });

    doc.text([`CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM`, `Độc lập – Tự do – Hạnh phúc`], (width / 4) * 3 - 6, textHeight, {
      align: 'center'
    });

    doc.line((width / 4) * 1 - 24, textHeight * 2 - 8, (width / 4) * 1 + 36, textHeight * 2 - 8);
    doc.line((width / 4) * 3 - 36, textHeight * 2 - 8, (width / 4) * 3 + 24, textHeight * 2 - 8);

    doc.setFontSize(13);

    const title = `GIẤY CHỨNG NHẬN TỐT NGHIỆP TRUNG HỌC ${donvi === 1 ? 'PHỔ THÔNG' : 'CƠ SỞ'}`;
    doc.text(title, (width / 2) * 1, textHeight * 2 + 10, {
      align: 'center'
    });
    doc.setFont('Time-New-Roman-Normal', 'normal');
    doc.text('(tạm thời)', (width / 2) * 1, textHeight * 3, {
      align: 'center'
    });

    doc.text(`Chứng nhận: ${item.hoTen}`, minWidth, textHeight * 3 + 10);
    doc.text(`Giới tính: ${item.gioiTinh}`, 120, textHeight * 3 + 10);

    doc.text(`Ngày sinh: ${item.ngaySinh}`, minWidth, textHeight * 4 + textA5Height);
    doc.text(`Nơi sinh: ${item.noiSinh}`, 100, textHeight * 4);

    doc.text(`Lớp: ${item.lop}`, minWidth, textHeight * 4 + 10);
    doc.text(`Trường: ${item.tenTruong}`, 105, textHeight * 4 + 10);

    doc.text(`Hiện cư trú tại: ${item.queQuan}`, minWidth, textHeight * 5 + textA5Height);

    doc.text(
      `Đã được công nhận tốt nghiệp trung học ${donvi === 1 ? 'phổ thông' : 'cơ sở'} tại Hội đồng xét công nhận tốt nghiệp: ${
        item.tenTruong
      } ngày ${item.ngay} tháng ${item.thang} năm ${item.nam}.`,
      minWidth,
      textHeight * 5 + 10,
      {
        maxWidth: width - 50
      }
    );

    doc.text(`Xếp loại tốt nghiệp: ${item.xepLoaiTotNghiep}`, minWidth, textHeight * 6 + 9);

    const times = paperSize === 'A4' ? 8 : 7;
    doc.setFont('Time-New-Roman-Bold', 'bold');
    doc.text('HIỆU TRƯỞNG', (width / 4) * 3 + 5, textHeight * times, {
      align: 'center'
    });
    doc.setFont('Time-New-Roman-Italic', 'italic');
    doc.text('(Họ, tên, chữ ký và đóng dấu)', (width / 4) * 3 + 5, textHeight * times + 5, {
      align: 'center'
    });
    doc.setFont('Time-New-Roman-Normal', 'normal');
    doc.text(item.hieuTruong, (width / 4) * 3 + 5, textHeight * (times + 2) + 10 - textA5Height, {
      align: 'center'
    });
  });

  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString().split('/').join('-');
  doc.save(`GiayChungNhanTamThoi-${formattedDate}.pdf`);
}
