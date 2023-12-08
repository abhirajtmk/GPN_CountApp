/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  ThemeProvider,
  Typography,
  createTheme,
  Chip,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { RequestActions } from "./redux/slices/requests";
import { useEffect, useState } from "react";
import Approvaltable from "./components/ApprovalTable";
import FilterToolBar from "./components/FilterToolBar";
import { Inventory } from "@mui/icons-material";

const defaultTheme = createTheme();
export default function ApprovalScreen() {
  const { inventoryDetails, loading, allLocations, allUsers } = useSelector(
    (state) => state.requests
  );
  const [limit, setLimit] = useState(20);
  const [location, setLocation] = useState(
    localStorage.getItem("Location") || ""
  );
  const [user, setUser] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [itemName, setitemName] = useState("");
  const [activeStatus, setActiveStatus] = useState("Pending");

  const dispatch = useDispatch();
  const { fetchInventoryCountDetails, fetchLocations, fetchUsers } =
    RequestActions;
  const onLimitChange = (newLimit) => {
    setLimit(newLimit);
  };
  const onLocationChange = (e) => {
    setLocation(e.target.value);
  };
  const onChageItem = (e) => {
    setitemName(e.target.value);
  };
  const onChageUser = (e) => {
    setUser(e.target.value);
  };
  useEffect(async () => {
    const data = {
      locationId: location,
      userId: user,
      limit,
      startDate,
      endDate,
    };
    console.log(`sending request to fetch data for ${location}`, data);
    dispatch(fetchInventoryCountDetails(data));
    dispatch(fetchLocations());
    console.log(
      `resullt request to fetch data for ${location}`,
      inventoryDetails
    );
  }, [limit, location, user, startDate, endDate]);
  useEffect(async () => {
    dispatch(fetchUsers());
  }, []);

  useEffect(async () => {
    if (!location) setLocation(allLocations[0]?.id);
  }, [allLocations]);

  console.log({ inventoryDetails, allUsers });
  return (
    <ThemeProvider theme={defaultTheme}>
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <FilterToolBar
          location={location}
          onLocationChange={onLocationChange}
          allLocations={allLocations}
          itemName={itemName}
          onChageItem={onChageItem}
          allUsers={allUsers}
          user={user}
          onChangeuser={onChageUser}
          startedDate={startDate}
          endDate={endDate}
          setstarteddate={setStartDate}
          setEnddate={setEndDate}
        />
        <Box sx={{ display: "flex", justifyContent: "center", gap: "20px" }}>
          <Chip
            label="All"
            variant="outlined"
            color={activeStatus === "" ? "primary" : "default"}
            onClick={() => {
              setActiveStatus("");
            }}
          />
          <Chip
            label="Pending"
            variant="outlined"
            color={activeStatus === "Pending" ? "primary" : "default"}
            onClick={() => {
              setActiveStatus("Pending");
            }}
            //   onDelete={handleDelete}
          />
          <Chip
            label="Approved"
            variant="outlined"
            color={activeStatus === "Approved" ? "primary" : "default"}
            onClick={() => {
              setActiveStatus("Approved");
            }}

            //   onClick={handleClick}
            //   onDelete={handleDelete}
          />
          <Chip
            label="Rejected"
            variant="outlined"
            color={activeStatus === "Rejected" ? "primary" : "default"}
            onClick={() => {
              setActiveStatus("Rejected");
            }}

            //   onClick={handleClick}
            //   onDelete={handleDelete}
          />
        </Box>
        <Approvaltable
          rows={inventoryDetails}
          isLoading={loading}
          limit={limit}
          activeStatus={activeStatus}
          setActiveStatus={setActiveStatus}
          onLimitChange={onLimitChange}
          location={location}
        />
      </Box>
    </ThemeProvider>
  );
}
