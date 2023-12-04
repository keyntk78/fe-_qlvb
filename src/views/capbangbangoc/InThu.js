import React, { useRef } from 'react';
import ReactToPrint, { useReactToPrint } from 'react-to-print';
import DuLieuInThu from './XuLyDuLieuInThu';
import MainCard from 'components/cards/MainCard';
import { IconPrinter } from '@tabler/icons';
import { Button, Grid } from '@mui/material';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectedPhoigocSelector } from 'store/selectors';
import { useState } from 'react';
import { GetConfigPhoi } from 'services/phoigocService';
import ExitButton from 'components/button/ExitButton';
import { convertISODateToFormattedDate } from 'utils/formatDate';
import { handleAddNumberZeroDayAndMonth } from 'utils/handleAddNumberZeroDayAndMonth';

const InThu = ({ duLieuHocSinh }) => {
  const phoigoc = useSelector(selectedPhoigocSelector);
  const [duLieuConFig, setDuLieuConFig] = useState([]);
  useEffect(() => {
    const fetchDataDLHS = async () => {
      const response_cf = await GetConfigPhoi(phoigoc.id);
      setDuLieuConFig(response_cf.data);
    };
    fetchDataDLHS();
  }, [phoigoc.id]);
  const DataInBang = {
    HOTEN: duLieuHocSinh.hoTen,
    NOISINH: duLieuHocSinh.noiSinh, // Assuming you want the second part after the " - "
    NGAYTHANGNAMSINH: convertISODateToFormattedDate(duLieuHocSinh.ngaySinh),
    GIOITINH: duLieuHocSinh.gioiTinh ? 'Nam' : 'Nữ',
    DANTOC: duLieuHocSinh.danToc,
    HOCSINHTRUONG: duLieuHocSinh.truong,
    NAMTOTNGHIEP: duLieuHocSinh.namThi,
    XEPLOAITOTNGHIEP: duLieuHocSinh.xepLoai,
    HINHTHUCDAOTAO: duLieuHocSinh.hinhThucDaoTao,
    GOC_SOHIEUVANBANG: duLieuHocSinh.soHieuVanBang,
    GOC_SOVAOSOCAP: duLieuHocSinh.soVaoSoCapBang,
    NAMCAP: new Date(duLieuHocSinh.ngayCapBang).getFullYear(),
    NGAYCAP: handleAddNumberZeroDayAndMonth(new Date(duLieuHocSinh.ngayCapBang).getDate()),
    THANGCAP: handleAddNumberZeroDayAndMonth(new Date(duLieuHocSinh.ngayCapBang).getMonth() + 1),
    TRUONGPHONGDGDT: duLieuHocSinh.nguoiKyBang,
    NOICAP: duLieuHocSinh.diaPhuongCapBang
  };
  const cauHinhViTri = {};

  for (const item of duLieuConFig) {
    const maTruongDuLieu = item.maTruongDuLieu;
    cauHinhViTri[maTruongDuLieu] = {
      top: item.viTriTren,
      left: item.viTriTrai,
      fontWeight: item.dinhDangKieuChu,
      fontSize: item.coChu,
      fontFamily: item.kieuChu,
      color: item.mauChu,
      display: item.hienThi ? 'block' : 'none'
    };
  }
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current
  });

  return (
    <>
      <MainCard hideInstruct sx={{ backgroundColor: '#4d3b3b1f' }}>
        <Grid container spacing={1}>
          <Grid item>
            <ReactToPrint
              trigger={() => (
                <Button variant="contained" title="In Thử" startIcon={<IconPrinter />} onClick={handlePrint}>
                  In
                </Button>
              )}
              content={() => componentRef.current}
            />
          </Grid>
        </Grid>
        <div>
          <DuLieuInThu studentDataList={DataInBang} positionConfig={cauHinhViTri} componentRef={componentRef} />
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

export default InThu;
