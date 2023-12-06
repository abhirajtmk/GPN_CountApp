import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Container,
  Divider,
  MenuItem,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  useMediaQuery,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import CustomSelect from "./components/CustomSelect";
import { RequestActions } from "./redux/slices/requests";
import { useEffect, useState } from "react";
import axios from "axios";
import CustomizedInputsStyled from "./components/CustomTextField";
import ItemInputFormTable from "./components/ItemInputFormTable";
import DeleteOutline from "@mui/icons-material/DeleteOutline";
import ItemsAccordion from "./components/ItemsAccordion";
import { get } from "lodash";

const CssTableCell = styled(TableCell)((props) => ({
  padding: 2,
}));

const schema = yup.object({
  location: yup.string(),
});

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function HomePage() {
  const [pageSize, setPageSize] = useState(5);
  const [pageNum, setPageNum] = useState(0);
  const [isLastPage, setIsLastPage] = useState(false);
  const isSmallScreen = useMediaQuery(defaultTheme.breakpoints.down("md"));
  const { allLocations } = useSelector((state) => state.requests);
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const { fetchLocations, submitCount, fetchInventoryCountDetails } =
    RequestActions;
  const {
    control,
    setFocus,
    handleSubmit,
    setValue,
    getValues,
    trigger,
    watch,
    formState: { isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      location: localStorage.getItem("Location") || "1",
    },
  });
  const values = watch();

  let d = {
    data: {
      "12279_9": "1",
      "12279_9_name": "210000010852",
      "15753_9": "1",
      "15753_9_name": "2100000251001",
      "15585_9": "1",
      "15585_9_name": "210000031737",
      "15386_9": "1",
      "15386_9_name": "210000033456",
      "13409_9": "1",
      "13409_9_name": "210000030006",
      "16421_9": "3",
      "16421_9_name": "2100000372997",
      "16286_9": "1",
      "16286_9_name": "210000038964",
      "16317_9": "1",
      "16317_9_name": "210000039005",
      "16358_9": "1",
      "16358_9_name": "210000039063",
    },
    message: "found",
    status: 200,
  };

  const { fields, append, remove } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: "itemDetails", // unique name for your Field Array
  });
  const fetchExistingInventory = async () => {
    console.log("before fetch");
    setIsLastPage(false);
    let existingIvt = await axios.get(
      `${
        window.location.href
      }&type=getCurrentInventoryOfLocation&location=${getValues(
        "location"
      )}&pageNum=0&pageSize=${pageSize}`
    );
    console.log("after fetch");
    console.log(existingIvt);
    let {
      data: { data, isLast },
    } = existingIvt;
    console.log("data");
    console.log(data);
    if (data && Object.keys(data).length) {
      console.log("data");
      console.log(data);
      setValue("itemDetails", []);
      Object.keys(data).map((key, i) => {
        // console.log( key );
        if (!key.includes("_name")) {
          console.log("key not includes");
          console.log(data[`${key}_name`]);
          console.log(`quantity`, data[key]);
          console.log("itemId", key.split("_")[0]);
          append({
            itemName: data[`${key}_name`],
            quantity: Number(data[key]),
            itemId: key.split("_")[0],
            status: "Pending",
          });
        }
      });
      setPageNum(1);
      console.log("isLast", isLast);
      console.log("pageNum", pageNum);
      if (Boolean(isLast)) {
        setIsLastPage(true);
      }
    } else
      enqueueSnackbar("No Data Found!", {
        variant: "error",
      });
    // let foundIndex = ItemDetails.findIndex((item) => item.itemName === itemname);
    // setFocus("itemName");
    // if (foundIndex !== -1) {
    //   // If the item exists, increment its quantity by one
    //   let qty = Number(getValues(`itemDetails.${foundIndex}.quantity`)) + 1;
    //   console.log({ qty });
    //   setValue(`itemDetails.${foundIndex}.quantity`, qty);
    //   trigger(`itemDetails.${foundIndex}.quantity`);
    setFocus("itemName");
  };
  const onSubmit = async () => {
    try {
      const items = getValues("itemDetails");
      const locationId = getValues("location");
      console.log("location");
      console.log(locationId);
      const locationName = allLocations.find(
        (loc) => loc?.id === locationId
      )?.name;
      const response = await dispatch(submitCount({ items, locationName }));

      if (response?.payload?.data?.status === 200) {
        enqueueSnackbar(
          response?.payload?.data?.message || "Custom Record created",
          {
            variant: "success",
          }
        );
        setValue("itemDetails", []);
      } else {
        enqueueSnackbar("Failed to get request", {
          variant: "error",
        });
      }
    } catch (error) {
      enqueueSnackbar(error?.message || "Failed to get request", {
        variant: "error",
      });
    }
  };

  const loadMoreInventory = async () => {
    try {
      let existingIvt = await axios.get(
        `${
          window.location.href
        }&type=getCurrentInventoryOfLocation&location=${getValues(
          "location"
        )}&pageNum=${pageNum}&pageSize=${pageSize}`
      );
      console.log("after fetch");
      console.log(existingIvt);
      let {
        data: { data, isLast },
      } = existingIvt;
      console.log("data");
      console.log(data);
      if (data && Object.keys(data).length) {
        console.log("data");
        console.log(data);
        Object.keys(data).map((key, i) => {
          // console.log( key );
          if (!key.includes("_name")) {
            console.log("key not includes");
            console.log(data[`${key}_name`]);
            console.log(`quantity`, data[key]);
            console.log("itemId", key.split("_")[0]);
            append({
              itemName: data[`${key}_name`],
              quantity: Number(data[key]),
              itemId: key.split("_")[0],
              status: "Pending",
            });
          }
        });
        setPageNum((prev) => prev + 1);
        console.log("isLast", isLast);
        console.log("pageNum", pageNum);
        if (Boolean(isLast)) {
          setIsLastPage(true);
        }
      }
    } catch (error) {
      enqueueSnackbar(error?.message || "Failed to get request", {
        variant: "error",
      });
    }
  };

  const isItemExist = async (itemname) => {
    try {
      if (itemname) {
        const response = await axios.get(
          `${window.location.href}&type=finditem&itemName=${itemname}`
        );
        // console.log("hi")
        console.log(response);
        if (response.status === 200) {
          if (response.data?.found) {
            enqueueSnackbar("Item Found Successfully", { variant: "success" });
            const ItemDetails = getValues("itemDetails");
            let foundIndex = ItemDetails.findIndex(
              (item) =>
                item.itemName === itemname || item.serialName === itemname
            );
            setFocus("itemName");
            if (foundIndex !== -1) {
              // If the item exists, increment its quantity by one
              //if item is non serial then increase quantity
              let isSerial = Boolean(
                getValues(`itemDetails.${foundIndex}.isSerialItem`)
              );
              console.log("isSerial", isSerial);
              if (!isSerial) {
                let qty =
                  Number(getValues(`itemDetails.${foundIndex}.quantity`)) + 1;
            
                setValue(`itemDetails.${foundIndex}.quantity`, qty);
                trigger(`itemDetails.${foundIndex}.quantity`);
                setFocus("itemName");
              }
            } else {
              if (response?.data?.isserialitem) {
                if (itemname === response?.data?.name) {
                  // enqueueSnackbar("Item is Serial Item", { variant: "error" });
                } else {
                  append({
                    itemName: response?.data?.name,
                    serialName: itemname,
                    quantity: 1,
                    itemId: response?.data?.id,
                    status: "Pending",
                    isSerialItem: response?.data?.isserialitem,
                  });
                }
              } else {
                append({
                  itemName: itemname,
                  quantity: 1,
                  itemId: response?.data?.id,
                  status: "Pending",
                  isSerialItem: response?.data?.isserialitem,
                });
                setFocus("itemName");
              }
            }
            // Update the data state after the asynchronous operation has completed
          } else {
            enqueueSnackbar("Item Does Not Exist", { variant: "error" });
            setFocus("itemName");
          }
        }
        setValue("itemName", "");
      }
    } catch (error) {
      enqueueSnackbar(error?.message || "Failed to Fetch Item", {
        variant: "error",
      });
    }
  };
  useEffect(async () => {
    await dispatch(fetchLocations());
    setValue("location", localStorage.getItem("Location") || "8");
  }, []);
  useEffect(() => {
    console.log("FOCUS");
    console.log("fields array", fields);
    setFocus("itemName");
  }, [values.itemName]);


  const handledelete = (serialName) =>{
    console.log("value to delete" , serialName)
    const curr = getValues("itemDetails");
    const i = curr.findIndex((item) => item.serialName === serialName);
    console.log("deleteindex" , i)
    remove(i);
}

const handleUnserialdelete = (title) =>{
  const curr = getValues("itemDetails");
  const i = curr.findIndex((item) => item.itemName === title);
  console.log("deleteindex" , i)
  remove(i);
}

const handleQnt = (val , name)=>{
  const curr = getValues("itemDetails");
  let foundIndex = curr.findIndex(
    (item) => item.itemName === name);
  // let qty =  Number(getValues(`itemDetails.${foundIndex}.quantity`)) + 1;
setValue(`itemDetails.${foundIndex}.quantity`, Number(val));
trigger(`itemDetails.${foundIndex}.quantity`);
}
  return (
    <ThemeProvider theme={defaultTheme}>
      <Box
        sx={{
          // border: isSmallScreen ? "1px solid rgba(0, 0, 0, 0.12)" : 0,
          borderRadius: "10px",
          marginTop: "5%",
        }}
      >
        <Box
          sx={{ width: "100%", mt: 5 }}
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          autoComplete="off"
          display="flex"
          flexDirection={"column"}
          justifyContent="center"
          alignItems={"center"}
        >
          <Box
            display={"flex"}
            flexDirection={isSmallScreen ? "column" : "row"}
            gap={"20px"}
          >
            <Box>
              <Box
                display={"flex"}
                flexDirection={isSmallScreen ? "column" : "row"}
              >
                <Controller
                  name={`location`}
                  fullWidth
                  defaultValue=""
                  control={control}
                  render={({ field }) => (
                    <CustomSelect
                      {...field}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        setValue(
                          "locationName",
                          allLocations.find((loc) => loc?.id === e.target.value)
                            ?.name || ""
                        );
                        localStorage.setItem("Location", e.target.value);
                      }}
                      labelId="demo-simple-select-label"
                      fullWidth
                      variant="outlined"
                      size="small"
                      status="status"
                      id="demo-simple-select"
                      sx={{ width: "100%" }}

                      // error={!!errors.location}
                      // helpertext={errors.location?.message}
                    >
                      {allLocations?.map((item) => (
                        <MenuItem
                          key={item?.id}
                          value={item?.id}
                          sx={{
                            fontSize: { xs: "12px", sm: "16px" },
                            minHeight: { x: "38px", sm: "45px" },
                            padding: "0px 10px !important",
                          }}
                        >
                          {item?.name}
                        </MenuItem>
                      ))}
                    </CustomSelect>
                  )}
                />
              </Box>
              <Box
                display={"flex"}
                flexDirection={isSmallScreen ? "column" : "row"}
              >
                <Controller
                  name={`itemName`}
                  id="itemName"
                  fullWidth
                  control={control}
                  render={({ field: { ref, ...field } }) => (
                    <CustomizedInputsStyled
                      {...field}
                      inputRef={ref}
                      size="small"
                      onBlur={(e) => {
                        isItemExist(e.target.value.trim());
                        field.value("");
                        setFocus("itemName");
                      }}
                      label="Scan Item"
                      sx={{ p: 0, my: 5, width: { xs: 280, md: 620 } }}
                    />
                  )}
                />
              </Box>
            </Box>
            <Box>
              <Button
                variant="contained"
                onClick={fetchExistingInventory}
                sx={{
                  background: "#232323",
                  "&:hover": { background: "black" },
                }}
              >
                Conduct Full Count
              </Button>
            </Box>
          </Box>
          <Box
            display={"flex"}
            width={"60%"}
            alignItems={"center"}
            flexDirection={isSmallScreen ? "column" : "column"}
          >
            <Box py={10} width={"100%"} alignItems={"center"}>
              {/* table */}
              {fields.length ? (
                <>
                  <ItemsAccordion useFieldArray={fields} handledelete={handledelete} handleUnserialdelete={handleUnserialdelete} handleQnt={handleQnt} />
                  {pageNum > 0 ? (
                    <Button
                      selfAlign="center"
                      variant="contained"
                      disabled={isLastPage}
                      onClick={() => {
                        loadMoreInventory();
                      }}
                    >
                      Load More
                    </Button>
                  ) : (
                    ""
                  )}
                </>
              ) : (
                ""
              )}
            </Box>
            {/* table end */}
            {/* Accordion */}
            {/* Accordion End */}
            {fields.length ? (
              <Box>
                <LoadingButton
                  position="sticky"
                  top={"30px"}
                  type="submit"
                  loading={isSubmitting}
                  variant="contained"
                  color="primary"
                  sx={{
                    my: 3,
                    heigth: "20px",
                    padding: "10px 5px",
                    backgroundColor: "black",
                    color: "white",
                    width: "100%",
                    fontSize: "12px",
                    position: "sticky",
                    top: "30px",
                    ":hover": { backgroundColor: "black" },
                  }}
                >
                  Save Inventory Count
                </LoadingButton>
              </Box>
            ) : (
              ""
            )}
          </Box>
        </Box>
      </Box>

      {/* <Copyright sx={{ mt: 5 }} /> */}
    </ThemeProvider>
  );
}
