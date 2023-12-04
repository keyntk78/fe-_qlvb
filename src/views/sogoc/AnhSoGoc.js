import { DataGrid } from '@mui/x-data-grid';
import MainCard from 'components/cards/MainCard';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setReloadData, setOpenSubPopup, setSelectedValue } from 'store/actions';
import { openPopupSelector, openSubPopupSelector, reloadDataSelector } from 'store/selectors';
import { useTranslation } from 'react-i18next';
import useLocalText from 'utils/localText';
import { useNavigate } from 'react-router-dom';
import { handleResponseStatus } from 'utils/handleResponseStatus';
import AddButton from 'components/button/AddButton';
import i18n from 'i18n';
import config from 'config';
import { Dialog, Grid } from '@mui/material';
import ActionButtons from 'components/button/ActionButtons';
import Popup from 'components/controls/popup';
import AddAnhSoGoc from './AddAnhSoGoc';
import DeleteAnhSoGoc from './DeleteAnhSoGoc';
import { getAnhSoGoc } from 'services/sogocService';
import { convertISODateTimeToFormattedDateTime } from 'utils/formatDate';
import { IconFile } from '@tabler/icons';

const AnhSoGoc = ({ pageState }) => {
  const { t } = useTranslation();
  const language = i18n.language;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const localeText = useLocalText();
  const [title, setTitle] = useState('');
  const [form, setForm] = useState('');
  const [data, setData] = useState([]);
  const openSubPopup = useSelector(openSubPopupSelector);
  const openPopup = useSelector(openPopupSelector);
  const reloadData = useSelector(reloadDataSelector);

  const handleAdd = () => {
    setTitle(t('Thêm tệp đính kèm'));
    setForm('add');
    dispatch(setOpenSubPopup(true));
  };

  const handleDelete = (value) => {
    setTitle(t('Xóa tệp đính kèm'));
    setForm('delete');
    dispatch(setSelectedValue(value));
    dispatch(setOpenSubPopup(true));
  };

  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageClick = (params) => {
    if (params.row.url) {
      setSelectedImage(params.row.url);
    }
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  const handleKeyPress = (event) => {
    // Check if the Enter key is pressed
    if (event.key === 'Enter') {
      handleCloseModal();
    }
  };

  const columns = [
    {
      field: 'idx',
      headerName: t('serial'),
      width: 50,
      sortable: false,
      filterable: false
    },
    {
      flex: 1,
      field: 'image',
      headerName: t('Tệp đính kèm'),
      minWidth: 60,
      renderCell: (params) => {
        const isImage = params.row.url ? /\.(gif|jpe?g|tiff?|png|webp|bmp)$/i.test(params.row.url) : false;
        const pathFileYeuCau = config.urlImages + params.row.url;
        return isImage ? (
          <div
            style={{
              width: 45,
              height: 45,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer'
            }}
            onClick={() => handleImageClick(params)}
            onKeyPress={handleKeyPress}
            role="button"
            tabIndex={0}
          >
            <img src={`${config.urlImages}${params.row.url}`} alt="hinhAnh" style={{ width: '100%', height: '100%' }} />
          </div>
        ) : (
          <a href={pathFileYeuCau} target="_blank" rel="noreferrer" title="Xem tệp" style={{ marginLeft: '10px' }}>
            {params.row.url ? <IconFile /> : ''}
          </a>
        );
      }
    },
    {
      field: 'nguoiTao',
      headerName: t('Người tạo'),
      minWidth: 80,
      sortable: false,
      filterable: false,
      flex: 1
    },
    {
      field: 'ngayTao_fm',
      headerName: t('Ngày tạo'),
      minWidth: 80,
      sortable: false,
      filterable: false,
      flex: 1
    },
    {
      field: 'actions',
      headerName: t('action'),
      width: 90,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <>
          <Grid container justifyContent="center">
            <ActionButtons type="delete" handleDelete={handleDelete} params={params.row} />
          </Grid>
        </>
      )
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      const params = new URLSearchParams();
      params.append('idTruong', pageState.donVi);
      params.append('idTruongCu', pageState.donViOld);
      params.append('idDanhMucTotNghiep', pageState.DMTN);
      const response = await getAnhSoGoc(params);
      const check = await handleResponseStatus(response, navigate);
      if (check) {
        if (response?.data?.length > 0) {
          const dataWithIds = response.data.map((row, index) => ({
            idx: index + 1,
            ngayTao_fm: convertISODateTimeToFormattedDateTime(row.ngayTao),
            ...row
          }));
          setData(dataWithIds);
        } else {
          setData([]);
        }
        dispatch(setReloadData(false));
      } else {
        setIsAccess(false);
      }
    };
    if (pageState && openPopup) {
      fetchData();
    }
  }, [pageState, reloadData, openPopup]);

  return (
    <>
      <MainCard hideInstruct title={t('Ảnh sổ gốc')} secondary={<AddButton handleClick={handleAdd} />}>
        <DataGrid
          autoHeight
          rows={data}
          columns={columns}
          localeText={language === 'vi' ? localeText : null}
          disableSelectionOnClick={true}
          hideFooterPagination
        />
      </MainCard>
      {form !== '' && (
        <Popup
          title={title}
          form={form}
          openPopup={openSubPopup}
          type="subpopup"
          maxWidth={'sm'}
          bgcolor={form === 'delete' ? '#F44336' : '#2196F3'}
        >
          {form === 'add' ? <AddAnhSoGoc pageState={pageState} /> : form === 'delete' ? <DeleteAnhSoGoc /> : ''}
        </Popup>
      )}
      <Dialog open={!!selectedImage} onClose={handleCloseModal} fullWidth={true} maxWidth="xl">
        <div role="button" tabIndex={0} onClick={handleCloseModal} onKeyPress={handleKeyPress}>
          <img src={`${config.urlImages}${selectedImage}`} alt="Enlarged" style={{ width: '100%', height: '100%' }} />
        </div>
      </Dialog>
    </>
  );
};

export default AnhSoGoc;
