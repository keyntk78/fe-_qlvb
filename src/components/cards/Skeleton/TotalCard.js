// material-ui
import { Card, CardContent, Grid } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';

// project imports
import { gridSpacing } from 'store/constant';

// ==============================|| SKELETON TOTAL GROWTH BAR CHART ||============================== //

const TotalCard = ({ type }) => (
  <Card>
    <CardContent>
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Grid container alignItems="center" justifyContent="space-between" spacing={gridSpacing}>
            <Grid item xs zeroMinWidth>
              <Grid container spacing={1}>
                <Grid item>
                  <Skeleton variant="rectangular" height={40} width={100} />
                </Grid>
                <Grid item>
                  <Skeleton variant="rectangular" height={40} width={200} />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        {Array.from({ length: type == true ? 4 : 6 }).map((_, index) => (
          <Grid item xs={12} sm={6} md={type == true ? 3 : 4} key={index}>
            <Skeleton variant="rectangular" height={120} />
          </Grid>
        ))}
      </Grid>
    </CardContent>
  </Card>
);

export default TotalCard;
