import { Helmet } from 'react-helmet-async';
import { useEffect, useState, useContext } from 'react';
import { filter } from 'lodash';
import { Link, useLocation, useNavigate } from 'react-router-dom';
// @mui
import { Button, Card, Container, MenuItem, Paper, Popover, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from '@mui/material';
// components
import { SuccessModal, DelPurchaseModal } from '../components/modal';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
import { ModalContext } from '../hooks/ModalContext';
import PurchaseToolbar from '../sections/@dashboard/purchase/PurchaseToolbar';

// mock
import { GetPurchase } from '../services';
import Row from './productComponent/Row';


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
    return filter(array, (_purchase) => _purchase.id.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}


export default function PurchasePage() {
  // const [openFilter, setOpenFilter] = useState(false);
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [actionId, setActionId] = useState(null);
  const [delModalOpen, setDelModalOpen] = useState(false);

  const [rowData, setRowData] = useState([{
    id: "",
    po_date: "",
    total_qty: "0",
    total_amount: "0",
    supplier: "",
    purchase_order_detail: []
  }
  ]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [order, setOrder] = useState('asc');


  const search = useLocation().search;
  const status = new URLSearchParams(search).get('status');
  const navigate = useNavigate();
  const { closeModal,isModalOpen } = useContext(ModalContext);



  useEffect(() => {

    if (isModalOpen) {
      handleSuccesModal(isModalOpen);
    }

  }, [isModalOpen])




  useEffect(() => {

    GetPurchase().then(
      (response) => {

        const data = response.data.map((data) => {

          const rowData = {
            id: data.id,
            po_date: data.po_date,
            total_qty: data.total_qty,
            total_amount: data.total_amount,
            supplier: data.supplier.name,
            purchase_order_detail: data.purchase_order_detail
          }

          return rowData;
        })

        setRowData(data);


      }

    )

  }, [delModalOpen]);


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };



  const handleOpenMenu = (event, id) => {
    setMenuOpen(event.currentTarget);
    setActionId(id);
  };

  const handleDeleteModal = (open) => {
    setDelModalOpen(open)
    setMenuOpen(null);
  }


  // const handleOpenFilter = () => {
  //   setOpenFilter(true);
  // };

  // const handleCloseFilter = () => {
  //   setOpenFilter(false);
  // };

  const filteredPurchase = applySortFilter(rowData, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredPurchase.length && !!filterName;

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };



  const handleSuccesModal = (open) => setOpen(open);


  return (
    <>
      <Helmet>
        <title> Dashboard: Purchase | Minimal UI </title>
      </Helmet>



      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Purchase
          </Typography>
          <Button variant="contained" component={Link} to="/dashboard/purchase/add-purchase" startIcon={<Iconify icon="eva:plus-fill" />}>
            Add Purchase
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

          <PurchaseToolbar filterName={filterName} onFilterName={handleFilterByName} />

          <Scrollbar>
            <TableContainer sx={{ maxWidth: "100%" }}>
              <Table>

                <TableHead>
                  <TableRow>
                    <TableCell />
                    <TableCell>
                      Purchase ID
                    </TableCell>
                    <TableCell>
                      Purchase Date
                    </TableCell>
                    <TableCell>
                      Supplier
                    </TableCell>
                    <TableCell>
                      Total Items
                    </TableCell>
                    <TableCell>
                      Total Amount
                    </TableCell>
                    <TableCell>
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>

                  {filteredPurchase?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                    // console.log(row)
                    <Row key={row.id} rowData={row} handleOpenMenu={handleOpenMenu} />
                  ))}


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
            count={filteredPurchase?.length}
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
        onClose={() => setMenuOpen(false)}
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
        <MenuItem onClick={() => navigate(`/dashboard/purchase/edit/${actionId}`)}>
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem onClick={() => handleDeleteModal(true)} sx={{ color: 'error.main' }} >
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>

      <SuccessModal handleClose={closeModal} open={isModalOpen} />

      <DelPurchaseModal id={actionId} handleDeleteModal={handleDeleteModal} open={delModalOpen} />


    </>
  );
}



