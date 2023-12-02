import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading, setReloadData } from 'store/actions';
import { reloadDataSelector, userLoginSelector } from 'store/selectors';
import { useNavigate } from 'react-router-dom';
import { handleResponseStatus } from 'utils/handleResponseStatus';
import { useTranslation } from 'react-i18next';
import useLocalText from 'utils/localText';
import { createSearchParams } from 'utils/createSearchParams';
import i18n from 'i18n';
import React from 'react';
import { convertISODateTimeToFormattedDateTime } from 'utils/formatDate';
import { Grid, Typography } from '@mui/material';
import { IconFileExport } from '@tabler/icons';
import ExcelJS from 'exceljs';
import BackToTop from 'components/scroll/BackToTop';
import ButtonSuccess from 'components/buttoncolor/ButtonSuccess';
import { format, subMonths } from 'date-fns';
import { getLichSuThaoTacSoGoc } from 'services/sogocService';

const LichSuThaoTac = ({ danhMuc, donvi, donviOld }) => {
  const language = i18n.language;
  const { t } = useTranslation();
  const localeText = useLocalText();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isAccess, setIsAccess] = useState(true);
  const reloadData = useSelector(reloadDataSelector);
  const user = useSelector(userLoginSelector);

  const [pageState, setPageState] = useState({
    isLoading: false,
    data: [],
    total: 0,
    order: 1,
    orderDir: 'DESC',
    startIndex: 0,
    pageSize: 10,
    fromDate: format(subMonths(new Date(), 1), 'yyyy-MM-dd'),
    toDate: format(new Date(), 'yyyy-MM-dd'),
    idUser: '',
    userName: '',
    function: '',
    action: ''
  });

  const columns = [
    {
      field: 'id',
      headerName: t('serial'),
      width: 50,
      sortable: false,
      filterable: false
    },
    {
      flex: 1,
      field: 'hanhDong',
      headerName: t('Hành động'),
      minWidth: 100
    },
    {
      flex: 1,
      field: 'nguoiThucHien',
      headerName: t('Người thực hiện'),
      minWidth: 100
    },
    {
      flex: 1,
      field: 'ngayThucHien_fm',
      headerName: t('Ngày thực hiện'),
      minWidth: 100
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      setPageState((old) => ({ ...old, isLoading: true }));
      const params = await createSearchParams(pageState);
      params.append('IdDanhMucTotNghiep', danhMuc?.id || '');
      params.append('IdTruong', donvi?.id || '');
      params.append('IdTruongCu', donviOld?.id || '');
      params.append('NguoiThucHien', user.username);
      const response = await getLichSuThaoTacSoGoc(params);
      const check = handleResponseStatus(response, navigate);
      if (check) {
        if (response?.data?.lichSuThaoTac?.length > 0) {
          const dataWithIds = response.data.lichSuThaoTac.map((row, index) => ({
            id: pageState.startIndex * pageState.pageSize + index + 1,
            ngayThucHien_fm: convertISODateTimeToFormattedDateTime(row.ngayThucHien) || '',
            ...row
          }));
          dispatch(setReloadData(false));
          setPageState((old) => ({
            ...old,
            isLoading: false,
            data: dataWithIds,
            total: response?.data?.totalRow || 0
          }));
        } else {
          setPageState((old) => ({
            ...old,
            isLoading: false,
            data: [],
            total: 0
          }));
        }
      } else {
        setIsAccess(false);
      }
    };
    fetchData();
  }, [
    pageState.search,
    pageState.order,
    pageState.orderDir,
    pageState.startIndex,
    pageState.pageSize,
    reloadData,
    danhMuc,
    donvi,
    donviOld
  ]);

  const handleExport = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    const params = new URLSearchParams();
    params.append('Order', 1);
    params.append('OrderDir', 'ASC');
    params.append('StartIndex', '0');
    params.append('PageSize', -1);
    params.append('IdDanhMucTotNghiep', danhMuc?.id || '');
    params.append('IdTruong', donvi?.id || '');
    params.append('IdTruongCu', donviOld?.id || '');
    params.append('NguoiThucHien', user.username);
    const response = await getLichSuThaoTacSoGoc(params);
    const formattedData = response?.data?.lichSuThaoTac?.map((item, index) => ({
      STT: index + 1,
      'Hành động': item.hanhDong,
      'Người thực hiện': item.nguoiThucHien,
      'Ngày thực hiện': convertISODateTimeToFormattedDateTime(item.ngayThucHien)
    }));
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('LichSuThaoTacSoGoc');

    const titleRow = worksheet.addRow(['LỊCH SỬ THAO TÁC SỔ GỐC CŨ']);
    titleRow.getCell(1).alignment = { horizontal: 'center' };
    titleRow.getCell(1).font = { bold: true, size: 13 };
    worksheet.mergeCells('A1:D1');

    worksheet.addRow([]);

    // Add column headers and widths on the next row
    const columnHeaderRow = worksheet.addRow(['STT', 'Hành động', 'Người thực hiện', 'Ngày thực hiện']);

    columnHeaderRow.eachCell((cell) => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
      cell.alignment = { horizontal: 'center' };
    });

    worksheet.columns = [
      { key: 'STT', width: 10 },
      { key: 'Hành động', width: 20 },
      { key: 'Người thực hiện', width: 20 },
      { key: 'Ngày thực hiện', width: 20 }
    ];

    formattedData.forEach((dataRow) => {
      const row = worksheet.addRow(dataRow);
      row.eachCell((cell, colNumber) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
        if (colNumber === 1 || colNumber === 4) {
          cell.alignment = { horizontal: 'center' };
        }
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lichsu_thaotac.xlsx';
    a.click();
  };

  return (
    <>
      {pageState?.data?.length > 0 && (
        <Grid container justifyContent="flex-end" mt={2} alignItems="center" spacing="">
          <Grid item>
            <ButtonSuccess title={t('button.export')} onClick={handleExport} icon={IconFileExport} />
          </Grid>
        </Grid>
      )}
      <Grid container my={1} alignItems="center">
        <Grid item xs={12}>
          <Typography variant="h5">Danh mục tốt nghiệp: {danhMuc.tieuDe}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h5">Đơn vị trường: {donviOld.ten || donvi.ten}</Typography>
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
      <BackToTop />
    </>
  );
};

export default LichSuThaoTac;
