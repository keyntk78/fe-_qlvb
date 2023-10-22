import { useLocation, useNavigate } from 'react-router';
import { Container, useTheme } from '@mui/system';
import { Divider, Grid, Pagination, Typography, useMediaQuery } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useEffect } from 'react';
import { createSearchParams } from 'utils/createSearchParams';
import { getAllLoaiTinTuc, getLatest4News, getSearchTinTucByIdLoaiTin } from 'services/congthongtinService';
import config from 'config';
import { IconPoint } from '@tabler/icons';
import { formatDateTinTuc } from 'utils/formatDate';
import BackToTop from 'components/scroll/BackToTop';

const styles = `
.title:hover {
  color: #0287d0;
  cursor: pointer;
}
`;

export default function DanhmucTintuc() {
  const theme = useTheme();
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();
  const formData = location.state.id;
  const formTieuDe = location.state.tieuDe;

  const { t } = useTranslation();

  const [tieuDe, setTieuDe] = useState(formTieuDe);
  const [tinTuc, setTinTuc] = useState([]);
  const [tinTucNew, setTinTucNew] = useState([]);

  const [loaiTin, setLoaiTin] = useState([]);
  const [pageState, setPageState] = useState({
    isLoading: false,
    data: [],
    total: 0,
    order: 0,
    orderDir: 'DESC',
    startIndex: 0,
    pageSize: 5,
    currentPage: 1
  });

  const urlimg = config.urlFile + 'TinTuc/';

  const handleBoxClick = async (id) => {
    if (id) {
      navigate('/chitiet-tintuc', {
        state: {
          id: id
        }
      });
    }
  };

  useEffect(() => {
    console.log(tinTuc);
  }, [tinTuc]);

  const handleGridClick = async (id, tieude) => {
    if (id) {
      setTieuDe(tieude);
      const params = await createSearchParams({
        ...pageState,
        startIndex: pageState.currentPage - 1
      });
      const datatintuc = await getSearchTinTucByIdLoaiTin(params, id);

      const dataT = datatintuc.data;

      setTinTuc(datatintuc.data.tinTuc);
      setPageState((old) => ({
        ...old,
        isLoading: false,
        data: dataT.tinTuc,
        total: dataT.totalRow
      }));
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const params = await createSearchParams({
        ...pageState,
        startIndex: pageState.currentPage - 1
      });
      const datatintuc = await getSearchTinTucByIdLoaiTin(params, formData);

      const dataT = datatintuc.data;

      setTinTuc(datatintuc.data.tinTuc);
      setPageState((old) => ({
        ...old,
        isLoading: false,
        data: dataT.tinTuc,
        total: dataT.totalRow
      }));

      const loaiTinData = await getAllLoaiTinTuc();
      setLoaiTin(loaiTinData.data);
      const tinTucNew = await getLatest4News();
      setTinTucNew(tinTucNew.data);
    };
    fetchData();
  }, [formData, pageState.currentPage]);

  return (
    <>
      <style>{styles}</style>
      <Container sx={{ paddingBottom: 1, margin: 'auto', minHeight: `calc(100vh - 285px)` }}>
        <Grid container spacing={2} mt={1}>
          <Grid item xs={12} sm={12} md={8.5} lg={8.5}>
            <Grid container columnSpacing={3}>
              <Grid item xs={12}>
                <Typography variant={isSmallScreen ? 'h4' : 'h2'}>{tieuDe}</Typography>
                <Divider sx={{ height: '3px', bgcolor: '#0287d0' }}></Divider>
              </Grid>
              {pageState.data.length > 0
                ? pageState.data.map((tintuc, index) => (
                    <>
                      <Grid item key={index}>
                        <Grid container columnSpacing={2} onClick={() => handleBoxClick(tintuc ? tintuc.id : '')} mt={1}>
                          <Grid item xs={4}>
                            <img
                              src={tintuc ? `${urlimg}${tintuc.hinhAnh}` : ''}
                              alt="tin tức"
                              style={{ width: '100%', height: '150px', objectFit: 'cover', cursor: 'pointer' }}
                            />
                          </Grid>
                          <Grid item xs={8}>
                            <Grid item xs={12} style={{ fontSize: '12px', fontStyle: 'italic' }}>
                              {formatDateTinTuc(tintuc.ngayCapNhat || tintuc.ngayTao)}
                            </Grid>
                            <Grid item xs={12}>
                              <Typography className="title" variant={'h4'} component="h4">
                                {tintuc ? tintuc.tieuDe : ''}
                              </Typography>
                            </Grid>
                            <Grid item xs={12} mt={'3px'}>
                              <Typography
                                variant="body1"
                                sx={{
                                  overflow: 'hidden',
                                  display: '-webkit-box',
                                  WebkitLineClamp: '5',
                                  WebkitBoxOrient: 'vertical',
                                  whiteSpace: 'normal'
                                }}
                              >
                                {tintuc ? tintuc.moTaNgan : ''}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Grid>
                        <Divider sx={{ my: 1 }} />
                      </Grid>
                    </>
                  ))
                : t('noRowsLabel')}
              <Grid container justifyContent={'center'} mt={2}>
                <Grid item>
                  <Pagination color="info" count={1} showFirstButton showLastButton />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={12} md={3.5}>
            <Grid container>
              <Grid item xs={12} sx={{ bgcolor: '#0287d0' }}>
                <Typography variant="h4" sx={{ color: '#FFFFFF', padding: '8px 0 8px 10px' }}>
                  {t('danhmuctintuc')}
                </Typography>
              </Grid>
              <Grid item xs={12} sx={{ border: '1px solid lightgrey' }} pb={1}>
                {loaiTin
                  ? loaiTin.map((loaiTin, index) => {
                      return (
                        <Grid item xs={12} key={index}>
                          <Typography
                            className="title"
                            variant="h5"
                            mt={1}
                            style={{ display: 'flex', alignItems: 'center' }}
                            onClick={() => handleGridClick(loaiTin ? loaiTin.id : '', loaiTin ? loaiTin.tieuDe : '')}
                          >
                            <IconPoint /> {loaiTin ? loaiTin.tieuDe : ''}
                          </Typography>
                        </Grid>
                      );
                    })
                  : ''}
              </Grid>
            </Grid>
            <Grid container mt={2}>
              <Grid item xs={12} sx={{ bgcolor: '#0287d0' }}>
                <Typography variant="h4" sx={{ color: '#FFFFFF', padding: '8px 0 8px 10px' }}>
                  {t('tinmoinhat')}
                </Typography>
              </Grid>
              <Grid item xs={12} sx={{ border: '1px solid lightgrey' }} pb={1}>
                {tinTucNew.map((tinTuc) => (
                  <Grid
                    key={tinTuc.id}
                    container
                    columnSpacing={4}
                    justifyContent={'center'}
                    onClick={() => handleBoxClick(tinTuc.id)}
                    mt={2}
                  >
                    <Grid item xs={3.7}>
                      <img
                        src={`${urlimg}${tinTuc.hinhAnh}`}
                        alt="tin tức"
                        style={{ width: '100px', height: '70px', objectFit: 'cover', cursor: 'pointer' }}
                      />
                    </Grid>
                    <Grid item xs={7.7}>
                      <Typography
                        variant="h5"
                        className="title"
                        sx={{
                          overflow: 'hidden',
                          display: '-webkit-box',
                          WebkitLineClamp: '3',
                          WebkitBoxOrient: 'vertical',
                          whiteSpace: 'normal'
                        }}
                      >
                        {tinTuc.tieuDe}
                      </Typography>
                    </Grid>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
      <BackToTop />
    </>
  );
}
