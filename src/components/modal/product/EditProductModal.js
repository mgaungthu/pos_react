import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react'
import { Box, Divider, Modal, Stack, TextField, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { LoadingButton } from '@mui/lab';

import {updateProduct} from '../../../services';



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
  

EditProductModal.propTypes = {
  data:PropTypes.object,
    handleEditModal:PropTypes.func,
    open:PropTypes.bool
}


export default function EditProductModal({data,handleEditModal,open}) {

  const [loader,setLoader] = useState(false);
  
  const validationSchema = Yup.object().shape({
    product_name: Yup.string().required("Product Name is required"),
    description:Yup.string(),
    unitprice:Yup.string().required("Unitprice is required")
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
        "name": formData.product_name,
        "description": formData.description,
        "unitprice": formData.unitprice,
        "status": 1,
    };

      updateProduct(updateData,data.id).then(
          (response) => {
            console.log(response);
            setLoader(false);
            handleEditModal(false)
            reset();
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
              <TextField defaultValue={data.name} required name="product_name" label="Name" size="small"
                {...register('product_name')}

              />
              <Typography variant="inherit" color="error">
                {errors.product_name?.message}
              </Typography>

              <TextField defaultValue={data.unitprice} required name="unitprice" type="number" label="Unitprice" size="small"
                {...register("unitprice")}
              />
              <Typography variant="inherit" color="error">
                {errors.unitprice?.message}
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

