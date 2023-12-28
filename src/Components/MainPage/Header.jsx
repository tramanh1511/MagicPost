import React from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { AccountCircle } from '@mui/icons-material';
import SignIn from "./SignIn";
import { AppBar, Toolbar, Typography, Button } from '@mui/material';

const Header = ({ open, onOpen, onClose, onSignIn }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <>
      <AppBar>
        <Toolbar sx={{ justifyContent: "space-between", background: "#f1f2ec" }}>
          <Typography variant="h5" sx={{ fontWeight: "bold", color: "#003e29", fontSize: isMobile ? '1.2rem' : 'inherit' }}>
            MAGICPOST
          </Typography>
          <Button
            variant="contained"
            sx={{ fontFamily: 'Arial', fontWeight: "bold", backgroundColor: "#003e29", color: "#fff", padding: isMobile ? '6px 10px' : 'inherit', fontSize: isMobile ? '0.8rem' : 'inherit' }}
            onClick={onOpen}
            startIcon={<AccountCircle />}
          >
            Đăng nhập
          </Button>
        </Toolbar>
      </AppBar>
      <SignIn open={open} onClose={onClose} onSignIn={onSignIn} />
    </>
  );
};

export default Header;
