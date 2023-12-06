import * as React from 'react';
import { useScrollTrigger, Zoom, IconButton } from '@mui/material';
import { IconCircleChevronUp } from '@tabler/icons';

const BackToTop = () => {
  const trigger = useScrollTrigger({ disableHysteresis: true });

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Zoom in={trigger}>
      <IconButton onClick={handleClick} style={{ position: 'fixed', bottom: 35, right: 15 }}>
        <IconCircleChevronUp size={40} />
      </IconButton>
    </Zoom>
  );
};

export default BackToTop;
