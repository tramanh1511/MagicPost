import React, { useState, useEffect, useCallback } from "react";
import {
  Container,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Checkbox,
  IconButton,
  Box,
  Typography,
  TableSortLabel,
  Grid,
  Paper
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Pagination from '@mui/material/Pagination';
import ShipmentDetailsDialog from "../Dialog/ShipmentDetailsDialog";
import OrderDetailsDialog from "../Dialog/OrderDetailsDialog";
import Buttonme from "../Buttonme/Buttonme";
import { useLiveQuery } from "dexie-react-hooks";
import { dexieDB, updateDataFromFireStoreAndDexie, updateDataFromDexieTable, addDataToFireStoreAndDexie, addDataToDexieTable, syncDexieToFirestore } from "../../database/cache";
import { AutocompleteInput, changeDateForm, formatDeliveryTime } from "../utils";
import { fireDB } from "../../database/firebase";
import { getDoc, updateDoc, doc } from "firebase/firestore";

function createData({
  id,
  date,
  counts,
  ordersList,
  startGDpoint,
  startTKpoint,
  endTKpoint,
  endGDpoint,
  startGDpointName,
  startTKpointName,
  endTKpointName,
  endGDpointName,
  status
}) {
  return {
    id,
    date: changeDateForm(date),
    counts,
    ordersList,
    startGDpoint,
    startTKpoint,
    endTKpoint,
    endGDpoint,
    startGDpointName,
    startTKpointName,
    endTKpointName,
    endGDpointName,
    status,
  };
}

const TKConfirm = () => {
    //   // Lấy thông tin về email từ localStorage
  // const userEmail = localStorage.getItem("email");

  // // Lấy mã tài khoản điểm tập kết từ email
  // const userTKpoint = userEmail.slice(0, 4);

  // // Sử dụng thông tin người dùng để lọc đơn hàng
  // const dataOrders = useLiveQuery(() =>
  //   dexieDB
  //     .table("orders")
  //     .filter((item) => item.startTKpoint === userTKpoint)
  //     .toArray()
  // );

  const dataShipments = useLiveQuery(() =>
    dexieDB
      .table("shipment")
      .filter((item) => item.endTKpoint === 'TK02' && item.startTKpoint) // lọc shipment từ startGDpoint -> startTKpoint và tồn tại
      .toArray()
  );
  // console.log("shipment", dataShipments);
  
  const dataOrders = useLiveQuery(() =>
    dexieDB
      .table("orders")
      .filter((item) => item.endTKpoint === 'TK02')
      .toArray()
  )
  const TKSystem = useLiveQuery(() =>
    dexieDB
      .table("TKsystem")
      .toArray());
  // console.log("tsys", TKSystem);
  const NVTKacc = useLiveQuery(() =>
    dexieDB
      .table("NVTKacc")
      .toArray())

  const [shipments, setShipments] = useState([]);
  useEffect(() => {
    if (TKSystem && dataShipments) {
      // Tạo map từ TKSystem
      const TKSystemNameMap = new Map(
        TKSystem.map(item => [item.id, item.name])
      );
      // Cập nhật shipments dựa trên map
      const updatedShipments = dataShipments.map(shipment => {
        const _startTKpointName = TKSystemNameMap.get(shipment.startTKpoint);
        return {
          ...createData(shipment),
          startTKpointName: _startTKpointName,
        };
      });
      setShipments(updatedShipments);
    }
  }, [TKSystem, dataShipments]);

  const [openDetailsShipment, setOpenDetailsShipment] = useState(false);
  const [selectedShipments, setSelectedShipments] = useState([]);
  const [selectedShipmentDetails, setSelectedShipmentDetails] = useState(null);
  const [selectedTKpoint, setSelectedTKpoint] =
    useState(null);
  const [selectedShipmentID, setSelectedShipmentID] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentShipment, setCurrentShipment] = useState(null);

  const clickDetailsShipment = (shipment) => {
    if (shipment) {
      setCurrentShipment(shipment);
      setOpenDetailsShipment(true);
    } else {
      console.log('Attempted to open details for a null shipment');
    }
  };

  const closeDetailsShipment = () => {
    setOpenDetailsShipment(false);
    setCurrentShipment(null);
  };
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
  const [openDetailsOrder, setOpenDetailsOrder] = useState(false);

  const clickDetailOrder = useCallback((order) => {
    setSelectedOrderDetails(order);
    // console.log("order dc chọn", order);
    setOpenDetailsOrder(true);
  }, [setSelectedOrderDetails, setOpenDetailsOrder]);
  const closeDetailsOrder = () => {
    setOpenDetailsOrder(false);
  };

  const handleCheckboxChange = (params) => {
    const newSelectedShipments = selectedShipments.includes(params)
      ? selectedShipments.filter((id) => id !== params)
      : [...selectedShipments, params];

    setSelectedShipments(newSelectedShipments);
  };

  async function getShipmentDetailsById(shipmentID) {
    // Truy vấn DexieDB
    const shipment = await dexieDB.shipment.get(shipmentID);

    // Nếu không tìm thấy trong DexieDB, thử truy vấn Firestore
    if (!shipment) {
      const firestoreShipmentDocRef = doc(fireDB, "shipment", shipmentID);
      if (firestoreShipmentDocRef.exists) {
        return doc.data();
      }
    }

    return shipment;
  }

  // Xử lý khi xác nhận shipment
  const handleConfirmShipment = async () => {
    try {
      // Cập nhật state frontend
      const updatedShipments = shipments.map((shipment) =>
        selectedShipments.includes(shipment.id) && shipment.status === "chưa xác nhận"
          ? { ...shipment, status: "đã xác nhận" }
          : shipment
      );
      setShipments(updatedShipments);
      setSelectedShipments([]);

      // Xử lý backend
      for (const shipmentID of selectedShipments) {
        // Cập nhật trạng thái trong DexieDB
        await dexieDB.shipment.update(shipmentID, { status: "đã xác nhận" });

        // Cập nhật trạng thái trong Firestore 
        const firestoreShipmentDocRef = doc(fireDB, "shipment", shipmentID);
        await updateDoc(firestoreShipmentDocRef, { status: "đã xác nhận" })
          .then(() => console.log("Cập nhật status shipment thành công"))
          .catch((error) => console.error("Lỗi cập nhật status shipment Firestore:", error));
          
        // Tạo mảng các lời hứa để cập nhật orderHistory
        const shipment = await getShipmentDetailsById(shipmentID);
        if (shipment && shipment.ordersList) {
          const orderIds = shipment.ordersList.split(",").map(id => id.trim());
          for (const orderId of orderIds) {
            const historyID = `${orderId}_3`;
             // Cập nhật orderHistory trong DexieDB
             await dexieDB.orderHistory.update(historyID, { orderStatus: "Đã xác nhận", Description: "Chuyển đến điểm tập kết nhận" });

             // Cập nhật orderHistory trong Firestore
            const firestoreOrderHistoryDocRef = doc(fireDB, "orderHistory", historyID);
            const docSnap = await getDoc(firestoreOrderHistoryDocRef);
            if (docSnap.exists()) {
              // Document exists, proceed with update
              await updateDoc(firestoreOrderHistoryDocRef, {  orderStatus: "Đã xác nhận", Description: "Chuyển đến điểm tập kết nhận" })
              .then(() => console.log("Cập nhật status orderHistory thành công"))
              .catch((error) => console.error("Lỗi cập nhật status orderHistory Firestore:", error));
            } else {
              console.log(`No document found with ID ${historyID} to update.`);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error updating shipments and order histories:", error);
    }
  }

  const TKpoints = [
    { label: "Bà Rịa - Vũng Tàu" },
    { label: "Bắc Ninh" },
    { label: "Bình Định" },
    { label: "Bình Dương" },
    { label: "Cần Thơ" },
    { label: "Đà Nẵng" },
    { label: "Đắk Lắk" },
    { label: "Đồng Nai" },
    { label: "Hà Nội" },
    { label: "Hà Tĩnh" },
    { label: "Hải Dương" },
    { label: "Hải Phòng" },
    { label: "Hồ Chí Minh" },
    { label: "Huế" },
    { label: "Khánh Hòa" },
    { label: "Ninh Thuận" },
    { label: "Quảng Ngãi" },
    { label: "Thái Nguyên" },
    { label: "Vĩnh Phúc" },
    { label: "Ninh Bình" },
    { label: "Thái Bình" }
  ];
  const shipmentIDList = shipments.map(shipment => ({ label: shipment.id }));
  const status = [
    { label: "đã xác nhận" },
    { label: "chưa xác nhận" },
  ];
  const year = [
    { label: 2023 },
    { label: 2022 },
    { label: 2021 },
    { label: 2020 },
  ];
  const createArray = (start, end) => {
    let array = [];
    for (let i = start; i <= end; i++) {
      let object = { label: i };
      array.push(object);
    }
    return array;
  };
  const month = createArray(1, 12);
  const date = createArray(1, 31);

  const handleShipmentIDChange = (event, value) => {
    setSelectedShipmentID(value);
  }
  const handleTKpointChange = (event, value) => {
    setSelectedTKpoint(value);
  };
  const handleDateChange = (event, value) => {
    setSelectedDate(value);
  };
  const handleMonthChange = (event, value) => {
    setSelectedMonth(value);
  };
  const handleYearChange = (event, value) => {
    setSelectedYear(value);
  };
  const handleStatusChange = (event, value) => {
    setSelectedStatus(value);
  };

  const filteredShipments = shipments.filter((shipment) => {
    const formattedDeliveryTime = formatDeliveryTime(shipment.date);
    return (
      (!selectedShipmentID ||
        shipment.id === selectedShipmentID.label) &&
      (!selectedTKpoint ||
        (shipment.startTKpoint && (shipment.startTKpointName === selectedTKpoint.label))) &&
      (!selectedDate || formattedDeliveryTime.getDate() === parseInt(selectedDate.label)) &&
      (!selectedMonth || formattedDeliveryTime.getMonth() + 1 === parseInt(selectedMonth.label)) &&
      (!selectedYear || formattedDeliveryTime.getFullYear() === parseInt(selectedYear.label)) &&
      (!selectedStatus || (shipment.status === selectedStatus.label))
    );
  });

  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  // Sorting function
  const sortData = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'des';
    }
    setSortConfig({ key, direction });
  };

  const getSortedData = (data) => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
      <Box sx={{ paddingTop: '20px' }}>
        <Typography variant="h4" style={{ fontWeight: 'bold', color: 'darkgreen', marginBottom: '20px' }}>
          Xác nhận đơn hàng từ điểm tập kết
        </Typography>
        <Grid container spacing={2} sx={{ marginBottom: '10px' }}>
          {[
            { label: "Đơn chuyển hàng", options: shipmentIDList, value: selectedShipmentID, onChange: handleShipmentIDChange },
            { label: "Điểm tập kết", options: TKpoints, value: selectedTKpoint, onChange: handleTKpointChange },
            { label: "Ngày", options: date, value: selectedDate, onChange: handleDateChange },
            { label: "Tháng", options: month, value: selectedMonth, onChange: handleMonthChange },
            { label: "Năm", options: year, value: selectedYear, onChange: handleYearChange },
            { label: "Trạng thái", options: status, value: selectedStatus, onChange: handleStatusChange, minWidth: '200px' },
          ].map((inputProps, index) => (
            <Grid item xs={12} sm={6} md={2} lg={2} key={index}>
              <AutocompleteInput {...inputProps} />
            </Grid>
          ))}
        </Grid>
      </Box>

      <Table>
        <TableHead>
          <TableRow style={{ backgroundColor: '#f5f5f5' }} >
            <TableCell>
              <Checkbox
                checked={selectedShipments.length === shipments.length}
                onChange={() => {
                  const allSelected = selectedShipments.length === shipments.length;
                  setSelectedShipments(allSelected ? [] : shipments.map((shipment) => shipment.id));
                }}
              />
            </TableCell >
            <TableCell>
              <strong>Mã đơn chuyển hàng</strong>
              <TableSortLabel
                active={sortConfig.key === 'id'}
                direction={sortConfig.key === 'id' ? sortConfig.direction : 'asc'}
                onClick={() => sortData('id')}
              />
            </TableCell>
            <TableCell>
              <strong>Thời gian chuyển đến</strong>
              <TableSortLabel
                active={sortConfig.key === 'date'}
                direction={sortConfig.key === 'date' ? sortConfig.direction : 'asc'}
                onClick={() => sortData('date')}
              />
            </TableCell>
            <TableCell>
              <strong>Số lượng</strong>
              <TableSortLabel
                active={sortConfig.key === 'counts'}
                direction={sortConfig.key === 'counts' ? sortConfig.direction : 'asc'}
                onClick={() => sortData('counts')}
              />
            </TableCell>
            <TableCell>
              <strong>Từ điểm tập kết</strong>
              <TableSortLabel
                active={sortConfig.key === 'startTKpointName'}
                direction={sortConfig.key === 'startTKpointMame' ? sortConfig.direction : 'asc'}
                onClick={() => sortData('startTKpointName')}
              />
            </TableCell>
            <TableCell>
              <strong>Chi tiết</strong>
            </TableCell>
            <TableCell>
              <strong>Trạng thái</strong>
              <TableSortLabel
                active={sortConfig.key === 'status'}
                direction={sortConfig.key === 'status' ? sortConfig.direction : 'asc'}
                onClick={() => sortData('status')}
              />
            </TableCell>

          </TableRow>
        </TableHead>
        <TableBody>
          {getSortedData(filteredShipments)
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((shipment) => (
              <TableRow
                key={shipment.id}
                sx={{
                  backgroundColor: shipment.status === "đã xác nhận" ? "#e8f5e9" : "inherit",
                  '&:hover': {
                    backgroundColor: '#f5f5f5',
                  },
                }}
              >
                <TableCell>
                  <Checkbox
                    checked={selectedShipments.includes(shipment.id)}
                    onChange={() => handleCheckboxChange(shipment.id)}
                  />
                </TableCell>
                <TableCell>{shipment.id}</TableCell>
                <TableCell>{shipment.date}</TableCell>
                <TableCell>{shipment.counts}</TableCell>
                <TableCell>{shipment.startTKpointName}</TableCell>
                <TableCell>
                  <IconButton onClick={() => clickDetailsShipment(shipment)} style={{ color: '#4CAF50' }}>
                    <VisibilityIcon />
                  </IconButton>
                </TableCell>
                <TableCell>{shipment.status}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>

      <Box mt={2} mb={2} display="flex" justifyContent="flex-end">
        <Pagination
          count={Math.ceil(filteredShipments.length / rowsPerPage)}
          page={page + 1}
          onChange={(event, newPage) => setPage(newPage - 1)}
        />
      </Box>

      <Box mt={2} mb={2}>
        <Buttonme title="Xác nhận" onClick={handleConfirmShipment} />
      </Box>

      <ShipmentDetailsDialog
        open={openDetailsShipment}
        onClose={closeDetailsShipment}
        shipment={currentShipment}
        orders={dataOrders}
        staff={NVTKacc}
        clickDetailOrder={clickDetailOrder}
      />

      <OrderDetailsDialog
        open={openDetailsOrder}
        onClose={closeDetailsOrder}
        order={selectedOrderDetails}
      />
      </Paper>
    </Container>
  );
};

export default TKConfirm;