import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setOpenSubPopup, setReloadData, showAlert } from 'store/actions';
import { useTranslation } from 'react-i18next';
import { selectedSogocSelector, selectedDonvitruongSelector, userLoginSelector } from 'store/selectors';
import DeleteForm from 'components/form/DeleteForm';
import { deleteSogoc } from 'services/sogocService';

const DeleteAction = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const selectedSogoc = useSelector(selectedSogocSelector);
  const selectedDonvitruong = useSelector(selectedDonvitruongSelector);
  const user = useSelector(userLoginSelector);

  const handleDeleteClick = async () => {
    try {
      const sogocDeleted = await deleteSogoc(selectedDonvitruong.id, selectedSogoc.id, user.username);
      if (sogocDeleted.isSuccess == false) {
        dispatch(showAlert(new Date().getTime().toString(), 'error', sogocDeleted.message.toString()));
      } else {
        dispatch(setOpenSubPopup(false));
        dispatch(setReloadData(true));
        dispatch(showAlert(new Date().getTime().toString(), 'success', sogocDeleted.message.toString()));
      }
    } catch (error) {
      console.error('Error updating Function:', error);
      dispatch(showAlert(new Date().getTime().toString(), 'error', error.toString()));
    }
  };
  return (
    <>
      <DeleteForm
        lable={t('label.action')}
        type={'subpopup'}
        content={selectedSogoc ? selectedSogoc.tenSo : ''}
        handleClick={handleDeleteClick}
      />
    </>
  );
};

export default DeleteAction;
