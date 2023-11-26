import React, { useRef } from 'react';
import DuLieuBang from './XuLyDuLieuBang';
import MainCard from 'components/cards/MainCard';
import { Grid } from '@mui/material';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { tracuuSelector } from 'store/selectors';
import { useState } from 'react';
import { GetPhoiGocById, getHocSinhByCCC } from 'services/congthongtinService';
import ExitButton from 'components/button/ExitButton';
import { convertISODateToFormattedDate } from 'utils/formatDate';
import { handleAddNumberZeroDayAndMonth } from 'utils/handleAddNumberZeroDayAndMonth';

const AnhBang = () => {
  const phoigoc = useSelector(tracuuSelector);
  const [duLieuConFig, setDuLieuConFig] = useState([]);
  const [duLieuHocsinh, setDuLieuHocsinh] = useState([]);
  useEffect(() => {
    const fetchDataDLHS = async () => {
      const response_cf = await GetPhoiGocById(phoigoc.idPhoiGoc);
      setDuLieuConFig(response_cf.data.cauHinhPhoiGocs);

      const dataHocsinh = await getHocSinhByCCC(phoigoc.cccd);
      setDuLieuHocsinh(dataHocsinh.data);
    };
    fetchDataDLHS();
  }, [phoigoc.id]);
  const DataInBang = {
    HOTEN: duLieuHocsinh.hoTen,
    NOISINH: duLieuHocsinh.noiSinh, // Assuming you want the second part after the " - "
    NGAYTHANGNAMSINH: duLieuHocsinh.ngaySinh && convertISODateToFormattedDate(duLieuHocsinh.ngaySinh),
    GIOITINH: duLieuHocsinh.gioiTinh ? 'Nam' : 'Nữ',
    DANTOC: duLieuHocsinh.danToc,
    //HOCSINHTRUONG: duLieuHocsinh && duLieuHocsinh.truong ? duLieuHocsinh.truong.ten : '',
    HOCSINHTRUONG: duLieuHocsinh && duLieuHocsinh.soGoc ? duLieuHocsinh.soGoc.tenTruong : '',
    NAMTOTNGHIEP: duLieuHocsinh.namThi,
    XEPLOAITOTNGHIEP: duLieuHocsinh.xepLoai,
    HINHTHUCDAOTAO: duLieuHocsinh.tenHinhThucDaoTao,
    GOC_SOHIEUVANBANG: duLieuHocsinh.soHieuVanBang,
    GOC_SOVAOSOCAP: duLieuHocsinh.soVaoSoCapBang,
    NAMCAP: new Date(duLieuHocsinh && duLieuHocsinh.danhMucTotNghiep ? duLieuHocsinh.danhMucTotNghiep.ngayCapBang : '').getFullYear(),
    NGAYCAP: handleAddNumberZeroDayAndMonth(
      new Date(duLieuHocsinh && duLieuHocsinh.danhMucTotNghiep ? duLieuHocsinh.danhMucTotNghiep.ngayCapBang : '').getDate()
    ),
    THANGCAP: handleAddNumberZeroDayAndMonth(
      new Date(duLieuHocsinh && duLieuHocsinh.danhMucTotNghiep ? duLieuHocsinh.danhMucTotNghiep.ngayCapBang : '').getMonth() + 1
    ),
    TRUONGPHONGDGDT: duLieuHocsinh && duLieuHocsinh.soGoc ? duLieuHocsinh.soGoc.nguoiKyBang : '',
    NOICAP: duLieuHocsinh && duLieuHocsinh.soGoc ? duLieuHocsinh.soGoc.diaPhuongCapBang : ''
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
      color: item.mauChu
    };
  }
  const componentRef = useRef();

  return (
    <>
      <MainCard sx={{ backgroundColor: '#4d3b3b1f' }}>
        <div>
          <DuLieuBang studentDataList={DataInBang} positionConfig={cauHinhViTri} componentRef={componentRef} />
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

export default AnhBang;
