import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react'
import { Box, Divider, Modal, Stack, TextField, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { LoadingButton } from '@mui/lab';

import {updateMenu} from '../../../services';



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
  

EditModal.propTypes = {
  data:PropTypes.object,
    handleEditModal:PropTypes.func,
    handleUpdateData:PropTypes.func,
    maindata:PropTypes.array,
    open:PropTypes.bool
}


export default function EditModal({data,handleEditModal,open,handleUpdateData,maindata}) {

  const [loader,setLoader] = useState(false);
  
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Product Name is required"),
    description:Yup.string(),
    price:Yup.string().required("Unitprice is required")
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchema)
  });

  useEffect(() => {

    reset();
    
  }, [data])
  
  
  const onSubmit = formData => {
    setLoader(true);
    // console.log(JSON.stringify(data, null, 2));

    const updateData  = {
        "name": formData.name,
        "description": formData.description,
        "price": formData.price,
        "status": 1,
    };

      updateMenu(updateData,data.id).then(
          (response) => {
            console.log(response);
            setLoader(false);
            handleEditModal(false)
            reset();
            const updatedData = response.data;
            const newData = maindata.map(row => {
              // console.log((row.id === response.data.id));
              if (row.id === updatedData.id) {
                return updatedData;
              } 
              return row;
            });
            
            handleUpdateData(newData);
            
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
        onClose={e => handleEditModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h4" gutterBottom>
            Edit Product {data.name}
          </Typography>

          <Divider/>

          <Stack spacing={2} mt={3}>
              <TextField defaultValue={data.name} required name="name" label="Name" size="small"
                {...register('name')}

              />
              <Typography variant="inherit" color="error">
                {errors.name?.message}
              </Typography>

              <TextField defaultValue={data.price} required name="price" type="number" label="Price" size="small"
                {...register("price")}
              />
              <Typography variant="inherit" color="error">
                {errors.price?.message}
              </Typography>


              <TextField defaultValue={data.description} required name="description" multiline rows={2} label="Description" size="small"
                {...register("description")}
              />
            
            
            <LoadingButton loading={loader} fullWidth size="small"  onClick={handleSubmit(onSubmit)} type="submit" variant="contained">
            Update Product
          </LoadingButton>

           </Stack>

          

        </Box>
      </Modal>
      </div>
    );


}

