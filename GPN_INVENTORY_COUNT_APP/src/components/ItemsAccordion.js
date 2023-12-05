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
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import { DeleteOutline } from "@mui/icons-material";

const CssTableCell = styled(TableCell)((props) => ({
  padding: 2,
}));

function ItemsAccordion({ useFieldArray, remove }) {
  const [items, setItems] = useState([]);
  const [open , setOpen] = useState(false);
  
  // const [open , setOpen] = useState('');
  var openItems = [];

  const handleClick =(id)=>{
   setOpen(!open)
    const index = openItems.indexOf(id);
    const s = id.toString();
         if(index !== -1){
          openItems.splice(index, 1);
         }else{
          openItems.push(s)
         }
         console.log("index", index)
         console.log("openarr" , openItems)
  }

  useEffect(() => {
    const updatedArray = useFieldArray.reduce((acc, current) => {
      const title = current.itemName;
      const id = current.itemId;
      const isserial = current.isSerialItem;
      const existingGroup = acc.find((item) => item.title === title);
      current = { ...current, id };
      if (existingGroup) {
        existingGroup.elements.push(current);
      } else {
        acc.push({ title, id, isserial, elements: [current] });
      }
      return acc;
    }, []);

    setItems(updatedArray);
    console.log("itesm accordionn" , items)
  }, [useFieldArray , open]);
  return (
    <>
    <TableContainer>
      <Table sx={{justifyContent: 'space-between'}}>
      {items.map(({ title , id ,isserial,  elements }) => {

       
          
        const totalQuantity = elements.reduce(
          (acc, element) => acc + element.quantity,
          0
        );
        return (
          < >
                <TableRow >
                  <TableCell align="left">{title}</TableCell>
                  <TableCell align="center">Quantity: {isserial ? <>{totalQuantity}</> : <input type="number" width='10px' defaultValue={totalQuantity}/>}</TableCell>
                  <TableCell align="left">{isserial ? "Serialized" : "Non Serialized"}</TableCell>
                  {isserial ? <div> <Button onClick={()=>{handleClick(title)}}> 
                  <ExpandMoreIcon/>
                  </Button> </div>: <div>
                  <Button >
                  <ClearOutlinedIcon />
                  </Button>
                    
                    </div>}
                </TableRow>
                {/* <Typography></Typography>
                <Typography></Typography>
                <Typography></Typography> */}
                {console.log("includes" , openItems.indexOf(title.toString()) )}
                {isserial && (openItems.indexOf(title.toString()) !== -1) ? <div>
                  <>
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
             </>
                </div> : ""}
         
          </>
        );
      })}
      </Table>
    </TableContainer>
    </>
  );
}

export default ItemsAccordion;
