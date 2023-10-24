import React, { useRef } from 'react';
import ReactToPrint, { useReactToPrint } from 'react-to-print';
import MainCard from 'components/cards/MainCard';
import { IconPrinter } from '@tabler/icons';
import { Button, Grid } from '@mui/material';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { donviSelector, upDateVBCCSelector, userLoginSelector } from 'store/selectors';
import { useState } from 'react';
import ExitButton from 'components/button/ExitButton';
import DuLieuInTungNguoi from './DataInBang';
import { getByIdHistory } from 'services/chinhsuavbccService';
import { GetPhoiGocDangSuDung } from 'services/sharedService';

const InLaiVBCC = () => {
  const donvi = useSelector(donviSelector);
  const history = useSelector(upDateVBCCSelector);
  const user = useSelector(userLoginSelector);
  const [duLieuConFig, setDuLieuConFig] = useState([]);
  const [duLieuHocSinh, setDuLieuHocSinh] = useState([]);

  useEffect(() => {
    const fetchDataDLHS = async () => {
      const response_cf = await GetPhoiGocDangSuDung(user.username);
      setDuLieuConFig(response_cf.data);
      const dataHocSinh = await getByIdHistory(history.cccd, history.id);
      setDuLieuHocSinh(dataHocSinh.data);
    };
    fetchDataDLHS();
  }, []);
  const DataInBang = {
    HOTEN: history.hoTen,
    NOISINH: history.noiSinh, // Assuming you want the second part after the " - "
    NGAYTHANGNAMSINH: new Date(history.ngaySinh).toLocaleDateString(),
    GIOITINH: history.gioiTinh ? 'Nam' : 'Nữ',
    DANTOC: history.danToc,
    HOCSINHTRUONG: duLieuHocSinh && duLieuHocSinh.hocSinhs ? duLieuHocSinh.hocSinhs.truong.ten : '',
    NAMTOTNGHIEP: duLieuHocSinh && duLieuHocSinh.hocSinhs ? duLieuHocSinh.hocSinhs.namThi : '',
    XEPLOAITOTNGHIEP: history.xepLoai,
    HINHTHUCDAOTAO: duLieuHocSinh.hinhThucDaoTao,
    GOC_SOHIEUVANBANG: history.soHieuVanBangCapLai ? history.soHieuVanBangCapLai : history.soHieuVanBangCu,
    GOC_SOVAOSOCAP: history.soVaoSoCapBangCapLai ? history.soVaoSoCapBangCapLai : history.soVaoSoCapBangCu,
    NAMCAP: new Date(history.ngayCap).getFullYear(),
    NGAYCAP: new Date(history.ngayCap).getDate(),
    THANGCAP: new Date(history.ngayCap).getMonth() + 1,
    TRUONGPHONGDGDT: donvi.cauHinh.hoTenNguoiKySoGoc,
    NOICAP: donvi.cauHinh.tenDiaPhuongCapBang
  };
  const cauHinhViTri = {};

  if (duLieuConFig.cauHinhPhoiGocs) {
    for (const item of duLieuConFig.cauHinhPhoiGocs) {
      const maTruongDuLieu = item.maTruongDuLieu;
      cauHinhViTri[maTruongDuLieu] = {
        top: item.viTriTren,
        left: item.viTriTrai,
        fontWeight: item.dinhDangKieuChu,
        fontSize: item.coChu,
        fontFamily: item.kieuChu,
        color: item.mauChu
      };
    }
  }
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current
  });

  return (
    <>
      <MainCard sx={{ backgroundColor: '#4d3b3b1f' }}>
        <Grid container spacing={1}>
          <Grid item>
            <ReactToPrint
              trigger={() => (
                <Button variant="contained" title="In" startIcon={<IconPrinter />} onClick={handlePrint}>
                  In
                </Button>
              )}
              content={() => componentRef.current}
            />
          </Grid>
        </Grid>
        <div>
          <DuLieuInTungNguoi
            anhphoi={duLieuConFig.anhPhoi}
            studentDataList={DataInBang}
            positionConfig={cauHinhViTri}
            componentRef={componentRef}
          />
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

export default InLaiVBCC;
