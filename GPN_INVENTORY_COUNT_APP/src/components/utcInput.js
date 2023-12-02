import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const PopupModal = ({ isOpen, onClose, onConfirm, message }) => {
    return (
        <Modal open={isOpen} onClose={onClose}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 300,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 2,
                }}
            >
                <Typography variant="h6">Enter or Scan a Utc Code</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button onClick={onClose} color="primary" sx={{ mr: 1 }}>
                        No
                    </Button>
                    <Button onClick={onConfirm} variant="contained" color="primary">
                        Search
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default PopupModal;
