import { FormControl, Grid, MenuItem, Select } from '@mui/material';
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
  thangcap: '8',
  namcap: '2023',
  noicap: 'Tam Nông',
  truongphongdgdt: 'Lê Phước Hậu',
  goc_sohieuvanbang: 'A00018',
  goc_sovaosocap: '2023/TC/00010'
};

const XemTruoc = ({ isSample = false }) => {
  const reloadData = useSelector(reloadDataSelector);
  const phoigoc = useSelector(selectedPhoigocSelector);
  const user = useSelector(userLoginSelector);
  const openSubPopup = useSelector(openSubPopupSelector);
  const dispatch = useDispatch();
  const Image = config.urlFile + 'PhoiGoc/' + phoigoc.anhPhoi;
  const chieuNgang = phoigoc ? phoigoc.chieuNgang : 19;
  const chieuDoc = phoigoc ? phoigoc.chieuDoc : 13;
  const [data, setData] = useState([]);
  const [size, setSize] = useState(1);
  const sizeOptions = [
    { value: 1, label: '100%' },
    { value: 0.85, label: '85%' },
    { value: 0.7, label: '70%' },
    { value: 0.6, label: '60%' },
    { value: 0.5, label: '50%' }
  ];
  useEffect(() => {
    const fetchData = async () => {
      const response = await GetConfigPhoi(phoigoc.id);

      const { data } = response;
      setData(data);
    };
    if (openSubPopup || reloadData) {
      fetchData();
    }
  }, [phoigoc, openSubPopup, reloadData]);

  useEffect(() => {
    // Gán giá trị cho itemRefs khi component được render
    itemRefs.current = [...data];
  }, [data]);

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

  const showData = (data) => {
    const dataLowerCase = data.toLowerCase();

    if (isSample && data) {
      return dataMapping[dataLowerCase];
    }

    if (dataLowerCase === 'ngaycap') {
      return 'DD';
    }

    if (dataLowerCase === 'thangcap') {
      return 'MM';
    }

    if (dataLowerCase === 'namcap') {
      return 'YYYY';
    }

    return data;
  };

  const handleDrag = (index) => (e, ui) => {
    const { x, y } = ui;
    // console.log(123, 'Element:', itemRefs.current[index].maTruongDuLieu);
    // console.log('Top:', y, 'Left:', x);
    // Cập nhật giá trị trực tiếp thông qua ref
    if (size === 1) {
      itemRefs.current[index].viTriTren = parseInt(y);
      itemRefs.current[index].viTriTrai = parseInt(x);
    } else {
      itemRefs.current[index].viTriTren = parseInt(y / size);
      itemRefs.current[index].viTriTrai = parseInt(x / size);
    }
  };

  const x = size;
  const CustomimeSize = {
    w: chieuNgang * x,
    h: chieuDoc * x
  };
  const handleSize = (e) => {
    setSize(e.target.value);
  };
  const DraggableItem = ({ item, index, onDrag, size }) => {
    return (
      <Draggable
        bounds="parent"
        key={item.maTruongDuLieu}
        handle=".handle"
        defaultPosition={{ x: item.viTriTrai * size, y: item.viTriTren * size }}
        onDrag={onDrag(index)}
        size={size} // Pass the size prop
        disabled={isSample}
      >
        <div
          className="draggable-item"
          id={item.id}
          style={{
            fontWeight: item.dinhDangKieuChu,
            fontStyle: item.dinhDangKieuChu,
            fontSize: item.coChu * size + 'px',
            fontFamily: item.kieuChu,
            color: item.mauChu,
            position: 'absolute',
            display: item.hienThi ? 'block' : 'none'
          }}
        >
          <p
            className="handle"
            style={{
              cursor: 'grab'
            }}
          >
            {showData(item.maTruongDuLieu)}
          </p>
        </div>
      </Draggable>
    );
  };

  return (
    <form onSubmit={handleConfigPosition}>
      <Grid item container xs={3} mt={1} mb={1}>
        <FormControl fullWidth variant="outlined">
          <Select value={size} onChange={handleSize} size="small" sx={{ overflow: 'hidden' }}>
            {sizeOptions.map((item) => (
              <MenuItem key={item.value} value={item.value}>
                {item.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <div
        style={{
          width: CustomimeSize.w + 0.5 * x + 'cm',
          overflow: 'auto',
          border: '5px outset gray',
          display: 'flex',
          justifyContent: 'center',
          margin: '0 auto'
        }}
      >
        <div
          style={{
            backgroundImage: `url(${Image})`,
            width: CustomimeSize.w + 'cm',
            height: CustomimeSize.h + 'cm',
            position: 'relative',
            backgroundSize: 'cover'
          }}
        >
          {data.map((item, index) => (
            <DraggableItem
              key={item.maTruongDuLieu}
              item={item}
              index={index}
              onDrag={handleDrag}
              size={size} // Pass the size prop
            />
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
