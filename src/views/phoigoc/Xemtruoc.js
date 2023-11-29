import { FormControlLabel, Grid, Switch } from '@mui/material';
import FormGroupButton from 'components/button/FormGroupButton';
import config from 'config';
import { useState } from 'react';
import { useRef } from 'react';
import { useEffect } from 'react';
import Draggable from 'react-draggable';
import { useDispatch, useSelector } from 'react-redux';
import { GetConfigPhoi, createConfigPhoi } from 'services/phoigocService';
import { setOpenSubPopup, setReloadData, showAlert } from 'store/actions';
import { openSubPopupSelector, reloadDataSelector, selectedPhoigocSelector, userLoginSelector } from 'store/selectors';

const XemTruoc = () => {
  const reloadData = useSelector(reloadDataSelector);
  const phoigoc = useSelector(selectedPhoigocSelector);
  const user = useSelector(userLoginSelector);
  const openSubPopup = useSelector(openSubPopupSelector);
  const dispatch = useDispatch();
  const Image = config.urlFile + 'PhoiGoc/' + phoigoc.anhPhoi;
  const chieuNgang = phoigoc ? phoigoc.chieuNgang : 19;
  const chieuDoc = phoigoc ? phoigoc.chieuDoc : 13;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const dataMapping = {
    hoten: 'Nguyễn Văn A',
    ngaythangnamsinh: '03-12-2001',
    noisinh: 'Đồng Tháp',
    gioitinh: 'Nam',
    dantoc: 'kinh',
    hocsinhtruong: 'THCS Tràm Chim',
    namtotnghiep: '2023',
    xeploaitotnghiep: 'Giỏi',
    hinhthucdaotao: 'Chính Quy',
    ngaycap: '17',
    thangcap: '08',
    namcap: '2023',
    noicap: 'Tam Nông',
    truongphongdgdt: 'Lê Phước Hậu',
    goc_sohieuvanbang: 'A00018',
    goc_sovaosocap: '2023/TC/00010'
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await GetConfigPhoi(phoigoc.id);

      setData(response.data);
    };
    if (openSubPopup || reloadData) {
      fetchData();
    }
  }, [phoigoc, openSubPopup, reloadData]);

  const handleConfigPosition = async (e) => {
    e.preventDefault();
    try {
      const EditPhoi = await createConfigPhoi(phoigoc.id, user.username, data);
      if (EditPhoi.isSuccess == false) {
        dispatch(showAlert(new Date().getTime().toString(), 'error', EditPhoi.message.toString()));
      } else {
        dispatch(setOpenSubPopup(false));
        dispatch(setReloadData(true));
        dispatch(showAlert(new Date().getTime().toString(), 'success', EditPhoi.message.toString()));
      }
    } catch (error) {
      console.error('Error updating phoigoc:', error);
      dispatch(showAlert(new Date().getTime().toString(), 'error', error.toString()));
    }
  };

  const itemRefs = useRef([]); // Sử dụng ref cho việc lưu trữ giá trị của từng item
  const newData = data.map((item) => ({ ...item }));

  useEffect(() => {
    // Gán giá trị cho itemRefs khi component được render
    itemRefs.current = [...data];
  }, [data]);

  const handleDrag = (index) => (e, ui) => {
    const { x, y } = ui;
    // console.log(123, 'Element:', itemRefs.current[index].maTruongDuLieu);
    // console.log('Top:', y, 'Left:', x);
    // Cập nhật giá trị trực tiếp thông qua ref
    itemRefs.current[index].viTriTren = parseInt(y + newData[index].viTriTren);
    itemRefs.current[index].viTriTrai = parseInt(x + newData[index].viTriTrai);
  };

  return (
    <form onSubmit={handleConfigPosition}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <FormControlLabel
          sx={{
            display: 'block'
          }}
          onChange={() => setLoading(!loading)}
          control={<Switch checked={loading} name="loading" color="primary" />}
          label="Xem dữ liệu mẫu"
        />
      </div>
      <div style={{ width: '19.5cm', overflow: 'auto', border: '5px outset gray', marginTop: '10px', marginLeft: '60px' }}>
        <div
          style={{
            backgroundImage: `url(${Image})`,
            // width: '19cm',
            // height: '13cm',
            width: chieuNgang + 'cm',
            height: chieuDoc + 'cm',
            position: 'relative',
            backgroundSize: 'cover'
          }}
        >
          {data.map((item, index) => (
            <Draggable
              bounds="parent"
              key={item.maTruongDuLieu}
              handle=".handle"
              defaultPosition={{ x: 0, y: 0 }}
              onDrag={handleDrag(index)}
            >
              <div
                className="draggable-item"
                style={{
                  fontWeight: item.dinhDangKieuChu,
                  fontStyle: item.dinhDangKieuChu,
                  fontSize: item.coChu + 'px',
                  fontFamily: item.kieuChu,
                  color: item.mauChu,
                  position: 'absolute',
                  top: item.viTriTren,
                  left: item.viTriTrai
                }}
              >
                <p className="handle" style={{ cursor: 'grab' }}>
                  {loading === false
                    ? item.maTruongDuLieu.toLowerCase() === 'ngaycap'
                      ? 'DD'
                      : item.maTruongDuLieu.toLowerCase() === 'thangcap'
                      ? 'MM'
                      : item.maTruongDuLieu.toLowerCase() === 'namcap'
                      ? 'YYYY'
                      : item.maTruongDuLieu
                    : dataMapping[item.maTruongDuLieu.toLowerCase()] || ''}
                </p>
              </div>
            </Draggable>
          ))}
        </div>
      </div>
      <Grid container>
        <Grid item xs={12} container spacing={2} justifyContent="flex-end">
          <FormGroupButton type="subpopup" />
        </Grid>
      </Grid>
    </form>
  );
};

export default XemTruoc;
