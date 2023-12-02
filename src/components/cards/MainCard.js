import PropTypes from 'prop-types';
import { forwardRef } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Card, CardContent, CardHeader, Divider, Grid, IconButton, Tooltip, Typography } from '@mui/material';
import AnimateButton from 'components/extended/AnimateButton';
import { IconQuestionMark } from '@tabler/icons';
import { useDispatch, useSelector } from 'react-redux';
import { setOpenInstruct } from 'store/actions';
import Popup from 'components/controls/popup';
import { openInstructSelector } from 'store/selectors';
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';
import { useState } from 'react';

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
      instruct,
      ...others
    },
    ref
  ) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const openInstruct = useSelector(openInstructSelector);
    const [numPages, setNumPages] = useState(null);

    function onDocumentSuccess({ numPages }) {
      setNumPages(numPages);
    }

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
              {instruct && (
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
          <Document file="/instruct_file/test.pdf" onLoadSuccess={onDocumentSuccess}>
            {Array(numPages)
              .fill()
              .map((_, i) => (
                <Page key={i} pageNumber={i + 1}></Page>
              ))}
          </Document>
        </Popup>
      </>
    );
  }
);

MainCard.propTypes = {
  border: PropTypes.bool,
  instruct: PropTypes.bool,
  boxShadow: PropTypes.bool,
  children: PropTypes.node,
  content: PropTypes.bool,
  contentClass: PropTypes.string,
  contentSX: PropTypes.object,
  darkTitle: PropTypes.bool,
  secondary: PropTypes.oneOfType([PropTypes.node, PropTypes.string, PropTypes.object]),
  shadow: PropTypes.string,
  sx: PropTypes.object,
  title: PropTypes.oneOfType([PropTypes.node, PropTypes.string, PropTypes.object])
};

export default MainCard;
