import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const PopupModal = ({ isOpen, onClose, onConfirm, message, removeItem }) => {
    return (
        <Modal open={isOpen} onClose={onClose}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: "100%",
					maxWidth:"360px",

                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 2,
                    border: "1px solid grey",
                    borderRadius: "12px"
                }}
            >
                <Typography variant="h6">Are you sure?</Typography>
                <Typography sx={{ mt: 2 }}>{message}</Typography>
                {removeItem && removeItem?.index > -1 && (
                    <>
                        <Typography sx={{ mt: 2 }}><strong> Quantity : </strong>{removeItem?.data?.quantity} {removeItem?.data?.uomNumber}</Typography>
                        <Typography sx={{ mt: 2 }}><strong>Status : </strong>{removeItem?.data?.status}</Typography>
                    </>
                )}

                <Box>

                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button onClick={onClose} color="primary" sx={{ mr: 1 }}>
                        No
                    </Button>
                    <Button onClick={onConfirm} variant="contained" color="primary">
                        Yes
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default PopupModal;
