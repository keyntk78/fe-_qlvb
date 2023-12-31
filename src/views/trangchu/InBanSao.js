import React, { useRef } from 'react';
import ReactToPrint, { useReactToPrint } from 'react-to-print';
import MainCard from 'components/cards/MainCard';
import { IconPrinter } from '@tabler/icons';
import { Button, FormControl, Grid, MenuItem, Select } from '@mui/material';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { capBangBansaoSelector, userLoginSelector, openPopupSelector } from 'store/selectors';
import { useState } from 'react';
import { GetConfigPhoi } from 'services/phoisaoService';
import ExitButton from 'components/button/ExitButton';
import { getHocSinhDaDuaVaoSobanSao } from 'services/capbangbansaoService';
import XuLyDuLieuInBanSao from 'views/capbangbansao/XuLyDuLieuInBanSao';
import { selectedPhoisao } from 'store/actions';
import { convertISODateToFormattedDate } from 'utils/formatDate';
import { GetPhoiBanSaoById, GetAllTruongDuLieuPhoiBanSao } from 'services/sharedService';
import { handleAddNumberZeroDayAndMonth } from 'utils/handleAddNumberZeroDayAndMonth';
import optionConfg from 'utils/optionConfig';

const InBanSao = () => {
  const [hsSoBanSao, setHsSoBanSao] = useState([]);
  const hocsinhid = useSelector(capBangBansaoSelector);
  const [phoisao, setPhoiSao] = useState('');
  const [duLieuConFig, setDuLieuConFig] = useState([]);
  const user = useSelector(userLoginSelector);
  const dispatch = useDispatch();
  const [chieuDai, setChieuDai] = useState(0);
  const [chieuRong, setChieuRong] = useState(0);
  const [selectConfig, setSelectConfig] = useState(optionConfg[0].id);
  const openPopup = useSelector(openPopupSelector);

  useEffect(() => {
    const fetchDataDLHS = async () => {
      const phoidata = hocsinhid && (await GetPhoiBanSaoById(hocsinhid.donYeuCauCapBanSao.idPhoiBanSao));
      setPhoiSao(phoidata.data);
      dispatch(selectedPhoisao(phoidata.data));
    };
    if (hocsinhid) {
      fetchDataDLHS();
    }
  }, [hocsinhid]);

  useEffect(() => {
    const fetchDataDLHS = async () => {
      if (selectConfig === optionConfg[0].id) {
        const response_cf = await GetAllTruongDuLieuPhoiBanSao();
        setDuLieuConFig(response_cf.data.cauHinhPhoiBanSaos);
        setChieuDai(response_cf.data.chieuDoc);
        setChieuRong(response_cf.data.chieuNgang);
      } else {
        const response_cf = await GetConfigPhoi(phoisao.id);
        setDuLieuConFig(response_cf.data);
        setChieuDai(0);
        setChieuRong(0);
      }
      const hocSinhSoBanSao = await getHocSinhDaDuaVaoSobanSao(hocsinhid.id, hocsinhid.donYeuCauCapBanSao.id, user.username);
      setHsSoBanSao(hocSinhSoBanSao.data);
    };

    if (!openPopup) {
      setSelectConfig(optionConfg[0].id);
    }
    if (phoisao) {
      fetchDataDLHS();
    }
  }, [phoisao, hocsinhid.idHocSinh, openPopup, selectConfig]);
  const soLuongBanSao = hsSoBanSao.soLuongBanSao ? hsSoBanSao.soLuongBanSao : 1;

  //Tạo ra dữ liệu in phù hợp với số lượng bản sao yêu cầu
  const hsSoBanSao_soLuong = Array.from({ length: soLuongBanSao }, () => ({
    data: { ...hsSoBanSao }
  }));
  // Chuyển dữ liệu in thành mảng json.
  const hsSoBanSao_mang = hsSoBanSao_soLuong.map((item) => item.data);
  // Format dữ liệu phù hợp với với Config
  const DataInBang = hsSoBanSao_mang.map((hsSoBanSao) => {
    return {
      HOTEN: hsSoBanSao.hoTen,
      NOISINH: hsSoBanSao.noiSinh,
      NGAYTHANGNAMSINH: hsSoBanSao.ngaySinh && convertISODateToFormattedDate(hsSoBanSao.ngaySinh),
      GIOITINH: hsSoBanSao.gioiTinh ? 'Nam' : 'Nữ',
      DANTOC: hsSoBanSao.danToc,
      HOCSINHTRUONG: hsSoBanSao.truong,
      NAMTOTNGHIEP: hsSoBanSao.namThi,
      XEPLOAITOTNGHIEP: hsSoBanSao.xepLoai,
      HINHTHUCDAOTAO: hsSoBanSao.hinhThucDaoTao,
      SAO_SOVAOSOBANSAO: hsSoBanSao.soVaoSoBanSao,
      NAMCAP: new Date(hsSoBanSao.ngayCapBang).getFullYear(),
      NGAYCAP: handleAddNumberZeroDayAndMonth(new Date(hsSoBanSao.ngayCapBang).getDate()),
      THANGCAP: handleAddNumberZeroDayAndMonth(new Date(hsSoBanSao.ngayCapBang).getMonth() + 1),
      TRUONGPHONGDGDT: hsSoBanSao.nguoiKyBang,
      NOICAP: hsSoBanSao.diaPhuongCapBang
    };
  });
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
          <XuLyDuLieuInBanSao
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
          <ExitButton />
        </Grid>
      </Grid>
    </>
  );
};

export default InBanSao;
