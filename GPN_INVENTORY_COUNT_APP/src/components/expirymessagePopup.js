import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const ExpiryPopupModal = ({ isOpen, onClose, message }) => {
    return (
        <Modal open={isOpen} onClose={onClose}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: "100%",
					maxWidth:"600px",

                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 2,
                }}
            >
                <Typography variant="h6">Message </Typography>
                <Typography sx={{ mt: 2 }}>{message}</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>

                    <Button onClick={onClose} variant="contained" color="primary">
                        Acknowledge
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default ExpiryPopupModal;
