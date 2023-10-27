import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setOpenPopup, showAlert } from 'store/actions';
import { userLoginSelector } from 'store/selectors';
import { useTranslation } from 'react-i18next';
import DeleteForm from 'components/form/DeleteForm';

const DeleteDanhSachXacMinh = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const user = useSelector(userLoginSelector);
  const existingData = JSON.parse(localStorage.getItem(user.username)) || [];
  const handleDeleteClick = async () => {
    try {
      localStorage.removeItem(user.username);
      dispatch(showAlert(new Date().getTime().toString(), 'success', t('xacminhvanbang.title.deleteSuc')));
      dispatch(setOpenPopup(false));
    } catch (error) {
      console.error('Error updating Function:', error);
      dispatch(showAlert(new Date().getTime().toString(), 'error', error.toString()));
    }
  };
  return (
    <>
      {' '}
      <DeleteForm
        lable={t('Danh sách xác minh văn bằng')}
        content={t('tất cả')}
        soluong={existingData.length}
        handleClick={handleDeleteClick}
      />
    </>
  );
};

export default DeleteDanhSachXacMinh;
