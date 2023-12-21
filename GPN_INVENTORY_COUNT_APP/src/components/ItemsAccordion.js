import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  Container,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  styled,
} from "@mui/material";
import { Grid } from "@material-ui/core";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { DeleteOutline } from "@mui/icons-material";

const CssTableCell = styled(TableCell)((props) => ({
  padding: 2,
}));

function ItemsAccordion({
  forceRerender,
  useFieldArray,
  handleQnt,
  handledelete,
  handleUnserialdelete,
}) {
  const [items, setItems] = useState([]);
  const [quantityMap, setQuantityMap] = useState({});

  useEffect(() => {
    const updatedArray = useFieldArray.reduce((acc, current) => {
      const title = current.itemName;
      const id = current.id;
      const isserial = current.isSerialItem;
      const existingGroup = acc.find((item) => item.title === title);
      current = { ...current, id };
      if (existingGroup) {
        existingGroup.elements.push(current);
      } else {
        acc.push({ title, isserial, elements: [current] });
      }

      return acc;
    }, []);

    setItems(updatedArray);
  }, [useFieldArray]);

  const changeQuantity = (value, title) => {
    setQuantityMap((prevQuantityMap) => ({
      ...prevQuantityMap,
      [title]: value,
    }));
    handleQnt(value, title);
  };

  return (
    <Table>
      <TableBody>
        {items.map(({ title, isserial, elements }) => {
          let totalQuantity = elements.reduce(
            (acc, element) => acc + element.quantity,
            0
          );
          const currentQuantity = quantityMap[title] || totalQuantity;

          return (
            <>
              {isserial ? (
                <TableRow key={title}>
                  <Accordion width={"100%"} disableGutters={true} key={title}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel2a-content"
                      id="panel2a-header"
                    >
                      <Grid
                        container
                        spacing={3}
                        justifyContent="space-between"
                        width="100%"
                      >
                        <Grid item xs={4}>
                          <Typography
                            style={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {title}
                          </Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Chip label="Serial" color="success" />
                        </Grid>
                        <Grid item xs={4}>
                          <Typography align="left">
                            Quantity: {totalQuantity}
                          </Typography>
                        </Grid>
                      </Grid>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography>
                        <Box>
                          <Container>
                            <TableContainer>
                              <Table aria-label="simple table">
                                <TableHead>
                                  <TableRow>
                                    <CssTableCell>Item</CssTableCell>
                                    <CssTableCell>Quantity</CssTableCell>
                                    <CssTableCell>Actions</CssTableCell>
                                  </TableRow>
                                </TableHead>

                                <TableBody>
                                  {elements.map((a, i) => (
                                    <TableRow>
                                      <CssTableCell>
                                        <p>{a.serialName}</p>
                                      </CssTableCell>
                                      <CssTableCell>
                                        <p>{a.quantity}</p>
                                      </CssTableCell>
                                      <CssTableCell>
                                        <Button
                                          onClick={() => {
                                            handledelete(a.serialName);
                                          }}
                                        >
                                          <DeleteOutline />
                                        </Button>
                                      </CssTableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </TableContainer>
                          </Container>
                        </Box>
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                </TableRow>
              ) : (
                <TableRow key={title}>
                  <Accordion expanded={false}>
                    <AccordionSummary
                      expandIcon={
                        <IconButton
                          size="small"
                          onClick={() => {
                            console.log("Button CLicked for deletion");
                            handleUnserialdelete(title);
                          }}
                        >
                          <DeleteOutline fontSize="inherit" />
                        </IconButton>
                      }
                      aria-controls="panel2a-content"
                      id="panel2a-header"
                    >
                      <Grid
                        container
                        spacing={3}
                        justifyContent="space-between"
                        width="70%"
                      >
                        <Grid item xs={4}>
                          <Typography
                            style={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {title}
                          </Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Chip label="Non-Serial Item" color="primary" />
                        </Grid>
                        <Grid item xs={4}>
                          <Typography align="left">
                            Quantity:
                            <input
                              type="number"
                              style={{ width: "3em" }}
                              value={currentQuantity}
                              onChange={(e) =>
                                changeQuantity(e.target.value, title)
                              }
                              min={0}
                            />
                          </Typography>
                        </Grid>
                      </Grid>
                    </AccordionSummary>
                  </Accordion>
                </TableRow>
              )}
            </>
          );
        })}
      </TableBody>
    </Table>
  );
}

export default ItemsAccordion;
