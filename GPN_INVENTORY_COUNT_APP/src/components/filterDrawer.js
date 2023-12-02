/* eslint-disable react-hooks/exhaustive-deps */
import { Autocomplete, Box, Button, Checkbox, Chip, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { FullfillmentRequestActions, saveTransactions } from "../redux/slices/requests";

export default function FilterDrawer({ isOpen, handleClose }) {
	const { vendors, transactions, selectedOrders } = useSelector((state) => state?.requests);
	const [selectedVendors, setSelectedVendors] = useState([]);
	const [vendorSearch, setvendorsearch] = useState("");
	const [TransactionsData, setTransactionData] = useState([]);
	const [tabvalue, setTabValue] = useState("PO");
	const [checked, setChecked] = useState([]);
	const dispatch = useDispatch();
	const { fetchVendors, fetchTransactions } = FullfillmentRequestActions;
	const handleToggle = (value) => () => {
		const currentIndex = checked.indexOf(value);
		const newChecked = [...checked];

		if (currentIndex === -1) {
			newChecked.push(value);
		} else {
			newChecked.splice(currentIndex, 1);
		}

		setChecked(newChecked);
	};
	console.log({ selectedVendors });
	const handleChangeTab = (event, newValue) => {
		setTabValue(newValue);
	};
	const [startedDate, setstarteddate] = useState("");
	const [endDate, setEnddate] = useState("");
	const handleVendorChange = (event, newValue) => {
		setSelectedVendors(newValue.map((vendor) => vendor.vendorId)); // Store only the IDs
	};

	const handleVendorSearch = async (event, newValue) => {
		console.log({ event, newValue });
		setvendorsearch(newValue);
		await dispatch(fetchVendors({ vendorName: vendorSearch, startIndex: 0, endIndex: 10 }));
	};
	const searchTransactions = (e, newValue) => {
		const searchInput = e.target.value; // Convert search input to lowercase

		const filterTransactions = transactions.filter((item) => item.order.toLowerCase().includes(searchInput.toLowerCase())); // Convert item to lowercase and compare
		if (filterTransactions) {
			setTransactionData(filterTransactions);
		}
		console.log(filterTransactions);
	};
	const handleTransactionsChange = (value) => {
		if (value) {
			dispatch(saveTransactions(value));
		}
	};
	useEffect(async () => {
		await dispatch(fetchTransactions({ startIndex: 0, endIndex: 50, tranId: tabvalue, startedDate, endDate, vendors: JSON.stringify(selectedVendors) }));
	}, [selectedVendors, startedDate, endDate, tabvalue]);
	useEffect(() => {
		setSelectedVendors([]);
	}, [isOpen]);
	useEffect(() => {
		if (transactions) {
			setTransactionData(transactions);
		}
	}, [transactions]);
	return (
		<Box sx={{ width: "100%" }}>
			<Drawer
				sx={{ width: "600px" }}
				anchor="right"
				open={isOpen}
				onClose={handleClose}
			>
				<Box sx={{ padding: "20px" }}>
					<Autocomplete
						multiple
						id="vendor-autocomplete"
						options={vendors}
						sx={{ my: 2 }}
						getOptionLabel={(option) => option.name}
						onChange={handleVendorChange}
						onInputChange={handleVendorSearch}
						size="small"
						renderInput={(params) => (
							<TextField
								size="small"
								{...params}
								label="Select Vendors"
							/>
						)}
					/>
					{/* <Box display={"flex"} my={2} justifyContent={"space-between"} alignItems={"center"}>

                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['DatePicker']}>
                                <DatePicker size="small" label="Start Date" value={startedDate} onChange={(newValue) => setstarteddate(newValue)} />
                                <DatePicker size="small" label="End Date" value={endDate} onChange={(newValue) => setEnddate(newValue)} />
                            </DemoContainer>
                        </LocalizationProvider>
                    </Box> */}
					<TextField
						size="small"
						label="Search PO ,TO ..."
						fullWidth
						onChange={searchTransactions}
					/>
				</Box>
				<Box>
					<Box sx={{ width: "100%", justifyContent: "center", mx: 0, fontSize: "12px" }}>
						<Tabs
							value={tabvalue}
							onChange={handleChangeTab}
							textColor="primary"
							indicatorColor="primary"
							aria-label="primary tabs example"
							size="small"
						>
							<Tab
								value="PO"
								label="Purchase Order"
								sx={{ fontSize: "12px" }}
							/>
							<Tab
								value="TO"
								label="Transfer Order"
								sx={{ fontSize: "12px" }}
							/>
						</Tabs>
					</Box>
					{tabvalue === "PO" || tabvalue === "TO" ? (
						<List sx={{ width: "100%", maxWidth: 360, height: "360px", bgcolor: "background.paper", mx: 0 }}>
							{TransactionsData.map((value) => {
								const labelId = `checkbox-list-label-${value}`;

								return (
									<ListItem
										key={value.id}
										disablePadding
									>
										<ListItemButton
											role={undefined}
											onClick={handleToggle(value)}
											dense
										>
											<ListItemIcon>
												<Checkbox
													edge="start"
													checked={selectedOrders.includes(value?.order)}
													tabIndex={-1}
													onChange={() => handleTransactionsChange(value?.order)}
													disableRipple
													inputProps={{ "aria-labelledby": labelId }}
												/>
											</ListItemIcon>
											<ListItemText
												id={labelId}
												primary={value?.order?.replace("HIVE -", "")}
												secondary={value?.createdAt ? new Date(value?.createdAt).toLocaleDateString() : ""}
											/>
										</ListItemButton>
										<Typography variant="body2" color={"red"}>{value?.transactionStatus?.replace("Pending Billing/", "").replace("/Partially Fulfilled", "")}</Typography>
									</ListItem>
								);
							})}
						</List>
					) : null}
				</Box>
			</Drawer>
		</Box>
	);
}
