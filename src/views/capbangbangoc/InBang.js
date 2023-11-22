import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import DuLieuIn from './XuLyDuLieuIn';
import MainCard from 'components/cards/MainCard';
import { IconFileExport, IconPrinter } from '@tabler/icons';
import { Button, Grid } from '@mui/material';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { disabledButtonSelector, selectedDanhmucSelector, selectedDonvitruongSelector, selectedPhoigocSelector } from 'store/selectors';
import { useState } from 'react';
import { GetConfigPhoi } from 'services/phoigocService';
import * as XLSX from 'xlsx';
import { setLoading, setReloadData } from 'store/actions';
import ExitButton from 'components/button/ExitButton';
// import { CapBang, CapBangTatCa } from 'services/capbangbanchinhService';
import { CapBang } from 'services/capbangbanchinhService';
import ButtonSuccess from 'components/buttoncolor/ButtonSuccess';
import { convertISODateToFormattedDate } from 'utils/formatDate';

const InBang = ({ duLieuHocSinhSoGoc }) => {
  const total = duLieuHocSinhSoGoc.length;
  const phoigoc = useSelector(selectedPhoigocSelector);
  const [duLieuConFig, setDuLieuConFig] = useState([]);
  const dispatch = useDispatch();
  const disabledButton = useSelector(disabledButtonSelector);
  const donvi = useSelector(selectedDonvitruongSelector);
  const danhmuc = useSelector(selectedDanhmucSelector);

  useEffect(() => {
    const fetchDataDLHS = async () => {
      const response_cf = await GetConfigPhoi(phoigoc.id);
      setDuLieuConFig(response_cf.data);
    };
    fetchDataDLHS();
  }, [phoigoc.id]);

  const DataInBang = duLieuHocSinhSoGoc.map((item) => {
    return {
      HOTEN: item.hoTen,
      NOISINH: item.noiSinh, // Assuming you want the second part after the " - "
      NGAYTHANGNAMSINH: convertISODateToFormattedDate(item.ngaySinh),
      GIOITINH: item.gioiTinh ? 'Nam' : 'Nữ',
      DANTOC: item.danToc,
      HOCSINHTRUONG: item.truong,
      NAMTOTNGHIEP: item.namThi,
      XEPLOAITOTNGHIEP: item.xepLoai,
      HINHTHUCDAOTAO: item.hinhThucDaoTao,
      GOC_SOHIEUVANBANG: item.soHieuVanBang,
      GOC_SOVAOSOCAP: item.soVaoSoCapBang,
      NAMCAP: new Date(item.ngayCapBang).getFullYear(),
      NGAYCAP: new Date(item.ngayCapBang).getDate(),
      THANGCAP: new Date(item.ngayCapBang).getMonth() + 1,
      TRUONGPHONGDGDT: item.nguoiKyBang,
      NOICAP: item.diaPhuongCapBang
    };
  });

  const handleExportTTIn = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    const formattedData = DataInBang.map((item, index) => ({
      STT: index + 1,
      'Họ và Tên': item.HOTEN,
      'Nơi Sinh': item.NOISINH,
      'Ngày tháng năm sinh': item.NGAYTHANGNAMSINH,
      'Giới tính': item.GIOITINH,
      'Dân Tộc': item.DANTOC,
      'Học sinh trường': item.HOCSINHTRUONG,
      'Năm tốt nghiệp': item.NAMTOTNGHIEP,
      'Xếp loại tốt nghiệp': item.XEPLOAITOTNGHIEP,
      'Hình thức đào tạo': item.HINHTHUCDAOTAO,
      'Số hiệu văn bằng': item.GOC_SOHIEUVANBANG,
      'Số vào sổ cấp': item.GOC_SOVAOSOCAP,
      'Năm cấp': item.NAMCAP,
      'Ngày cấp': item.NGAYCAP,
      'Tháng cấp': item.THANGCAP,
      'Người ký bằng': item.TRUONGPHONGDGDT,
      'Nơi cấp': item.NOICAP
    }));
    const worksheet = XLSX.utils.json_to_sheet(formattedData);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Thongtinin');
    // Điều chỉnh chiều rộng của các cột trong file xuất ra
    const columnsWidth = [
      { wch: 5 },
      { wch: 25 },
      { wch: 30 },
      { wch: 30 },
      { wch: 10 },
      { wch: 20 },
      { wch: 15 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 20 },
      { wch: 20 }
    ];

    worksheet['!cols'] = columnsWidth;
    XLSX.writeFile(workbook, 'thongtinin.xlsx');
    dispatch(setLoading(false));
  };

  const cauHinhViTri = {};

  for (const item of duLieuConFig) {
    const maTruongDuLieu = item.maTruongDuLieu;
    cauHinhViTri[maTruongDuLieu] = {
      top: item.viTriTren,
      left: item.viTriTrai,
      color: item.mauChu,
      fontWeight: item.dinhDangKieuChu,
      fontSize: item.coChu,
      fontFamily: item.kieuChu
    };
  }
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current
  });

  const handlePrintAndCallApi = async () => {
    handlePrint();
    const cccdList = duLieuHocSinhSoGoc.map((item) => item.cccd);
    try {
      const params = new URLSearchParams();
      params.append('idDanhMucTotNghiep', danhmuc.id);
      params.append('idTruong', donvi.id);
      await CapBang(params, cccdList);
      dispatch(setReloadData(true));
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <>
      <MainCard sx={{ backgroundColor: '#4d3b3b1f' }}>
        <Grid container spacing={1}>
          <Grid item>
            <Button
              disabled={disabledButton || phoigoc.soLuongPhoi < total}
              variant="contained"
              title="In Bằng"
              startIcon={<IconPrinter />}
              onClick={handlePrintAndCallApi}
            >
              In
            </Button>
          </Grid>
          <Grid item>
            <ButtonSuccess title="Xuất thông tin in bằng" onClick={handleExportTTIn} icon={IconFileExport} />
          </Grid>
        </Grid>
        <div>
          <DuLieuIn studentDataList={DataInBang} positionConfig={cauHinhViTri} componentRef={componentRef} />
        </div>
      </MainCard>
      <Grid container justifyContent="flex-end" mt={1}>
        <Grid>
          {' '}
          <ExitButton type="subpopup" />
        </Grid>
      </Grid>
    </>
  );
};

export default InBang;
