import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

const ImageExpandModal = ({ isOpen, onClose, itemImgUrl }) => {
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
                {<img src={itemImgUrl} width="100%" height="auto"></img>}
            </Box>
        </Modal >
    );
};

export default ImageExpandModal;
