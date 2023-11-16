import i18n from 'i18n';
import { DataGrid } from '@mui/x-data-grid';
import { useState } from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setOpenPopup, setReloadData, showAlert } from 'store/actions';
import { reloadDataSelector, selectedDanhmuctotnghiepSelector, userLoginSelector, openPopupSelector } from 'store/selectors';
import { handleResponseStatus } from 'utils/handleResponseStatus';
import useLocalText from 'utils/localText';
import { useTranslation } from 'react-i18next';
import { Checkbox, Grid } from '@mui/material';
import SaveButtonTable from 'components/button/SaveButtonTable';
import ExitButton from 'components/button/ExitButton';
import { createDanhMucTotNghiepViaTruong, getAllTruong } from 'services/danhmuctotnghiepService';

const Permission = () => {
  const language = i18n.language;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const localeText = useLocalText();
  const reloadData = useSelector(reloadDataSelector);
  const { t } = useTranslation();
  const [isAccess, setIsAccess] = useState(true);
  const selectedDanhMuc = useSelector(selectedDanhmuctotnghiepSelector);
  const user = useSelector(userLoginSelector);
  const openPopup = useSelector(openPopupSelector);

  const [pageState, setPageState] = useState({
    isLoading: false,
    data: [],
    total: 0,
    pageSize: -1,
    selectAllChecked: false
  });

  const handleSelectAllCheckboxChange = (event) => {
    const isChecked = event.target.checked;
    setPageState((prevState) => ({
      ...prevState,
      selectAllChecked: isChecked,
      data: prevState.data.map((row) => ({
        ...row,
        hasPermision: isChecked
      }))
    }));
  };

  const handleCheckboxChange = (event, id) => {
    const checked = event.target.checked;
    setPageState((prevState) => {
      const updatedData = prevState.data.map((row) => {
        if (row.id === id) {
          return {
            ...row,
            hasPermision: checked
          };
        }
        return row;
      });

      const allChecked = updatedData.every((row) => row.hasPermision);

      return {
        ...prevState,
        selectAllChecked: allChecked,
        data: updatedData
      };
    });
  };

  const columns = [
    {
      field: 'id',
      headerName: t('serial'),
      width: 50,
      sortable: false,
      filterable: false
    },
    {
      field: 'tenTruong',
      headerName: t('Tên trường'),
      flex: 1,
      minWidth: 138
    },
    {
      field: 'actions',
      headerName: <Checkbox checked={pageState.selectAllChecked} color="info" onChange={handleSelectAllCheckboxChange} />,
      width: 88,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <>
          <Checkbox
            checked={params.row.hasPermision}
            color="info"
            onChange={(event) => handleCheckboxChange(event, params.row.id)}
            name={params.row.idTruong ? params.row.idTruong.toString() : ''}
          />
        </>
      )
    }
  ];

  const handleSave = async () => {
    const selectedTruongIds = pageState.data.reduce((result, truong) => {
      if (truong.hasPermision) {
        return result !== '' ? `${result},${truong.idTruong}` : `${truong.idTruong}`;
      }
      return result;
    }, '');

    const data = {
      idDanhMucTotNghiep: selectedDanhMuc.id,
      idTruongs: selectedTruongIds,
      nguoiThucHien: user.username
    };

    const response = await createDanhMucTotNghiepViaTruong(data);
    const check = handleResponseStatus(response, navigate);
    if (!check) {
      dispatch(showAlert(new Date().getTime().toString(), 'error', response.message.toString()));
    } else {
      if (response.isSuccess == false) {
        dispatch(showAlert(new Date().getTime().toString(), 'error', response.message.toString()));
      } else {
        dispatch(showAlert(new Date().getTime().toString(), 'success', response.message.toString()));
        dispatch(setOpenPopup(false));
        dispatch(setReloadData(true));
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setPageState((old) => ({ ...old, isLoading: true }));
      if (selectedDanhMuc) {
        const response = await getAllTruong(selectedDanhMuc.id, user.username);
        const check = await handleResponseStatus(response, navigate);
        if (check) {
          const data = await response.data;
          const dataWithIds = data.truongs.map((row, index) => ({
            id: index + 1,
            ...row
          }));
          const allChecked = dataWithIds.every((row) => row.hasPermision);
          dispatch(setReloadData(false));
          setPageState((old) => ({
            ...old,
            selectAllChecked: allChecked,
            isLoading: false,
            data: dataWithIds,
            total: data.totalRow
          }));
        } else {
          setIsAccess(false);
        }
      }
    };
    if (openPopup) {
      fetchData();
    }
  }, [
    pageState.search,
    pageState.order,
    pageState.orderDir,
    pageState.startIndex,
    pageState.pageSize,
    selectedDanhMuc,
    reloadData,
    openPopup
  ]);

  return (
    <>
      {isAccess ? (
        <Grid container mt={2}>
          <DataGrid
            autoHeight
            columns={columns}
            rows={pageState.data}
            loading={pageState.isLoading}
            pagination
            onSortModelChange={(newSortModel) => {
              const field = newSortModel[0]?.field;
              const sort = newSortModel[0]?.sort;
              setPageState((old) => ({ ...old, order: field, orderDir: sort }));
            }}
            onFilterModelChange={(newSearchModel) => {
              const value = newSearchModel.items[0]?.value;
              setPageState((old) => ({ ...old, search: value }));
            }}
            localeText={language === 'vi' ? localeText : null}
            disableSelectionOnClick={true}
            hideFooterPagination
          />
        </Grid>
      ) : (
        <h1>{t('not.allow.access')}</h1>
      )}
      <Grid item xs={12} container spacing={2} justifyContent="flex-end" mt={1}>
        <Grid item>
          <SaveButtonTable onClick={handleSave} />
        </Grid>
        <Grid item>
          <ExitButton />
        </Grid>
      </Grid>
    </>
  );
};

export default Permission;
