import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import MainCard from 'components/cards/MainCard';
import { IconPrinter } from '@tabler/icons';
import { Button, Grid, FormControl, Select, MenuItem } from '@mui/material';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectedDanhmucSelector, selectedDonvitruongSelector, selectedPhoigocSelector, openSubPopupSelector } from 'store/selectors';
import { useState } from 'react';
import { GetConfigPhoi } from 'services/phoigocService';
import ExitButton from 'components/button/ExitButton';
import DuLieuInTungNguoi from './XuLyDuLieuInTungNguoi';
import { CapBang } from 'services/capbangbanchinhService';
import { convertISODateToFormattedDate } from 'utils/formatDate';
import { handleAddNumberZeroDayAndMonth } from 'utils/handleAddNumberZeroDayAndMonth';
import optionConfg from 'utils/optionConfig';
import { GetAllTruongDuLieuPhoiGoc } from 'services/sharedService';

const InBangTungNguoi = ({ duLieuHocSinh }) => {
  const phoigoc = useSelector(selectedPhoigocSelector);
  const [duLieuConFig, setDuLieuConFig] = useState([]);
  const donvi = useSelector(selectedDonvitruongSelector);
  const danhmuc = useSelector(selectedDanhmucSelector);
  const dispatch = useDispatch();
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
      <MainCard hideInstruct sx={{ backgroundColor: '#4d3b3b1f' }}>
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

export default InBangTungNguoi;
