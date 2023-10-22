import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setOpenPopup, setReloadData, showAlert } from 'store/actions';
import { selectedLoaiTinTucSelector, userLoginSelector } from 'store/selectors';
import { useTranslation } from 'react-i18next';
import DeleteForm from 'components/form/DeleteForm';
import { deleteLoaiTinTuc } from 'services/loaitintucService';

const DeleteLoaiTinTuc = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const loaiTinTuc = useSelector(selectedLoaiTinTucSelector);
  const user = useSelector(userLoginSelector);

  const handleDeleteClick = async () => {
    try {
      const dataDeleted = await deleteLoaiTinTuc(loaiTinTuc.id, user.username);
      if (dataDeleted.isSuccess == false) {
        dispatch(showAlert(new Date().getTime().toString(), 'error', dataDeleted.message.toString()));
      } else {
        dispatch(setOpenPopup(false));
        dispatch(setReloadData(true));
        dispatch(showAlert(new Date().getTime().toString(), 'success', dataDeleted.message.toString()));
      }
    } catch (error) {
      console.error('Error updating role:', error);
      dispatch(showAlert(new Date().getTime().toString(), 'error', error.toString()));
    }
  };

  return (
    <>
      <DeleteForm lable={t('Loại tin tức')} content={loaiTinTuc.tieuDe} handleClick={handleDeleteClick} />
    </>
  );
};

export default DeleteLoaiTinTuc;
