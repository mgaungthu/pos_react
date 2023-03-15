import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Box, Divider, Modal, Stack, Typography } from '@mui/material'
import { LoadingButton } from '@mui/lab'

import { DeleteProduct } from '../../../services';



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
};


DeleteModal.propTypes = {
    id: PropTypes.any,
    handleDeleteModal: PropTypes.func,
    open: PropTypes.bool
}




export default function DeleteModal({ id, handleDeleteModal, open }) {


    const [loader, setLoader] = useState(false);

    const handleDelete = (id) => {
        // console.log(id);
        DeleteProduct(id).then(
            (response) => {
                console.log(response);
                handleDeleteModal(false)
            }
        )

    }


    return (
        <Modal
            open={open}
            onClose={e => handleDeleteModal(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h4" gutterBottom>
                    Delete Product
                </Typography>

                <Divider />

                <Stack spacing={2} mt={3} >

                    <Typography variant='p' component="p" >
                        Are you sure want to delete this?
                    </Typography>

                    <Stack direction="row" spacing={1}>
                        <LoadingButton onClick={e => handleDelete(id)} loading={loader} fullWidth size="small" color='error' type="submit" variant="contained" >
                            Yes
                        </LoadingButton>
                        <LoadingButton onClick={e => handleDeleteModal(false)} loading={loader} fullWidth size="small" color='secondary' type="submit" variant="contained" >
                            NO
                        </LoadingButton>
                    </Stack>


                </Stack>



            </Box>
        </Modal>
    )
}

