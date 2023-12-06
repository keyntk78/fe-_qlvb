import React, { useRef } from 'react';
import ReactToPrint, { useReactToPrint } from 'react-to-print';
import DuLieuInThu from './XuLyDuLieuInThu';
import MainCard from 'components/cards/MainCard';
import { IconPrinter } from '@tabler/icons';
import { Button, Grid, Select, MenuItem, FormControl } from '@mui/material';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectedPhoigocSelector, openSubPopupSelector } from 'store/selectors';
import { useState } from 'react';
import { GetConfigPhoi } from 'services/phoigocService';
import ExitButton from 'components/button/ExitButton';
import { convertISODateToFormattedDate } from 'utils/formatDate';
import { handleAddNumberZeroDayAndMonth } from 'utils/handleAddNumberZeroDayAndMonth';
import { GetAllTruongDuLieuPhoiGoc } from 'services/sharedService';
import optionConfg from 'utils/optionConfig';

const InThu = ({ duLieuHocSinh }) => {
  const phoigoc = useSelector(selectedPhoigocSelector);
  const [duLieuConFig, setDuLieuConFig] = useState([]);
  const [selectConfig, setSelectConfig] = useState(optionConfg[0].id);
  const [chieuDai, setChieuDai] = useState(0);
  const [chieuRong, setChieuRong] = useState(0);
  const openSubPopup = useSelector(openSubPopupSelector);

  useEffect(() => {
    const fetchDataDLHS = async () => {
      if (selectConfig === optionConfg[0].id) {
        const response_cf = await GetAllTruongDuLieuPhoiGoc();
        setDuLieuConFig(response_cf.data.cauHinhPhoiGocs);
        setChieuDai(response_cf.data.chieuDoc);
        setChieuRong(response_cf.data.chieuNgang);
      } else {
        const response_cf = await GetConfigPhoi(phoigoc.id);
        setDuLieuConFig(response_cf.data);
        setChieuDai(0);
        setChieuRong(0);
      }
    };

    if (!openSubPopup) {
      setSelectConfig(optionConfg[0].id);
    }
    if (openSubPopup) {
      fetchDataDLHS();
    }
  }, [phoigoc.id, selectConfig, openSubPopup]);
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
          <DuLieuInThu
            studentDataList={DataInBang}
            positionConfig={cauHinhViTri}
            componentRef={componentRef}
            chieuDai={chieuDai}
            chieuRong={chieuRong}
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

export default InThu;
