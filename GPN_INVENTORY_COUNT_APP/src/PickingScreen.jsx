// import React, { useEffect, useMemo, useState } from "react";
// import CssBaseline from "@mui/material/CssBaseline";
// // import TextField from "@mui/material/TextField";
// import Grid from "@mui/material/Grid";
// import Box from "@mui/material/Box";
// import Typography from "@mui/material/Typography";
// import Container from "@mui/material/Container";
// import { createTheme, ThemeProvider, styled } from "@mui/material/styles";
// import { useForm, Controller, useFieldArray } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import { createSearchParams, useNavigate, useSearchParams } from "react-router-dom";
// import { Autocomplete, Button, CircularProgress, FormControl, MenuItem, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, useMediaQuery } from "@mui/material";
// import { LoadingButton } from "@mui/lab";
// import PopupModal from "./components/PopupModal";
// import { useDispatch, useSelector } from "react-redux";
// import { decrementIndex, incrementIndex, saveputawayitems, updateIndex, updateRecevingItems } from "./redux/slices/requests";
// import { useSnackbar } from "notistack";
// import { handleStatusOnDate } from "./utils/handleStatusChangeonDate";
// import ExpiryPopupModal from "./components/expirymessagePopup";
// import dayjs from "dayjs";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { DateField } from "@mui/x-date-pickers/DateField";
// import { Close } from "@mui/icons-material";
// import TextField from "./components/CustomTextField";
// import Select from "./components/CustomSelect";
// const TableCellNew = styled(TableCell)(({ theme }) => ({
//   "&": {
//     borderBottom: "none",
//   },
// }));

// const schema = yup.object().shape({
//   itemDetails: yup.array().of(
//     yup.object().shape({
//       itemQuantity: yup.number(),
//       orderType: yup.string(),
//       quantity: yup
//         .mixed() // Use mixed type to handle different value types
//         .test("valid-quantity", "Enter a valid Quantity", function (value) {
//           if (value === "") {
//             value = NaN;
//           }
//           if (isNaN(value)) {
//             return true;
//           }
//           console.log(this.parent.itemQuantity, this.parent.orderType);
//           if (this.parent.itemQuantity < value && this.parent.orderType === "transferorder") {
//             return this.createError({ path: "quantity", message: `Quantity should not exceed ${this.parent.itemQuantity}` });
//           }
//           // Allow 0 as a valid value
//           return true;
//         }),
//       //   uomNumber: yup.string().test("required-if-quantity-not-zero", "UOM Number is required", function (value) {
//       //     const quantity = this.parent.quantity;
//       //     if (quantity === 0 || isNaN(quantity) || quantity === "") {
//       //       return true;
//       //     }
//       //     if (quantity > 0) {
//       //       return this.createError({ path: "uomNumber", message: "uomNumber is required" });
//       //     }
//       //     return true;
//       //   }),
//       //   status: yup.string().test("required-if-quantity-not-zero", "Status Text is required", function (value) {
//       //     const quantity = this.parent.quantity;
//       //     if (quantity === 0 || isNaN(quantity) || quantity === "") {
//       //       return true;
//       //     }
//       //     if (quantity > 0) {
//       //       return this.createError({ path: "status", message: "status is required" });
//       //     }
//       //     return true;
//       //   }),
//       expirydate: yup.string().test("valid-expiration", "Exp Date is required", function (value) {
//         const quantity = this.parent.quantity;
//         const thrashHoldDays = this.parent.thrashHoldDays;
//         if (quantity === 0 || isNaN(quantity) || quantity === "") {
//           return true;
//         }

//         if (!thrashHoldDays) {
//           return true;
//         }
//         if (quantity > 0 && !value) {
//           return this.createError({ path: "Date", message: "expiry Date is required" });
//         }
//         // if (!/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
//         //   return this.createError({ path: "expirydate", message: "Invalid Exp Date format (MM/DD/YYYY)" });
//         // }
//         return true;
//       }),
//     })
//   ),
// });

// const defaultTheme = createTheme();

// export default function PickingScreen() {
//   const [modalOpen, setModalOpen] = useState(false);
//   const navigate = useNavigate();
//   const handleOpenModal = () => {
//     setModalOpen(true);
//   };

//   const isSmallScreen = useMediaQuery(defaultTheme.breakpoints.down("sm"));
//   const { allItems, index, putawayItems } = useSelector((state) => state.requests);
//   const [itemUpcCode, setitemUpcCode] = useState("");
//   const [uomNumbers, setUomNumbers] = useState([]);
//   const [itemImgUrl, setItemImgUrl] = useState("");
//   const [popUpMessage, setPopupmessage] = useState("");
//   const [popupModal, setPopupModal] = useState(false);
//   const [removeItemModal, setRemoveItemModal] = useState(false);
//   const [showUpc, setShowUpc] = useState(false);
//   const [removeItem, setRemoveItem] = useState({
//     data: {},
//     index: 0,
//   });
//   const [keyPress, setkeyPress] = useState();
//   const onPopupClose = () => {
//     setPopupModal(false);
//   };
//   const onRemoveItemModalClose = () => {
//     setRemoveItemModal(false);
//   };
//   const { enqueueSnackbar } = useSnackbar();
//   const handleCloseModal = () => {
//     setModalOpen(false);
//   };
//   const [searchParams, setSearchParams] = useSearchParams();

//   let scriptId = searchParams.get("script") || "";
//   let deploy = searchParams.get("deploy") || "";

//   const handleConfirm = () => {
//     navigate({
//       pathname: window.location.pathname,
//       search: createSearchParams({
//         script: scriptId,
//         deploy: 1,
//       }).toString(),
//     });
//     handleCloseModal();
//   };

//   const defaultValues = useMemo(
//     () => ({
//       itemDetails: putawayItems[index] || [
//         {
//           status: "Good",
//           quantity: allItems?.data[index]?.quantity || "",
//           uomNumber: "",
//           thrashHoldDays: Number(allItems?.data[index]?.threshHoldExpirationDate),
//           itemQuantity: allItems?.data[index]?.itemQuantity,
//           orderType: allItems?.data[index]?.orderType,
//         },
//       ],
//     }),
//     [allItems?.data, putawayItems, index]
//   );

//   const {
//     control,
//     handleSubmit,
//     watch,
//     reset,
//     setValue,
//     trigger,
//     formState: { errors, isSubmitting, isValid },
//   } = useForm({
//     resolver: yupResolver(schema),
//     mode: "onBlur",
//     defaultValues,
//   });
//   const values = watch();
//   const dispatch = useDispatch();
//   const appendRow = () => {
//     append({
//       status: "Good",
//       quantity: allItems?.data[index]?.quantity || "",
//       uomNumber: allItems?.data[index]?.purchaseUnit,
//       expirydate: "",
//       thrashHoldDays: Number(allItems?.data[index]?.threshHoldExpirationDate) || 0,
//       itemQuantity: allItems?.data[index]?.itemQuantity,
//       orderType: allItems?.data[index]?.orderType,
//     });
//   };
//   const handleRemoveAll = () => {
//     setValue("itemDetails", []);
//   };
//   const formatData = () => {
//     const { itemDetails } = values;
//     const ItemData = [];
//     for (let i = 0; i < itemDetails?.length; i++) {
//       let expiryDate = itemDetails[i]?.expirydate; // Get the Exp Date

//       if (!expiryDate && allItems?.data[index]?.threshHoldExpirationDate && itemDetails[i]?.quantity != 0) {
//         enqueueSnackbar("Enter a valid Expiry Date", { variant: "error" });
//         return;
//       }

//       let formattedDate = "";

//       // Convert the expiryDate to a Date object
//       if (expiryDate) {
//         expiryDate = new Date(expiryDate);
//         // Format the date into "MM/DD/YYYY" format
//         formattedDate = expiryDate.toLocaleDateString("en-US", {
//           month: "2-digit",
//           day: "2-digit",
//           year: "numeric",
//         });
//       }
//       let data = {
//         ...allItems?.data[index],
//         itemId: allItems?.data[index]?.itemId,
//         itemName: allItems?.data[index]?.displayname,
//         quantity: itemDetails[i]?.quantity,
//         expirydate: formattedDate,
//         status: itemDetails[i]?.status,
//         statusId: allItems?.inventorystatues?.find((status) => status.name === itemDetails[i]?.status)?.statusId || "",
//         transaction: allItems?.data[index]?.recordId,
//         uomNumber: itemDetails[i]?.uomNumber,
//         uomId: uomNumbers?.find((obj) => obj.name === itemDetails[i]?.uomNumber)?.internalId || "",
//       };

//       ItemData.push(data);
//     }
//     return ItemData;
//   };
//   const handleSearch = () => {
//     let SortedItems = [...allItems?.data];
//     const itemToMove = SortedItems.findIndex((item) => item.itemUpcCode === itemUpcCode);

//     // If a matching item is found
//     if (itemToMove > -1) {
//       // Remove the item from its current position in the array

//       dispatch(updateIndex(itemToMove));
//     } else {
//       enqueueSnackbar("Item not on this PO", { variant: "error" });
//     }
//   };
//   const handleBack = () => {
//     if (Number(index) !== 0) {
//       const ItemData = formatData();
//       dispatch(saveputawayitems({ index, item: ItemData }));
//       reset({
//         itemDetails: putawayItems[index - 1] || [
//           {
//             status: "Good",
//             quantity: allItems?.data[index - 1]?.quantity,
//             uomNumber: allItems?.data[index - 1]?.purchaseUnit,
//             expirydate: allItems?.data[index - 1]?.expirydate || "",
//             thrashHoldDays: Number(allItems?.data[index - 1]?.threshHoldExpirationDate) || 0,
//             itemQuantity: allItems?.data[index]?.itemQuantity,
//             orderType: allItems?.data[index]?.orderType,
//           },
//         ],
//       });
//       dispatch(decrementIndex());
//     }
//   };
//   const handleNext = () => {
//     if (Number(index) !== allItems?.data?.length - 1) {
//       reset({
//         itemDetails: putawayItems[index + 1] || [
//           {
//             status: "Good",
//             quantity: allItems?.data[index + 1]?.quantity || "",
//             uomNumber: allItems?.data[index + 1]?.purchaseUnit,
//             expirydate: "",
//             thrashHoldDays: Number(allItems?.data[index + 1]?.threshHoldExpirationDate) || 0,
//             itemQuantity: allItems?.data[index]?.itemQuantity,
//             orderType: allItems?.data[index]?.orderType,
//           },
//         ],
//       });
//       const ItemData = formatData();
//       dispatch(saveputawayitems({ index, item: ItemData }));
//       dispatch(incrementIndex());
//     }
//   };
//   const handleCompletPick = async () => {
//     try {
//       navigate({
//         pathname: window.location.pathname,
//         search: createSearchParams({
//           script: scriptId,
//           deploy: deploy,
//           completePick: true,
//         }).toString(),
//       });
//       const ItemData = formatData();
//       dispatch(saveputawayitems({ index, item: ItemData }));
//     } catch (error) {
//       console.log({ error });
//     }
//   };
//   const handleStatus = (e, ind) => {
//     const expirationDate = e.target.value;
//     const thresholddate = Number(allItems?.data[index]?.threshHoldExpirationDate);

//     const status = handleStatusOnDate(thresholddate, expirationDate);
//     if (status === "Due to Expire") {
//       setPopupmessage("Move this item(s) to Quarantine");
//       setValue(`itemDetails.${ind}.status`, status);
//       trigger(`itemDetails.${ind}.status`);
//       setPopupModal(true);
//     } else if (status === "Expired") {
//       setPopupmessage("Move this item(s) to Quarantine");
//       setValue(`itemDetails.${ind}.status`, status);
//       trigger(`itemDetails.${ind}.status`);
//       setPopupModal(true);
//     }
//   };
//   useEffect(() => {
//     if (allItems?.data?.length > 0) {
//       reset({
//         itemDetails: putawayItems[index] || [
//           {
//             status: allItems?.data[index]?.status || "Good",
//             quantity: allItems?.data[index]?.quantity || "",
//             uomNumber: allItems?.data[index]?.purchaseUnit,
//             expirydate: allItems?.data[index]?.expirydate || "",
//             thrashHoldDays: Number(allItems?.data[index]?.threshHoldExpirationDate) || 0,
//             itemQuantity: allItems?.data[index]?.itemQuantity,
//             orderType: allItems?.data[index]?.orderType,
//           },
//         ],
//       });
//       console.log("aaaaaaaa", allItems?.data);
//       console.log("UOMNUMBERS", allItems?.data[index]?.uomNumbers);
//       let uniqueUomNumbers = [];
//       if (allItems?.data[index]?.uomNumbers) {
//         allItems?.data[index]?.uomNumbers?.forEach((obj) => {
//           let itemFound = uniqueUomNumbers.findIndex((item) => item.internalId === obj.internalId);
//           if (itemFound < 0) {
//             uniqueUomNumbers.push(obj);
//           }
//         });
//         console.log({ uniqueUomNumbers });
//         if (uniqueUomNumbers?.length) {
//           setUomNumbers(uniqueUomNumbers);
//         }
//       }
//       if (allItems?.data[index]?.itemImage) {
//         const image = allItems?.data[index]?.itemImage;
//         const regex = /src="([^"]+\.(jpg|png|gif|jpeg|bmp|svg|...))[^"]*"/;

//         const match = image.match(regex);

//         if (match) {
//           const src = match[1];
//           setItemImgUrl(src);
//         } else {
//           setItemImgUrl("");
//         }
//       }
//     }
//     // setFocus("serialNumber");
//   }, [allItems?.data, index]);

//   const handleDateChange = (e) => {
//     const newDate = e.$d;
//     let formattedDate = new Date(newDate);

//     const day = formattedDate.getDate().toString().padStart(2, "0");
//     const month = (formattedDate.getMonth() + 1).toString().padStart(2, "0");
//     const year = formattedDate.getFullYear();

//     console.log(`${month}/${day}/${year}`);

//     return `${month}/${day}/${year}`;
//   };
//   const onRemoveItemConfirm = () => {
//     remove(removeItem.index);
//     setRemoveItemModal(false);
//     setRemoveItem({
//       data: {},
//       index: 0,
//     });
//   };
//   const { fields, append, remove } = useFieldArray({
//     control, // control props comes from useForm (optional: if you are using FormContext)
//     name: "itemDetails", // unique name for your Field Array
//   });
//   console.log({ values, errors });
//   return (
//     <ThemeProvider theme={defaultTheme}>
//       {allItems?.data ? (
//         <>
//           <PopupModal isOpen={modalOpen} onClose={handleCloseModal} onConfirm={handleConfirm} message={"Do you want to cancel your Pick"} />
//           <ExpiryPopupModal isOpen={popupModal} onClose={onPopupClose} message={popUpMessage} />
//           <PopupModal isOpen={removeItemModal} onClose={onRemoveItemModalClose} onConfirm={onRemoveItemConfirm} message={"Are you sure you want to delete this row"} removeItem={removeItem} />
//           <Container component="main" sx={{ p: 0 }}>
//             {/* <Box
//               sx={{
//                 display: "flex",
//                 width: "100%",
//               }}
//             >
//               <TextField
//                 id="outlined-basic"
//                 fullWidth
//                 label="Search Item by Upc Code"
//                 name="itemUpcCode"
//                 value={itemUpcCode}
//                 onChange={(e) => setitemUpcCode(e.target.value)}
//                 inputProps={{
//                   style: {
//                     height: isSmallScreen ? "1px" : "10px",
//                     fontSize: isSmallScreen ? "10px" : "16px",
//                   },
//                 }}
//                 InputLabelProps={{
//                   style: {
//                     fontSize: isSmallScreen ? "10px" : "16px",
//                     marginTop: isSmallScreen ? "-4px" : "-4px",
//                     marginLeft: isSmallScreen ? "-4px" : "auto",
//                   },
//                 }}
//               />
//               <Button
//                 variant="contained"
//                 sx={{
//                   mx: 2,
//                   height: isSmallScreen ? "32px" : "40px",
//                   fontSize: isSmallScreen ? "10px" : "16px",
//                 }}
//                 onClick={handleSearch}
//               >
//                 Search
//               </Button>
//             </Box> */}
//             <Grid
//               container
//               spacing={1}
//               mt={5}
//               px={1}
//               py={isSmallScreen ? 0 : 5}
//               display={"flex"}
//               justifyContent={"flex-start"}
//               sx={{
//                 border: isSmallScreen ? "0px" : "1px solid rgba(0, 0, 0, 0.12)",
//                 borderRadius: "10px",
//               }}
//             >
//               <Grid
//                 display={"flex"}
//                 sx={{
//                   flexDirection: { xs: "row", sm: "column", md: "column" },
//                 }}
//                 width={!isSmallScreen ? "32%" : "100%"}
//                 justifyContent={"space-around"}
//                 flexDirection={"column"}
//                 marginTop={isSmallScreen ? "-20px" : "0px"}
//                 marginLeft={isSmallScreen ? "0px" : "0"}
//               >
//                 <Box
//                   sx={{
//                     mb: 3,
//                     width: isSmallScreen ? 90 : 300,
//                     overflow: "hidden",
//                   }}
//                 >
//                   {itemImgUrl ? (
//                     <img style={{ marginLeft: isSmallScreen ? "0px" : "-40px" }} src={itemImgUrl} width="100%" height="auto"></img>
//                   ) : (
//                     <img src={"https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/330px-No-Image-Placeholder.svg.png"} width="100%" height="auto"></img>
//                   )}
//                 </Box>
//                 <Box sx={{ ml: isSmallScreen ? 0 : 2 }}>
//                   <Typography
//                     sx={{
//                       fontSize: isSmallScreen ? "12px" : "20px",
//                       marginTop: isSmallScreen ? 5 : -8,
//                       fontWeight: "bold",
//                     }}
//                   >
//                     {" "}
//                     <strong>Sku :</strong> {" " + allItems?.data[index].itemName}
//                   </Typography>
//                   <Typography
//                     variant={isSmallScreen ? "body1" : "body2"}
//                     sx={{
//                       fontSize: isSmallScreen ? "12px" : "20px",
//                     }}
//                   >
//                     {" "}
//                     <strong>Left to Receive :</strong>
//                     {" " + allItems?.data[index].itemQuantity}
//                   </Typography>
//                   <Typography
//                     variant={isSmallScreen ? "body1" : "body2"}
//                     sx={{
//                       fontSize: isSmallScreen ? "12px" : "20px",
//                     }}
//                   >
//                     {" "}
//                     <strong>Uom :</strong>
//                     {" " + allItems?.data[index].purchaseUnit || ""}
//                   </Typography>
//                 </Box>
//               </Grid>
//               <Grid item width={!isSmallScreen ? "65%" : "100%"} marginTop={isSmallScreen ? "-20px" : "auto"}>
//                 <Box component="form" noValidate autoComplete="off">
//                   <Box sx={{ width: "100%" }}>
//                     {allItems?.data[index]?.isserial === "T" && (
//                       <Box sx={{ width: "100%", my: isSmallScreen ? 0 : 3 }}>
//                         <Typography>
//                           {" "}
//                           Recommended Receive location:
//                           {" " + allItems?.data[index].recommendedBin}
//                         </Typography>
//                       </Box>
//                     )}
//                     <Box sx={{ width: "100%", my: isSmallScreen ? 0 : 3, textAlign: isSmallScreen ? "center" : "left" }}>
//                       <Typography
//                         variant={isSmallScreen ? "auto" : "h4"}
//                         sx={{
//                           fontSize: isSmallScreen ? "14px" : "auto",
//                           fontWeight: isSmallScreen ? "600" : "auto",
//                           color: "grey",
//                         }}
//                       >
//                         {" "}
//                         {allItems?.data[index]?.displayname}
//                       </Typography>
//                     </Box>

//                     <TableContainer sx={{ marginTop: isSmallScreen ? "4px" : "auto" }}>
//                       <Table
//                         style={{ tableLayout: "fixed" }}
//                         size={isSmallScreen ? "small" : "medium"}
//                         // aria-label="caption table"
//                       >
//                         <TableHead>
//                           <TableRow>
//                             <TableCellNew align="center" sx={{ padding: { xs: "1px 4px", sm: "auto" }, fontWeight: 700, fontSize: { xs: "0.8rem", sm: "1.2rem" } }}>
//                               Qty
//                             </TableCellNew>
//                             <TableCellNew align="center" sx={{ padding: { xs: "1px 4px", sm: "auto" }, fontWeight: 700, fontSize: { xs: "0.8rem", sm: "1.2rem" } }}>
//                               UOM
//                             </TableCellNew>
//                             {allItems.data[index]?.threshHoldExpirationDate && (
//                               <TableCellNew align="center" sx={{ padding: { xs: "1px 4px", sm: "auto" }, fontWeight: 700, fontSize: { xs: "0.8rem", sm: "1.2rem" } }}>
//                                 Exp Date
//                               </TableCellNew>
//                             )}
//                             <TableCellNew align="center" sx={{ padding: { xs: "1px 4px", sm: "auto" }, fontWeight: 700, fontSize: { xs: "0.8rem", sm: "1.2rem" } }}>
//                               Status
//                             </TableCellNew>
//                           </TableRow>
//                         </TableHead>
//                         <TableBody>
//                           {fields.map((field, ind) => (
//                             <TableRow key={field.id}>
//                               <TableCellNew component="th" scope="row" sx={{ minWidth: isSmallScreen ? 0 : 150, padding: isSmallScreen ? "2px 4px" : "4px 5px" }}>
//                                 <Controller
//                                   name={`itemDetails.${ind}.quantity`}
//                                   control={control}
//                                   render={({ field }) => {
//                                     return (
//                                       <TextField
//                                         {...field}
//                                         size="small"
//                                         version="quantity"
//                                         type="number"
//                                         onChange={(e) => {
//                                           let inputValue = e.target.value;
//                                           //   trigger(`itemDetails.${ind}.uomNumber`);
//                                           field.onChange(Number(inputValue).toString());
//                                         }}
//                                         // label="Item Quantity"
//                                         inputProps={{ style: { marginLeft: isSmallScreen ? "0px" : "10px" } }}
//                                         InputLabelProps={
//                                           {
//                                             // style: {
//                                             // 	fontSize: isSmallScreen ? "10px" : "16px",
//                                             // 	marginTop: isSmallScreen ? "-4px" : "auto",
//                                             // 	marginLeft: isSmallScreen ? "-6px" : "0",
//                                             // },
//                                           }
//                                         }
//                                       />
//                                     );
//                                   }}
//                                 />
//                               </TableCellNew>
//                               <TableCellNew sx={{ minWidth: isSmallScreen ? 0 : 150, padding: isSmallScreen ? "2px 4px" : "4px 5px" }}>
//                                 {" "}
//                                 <Controller
//                                   name={`itemDetails.${ind}.uomNumber`}
//                                   fullWidth
//                                   size="small"
//                                   control={control}
//                                   render={({ field }) => {
//                                     return (
//                                       <Autocomplete
//                                         {...field}
//                                         key={"UomNumber" + ind}
//                                         id={`uomnumber-option-demo${ind}`}
//                                         autoHighlight
//                                         options={uomNumbers?.map((option) => option?.name)}
//                                         size="small"
//                                         onChange={(event, newValue) => {
//                                           field.onChange(newValue);

//                                           setValue(
//                                             `itemDetails[${ind}].uomId`, // Correct the syntax for setting a nested field
//                                             uomNumbers?.find((uom) => uom.name === newValue)?.internalId || "" // Set uomId to the internalId of the selected UOM
//                                           );
//                                         }}
//                                         getOptionLabel={(option) => uomNumbers?.find((status) => status.name === option)?.name || ""}
//                                         renderInput={(params) => (
//                                           <TextField
//                                             fullWidth
//                                             size="small"
//                                             id={`Uom${ind}`}
//                                             {...params}
//                                             version="autocomplete"
//                                             // label="UOM Number"
//                                             error={!!errors.uomNumbers}
//                                             helpertext={errors.uomNumbers?.message}
//                                             inputProps={{ ...params.inputProps }}
//                                             InputLabelProps={
//                                               {
//                                                 // style: {
//                                                 // 	fontSize: isSmallScreen ? "10px" : "16px",
//                                                 // 	marginTop: isSmallScreen ? "-2px" : "4px",
//                                                 // 	marginLeft: isSmallScreen ? "-4px" : "auto",
//                                                 // },
//                                               }
//                                             }
//                                           />
//                                         )}
//                                       />
//                                     );
//                                   }}
//                                 />
//                               </TableCellNew>

//                               {allItems.data[index]?.threshHoldExpirationDate && (
//                                 <TableCellNew component="th" scope="row" sx={{ minWidth: isSmallScreen ? 0 : 150, padding: isSmallScreen ? "2px 4px" : "4px 5px" }}>
//                                   <Controller
//                                     name={`itemDetails.${ind}.expirydate`}
//                                     control={control}
//                                     render={({ field }) => (
//                                       <LocalizationProvider dateAdapter={AdapterDayjs}>
//                                         <DateField
//                                           {...field}
//                                           onChange={(e) => {
//                                             const formattedDate = handleDateChange(e);
//                                             field.onChange(formattedDate);
//                                           }}
//                                           value={dayjs(field.value || null)}
//                                           sx={{
//                                             "& .MuiInputBase-input": {
//                                               padding: { xs: "6px", sm: "10px" },
//                                               border: "2px solid #000000",
//                                               borderRadius: "4px",
//                                               fontWeight: 700,
//                                               fontSize: { xs: "12px", sm: "18px" },
//                                               minWidth: "50px",
//                                             },
//                                             "& .MuiFormLabel-root": {
//                                               fontSize: "12px",
//                                               fontWeight: 700,
//                                               margin: "0",
//                                               m: "5px",
//                                               position: "absolute",
//                                               top: 0,
//                                               left: 0,
//                                               transform: "translate(0px, -10px)",
//                                             },
//                                           }}
//                                           inputProps={{ style: isSmallScreen ? { fontSize: "10px" } : null }}
//                                           onKeyDown={(e) => setkeyPress(e.key)}
//                                           onBlur={(e) => handleStatus(e, ind)}
//                                           // label="Exp Date"
//                                           disabled={!allItems.data[index]?.threshHoldExpirationDate}
//                                           error={!!errors.expirydate}
//                                           slotProps={{ textField: {} }}
//                                         />
//                                       </LocalizationProvider>
//                                     )}
//                                   />
//                                 </TableCellNew>
//                               )}
//                               <TableCellNew sx={{ minWidth: isSmallScreen ? 0 : 150, padding: isSmallScreen ? "2px 4px" : "4px 5px" }}>
//                                 <Box sx={{ display: "flex", justifyContent: "start", alignItems: "center" }}>
//                                   {" "}
//                                   <FormControl variant="outlined" sx={{ width: "100%", flex: 3 }}>
//                                     {/* <InputLabel
// 																		id="demo-simple-select-outlined-label"
// 																		sx={{
// 																		fontSize: isSmallScreen ? "10px" : "16px",
// 																		marginTop: isSmallScreen ? "-12px" : "0",
// 																		marginLeft: isSmallScreen ? "-8px" : "0",
// 																		}}
// 																	>
// 																		Status
// 																	</InputLabel> */}
//                                     <Controller
//                                       name={`itemDetails.${ind}.status`}
//                                       fullWidth
//                                       defaultValue=""
//                                       control={control}
//                                       render={({ field }) => (
//                                         <Select
//                                           labelId="demo-simple-select-label"
//                                           fullWidth
//                                           variant="outlined"
//                                           size="small"
//                                           status="status"
//                                           id="demo-simple-select"
//                                           sx={{
//                                             // Add the same inline styles for width, height, fontSize, and padding here
//                                             height: isSmallScreen ? "3em" : "3.3em",
//                                             fontSize: isSmallScreen ? "8px" : "auto",
//                                             padding: { xs: "3px", sm: "auto" },
//                                           }}
//                                           // sx={{ width: "100%" }}
//                                           value={field.value} // Set the value of the Select to the form field value
//                                           onChange={(e) => {
//                                             if (e.target.value === "Expired" || e.target.value === "Due to Expire") setValue(`itemDetails.${ind}.expirydate`, "");
//                                             if (e.target.value === "Damaged") {
//                                               setPopupmessage("Move this item(s) to Quarantine");
//                                               setValue(`itemDetails.${ind}.status`, e.target.value);
//                                               trigger(`itemDetails.${ind}.status`);
//                                               setPopupModal(true);
//                                             }
//                                             field.onChange(e.target.value);
//                                           }}
//                                           inputProps={{
//                                             style: {
//                                               // Add the same inline styles for width, height, fontSize, and padding here
//                                               height: isSmallScreen ? "3em" : "3.3em",
//                                               fontSize: isSmallScreen ? "8px" : "auto",
//                                               padding: "0px",
//                                             },
//                                           }}
//                                           error={!!errors.status}
//                                           helpertext={errors.status?.message}
//                                         >
//                                           {allItems?.inventorystatues?.map((item) => (
//                                             <MenuItem
//                                               key={item?.name}
//                                               value={item?.name}
//                                               sx={{
//                                                 fontSize: { xs: "12px", sm: "16px" },
//                                                 minHeight: { x: "38px", sm: "45px" },
//                                                 padding: "0px 10px !important",
//                                               }}
//                                             >
//                                               {item?.name}
//                                             </MenuItem>
//                                           ))}
//                                         </Select>
//                                       )}
//                                     />
//                                   </FormControl>
//                                   {/* <Button sx={{padding:"0px", justifyContent:"start",flex:1, "& .MuiTouchRipple-root":{width:"10px"}}}> */}
//                                   <Close
//                                     sx={{ fontSize: { xs: "10px", sm: "auto" }, color: "black" }}
//                                     onClick={() => {
//                                       setRemoveItem({
//                                         data: values.itemDetails[ind],
//                                         index: ind,
//                                       });
//                                       setRemoveItemModal(true);
//                                     }}
//                                   />
//                                   {/* </Button> */}
//                                 </Box>
//                               </TableCellNew>
//                             </TableRow>
//                           ))}
//                         </TableBody>
//                       </Table>
//                       <Box sx={{ display: "flex", justifyContent: "center", my: isSmallScreen ? 1 : 3 }}>
//                         <Button
//                           variant="contained"
//                           onClick={appendRow}
//                           sx={{
//                             height: isSmallScreen ? "30px" : "40px",
//                             fontSize: { xs: "12px", sm: "16px" },
//                             mr: 3,
//                             border: "2px solid #000000",
//                             background: "#000000",
//                             fontWeight: 700,
//                           }}
//                         >
//                           + Add Row
//                         </Button>
//                         {/* <Button
// 													variant="outlined"
// 													color="success"
// 													onClick={handleRemoveAll}
// 													sx={{
// 														height: isSmallScreen ? "30px" : "40px",
// 														fontSize: isSmallScreen ? "10px" : "16px",
// 													}}
// 												>
// 													Clear Row
// 												</Button> */}
//                       </Box>
//                     </TableContainer>
//                   </Box>
//                   <Box>
//                     <Typography align="center" variant={isSmallScreen ? "body2" : "h6"} pt={isSmallScreen ? 1 : 3}>
//                       {" "}
//                       <strong>
//                         From PO / TO #{" " + allItems?.data[index].id}
//                         {allItems?.data[index]?.orderType === "purchaseorder" ? ` ${allItems?.data[index]?.vendorName}` : null}
//                       </strong>
//                     </Typography>
//                   </Box>
//                   <Box
//                     sx={{
//                       mt: 2,
//                       width: "100%",
//                       display: "flex",
//                       justifyContent: "center",
//                       gap: "10px",
//                     }}
//                   >
//                     <Button
//                       sx={{
//                         fontSize: { xs: "10px", sm: "16px" },
//                         // width: "50%",
//                         fontWeight: 700,
//                         background: "#3b394a",
//                         color: "white !important",
//                         ":hover": { background: "#3b394a", color: "white !important" },
//                       }}
//                       // variant="contained"
//                       variant="outlined"
//                       // color="primary"
//                       disabled={Number(index) === 0}
//                       onClick={() => handleBack()}
//                     >
//                       Prev Item
//                     </Button>
//                     {Number(index) === allItems?.data?.length - 1 ? (
//                       <LoadingButton
//                         loading={isSubmitting}
//                         sx={{ width: "50%", background: "black", color: "white !important", ":hover": { background: "black" } }}
//                         // variant="contained"
//                         variant="outlined"
//                         // disabled={
//                         //   !isValid
//                         //   // !!errors.Items[index]
//                         // }
//                         color="primary"
//                         onClick={handleSubmit(handleCompletPick)}
//                       >
//                         Complete
//                       </LoadingButton>
//                     ) : (
//                       <LoadingButton
//                         loading={isSubmitting}
//                         sx={{
//                           fontSize: { xs: "10px", sm: "16px" },
//                           // width: "50%",
//                           // mr: 2,
//                           fontWeight: 700,
//                           background: "#3b394a",
//                           color: "white !important",
//                           ":hover": { background: "#3b394a", color: "white !important" },
//                         }}
//                         variant="outlined"
//                         color="primary"
//                         // disabled={!isValid}
//                         onClick={handleSubmit(handleNext)}
//                       >
//                         Next Item
//                       </LoadingButton>
//                     )}
//                   </Box>
//                   <Box
//                     sx={{
//                       mt: 2,
//                       width: "100%",
//                       display: "flex",
//                       justifyContent: "center",
//                       gap: "10px",
//                     }}
//                   >
//                     <>
//                       <Button
//                         sx={{
//                           fontSize: { xs: "13px", sm: "16px" },
//                           width: "100%",
//                           fontWeight: 700,
//                           padding: 0,
//                           flex: 1,
//                           padding: "5px 10px",
//                           background: "#e1b589",
//                           color: "red",
//                           // height: "20px",
//                         }}
//                         variant="contained"
//                         color="error"
//                         onClick={handleOpenModal}
//                       >
//                         Cancel
//                       </Button>
//                       <LoadingButton
//                         loading={isSubmitting}
//                         sx={{
//                           width: "100%",
//                           // height: "20px",
//                           fontWeight: 700,
//                           fontSize: { xs: "13px", sm: "16px" },
//                           padding: "5px 10px",
//                           flex: 1,
//                           background: "#103c3f",
//                           color: "white",
//                         }}
//                         // variant="contained"
//                         disabled={
//                           !isValid
//                           // !!errors.Items[index]
//                         }
//                         variant="contained"
//                         color="primary"
//                         onClick={handleSubmit(handleCompletPick)}
//                       >
//                         Finish Receipt
//                       </LoadingButton>
//                     </>
//                   </Box>
//                   <Box display={"flex"} justifyContent={"center"} alignItems={"center"} flexDirection={"column"} mt={3}>
//                     {/* <Button
// 											sx={{ border: "2px solid black", background: "white", color: "black", width: "80%", padding: "5px 20px", fontSize: "20px", borderRadius: "12px" }}
// 											onClick={() => setShowUpc(!showUpc)}
// 										>
// 											Search Upc
// 										</Button> */}
//                     {/* {showUpc && ( */}
//                     <TextField
//                       fullWidth
//                       label="Search Item by Upc Code"
//                       name="itemUpcCode"
//                       value={itemUpcCode}
//                       sx={{
//                         mt: 3,
//                         width: "80%",
//                         "& .MuiOutlinedInput-root": {
//                           padding: "16px !important",
//                         },
//                       }}
//                       onChange={(e) => setitemUpcCode(e.target.value)}
//                       onBlur={handleSearch}
//                       inputProps={{
//                         sx: {
//                           width: "80%",
//                           fontSize: isSmallScreen ? "14px" : "16px",
//                           fontWeight: 700,
//                           color: "#000000",
//                         },
//                       }}
//                       InputLabelProps={{
//                         sx: {
//                           fontSize: isSmallScreen ? "14px" : "16px",
//                           fontWeight: 700,
//                           color: "#000000",
//                         },
//                       }}
//                     />
//                     {/* )} */}
//                   </Box>
//                 </Box>
//               </Grid>
//             </Grid>
//             <CssBaseline />
//           </Container>
//         </>
//       ) : (
//         <Box sx={{ display: "flex", justifyContent: "center", mt: "5" }} align="center">
//           <CircularProgress size={200} sx={{ mt: 30 }} />
//         </Box>
//       )}
//     </ThemeProvider>
//   );
// }
