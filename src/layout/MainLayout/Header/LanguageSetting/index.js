import React from 'react';
import { Select, MenuItem, FormControl } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedLanguage } from 'store/actions';
import { selectedLanguageSelector } from 'store/selectors';

const LanguageSetting = () => {
  const selectedLanguage = useSelector(selectedLanguageSelector);
  const dispatch = useDispatch();

  const handleLanguageChange = (event) => {
    dispatch(setSelectedLanguage(event.target.value));
  };

  return (
    <FormControl sx={{ minWidth: 60 }}>
      <Select
        value={selectedLanguage}
        onChange={handleLanguageChange}
        sx={{
          border: 0
        }}
      >
        <MenuItem value="vi">vi</MenuItem>
        <MenuItem value="en">en</MenuItem>
      </Select>
    </FormControl>
  );
};

export default LanguageSetting;
