// material-ui
import { Card, CardContent, Grid } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';

// project imports
import { gridSpacing } from 'store/constant';

// ==============================|| SKELETON TOTAL GROWTH BAR CHART ||============================== //

const TotalPieChart = () => (
  <Card>
    <CardContent>
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Grid container alignItems="center" justifyContent="space-between" spacing={gridSpacing}>
            <Grid item xs zeroMinWidth>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Skeleton variant="text" />
                </Grid>
                <Grid item xs={12}>
                  <Skeleton variant="rectangular" height={20} />
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Skeleton variant="rectangular" height={50} width={100} />
            </Grid>
          </Grid>
        </Grid>
        <Grid item container xs={12} justifyContent={'center'}>
          <Grid item>
            <Skeleton variant="rectangular" width={250} height={250} style={{ borderRadius: '50%' }} />
          </Grid>
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);

export default TotalPieChart;
