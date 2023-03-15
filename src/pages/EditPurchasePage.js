import React, { useEffect, useState, useContext } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async'
import { Box, Button, Container, Divider, FormControl, IconButton, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material'
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { AddCircle, ArrowBackIos, Backpack, RemoveCircle } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { ModalContext } from '../hooks/ModalContext';

import { getPurchaseCreate, getPurchaseDetail, insertPurchase, updatePurchase } from '../services';



const style2 = {
  padding: "25px",
  border: "1px solid #ccc",
  borderRadius: "12px",
  width: "100%",
  position: "relative"
}

const numberBox = {
  position: "absolute",
  left: "-5px",
  top: "-10px",
  background: "#39316e",
  padding: "10px",
  color: "#fff",
  borderRadius: "50%",
  width: "28px",
  height: "28px",
}

export default function EditPurchasePage() {

  const { id } = useParams();
  

  const [loader, setLoader] = useState(false);
  const [dyInputList, setDyInputList] = useState(
    [{
      product_id: "",
      unit_price: "",
      unit_id: "",
      qty: "",
      amount: ""
    }
  ]
  );

  const [supList, setSupList] = useState([]);
  const [productList, setProductList] = useState([]);
  const [unitList, setUnitList] = useState([]);
  const { openModal, SetMessage } = useContext(ModalContext);

  const navigate = useNavigate();


  useEffect(() => {

    getPurchaseCreate().then(
      response => {
        const { product, supplier, unit } = response.data;
        setSupList(supplier);
        setProductList(product);
        setUnitList(unit);
        // console.log(product);
      }
    )
  }, [])




  const handleAddClick = () => {
    setDyInputList([...dyInputList,
    {
      product_id: "",
      unit_price: "",
      unit_id: "",
      qty: "",
      amount: ""
    }]);
  };


  const translateProducName = (id) => {
    const result = productList.find(item => item.id === id);
    return result?.name;
  }


  const validationSchema = Yup.object().shape({
    supplier_name: Yup.string().required("Supplier is required"),
    order_detail: Yup.array().of(
      Yup.object().shape({
        product_id: Yup.string().required("Product is required"),
        unit_price: Yup.string().required("Unit Price is required"),
        unit_id: Yup.string().required("Unit is required"),
        qty: Yup.string().required('Quantity is required'),
        amount: Yup.string().required("Amount is required")
      })
    )
  })

  const {
    register,
    setValue,
    trigger,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchema)
  });


  useEffect(() =>{

    getPurchaseDetail(id).then(
      (response) => {
        setSupVal(response.data.supplier_id);
        const orderDetail = response.data.purchase_order_detail;
      
        const data = orderDetail.map((v) => {
          
        
          return {
            product_id: v.product_id,
            unit_price: v.unit_price,
            unit_id: v.unit_id,
            qty: v.qty,
            amount: v.amount
          };

        })

        setDyInputList(data);
        reset();
        // console.log(data); 

      }
    )

  },[id]);


  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...dyInputList];

    list[index][name] = value;
    if (name.includes("product_id")) {
      const unitPrice = "unit_price";
      const result = productList.find(item => item.id === value);
      list[index].product_id = value;
      list[index][unitPrice] = result.unitprice;
      setValue(`order_detail.${index}.unit_price`,result.unitprice)
      trigger(`order_detail.${index}.unit_price`);
      
      list[index].unit_id = '';
      setValue(`order_detail.${index}.unit_id`,'')
      list[index].qty = '';
      setValue(`order_detail.${index}.qty`,'')
      list[index].amount = '';
      setValue(`order_detail.${index}.amount`,'')
      
      
    } else if (name.includes("qty"))
    {
      list[index].qty = value;
      const amount = list[index].unit_price * value;
      list[index].amount = amount.toString();
      setValue(`order_detail.${index}.amount`,amount)
      trigger(`order_detail.${index}.amount`);

    } else if (name.includes("unit_id"))
    {
      list[index].unit_id = value;
      setValue(`order_detail.${index}.unit_id`,value)
      trigger(`order_detail.${index}.unit_id`);
    } 

    setDyInputList(list);

  };

  const handleRemoveClick = index => {
    const list = [...dyInputList];
    list.splice(index, 1);
    setDyInputList(list);
    // console.log(dyInputList);
    reset();
  };
  



  const onSubmit = data => {
    setLoader(true);
    // console.log(JSON.stringify(data, null, 2));
    const current = new Date();
    
    

    const insertData  = {
        "supplier_id": data.supplier_name,
        "total_qty": dyInputList.length,
        "total_amount": dyInputList.reduce((prev, curr, index, array) => Number(prev) + Number(curr.amount), 0),
        "remark":"",
        "username":"",
        "order_detail":data.order_detail
    };
    

    updatePurchase(insertData,id).then(
      (response) => {
        
        console.log(response);
        setLoader(false);
        // reset();
        openModal()
        SetMessage("Edit purchase was successful")
        navigate("/dashboard/purchase/")
      },
      (error) => {
        console.log(error);
      }
    );



  }



  // const supplierName =

  const [supVal, setSupVal] = useState('');



  const handleChange = (e) => {
    setSupVal(e.target.value);
  }





  return (

    <div>
      <Helmet>
        <title> Dashboard: Add Purchase | Minimal UI </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Add Purchase
          </Typography>

          <Button variant="contained" color='error' component={Link} to="/dashboard/purchase" startIcon={<ArrowBackIos icon="eva:plus-fill" />}>
            Back
          </Button>
        </Stack>


        <Box>

          <Stack spacing={2} mt={3}>

            <FormControl fullWidth size="small">
              <InputLabel id="supplier-select-label">Supplier</InputLabel>
              <Select
                value={supVal}
                name="supplier_name"
                {...register("supplier_name", { onChange: (e) => { handleChange(e) } })}
                labelId="supplier-select-label"
                id="supplier-select"
                label="Supplier"
              >
                {
                  supList.map((val, i) => {
                    return (
                      <MenuItem key={i} value={val.id}>{val.name}</MenuItem>
                    )
                  })
                }

              </Select>
            </FormControl>
            <Typography color="error" variant='body2' mt={1} ml={1}>
              {errors.supplier_name?.message}
            </Typography>

            <Typography>
              Order Detail
            </Typography>


            {dyInputList.map((x, i) => {

              const no = i + 1;

              return (
                <Stack key={i} direction="row" gap={2}  >
                  <Box sx={style2}>
                    <Box sx={numberBox}>
                      <Typography sx={{ position: "relative", top: "-10px", fontSize: "12px" }} variant='body2' component="span">
                        {no}
                      </Typography>
                    </Box>
                    <Stack direction="row" mb={2} justifyContent="space-between" alignItems="center">
                      <Typography variant="body2" component="h6">
                    
                        Add {x.product_id ? translateProducName(x.product_id) : "Product"}
                        
                      </Typography>
                      {no === 1 ? "": <IconButton onClick={e => handleRemoveClick(i)} variant="contained" >
                        <RemoveCircle color='danger' />
                      </IconButton>}
                      
                    </Stack>

                    <Stack direction="row" spacing={2}>

                      <Box sx={{ width: "40%" }}>
                        <FormControl fullWidth size="small">
                          <InputLabel id="product-select-label">Product</InputLabel>
                          <Select
                            name={`order_detail[${i}]product_id`}
                            {...register(`order_detail.${i}.product_id`, { onChange: (e) => { handleInputChange(e, i) } })}
                            labelId="product-select-label"
                            id="product-select"
                            label="Product"
                            value={x.product_id}
                          >
                            {
                              productList.map((val, i) => {

                                return (

                                  <MenuItem key={i} value={val.id} >{val.name}</MenuItem>

                                )
                              })
                            }
                          </Select>
                        </FormControl>
                        <Typography color="error" variant='body2' mt={1} ml={1}>
                          {errors.order_detail?.[i]?.product_id?.message}
                        </Typography>
                      </Box>

                      <Box sx={{ width: "30%" }}>
                        <TextField name={`order_detail[${i}]unit_price`} {...register(`order_detail.${i}.unit_price`, { onChange: (e) => { handleInputChange(e, i) } })}
                          value={x.unit_price} id="unit_price" type="number" label="Unit Price" size="small" />
                        <Typography color="error" variant='body2' mt={1} ml={1}>
                          {errors.order_detail?.[i]?.unit_price?.message}
                        </Typography>
                      </Box>


                      <Box sx={{ width: "30%" }}>
                        <FormControl fullWidth size="small">
                          <InputLabel id="unit-select-label">Unit</InputLabel>
                          <Select
                            {...register(`order_detail.${i}.unit_id`, { onChange: (e) => { handleInputChange(e, i) } })}
                            labelId="unit-select-label"
                            id="unit-select"
                            value={x.unit_id}
                            label="Unit"
                            name={`order_detail.${i}.unit_id`}
                          >
                            {
                              unitList.map((val, i) => {
                                return (

                                  <MenuItem key={i} value={val.id}>{val.name}</MenuItem>

                                )
                              })
                            }
                          </Select>
                        </FormControl>
                        <Typography color="error" variant='body2' mt={1} ml={1}>
                          {errors.order_detail?.[i]?.unit_id?.message}
                        </Typography>
                      </Box>


                      <Box sx={{ width: "30%" }}>
                        <TextField value={x.qty}  {...register(`order_detail.${i}.qty`, { onChange: (e) => { handleInputChange(e, i) } })}

                          name={`order_detail.${i}.qty`}
                          label="Quantity" size="small" />
                        <Typography color="error" variant='body2' mt={1} ml={1}>
                          {errors.order_detail?.[i]?.qty?.message}
                        </Typography>
                      </Box>

                      <Box sx={{ width: "30%" }}>
                        <TextField
                          {...register(`order_detail.${i}.amount`, { onChange: (e) => { handleInputChange(e, i) } })}
                          InputProps={{ readOnly: true }}
                          value={x.amount}
                          type="number" name={`order_detail.${i}.amount`} label="Amount" size="small" />

                        <Typography color="error" variant='body2' mt={1} ml={1}>
                          {errors.order_detail?.[i]?.amount?.message}
                        </Typography>
                      </Box>

                    </Stack>
                  </Box>
                </Stack>
              );

            })}

            <Box sx={{ border: "1px dotted #ccc", p: 2, borderRadius: 2, "&:hover": { background: "#ececec" } }}>
              <Stack direction="row" justifyContent="center">
                <Box display="block" textAlign="center">
                  <IconButton onClick={handleAddClick} variant="contained" >
                    <AddCircle color='primary' />
                  </IconButton>
                  <Typography variant='body2' component="p">
                    Add More
                  </Typography>
                </Box>

              </Stack>

            </Box>




            <Stack direction="row" justifyContent="space-between">
              <Typography>
                Total Item : {dyInputList.length}
              </Typography>


              Total Amount : {(dyInputList.reduce((prev, curr, index, array) => Number(prev) + Number(curr.amount), 0))}


            </Stack>


            <LoadingButton loading={loader} fullWidth onClick={handleSubmit(onSubmit)} type="submit" variant="contained">
              Update Product
            </LoadingButton>

          </Stack>

        </Box>
      </Container>


    </div>
  )
}



