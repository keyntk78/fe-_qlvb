import React, { useRef } from 'react';
import ReactToPrint, { useReactToPrint } from 'react-to-print';
import MainCard from 'components/cards/MainCard';
import { IconPrinter } from '@tabler/icons';
import { Button, Grid, FormControl, Select, MenuItem } from '@mui/material';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { donviSelector, upDateVBCCSelector, userLoginSelector, openSubPopupSelector } from 'store/selectors';
import { useState } from 'react';
import ExitButton from 'components/button/ExitButton';
import DuLieuInTungNguoi from './DataInBang';
import { getByIdHistory } from 'services/chinhsuavbccService';
import { GetPhoiGocDangSuDung } from 'services/sharedService';
import { convertISODateToFormattedDate } from 'utils/formatDate';
import optionConfg from 'utils/optionConfig';
import { GetAllTruongDuLieuPhoiGoc } from 'services/sharedService';

const InLaiVBCC = () => {
  const donvi = useSelector(donviSelector);
  const history = useSelector(upDateVBCCSelector);
  const user = useSelector(userLoginSelector);
  const [duLieuConFig, setDuLieuConFig] = useState([]);
  const [duLieuHocSinh, setDuLieuHocSinh] = useState([]);
  const [selectConfig, setSelectConfig] = useState(optionConfg[0].id);
  const openSubPopup = useSelector(openSubPopupSelector);

  useEffect(() => {
    const fetchDataDLHS = async () => {
      if (selectConfig === optionConfg[0].id) {
        const response_cf = await GetAllTruongDuLieuPhoiGoc();
        const response_cfAnh = await GetPhoiGocDangSuDung(user.username);
        response_cf.data.anhPhoi = response_cfAnh.data.anhPhoi;
        setDuLieuConFig(response_cf.data);
      } else {
        const response_cf = await GetPhoiGocDangSuDung(user.username);
        setDuLieuConFig(response_cf.data);
      }
      const dataHocSinh = await getByIdHistory(history.cccd, history.id);
      setDuLieuHocSinh(dataHocSinh.data);
    };

    if (!openSubPopup) {
      setSelectConfig(optionConfg[0].id);
    }
    if (openSubPopup) {
      fetchDataDLHS();
    }
    //fetchDataDLHS();
  }, [selectConfig, openSubPopup]);
  const DataInBang = {
    HOTEN: history.hoTen,
    NOISINH: history.noiSinh, // Assuming you want the second part after the " - "
    NGAYTHANGNAMSINH: convertISODateToFormattedDate(history.ngaySinh),
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
        color: item.mauChu,
        display: item.hienThi ? 'block' : 'none'
      };
    }
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
                <Button variant="contained" title="In" startIcon={<IconPrinter />} onClick={handlePrint}>
                  In
                </Button>
              )}
              content={() => componentRef.current}
            />
          </Grid>
          <Grid item>
            <FormControl fullWidth variant="outlined">
              <Select value={selectConfig} onChange={(e) => setSelectConfig(e.target.value)} size="small" sx={{ overflow: 'hidden' }}>
                {optionConfg.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <div>
          <DuLieuInTungNguoi
            // anhphoi={duLieuConFig.anhPhoi}
            duLieuPhoi={duLieuConFig}
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
