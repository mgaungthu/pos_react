import PropTypes from 'prop-types';
import React, { useState } from 'react'
import { Box, Divider, FormControl, Grid, IconButton, InputLabel, MenuItem, Modal, Select, Stack, TextField, Typography } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { LoadingButton } from '@mui/lab';
import { Add, AddCircle } from '@mui/icons-material';
import {insertProduct} from '../../../services';




const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    borderRadius:2.5,
    width: { xs: 300, sm: 1080 } ,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
  };

const style2 = {
  padding: "25px",
  border: "1px solid #ccc",
  borderRadius: "12px",
  width:"100%",
}


  

AddPurchaseModal.propTypes = {
  handleClose: PropTypes.func,
  open:PropTypes.bool
}


export default function AddPurchaseModal({handleClose,open}) {

  const [loader,setLoader] = useState(false);
  const [dyInputList, setDyInputList] = useState(
    [{ 
      productId: "", 
      unitprice: "",
      unitId:"",
      quantity:"",
      amount:""
    }]
    );

  const handleAddClick = () => {
    setDyInputList([...dyInputList,
      { 
        productId: "", 
        unitprice: "",
        unitId:"",
        quantity:"",
        amount:""
    }]);
  };

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...dyInputList];
    list[index][name] = value;
    setDyInputList(list);
    console.log(dyInputList);
  };

  const validationSchema = Yup.object().shape({
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

  const onSubmit = data => {
    setLoader(true);
    console.log(JSON.stringify(data, null, 2));

    // const insertData  = {
    //     "name": data.product_name,
    //     "description": data.description,
    //     "unitprice": data.unitprice,
    //     "status": 1,
    // };

    //   insertProduct(insertData).then(
    //       (response) => {
    //         console.log(response);
    //         setLoader(false);
    //         handleClose(false)
    //         reset();
    //       },
    //       (error) => {
    //         console.log(error);
    //       }
    //   );
   
   
  }

  const [supplier, setSupplier] = React.useState('');
  

  const handleChange = (event) => {
    setSupplier(event.target.value);
  };

  const testCHange = (event) => {
    console.log(event.target.value)
  }
  
    return (
      <div>
        <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{
          overflow:"scroll"
        }}
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h4" gutterBottom>
            Add Purchase
          </Typography>

          <Divider/>

          <Stack spacing={2} mt={3}>

            <FormControl fullWidth size="small">
                <InputLabel id="supplier-select-label">Supplier</InputLabel>
                <Select
                    labelId="supplier-select-label"
                    id="supplier-select"
                    value={supplier}
                    label="Supplier"
                    onChange={handleChange}
                >
                    <MenuItem value={1}>City Mart</MenuItem>
                    <MenuItem value={2}>Spirit</MenuItem>
                </Select>
            </FormControl>

              <Typography>
                Order Detail
              </Typography>

              
                {dyInputList.map((x, i) => {

                  return (
                    <Stack key={i} direction="row" gap={2}  >
                    <Box   sx={style2}>
                      <Stack direction="row" mb={2} justifyContent="space-between" alignItems="center">
                        <Typography variant="body2" component="h6">
                          Select Product
                        </Typography>
                        <IconButton onClick={handleAddClick} variant="contained" >
                          <AddCircle color='primary' />
                        </IconButton>
                      </Stack>

                      <Stack direction="row" spacing={2}>
                      
                          <FormControl sx={{ width: "40%" }} size="small">
                            <InputLabel id="supplier-select-label">Product</InputLabel>
                            <Select
                              labelId="supplier-select-label"
                              id="supplier-select"
                              label="Supplier"
                              value={x.productId}
                              name="productId"
                              onChange={e => handleInputChange(e, i)}
                            >
                              <MenuItem value={1}>Flour</MenuItem>
                              <MenuItem value={2}>Rice</MenuItem>
                            </Select>
                          </FormControl>

                          <TextField sx={{ width: "20%" }}  {...register('unitprice')} name="unitprice" id="unitprice" value={x.unitprice} onChange={e => handleInputChange(e, i)} type="number" label="Unitprice" size="small" />
                      
                        <FormControl sx={{ width: "30%" }} fullWidth size="small">
                          <InputLabel id="supplier-select-label">Unit</InputLabel>
                          <Select
                            labelId="supplier-select-label"
                            id="supplier-select"
                            value={x.unitId}
                            label="Unit"
                            name="unitId"
                            onChange={e => handleInputChange(e, i)}
                          >
                            <MenuItem value={1}>Gram</MenuItem>
                            <MenuItem value={2}>Liter</MenuItem>
                          </Select>
                        </FormControl>


                          <TextField sx={{ width: "30%" }} onChange={e => handleInputChange(e, i)} defaultValue={x.quantity} required name="quantity" label="Quantity" size="small" />
                          <TextField  sx={{ width: "30%" }} onChange={e => handleInputChange(e, i)} defaultValue={x.amount} name="amount" label="Amount" size="small" />
                        
                      </Stack>
                    </Box>
                    </Stack>
                  );

                })}
             

            

            <Stack direction="row" justifyContent="space-between">
                <Typography>
                  Total  Quantity : {200}
                </Typography>
                Total Amount : 120,000 Ks
            </Stack>

            

             
            
             

              <LoadingButton loading={loader} fullWidth size="small"  onClick={handleSubmit(onSubmit)} type="submit" variant="contained">
            Add Product
          </LoadingButton>

           </Stack>

          

        </Box>
      </Modal>
      </div>
    );
}

