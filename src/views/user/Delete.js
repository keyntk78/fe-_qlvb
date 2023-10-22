import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setOpenPopup, setReloadData, showAlert } from 'store/actions';
import { selectedUserSelector } from 'store/selectors';
import { useTranslation } from 'react-i18next';
import { deleteUser } from 'services/userService';
import { useNavigate } from 'react-router';
import { handleResponseStatus } from 'utils/handleResponseStatus';
import DeleteForm from 'components/form/DeleteForm';

const DeleteUser = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const selectedUser = useSelector(selectedUserSelector);
  const navigate = useNavigate();

  const handleDeleteClick = async () => {
    try {
      const userDelete = await deleteUser(selectedUser.userId);
      const check = handleResponseStatus(userDelete, navigate);
      if (!check) {
        dispatch(showAlert(new Date().getTime().toString(), 'error', addedUser.message.toString()));
      } else {
        if (userDelete.isSuccess == false) {
          dispatch(showAlert(new Date().getTime().toString(), 'error', userDelete.message.toString()));
        } else {
          dispatch(setReloadData(true));
          dispatch(setOpenPopup(false));
          dispatch(showAlert(new Date().getTime().toString(), 'success', userDelete.message.toString()));
        }
      }
    } catch (error) {
      console.error('Error updating role:', error);
      dispatch(showAlert(new Date().getTime().toString(), 'error', error.toString()));
    }
  };

  return (
    <>
      <DeleteForm lable={t('label.user')} content={selectedUser.userName} handleClick={handleDeleteClick}/>
    </>
  );
};

export default DeleteUser;
