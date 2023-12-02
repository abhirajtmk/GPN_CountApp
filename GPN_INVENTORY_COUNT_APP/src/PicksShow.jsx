// import React, { useState } from "react";
// import CssBaseline from "@mui/material/CssBaseline";
// import Link from "@mui/material/Link";
// import Box from "@mui/material/Box";
// import Typography from "@mui/material/Typography";
// import Container from "@mui/material/Container";
// import { createTheme, ThemeProvider } from "@mui/material/styles";
// import { createSearchParams, useNavigate, useSearchParams } from "react-router-dom";
// import { Button, CircularProgress, useMediaQuery } from "@mui/material";
// import PopupModal from "./components/PopupModal";
// import PickingCompleteTables from "./components/PickCompleteTable";
// import { useDispatch, useSelector } from "react-redux";
// import { FullfillmentRequestActions, resetStore } from "./redux/slices/requests";
// import { useSnackbar } from "notistack";
// import SubmitPopupModal from "./components/submitModel";
// import { LoadingButton } from "@mui/lab";

// function Copyright(props) {
//   return (
//     <Box alignItems={"center"} display={"flex"} flexDirection={"column"} justifyContent={"center"}>
//       <img src="https://6766093-sb1.app.netsuite.com/core/media/media.nl?id=2712358&c=6766093_SB1&h=orcbCQ6m4jSlzuFkFpNn9eHVVxBLHr-uhNL8dzvFPJSZBKrB&fcts=20231020001408&whence=" width={100} height={100} style={{ marginBottom: -50 }} />
//       {/* <Typography variant="body2" color="text.secondary" align="center" {...props}>
//         {"Copyright © "}
//         <Link color="inherit" href="https://www.hivebrands.com/">
//           Hive Brands
//         </Link>{" "}
//         {new Date().getFullYear()}
//         {"."}
//       </Typography> */}
//     </Box>
//   );
// }

// // TODO remove, this demo shouldn't need to reset the theme.

// const defaultTheme = createTheme();

// export default function PickingComplete() {
//   const products = JSON.parse(localStorage.getItem("products"));
//   const [isLoading, setIsLoading] = useState(false);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [submitOpen, setSubmitOpen] = useState(false);
//   const [responseData, setResponseDate] = useState([]);
//   const navigate = useNavigate();
//   const handleOpenModal = () => {
//     setModalOpen(true);
//   };
//   const isSmallScreen = useMediaQuery(defaultTheme.breakpoints.down("sm"));
//   const [searchParams, setSearchParams] = useSearchParams();
//   const { sendItemRequest } = FullfillmentRequestActions;
//   let scriptId = searchParams.get("script") || "";
//   let deploy = searchParams.get("deploy") || "";

//   const handleCloseModal = () => {
//     setModalOpen(false);
//   };
//   const { itemReceivingQuantity, allItems } = useSelector((state) => state.requests);

//   const handleSubmitCloseModal = () => {
//     setSubmitOpen(false);
//     navigate({
//       pathname: window.location.pathname,
//       search: createSearchParams({
//         script: scriptId,
//         deploy: deploy,
//       }).toString(),
//     });
//   };

//   const handleConfirm = () => {
//     // Perform the action you want to do when "Yes" is clicked
//     navigate({
//       pathname: window.location.pathname,
//       search: createSearchParams({
//         script: scriptId,
//         deploy,
//       }).toString(),
//     });
//   };
//   const dispatch = useDispatch();
//   const { sendRequest } = FullfillmentRequestActions;
//   const { enqueueSnackbar } = useSnackbar();
//   const handlePickSubmit = async () => {
//     setIsLoading(true);
//     try {
//       // Use map to create a new array
//       const productArrays = Object.values(products || {});
//       let newArray = [];
//       productArrays.map((obj) => {
//         // Create a copy of the object without the specified field
//         newArray.push(...obj);
//       });

//       await dispatch(sendItemRequest(JSON.stringify(newArray))).then((response) => {
//         if (response?.payload?.data?.data[0]?.success) {
//           setResponseDate(response?.payload?.data?.data);
//           setTimeout(() => {
//             setIsLoading(false);
//             dispatch(resetStore());
//             setSubmitOpen(true);
//           }, 2000);
//         } else {
//           enqueueSnackbar(response?.payload?.data?.message || "There's some error Try Again!", { variant: "error" });
//           setIsLoading(false);
//         }
//       });
//     } catch (error) {
//       setIsLoading(false);
//       alert(error?.message || "Some Error Occured");
//     }
//   };

//   return (
//     <ThemeProvider theme={defaultTheme}>
//       <PopupModal isOpen={modalOpen} onClose={handleCloseModal} onConfirm={handleConfirm} message={"Do you want to cancel your Pick"} />
//       <SubmitPopupModal isOpen={submitOpen} onClose={handleSubmitCloseModal} tableData={responseData} />

//       <Container
//         component="main"
//         sx={{
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           flexDirection: "column",
//         }}
//       >
//         <Box
//           sx={{
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//             border: "1px solid rgba(0, 0, 0, 0.12)",
//             borderRadius: "10px",
//             padding: isSmallScreen ? "10px" : "30px 60px",
//             width: "100%",
//           }}
//         >
//           <Typography variant="h4" color="text.secondary" align="center">
//             Save Putaway
//           </Typography>
//           <Box sx={{ width: "100%" }} pt={4}>
//             <scrollbars>
//               <PickingCompleteTables itemlength={allItems?.data?.length} />
//             </scrollbars>
//           </Box>

//           <Box
//             sx={{
//               mt: 5,
//               width: "100%",
//               display: "flex",
//               flexDirection: "row",
//               justifyContent: "center",
//             }}
//           >
//             {!isLoading && (
//               <Button
//                 sx={{ width: isSmallScreen ? "50%" : "30%", mr: 5 }}
//                 // variant="contained"
//                 variant="outlined"
//                 color="error"
//                 onClick={handleOpenModal}
//               >
//                 Cancel Putaway
//               </Button>
//             )}

//             <LoadingButton sx={{ width: "30%" }} loading={isLoading} variant="outlined" color="primary" onClick={() => handlePickSubmit()}>
//               Submit Putaway
//             </LoadingButton>
//           </Box>
//         </Box>

//         <CssBaseline />

//         <Copyright sx={{ mt: 5 }} />
//       </Container>
//     </ThemeProvider>
//   );
// }
