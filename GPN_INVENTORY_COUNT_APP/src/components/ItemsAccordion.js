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
import { Grid } from '@material-ui/core';
import { useEffect, useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { DeleteOutline } from "@mui/icons-material";
import ClearIcon from '@mui/icons-material/Clear';

const CssTableCell = styled(TableCell)((props) => ({
  padding: 2,
}));

function ItemsAccordion({ useFieldArray, handledelete , handleUnserialdelete , handleQnt }) {
  const [items, setItems] = useState([]);

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
        acc.push({ title, isserial ,elements: [current] });
      }

      return acc;
    }, []);


    setItems(updatedArray);
  }, [useFieldArray]);




  return (
    <>
      {items.map(({ title, isserial , elements }) => {
        var totalQuantity = elements.reduce(
          (acc, element) => acc + element.quantity,
          0
        );

        // {const  handleChange = ()=>{
        //       totalQuantity++;
        // }}

        return (
          <Accordion disableGutters={true}>
            <AccordionSummary
              expandIcon={isserial ? <ExpandMoreIcon /> : <><ClearIcon/></>}
              aria-controls="panel2a-content"
              id="panel2a-header"
            >
              <Box
                display={"flex"}
                width={"60%"}
                justifyContent={"space-between"}
              >
                 
                 <Grid container spacing={2} justify="space-between" >
        {/* First Typography */}
        <Grid item>
        <Typography>{title}{isserial ? " /(S)" : " /(NS)"}</Typography>
        </Grid>
        {/* Second Typography */}
        <Grid item>
          <Typography align="right">
          Quantity:  {isserial ? <>{totalQuantity}</> : <> <input type="number" defaultValue={totalQuantity} style={{width : '2em'}} onChange={(e)=>{handleQnt(e.target.value , title)}} min={0}/> </>}
          </Typography>
        </Grid>
      </Grid> 
              </Box>
            </AccordionSummary>
             {isserial ? <>
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
                                      handledelete(a.serialName);
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
             </> : <>
             <AccordionDetails>
              <Table>
                <TableRow>
                <Table>
      <TableBody>
        <TableRow>
          {/* Other cells in the row */}
          <CssTableCell></CssTableCell>
          <CssTableCell></CssTableCell>

          {/* Single cell spanning the entire row */}
          <CssTableCell colSpan={2} align="right"> 
                                  <Button
                                    onClick={() => {
                                      handleUnserialdelete(title);
                                    }}
                                  >
                                    <DeleteOutline />
                                  </Button>
                                </CssTableCell>
        </TableRow>
      </TableBody>
    </Table>
                </TableRow>
              </Table>
             </AccordionDetails>
             
             </>}
          </Accordion>
        );
      })}
    </>
  );
}

export default ItemsAccordion;
