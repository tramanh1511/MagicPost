import React from 'react';
import { Box, Typography, TextField, InputAdornment, IconButton, Grid, Paper } from '@mui/material';
import { Search } from '@mui/icons-material';
import bgimg from "../../../assets/images/1.png";
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const FirstPanel = ({ onOrderCodeChange, onSearchClick }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const backgroundStyles = {
    backgroundImage: `url(${bgimg})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: isMobile ? 'auto 100%' : 'cover', // Adjust the size for mobile
    backgroundPosition: isMobile ? 'center center' : 'initial', // Adjust the position for mobile
  };

  return (
    <Box
      sx={{
        ...backgroundStyles,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
      }}
    >
      <Grid container justifyContent="center" alignItems="center">
        <Grid item xs={12} md={6}>
          <Paper elevation={6} style={{ margin: '1em', padding: '1em', backgroundColor: 'rgba(255, 255, 255, 0.8)' }}> {/* Sử dụng Paper để tạo background và shadow */}
            <Typography
              variant="h4"
              gutterBottom
              style={{ fontWeight: "bold", color: "#003e29", textAlign: 'center' }}
            >
              TRA CỨU ĐƠN HÀNG
            </Typography>
            <Box mt={2}>
              <TextField
                fullWidth
                label="Nhập mã đơn hàng"
                onChange={onOrderCodeChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={onSearchClick}>
                        <Search />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                style={{
                  backgroundColor: "white",
                }}
              />
            </Box>   
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FirstPanel;
