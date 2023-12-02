import React from "react";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Link, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, createTheme, useMediaQuery } from "@mui/material";

const defaultTheme = createTheme();

const SubmitPopupModal = ({ isOpen, onClose, tableData }) => {
	const isSmallScreen = useMediaQuery(defaultTheme.breakpoints.down("sm"));
	return (
		<Modal
			open={isOpen}
			onClose={onClose}
		>
			<Box
				sx={{
					position: "absolute",
					top: "50%",
					left: "50%",
					transform: "translate(-50%, -50%)",
					width: "100%",
					maxWidth: "600px",
					bgcolor: "background.paper",
					boxShadow: 24,
					p: isSmallScreen ? 0 : 5,
					borderRadius: 4,
				}}
			>
				<Typography
					variant="h5"
					align="center"
					sx={{ mb: 2 }}
				>
					Inventory Counts Updated
				</Typography>
				<TableContainer component={Paper}>
					<Table
						aria-label="customized table"
						size="small"
					>
						<TableHead>
							<TableRow>
								<TableCell>
									<strong>Location</strong>
								</TableCell>
								<TableCell>
									<strong>Inventory Adjustment</strong>
								</TableCell>
								<TableCell>
									<strong>Status</strong>
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{tableData &&
								tableData.length &&
								tableData?.map((row) => (
									<TableRow
										key={1}
										sx={{
											backgroundColor: row?.status==='Approved' ? "#95f2aa" : "#ff8989",
										}}
									>
										<TableCell
											component="th"
											scope="row"
										>
											{row?.location}
											{/* {row?.item.replace("HIVE -", "")} */}
										</TableCell>
										<Link
											href={row?.link}
											target="_blank"
										>
											<TableCell
												component="th"
												scope="row"
											>
												{row?.status==='Approved' ? (
													<a
														href={row?.link}
														target="_blank"
													>
														{row?.id}
													</a>
												) : (
													"Try Again!"
												)}
											</TableCell>
										</Link>
										<TableCell
											component="th"
											scope="row"
										>
											{row?.status}
										</TableCell>
									</TableRow>
								))}
						</TableBody>
					</Table>
				</TableContainer>
				<Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
					<Button
						onClick={onClose}
						color="primary"
						sx={{ mr: 1 }}
					>
						Close
					</Button>
				</Box>
			</Box>
		</Modal>
	);
};

export default SubmitPopupModal;
