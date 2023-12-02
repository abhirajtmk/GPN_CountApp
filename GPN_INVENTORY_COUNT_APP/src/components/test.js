import React, { useEffect, useMemo, useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, useParams } from "react-router-dom";

import { Button, InputLabel, MenuItem, Select } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import PickingScreenTables from "./components/PickScreenTable";
import PopupModal from "./components/PopupModal";
import { useDispatch, useSelector } from "react-redux";
import { updateFormData } from "./redux/slices/products";

const schema = yup
  .object({
    // station: yup.number().required("Station is Required!"),
    // serial: yup.string().required("Serial Number is Required!"),
    // location: yup.number().required("Location is Required!"),
  })
  .required();

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://www.hivebrands.com/">
        Hive
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function PickingScreen() {
  const { index } = useParams();
  const [modalOpen, setModalOpen] = useState(false);
  const formData = useSelector((state) => state);

  const navigate = useNavigate();
  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const { allItems } = useSelector((state) => state?.item.Items);
  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleConfirm = () => {
    navigate("/");
    handleCloseModal();
  };

  const handleNext = () => {
    if (Number(index) !== allItems?.length - 1) {
      const next = Number(index) + 1;
      dispatch(updateFormData({ index, values }));
      navigate(`/picking-screen/${next}`);
    }
  };
  const handleBack = () => {
    if (Number(index) !== 0) {
      const next = Number(index) - 1;

      navigate(`/picking-screen/${next}`);
    }
  };
  const defaultValues = useMemo(
    () => ({
      serialNumber: formData?.products[index]?.serialNumber || "",
    }),
    [index]
  );
  const {
    control,
    handleSubmit,
    setFocus,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting, isLoading },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });
  const values = watch();
  const dispatch = useDispatch();
  const onSubmit = async (data) => {
    try {
    } catch (error) {
      console.log({ error });
    }
  };
  useEffect(() => {
    if (values?.serialNumber?.length > 0) {
      setValue("nonserializedNumber", "");
      setValue("quantity", "");
    } else if (
      values?.nonserializedNumber?.length > 0 ||
      values?.quantity?.length > 0
    ) {
      setValue("serialNumber", "");
    }
    setValue("serialNumber", "");
    setFocus("serialNumber");
  }, [index]);

  return (
    <ThemeProvider theme={defaultTheme}>
      <PopupModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirm}
        message={"Do you want to cancel Putaway?"}
      />

      <Container component="main">
        <Box sx={{ mt: 3 }}>
          <img
            src="https://cdn-gss.dataweavers.io/-/media/project/global-payments/corporate/corporate/global/site-logos/logoprimary.svg?rev=88e2dba46a1348a7bd8a9a571a94b86a"
            alt="Global Payment Logo"
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            border: "1px solid rgba(0, 0, 0, 0.12)",
            borderRadius: "10px",
            padding: "30px 60px",
            marginTop: "5%",
          }}
        >
          <Box
            component="form"
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ width: "50%", m: 3 }}
          >
            <Box sx={{ width: "100%" }}>
              <Box sx={{ width: "100%", my: 3 }}>
                <InputLabel id="demo-simple-select-label">
                  Recomended Pick location
                </InputLabel>{" "}
                <Controller
                  name="recomendedPicklocation"
                  control={control}
                  fullWidth
                  defaultValue=""
                  render={({ field }) => (
                    <Select
                      {...field}
                      size="small"
                      // label="Recomended Pick location"
                      sx={{ width: "100%" }}
                      // onChange={(e) => setSelectedValue(e.target.value)}
                    >
                      <MenuItem value={10}>Ten</MenuItem>
                      <MenuItem value={20}>Twenty</MenuItem>
                      <MenuItem value={30}>Thirty</MenuItem>
                    </Select>
                  )}
                />
              </Box>
              {!values?.nonserializedNumber?.length && (
                <Controller
                  name="serialNumber"
                  fullWidth
                  control={control}
                  render={({ field }) => {
                    let fieldWithoutRef = { ...field, ref: undefined };
                    return (
                      <TextField
                        fullWidth
                        size="small"
                        id="serialNumber"
                        label="Serial Number #"
                        variant="standard"
                        sx={{ width: "100%" }}
                        required
                        error={!!errors?.serialNumber}
                        helperText={errors?.serialNumber?.message}
                        {...fieldWithoutRef}
                        inputRef={field.ref}
                      />
                    );
                  }}
                />
              )}
              {values?.serialNumber?.length ||
              values?.nonserializedNumber?.length ? null : (
                <Divider sx={{ width: "100%", my: 3 }}>OR</Divider>
              )}
              {!values?.serialNumber?.length && (
                <>
                  {" "}
                  <Controller
                    name="nonserializedNumber"
                    fullWidth
                    control={control}
                    render={({ field }) => {
                      let fieldWithoutRef = { ...field, ref: undefined };
                      return (
                        <TextField
                          fullWidth
                          size="small"
                          id="nonserializedNumber"
                          label="Non Serialized Part Number #"
                          variant="standard"
                          sx={{ width: "100%" }}
                          required
                          error={!!errors?.serialNumber}
                          helperText={errors?.serialNumber?.message}
                          {...fieldWithoutRef}
                          inputRef={field.ref}
                        />
                      );
                    }}
                  />
                </>
              )}
              <Controller
                name="quantity"
                fullWidth
                control={control}
                render={({ field }) => {
                  let fieldWithoutRef = { ...field, ref: undefined };
                  return (
                    <TextField
                      fullWidth
                      id="quantity"
                      size="small"
                      label="Quantity"
                      variant="standard"
                      sx={{ width: "100%" }}
                      required
                      error={!!errors?.serialNumber}
                      helperText={errors?.serialNumber?.message}
                      {...fieldWithoutRef}
                      inputRef={field.ref}
                    />
                  );
                }}
              />
            </Box>
            <Box
              sx={{
                mt: 2,
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Button
                sx={{ width: "100%", mr: 5 }}
                variant="contained"
                color="primary"
                disabled={Number(index) === 0}
                onClick={() => handleBack()}
              >
                Back
              </Button>
              <Button
                sx={{ width: "100%" }}
                variant="contained"
                color="error"
                onClick={handleOpenModal}
              >
                Cancel Pick
              </Button>
            </Box>
            <Box sx={{ mt: 2, width: "100%" }}>
              {Number(index) === allItems?.length - 1 ? (
                <LoadingButton
                  type="submit"
                  loading={isSubmitting}
                  sx={{ width: "100%" }}
                  variant="contained"
                  color="success"
                >
                  Submit
                </LoadingButton>
              ) : (
                <LoadingButton
                  loading={isSubmitting}
                  sx={{ width: "100%" }}
                  variant="contained"
                  color="primary"
                  onClick={() => handleNext()}
                >
                  Next
                </LoadingButton>
              )}
            </Box>
          </Box>
          <Box sx={{ width: "50%", m: 3 }}>
            <scrollbars>
              <PickingScreenTables rows={allItems} pageIndex={index} />
            </scrollbars>
          </Box>
        </Box>
        <CssBaseline />

        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}
