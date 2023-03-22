import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import useRedirectLoggedOutUser from '../../customeHook/useRedirectLoggedOutUser';
import { toCommas } from '../../utils/utils.js';
import Spinner from '../Spinner/Spinner.js';
import { getInvoicesByUser } from "../../actions/invoiceActions.js";
import moment from 'moment';


import TaskAltIcon from '@mui/icons-material/TaskAlt';
import PaymentIcon from '@mui/icons-material/Payment';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DescriptionIcon from '@mui/icons-material/Description';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

const columns = [
    { id: 'name', label: 'Name', minWidth: 170 },
    { id: 'date', label: 'Date', minWidth: 100 },
    {
      id: 'amount',
      label: 'Amount',
      minWidth: 170,
      align: 'left',
      format: (value) => value.toLocaleString('en-US'),
    },
    {
      id: 'paymentMethod',
      label: 'Payment Method',
      minWidth: 170,
      align: 'left',
      format: (value) => value.toLocaleString('en-US'),
    },
    {
      id: 'note',
      label: 'Note',
      minWidth: 170,
      align: 'left',
      format: (value) => value.toLocaleString('en-US'),

    },
  ];
  
  function createData(name, date, amount, paymentMethod, note) {
    return { name, date, amount, paymentMethod, note };
  }

const Dashboard = () => {

  useRedirectLoggedOutUser("/login");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('profile'));
  const { invoices, isLoading } = useSelector((state) => state?.invoices);
  const overDue = invoices?.filter((invoice) => invoice.dueDate <= new Date().toISOString());

  let paymentHistory = [];
  for(let i = 0; i < invoices.length; i++){
    let history = [];
    if(invoices[i].paymentRecords !== undefined){
      history = [...paymentHistory, invoices[i].paymentRecords];
      paymentHistory = [].concat.apply([],history);
    }
  }

  //sort payment history by date
  const sortHistoryByDate = paymentHistory.sort(function(a,b){
    var c = new Date(a.datePaid);
    var d = new Date(b.datePaid);
    return d-c;
  });

  let totalPaid = 0;
  for(let i = 0; i<invoices.length; i++){
    if(invoices[i].totalAmountReceived !== undefined){
      totalPaid += invoices[i].totalAmountReceived
    }
  }

  let totalAmount = 0
  for(let i = 0; i < invoices.length; i++) {
      totalAmount += invoices[i].total
  }

  useEffect(() => {
    dispatch(getInvoicesByUser({search: user?.result._id}));
  },[location, dispatch]);

    const unpaidInvoice = invoices?.filter((invoice) => invoice.status === 'Unpaid')
    const paid = invoices?.filter((invoice) => invoice.status === 'Paid')
    const partial = invoices?.filter((invoice) => invoice.status === 'Partial')
    
    if(!user) {
        navigate('/login')
    } 

    // data=products;
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
  
    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(+event.target.value);
      setPage(0);
    };
  
    if(isLoading) {
      return  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', paddingTop: '20px'}}>
          <Spinner />
      </div>
    }

    if(invoices.length === 0) {
      return  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', paddingTop: '20px'}}>
      <p style={{padding: '40px', color: 'gray'}}>Nothing to display. Click the plus icon to start creating</p>
      </div>
    }

  return (
    <div className='ml-16 pb-4 bg-gray-200' style={{minHeight: "92.7vh"}}>
      <div className='mx-6'>
      <div class="grid grid-cols-5 gap-2 p-2">

            <div className='flex p-6 items-center justify-between rounded-xl' style={{backgroundColor:"rgb(105, 142, 236)"}}>
                <div>
                    <h1 className='text-3xl'>{toCommas(totalPaid.toFixed(2))}</h1>
                    <p className='text-md'>Payment Received</p>
                </div>
                <div>
                  <TaskAltIcon style={{fontSize:"30px", color:"blue"}}/>
                </div>
            </div>

            <div className='flex p-6 items-center justify-between rounded-xl' style={{backgroundColor:"white"}}>
                <div>
                    <h1 className='text-3xl'>{toCommas((totalAmount - totalPaid).toFixed(2))}</h1>
                    <p className='text-md'>Pending Amount</p>
                </div>
                <div>
                  <AccountBalanceWalletIcon style={{fontSize:"30px", color:"green"}}/>
                </div>
            </div>

            <div className='flex p-6 items-center justify-between rounded-xl' style={{backgroundColor:"white"}}>
                <div>
                    <h1 className='text-3xl'>{toCommas(totalAmount.toFixed(2))}</h1>
                    <p className='text-md'>Total Amount</p>
                </div>
                <div>
                  <AccountBalanceIcon style={{fontSize:"30px", color:"rgb(105, 142, 236)"}}/>
                </div>
            </div>

            <div className='flex p-6 items-center justify-between rounded-xl' style={{backgroundColor:"white"}}>
                <div>
                    <h1 className='text-3xl'>{invoices.length}</h1>
                    <p className='text-md'>Total Invoices</p>
                </div>
                <div>
                  <PaymentIcon style={{fontSize:"30px", color:"green"}}/>
                </div>
            </div>

            <div className='flex p-6 items-center justify-between rounded-xl' style={{backgroundColor:"rgb(121, 220, 121)"}}>
                <div>
                    <h1 className='text-3xl'>{paid.length}</h1>
                    <p className='text-md'>Paid Invoices</p>
                </div>
                <div>
                  <TaskAltIcon style={{fontSize:"30px", color:"green"}}/>
                </div>
            </div>

            <div className='flex p-6 items-center justify-between rounded-xl' style={{backgroundColor:"white"}}>
                <div>
                    <h1 className='text-3xl'>{partial.length}</h1>
                    <p className='text-md'>Partially Paid Invoices</p>
                </div>
                <div>
                  <DescriptionIcon style={{fontSize:"30px", color:"green"}}/>
                </div>
            </div>

            <div className='flex p-6 items-center justify-between rounded-xl' style={{backgroundColor:"white"}}>
                <div>
                    <h1 className='text-3xl'>{unpaidInvoice.length}</h1>
                    <p className='text-md'>Unpaid Invoices</p>
                </div>
                <div>
                  <SentimentVeryDissatisfiedIcon style={{fontSize:"30px", color:"red"}}/>
                </div>
            </div>

            <div className='flex p-6 items-center justify-between rounded-xl' style={{backgroundColor:"white"}}>
                <div>
                    <h1 className='text-3xl'>{overDue.length}</h1>
                    <p className='text-md'>Overdue</p>
                </div>
                <div>
                  <AccessTimeIcon style={{fontSize:"30px", color:"red"}}/>
                </div>
            </div>

            

        </div>

        <h1 className='text-center my-4 text-2xl font-medium'>Recent Payments</h1>

        {paymentHistory.length!==0 ? 
        (<div>
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  {paymentHistory.length !== 0 &&(<TableRow>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        style={{ minWidth: column.minWidth, backgroundColor: 'white', fontSize:"large", fontWeight:"bold", color: "rgb(67, 65, 65)", }}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>)}
                </TableHead>
                <TableBody>
                  {sortHistoryByDate
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((record, index) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={record._id}>
                    <TableCell>{record?.paidBy}</TableCell>
                    <TableCell>{moment(record?.datePaid).format("YYYY-MM-DD")}</TableCell>
                    <TableCell>{toCommas(record?.amountPaid.toFixed(2))}</TableCell>
                    <TableCell>{record?.paymentMethod}</TableCell>
                    <TableCell>{record?.note}</TableCell>
                  </TableRow>
                );
              })}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[3, 5, 10, 25, 100]}
              component="div"
              count={sortHistoryByDate.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              style={{color:"black", fontWeight:"bold"}}
            />
          </Paper>
        </div>) : (
          <p className='bg-red-500 text-2xl p-2 text-white rounded-md' 
          style={{textAlign: 'center',backgroundColor: 'rgb(30, 40, 64)'}}>
            -- No Recent Payments --
          </p>
        )}
      </div>
    </div>
  )
}

export default Dashboard
