import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteConfig } from 'services/configService';
import { setOpenPopup, setReloadData, showAlert } from 'store/actions';
import { selectedConfigSelector } from 'store/selectors';
import { useTranslation } from 'react-i18next';
import DeleteForm from 'components/form/DeleteForm';

const DeleteConfig = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const selectedConfig = useSelector(selectedConfigSelector);

  const handleDeleteClick = async () => {
    try {
      const configDeleted = await deleteConfig(selectedConfig.configId);
      if (configDeleted.isSuccess == false) {
        dispatch(showAlert(new Date().getTime().toString(), 'error', configDeleted.message.toString()));
      } else {
        dispatch(setOpenPopup(false));
        dispatch(setReloadData(true));
        dispatch(showAlert(new Date().getTime().toString(), 'success', configDeleted.message.toString()));
      }
    } catch (error) {
      console.error('Error updating config:', error);
      dispatch(showAlert(new Date().getTime().toString(), 'error', error.toString()));
    }
  };

  return (
    <>
      <DeleteForm lable={t('config.title')} content={selectedConfig ? selectedConfig.configKey : ''} handleClick={handleDeleteClick}/>
    </>
  );
};

export default DeleteConfig;
