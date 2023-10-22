import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setOpenPopup, setReloadData, showAlert } from 'store/actions';
import { selectedDanTocSelector, userLoginSelector } from 'store/selectors';
import { useTranslation } from 'react-i18next';
import DeleteForm from 'components/form/DeleteForm';
import { deleteDanToc } from 'services/dantocService';

const DeleteDanToc = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const selectedDanToc = useSelector(selectedDanTocSelector);
  const user = useSelector(userLoginSelector);

  const handleDeleteClick = async () => {
    try {
      const response = await deleteDanToc(selectedDanToc.id, user.username);
      if (response.isSuccess == false) {
        dispatch(showAlert(new Date().getTime().toString(), 'error', response.message.toString()));
      } else {
        dispatch(setOpenPopup(false));
        dispatch(setReloadData(true));
        dispatch(showAlert(new Date().getTime().toString(), 'success', response.message.toString()));
      }
    } catch (error) {
      console.error('Error updating Function:', error);
      dispatch(showAlert(new Date().getTime().toString(), 'error', error.toString()));
    }
  };

  return (
    <>
      <DeleteForm lable={t('Dân tộc')} content={selectedDanToc.ten} handleClick={handleDeleteClick} />
    </>
  );
};

export default DeleteDanToc;
