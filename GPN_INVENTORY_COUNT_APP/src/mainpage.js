import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import HomePage from "./HomePage";
import ApprovalScreen from "./ApprovalScreen";
import { Typography } from "@mui/material";
import axios from "axios";

export default function MainPage() {
	const [value, setValue] = useState("1");
	const [role, setRole] = useState("");
	const handleChange = (event, newValue) => {
		setValue(newValue);
	};
	useEffect(async () => {
		let response = await axios.get(`${window.location.href}&type=role`);
		console.log({ response });
		if (response?.data?.role) {
			setRole(response?.data?.role);
		}
	}, []);

	return (
		<Box sx={{ width: "100%", typography: "body1" }}>
			<Box>
				<Typography
					variant="h2"
					sx={{
						textAlign: "center",
						my: 5,
						fontSize: { xs: 16, sm: 18, md: 32 },
						fontWeight: 800,
					}}
				>
					GPN Inventory Count App
				</Typography>
			</Box>
			<TabContext value={value}>
				<Box sx={{ borderBottom: 1, borderColor: "divider" }}>
					{role === "administrator" && (
						<TabList
							onChange={handleChange}
							aria-label="lab API tabs example"
							sx={{ "& .MuiTabs-flexContainer": { justifyContent: "center" } }}
						>
							<Tab
								label="Inventory Count"
								value="1"
							/>
							<Tab
								label="Approve Inventory"
								value="2"
							/>
						</TabList>
					)}
				</Box>
				<TabPanel value="1">
					<HomePage />
				</TabPanel>
				{role === "administrator" && (
					<TabPanel value="2">
						<ApprovalScreen />
					</TabPanel>
				)}
			</TabContext>
		</Box>
	);
}
