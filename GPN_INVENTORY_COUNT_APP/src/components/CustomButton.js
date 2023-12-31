import * as React from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { purple, red, orange } from "@mui/material/colors";

// const BootstrapButton = styled(Button)({
//   boxShadow: 'none',
//   textTransform: 'none',
//   fontSize: 16,
//   padding: '6px 12px',
//   border: '1px solid',
//   lineHeight: 1.5,
//   backgroundColor: '#0063cc',
//   borderColor: '#0063cc',
//   fontFamily: [
//     '-apple-system',
//     'BlinkMacSystemFont',
//     '"Segoe UI"',
//     'Roboto',
//     '"Helvetica Neue"',
//     'Arial',
//     'sans-serif',
//     '"Apple Color Emoji"',
//     '"Segoe UI Emoji"',
//     '"Segoe UI Symbol"',
//   ].join(','),
//   '&:hover': {
//     backgroundColor: '#0069d9',
//     borderColor: '#0062cc',
//     boxShadow: 'none',
//   },
//   '&:active': {
//     boxShadow: 'none',
//     backgroundColor: '#0062cc',
//     borderColor: '#005cbf',
//   },
//   '&:focus': {
//     boxShadow: '0 0 0 0.2rem rgba(0,123,255,.5)',
//   },
// });

const ColorButton = styled(Button)(({ theme, body, textColor, textSize }) => {
	console.log({ body });
	return {
		color: textColor,
		fontWeight: 700,
		fontSize: `${textSize}px`,
		backgroundColor: body,
		"&:hover": {
			backgroundColor: body,
		},
	};
});

export default function CustomizedButton({ text, onClickHandler, bgColor, textColor, textSize }) {
	return (
		<ColorButton
			onClick={onClickHandler}
			variant="contained"
			body={bgColor}
			textColor={textColor}
			textSize={textSize}
		>
			{text}
		</ColorButton>
	);
}
// {/* <BootstrapButton variant="contained" disableRipple>
//   Bootstrap
// </BootstrapButton> */}
