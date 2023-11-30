import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import MainCard from 'components/cards/MainCard';
import { IconPrinter } from '@tabler/icons';
import { Button, Grid } from '@mui/material';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectedDanhmucSelector, selectedDonvitruongSelector, selectedPhoigocSelector } from 'store/selectors';
import { useState } from 'react';
import { GetConfigPhoi } from 'services/phoigocService';
import ExitButton from 'components/button/ExitButton';
import DuLieuInTungNguoi from './XuLyDuLieuInTungNguoi';
import { CapBang } from 'services/capbangbanchinhService';
import { convertISODateToFormattedDate } from 'utils/formatDate';
import { handleAddNumberZeroDayAndMonth } from 'utils/handleAddNumberZeroDayAndMonth';

const InBangTungNguoi = ({ duLieuHocSinh }) => {
  const phoigoc = useSelector(selectedPhoigocSelector);
  const [duLieuConFig, setDuLieuConFig] = useState([]);
  const donvi = useSelector(selectedDonvitruongSelector);
  const danhmuc = useSelector(selectedDanhmucSelector);
  const dispatch = useDispatch();

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
  const handlePrintAndCallApi = async () => {
    handlePrint();
    const cccd = [duLieuHocSinh.cccd];
    try {
      const params = new URLSearchParams();
      params.append('idDanhMucTotNghiep', danhmuc.id);
      params.append('idTruong', donvi.id);
      await CapBang(params, cccd);
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
            {/* <ReactToPrint
              trigger={() => (
                <Button variant="contained" title="In" startIcon={<IconPrinter />} onClick={handlePrintAndCallApi}>
                  In
                </Button>
              )}
              content={() => componentRef.current}
            /> */}
            <Button variant="contained" title="In" startIcon={<IconPrinter />} onClick={handlePrintAndCallApi}>
              In
            </Button>
          </Grid>
        </Grid>
        <div>
          <DuLieuInTungNguoi studentDataList={DataInBang} positionConfig={cauHinhViTri} componentRef={componentRef} />
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

export default InBangTungNguoi;
