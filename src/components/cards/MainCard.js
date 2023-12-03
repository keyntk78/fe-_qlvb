import PropTypes from 'prop-types';
import { forwardRef } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Card, CardContent, CardHeader, Divider, Grid, IconButton, Pagination, Stack, Tooltip, Typography } from '@mui/material';
import AnimateButton from 'components/extended/AnimateButton';
import { IconQuestionMark } from '@tabler/icons';
import { useDispatch, useSelector } from 'react-redux';
import { setOpenInstruct } from 'store/actions';
import Popup from 'components/controls/popup';
import { openInstructSelector, urlHuongDanSelector } from 'store/selectors';
import { Document, Page } from 'react-pdf';
import { useState } from 'react';
import ExitButton from 'components/button/ExitButton';
import config from 'config';
import { useEffect } from 'react';

// constant
const headerSX = {
  '& .MuiCardHeader-action': { mr: 0 }
};

// ==============================|| CUSTOM MAIN CARD ||============================== //

const MainCard = forwardRef(
  (
    {
      border = true,
      boxShadow,
      children,
      content = true,
      contentClass = '',
      contentSX = {},
      darkTitle,
      secondary,
      shadow,
      sx = {},
      title,
      hideInstruct = false,
      ...others
    },
    ref
  ) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const openInstruct = useSelector(openInstructSelector);
    const urlHuongDan = useSelector(urlHuongDanSelector);

    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [url, setUrl] = useState('');

    useEffect(() => {
      const url = urlHuongDan ? config.urlImages + urlHuongDan : '';
      setUrl(url);
    }, [urlHuongDan]);

    const onDocumentLoadSuccess = ({ numPages }) => {
      setNumPages(numPages);
    };

    const handlePageChange = (event, value) => {
      setPageNumber(value);
    };

    return (
      <>
        <Card
          ref={ref}
          {...others}
          sx={{
            border: border ? '1px solid' : 'none',
            borderColor: theme.palette.primary[200] + 25,
            ':hover': {
              boxShadow: boxShadow ? shadow || '0 2px 14px 0 rgb(32 40 45 / 8%)' : 'inherit'
            },
            ...sx
          }}
        >
          <Grid container alignItems="center">
            <Grid item>
              {/* card header and title */}
              {title && <CardHeader sx={headerSX} title={darkTitle ? <Typography variant="h3">{title}</Typography> : title} />}
            </Grid>
            <Grid item sx={{ ml: '-15px' }}>
              {/* button hướng dẫn */}
              {url && !hideInstruct && (
                <>
                  <AnimateButton>
                    <Tooltip title={'Hướng dẫn'} placement="bottom">
                      <IconButton
                        style={{
                          fontWeight: 'bold',
                          backgroundColor: '#2196F3',
                          color: 'white'
                        }}
                        onClick={() => dispatch(setOpenInstruct(true))}
                        size="small"
                      >
                        <IconQuestionMark color="white" size="12" />
                      </IconButton>
                    </Tooltip>
                  </AnimateButton>
                </>
              )}
            </Grid>
            <Grid item sx={{ ml: 'auto', mr: '2%' }}>
              {secondary}
            </Grid>
          </Grid>
          {/* content & header divider */}
          {title && <Divider />}

          {/* card content */}
          {content && (
            <CardContent sx={contentSX} className={contentClass}>
              {children}
            </CardContent>
          )}
          {!content && children}
        </Card>
        <Popup form="instruct" type="instruct" title="Hướng dẫn" openPopup={openInstruct} bgcolor={'#2196F3'} maxWidth={'md'}>
          <Grid container justifyContent="center" textAlign={'center'}>
            <Grid item mt={2}>
              <Document file={url} onLoadSuccess={onDocumentLoadSuccess}>
                <Page pageNumber={pageNumber} renderTextLayer={false} renderAnnotationLayer={false} />
              </Document>
            </Grid>
            {numPages > 1 && (
              <Grid item xs={12} container justifyContent="center">
                <Grid item>
                  <Stack spacing={2}>
                    <Pagination count={numPages} page={pageNumber} onChange={handlePageChange} color="primary" />
                  </Stack>
                </Grid>
              </Grid>
            )}
          </Grid>
          <Grid item xs={12} container spacing={2} mt={1} justifyContent="flex-end">
            <Grid item>
              <ExitButton type="instruct" />
            </Grid>
          </Grid>
        </Popup>
      </>
    );
  }
);

MainCard.propTypes = {
  border: PropTypes.bool,
  boxShadow: PropTypes.bool,
  children: PropTypes.node,
  content: PropTypes.bool,
  hideInstruct: PropTypes.bool,
  contentClass: PropTypes.string,
  contentSX: PropTypes.object,
  darkTitle: PropTypes.bool,
  secondary: PropTypes.oneOfType([PropTypes.node, PropTypes.string, PropTypes.object]),
  shadow: PropTypes.string,
  sx: PropTypes.object,
  title: PropTypes.oneOfType([PropTypes.node, PropTypes.string, PropTypes.object])
};

export default MainCard;
