import React from 'react';
import { Autocomplete, TextField } from "@mui/material";

class utils {
    static TKPoints() {
        return [
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
    }
    static GDPoints() {
        return [
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
    }
    static getYear() {
        return [
            { label: 2023 },
            { label: 2022 },
            { label: 2021 },
            { label: 2020 },
        ];
    }
    static getMonth(start = 1, end = 12) {
        let array = [];
        for (let i = start; i <= end; i++) {
            array.push({ label: i });
        }
        return array;
    }
    static getDate(start = 1, end = 31) {
        let array = [];
        for (let i = start; i <= end; i++) {
            array.push({ label: i });
        }
        return array;
    }
}

export const AutocompleteInput = ({ options, value, onChange, label, minWidth }) => {
    return (
        <Autocomplete
            disablePortal
            options={options}
            value={value}
            onChange={onChange}
            renderInput={(params) => (
                <TextField {...params} label={label} style={{ minWidth: minWidth }} />
            )}
        />
    );
};

export const changeDateForm = (date) => {
    if (typeof date === "string") {
        const [year, month, day] = date.split("-");
        return `${day}/${month}/${year}`;
    } else {
        return "";
    }
};

export const changeDateForm2 = (date) => {
    if (typeof date === "string") {
        const [day, month, year] = date.split("/");
        return `${year}-${month}-${day}`;
    } else {
        return "";
    }
};

export const formatDeliveryTime = (time) => {
    const [date, month, year] = time.split('/');
    return new Date(`${year}-${month}-${date}`);
};

export const TKPoints = utils.TKPoints;
export const getShipmentIDList = utils.getShipmentIDList;
export const getStatus = utils.getStatus;
export const getYear = utils.getYear;
export const getMonth = utils.getMonth;
export const getDate = utils.getDate;
