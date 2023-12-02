import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { TableCell } from "@mui/material";

export default function PickingCompleteTables({ itemlength }) {


	const products = JSON.parse(localStorage.getItem("products"));
	const productArrays = Object.values(products || {});
	return (
		<TableContainer component={Paper}>
			<Table
				aria-label="customized table"
				size="small"
			>
				<TableHead>
					<TableRow>
						<TableCell align="center">
							<strong>PO/TO</strong>
						</TableCell>
						<TableCell align="center">
							<strong>Item</strong>
						</TableCell>
						<TableCell align="center">
							<strong>Quantity</strong>
						</TableCell>
						<TableCell align="center">
							<strong>Name</strong>
						</TableCell>
						<TableCell align="center">
							<strong>Status</strong>
						</TableCell>
						<TableCell align="center">
							<strong>Uom</strong>
						</TableCell>
						<TableCell align="center">
							<strong>Date</strong>
						</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{productArrays?.length && productArrays?.map((item) => (
						item.map((row, index) => (

							<TableRow key={index}>
								<TableCell
									component="th"
									scope="row"
									align="center"
								>
									{row?.id.replace("HIVE -", "")}
								</TableCell>
								<TableCell
									component="th"
									scope="row"
									align="center"
								>
									{row?.itemName}
								</TableCell>
								<TableCell
									component="th"
									scope="row"
									align="center"
								>
									{row?.quantity}
								</TableCell>
								<TableCell
									component="th"
									scope="row"
									align="center"
								>
									{row?.vendorName}
								</TableCell>
								<TableCell
									component="th"
									scope="row"
									align="center"
								>
									{row?.status}
								</TableCell>
								<TableCell
									component="th"
									scope="row"
									align="center"
								>
									{row?.uomNumber}
								</TableCell>
								<TableCell
									component="th"
									scope="row"
									align="center"
								>
									{new Date(row?.createdAt).toLocaleDateString("en-US", {
										year: 'numeric',
										month: '2-digit',
										day: '2-digit',
									})}
								</TableCell>
							</TableRow>
						))


					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
}
