import React, { useRef } from 'react';
import ReactToPrint, { useReactToPrint } from 'react-to-print';
import DuLieuInThu from './XuLyDuLieuInBanSao';
import MainCard from 'components/cards/MainCard';
import { IconPrinter } from '@tabler/icons';
import { Button, Grid } from '@mui/material';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { capBangBansaoSelector, userLoginSelector } from 'store/selectors';
import { useState } from 'react';
import { GetConfigPhoi, getPhoiBanSaoDangSuDung } from 'services/phoisaoService';
import ExitButton from 'components/button/ExitButton';
import { getHocSinhDaDuaVaoSobanSao } from 'services/capbangbansaoService';

const InBanSao = () => {
  const [hsSoBanSao, setHsSoBanSao] = useState([]);
  const hocsinhid = useSelector(capBangBansaoSelector);
  const [phoisao, setPhoiSao] = useState('');
  const [duLieuConFig, setDuLieuConFig] = useState([]);
  const user = useSelector(userLoginSelector);
  useEffect(() => {
    const fetchDataDLHS = async () => {
      const phoidata = await getPhoiBanSaoDangSuDung(hocsinhid.idTruong);
      setPhoiSao(phoidata.data);
    };
    fetchDataDLHS();
  }, []);

  useEffect(() => {
    const fetchDataDLHS = async () => {
      const response_cf = await GetConfigPhoi(phoisao.id);
      setDuLieuConFig(response_cf.data);
      const hocSinhSoBanSao = await getHocSinhDaDuaVaoSobanSao(hocsinhid.idHocSinh, hocsinhid.id, user.username);
      setHsSoBanSao(hocSinhSoBanSao.data);
      console.log(response_cf, hocSinhSoBanSao);
    };
    fetchDataDLHS();
  }, [phoisao.id, hocsinhid.hocSinh.id]);
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
      NGAYTHANGNAMSINH: new Date(hsSoBanSao.ngaySinh).toLocaleDateString(),
      GIOITINH: hsSoBanSao.gioiTinh ? 'Nam' : 'Nữ',
      DANTOC: hsSoBanSao.danToc,
      HOCSINHTRUONG: hsSoBanSao.truong,
      NAMTOTNGHIEP: hsSoBanSao.namThi,
      XEPLOAITOTNGHIEP: hsSoBanSao.xepLoai,
      HINHTHUCDAOTAO: hsSoBanSao.hinhThucDaoTao,
      SAO_SOVAOSOBANSAO: hsSoBanSao.soVaoSoCapBang,
      NAMCAP: new Date(hsSoBanSao.ngayTao).getFullYear(),
      NGAYCAP: new Date(hsSoBanSao.ngayTao).getDate(),
      THANGCAP: new Date(hsSoBanSao.ngayTao).getMonth() + 1,
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
      <MainCard sx={{ backgroundColor: '#4d3b3b1f' }}>
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
          <ExitButton />
        </Grid>
      </Grid>
    </>
  );
};

export default InBanSao;
