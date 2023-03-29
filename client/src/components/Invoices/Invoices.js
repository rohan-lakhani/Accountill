import React, { useEffect, useState } from 'react';
import useRedirectLoggedOutUser from '../../customeHook/useRedirectLoggedOutUser';
import image_1 from "../../images/image_1.jpeg";

import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import Spinner from '../Spinner/Spinner';
import moment from 'moment';

import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteIcon from '@mui/icons-material/Delete';
import { deleteInvoice, getInvoicesByUser } from '../../actions/invoiceActions';

const columns = [
    { id: 'number', label: 'Number' },
    { id: 'client', label: 'Client' },
    {
      id: 'amount',
      label: 'Amount',
      align: 'left',
      format: (value) => value.toLocaleString('en-US'),
    },
    {
      id: 'dueDate',
      label: 'Due Date',
      align: 'left',
      format: (value) => value.toLocaleString('en-US'),
    },
    {
      id: 'status',
      label: 'Status',
      align: 'left',
      format: (value) => value.toLocaleString('en-US'),

    },
    {
      id: 'edit',
      label: 'Edit',
      align: 'left',
      format: (value) => value.toLocaleString('en-US'),

    },
    {
      id: 'delete',
      label: 'Delete',
      align: 'left',
      format: (value) => value.toLocaleString('en-US'),

    },
  ];
  
  function createData(number, client, amount, dueDate, status) {
    return { number, client, amount, dueDate, status };
  }

  const rows = [
    createData('India the great', 'IN', 1324171354, 3287263, "hello", "Paid", ),
    createData('China', 'CN', 1403500365, 9596961, "hello", ),
    createData('Italy', 'IT', 60483973, 301340, "hello", ),
    createData('United States', 'US', 327167434, 9833520, "hello", ),
    createData('Canada', 'CA', 37602103, 9984670, "hello", ),
    createData('Australia', 'AU', 25475400, 7692024, "hello", ),
    createData('Germany', 'DE', 83019200, 357578, "hello", ),
    createData('Ireland', 'IE', 4857000, 70273, "hello", ),
    createData('Mexico', 'MX', 126577691, 1972550, "hello", ),
    createData('Japan', 'JP', 126317000, 377973, "hello", ),
    createData('France', 'FR', 67022000, 640679, "hello", ),
    createData('United Kingdom', 'GB', 67545757, 242495, "hello", ),
    createData('Russia', 'RU', 146793744, 17098246, "hello", ),
    createData('Nigeria', 'NG', 200962417, 923768, "hello", ),
    createData('Brazil', 'BR', 210147125, 8515767, "hello", ),
  ];


const Invoices = () => {

    useRedirectLoggedOutUser("/login");

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
  
    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(+event.target.value);
      setPage(0);
    };

    //hovering effect
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('profile'));
    const invoices = useSelector(state => state.invoices.invoices);
    const isLoading = useSelector(state => state.invoices.isLoading);

    useEffect(() => {
      dispatch(getInvoicesByUser({ search: user?.result?._id}))
    },[location])

    const toCommas = (value) => {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    }

    const editInvoice = (id) => {
      navigate(`/edit/invoice/${id}`)
    }

    const openInvoice = (id) => {
      navigate(`/invoice/${id}`)
    }
    if(!user){
      navigate('/login')
    }

    function checkStatus(status) {
      return status === "Partial" ? {border: 'solid 0px #1976d2', backgroundColor: '#baddff', padding: '8px 18px', borderRadius: '20px' }
          : status === "Paid" ? {border: 'solid 0px green', backgroundColor: '#a5ffcd', padding: '8px 18px', borderRadius: '20px' }
          : status === "Unpaid" ? {border: 'solid 0px red', backgroundColor: '#ffaa91', padding: '8px 18px', borderRadius: '20px' }
          : "red";
            
    }

    if(isLoading){
      return <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', paddingTop: '20px'}}>
        <Spinner/>
      </div>
    }

    if(invoices.length === 0) {
      return  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', paddingTop: '20px'}}>
      <img src={image_1} alt="emptyIcon"/>
      <p style={{color: 'gray', textAlign: 'center'}} className="text-xl">No invoice yet. Click the plus icon to add Invoice</p>
      </div>
    }

  return (
    <div className='ml-16 pb-4 bg-gray-200' style={{minHeight: "92.7vh"}}>
      <div className='mx-6'>
        <div className='pt-20 px-20'>
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        style={{ minWidth: column.minWidth, backgroundColor: 'white', fontSize:"large", fontWeight:"bold", color: "rgb(67, 65, 65)", }}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {invoices
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((invoice) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={invoice._id}>
                    <TableCell onClick={() => openInvoice(invoice._id)}>{invoice.invoiceNumber}</TableCell>

                    <TableCell onClick={() => openInvoice(invoice._id)}>{invoice.client.name}</TableCell>

                    <TableCell onClick={() => openInvoice(invoice._id)}>{invoice.currency} {invoice.total ? toCommas(invoice.total) : invoice.total}</TableCell>

                    <TableCell onClick={() => openInvoice(invoice._id)}>{moment(invoice.dueDate).fromNow()}</TableCell>

                    <TableCell onClick={() => openInvoice(invoice._id)} sx={{backgroundColor:""}}><button onClick={checkStatus(invoice.status)}>{invoice.status}</button></TableCell>
                    
                    <TableCell align='center' onClick={() => editInvoice(invoice._id)} sx={{backgroundColor:"", width:"50px", cursor:"pointer"}}><ModeEditIcon/></TableCell>

                    <TableCell align='center' onClick={() => dispatch(deleteInvoice(invoice._id))} sx={{backgroundColor:"", width:"50px", cursor:"pointer"}}><DeleteIcon/></TableCell>

                  </TableRow>
                );
              })}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[3, 5, 10, 25, 100]}
              component="div"
              count={invoices.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              style={{color:"black", fontWeight:"bold"}}
            />
          </Paper>
        </div>
      </div>
    </div>
  )
}

export default Invoices
