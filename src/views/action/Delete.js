import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setOpenSubPopup, setReloadData, showAlert } from 'store/actions';
import { useTranslation } from 'react-i18next';
import { selectedActionSelector } from 'store/selectors';
import { deleteAction } from 'services/actionService';
import DeleteForm from 'components/form/DeleteForm';

const DeleteAction = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const selectedAction = useSelector(selectedActionSelector);

  const handleDeleteClick = async () => {
    try {
      const actionDeleted = await deleteAction(selectedAction.functionActionId);
      if (actionDeleted.isSuccess == false) {
        dispatch(showAlert(new Date().getTime().toString(), 'error', actionDeleted.message.toString()));
      } else {
        dispatch(setOpenSubPopup(false));
        dispatch(setReloadData(true));
        dispatch(showAlert(new Date().getTime().toString(), 'success', actionDeleted.message.toString()));
      }
    } catch (error) {
      console.error('Error updating Function:', error);
      dispatch(showAlert(new Date().getTime().toString(), 'error', error.toString()));
    }
  };
  return (
    <>
      <DeleteForm lable={t('label.action')} type={"subpopup"} content={selectedAction ? selectedAction.action : ''} handleClick={handleDeleteClick}/>
    </>
  );
};

export default DeleteAction;
