import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteRole } from 'services/roleService';
import { setOpenPopup, setReloadData, showAlert } from 'store/actions';
import { selectedRoleSelector } from 'store/selectors';
import { useTranslation } from 'react-i18next';
import DeleteForm from 'components/form/DeleteForm';

const DeleteRole = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const selectedRole = useSelector(selectedRoleSelector);

  const handleDeleteClick = async () => {
    try {
      const roleDeleted = await deleteRole(selectedRole.roleId);
      if (roleDeleted.isSuccess == false) {
        dispatch(showAlert(new Date().getTime().toString(), 'error', roleDeleted.message.toString()));
      } else {
        dispatch(setOpenPopup(false));
        dispatch(setReloadData(true));
        dispatch(showAlert(new Date().getTime().toString(), 'success', roleDeleted.message.toString()));
      }
    } catch (error) {
      console.error('Error updating role:', error);
      dispatch(showAlert(new Date().getTime().toString(), 'error', error.toString()));
    }
  };

  return (
    <>
      <DeleteForm lable={t('label.role')} content={selectedRole.name} handleClick={handleDeleteClick} />
    </>
  );
};

export default DeleteRole;
