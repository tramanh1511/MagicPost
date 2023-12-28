import React from 'react';
import { Button } from '@mui/material';

const Buttonme = ({ title, onClick }) => {
  return (
    <Button
      variant="contained"
      onClick={onClick}
      style={{ backgroundColor: "#4CAF50", color: "#fff" }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#003e29'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#4CAF50'}
      >
      {title}
    </Button>
  );
};

export default Buttonme;
