import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { Box, Button, Divider, Modal, Stack, Typography } from '@mui/material'
import { ModalContext } from '../../../hooks/ModalContext';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    borderRadius: 2.5,
    width: { xs: 300, sm: 380 },
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    outline: 'none',
};


SuccessModal.propTypes = {
    open: PropTypes.bool,
    handleClose: PropTypes.func
}



export default function SuccessModal({ open, handleClose }) {

    const { message } = useContext(ModalContext);


    return (
        <Modal
            open={open}
            onClose={e => handleClose()}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            sx={{
                border: "none"
            }}
        >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h4" gutterBottom>
                    Let you know
                </Typography>

                <Divider />

                <Stack direction="column" spacing={2} mt={3}  >
                    <Typography variant='p' component="p" >
                        {message}
                    </Typography>
                    <Button onClick={e => handleClose(false)} fullWidth type="submit" variant="contained" >
                        OK
                    </Button>
                </Stack>
            </Box>
        </Modal>
    )
}

