import { Grid } from '@mui/material';
import ExitButton from 'components/button/ExitButton';
import MuiTypography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';

function HuongDan() {
  const { t } = useTranslation();

  return (
    <div style={{ textAlign: 'start' }}>
      <MuiTypography variant="body1" m={2}>
        {`${t('-> Thêm trường cũ tại danh mục đơn vị trường')}`}
      </MuiTypography>
      <MuiTypography variant="body1" m={2}>
        {`${t('-> Thêm danh mục tốt nghiệp')}`}
      </MuiTypography>
      <MuiTypography variant="body1" m={2}>
        {`${t('-> Thêm sổ gốc cũ')}`}
      </MuiTypography>
      <MuiTypography variant="body1" m={2}>
        {`${t('-> Chọn trường cũ, trường mới')}`}
      </MuiTypography>
      <MuiTypography variant="body1" m={2}>
        {`${t('-> Nhấn nút chuyển đổi')}`}
      </MuiTypography>
      <Grid container spacing={1} direction="row" justifyContent="flex-end" my={2}>
        <Grid item>
          <ExitButton />
        </Grid>
      </Grid>
    </div>
  );
}
export default HuongDan;
