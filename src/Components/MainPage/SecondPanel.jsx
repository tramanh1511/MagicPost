import React from 'react';
import { Box, Typography, Grid, Container } from '@mui/material';
import bgImage from "../../assets/images/3.png"; 

const SecondPanel = () => {
  const primaryColor = "#003e29"; 

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Grid container spacing={4} justifyContent="center" alignItems="center">
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <Typography 
            variant="h4" 
            component="div" 
            gutterBottom 
            textAlign='center' 
            sx={{ 
              fontWeight: 'bold', 
              color: primaryColor,
              fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' } // Responsive font size
            }}
          >
            <Box component="span" sx={{ display: 'block' }}>Dịch vụ chuyển phát nhanh uy tín, chuyên nghiệp hàng đầu</Box>
          </Typography>
        </Grid>
        <Grid item container spacing={2} xs={12} md={6} lg={7} alignItems="center" justifyContent="center">
          <Box
            component="img"
            src={bgImage}
            alt="Delivery illustration"
            sx={{
              width: '100%',
              maxWidth: { xs: '80%', md: '90%' }, // Adjust max width based on screen size
              height: 'auto'
            }}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default SecondPanel;
