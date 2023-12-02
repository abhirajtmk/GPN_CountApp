import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Box, MenuItem, Select, FormControl, InputLabel, TextField, Chip } from "@mui/material";

export default function FilterToolBar({ location, onLocationChange, allLocations, itemName, onChageItem, allUsers, user, onChangeuser, startedDate, setstarteddate, endDate, setEnddate }) {
	return (
		<Box
			display={"flex"}
			justifyContent={"flex-start"}
			sx={{ flexDirection: { xs: "column", md: "row" } }}
		>
			<TextField
				value={location}
				label="Location"
				select
				onChange={onLocationChange}
				sx={{ width: 280, m: 2 }}
			>
				{allLocations.map((loc) => (
					<MenuItem
						value={loc?.id}
						key={loc?.id}
					>
						{loc?.name}
					</MenuItem>
				))}
			</TextField>

			<TextField
				value={user}
				label="User"
				select
				fullWidth
				onChange={onChangeuser}
				sx={{ width: 280, m: 2 }}
			>
				{[{ id: "", name: "-RESET-" }, ...allUsers].map((loc) => (
					<MenuItem
						value={loc?.id}
						key={loc?.id}
					>
						{loc?.name}
					</MenuItem>
				))}
			</TextField>
			<Box
				display={"flex"}
				// my={2}
				justifyContent={"space-between"}
				m={2}
				alignItems={"center"}
			>
				<LocalizationProvider dateAdapter={AdapterDayjs}>
					<DemoContainer
						sx={{ p: 0, overflow: "visible", width: "100%" }}
						components={["DatePicker"]}
					>
						<DatePicker
							slotProps={{
								actionBar: {
									actions: ["clear"],
								},
							}}
							size="small"
							label="Date"
							value={startedDate || undefined}
							onChange={(newValue) => {
								console.log({ newValue });
								setstarteddate(newValue ? new Date(newValue).toISOString() : undefined);
							}}
							disableFuture={true}
						/>
					</DemoContainer>
				</LocalizationProvider>
			</Box>

			{/* <TextField sx={{ width: 280, m: 2 }} value={itemName} onChange={onChageItem} /> */}
		</Box>
	);
}
