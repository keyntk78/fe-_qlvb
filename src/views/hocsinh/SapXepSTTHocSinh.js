import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Box,
  CircularProgress
} from '@mui/material';
import React, { useState, useEffect } from 'react';
import { convertISODateToFormattedDate } from 'utils/formatDate';
import { IconLineHeight, IconSearch } from '@tabler/icons';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, MouseSensor, TouchSensor } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { restrictToVerticalAxis, restrictToFirstScrollableAncestor } from '@dnd-kit/modifiers';
import FormGroupButton from 'components/button/FormGroupButton';
import { getListLop } from 'services/sharedService';
import { getHocSinhByLopOfPhong, arrangeHocSinhPhong } from 'services/hocsinhService';
import { getHocSinhByLopOfTruong, arrangeHocSinhTruong } from 'services/nguoihoctotnghiepService';
import { setOpenPopup, setReloadData, showAlert } from 'store/actions';
import { donviSelector } from 'store/selectors';

const SortableItem = (props) => {
  const { item } = props;
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable(item);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    touchAction: 'none'
  };

  return (
    <TableRow ref={setNodeRef} style={style} {...attributes} {...listeners} hover>
      <TableCell component="th" scope="row" padding="normal" size="small">
        <IconLineHeight />
      </TableCell>
      <TableCell component="th" scope="row" padding="normal" size="small">
        {item.hoTen}
      </TableCell>
      <TableCell component="th" scope="row" padding="normal" size="small">
        {item.cccd}
      </TableCell>
      <TableCell component="th" scope="row" padding="normal" size="small">
        {item.gioiTinh ? 'Nam' : 'Nữ'}
      </TableCell>
      <TableCell component="th" scope="row" padding="normal" size="small">
        {convertISODateToFormattedDate(item.ngaySinh)}
      </TableCell>
      <TableCell component="th" scope="row" padding="normal" size="small">
        {item.ketQua === 'x' ? 'Đạt' : 'Chưa đạt'}
      </TableCell>
      <TableCell component="th" scope="row" padding="normal" size="small">
        {item.xepLoai}
      </TableCell>
      <TableCell component="th" scope="row" padding="normal" size="small">
        {item.stt}
      </TableCell>
    </TableRow>
  );
};

const SapXepSTTHocSinh = ({ danhMuc, donvi }) => {
  const [items, setItems] = useState([]);
  const [lops, setLops] = useState([]);
  const [lopSelected, setLopSelected] = useState('');
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const donVi = useSelector(donviSelector);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (lops.length === 0) {
      fetchDataLop();
    }
  }, [danhMuc, donvi]);

  const handleLopChange = (e) => {
    const value = e.target.value;
    setLopSelected(value);
  };

  const fetchDataLop = async () => {
    const lops = await getListLop(donvi, danhMuc);
    console.log(lops);
    if (lops !== null && lops.data.length > 0) {
      setLops(lops.data);
      setLopSelected(lops.data[0].ma);
      await fetchHocSinhOfLop(lops.data[0].ma);
    }
  };

  const handleSearch = async () => {
    await fetchHocSinhOfLop();
  };

  const fetchHocSinhOfLop = async (value) => {
    if (value || lopSelected) {
      setIsLoading(true);
      const newValue = value ? value : lopSelected;
      const hocsinhs = await (donVi.laPhong
        ? getHocSinhByLopOfPhong(donvi, danhMuc, newValue)
        : getHocSinhByLopOfTruong(donvi, danhMuc, newValue));
      if ((hocsinhs !== null) & (hocsinhs.data.length > 0)) {
        setItems(hocsinhs.data);
      }
      setIsLoading(false);
    }
  };
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.map((item) => item.id).indexOf(active.id);
        const newIndex = items.map((item) => item.id).indexOf(over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const thayDoiSTTHocSinh = await (donVi.laPhong ? arrangeHocSinhPhong(items) : arrangeHocSinhTruong(items));
      if (thayDoiSTTHocSinh.isSuccess == false) {
        dispatch(showAlert(new Date().getTime().toString(), 'error', thayDoiSTTHocSinh.message.toString()));
      } else {
        dispatch(setOpenPopup(false));
        dispatch(setReloadData(true));
        dispatch(showAlert(new Date().getTime().toString(), 'success', thayDoiSTTHocSinh.message.toString()));
        await fetchHocSinhOfLop();
      }
    } catch (error) {
      console.error(error);
      dispatch(showAlert(new Date().getTime().toString(), 'error', error.toString()));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid item xs={12} container spacing={2} justifyContent={'center'} paddingTop={3}>
        <Grid item lg={4} md={4} sm={4}>
          <FormControl fullWidth variant="outlined" size="small">
            <InputLabel>{t('Lớp')}</InputLabel>
            <Select name="id" value={lopSelected} onChange={handleLopChange} label={t('Lớp')}>
              {lops?.length > 0 ? (
                lops.map((lop) => (
                  <MenuItem key={lop.ma} value={lop.ma}>
                    {lop.tenLop}
                  </MenuItem>
                ))
              ) : (
                <MenuItem value="">Không có dữ liệu</MenuItem>
              )}
            </Select>
          </FormControl>
        </Grid>
        <Grid item lg={2} md={2} sm={2}>
          <Button variant="contained" title={t('button.search')} fullWidth onClick={handleSearch} color="info" startIcon={<IconSearch />}>
            {t('button.search')}
          </Button>
        </Grid>
      </Grid>
      <Grid container padding={1} paddingTop={3} justifyContent="center">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToVerticalAxis, restrictToFirstScrollableAncestor]}
        >
          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            {isLoading ? (
              <Box sx={{ height: 250, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <CircularProgress />
              </Box>
            ) : (
              <TableContainer component={Paper} sx={{ border: 1, borderColor: 'grey.300', borderRadius: 1, maxHeight: 250 }}>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="left" padding="normal" size="small"></TableCell>
                      <TableCell align="left" padding="normal" size="small">
                        {t('hocsinh.field.fullname')}
                      </TableCell>
                      <TableCell align="left" padding="normal" size="small">
                        {t('hocsinh.field.cccd')}
                      </TableCell>
                      <TableCell align="left" padding="normal" size="small">
                        {t('hocsinh.field.gender')}
                      </TableCell>
                      <TableCell align="left" padding="normal" size="small">
                        {t('hocsinh.field.bdate')}
                      </TableCell>
                      <TableCell align="left" padding="normal" size="small">
                        {t('Kết quả')}
                      </TableCell>
                      <TableCell align="left" padding="normal" size="small">
                        {t('Xếp loại')}
                      </TableCell>
                      <TableCell align="left" padding="normal" size="small">
                        {t('STT')}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {items.map((item) => (
                      <SortableItem item={item} key={item.id} />
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </SortableContext>
        </DndContext>
      </Grid>
      <Grid item xs={12} container spacing={2} justifyContent="flex-end">
        <FormGroupButton />
      </Grid>
    </form>
  );
};

export default SapXepSTTHocSinh;
