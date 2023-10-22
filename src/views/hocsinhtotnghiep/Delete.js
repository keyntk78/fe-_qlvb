import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteHocSinhByTruong } from 'services/nguoihoctotnghiepService';
import { setOpenPopup, setReloadData, showAlert } from 'store/actions';
import { donviSelector } from 'store/selectors';
import DeleteForm from 'components/form/DeleteForm';
import { useTranslation } from 'react-i18next';

const DeleteHocSinh = ({ dataCCCD }) => {
  const dispatch = useDispatch();
  const data = [...dataCCCD];
  const donvi = useSelector(donviSelector);

  const hanldeDelete = async () => {
    try {
      const response = await deleteHocSinhByTruong(donvi.id, data);
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
  const { t } = useTranslation();
  return (
    <>
      <DeleteForm
        lable={t('hocsinhtotnghiep.title')}
        content={t('hocsinhtotnghiep.choice')}
        soluong={data.length}
        handleClick={hanldeDelete}
      />
    </>
  );
};
export default DeleteHocSinh;
