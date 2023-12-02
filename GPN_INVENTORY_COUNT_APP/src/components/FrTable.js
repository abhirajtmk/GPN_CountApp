import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { TablePagination } from "@mui/material";
import { useSelector } from "react-redux";
import moment from "moment";
import { TimeDifference } from "../utils/datediffernce";


export default function FrTables() {
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(5);

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};
	const { allRequests } = useSelector((state) => state.requests?.Requests);
	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};
	return (
		<TableContainer component={Paper}>
			<Table
				aria-label="a dense table"
				size="small"
			>
				<TableHead>
					<TableRow>
						<TableCell sx={{ fontWeight: 600 }}>FR #</TableCell>
						<TableCell sx={{ fontWeight: 600 }}>Time Since Fr</TableCell>
						<TableCell sx={{ fontWeight: 600 }}>Date Created</TableCell>
					</TableRow>
				</TableHead>

				<TableBody>
					{allRequests
						.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
						.map((row) => (
							<TableRow
								key={row.fr}
								sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
								heigth={34}
							>
								<TableCell
									component="th"
									scope="row"
								>
									{row.id}
								</TableCell>
								<TableCell>
									{TimeDifference(moment(row.date), moment())}
								</TableCell>
								<TableCell>{row?.date}</TableCell>
							</TableRow>
						))}
				</TableBody>
			</Table>
			<TablePagination
				rowsPerPageOptions={[5, 10]}
				component="div"
				count={allRequests?.length || 0}
				rowsPerPage={rowsPerPage}
				page={page}
				onPageChange={handleChangePage}
				onRowsPerPageChange={handleChangeRowsPerPage}
			/>
		</TableContainer>
	);
}
