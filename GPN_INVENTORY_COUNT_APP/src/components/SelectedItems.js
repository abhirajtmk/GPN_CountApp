import * as React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { RemoveCircle, } from '@mui/icons-material';
import { IconButton, List } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { saveTransactions } from '../redux/slices/requests';


export default function SelectedItem() {
    const { selectedOrders } = useSelector((state) => state.requests);
    const dispatch = useDispatch();
    console.log({ selectedOrders });
    const handleRemoveOrder = (value) => {
        dispatch(saveTransactions(value));
    }
    return (
        <List
            sx={{
                width: '100%',
                maxWidth: 360,
                // bgcolor: 'background.paper',
                position: 'relative',
                overflow: 'auto',
                maxHeight: 200,
                marginTop: "20px",
                '& ul': { padding: 0 },
            }}
            subheader={<li />}
        >
            {selectedOrders?.map((item, index) => (
                <li key={`section-${index}`}>
                    <ul>


                        <ListItem
                            key={index}
                            disableGutters
                            sx={{ my: 0 }}
                            secondaryAction={
                                <IconButton aria-label="comment" onClick={() => handleRemoveOrder(item)}>
                                    <RemoveCircle />
                                </IconButton>
                            }
                        >
                            <ListItemText primary={item} />
                        </ListItem>

                    </ul>
                </li>
            ))}
        </List>
    );
}