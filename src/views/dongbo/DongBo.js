import {
  Grid,
  useMediaQuery,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  OutlinedInput,
  Chip
} from '@mui/material';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { setOpenPopup, setReloadData, showAlert } from 'store/actions';
import { useTranslation } from 'react-i18next';
import FormControlComponent from 'components/form/FormControlComponent ';
import InputForm from 'components/form/InputForm';
// import { useDongBoValidationSchema } from 'components/validations/dongBoValidation';
import { useState } from 'react';
import { openPopupSelector, userLoginSelector } from 'store/selectors';
import XacNhanDongBo from './XacNhanDongBo';
import Popup from 'components/controls/popup';
import { SyncCollection, dongBobyDanhMucTotNghiep } from 'services/saoluuService';
import MainCard from 'components/cards/MainCard';
import { IconRefresh } from '@tabler/icons';
import CustomButton from 'components/button/CustomButton';
import { getAllDanhmucTN } from 'services/sharedService';
import { useEffect } from 'react';
import { Box } from '@mui/system';

function DongBo() {
  const openPopup = useSelector(openPopupSelector);
  const isXs = useMediaQuery('(max-width:600px)');
  const dispatch = useDispatch();
  const { t } = useTranslation();
  // const DongBoValidationSchema = useDongBoValidationSchema();
  const [option, setOption] = useState('all');
  const [title, setTitle] = useState('');
  const [form, setForm] = useState('');
  const [danhMuc, setDanhMuc] = useState('');
  const user = useSelector(userLoginSelector);

  const [listDanhMuc, setListDanhMuc] = useState([]);

  const formik = useFormik({
    initialValues: {
      Option: 'all',
      StartDate: '',
      EndDate: ''
    },
    // validationSchema: DongBoValidationSchema,
    onSubmit: async () => {
      setForm('delete');
      setTitle(t('Xác nhận đồng bộ'));
      dispatch(setOpenPopup(true));
    }
  });

  useEffect(() => {
    const fetchDataDL = async () => {
      try {
        const response = await getAllDanhmucTN(user ? user.username : '');
        setDanhMuc(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchDataDL();
  }, [user]);

  const handleChange = (event) => {
    const value = event.target.value;
    setOption(value);
    formik.setFieldValue('Option', value);
    if (value === 'all') {
      formik.resetForm();
    }
  };

  const handleDanhMucChange = (event) => {
    const {
      target: { value }
    } = event;

    // Chuyển đổi giá trị thành mảng ID
    const selectedIds = typeof value === 'string' ? value.split(',') : value;

    // Cập nhật state
    setListDanhMuc(selectedIds); // Lưu danh sách ID
  };

  const handleSubmit = async () => {
    try {
      if (option === 'part') {
        const response = await dongBobyDanhMucTotNghiep(user.username, listDanhMuc);
        if (response.isSuccess == false) {
          dispatch(showAlert(new Date().getTime().toString(), 'error', response.message.toString()));
        } else {
          dispatch(setOpenPopup(false));
          dispatch(setReloadData(true));
          dispatch(showAlert(new Date().getTime().toString(), 'success', response.message.toString()));
          formik.resetForm();
          setOption('all');
        }
      } else {
        const params = new URLSearchParams();
        params.append('tuNgayDotTotNghiep', formik.values.StartDate);
        params.append('denNgayDotTotNghiep', formik.values.EndDate);
        params.append('NguoiThucHien', user.username);
        const response = await SyncCollection(params);
        if (response.isSuccess == false) {
          dispatch(showAlert(new Date().getTime().toString(), 'error', response.message.toString()));
        } else {
          dispatch(setOpenPopup(false));
          dispatch(setReloadData(true));
          dispatch(showAlert(new Date().getTime().toString(), 'success', response.message.toString()));
          formik.resetForm();
          setOption('all');
        }
      }
    } catch (error) {
      console.error('error' + error);
      dispatch(setOpenPopup(false));
      dispatch(showAlert(new Date().getTime().toString(), 'error', error.toString()));
    }
  };

  return (
    <MainCard title={t('Đồng bộ')}>
      <div style={{ textAlign: 'center' }}>
        <Grid item container spacing={isXs ? 0 : 1} columnSpacing={isXs ? 1 : 0} mt={2} justifyContent={'center'} alignItems={'center'}>
          <Grid item xs={8}>
            <FormControlComponent xsLabel={isXs ? 0 : 5} xsForm={isXs ? 12 : 7} label={t('Đồng bộ theo')}>
              <RadioGroup style={{ display: 'flex', justifyContent: 'flex-start' }} row value={option} onChange={handleChange}>
                <FormControlLabel value={'all'} control={<Radio />} label={t('Tất cả')} sx={{ marginTop: '-1px' }} />
                <FormControlLabel value={'time'} control={<Radio />} label={t('Theo thời gian')} sx={{ marginTop: -'-1px' }} />
                <FormControlLabel value={'part'} control={<Radio />} label={t('Theo đợt')} sx={{ marginTop: -'-1px' }} />
              </RadioGroup>
            </FormControlComponent>
          </Grid>
        </Grid>
        {option === 'time' ? (
          <>
            <Grid item container spacing={isXs ? 0 : 1} columnSpacing={isXs ? 1 : 0} mt={2} justifyContent={'center'}>
              <Grid item xs={8}>
                <FormControlComponent xsLabel={isXs ? 0 : 5} xsForm={isXs ? 12 : 7} isRequire label={t('Ngày bắt đầu')}>
                  <InputForm formik={formik} name="StartDate" type="date" placeholder={t('Ngày bắt đầu')} />
                </FormControlComponent>
              </Grid>
            </Grid>
            <Grid item container spacing={isXs ? 0 : 1} columnSpacing={isXs ? 1 : 0} my={1} justifyContent={'center'}>
              <Grid item xs={8}>
                <FormControlComponent xsLabel={isXs ? 0 : 5} xsForm={isXs ? 12 : 7} isRequire label={t('Ngày kết thúc')}>
                  <InputForm formik={formik} name="EndDate" type="date" placeholder={t('Ngày kết thúc')} />
                </FormControlComponent>
              </Grid>
            </Grid>
          </>
        ) : (
          ''
        )}
        {option === 'part' ? (
          <>
            <Grid item container spacing={isXs ? 0 : 1} columnSpacing={isXs ? 1 : 0} mt={2} justifyContent={'center'}>
              <Grid item lg={8} md={8} sm={12} xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="demo-multiple-checkbox-label">Danh mục tốt nghiệp</InputLabel>
                  <Select
                    labelId="demo-multiple-checkbox-label"
                    id="demo-multiple-checkbox"
                    multiple
                    value={listDanhMuc}
                    onChange={handleDanhMucChange}
                    input={<OutlinedInput label="Danh mục tốt nghiệp" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={danhMuc.find((data) => data.id === value)?.tieuDe || ''} />
                        ))}
                      </Box>
                    )}
                  >
                    {danhMuc.map((data) => (
                      <MenuItem key={data.id} value={data.id}>
                        <Checkbox checked={listDanhMuc.includes(data.id)} />
                        <ListItemText primary={data.tieuDe} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </>
        ) : (
          ''
        )}
        <Grid container spacing={1} direction="row" justifyContent="center" my={2}>
          <Grid item>
            <CustomButton icon={IconRefresh} label="Đồng bộ" variant="contained" color="error" handleClick={formik.handleSubmit} />
          </Grid>
        </Grid>
        {form !== '' && (
          <Popup title={title} form={form} openPopup={openPopup} maxWidth={'sm'} bgcolor={form === 'delete' ? '#F44336' : '#2196F3'}>
            <XacNhanDongBo onSubmit={handleSubmit} />
          </Popup>
        )}
      </div>
    </MainCard>
  );
}
export default DongBo;
