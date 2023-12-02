import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import formatDate from "../../utils/formatdate";
const name = "requests";
const initialState = createInitialState();
const extraActions = createExtraActions();
const extraReducers = createExtraReducers();
const slice = createSlice({
	name,
	initialState,
	extraReducers,
});

export const RequestActions = { ...slice.actions, ...extraActions };

export default slice.reducer;

function createInitialState() {
	return {
		allLocations: [],
		inventoryDetails: [],
		allUsers: [],
		loading: false,
		isSubmiting: false,
	};
}
function createExtraActions() {
	return {
		fetchLocations: fetchLocations(),
		fetchUsers: fetchUsers(),
		fetchInventoryCountDetails: fetchInventoryCountDetails(),
		submitCount: submitCount(),
		approveCount: approveCount(),
	};
}

function fetchLocations() {
	return createAsyncThunk(`${name}/fetchLocations`, async (data) => {
		try {
			const response = await axios.get(`${window.location.href}&type=getLocations`);

			return response.data;
		} catch (err) {
			return err;
		}
	});
}
function fetchUsers() {
	return createAsyncThunk(`${name}/fetchUsers`, async (data) => {
		try {
			const response = await axios.get(`${window.location.href}&type=getUsers&locationId=1`);

			return response.data;
		} catch (err) {
			return err;
		}
	});
}
function fetchInventoryCountDetails() {
	return createAsyncThunk(`${name}/fetchInventoryCountDetails`, async (data) => {
		try {
			const response = await axios.get(`${window.location.href}&type=getInventoryDetails&startIdx=${0}&endIdx=${data.limit}&locationId=${data.locationId}&userId=${data.userId}&date=${data.startDate ? data.startDate : ""}`, {});

			return response.data;
		} catch (err) {
			return err;
		}
	});
}

function submitCount() {
	return createAsyncThunk(`${name}/submitCount`, async (payload) => {
		try {
			let data = new FormData();
			data.append("items", JSON.stringify(payload.items));
			data.append("locationName", payload.locationName);
			data.append("location", localStorage.getItem("Location"));
			const response = await axios.post(`${window.location.href}&type=submitCount`, data);
			return response;
		} catch (err) {
			return err;
		}
	});
}
function approveCount() {
	return createAsyncThunk(`${name}/approveCount`, async (payload) => {
		try {
			console.log({ payload });
			let data = new FormData();
			data.append("items", JSON.stringify(payload.items));
			if (payload.status) data.append("status", payload.status);
			const response = await axios.post(`${window.location.href}&type=approve`, data);
			return response;
		} catch (err) {
			return err;
		}
	});
}

function createExtraReducers() {
	return {
		...fetchLocations(),
		...fetchUsers(),
		...fetchInventoryCountDetails(),
		...submitCount(),
		...approveCount(),
	};

	function fetchLocations() {
		const { pending, fulfilled, rejected } = extraActions.fetchLocations;
		return {
			[pending]: (state) => {
				state.allLocations = state.allLocations || [];
			},
			[fulfilled]: (state, action) => {
				state.allLocations = action.payload?.data || [];
			},
			[rejected]: (state, action) => {
				state.allLocations = state.allLocations || [];
			},
		};
	}
	function fetchUsers() {
		const { pending, fulfilled, rejected } = extraActions.fetchUsers;
		return {
			[pending]: (state) => {
				state.allUsers = state.allUsers || [];
			},
			[fulfilled]: (state, action) => {
				state.allUsers = action.payload?.users || [];
			},
			[rejected]: (state, action) => {
				state.allUsers = state.allUsers || [];
			},
		};
	}
	function fetchInventoryCountDetails() {
		const { pending, fulfilled, rejected } = extraActions.fetchInventoryCountDetails;
		return {
			[pending]: (state) => {
				state.inventoryDetails = state.inventoryDetails || [];
				state.loading = true;
			},
			[fulfilled]: (state, action) => {
				state.inventoryDetails = action.payload?.data || [];
				state.loading = false;
			},
			[rejected]: (state, action) => {
				state.inventoryDetails = state.inventoryDetails || [];
				state.loading = false;
			},
		};
	}
	function approveCount() {
		const { pending, fulfilled, rejected } = extraActions.approveCount;
		return {
			[pending]: (state) => {
				state.isSubmiting = true;
			},
			[fulfilled]: (state, action) => {
				state.isSubmiting = false;
			},
			[rejected]: (state, action) => {
				state.isSubmiting = false;
			},
		};
	}

	function submitCount() {
		const { pending, fulfilled, rejected } = extraActions.submitCount;

		return {
			[pending]: (state, action) => {
				state.frId = state.frId;
				state.index = state.index;
				state.loading = true;
				state.allRequests = state.allRequests;
				state.totalData = state.totalData;
				state.allItems = state.allItems;
			},
			[fulfilled]: (state, action) => {
				state.frId = "";
				state.index = 0;

				state.loading = true;
				state.allRequests = state.allRequests;
				state.totalData = state.totalData;
				state.allItems = state.allItems;
			},
			[rejected]: (state, action) => {
				state.frId = state.frId;
				state.index = state.index;
				state.loading = true;
				state.allRequests = state.allRequests;
				state.totalData = state.totalData;
				state.allItems = state.allItems;
			},
		};
	}
}

// Reducer

// Actions
