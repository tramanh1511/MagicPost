// Nháp
import React, { useState } from 'react';
import ShipmentTable from './Table/ShipmentTable'; 
import OrderDetailsDialog from './Dialog/OrderDetailsDialog'; 

export default function ShipmentsConfirm() {
  // Dummy data - replace this with your actual data fetching logic
  const [shipments, setShipments] = useState([
    {
      id: 1,
      shipmentID: "123",
      transactionPoint: "Xuân Thủy",
      deliveryTime: "17/11/2023",
      counts: "10",
      status: "Chưa xác nhận",
      employee: {
        name: "Nguyễn Văn A",
        address: "123 ABC Street",
      },
      orders: [
        {
          id: 1,
          orderID: "DH123",
          type: "Hàng hóa",
          price: "1000 đồng",
          details: {
            sender: "Nguyễn Văn A",
            senderAddress: "Xuân Thủy",
            senderPhone: "091232222",
            senderID: "M12", // mã bưu chính ở chỗ người gửi
            receiver: "Hoàng Thị X",
            receiverAddress: "Đại La",
            receiverPhone: "065432222",
            receiverID: "M19" // mã bưu chính ở chỗ người gửi
          }
        },
        {
          id: 2,
          orderID: "DH124",
          type: "Hàng hóa",
          price: "2000 đồng",
          details: {
            sender: "Hoàng Văn D",
            senderAddress: "Tô Hiệu",
            senderPhone: "03126622",
            senderID: "M13", // mã bưu chính ở chỗ người gửi
            receiver: "Hoàng Thị X",
            receiverAddress: "Đại La",
            receiverPhone: "065432222",
            receiverID: "M16" // mã bưu chính ở chỗ người gửi
          }
        },
        {
          id: 3,
          orderID: "DH125",
          type: "Tài liệu",
          price: "4000 đồng",
          details: {
            sender: "Nguyễn Văn A",
            senderAddress: "Nguyễn Phong Sắc",
            senderPhone: "091232222",
            senderID: "M14", // mã bưu chính ở chỗ người gửi
            receiver: "Hoàng Thị X",
            receiverAddress: "Bạch Mai",
            receiverPhone: "065432222",
            receiverID: "M13" // mã bưu chính ở chỗ người gửi
          }
        },
        {
          id: 4,
          orderID: "DH126",
          type: "Hàng hóa",
          price: "16700 đồng",
          details: {
            sender: "Nguyễn Văn A",
            senderAddress: "Phạm Văn Đồng",
            senderPhone: "091232222",
            senderID: "M12", // mã bưu chính ở chỗ người gửi
            receiver: "Hoàng Thị X",
            receiverAddress: "Đại La",
            receiverPhone: "065432222",
            receiverID: "M19" // mã bưu chính ở chỗ người gửi
          }
        },
        {
          id: 5,
          orderID: "DH127",
          type: "Hàng hóa",
          price: "1000 đồng",
          details: {
            sender: "Nguyễn Văn A",
            senderAddress: "Xuân Thủy",
            senderPhone: "091232222",
            senderID: "M12", // mã bưu chính ở chỗ người gửi
            receiver: "Hoàng Thị X",
            receiverAddress: "Đại La",
            receiverPhone: "065432222",
            receiverID: "M19" // mã bưu chính ở chỗ người gửi
          }
        },
      ],
    },
    {
      id: 2,
      shipmentID: "298",
      transactionPoint: "Trần Quốc Hoàn",
      deliveryTime: "3/5/2020",
      counts: "10",
      status: "Chưa xác nhận",
      employee: {
        name: "Nguyễn Văn A",
        address: "123 ABC Street",
      },
      orders: [
        {
          id: 1,
          orderID: "DH123",
          type: "Hàng hóa",
          price: "1000 đồng",
          details: {
            sender: "Nguyễn Văn A",
            senderAddress: "Xuân Thủy",
            senderPhone: "091232222",
            senderID: "M12", // mã bưu chính ở chỗ người gửi
            receiver: "Hoàng Thị X",
            receiverAddress: "Đại La",
            receiverPhone: "065432222",
            receiverID: "M19" // mã bưu chính ở chỗ người gửi
          }
        },
        {
          id: 2,
          orderID: "DH124",
          type: "Hàng hóa",
          price: "2000 đồng",
          details: {
            sender: "Hoàng Văn D",
            senderAddress: "Tô Hiệu",
            senderPhone: "03126622",
            senderID: "M13", // mã bưu chính ở chỗ người gửi
            receiver: "Hoàng Thị X",
            receiverAddress: "Đại La",
            receiverPhone: "065432222",
            receiverID: "M16" // mã bưu chính ở chỗ người gửi
          }
        },
        {
          id: 3,
          orderID: "DH125",
          type: "Tài liệu",
          price: "4000 đồng",
          details: {
            sender: "Nguyễn Văn A",
            senderAddress: "Nguyễn Phong Sắc",
            senderPhone: "091232222",
            senderID: "M14", // mã bưu chính ở chỗ người gửi
            receiver: "Hoàng Thị X",
            receiverAddress: "Bạch Mai",
            receiverPhone: "065432222",
            receiverID: "M13" // mã bưu chính ở chỗ người gửi
          }
        },
        {
          id: 4,
          orderID: "DH126",
          type: "Hàng hóa",
          price: "16700 đồng",
          details: {
            sender: "Nguyễn Văn A",
            senderAddress: "Phạm Văn Đồng",
            senderPhone: "091232222",
            senderID: "M12", // mã bưu chính ở chỗ người gửi
            receiver: "Hoàng Thị X",
            receiverAddress: "Đại La",
            receiverPhone: "065432222",
            receiverID: "M19" // mã bưu chính ở chỗ người gửi
          }
        },
        {
          id: 5,
          orderID: "DH127",
          type: "Hàng hóa",
          price: "1000 đồng",
          details: {
            sender: "Nguyễn Văn A",
            senderAddress: "Xuân Thủy",
            senderPhone: "091232222",
            senderID: "M12", // mã bưu chính ở chỗ người gửi
            receiver: "Hoàng Thị X",
            receiverAddress: "Đại La",
            receiverPhone: "065432222",
            receiverID: "M19" // mã bưu chính ở chỗ người gửi
          }
        },
      ],
    },
    {
      id: 3,
      shipmentID: "625",
      transactionPoint: "Phạm Văn Đồng",
      deliveryTime: "6/9/2021",
      counts: "10",
      status: "Chưa xác nhận",
      employee: {
        name: "Nguyễn Văn A",
        address: "123 ABC Street",
      },
      orders: [
        {
          id: 1,
          orderID: "DH123",
          type: "Hàng hóa",
          price: "1000 đồng",
          details: {
            sender: "Nguyễn Văn A",
            senderAddress: "Xuân Thủy",
            senderPhone: "091232222",
            senderID: "M12", // mã bưu chính ở chỗ người gửi
            receiver: "Hoàng Thị X",
            receiverAddress: "Đại La",
            receiverPhone: "065432222",
            receiverID: "M19" // mã bưu chính ở chỗ người gửi
          }
        },
        {
          id: 2,
          orderID: "DH124",
          type: "Hàng hóa",
          price: "2000 đồng",
          details: {
            sender: "Hoàng Văn D",
            senderAddress: "Tô Hiệu",
            senderPhone: "03126622",
            senderID: "M13", // mã bưu chính ở chỗ người gửi
            receiver: "Hoàng Thị X",
            receiverAddress: "Đại La",
            receiverPhone: "065432222",
            receiverID: "M16" // mã bưu chính ở chỗ người gửi
          }
        },
        {
          id: 3,
          orderID: "DH125",
          type: "Tài liệu",
          price: "4000 đồng",
          details: {
            sender: "Nguyễn Văn A",
            senderAddress: "Nguyễn Phong Sắc",
            senderPhone: "091232222",
            senderID: "M14", // mã bưu chính ở chỗ người gửi
            receiver: "Hoàng Thị X",
            receiverAddress: "Bạch Mai",
            receiverPhone: "065432222",
            receiverID: "M13" // mã bưu chính ở chỗ người gửi
          }
        },
        {
          id: 4,
          orderID: "DH126",
          type: "Hàng hóa",
          price: "16700 đồng",
          details: {
            sender: "Nguyễn Văn A",
            senderAddress: "Phạm Văn Đồng",
            senderPhone: "091232222",
            senderID: "M12", // mã bưu chính ở chỗ người gửi
            receiver: "Hoàng Thị X",
            receiverAddress: "Đại La",
            receiverPhone: "065432222",
            receiverID: "M19" // mã bưu chính ở chỗ người gửi
          }
        },
        {
          id: 5,
          orderID: "DH127",
          type: "Hàng hóa",
          price: "1000 đồng",
          details: {
            sender: "Nguyễn Văn A",
            senderAddress: "Xuân Thủy",
            senderPhone: "091232222",
            senderID: "M12", // mã bưu chính ở chỗ người gửi
            receiver: "Hoàng Thị X",
            receiverAddress: "Đại La",
            receiverPhone: "065432222",
            receiverID: "M19" // mã bưu chính ở chỗ người gửi
          }
        },
      ],
    },
    {
      id: 4,
      shipmentID: "276",
      transactionPoint: "Trần Quốc Hoàn",
      deliveryTime: "18/3/2023",
      counts: "12",
      status: "Chưa xác nhận",
      employee: {
        name: "Nguyễn Văn A",
        address: "123 ABC Street",
      },
      orders: [
        {
          id: 1,
          orderID: "DH123",
          type: "Hàng hóa",
          weight: "1 kg",
          price: "1000 đồng",
          details: {
            sender: "Nguyễn Văn A",
            senderAddress: "Xuân Thủy",
            senderPhone: "091232222",
            senderID: "M12", // mã bưu chính ở chỗ người gửi
            receiver: "Hoàng Thị X",
            receiverAddress: "Đại La",
            receiverPhone: "065432222",
            receiverID: "M19" // mã bưu chính ở chỗ người gửi
          }
        },
        {
          id: 2,
          orderID: "DH124",
          type: "Hàng hóa",
          weight: "1 kg",
          price: "2000 đồng",
          details: {
            sender: "Hoàng Văn D",
            senderAddress: "Tô Hiệu",
            senderPhone: "03126622",
            senderID: "M13", // mã bưu chính ở chỗ người gửi
            receiver: "Hoàng Thị X",
            receiverAddress: "Đại La",
            receiverPhone: "065432222",
            receiverID: "M16" // mã bưu chính ở chỗ người gửi
          }
        },
        {
          id: 3,
          orderID: "DH125",
          type: "Tài liệu",
          weight: "1 kg",
          price: "4000 đồng",
          details: {
            sender: "Nguyễn Văn A",
            senderAddress: "Nguyễn Phong Sắc",
            senderPhone: "091232222",
            senderID: "M14", // mã bưu chính ở chỗ người gửi
            receiver: "Hoàng Thị X",
            receiverAddress: "Bạch Mai",
            receiverPhone: "065432222",
            receiverID: "M13" // mã bưu chính ở chỗ người gửi
          }
        },
        {
          id: 4,
          orderID: "DH126",
          type: "Hàng hóa",
          weight: "1 kg",
          price: "16700 đồng",
          details: {
            sender: "Nguyễn Văn A",
            senderAddress: "Phạm Văn Đồng",
            senderPhone: "091232222",
            senderID: "M12", // mã bưu chính ở chỗ người gửi
            receiver: "Hoàng Thị X",
            receiverAddress: "Đại La",
            receiverPhone: "065432222",
            receiverID: "M19" // mã bưu chính ở chỗ người gửi
          }
        },
        {
          id: 5,
          orderID: "DH127",
          type: "Hàng hóa",
          weight: "1 kg",
          price: "1000 đồng",
          details: {
            sender: "Nguyễn Văn A",
            senderAddress: "Xuân Thủy",
            senderPhone: "091232222",
            senderID: "M12", // mã bưu chính ở chỗ người gửi
            receiver: "Hoàng Thị X",
            receiverAddress: "Đại La",
            receiverPhone: "065432222",
            receiverID: "M19" // mã bưu chính ở chỗ người gửi
          }
        },
      ],
    },
    {
      id: 5,
      shipmentID: "266",
      transactionPoint: "Tô Hiệu",
      deliveryTime: "11/7/2023",
      counts: "11",
      status: "Chưa xác nhận",
      employee: {
        name: "Nguyễn Văn A",
        address: "123 ABC Street",
      },
      orders: [
        {
          id: 1,
          orderID: "DH123",
          type: "Hàng hóa",
          weight: "1 kg",
          price: "1000 đồng",
          details: {
            sender: "Nguyễn Văn A",
            senderAddress: "Xuân Thủy",
            senderPhone: "091232222",
            senderID: "M12", // mã bưu chính ở chỗ người gửi
            receiver: "Hoàng Thị X",
            receiverAddress: "Đại La",
            receiverPhone: "065432222",
            receiverID: "M19" // mã bưu chính ở chỗ người gửi
          }
        },
        {
          id: 2,
          orderID: "DH124",
          type: "Hàng hóa",
          weight: "1 kg",
          price: "2000 đồng",
          details: {
            sender: "Hoàng Văn D",
            senderAddress: "Tô Hiệu",
            senderPhone: "03126622",
            senderID: "M13", // mã bưu chính ở chỗ người gửi
            receiver: "Hoàng Thị X",
            receiverAddress: "Đại La",
            receiverPhone: "065432222",
            receiverID: "M16" // mã bưu chính ở chỗ người gửi
          }
        },
        {
          id: 3,
          orderID: "DH125",
          type: "Tài liệu",
          weight: "1 kg",
          price: "4000 đồng",
          details: {
            sender: "Nguyễn Văn A",
            senderAddress: "Nguyễn Phong Sắc",
            senderPhone: "091232222",
            senderID: "M14", // mã bưu chính ở chỗ người gửi
            receiver: "Hoàng Thị X",
            receiverAddress: "Bạch Mai",
            receiverPhone: "065432222",
            receiverID: "M13" // mã bưu chính ở chỗ người gửi
          }
        },
        {
          id: 4,
          orderID: "DH126",
          type: "Hàng hóa",
          weight: "1 kg",
          price: "16700 đồng",
          details: {
            sender: "Nguyễn Văn A",
            senderAddress: "Phạm Văn Đồng",
            senderPhone: "091232222",
            senderID: "M12", // mã bưu chính ở chỗ người gửi
            receiver: "Hoàng Thị X",
            receiverAddress: "Đại La",
            receiverPhone: "065432222",
            receiverID: "M19" // mã bưu chính ở chỗ người gửi
          }
        },
        {
          id: 5,
          orderID: "DH127",
          type: "Hàng hóa",
          weight: "1 kg",
          price: "1000 đồng",
          details: {
            sender: "Nguyễn Văn A",
            senderAddress: "Xuân Thủy",
            senderPhone: "091232222",
            senderID: "M12", // mã bưu chính ở chỗ người gửi
            receiver: "Hoàng Thị X",
            receiverAddress: "Đại La",
            receiverPhone: "065432222",
            receiverID: "M19" // mã bưu chính ở chỗ người gửi
          }
        },
      ],
    },
  ]);

  const [selectedShipment, setSelectedShipment] = useState(null);
  const [isOrderDetailsOpen, setOrderDetailsOpen] = useState(false);

  const handleViewOrder = (shipment) => {
    setSelectedShipment(shipment);
    setOrderDetailsOpen(true);
  };

  const handleCloseOrderDetails = () => {
    setOrderDetailsOpen(false);
    setSelectedShipment(null);
  };

  return (
    <>
      <ShipmentTable data={shipments} onViewOrder={handleViewOrder} />
      {selectedShipment && (
        <OrderDetailsDialog
          open={isOrderDetailsOpen}
          onClose={handleCloseOrderDetails}
          order={selectedShipment}
        />
      )}
    </>
  );
}
