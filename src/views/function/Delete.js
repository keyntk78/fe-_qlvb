import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteFunction } from 'services/functionService';
import { setOpenPopup, setReloadData, showAlert } from 'store/actions';
import { selectedFunctionSelector } from 'store/selectors';
import { useTranslation } from 'react-i18next';
import DeleteForm from 'components/form/DeleteForm';

const DeleteFunction = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const selectedFunction = useSelector(selectedFunctionSelector);

  const handleDeleteClick = async () => {
    try {
      const functionDeleted = await deleteFunction(selectedFunction.functionId);
      if (functionDeleted.isSuccess == false) {
        dispatch(showAlert(new Date().getTime().toString(), 'error', functionDeleted.message.toString()));
      } else {
        dispatch(setOpenPopup(false));
        dispatch(setReloadData(true));
        dispatch(showAlert(new Date().getTime().toString(), 'success', functionDeleted.message.toString()));
      }
    } catch (error) {
      console.error('Error updating Function:', error);
      dispatch(showAlert(new Date().getTime().toString(), 'error', error.toString()));
    }
  };

  return (
    <>
      <DeleteForm lable={t('label.function')} content={selectedFunction.name} handleClick={handleDeleteClick}/>
    </>
  );
};

export default DeleteFunction;
