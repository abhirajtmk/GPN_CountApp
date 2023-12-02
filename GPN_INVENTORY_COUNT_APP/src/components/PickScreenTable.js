import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";


export default function PickingScreenTables({ rows, pageIndex }) {

	return (
		<TableContainer component={Paper}>

			<Table
				sx={{ minWidth: "360px" }}
				aria-label="customized table"
				size="small"
			>
				<TableHead>
					<TableRow>
						<TableCell sx={{ fontWeight: 600 }}>Item</TableCell>
						<TableCell sx={{ fontWeight: 600 }}>Quantity</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{rows.map((row, index) => (
						<TableRow
							key={row?.serialNumber}
							sx={
								index === Number(pageIndex)
									? { bgcolor: "#dff6df", border: "2px solid green" }
									: {}
							}
						>
							<TableCell>{row?.itemName}</TableCell>
							<TableCell>{row?.itemQuantity}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>

		</TableContainer>
	);
}
