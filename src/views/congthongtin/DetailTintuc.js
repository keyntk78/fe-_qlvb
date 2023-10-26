import { useLocation, useNavigate } from 'react-router-dom';
import { Container, useTheme } from '@mui/system';
import { useState } from 'react';
import { useEffect } from 'react';
import { getAllLoaiTinTuc, getLatest4News, getTinTucById } from 'services/congthongtinService';
import { Grid, Typography, useMediaQuery } from '@mui/material';
import config from 'config';
import { useTranslation } from 'react-i18next';
import { IconPoint } from '@tabler/icons';
import BackToTop from 'components/scroll/BackToTop';
import { formatDateTinTuc } from 'utils/formatDate';

const styles = `
.title:hover {
  color: #0287d0;
  cursor: pointer;
}
`;

export default function DetailDonyeucau() {
  const theme = useTheme();
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();
  const formData = location.state.id;
  const { t } = useTranslation();

  const [tinTuc, setTinTuc] = useState([]);
  const [loaiTin, setLoaiTin] = useState([]);
  const [tinTucNew, setTinTucNew] = useState([]);
  const urlimg = config.urlFile + 'TinTuc/';

  useEffect(() => {
    const fetchData = async () => {
      const datatintuc = await getTinTucById(formData);

      setTinTuc(datatintuc.data);

      const tinTucNew = await getLatest4News();
      setTinTucNew(tinTucNew.data);

      const loaiTinData = await getAllLoaiTinTuc();
      setLoaiTin(loaiTinData.data);
    };
    fetchData();
  }, []);

  const handleBoxClick = async (id) => {
    if (id) {
      const datatintuc = await getTinTucById(id); // Fetch tin tức tương ứng với id
      setTinTuc(datatintuc.data); // Cập nhật nội dung tin tức mới
    }
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

  return (
    <>
      <style>{styles}</style>
      <Container sx={{ paddingBottom: 1, margin: 'auto', minHeight: `calc(100vh - 285px)` }}>
        <Grid container spacing={2} mt={1}>
          <Grid item xs={12} sm={12} md={8.5} lg={8.5}>
            <Grid container columnSpacing={3}>
              <Grid item xs={12}>
                <Typography variant={isSmallScreen ? 'h3' : 'h2'}>{tinTuc ? tinTuc.tieuDe : ''}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography
                  variant={isSmallScreen ? 'h6' : 'h5'}
                  component="h4"
                  paddingTop={2}
                  style={{ display: 'flex', alignItems: 'center' }}
                >
                  <Typography variant="h4" sx={{ color: '#0287d0' }}>
                    {tinTuc ? tinTuc.tenLoaiTinTuc : ''}|
                  </Typography>
                  <Typography variant="subtitle2" sx={{ fontStyle: 'italic', paddingTop: '2.5px' }}>
                    {tinTuc && tinTuc.ngayTao ? ` ${formatDateTinTuc(tinTuc.ngayTao)}` : ''}
                  </Typography>
                </Typography>
                <Grid item xs={12}>
                  <Typography variant={isSmallScreen ? 'h3' : 'h2'} component="h2" paddingTop={2} sx={{ paddingY: 2, flex: 1 }}>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: tinTuc ? tinTuc.noiDung : ''
                      }}
                      style={{ maxWidth: '100%', height: 'auto' }}
                    />
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={12} md={3.5} lg={3.5} pb={19}>
            <Grid container sx={{ top: '70px' }}>
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
            <Grid container mt={2} sx={{ top: '294px', zIndex: 999 }} bgcolor={'#FFFFFF'}>
              <Grid item xs={12} sx={{ bgcolor: '#0287d0' }}>
                <Typography variant="h4" sx={{ color: '#FFFFFF', padding: '8px 0 8px 10px' }}>
                  {t('tinmoinhat')}
                </Typography>
              </Grid>
              <Grid item xs={12} sx={{ border: '1px solid lightgrey' }} pb={1}>
                {tinTucNew.map((tinTuc, index) => (
                  <Grid key={index} container columnSpacing={4} justifyContent={'center'} onClick={() => handleBoxClick(tinTuc.id)} mt={2}>
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
