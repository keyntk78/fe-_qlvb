import { MenuItem, Autocomplete, TextField, Grid } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
// import CancelIcon from '@mui/icons-material/Cancel';
import PropTypes from 'prop-types';

const MultiSelectForm = ({ isFirst, data, name, label, formik }) => {
  return (
    <Grid item xs={12} style={isFirst ? {} : { marginTop: '10px' }}>
      <Autocomplete
        fullWidth
        multiple
        id={name}
        name={name}
        options={data}
        value={formik.values[name] || []}
        onChange={(event, value) => {
          formik.setFieldValue(name, value);
        }}
        onBlur={formik.handleBlur}
        getOptionLabel={(option) => option.name}
        defaultValue={[]}
        disableCloseOnSelect
        renderOption={(props, option, { selected }) => (
          <MenuItem key={option.id} value={option.id} sx={{ justifyContent: 'space-between' }} {...props}>
            {option.name}
            {selected ? <CheckIcon color="info" /> : null}
          </MenuItem>
        )}
        renderInput={(params) => <TextField {...params} variant="standard" label={label} placeholder={label} />}
      />
    </Grid>
  );
};

MultiSelectForm.propTypes = {
  isFirst: PropTypes.bool,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired
    })
  ).isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  formik: PropTypes.object.isRequired
};

export default MultiSelectForm;
