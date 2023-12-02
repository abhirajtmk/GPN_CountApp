import * as React from "react";
import { alpha, styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";

const CssTextField = styled(TextField)((props) => ({
	"& label.Mui-focused": {
		color: props.color,
	},
	"& .MuiInput-underline:after": {
		borderBottomColor: "#B2BAC2",
	},
	"& .MuiOutlinedInput-root": {
		"&": { paddingRight: "20px !important" },
		"& fieldset": {
			border: "2px solid #000000",
		},
		"&:hover fieldset": {
			borderColor: "#B2BAC2",
		},
		"&.Mui-focused fieldset": {
			borderColor: "#6F7E8C",
		},
	},
}));

const BootstrapInput = styled(InputBase)(({ theme }) => ({
	"label + &": {
		marginTop: theme.spacing(3),
	},
	"& .MuiInputBase-input": {
		borderRadius: 4,
		position: "relative",
		backgroundColor: theme.palette.mode === "light" ? "#F3F6F9" : "#1A2027",
		border: "1px solid",
		borderColor: theme.palette.mode === "light" ? "#E0E3E7" : "#2D3843",
		fontSize: 16,
		width: "auto",
		padding: "10px 12px",
		transition: theme.transitions.create(["border-color", "background-color", "box-shadow"]),
		// Use the system font instead of the default Roboto font.
		fontFamily: ["-apple-system", "BlinkMacSystemFont", '"Segoe UI"', "Roboto", '"Helvetica Neue"', "Arial", "sans-serif", '"Apple Color Emoji"', '"Segoe UI Emoji"', '"Segoe UI Symbol"'].join(","),
		"&:focus": {
			boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
			borderColor: theme.palette.primary.main,
		},
	},
}));

const RedditTextField = styled((props) => (
	<TextField
		// InputProps={{ disableUnderline: true }}
		{...props}
	/>
))(({ theme, ...props }) => {
	return {
		"& label.Mui-focused": {
			color: "#000000",
		},
		"& .MuiInput-underline:after": {
			borderBottomColor: "#B2BAC2",
		},
		"& .MuiOutlinedInput-root": {
			"&": { paddingRight: props.version === "quantity" ? "0px !important" : "20px !important" },
			"& fieldset": {
				border: "2px solid #000000",
			},
			"&:hover fieldset": {
				borderColor: "#B2BAC2",
			},
			"&.Mui-focused fieldset": {
				borderColor: "#6F7E8C",
			},
			"& input": {
				width: 600,
				[theme.breakpoints.down("sm")]: {
					padding: "6px 6px !important",
					fontSize: "12px",
					width: 280
				},
				padding: "12px !important",
				fontSize: "18px",
				fontWeight: 700,

			},
			"&.MuiInputBase-sizeSmall": {
				padding: "0px",
			},
			"& .MuiAutocomplete-endAdornment": {
				right: "0px",
				"& .MuiAutocomplete-clearIndicator": {
					fontSize: "10px",
				},
			},
		},
	};
});

// const ValidationTextField = styled(TextField)({
//   '& input:valid + fieldset': {
//     borderColor: '#E0E3E7',
//     borderWidth: 1,
//   },
//   '& input:invalid + fieldset': {
//     borderColor: 'red',
//     borderWidth: 1,
//   },
//   '& input:valid:focus + fieldset': {
//     borderLeftWidth: 4,
//     padding: '4px !important', // override inline-style
//   },
// });

export default function CustomizedInputsStyled(props) {
	return <RedditTextField {...props} />;
}
