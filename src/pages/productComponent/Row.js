import React, { useState } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment';


// @mui
import { Box, Collapse, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import Iconify from '../../components/iconify';



const Row = ({rowData,handleOpenMenu}) => {

    const [open, setOpen] = React.useState(false);


    
  return (
            <>
                    <TableRow hover sx={{ '& > *': { borderBottom: 'unset' } }}>
                        <TableCell padding="checkbox">
                            <IconButton
                                aria-label="expand row"
                                size="small"
                                onClick={() => setOpen(!open)}
                            >
                                {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                            </IconButton>
                        </TableCell>
                        <TableCell >{rowData.id}</TableCell>
                        <TableCell >{moment(rowData.po_date).format("DD MMM Y")}</TableCell>
                        <TableCell align="left">{rowData.supplier}</TableCell>
                        <TableCell align="left">{rowData.total_qty}</TableCell>
                        <TableCell align="left">{rowData.total_amount}</TableCell>
                        <TableCell align="left">
                            <IconButton size="large" color="inherit" onClick={e => handleOpenMenu(e,rowData.id)}>
                                <Iconify icon={'eva:more-vertical-fill'} />
                            </IconButton>
                        </TableCell>
                    </TableRow>

                    <TableRow>
                        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
                            <Collapse in={open} timeout="auto" unmountOnExit>
                                <Box sx={{ margin: 1 }}>
                                    <Typography variant="h6" gutterBottom component="div">
                                        Order Detail
                                    </Typography>
                                    <Table size="small" aria-label="purchases">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Product</TableCell>
                                                <TableCell>Unit</TableCell>
                                                <TableCell>Quantity</TableCell>
                                                <TableCell>Total Amount</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                        {
                                            rowData.purchase_order_detail.map((v,i)=>{
                                                return (
                                                    <TableRow key={i}>
                                                        <TableCell align="left">{v.product.name}</TableCell>
                                                        <TableCell align="left">{v.unit.name}</TableCell>
                                                        <TableCell align="left">{v.qty}</TableCell>
                                                        <TableCell align="left">{v.amount}</TableCell>
                                                    </TableRow>
                                                )
                                            })
                                        }
                                            
                                        </TableBody>
                                    </Table>
                                </Box>
                            </Collapse>
                        </TableCell>
                    </TableRow>
            </>
  )
}

Row.propTypes = {
    handleOpenMenu:PropTypes.func,
    rowData:PropTypes.shape({
            id:PropTypes.string.isRequired,
            po_date:PropTypes.string.isRequired,
            total_qty:PropTypes.string.isRequired,
            total_amount:PropTypes.string.isRequired,
            supplier:PropTypes.string.isRequired,
            purchase_order_detail:PropTypes.array.isRequired
        })
}

export default Row