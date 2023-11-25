import ResetButton from 'components/button/ExitButton';
import { Grid, Typography } from '@mui/material';
const ThongBaoDonyeuCau = ({ thongbao }) => {
  return (
    <Grid container xs={12} mt={2}>
      <Grid item>
        <Typography variant="h4">
          {'Đơn yêu cầu của học sinh ' + thongbao.data.hoTen + ' đã thêm thành công với mã đơn yêu cầu: ' + thongbao.data.maDonYeuCau}
        </Typography>
      </Grid>
      <Grid item>
        <Typography variant="h6">{'Mã đơn yêu cầu dùng để tra cứu, theo dõi đơn yêu cầu'}</Typography>
      </Grid>
      <Grid item xs={12} container spacing={2} justifyContent="flex-end" mt={1}>
        <Grid item>
          <ResetButton />
        </Grid>
      </Grid>
    </Grid>
  );
};
export default ThongBaoDonyeuCau;
