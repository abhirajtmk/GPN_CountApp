import { Container, Box, Tooltip, IconButton, TextField } from "@mui/material";
import BaseTable, { Column } from "react-base-table";
import "react-base-table/styles.css";
import EditableCell from "./Editablecell";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useState } from "react";
import axios from "axios";
import { useSnackbar } from "notistack";

export default function ItemInputFormTable() {
  const [data, setData] = useState(
    [
      {
        itemname: "",
        quantity: 0,
        id: 1,
      },
    ]
  )
  const { enqueueSnackbar } = useSnackbar()
  const isItemExist = async (itemname, index) => {
    console.log(index);
    try {
      if (itemname) {
        const response = await axios.get(`${window.location.href}&type=finditem&itemName=${itemname}`);
        if (response.status === 200) {
          if (response.data?.found) {
            enqueueSnackbar("Item Found Successfully", { variant: "success" });

            // Update the data state after the asynchronous operation has completed
            const updatedData = [...data];
            console.log({ updatedData });
            updatedData[index] = {
              itemname: itemname,
              quantity: 0,
              id: index + 1,
              itemId: response.data?.id
            };
            updatedData.push({
              itemname: "",
              quantity: 0,
              id: index + 2,
            });
            console.log({ updatedData });
            // Set the updated data state
            setData(updatedData);
          } else {
            enqueueSnackbar("Item Not Exist", { variant: "error" });
          }
        }
      }
    } catch (error) {
      enqueueSnackbar(error?.message || "Failed to Fetch Item", {
        variant: "error",
      });
    }
  };

  const columns = [
    {
      key: "itemname",
      title: "Item Name",
      dataKey: "itemname",
      width: 250,
      resizable: true,
      sortable: true,
      editable: true,
      frozen: Column.FrozenDirection.LEFT,
      cellRenderer: (cellProps) => (
        <TextField
          {...cellProps}
          size="small"
          onBlur={(e) => isItemExist(e.target.value, cellProps.rowIndex)}
        />
      ),
    },
    {
      key: "quantity",
      title: "Quantity",
      dataKey: "quantity",
      width: 200,
      resizable: true,
      sortable: true,
      editable: true,
      frozen: Column.FrozenDirection.LEFT,
      cellRenderer: (cellProps) => (
        <TextField
          {...cellProps}
          size="small"
          type="number"
          onChange={(e) => isItemExist(e.target.value, cellProps.rowIndex)}
        />
      ),
    },
    {
      key: "other",
      flexShrink: 0,

      dataKey: "other",
      width: 50,
      align: Column.Alignment.LEFT,

      frozen: Column.FrozenDirection.RIGHT,
      cellRenderer: ({ rowData }) => (
        <Box>
          <Tooltip title="Delete">
            <IconButton onClick={() => alert(`delete `)}>
              <DeleteOutlineIcon />
            </IconButton>
          </Tooltip>{" "}
        </Box>
      ),
    },
  ];
  // const { allItems, receivingItem } = useSelector((state) => state.requests);
  console.log({ data });
  const handleAddRow = () => {
    alert(`addd row logic`);
  };

  return (
    <Container>
      <BaseTable
        data={data}
        columns={columns}
        components={{
          TableCell: EditableCell,
        }}
        width={600}
        height={300}
        fixed={false}
        forceUpdateTable
      />

      {/* <Box>
        <Button
          variant="contained"
          color="primary"
          sx={{
            mt: 1,

            backgroundColor: "black",
            color: "white",

            fontSize: "16px",

            ":hover": { backgroundColor: "black" },
          }}
          onClick={() => handleAddRow()}
        >
          Add Field
        </Button>
      </Box> */}
    </Container>
  );
}
