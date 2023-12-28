import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from '@mui/material';

const SignIn = ({ open, onClose, onSignIn }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Đăng nhập</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Tên tài khoản"
          type="text"
          fullWidth
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Mật khẩu"
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{color:'#003e29'}}>
          Hủy
        </Button>
        <Button onClick={onSignIn} sx={{color:'#003e29'}}>
          Đăng nhập
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SignIn;
