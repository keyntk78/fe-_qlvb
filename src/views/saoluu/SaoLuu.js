import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setOpenPopup } from 'store/actions';
import { openPopupSelector } from 'store/selectors';
import Popup from 'components/controls/popup';
import { useTranslation } from 'react-i18next';
import { Button, Grid } from '@mui/material';
import i18n from 'i18n';
import MainCard from 'components/cards/MainCard';
import useLocalText from 'utils/localText';
import { IconDownload, IconRotateClockwise, IconRefresh } from '@tabler/icons';
import config from 'config';
import XacNhanSaoLuu from './XacNhanSaoLuu';
import { getBackupData } from 'services/saoluuService';
import { convertISODateToFormattedDate } from 'utils/formatDate';

const SaoLuu = () => {
  const localeText = useLocalText();
  const language = i18n.language;
  const { t } = useTranslation();
  const isAccess = true;
  const [title, setTitle] = useState('');
  const [form, setForm] = useState('');
  const [data, setData] = useState([]);
  const dispatch = useDispatch();
  const openPopup = useSelector(openPopupSelector);

  useEffect(() => {
    const fectchData = async () => {
      const res = await getBackupData();
      if (res.isSuccess && res.data.length > 0) {
        const backupData = res.data.map((item, i) => ({
          idx: i + 1,
          date: convertISODateToFormattedDate(item.dateCreate),
          ...item
        }));
        setData(backupData);
      }
    };

    fectchData();
  }, [openPopup]);

  const columns = [
    {
      field: 'idx',
      headerName: t('serial'),
      minWidth: 50,
      sortable: false,
      filterable: false
    },
    {
      field: 'fileName',
      headerName: t('Tên file'),
      sortable: false,
      filterable: false,
      minWidth: 250
    },
    {
      field: 'sizeName',
      headerName: t('Kích thước'),
      sortable: false,
      filterable: false,
      width: 150
    },
    {
      field: 'userCreate',
      headerName: t('Người lưu'),
      sortable: false,
      filterable: false,
      minWidth: 150
    },
    {
      field: 'date',
      headerName: t('Ngày tạo'),
      sortable: false,
      filterable: false,
      flex: 1
    },
    {
      field: 'pathFile',
      headerName: t('Tải xuống'),
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const pathFileYeuCau = config.urlImages + params.row.pathFile;
        return (
          <a href={pathFileYeuCau} download title="Tải xuống">
            {params.row.pathFile ? <IconDownload /> : ''}
          </a>
        );
      },
      minWidth: 100
    }
  ];

  const handleBackup = async () => {
    setTitle(t('Xác nhận sao lưu'));
    setForm('saoluu');
    dispatch(setOpenPopup(true));
  };

  const handleRestore = async () => {
    setTitle(t('Xác nhận khôi phục'));
    setForm('khoiphuc');
    dispatch(setOpenPopup(true));
  };

  const handleSynchronized = async () => {};

  return (
    <>
      <MainCard
        title={t('Sao lưu - Khôi phục')}
        secondary={
          <Grid container justifyContent="flex-end" spacing={1}>
            <Grid item>
              <Button color="info" variant="contained" startIcon={<IconRefresh />} onClick={handleSynchronized}>
                {t('Đồng bộ')}
              </Button>
            </Grid>
            <Grid item>
              <Button color="info" variant="contained" startIcon={<IconDownload />} onClick={handleBackup}>
                {t('Sao lưu')}
              </Button>
            </Grid>
            <Grid item>
              <Button color="info" variant="contained" startIcon={<IconRotateClockwise />} onClick={handleRestore}>
                {t('Khôi phục')}
              </Button>
            </Grid>
          </Grid>
        }
      >
        {isAccess ? (
          <DataGrid
            autoHeight
            columns={columns}
            rows={data}
            localeText={language === 'vi' ? localeText : null}
            disableSelectionOnClick={true}
          />
        ) : (
          <h1>{t('not.allow.access')}</h1>
        )}
        {form !== '' && (
          <Popup title={title} form={form} openPopup={openPopup} maxWidth={'sm'} bgcolor={form === 'delete' ? '#F44336' : '#2196F3'}>
            <XacNhanSaoLuu type={form} />
          </Popup>
        )}
      </MainCard>
    </>
  );
};

export default SaoLuu;
