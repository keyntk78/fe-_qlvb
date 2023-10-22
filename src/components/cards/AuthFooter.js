// material-ui
import { Link, Typography, Stack } from '@mui/material';

// ==============================|| FOOTER - AUTHENTICATION 2 & 3 ||============================== //

const AuthFooter = () => (
  <Stack direction="row" justifyContent="space-between" mt={1} mb={-2}>
    <Typography variant="subtitle3" component={Link} href="https://quanlyvanbang.cenit.vn" target="_blank" underline="hover">
      VNPT CenIT
    </Typography>
    <Typography variant="subtitle3" component={Link} href="https://quanlyvanbang.cenit.vn" target="_blank" underline="hover">
      &copy; codedthemes.com
    </Typography>
  </Stack>
);

export default AuthFooter;
