import { DataGrid } from '@mui/x-data-grid';
import MainCard from 'components/cards/MainCard';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectedTinNhan, setOpenPopup, setReloadData } from 'store/actions';
import { openPopupSelector, reloadDataSelector, userLoginSelector } from 'store/selectors';
import { useNavigate } from 'react-router-dom';
import { handleResponseStatus } from 'utils/handleResponseStatus';
import { useTranslation } from 'react-i18next';
import useLocalText from 'utils/localText';
import { createSearchParams } from 'utils/createSearchParams';
import i18n from 'i18n';
import React from 'react';
import { convertISODateTimeToFormattedDateTime } from 'utils/formatDate';
import { Button, FormControl, Grid, TextField } from '@mui/material';
import { IconFileExport, IconSearch } from '@tabler/icons';
import BackToTop from 'components/scroll/BackToTop';
import { GetAllMessagesByUserId } from 'services/notificationService';
import ActionButtons from 'components/button/ActionButtons';
import Detail from './Detail';
import Popup from 'components/controls/popup';
import { addMonths, format, subMonths } from 'date-fns';
import ExcelJS from 'exceljs';
import ButtonSuccess from 'components/buttoncolor/ButtonSuccess';

const Message = () => {
  const language = i18n.language;
  const { t } = useTranslation();
  const localeText = useLocalText();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const openPopup = useSelector(openPopupSelector);
  const user = useSelector(userLoginSelector);
  const [isAccess, setIsAccess] = useState(true);
  const reloadData = useSelector(reloadDataSelector);
  const [search, setSearch] = useState(false);
  const [title, setTitle] = useState('');
  const [form, setForm] = useState('');
  const [pageState, setPageState] = useState({
    isLoading: false,
    data: [],
    total: 0,
    order: 1,
    orderDir: 'ASC',
    startIndex: 0,
    pageSize: 10,
    userId: user.id,
    fromDate: format(subMonths(new Date(), 1), 'yyyy-MM-dd'), // Ngày hiện tại trừ 1 tháng định dạng 'yyyy-MM-dd'
    toDate: format(new Date(), 'yyyy-MM-dd') // Ngày hiện tại định dạng 'yyyy-MM-dd'
  });

  const handleDetail = (tinnhan) => {
    setTitle(t('hocsinh.title.info'));
    setForm('detail');
    dispatch(selectedTinNhan(tinnhan));
    dispatch(setOpenPopup(true));
  };

  const columns = [
    {
      field: 'rowIndex',
      headerName: t('serial'),
      width: 50,
      sortable: false,
      filterable: false
    },
    {
      flex: 1,
      field: 'time_fm',
      headerName: t('Thời gian gửi'),
      minWidth: 150
    },
    {
      flex: 1,
      field: 'messageType',
      headerName: t('Loại tin nhắn'),
      minWidth: 130
    },
    {
      flex: 1,
      field: 'action',
      headerName: t('Thao tác'),
      minWidth: 200
    },
    {
      flex: 1,
      field: 'userName',
      headerName: t('Người nhận'),
      minWidth: 100
    },
    {
      flex: 1.5,
      field: 'title',
      headerName: t('Tiêu đề'),
      minWidth: 110
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
            <ActionButtons type="detail" handleGetbyId={handleDetail} params={params.row} />
          </Grid>
        </>
      )
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      setPageState((old) => ({ ...old, isLoading: true }));
      const params = await createSearchParams(pageState);
      params.append('FromDate', pageState.fromDate);
      params.append('ToDate', pageState.toDate);
      params.append('userId', user.id);
      const response = await GetAllMessagesByUserId(params);
      const check = handleResponseStatus(response, navigate);
      if (check) {
        const data = await response.data;
        const dataWithIds = data.map((row, index) => ({
          id: index + 1,
          time_fm: convertISODateTimeToFormattedDateTime(row.time),
          ...row
        }));
        // Lưu trữ dữ liệu gốc vào state
        dispatch(setReloadData(false));
        setPageState((old) => ({
          ...old,
          isLoading: false,
          data: dataWithIds,
          total: dataWithIds[0]?.totalRow || 0
        }));
      } else {
        setIsAccess(false);
      }
    };
    fetchData();
    setSearch(false);
  }, [pageState.search, pageState.order, pageState.orderDir, pageState.startIndex, pageState.pageSize, reloadData, search]);

  const handleSearch = () => {
    setSearch(true);
  };

  const handleExport = async (e) => {
    e.preventDefault();
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Tin nhắn');

    const title = worksheet.getCell('A1');
    title.value = 'DANH SÁCH TIN NHẮN';
    title.alignment = { horizontal: 'center' };
    title.font = { bold: true, size: 15 };
    worksheet.mergeCells('A1:F1');

    const time = worksheet.getCell('A2');
    time.value = `Thời gian: ${format(new Date(pageState.fromDate), 'dd/MM/yyyy')} - ${format(new Date(pageState.toDate), 'dd/MM/yyyy')}`;
    worksheet.mergeCells('A2:C2');

    const cell = worksheet.getCell('A3');
    cell.value = '';

    // Adding the header row with bold formatting
    const headerRow = worksheet.addRow([
      'STT',
      'Thời gian gửi',
      'Loại tin nhắn',
      'Thao tác',
      'Người nhận',
      'Tiêu đề'
      //   'Nội dung',
    ]);
    headerRow.eachCell((cell) => {
      // cell.font = { bold: true };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.alignment.wrapText = true;
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });

    // Adding data rows
    pageState.data.forEach((item) => {
      const dataRow = worksheet.addRow([
        item.rowIndex,
        item.time_fm,
        item.messageType,
        item.action,
        item.userName,
        item.title
        // item.message,
      ]);
      dataRow.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        }; // Apply borders
      });
      dataRow.getCell(1).alignment = { horizontal: 'center' };
      //   dataRow.getCell(8).alignment = { wrapText: true };
    });

    // Adjust column widths
    worksheet.getColumn(1).width = 4; //stt
    worksheet.getColumn(2).width = 20; //thoiGian
    worksheet.getColumn(3).width = 20; //thoiGian
    worksheet.getColumn(4).width = 30; //thaotac
    worksheet.getColumn(5).width = 15; //nguoiNhan
    worksheet.getColumn(6).width = 30; //tieuDe
    // worksheet.getColumn(8).width = 80; //noiDung

    // Create a blob and initiate download
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tinnhan.xlsx';
    a.click();
  };

  return (
    <>
      <MainCard
        title={t('Tin nhắn')}
        secondary={
          <Grid container justifyContent="flex-end" spacing={1}>
            <Grid item>
              <ButtonSuccess fullWidth title={t('button.export')} onClick={handleExport} icon={IconFileExport} />
            </Grid>
          </Grid>
        }
      >
        <Grid container justifyContent="center" mb={1} spacing={1}>
          <Grid item maxWidth={140}>
            <FormControl fullWidth variant="outlined">
              <TextField
                size="small"
                name="fromDate"
                type="date"
                label={t('fromDate')}
                onChange={(e) => setPageState((old) => ({ ...old, fromDate: e.target.value }))}
                onBlur={() => {
                  if (pageState.toDate < pageState.fromDate) {
                    setPageState({ ...pageState, toDate: pageState.fromDate });
                  }
                }}
                value={pageState.fromDate}
                InputLabelProps={{
                  shrink: true
                }}
              />
            </FormControl>
          </Grid>
          <Grid item>
            <FormControl fullWidth variant="outlined">
              <TextField
                size="small"
                name="toDate"
                type="date"
                label={t('toDate')}
                onChange={(e) => setPageState((old) => ({ ...old, toDate: e.target.value }))}
                inputProps={{
                  min: pageState.fromDate,
                  max: pageState.fromDate ? format(addMonths(new Date(pageState.fromDate), 1), 'yyyy-MM-dd') : undefined // Chỉ cài đặt giá trị max khi pageState.fromDate tồn tại
                }}
                value={pageState.toDate}
                InputLabelProps={{
                  shrink: true
                }}
              />
            </FormControl>
          </Grid>
          <Grid item mt={'1px'}>
            <Button fullWidth variant="contained" title="Tìm kiếm" color="info" onClick={handleSearch} startIcon={<IconSearch />}>
              {t('button.search')}
            </Button>
          </Grid>
        </Grid>
        {isAccess ? (
          <DataGrid
            autoHeight
            columns={columns}
            rows={pageState.data}
            rowCount={pageState.total}
            loading={pageState.isLoading}
            rowsPerPageOptions={[5, 10, 25, 50, 100]}
            pagination
            page={pageState.startIndex}
            pageSize={pageState.pageSize}
            paginationMode="server"
            onPageChange={(newPage) => {
              setPageState((old) => ({ ...old, startIndex: newPage }));
            }}
            onPageSizeChange={(newPageSize) => {
              setPageState((old) => ({ ...old, pageSize: newPageSize }));
            }}
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
          />
        ) : (
          <h1>{t('not.allow.access')}</h1>
        )}
      </MainCard>{' '}
      {form !== '' && (
        <Popup title={title} form={form} openPopup={openPopup} maxWidth={'sm'} bgcolor={'#2196F3'}>
          {form === 'detail' ? <Detail /> : ''}
        </Popup>
      )}
      <BackToTop />
    </>
  );
};

export default Message;
