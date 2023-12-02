import * as React from "react";
import { styled } from "@mui/material/styles";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import NativeSelect from "@mui/material/NativeSelect";
import InputBase from "@mui/material/InputBase";

const BootstrapInput = styled(InputBase)(({ theme }) => ({
	"label + &": {
		marginTop: theme.spacing(3),
	},
	"& .MuiInputBase-input": {
		borderRadius: 4,
		position: "relative",
		width: 600,
		backgroundColor: theme.palette.background.paper,
		border: "2px solid #000000",
		[theme.breakpoints.down("sm")]: {
			padding: "5px !important",
			fontSize: "12px",
			width: 280
		},
		padding: "10px !important",
		fontSize: "18px",

		fontWeight: 700,
		color: "#000000",
		transition: theme.transitions.create(["border-color", "box-shadow"]),
		// Use the system font instead of the default Roboto font.
		fontFamily: ["-apple-system", "BlinkMacSystemFont", '"Segoe UI"', "Roboto", '"Helvetica Neue"', "Arial", "sans-serif", '"Apple Color Emoji"', '"Segoe UI Emoji"', '"Segoe UI Symbol"'].join(","),
		"&:focus": {
			borderRadius: 4,
			borderColor: "#000000",
			boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)",
		},
	},
}));

export default function CustomSelect(props) {
	return (
		<Select
			input={<BootstrapInput />}
			{...props}
		>
			{props.children}
		</Select>
	);
}
