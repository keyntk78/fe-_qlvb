import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setOpenSubPopup, setReloadData, showAlert } from 'store/actions';
import { selectedValueSelector } from 'store/selectors';
import { useTranslation } from 'react-i18next';
import DeleteForm from 'components/form/DeleteForm';
import { deleteAnhSoGoc } from 'services/sogocService';

const DeleteAnhSoGoc = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const value = useSelector(selectedValueSelector);

  const handleDeleteClick = async () => {
    try {
      const dataDeleted = await deleteAnhSoGoc(value.id);
      if (dataDeleted.isSuccess == false) {
        dispatch(showAlert(new Date().getTime().toString(), 'error', dataDeleted.message.toString()));
      } else {
        dispatch(setOpenSubPopup(false));
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
      <DeleteForm type={'subpopup'} lable={t('ảnh đính kèm')} content="" handleClick={handleDeleteClick} />
    </>
  );
};

export default DeleteAnhSoGoc;
