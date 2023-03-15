import PropTypes from 'prop-types';
import React, { useState } from 'react'
import { Box, Divider, Modal, Stack, TextField, Typography } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { LoadingButton } from '@mui/lab';
import {insertMenu} from '../../../services';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    borderRadius:2.5,
    width: { xs: 300, sm: 580 } ,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
  };
  

  AddModal.propTypes = {
  handleClose: PropTypes.func,
  handleUpdateData:PropTypes.func,
  open:PropTypes.bool
}


export default function AddModal({handleClose,open,handleUpdateData}) {

  const [loader,setLoader] = useState(false);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    description:Yup.string(),
    price:Yup.string().required("price is required")
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchema)
  });

  const onSubmit = data => {
    setLoader(true);
    // console.log(JSON.stringify(data, null, 2));

    const insertData  = {
        "name": data.name,
        "description": data.description,
        "price": data.price,
        "status": 1,
    };

    insertMenu(insertData).then(
          (response) => {
            // console.log(response);
            setLoader(false);
            handleClose(false)
            reset();
            handleUpdateData(response.data);
          },
          (error) => {
            console.log(error);
          }
      );
   
   
  }
  
    return (
      <div>
        <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h4" gutterBottom>
            Add Menu
          </Typography>

          <Divider/>

          <Stack spacing={2} mt={3}>
              <TextField required name="name" label="Name" size="small"
                {...register('name')}
              />
              <Typography variant="inherit" color="error">
                {errors.name?.message}
              </Typography>

              <TextField required name="price" type="number" label="price" size="small"
                {...register("price")}
              />
              <Typography variant="inherit" color="error">
                {errors.price?.message}
              </Typography>


              <TextField required name="description" multiline rows={2} label="Description" size="small"
                {...register("description")}
              />
            
          <LoadingButton loading={loader} fullWidth size="small"  onClick={handleSubmit(onSubmit)} type="submit" variant="contained">
            Add Menu
          </LoadingButton>

           </Stack>

          

        </Box>
      </Modal>
      </div>
    );
}

