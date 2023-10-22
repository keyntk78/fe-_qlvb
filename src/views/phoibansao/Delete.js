import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setOpenPopup, setReloadData, showAlert } from 'store/actions';
import { useTranslation } from 'react-i18next';
import { selectedPhoisaoSelector, userLoginSelector } from 'store/selectors';
import DeleteForm from 'components/form/DeleteForm';
import { deletePhoisao } from 'services/phoisaoService';

const DeleteAction = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const selectedPhoisao = useSelector(selectedPhoisaoSelector);
  const user = useSelector(userLoginSelector);
  const handleDeleteClick = async (deletionReason) => {
    try {
      const phoisaoDelete = await deletePhoisao(selectedPhoisao.id, user.username, deletionReason);
      if (phoisaoDelete.isSuccess == false) {
        dispatch(showAlert(new Date().getTime().toString(), 'error', phoisaoDelete.message.toString()));
      } else {
        dispatch(setOpenPopup(false));
        dispatch(setReloadData(true));
        dispatch(showAlert(new Date().getTime().toString(), 'success', phoisaoDelete.message.toString()));
      }
    } catch (error) {
      console.error('Error updating Function:', error);
      dispatch(showAlert(new Date().getTime().toString(), 'error', error.toString()));
    }
  };
  return (
    <>
      <DeleteForm lyDo lable={t('label.action')} content={selectedPhoisao ? selectedPhoisao.tenPhoi : ''} handleClick={handleDeleteClick} />
    </>
  );
};

export default DeleteAction;
