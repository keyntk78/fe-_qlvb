import { DataGrid } from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';
import { Button, Grid } from '@mui/material';
import i18n from 'i18n';
import MainCard from 'components/cards/MainCard';
import useLocalText from 'utils/localText';
import { IconDownload, IconRotateClockwise } from '@tabler/icons';
import config from 'config';

const rows = [
  {
    id: 1,
    fileName: 'Monggo.json',
    size: '50MB',
    path: '/Path/Monggo.json',
    dateCreate: '112-01-2023 20:12:12',
    userSave: 'minhhau'
  },
  {
    id: 2,
    fileName: 'Posgres.sql',
    size: '1.5GB',
    path: '/Path/Posgres.sql',
    dateCreate: '112-01-2023 20:12:12',
    userSave: 'minhhau'
  },
  {
    id: 3,
    fileName: 'Soucercode.zip',
    size: '126MB',
    path: '/Path/Soucercode.zip',
    dateCreate: '112-01-2023 20:12:12',
    userSave: 'minhhau'
  }
];

const SaoLuu = () => {
  const localeText = useLocalText();
  const language = i18n.language;
  const { t } = useTranslation();
  const isAccess = true;

  const columns = [
    {
      field: 'id',
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
      field: 'size',
      headerName: t('Kích thước'),
      sortable: false,
      filterable: false,
      width: 150
    },
    {
      field: 'userSave',
      headerName: t('Người lưu'),
      sortable: false,
      filterable: false,
      minWidth: 150
    },
    {
      field: 'dateCreate',
      headerName: t('Ngày tạo'),
      sortable: false,
      filterable: false,
      minWidth: 300
    },
    {
      field: 'path',
      headerName: t('Tải xuống'),
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const pathFileYeuCau = config.urlImages + params.row.path;
        return (
          <a href={pathFileYeuCau} download title="Tải xuống">
            {params.row.path ? <IconDownload /> : ''}
          </a>
        );
      },
      minWidth: 100
    }
  ];

  const handleSave = () => {};
  const handleReset = () => {};
  return (
    <>
      <MainCard
        title={t('Sao lưu - Khôi phục')}
        secondary={
          <Grid container justifyContent="flex-end" spacing={1}>
            <Grid item>
              <Button color="info" variant="contained" startIcon={<IconDownload />} onClick={handleSave}>
                {t('Sao lưu')}
              </Button>
            </Grid>
            <Grid item>
              <Button color="info" variant="contained" startIcon={<IconRotateClockwise />} onClick={handleReset}>
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
            rows={rows}
            localeText={language === 'vi' ? localeText : null}
            disableSelectionOnClick={true}
          />
        ) : (
          <h1>{t('not.allow.access')}</h1>
        )}
      </MainCard>
    </>
  );
};

export default SaoLuu;
