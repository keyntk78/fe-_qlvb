import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setOpenPopup, setReloadData, showAlert } from 'store/actions';
import { selectedReportSelector } from 'store/selectors';
import { useTranslation } from 'react-i18next';
import DeleteForm from 'components/form/DeleteForm';
import { deleteReport } from 'services/reportService';

const Delete = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const selectedReport = useSelector(selectedReportSelector);

  const handleDeleteClick = async () => {
    try {
      const response = await deleteReport(selectedReport.reportId);
      if (response.isSuccess == false) {
        dispatch(showAlert(new Date().getTime().toString(), 'error', response.message.toString()));
      } else {
        dispatch(setOpenPopup(false));
        dispatch(setReloadData(true));
        dispatch(showAlert(new Date().getTime().toString(), 'success', response.message.toString()));
      }
    } catch (error) {
      console.error('Error updating report:', error);
      dispatch(showAlert(new Date().getTime().toString(), 'error', error.toString()));
    }
  };

  return (
    <>
      <DeleteForm lable={t('Báo cáo')} content={selectedReport.name} handleClick={handleDeleteClick} />
    </>
  );
};

export default Delete;
