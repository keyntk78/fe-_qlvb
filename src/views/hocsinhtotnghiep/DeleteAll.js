import { TongHocSinhChuaXacNhan, deleteAllHocSinhByTruong } from 'services/nguoihoctotnghiepService';
import { useDispatch, useSelector } from 'react-redux';
import { setOpenPopup, setReloadData, showAlert } from 'store/actions';
import { useTranslation } from 'react-i18next';
import { donviSelector, selectedDanhmucSelector } from 'store/selectors';
import DeleteForm from 'components/form/DeleteForm';
import { useState } from 'react';
import { useEffect } from 'react';

function DeleteAll() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const donvi = useSelector(donviSelector);
  const danhmuc = useSelector(selectedDanhmucSelector);

  const [countHS, setCountHS] = useState('');

  useEffect(() => {
    const fetchDataDL = async () => {
      const response = await TongHocSinhChuaXacNhan(donvi.id, danhmuc.id);
      setCountHS(response.data);
    };
    fetchDataDL();
  }, [donvi]);
  const hanldeDeleteAll = async () => {
    try {
      const response = await deleteAllHocSinhByTruong(donvi.id);
      if (response.isSuccess == false) {
        dispatch(showAlert(new Date().getTime().toString(), 'error', response.message.toString()));
      } else {
        dispatch(setOpenPopup(false));
        dispatch(setReloadData(true));
        dispatch(showAlert(new Date().getTime().toString(), 'success', response.message.toString()));
      }
    } catch (error) {
      console.error('error' + error);
      dispatch(showAlert(new Date().getTime().toString(), 'error', error.toString()));
    }
  };
  return (
    <>
      <DeleteForm lable={t('hocsinhtotnghiep.title')} content={t('hocsinhtotnghiep.all')} soluong={countHS} handleClick={hanldeDeleteAll} />
    </>
  );
}
export default DeleteAll;
