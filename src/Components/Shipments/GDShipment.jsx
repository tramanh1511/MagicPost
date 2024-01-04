// Chuyển hàng đến diểm GD
import React, { useState, useEffect } from "react";
import {
  Container,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Checkbox,
  Button,
  IconButton,
  Box,
  Autocomplete,
  Grid,
  TableSortLabel,
  Paper,
  Typography,
  Snackbar,
  Pagination,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ShipmentDialog from "../Dialog/ShipmentDialog";
import OrderDetailsDialog from "../Dialog/OrderDetailsDialog";
import Buttonme from "../Buttonme/Buttonme";
import { useLiveQuery } from "dexie-react-hooks";
import { AutocompleteInput, changeDateForm, changeDateForm2, formatDeliveryTime } from "../utils";
import { dexieDB, updateDataFromFireStoreAndDexie, updateDataFromDexieTable, addDataToFireStoreAndDexie, syncDexieToFirestore } from "../../database/cache";
import { fireDB } from "../../database/firebase";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore"

function createDataOrder({
  id,
  date,
  type,
  weight,
  senderName,
  senderPhone,
  senderAddress,
  receiverName,
  receiverPhone,
  receiverAddress,
  cost,
  startGDpoint,
  startTKpoint,
  endTKpoint,
  endGDpoint,
  startGDpointName,
  startTKpointName,
  endTKpointName,
  endGDpointName,
  status,
  orderStatus,
}) {
  return {
    id,
    date,
    type,
    weight,
    senderName,
    senderPhone,
    senderAddress,
    receiverName,
    receiverPhone,
    receiverAddress,
    cost,
    startGDpoint,
    startTKpoint,
    endTKpoint,
    endGDpoint,
    startGDpointName,
    startTKpointName,
    endTKpointName,
    endGDpointName,
    status,
    orderStatus,
  };
}
const GDShipment = () => {
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

  const orderHistories = useLiveQuery(() =>
    dexieDB
      .table("orderHistory")
      .filter((item) => item.historyID.endsWith("3"))  
      // && item.orderStatus === "Đã xác nhận")
      .toArray()
  );
  const GDSystem = useLiveQuery(() => dexieDB.table("GDsystem").toArray());
  const NVTKacc = useLiveQuery(() => dexieDB.table("NVTKacc").toArray());

  const dataOrders = useLiveQuery(() =>
    dexieDB
      .table("orders")
      .filter((item) => item.endTKpoint === "TK02") // endTKpoint -> endGDpoint
      .toArray()
  );

  const [orders, setOrders] = useState([]);
  useEffect(() => {
    if (orderHistories && dataOrders && GDSystem) {
      // Tạo map từ orderHistory
      const orderHistoryDateMap = new Map(
        orderHistories.map(item => [item.orderID, item.date])
      );

      // Tạo map từ GDSystem
      const GDSystemNameMap = new Map(
        GDSystem.map(item => [item.id, item.name])
      );

      const getStatus = (order) => {
        if (order.orderStatus === '') order.orderStatus = 'Chưa tạo đơn';
        return order.orderStatus;
      }

      const updatedOrders = dataOrders.map(order => {
        const orderHistoryDate = orderHistoryDateMap.get(order.id);
        const _endGDpointName = GDSystemNameMap.get(order.endGDpoint);

        return {
          ...createDataOrder(order),
          endGDpointName: _endGDpointName,
          orderStatus: getStatus(order),
          date: changeDateForm(orderHistoryDate),
        };
      });

      setOrders(updatedOrders);
    }
  }, [orderHistories, dataOrders, GDSystem]);


  const [selectedOrderDetails, setSelectedOrderDetails] = useState([]);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [openCreateShipment, setOpenCreateShipment] = useState(false);
  const [openDetailsOrder, setOpenDetailsOrder] = useState(false);
  const [selectedOrderID, setSelectedOrderID] = useState(null);
  const [selectedGDpoint, setSelectedGDpoint] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const clickDetailOrder = (order) => {
    setSelectedOrderDetails(order);
    setOpenDetailsOrder(true);
  };
  const closeDetailsOrder = () => {
    setOpenDetailsOrder(false);
  };
  const clickCreateShipment = () => {
    setOpenCreateShipment(true);
  };

  const handleConfirmShipment = async (shipmentID, shipmentDate) => {
    try {
      // Cập nhật state frontend
      const updatedOrders = orders.map((order) =>
        selectedOrders.includes(order.id) && order.orderStatus === "Chưa tạo đơn"
          ? { ...order, orderStatus: "Đã tạo đơn" }
          : order
      );
      setOrders(updatedOrders);
      setSelectedOrders([]);
      setOpenCreateShipment(false);
      setOpenSnackbar(true);

      // Tìm đơn hàng đầu tiên trong danh sách đơn hàng đã chọn
      const firstSelectedOrder = orders.find(order => selectedOrders.includes(order.id));

      // Step 2: Create a new shipment entry
      const newShipmentDexie = {
        id: shipmentID, // Randomly generated ID from ShipmentDialog
        counts: selectedOrders.length,
        orderList: selectedOrders.join(", "),
        startTKpoint: 0,
        endTKpoint: firstSelectedOrder?.endTKpoint,
        startGDpoint: 0,
        endGDpoint: firstSelectedOrder?.endGDpoint,
        startGDpointName: 0,
        startTKpointName: 0,
        endTKpointName: firstSelectedOrder?.endTKpointName,
        endGDpointName: firstSelectedOrder?.endGDpoint,
        date: shipmentDate,
        status: "chưa xác nhận"
      };
      const newShipmentFirestore = {
        shipmentID: shipmentID, // Randomly generated ID from ShipmentDialog
        counts: selectedOrders.length,
        details: selectedOrders.join(", "),
        startTKpoint: 0,
        endTKpoint: firstSelectedOrder?.endTKpoint,
        startGDpoint: 0,
        endGDpoint: firstSelectedOrder?.endGDpoint,
        date: shipmentDate,
        status: "chưa xác nhận"
      };

      // Add the new shipment to DexieDB 
      await dexieDB.shipment.put(newShipmentDexie);
      // Add the new shipment to Firestore 
      const firestoreShipmentDocRef = doc(fireDB, "shipment", shipmentID);
      await setDoc(firestoreShipmentDocRef, newShipmentFirestore)
        .then(() => console.log("Cập nhật/thêm shipment thành công!", newShipmentFirestore))
        .catch((error) => console.error("Lỗi cập nhật shipment firestore", error));

      // Step 3: Update or create order history entries
      for (const orderId of selectedOrders) {
        // Cập nhật dexieDB orders
        await dexieDB.orders.update(orderId, { orderStatus: "Đã tạo đơn" });
        // Cập nhật firestore orders
        const firestoreOrdersDocRef = doc(fireDB, "orders", orderId);
        await updateDoc(firestoreOrdersDocRef, { orderStatus: "Đã tạo đơn" })
          .then(() => console.log("Cập nhật orderStatus thành công"))
          .catch((error) => console.error("Lỗi cập nhật orderStatus Firestore:", error));

        const historyId = `${orderId}_4`;
        const newOrderHistory = {
          historyID: historyId,
          orderID: orderId,
          currentLocation: firstSelectedOrder.endTKpointName,
          Description: "Chuyển đến điểm giao dịch nhận",
          orderStatus: "Đã tạo đơn",
          date: shipmentDate,
        };

        // Add the new shipment to DexieDB 
        await dexieDB.orderHistory.put(newOrderHistory);
        const firestoreOrderHistoryDocRef = doc(fireDB, "orderHistory", historyId);
        await setDoc(firestoreOrderHistoryDocRef, newOrderHistory)
          .then(() => console.log("Cập nhật/thêm orderhistory thành công!"))
          .catch((error) => console.error("Lỗi cập nhật order history firestore", error));
      }

      // Mock or log the operations for testing
      console.log(`Updating orders in DexieDB for shipmentID: ${shipmentID} with date: ${shipmentDate}`);


    } catch (error) {
      console.error("Error updating database: ", error);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  const closeCreateShipment = () => {
    setOpenCreateShipment(false);
    setSelectedOrders([]);
  };

  const orderIDs = orders.map((order) => ({ label: order.id }));
  const GDpoints = [
    { label: "Ba Đình" },
    { label: "Biên Hòa" },
    { label: "Bình Thạnh" },
    { label: "Buôn Ma Thuột" },
    { label: "Cầu Giấy" },
    { label: "Dĩ An" },
    { label: "Đống Đa" },
    { label: "Hai Bà Trưng" },
    { label: "Hải Châu" },
    { label: "Hoàn Kiếm" },
    { label: "Hồng Bàng" },
    { label: "Liên Chiểu" },
    { label: "Ngô Quyền" },
    { label: "Nha Trang" },
    { label: "Ninh Kiều" },
    { label: "Quy Nhơn" },
    { label: "Tân Bình" },
    { label: "Thanh Xuân" },
    { label: "Thủ Dầu Một" },
    { label: "Thủ Đức" },
    { label: "Vũng Tàu" },
    { label: "Sơn Trà" },
    { label: "Thanh Khê" },
    { label: "Tây Hồ" },
    { label: "Cẩm Lệ" },
    { label: "Bắc Từ Liêm" },
    { label: "Sơn Tây" },
    { label: "Quỳnh Phụ" },
    { label: "Tam Dương" },
    { label: "Hương Sơn" },
    { label: "Kinh Môn" },
    { label: "Tứ Kỳ" },
    { label: "Lập Thạch" },
    { label: "Sông Lô" },
    { label: "Phổ Yên" },
    { label: "Sơn Tịnh" },
    { label: "Yên Khánh" },
    { label: "Thuận Bắc" },
    { label: "Tiền Hải" },
    { label: "Tam Điệp" },
    { label: "Cẩm Xuyên" },
    { label: "Nam Sách" },
    { label: "Hồng Lĩnh" },
    { label: "Đồng Hỷ" },
    { label: "Hương Thủy" },
    { label: "Tư Nghĩa" },
    { label: "Yên Mô" },
    { label: "Phong Điền" },
    { label: "Hương Trà" },
    { label: "Ninh Hải" },
    { label: "Ninh Giang" },
    { label: "Bình Xuyên" },
    { label: "Bình Sơn" },
    { label: "Vĩnh Tường" },
    { label: "Đông Hưng" },
    { label: "Kim Sơn" },
    { label: "Từ Sơn" },
    { label: "Định Hóa" },
    { label: "Phú Bình" },
    { label: "Ninh Sơn" },
    { label: "Quế Võ" },
    { label: "Thái Thụy" },
    { label: "Trà Bồng" },
  ];
  const year = [
    { label: 2023 },
    { label: 2022 },
    { label: 2021 },
    { label: 2020 },
  ];
  const status = [{ label: "Chưa tạo đơn" }, { label: "Đã tạo đơn" }];
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

  const handleGDpointChange = (event, value) => {
    setSelectedGDpoint(value);
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
  const handleOrderIDChange = (event, value) => {
    setSelectedOrderID(value);
  };

  const handleCheckboxChange = (params) => {
    const newSelectedOrders = selectedOrders.includes(params)
      ? selectedOrders.filter((id) => id !== params)
      : [...selectedOrders, params];
    setSelectedOrders(newSelectedOrders);
  };

  const filteredOrders = orders.filter((order) => {
    const formattedDeliveryTime = formatDeliveryTime(order.date);
    return (
      (!selectedOrderID || order.id === selectedOrderID.label) &&
      (!selectedGDpoint
        || ((order.endGDpoint) && (order.endGDpointName === selectedGDpoint.label))) &&
      (!selectedDate ||
        formattedDeliveryTime.getDate() === parseInt(selectedDate.label)) &&
      (!selectedMonth ||
        formattedDeliveryTime.getMonth() + 1 ===
        parseInt(selectedMonth.label)) &&
      (!selectedYear ||
        formattedDeliveryTime.getFullYear() === parseInt(selectedYear.label)) &&
      (!selectedStatus || (order.orderStatus === selectedStatus.label))
    );
  });

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  // Sorting function
  const sortData = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "des";
    }
    setSortConfig({ key, direction });
  };
  const getSortedData = (data) => {
    if (!sortConfig.key) return data;
    return [...data].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
        <Box sx={{ paddingTop: "20px" }}>
          <Typography variant="h4" style={{ fontWeight: 'bold', color: 'darkgreen', marginBottom: '20px' }}>
            Chuyển hàng đến điểm giao dịch
          </Typography>
          <Grid container spacing={2} sx={{ marginBottom: "10px" }}>
            {[
              {
                label: "Mã đơn hàng",
                options: orderIDs,
                value: selectedOrderID,
                onChange: handleOrderIDChange,
              },
              {
                label: "Điểm giao dịch",
                options: GDpoints,
                value: selectedGDpoint,
                onChange: handleGDpointChange,
              },
              {
                label: "Ngày",
                options: date,
                value: selectedDate,
                onChange: handleDateChange,
              },
              {
                label: "Tháng",
                options: month,
                value: selectedMonth,
                onChange: handleMonthChange,
              },
              {
                label: "Năm",
                options: year,
                value: selectedYear,
                onChange: handleYearChange,
              },
              {
                label: "Trạng thái",
                options: status,
                value: selectedStatus,
                onChange: handleStatusChange,
                minWidth: "200px",
              },
            ].map((inputProps, index) => (
              <Grid item xs={12} sm={6} md={2} lg={2} key={index}>
                <AutocompleteInput {...inputProps} />
              </Grid>
            ))}
          </Grid>
        </Box>

        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: "#f5f5f5" }}>
              <TableCell>
                <Checkbox
                  checked={selectedOrders.length === filteredOrders.length}
                  onChange={() => {
                    const allSelected = selectedOrders.length === filteredOrders.length;
                    setSelectedOrders(allSelected ? [] : filteredOrders.map((order) => order.id));
                  }}
                />
              </TableCell>
              <TableCell>
                <strong>Mã đơn hàng</strong>
                <TableSortLabel
                  active={sortConfig.key === "id"}
                  direction={
                    sortConfig.key === "id" ? sortConfig.direction : "asc"
                  }
                  onClick={() => sortData("id")}
                />
              </TableCell>
              <TableCell>
                <strong>Thời gian</strong>
                <TableSortLabel
                  active={sortConfig.key === "date"}
                  direction={
                    sortConfig.key === "date" ? sortConfig.direction : "asc"
                  }
                  onClick={() => sortData("date")}
                />
              </TableCell>
              <TableCell>
                <strong>Đến điểm giao dịch</strong>
                <TableSortLabel
                  active={sortConfig.key === "endGDpointName"}
                  direction={
                    sortConfig.key === "endGDpointName" ? sortConfig.direction : "asc"
                  }
                  onClick={() => sortData("endGDpointName")}
                />
              </TableCell>
              <TableCell>
                <strong>Chi tiết</strong>
              </TableCell>
              <TableCell>
                <strong>Trạng thái</strong>
                <TableSortLabel
                  active={sortConfig.key === "status"}
                  direction={
                    sortConfig.key === "status" ? sortConfig.direction : "asc"
                  }
                  onClick={() => sortData("status")}
                />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {getSortedData(filteredOrders)
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((order) => (
                <TableRow
                  key={order.id}
                  sx={{
                    backgroundColor:
                      order.orderStatus === "Đã tạo đơn" ? "#e8f5e9" : "inherit",
                    "&:hover": {
                      backgroundColor: "#f5f5f5",
                    },
                  }}
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedOrders.includes(order.id)}
                      onChange={() => handleCheckboxChange(order.id)}
                    />
                  </TableCell>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>{order.endGDpointName}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => clickDetailOrder(order)}
                      style={{ color: "#4CAF50" }}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell>{order.orderStatus}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>

        <Box mt={2} mb={2} display="flex" justifyContent="flex-end">
          <Pagination
            count={Math.ceil(filteredOrders.length / rowsPerPage)}
            page={page + 1}
            onChange={(event, newPage) => setPage(newPage - 1)}
          />
        </Box>

        <Box mt={2} mb={2}>
          <Buttonme title="Tạo đơn" onClick={clickCreateShipment} />
        </Box>

        <ShipmentDialog
          open={openCreateShipment}
          onClose={closeCreateShipment}
          onConfirm={(shipmentID, shipmentDate) => handleConfirmShipment(shipmentID, shipmentDate)}
          orders={orders.filter(order => selectedOrders.includes(order.id))}
          NVTKacc={NVTKacc}
        />

        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          message="Đã tạo đơn thành công"
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

export default GDShipment;
