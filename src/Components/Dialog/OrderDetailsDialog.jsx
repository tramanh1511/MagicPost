// // OrderDetailsDialog.jsx

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  Typography,
  Divider,
  Box,
} from '@mui/material';
import Buttonme from '../Buttonme/Buttonme';

const OrderDetailsDialog = ({ open, onClose, selectedOrderDetails }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ bgcolor: '#003e20', color: "#fff",padding: '10px' }}>
        Chi tiết đơn hàng
      </DialogTitle>
      <DialogContent dividers>
        {selectedOrderDetails && (
          <Card variant="outlined">
            <CardContent>
              <Typography gutterBottom variant="h6" component="div">
                Thông tin người gửi
              </Typography>
              <Typography variant="body2">Họ và tên: {selectedOrderDetails.sender}</Typography>
              <Typography variant="body2">Địa chỉ: {selectedOrderDetails.senderAddress}</Typography>
              <Typography variant="body2">Số điện thoại: {selectedOrderDetails.senderPhone}</Typography>
              <Divider sx={{ my: 2 }} />
              <Typography gutterBottom variant="h6" component="div">
              Thông tin người nhận
              </Typography>
              <Typography variant="body2">Họ và tên: {selectedOrderDetails.receiver}</Typography>
              <Typography variant="body2">Địa chỉ: {selectedOrderDetails.receiverAddress}</Typography>
              <Typography variant="body2">Số điện thoại: {selectedOrderDetails.receiverPhone}</Typography>
            </CardContent>
          </Card>
        )}
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', padding: '16px' }}>
       <Buttonme title="Đóng" onClick={onClose} />
      </DialogActions>
    </Dialog>
  );
};

export default OrderDetailsDialog;
