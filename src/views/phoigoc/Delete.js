import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setOpenPopup, setReloadData, showAlert } from 'store/actions';
import { useTranslation } from 'react-i18next';
import { selectedPhoigocSelector, userLoginSelector } from 'store/selectors';
import DeleteForm from 'components/form/DeleteForm';
import { deletePhoigoc } from 'services/phoigocService';

const Delete = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const selectedPhoigoc = useSelector(selectedPhoigocSelector);
  const user = useSelector(userLoginSelector);
  const handleDeleteClick = async (deletionReason) => {
    try {
      const phoigocDeleted = await deletePhoigoc(selectedPhoigoc.id, user.username, deletionReason);
      if (phoigocDeleted.isSuccess == false) {
        dispatch(showAlert(new Date().getTime().toString(), 'error', phoigocDeleted.message.toString()));
      } else {
        dispatch(setOpenPopup(false));
        dispatch(setReloadData(true));
        dispatch(showAlert(new Date().getTime().toString(), 'success', phoigocDeleted.message.toString()));
      }
    } catch (error) {
      console.error('Error updating Function:', error);
      dispatch(showAlert(new Date().getTime().toString(), 'error', error.toString()));
    }
  };
  return (
    <>
      <DeleteForm lyDo lable={t('label.action')} content={selectedPhoigoc ? selectedPhoigoc.tenPhoi : ''} handleClick={handleDeleteClick} />
    </>
  );
};

export default Delete;
