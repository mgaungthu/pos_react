import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { filter } from 'lodash';
// @mui
import { Box, Button, Card, Checkbox, Container, IconButton, MenuItem, Paper, Popover, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel, Typography } from '@mui/material';
// components
import { AddProductModal, EditProductModal, DeleteModal } from "../components/modal";

import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// Data
import { getProduct, getProductDetail } from '../services';
import ProductListToolbar from '../sections/@dashboard/product/ProductListToolbar';


// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

const visuallyHidden = {
  border: 0,
  margin: -1,
  padding: 0,
  width: '1px',
  height: '1px',
  overflow: 'hidden',
  position: 'absolute',
  whiteSpace: 'nowrap',
  clip: 'rect(0 0 0 0)',
};



export default function ProductsPage() {
  // const [openFilter, setOpenFilter] = useState(false);
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [productData, setProductData] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [delModalOpen, setDelModalOpen] = useState(false);
  const [actionId, setActionId] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState([]);
  const [data, setData] = useState(
    {
      id: 0,
      name: "",
      description: "",
      unitprice: 0
    }

  )
  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [order, setOrder] = useState('asc');



  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };


  // const handleOpenFilter = () => {
  //   setOpenFilter(true);
  // };

  // const handleCloseFilter = () => {
  //   setOpenFilter(false);
  // };


  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {

    getProduct().then(
      (response) => {
        setProductData(response.data);
      }
    )

  }, [open, editModalOpen, delModalOpen])

  const handleOpenMenu = (event, id) => {
    setMenuOpen(event.currentTarget);
    setActionId(id);
  };

  const handleCloseMenu = () => {
    setMenuOpen(null);
  };

  const handleEditModal = (open) => {

    if (open) {
      getProductDetail(actionId).then(
        response => {
          const data = response.data;
          setData(
            {
              id: data.id,
              name: data.name,
              description: data.description,
              unitprice: data.unitprice
            }
          )

          setMenuOpen(null);
          setEditModalOpen(open);

        }
      )
    } else {
      setEditModalOpen(open);

    }

  }

  const handleDeleteModal = (open) => {
    setDelModalOpen(open)
    setMenuOpen(null);
  }

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = productData?.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };


  const filteredProduct = applySortFilter(productData, getComparator(order, orderBy), filterName);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const createSortHandler = (property) => (event) => {
    handleRequestSort(event, property);
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };


  const isNotFound = !filteredProduct.length && !!filterName;

  return (
    <>
      <Helmet>
        <title> Dashboard: Products | Minimal UI </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Products
          </Typography>
          <Button variant="contained" onClick={handleOpen} startIcon={<Iconify icon="eva:plus-fill" />}>
            Add Product
          </Button>

        </Stack>

        {/* <Stack direction="row" flexWrap="wrap-reverse" alignItems="center" justifyContent="flex-end" sx={{ mb: 5 }}>
          <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
            <ProductFilterSidebar
              openFilter={openFilter}
              onOpenFilter={handleOpenFilter}
              onCloseFilter={handleCloseFilter}
            />
            <ProductSort />
          </Stack>
        </Stack> */}

        <Card>

          <ProductListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

          <Scrollbar>
            <TableContainer sx={{ maxWidth: "100%" }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        indeterminate={selected.length > 0 && selected.length < productData?.length}
                        checked={productData?.length > 0 && selected.length === productData?.length}
                        onChange={handleSelectAllClick}
                      />
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        hideSortIcon
                        active={orderBy === "name"}
                        direction={orderBy === "name" ? order : 'asc'}
                        onClick={createSortHandler("name")}
                      >
                        Product Name
                        {orderBy === "Product Name" ? (
                          <Box sx={{ ...visuallyHidden }}>{order === 'desc' ? 'sorted descending' : 'sorted ascending'}</Box>
                        ) : null}
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      Unit Price
                    </TableCell>
                    <TableCell sx={{ width: "60%" }}>
                      Description
                    </TableCell>
                    <TableCell>
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                    filteredProduct?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {

                      const { id, name, description, unitprice } = row;
                      const selectedUser = selected.indexOf(id) !== -1;

                      return (
                        <TableRow hover key={id}>
                          <TableCell padding="checkbox">
                            <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, id)} />
                          </TableCell>
                          <TableCell align="left">{name}</TableCell>
                          <TableCell align="left">{unitprice}</TableCell>
                          <TableCell align="left">{description}</TableCell>
                          <TableCell align="center">
                            <IconButton size="large" color="inherit" onClick={e => handleOpenMenu(e, id)}>
                              <Iconify icon={'eva:more-vertical-fill'} />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );

                    })
                  }
                </TableBody>

                {isNotFound && ( 
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            Not found
                          </Typography>

                          <Typography variant="body2">
                            No results found for &nbsp;
                            <strong>&quot;{filterName}&quot;</strong>.
                            <br /> Try checking for typos or using complete words.
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}

              </Table>

            </TableContainer>
          </Scrollbar>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredProduct?.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>

      </Container>

      <Popover
        open={Boolean(menuOpen)}
        anchorEl={menuOpen}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            width: 140,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <MenuItem onClick={e => handleEditModal(true)}>
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem sx={{ color: 'error.main' }} onClick={e => handleDeleteModal(true)}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>

      <AddProductModal handleClose={handleClose} open={open} />
      <EditProductModal data={data} handleEditModal={handleEditModal} open={editModalOpen} />
      <DeleteModal id={actionId} handleDeleteModal={handleDeleteModal} open={delModalOpen} />

    </>
  );
}
