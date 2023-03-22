import React, { useEffect, useState } from 'react';


import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

import { useDispatch } from 'react-redux';
import moment from 'moment';
import { updateInvoice } from '../../actions/invoiceActions';


const Modal = ({ setOpen, open, invoice}) => {

  const handleClickClose = () => {
    setOpen(false);
  };

  const dispatch = useDispatch();

  //Create a state to add new payment record
  const [payment, setPayment] = useState({
    amountPaid: 0,
    datePaid: moment(new Date()).format("YYYY-MM-DD"),
    paymentMethod: '',
    note: '',
    paidBy: ''
})

const [selectedDate, setSelectedDate] = React.useState(moment(new Date()).format('YYYY-MM-DD'));
//Crate a state to handle the payment records
  const [paymentRecords, setPaymentRecords] = useState([])
  const [method, setMethod] = useState({})
  const [totalAmountReceived, setTotalAmountReceived] = useState(0)
  const [updatedInvoice, setUpdatedInvoice] = useState({})

  useEffect(() => {
    setPayment({ ...payment, paymentMethod: method})
  },[method])

  useEffect(() => {
    setPayment({...payment, datePaid: selectedDate})
  },[selectedDate])

  useEffect(() => {
    if(invoice){
        setPayment({...payment, 
                    amountPaid: Number(invoice.total) - Number(invoice.totalAmountReceived) > 0 ? Number(invoice.total) - Number(invoice.totalAmountReceived) : 0,
                    paidBy: invoice?.client?.name
                })
    }
  },[invoice])

  useEffect(() => {
    if(invoice?.paymentRecords){
        setPaymentRecords(invoice?.paymentRecords)
    }
  },[invoice])

  useEffect(() => {
    let totalReceived = 0
      for(var i = 0; i < invoice?.paymentRecords?.length; i++) {
        totalReceived += Number(invoice?.paymentRecords[i]?.amountPaid)
        setTotalAmountReceived(totalReceived)
      }
  }, [invoice, payment])

  useEffect(() => {
    setUpdatedInvoice({...invoice, status: (Number(totalAmountReceived) + Number(payment.amountPaid)) 
      >= 
      invoice?.total ? 'Paid' : 'Partial', 
      paymentRecords: [...paymentRecords, payment], 
      totalAmountReceived:  Number(totalAmountReceived) + Number(payment.amountPaid)
    })
  },[payment, paymentRecords, totalAmountReceived, invoice] )

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(updateInvoice(invoice._id, updatedInvoice))
    .then(() => {
        handleClickClose()
        window.location.reload();
    })
  }

  const paymentMethods = [
    { title: 'Bank Transfer'},
    { title: 'Cash'},
    { title: 'Credit Card'},
    { title: 'PayPal'},
    { title: 'Others'},
  ]
  
  return (
    <div>
            <Dialog
              open={open}
              onClose={handleClickClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title" sx={{backgroundColor:"#1976D2", color:"white"}}>
                Record Payment
              </DialogTitle>
              <DialogContent sx={{marginTop:"10px"}}>
              <div className='mb-2'>
                <h1 className='text-zinc-400'>Date</h1>
                <TextField
                id="standard-size-small"
                size="small"
                variant="standard"
                type="date"
                value={selectedDate}
                required
                onChange={ (e) => setSelectedDate(moment(new Date(e.target.value)).format("YYYY-MM-DD"))}
                sx={{width:"100%", marginBottom:"10px"}}

                />
              </div>
                <TextField
                  id="outlined-size-normal"
                  label="Amount Paid"
                  name="amountPaid"
                  type="number"
                  InputProps={{ inputProps: { min: "0", step: "1" } }}
                  sx={{width:"100%", marginBottom:"10px"}}
                  onChange = { e => setPayment({ ...payment, amountPaid: e.target.value})} 
                  value = {payment.amountPaid.toFixed(2)}
                  required
                />

                <TextField
                id="filled-select-currency"
                select
                required
                label="Select Type"
                defaultValue='Bank Transfer'
                sx={{width:"100%", marginBottom:"10px"}}
                >
                {paymentMethods.map((option) => (
                    <MenuItem key={option.title} value={option.title} onClick={() => setMethod(option.title)}>
                    {option.title}
                    </MenuItem>
                ))}
                </TextField>

                <TextField
                  label="Note"
                  name="note"
                  type="text"
                  sx={{width:"100%"}}
                  onChange = { e => setPayment({ ...payment, note: e.target.value})} 
                  value = {payment.note}
                />
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClickClose} style={{backgroundColor: "#1976D2", color: "white"}}>Close</Button>
                  <Button onClick={(e) => {
                      handleSubmit(e)
                  }} autoFocus style={{backgroundColor:"#1976D2", color:"white"}}>
                    Save Record
                  </Button>
                </DialogActions>
                </Dialog>
    </div>
  )
}

export default Modal
