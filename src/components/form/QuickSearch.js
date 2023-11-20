import React from 'react';
import { FormControl, InputLabel, Input, InputAdornment, IconButton } from '@mui/material';
import IconSearch from '@mui/icons-material/Search';
import IconX from '@mui/icons-material/Close';

const QuickSearch = ({ value, onChange, onSearch }) => {
  const handleClear = () => {
    onChange(''); // Clear the input value
  };

  const handleFocus = () => {
    if (value == null || value === '') {
      onChange(''); // Set the input value to an empty string
    }
  };

  return (
    <FormControl fullWidth variant="standard" size="small">
      {value == null ? <InputLabel shrink={false}>Tìm kiếm</InputLabel> : <InputLabel>Tìm kiếm</InputLabel>}
      <Input
        id="search-input"
        value={value == null ? '' : value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            onSearch();
          }
        }}
        onFocus={handleFocus}
        endAdornment={
          <InputAdornment position="end">
            {value && (
              <IconButton onClick={handleClear} edge="end" sx={{ ml: '10px' }}>
                <IconX />
              </IconButton>
            )}
            <IconButton onClick={onSearch} edge="end">
              <IconSearch />
            </IconButton>
          </InputAdornment>
        }
      />
    </FormControl>
  );
};

export default QuickSearch;
