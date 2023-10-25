import { Container, useTheme } from '@mui/system';
import { Divider, Grid, Pagination, Typography, useMediaQuery } from '@mui/material';
import { useEffect } from 'react';
import { getAllLoaiTinTuc, getAllTinTuc, getLatest4News, getSearchTinTuc } from 'services/congthongtinService';
import { useState } from 'react';
import config from 'config';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import { AutoScroll } from '@splidejs/splide-extension-auto-scroll';
import '@splidejs/splide/dist/css/splide.min.css';
import BackToTop from 'components/scroll/BackToTop';
import { IconPoint } from '@tabler/icons';
import { formatDateTinTuc } from 'utils/formatDate';
import { createSearchParams } from 'utils/createSearchParams';

export default function Thongtintintuc() {
  const theme = useTheme();
  const { t } = useTranslation();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  // const isXs = useMediaQuery('(max-width:820px)');
  const [tinTucNew, setTinTucNew] = useState([]);
  const [tinTucAll, setTinTucAll] = useState([]);
  const [loaiTin, setLoaiTin] = useState([]);
  const [tinTuc, setTinTuc] = useState([]);
  const urlimg = config.urlFile + 'TinTuc/';
  const navigate = useNavigate();
  const [pageState, setPageState] = useState({
    total: 0,
    order: 0,
    orderDir: 'ASC',
    startIndex: 0,
    pageSize: 5
  });

  const handleBoxClick = (id) => {
    navigate('/chitiet-tintuc', {
      state: {
        id: id
      }
    });
  };

  const handleGridClick = (id, tieude) => {
    if (id) {
      navigate('/danhmuc-tintuc', {
        state: {
          id: id,
          tieuDe: tieude
        }
      });
    }
  };

  const DanhmucTintuc = async (id, tieude) => {
    navigate('/danhmuc-tintuc', {
      state: {
        id: id,
        tieuDe: tieude
      }
    });
  };

  const handlePageChange = (page) => {
    const newStartIndex = page - 1;
    setPageState((oldPageState) => ({
      ...oldPageState,
      startIndex: newStartIndex,
      currentPage: page
    }));
  };

  const styles = `
  .title:hover {
    color: #0287d0;
    cursor: pointer;
  }
`;

  useEffect(() => {
    const fetchData = async () => {
      setTimeout(async () => {
        try {
          const tinTucNew = await getLatest4News();
          setTinTucNew(tinTucNew.data);
        } catch (error) {
          console.error(error);
        }
      }, 800);
      setTimeout(async () => {
        try {
          const getAllTintuc = await getAllTinTuc();
          setTinTucAll(getAllTintuc.data);
          const loaiTinData = await getAllLoaiTinTuc();
          setLoaiTin(loaiTinData.data);
        } catch (error) {
          console.error(error);
        }
      }, 1800);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setPageState((old) => ({ ...old, isLoading: true }));
      const params = await createSearchParams(pageState);
      const response = await getSearchTinTuc(params);
      const data = response.data;
      if (data) {
        setPageState((old) => ({
          ...old,
          total: data.totalRow || 0
        }));
        if (data && data.tinTuc.length > 0) {
          setTinTuc(data.tinTuc);
        }
      }
    };
    fetchData();
  }, [pageState.startIndex]);

  return (
    <>
      <style>{styles}</style>
      <Container sx={{ paddingBottom: 1, backgroundColor: '#FFFFFF', mb: '10px', minHeight: `calc(100vh - 285px)` }}>
        <Grid container mt={1} spacing={2}>
          <Grid item lg={8.5} md={8.5} sm={12} xs={12}>
            {tinTucNew &&
              tinTucNew.slice(0, 1).map((tinTuc) => (
                <Grid key={tinTuc.id} container columnSpacing={3} onClick={() => handleBoxClick(tinTuc.id)}>
                  <Grid item xs={7}>
                    <img
                      src={`${urlimg}${tinTuc.hinhAnh}`}
                      alt="tin tức"
                      style={{ width: '100%', height: '250px', objectFit: 'cover', cursor: 'pointer' }} // Thêm thuộc tính style cho ảnh
                    />
                  </Grid>
                  <Grid item xs={5} sx={{ bgcolor: '#F0F0F0' }} mb={'5px'}>
                    <Typography className="title" variant="h4" sx={{ mt: '20px' }}>
                      {tinTuc.tieuDe}
                    </Typography>
                    <Typography
                      sx={{
                        mt: '10px',
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: '7', // Limit to 3 lines
                        WebkitBoxOrient: 'vertical',
                        whiteSpace: 'normal' // Ensure text wraps within the 3 lines }} variant="body1" style={{
                      }}
                    >
                      {tinTuc.moTaNgan}
                    </Typography>
                  </Grid>
                </Grid>
              ))}
            <Divider height={'2px'} sx={{ mb: '12px', mt: '7px' }} />
            <Grid container columnSpacing={3}>
              {tinTucNew &&
                tinTucNew.slice(1, 4).map((tinTuc) => (
                  <Grid key={tinTuc.id} item xs={4} onClick={() => handleBoxClick(tinTuc.id)} mt={isSmallScreen ? 1 : ''}>
                    <img
                      src={`${urlimg}${tinTuc.hinhAnh}`}
                      alt="tin tức"
                      style={{ width: '100%', height: '120px', objectFit: 'cover', cursor: 'pointer' }}
                    />
                    <Grid item>
                      <Typography
                        className="title"
                        variant="h5"
                        style={{
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
          <Grid item lg={3.5} md={3.5} sm={12} xs={12}>
            <Grid item xs={12} sx={{ bgcolor: '#0287d0' }}>
              <Typography variant="h4" sx={{ color: '#FFFFFF', padding: '8px 0 8px 10px' }}>
                {t('Tin tức mới')}
              </Typography>
            </Grid>
            <Grid item xs={12} sx={{ border: '1px solid lightgrey' }}>
              <Splide
                options={{
                  type: 'loop',
                  direction: 'ttb',
                  drag: 'free',
                  arrows: false,
                  pagination: false,
                  perPage: 5,
                  height: '420px',
                  autoScroll: {
                    pauseOnHover: true,
                    pauseOnFocus: true,
                    speed: 1
                  }
                }}
                extensions={{ AutoScroll }}
              >
                {tinTucAll.map((tintuc, index) => (
                  <>
                    <SplideSlide
                      style={{
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        height: 'auto'
                      }}
                      key={index}
                      onClick={() => handleBoxClick(tintuc && tinTucAll ? tintuc.id : '')}
                    >
                      <Grid container columnSpacing={2} justifyContent={'center'}>
                        <Grid item xs={3.7}>
                          <img
                            src={`${urlimg}${tintuc.hinhAnh}`}
                            alt="tin tức"
                            style={{ width: '100%', height: '50px', objectFit: 'cover' }}
                          />
                        </Grid>
                        <Grid item xs={7.7}>
                          <Typography
                            className="title"
                            variant="h6"
                            style={{
                              marginTop: '-4px',
                              overflow: 'hidden',
                              display: '-webkit-box',
                              WebkitLineClamp: '3',
                              WebkitBoxOrient: 'vertical',
                              whiteSpace: 'normal'
                            }}
                          >
                            {tinTucAll && tintuc ? tintuc.tieuDe : ''}
                          </Typography>
                        </Grid>
                      </Grid>
                    </SplideSlide>
                  </>
                ))}
              </Splide>
            </Grid>
          </Grid>
        </Grid>
        <Divider sx={{ mt: 3, mb: 2 }} />
        <Grid container mt={2} spacing={2}>
          <Grid item lg={8.5} md={8.5} sm={12} xs={12}>
            {tinTuc.map((tinTuc, index) => (
              <div key={tinTuc.id}>
                <Grid container spacing={2}>
                  <Grid
                    item
                    xs={isSmallScreen ? 12 : 4}
                    style={{ height: '170px' }}
                    onClick={() => handleBoxClick(tinTuc ? tinTuc.id : '')}
                  >
                    <img
                      src={`${urlimg}${tinTuc.hinhAnh}`}
                      alt={tinTuc.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        cursor: 'pointer'
                      }}
                    />
                  </Grid>
                  <Grid item xs={isSmallScreen ? 12 : 8}>
                    <Grid item xs={12} style={{ fontSize: '12px', fontStyle: 'italic' }}>
                      {formatDateTinTuc(tinTuc.ngayCapNhat || tinTuc.ngayTao)}
                    </Grid>
                    <Grid
                      item
                      className="title"
                      xs={12}
                      mr={1}
                      sx={{ fontSize: '16px', fontWeight: 'bold', fontFamily: 'unset', mt: '3px' }}
                      onClick={() => handleBoxClick(tinTuc ? tinTuc.id : '')}
                    >
                      {tinTuc.tieuDe}
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      mr={1}
                      sx={{
                        fontSize: '15px',
                        fontFamily: 'unset',
                        mt: '5px',
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: '5',
                        WebkitBoxOrient: 'vertical',
                        whiteSpace: 'normal'
                      }}
                    >
                      {tinTuc.moTaNgan}
                    </Grid>
                  </Grid>
                </Grid>
                {index !== tinTuc.length - 1 && <Divider sx={{ mt: 2, mb: 2, mr: 2 }} />}
              </div>
            ))}
            <Grid container justifyContent={'center'} mt={2}>
              <Grid item>
                <Pagination
                  color="info"
                  page={pageState.currentPage ? pageState.currentPage : 1}
                  onChange={(event, page) => handlePageChange(page)} // Sử dụng page ở đây
                  count={Math.floor(
                    pageState.total % pageState.pageSize === 0
                      ? Math.floor(pageState.total / pageState.pageSize)
                      : Math.floor(pageState.total / pageState.pageSize + 1)
                  )}
                  showFirstButton
                  showLastButton
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item lg={3.5} md={3.5} sm={12} xs={12}>
            <Grid item xs={12} sx={{ bgcolor: '#0287d0' }}>
              <Typography variant="h4" sx={{ color: '#FFFFFF', padding: '8px 0 8px 10px' }}>
                {t('danhmuctintuc')}
              </Typography>
            </Grid>
            <Grid item xs={12} sx={{ border: '1px solid lightgrey' }} pb={1}>
              {loaiTin
                ? loaiTin.map((loaiTin, index) => {
                    return (
                      <Grid container key={index}>
                        <Typography
                          variant={'h5'}
                          className="title"
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
            <Grid item xs={12} sx={{ bgcolor: '#0287d0' }} mt={2}>
              <Typography variant="h4" sx={{ color: '#FFFFFF', padding: '8px 0 8px 10px' }}>
                {t('Tin tức tổng hợp')}
              </Typography>
            </Grid>
            <Grid item xs={12} sx={{ border: '1px solid lightgrey' }}>
              <Splide
                options={{
                  type: 'loop',
                  direction: 'ttb',
                  drag: 'free',
                  arrows: false,
                  pagination: false,
                  perPage: 5,
                  height: '420px',
                  autoScroll: {
                    pauseOnHover: true,
                    pauseOnFocus: true,
                    speed: 1
                  }
                }}
                extensions={{ AutoScroll }}
              >
                {tinTucAll.map((tintuc, index) => (
                  <>
                    <SplideSlide
                      style={{
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        height: 'auto'
                      }}
                      key={index}
                      onClick={() => handleBoxClick(tintuc && tinTucAll ? tintuc.id : '')}
                    >
                      <Grid container columnSpacing={2} justifyContent={'center'}>
                        <Grid item xs={3.7}>
                          <img
                            src={`${urlimg}${tintuc.hinhAnh}`}
                            alt="tin tức"
                            style={{ width: '100%', height: '50px', objectFit: 'cover' }}
                          />
                        </Grid>
                        <Grid item xs={7.7}>
                          <Typography
                            className="title"
                            variant="h6"
                            style={{
                              marginTop: '-4px',
                              overflow: 'hidden',
                              display: '-webkit-box',
                              WebkitLineClamp: '3',
                              WebkitBoxOrient: 'vertical',
                              whiteSpace: 'normal'
                            }}
                          >
                            {tinTucAll && tintuc ? tintuc.tieuDe : ''}
                          </Typography>
                        </Grid>
                      </Grid>
                    </SplideSlide>
                  </>
                ))}
              </Splide>
            </Grid>
          </Grid>
          <Grid item xs={12} mt={2}>
            <Divider />
          </Grid>
        </Grid>
        <Grid container rowSpacing={2} columnSpacing={5} mt={0.5} mb={2}>
          {loaiTin.map((loaitin, index1) => {
            const tinTucInThisCategory = tinTucAll.filter((tintuc) => tintuc.idLoaiTinTuc === loaitin.id);
            if (tinTucInThisCategory.length > 0) {
              return (
                <Grid item xs={12} sm={6} lg={4} key={index1}>
                  <Grid item xs={12}>
                    <Typography
                      className="title"
                      onClick={() => DanhmucTintuc(loaitin.id, loaitin.tieuDe)}
                      variant={isSmallScreen ? 'h3' : 'h2'}
                      component="h3"
                    >
                      {loaitin.tieuDe}
                    </Typography>
                    <Divider sx={{ height: '3px', bgcolor: '#0287d0' }}></Divider>
                    {tinTucInThisCategory.slice(0, 3).map((tintuc, index2) => (
                      <>
                        <div key={index2}>
                          {index2 === 0 ? (
                            <div style={{ cursor: 'pointer', paddingTop: '10px' }}>
                              <Grid
                                item
                                xs={12}
                                container
                                style={{ cursor: 'pointer' }}
                                onClick={() => handleBoxClick(tintuc ? tintuc.id : '')}
                                mt={isSmallScreen ? 1 : ''}
                              >
                                <Grid item xs={12}>
                                  <img
                                    src={`${urlimg}${tintuc.hinhAnh}`}
                                    alt="tin tức"
                                    style={{
                                      width: '100%',
                                      height: '200px',
                                      objectFit: 'cover',
                                      marginRight: '16px'
                                    }}
                                  />
                                </Grid>
                                <Grid
                                  item
                                  xs={12}
                                  mt={'5px'}
                                  sx={{
                                    overflow: 'hidden',
                                    display: '-webkit-box',
                                    WebkitLineClamp: '2',
                                    WebkitBoxOrient: 'vertical',
                                    whiteSpace: 'normal'
                                  }}
                                >
                                  <Typography className="title" variant="h4">
                                    {tintuc.tieuDe}
                                  </Typography>
                                </Grid>
                              </Grid>
                            </div>
                          ) : (
                            <>
                              <Divider sx={{ mt: 1 }} />
                              <Typography
                                className="title"
                                onClick={() => handleBoxClick(tintuc ? tintuc.id : '')}
                                style={{
                                  overflow: 'hidden',
                                  display: '-webkit-box',
                                  WebkitLineClamp: '2',
                                  WebkitBoxOrient: 'vertical',
                                  whiteSpace: 'normal'
                                }}
                                mt={1}
                                variant="h5"
                              >
                                {tintuc.tieuDe}
                              </Typography>
                            </>
                          )}
                        </div>
                      </>
                    ))}
                  </Grid>
                </Grid>
              );
            }
            return null; // Skip displaying if there are no news articles in this category
          })}
        </Grid>
      </Container>
      <BackToTop />
      {/* </div> */}
    </>
  );
}
