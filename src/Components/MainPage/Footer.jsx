import React from 'react';
import { Box, Typography, useMediaQuery} from '@mui/material';
import { useTheme } from '@mui/material/styles';

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const footerStyle = {
    bgcolor: "#003e29", 
    color: "white", 
    p: 1, 
    textAlign: 'center',
    fontSize: isMobile ? 'small' : 'default', // Adjust font size based on screen size
  };

  return (
    <Box sx={footerStyle}>
      <Typography variant="subtitle1">
        Địa chỉ: 144 Xuân Thủy, Cầu Giấy, Hà Nội
      </Typography>
      <Typography variant="subtitle1">
        Số điện thoại: 02083480231
      </Typography>
      <Typography variant="subtitle1">
        &copy; {new Date().getFullYear()} MagicPost. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;

