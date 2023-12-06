import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  styled,
} from "@mui/material";
import { useEffect, useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { DeleteOutline } from "@mui/icons-material";

const CssTableCell = styled(TableCell)((props) => ({
  padding: 2,
}));

function ItemsAccordion({ useFieldArray, remove }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const updatedArray = useFieldArray.reduce((acc, current) => {
      const title = current.itemName;
      const id = current.id;
      const existingGroup = acc.find((item) => item.title === title);
      current = { ...current, id };
      if (existingGroup) {
        existingGroup.elements.push(current);
      } else {
        acc.push({ title, elements: [current] });
      }

      return acc;
    }, []);

    setItems(updatedArray);
  }, [useFieldArray]);
  return (
    <>
      {items.map(({ title, elements }) => {
        const totalQuantity = elements.reduce(
          (acc, element) => acc + element.quantity,
          0
        );
        return (
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2a-content"
              id="panel2a-header"
            >
              <Box
                display={"flex"}
                width={"60%"}
                justifyContent={"space-between"}
              >
                <Typography>{title}</Typography>
                <Typography>Quantity: {totalQuantity}</Typography>
              </Box>
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
                            <>
                              {console.log(a)}
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
                                      remove(a.id);
                                    }}
                                  >
                                    <DeleteOutline />
                                  </Button>
                                </CssTableCell>
                              </TableRow>
                            </>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Container>
                </Box>
              </Typography>
            </AccordionDetails>
          </Accordion>
        );
      })}
    </>
  );
}

export default ItemsAccordion;
