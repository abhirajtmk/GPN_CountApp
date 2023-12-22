import { LoadingButton } from "@mui/lab";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Collapse,
  Container,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { RequestActions } from "../redux/slices/requests";
import { useSnackbar } from "notistack";
import SubmitPopupModal from "./submitModel";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { DeleteOutline } from "@mui/icons-material";

export default function Approvaltable({
  rows,
  isLoading,
  limit,
  onLimitChange,
  location,
  activeStatus,
  setActiveStatus,
}) {
  const [selected, setSelected] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [tableData, setTableData] = useState();
  const { isSubmitting } = useSelector((state) => state.requests);
  const { approveCount, fetchInventoryCountDetails } = RequestActions;
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("selected item", selected);
    console.log("rows", rows);
    console.log("total items", rows.items);
  }, [selected]);
  const isSelected = (id) => selected.indexOf(id) !== -1;
  // const isSelected = (item) => {
  //   // if (item.isSerialItem) {
  //   //   console.log("selected item is serial item", item);
  //   //   // return item.elements.some((element) => selected.indexOf(element) !== -1);
  //   //   return selected.indexOf(item) !== -1;
  //   // } else {
  //   //   console.log("selected item is not serial item", item);
  //   return selected.indexOf(item) !== -1;
  //   // }
  // };
  // const handleSelectAllClick = (event) => {
  //   if (event.target.checked) {
  //     const newSelected = rows.items.filter((n) => n.status !== "Approved");
  //     setSelected(newSelected);
  //     return;
  //   }
  //   setSelected([]);
  // };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  let items =
    (rows &&
      rows?.items &&
      rows?.items.filter(({ status }) =>
        activeStatus ? status === activeStatus : true
      )) ||
    [];
  items = items.reduce((acc, current) => {
    const title = current.itemName;
    const id = current.id;
    const isSerial = current.isSerialItem;

    if (isSerial) {
      const existingGroup = acc.find((item) => item.title === title);

      if (existingGroup) {
        existingGroup.elements.push({ ...current, id });
      } else {
        acc.push({
          title,
          isSerialItem: isSerial,
          elements: [{ ...current, id }],
        });
      }
    } else {
      acc.push(current);
    }

    return acc;
  }, []);

  console.log("items reduced in approaval table", items);

  // const handleClick = (event, item) => {
  //   const selectedIndex = selected.indexOf(item);
  //   let newSelected = [];
  //   console.log("inside handle click", item, selectedIndex);
  //   if (selectedIndex === -1) {
  //     newSelected = newSelected.concat(selected, item);
  //   } else if (selectedIndex === 0) {
  //     newSelected = newSelected.concat(selected.slice(1));
  //   } else if (selectedIndex === selected.length - 1) {
  //     newSelected = newSelected.concat(selected.slice(0, -1));
  //   } else if (selectedIndex > 0) {
  //     newSelected = newSelected.concat(
  //       selected.slice(0, selectedIndex),
  //       selected.slice(selectedIndex + 1)
  //     );
  //   }
  //   setSelected(newSelected);
  // };
  const handleSubmit = async (status) => {
    try {
      if (!selected.length) {
        enqueueSnackbar(
          `Select atleast 1 item to ${
            status === "rejected" ? "Reject" : "Accept"
          }`,
          {
            variant: "error",
          }
        );
        return;
      }
      let items = selected.map((item) => {
        return {
          ...item,
          onHand: rows?.currentInventoryCounts[`${item.itemId}_${location}`],
        };
      });
      console.log({ items, status });
      const response = await dispatch(
        approveCount({ items, status: status ? status : "" })
      );
      console.log({ response });
      const data = {
        locationId: localStorage.getItem("Location") || "1",
        userId: "",
        limit: 20,
        date: "",
      };
      if (response?.payload?.data?.status === 200) {
        if (response?.payload?.data?.recordsCreated?.length) {
          setIsOpen(true);
          setTableData(response?.payload?.data?.recordsCreated || []);
        } // TODO: Show response in modal
        else {
          enqueueSnackbar(response?.payload?.data?.message, {
            variant: "success",
          });
          dispatch(fetchInventoryCountDetails(data));
          setActiveStatus("Pending");
        }
      } else {
        enqueueSnackbar(
          response?.payload?.data?.message || "Failed to get request",
          {
            variant: "error",
          }
        );
        dispatch(fetchInventoryCountDetails(data));
        setActiveStatus("Pending");
      }
    } catch (error) {
      enqueueSnackbar(error?.message || "Failed to get request", {
        variant: "error",
      });
    }
  };
  if (!rows || !items || !items?.length)
    return <Typography sx={{ mt: 2 }}>No Data Found</Typography>;
  else
    return (
      <Container>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    indeterminate={
                      selected.length > 0 && selected.length < items?.length
                    }
                    checked={
                      items?.length > 0 && selected.length === items?.length
                    }
                    onChange={handleSelectAllClick}
                    inputProps={{
                      "aria-label": "select all desserts",
                    }}
                  />
                </TableCell>
                <TableCell>Item</TableCell>
                <TableCell>Serial Status</TableCell>
                <TableCell>New Quantity</TableCell>
                <TableCell>On Hand</TableCell>
                <TableCell>Adjust Qty By</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!isLoading ? (
                items?.map((item, index) =>
                  !item.isSerialItem ? (
                    <TableRow key={index}>
                      <TableCell
                        padding="checkbox"
                        onClick={(event) => handleClick(event, item)}
                      >
                        <Checkbox
                          color="primary"
                          checked={isSelected(item)}
                          disabled={item.status === "Approved"}
                          inputProps={{
                            "aria-labelledby": item.itemName + "_" + index,
                          }}
                        />
                      </TableCell>
                      <>
                        <TableCell>{item?.itemName}</TableCell>
                        <TableCell>
                          <Chip label="Non-Serial Item" color="primary" />
                        </TableCell>
                        <TableCell>{item?.quantity}</TableCell>
                        <TableCell>
                          {rows?.currentInventoryCounts[
                            `${item.itemId}_${location}`
                          ] || 0}
                        </TableCell>
                        <TableCell>
                          {item?.quantity -
                            (rows?.currentInventoryCounts[
                              `${item.itemId}_${location}`
                            ] || 0)}
                        </TableCell>
                        <TableCell>{item?.locationName}</TableCell>
                        <TableCell>{item?.userName}</TableCell>
                        <TableCell>
                          {new Date(item?.date).toDateString()}
                        </TableCell>
                        <TableCell>{item?.status}</TableCell>
                      </>
                    </TableRow>
                  ) : (
                    <>
                      <TableRow
                        key={index}
                        // sx={{ "& > *": { borderBottom: "unset" } }}
                      >
                        <TableCell>
                          <IconButton
                            aria-label="expand row"
                            size="small"
                            onClick={() => setOpen(!open)}
                          >
                            {open ? (
                              <KeyboardArrowUpIcon />
                            ) : (
                              <KeyboardArrowDownIcon />
                            )}
                          </IconButton>
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {item.title}
                        </TableCell>
                        <TableCell>
                          <Chip label="Serial" color="success" />
                        </TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={10}>
                          <Collapse in={open} timeout="auto" unmountOnExit>
                            <Box>
                              <Table aria-label="purchases">
                                <TableHead>
                                  <TableCell padding="checkbox">
                                    <Checkbox
                                      color="primary"
                                      indeterminate={
                                        selected.length > 0 &&
                                        selected.length < items?.length
                                      }
                                      checked={
                                        items?.length > 0 &&
                                        selected.length === items?.length
                                      }
                                      onChange={handleSelectAllClick}
                                      inputProps={{
                                        "aria-label": "select all desserts",
                                      }}
                                    />
                                  </TableCell>
                                  <TableCell>Item</TableCell>
                                  <TableCell>Serial Status</TableCell>
                                  <TableCell>New Quantity</TableCell>
                                  <TableCell>On Hand</TableCell>
                                  <TableCell>Adjust Qty By</TableCell>
                                  <TableCell>Location</TableCell>
                                  <TableCell>User</TableCell>
                                  <TableCell>Date</TableCell>
                                  <TableCell>Status</TableCell>
                                </TableHead>
                                <TableBody>
                                  {item.elements.map((item, i) => (
                                    <TableRow key={i}>
                                      <TableCell
                                        padding="checkbox"
                                        onClick={(event) =>
                                          handleClick(event, item)
                                        }
                                      >
                                        <Checkbox
                                          color="primary"
                                          checked={isSelected(item)}
                                          disabled={item.status === "Approved"}
                                          inputProps={{
                                            "aria-labelledby":
                                              item.itemName + "_" + index,
                                          }}
                                        />
                                      </TableCell>
                                      <>
                                        <TableCell>
                                          {item?.serialName}
                                        </TableCell>
                                        <TableCell>
                                          <Chip
                                            label="Serial Item"
                                            color="success"
                                          />
                                        </TableCell>
                                        <TableCell>{item?.quantity}</TableCell>
                                        <TableCell>
                                          {rows?.currentInventoryCounts[
                                            `${item.itemId}_${location}`
                                          ] || 0}
                                        </TableCell>
                                        <TableCell>
                                          {item?.quantity -
                                            (rows?.currentInventoryCounts[
                                              `${item.itemId}_${location}`
                                            ] || 0)}
                                        </TableCell>
                                        <TableCell>
                                          {item?.locationName}
                                        </TableCell>
                                        <TableCell>{item?.userName}</TableCell>
                                        <TableCell>
                                          {new Date(item?.date).toDateString()}
                                        </TableCell>
                                        <TableCell>{item?.status}</TableCell>
                                      </>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </>
                  )
                )
              ) : (
                <Box display={"flex"} justifyContent={"center"}>
                  <CircularProgress size={20} sx={{ my: 3 }} />
                </Box>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Box>
          {items?.length >= limit ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => onLimitChange(limit + 5)}
              >
                {" "}
                Load More
              </Button>
            </Box>
          ) : null}
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            width: "100%",
          }}
        >
          <Button
            type="submit"
            onClick={() => handleSubmit("rejected")}
            variant="contained"
            color="primary"
            sx={{
              my: 3,
              mx: 2,
              padding: "10px 5px",
              backgroundColor: "red",
              color: "white",
              width: "100%",
              ":hover": { backgroundColor: "black" },
            }}
          >
            Reject Inventory
          </Button>
          <Button
            type="submit"
            onClick={() => handleSubmit()}
            variant="contained"
            color="primary"
            sx={{
              my: 3,
              mx: 2,
              padding: "10px 5px",
              backgroundColor: "black",
              color: "white",
              width: "100%",
              ":hover": { backgroundColor: "black" },
            }}
          >
            Approve Inventory
          </Button>
        </Box>
        <SubmitPopupModal
          isOpen={isOpen}
          onClose={() => {
            console.log("closed");

            // dispatch(fetchInventoryCountDetails(data));
            const data = {
              locationId: localStorage.getItem("Location") || "1",
              userId: "",
              limit: 20,
              date: "",
            };

            dispatch(fetchInventoryCountDetails(data));
            setActiveStatus("Pending");

            setIsOpen(false);
          }}
          tableData={tableData}
        />
      </Container>
    );
}
