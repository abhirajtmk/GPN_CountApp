import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
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

const CssTableCell = styled(TableCell)((props) => ({
  padding: 2,
}));

function ItemsAccordion({ useFieldArray }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const updatedArray = useFieldArray.reduce((acc, current) => {
      const title = current.name;
      const existingGroup = acc.find((item) => item.title === title);

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
      {items.map(({ title, items }) => {
        return (
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2a-content"
              id="panel2a-header"
            >
              <Typography>{title}</Typography>
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
                          {items.map((a, i) => (
                            <>
                              {console.log(a)}
                              <TableRow>
                                <CssTableCell>
                                  <p>{a.itemName}</p>
                                </CssTableCell>
                                <CssTableCell>
                                  <p>{a.quantity}</p>
                                </CssTableCell>
                                <CssTableCell>
                                  {/* <Button
                                onClick={() => {
                                  handleDelete(i, item.itemId, index);
                                }}
                              >
                                <DeleteOutline />
                              </Button> */}
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
