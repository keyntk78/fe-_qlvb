import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setOpenPopup, setReloadData, showAlert } from 'store/actions';
import { selectedMessageConfigSelector, userLoginSelector } from 'store/selectors';
import { useTranslation } from 'react-i18next';
import DeleteForm from 'components/form/DeleteForm';
import { deleteMessageConfig } from 'services/messageConfigService';

const DeleteTinTuc = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const msgConfig = useSelector(selectedMessageConfigSelector);
  const user = useSelector(userLoginSelector);

  const handleDeleteClick = async () => {
    try {
      const dataDeleted = await deleteMessageConfig(msgConfig.messageConfiId, user.username);
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
      <DeleteForm lable={t('Cấu hình tin nhắn')} content={msgConfig.title} handleClick={handleDeleteClick} />
    </>
  );
};

export default DeleteTinTuc;
