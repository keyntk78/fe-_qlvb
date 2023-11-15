import { Dialog, DialogContent, DialogTitle, Slide, IconButton, Tooltip, Grid, Typography, useScrollTrigger, Zoom } from '@mui/material';
import { forwardRef } from 'react';

import {
  IconAlertCircle,
  IconEdit,
  IconList,
  IconEyeCheck,
  IconPlus,
  IconX,
  IconHandMove,
  IconFileExport,
  IconFileImport,
  IconSend,
  IconCircleCheck,
  IconArrowBack,
  IconBookUpload,
  IconArchive,
  IconBook,
  IconEye,
  IconFileCertificate,
  IconPrinter,
  IconChecks,
  IconEyeOff,
  IconCertificate,
  IconCircleChevronUp,
  IconSettings,
  IconUsers,
  IconHistory,
  IconCheckbox,
  IconCurrencyEuro,
  IconCertificate2,
  IconBellPlus
} from '@tabler/icons';
import AnimateButton from 'components/extended/AnimateButton';
import { setOpenPopup, setOpenProfile, setOpenSubPopup, setOpenSubSubPopup } from '../../store/actions';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} timeout={500} />;
});

export default function Popup(props) {
  const { t } = useTranslation();
  const { type, form, title, children, openPopup, maxWidth, bgcolor, height, icon: Icon } = props;
  const dispatch = useDispatch();
  const trigger = useScrollTrigger({ disableHysteresis: true });

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCloseClick = () => {
    if (type === 'subpopup') {
      dispatch(setOpenSubPopup(false));
    } else if (type === 'subsubpopup') {
      dispatch(setOpenSubSubPopup(false));
    } else if (type === 'profile') {
      dispatch(setOpenProfile(false));
    } else {
      dispatch(setOpenPopup(false));
    }
  };

  return (
    <div>
      <Dialog
        open={openPopup}
        TransitionComponent={Transition}
        keepMounted
        scroll="body"
        fullWidth={true}
        maxWidth={maxWidth || 'sm'}
        style={{ mb: '10%', minHeight: '600px' }}
      >
        <DialogTitle bgcolor={bgcolor} display={'flex'}>
          <Grid container spacing={1} direction="row">
            <Grid item color={'#fff'} sx={{ fontSize: '20px' }}>
              <Typography variant="container" sx={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ order: 1, marginLeft: '5px' }}>{title}</span>
                {form === 'add' ? (
                  <IconPlus sx={{ order: 2 }} />
                ) : form === 'notify' ? (
                  <IconBellPlus sx={{ order: 2 }} />
                ) : form === 'edit' ? (
                  <IconEdit sx={{ order: 2 }} />
                ) : form === 'permission' ? (
                  <IconList sx={{ order: 2 }} />
                ) : form === 'action' ? (
                  <IconHandMove sx={{ order: 2 }} />
                ) : form === 'permission-group' ? (
                  <IconUsers sx={{ order: 2 }} />
                ) : form === 'import' ? (
                  <IconFileImport sx={{ order: 2 }} />
                ) : form === 'config' ? (
                  <IconSettings sx={{ order: 2 }} />
                ) : form === 'export' ? (
                  <IconFileExport sx={{ order: 2 }} />
                ) : form === 'delete' || form === 'deActive' || form === 'deleteall' || form === 'reset' ? (
                  <IconAlertCircle sx={{ order: 2 }} />
                ) : form === 'detail' ? (
                  <IconEyeCheck sx={{ order: 2 }} />
                ) : form === 'detaildonyeucau' ? (
                  <IconCurrencyEuro sx={{ order: 2 }} />
                ) : form === 'detailPhatBang' ? (
                  <IconEyeCheck sx={{ order: 2 }} />
                ) : form === 'phatbang' ? (
                  <IconCertificate sx={{ order: 2 }} />
                ) : form === 'gui' || form === 'guiall' ? (
                  <IconSend sx={{ order: 2 }} />
                ) : form === 'duyet' || form === 'duyetall' ? (
                  <IconCircleCheck sx={{ order: 2 }} />
                ) : form === 'tralai' ? (
                  <IconArrowBack sx={{ order: 2 }} />
                ) : form === 'tralailuachon' ? (
                  <IconArrowBack sx={{ order: 2 }} />
                ) : form === 'vaoso' ? (
                  <IconBookUpload sx={{ order: 2 }} />
                ) : form === 'huyphoi' ? (
                  <IconArchive sx={{ order: 2 }} />
                ) : form === 'socapbang' ? (
                  <IconBook sx={{ order: 2 }} />
                ) : form === 'xemtruoc' ? (
                  <IconEye sx={{ order: 2 }} />
                ) : form === 'capbang' ? (
                  <IconFileCertificate sx={{ order: 2 }} />
                ) : form === 'capbangall' ? (
                  <IconFileCertificate sx={{ order: 2 }} />
                ) : form === 'inbang' ? (
                  <IconPrinter sx={{ order: 2 }} />
                ) : form === 'intungnguoi' ? (
                  <IconPrinter sx={{ order: 2 }} />
                ) : form === 'ingcnall' ? (
                  <IconPrinter sx={{ order: 2 }} />
                ) : form === 'xacnhanin' ? (
                  <IconChecks sx={{ order: 2 }} />
                ) : form === 'xacnhanphatbansao' ? (
                  <IconChecks sx={{ order: 2 }} />
                ) : form === 'show' ? (
                  <IconEye sx={{ order: 2 }} />
                ) : form === 'xemlichsu' ? (
                  <IconHistory sx={{ order: 2 }} />
                ) : form === 'xemlichsuhuybo' ? (
                  <IconHistory sx={{ order: 2 }} />
                ) : form === 'xacminh' ? (
                  <IconCheckbox sx={{ order: 2 }} />
                ) : form === 'xacminhnhieunguoi' ? (
                  <IconCheckbox sx={{ order: 2 }} />
                ) : form === 'addlist' ? (
                  <IconCheckbox sx={{ order: 2 }} />
                ) : form === 'hide' ? (
                  <IconEyeOff sx={{ order: 2 }} />
                ) : form === 'thuhoi' ? (
                  <IconArrowBack sx={{ order: 2 }} />
                ) : form === 'chinhsuavbcc' ? (
                  <IconEdit sx={{ order: 2 }} />
                ) : form === 'caplaivbcc' ? (
                  <IconCertificate2 sx={{ order: 2 }} />
                ) : form === 'phuluc' ? (
                  <IconBook sx={{ order: 2 }} />
                ) : form === 'permissionGroup' ? (
                  <IconUsers sx={{ order: 2 }} />
                ) : Icon ? (
                  <Icon sx={{ order: 2 }} />
                ) : (
                  ''
                )}
              </Typography>
            </Grid>
            <Grid item sx={{ ml: 'auto' }}>
              <AnimateButton>
                <Tooltip title={t('button.close')} placement="bottom">
                  <IconButton size="small" style={{ color: 'white' }} onClick={handleCloseClick}>
                    <IconX fontSize="large" />
                  </IconButton>
                </Tooltip>
              </AnimateButton>
            </Grid>
          </Grid>
        </DialogTitle>
        <DialogContent style={{ height: `${height}px` }}>{children}</DialogContent>
      </Dialog>
      <Zoom in={trigger}>
        <IconButton onClick={handleClick} style={{ position: 'fixed', bottom: 35, right: 15 }}>
          <IconCircleChevronUp size={40} />
        </IconButton>
      </Zoom>
    </div>
  );
}
