import * as React from "react";
import useRedirectLoggedOutUser from "../../customeHook/useRedirectLoggedOutUser";
import { toCommas } from "../../utils/utils";
import axios from "axios";
import moment from "moment";

import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
import { IconButton } from "@mui/material";
import DeleteOutlineRoundedIcon from "@mui/icons-material/Delete";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import SaveIcon from "@mui/icons-material/Save";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import DeleteIcon from "@mui/icons-material/Delete";

import { useLocation, useNavigate, useParams } from "react-router-dom";
import currencies from "../../currencies.json";
import { useDispatch, useSelector } from "react-redux";

import { createInvoice, getInvoice, updateInvoice } from "../../actions/invoiceActions";
import { createClient, getClientsByUser } from "../../actions/clientActions";

const columns = [
    { id: "item", label: "Item", minWidth: 200 },
    { id: "qty", label: "Qty" },
    {
        id: "price",
        label: "Price",
        align: "left",
    },
    {
        id: "disc",
        label: "Disc(%)",
        align: "left",
    },
    {
        id: "amount",
        label: "Amount",
        align: "left",
    },
    {
        id: "action",
        label: "Action",
        align: "left",
    },
];

const typesOfBill = [
    {
        value: "Invoice",
        label: "Inovice",
    },
    {
        value: "Receipt",
        label: "Receipt",
    },
    {
        value: "Estimate",
        label: "Estimate",
    },
    {
        value: "Bill",
        label: "Bill",
    },
    {
        value: "Quotation",
        label: "Quotation",
    },
];

const user = JSON.parse(localStorage.getItem("profile"));

const initialState = {
    items: [{ itemName: "", unitPrice: "", quantity: "", discount: "" }],
    total: 0,
    notes: user?.userProfile?.paymentDetails,
    rates: "",
    vat: 0,
    currency: "",
    invoiceNumber: Math.floor(Math.random() * 100000),
    status: "",
    type: "Invoice",
    creator: "",
};

const Invoice = () => {
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

    const location = useLocation();
    const [invoiceData, setInvoiceData] = React.useState(initialState);
    // const [items, setItems] = React.useState(invoiceData?.items);
    const [rates, setRates] = React.useState(0);
    const [vat, setVat] = React.useState(0);
    const [currency, setCurrency] = React.useState(currencies[0].value);
    const [subTotal, setSubTotal] = React.useState(0);
    const [total, setTotal] = React.useState(0);
    const [selectedDate, setSelectedDate] = React.useState(moment().format("YYYY-MM-DD"));
    const [client, setClient] = React.useState(null);
    const [clientData, setClientData] = React.useState({ name: "", email: "", phone: "", address: "", userId: "" });
    const [type, setType] = React.useState("Invoice");
    const [status, setStatus] = React.useState("");

    const { id } = useParams();

    const clients = useSelector((state) => state.clients.clients);

    const { invoice, isError } = useSelector((state) => state.invoices);

    console.log("error ", isError);
    

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("profile"));
    const [openn, setOpenn] = React.useState(false);

    if (isError) {
        navigate("/dashboard");
    }

    const handleClickOpen = () => {
        setOpenn(true);
    };

    const handleClickClose = () => {
        setOpenn(false);
    };

    React.useEffect(() => {
        getTotalCount();
    }, [location]);

    const getTotalCount = async () => {
        try {
            const randomNumber = Math.floor(Math.random() * 10000) + 1;
            setInvoiceData({ ...invoiceData, invoiceNumber: randomNumber });
        } catch (error) {
            console.log(error.response.data.message);
        }
    };

    React.useEffect(() => {
        dispatch(getInvoice(id));
    }, [location, id]);

    React.useEffect(() => {
        dispatch(getClientsByUser({ search: user?.result?._id }));
    }, [location, dispatch]);

    React.useEffect(() => {
        if (invoice) {
            //Automatically set the default invoice values as the ones in the invoice to be updated
            setInvoiceData(invoice);
            setRates(invoice.rates);
            setClient(invoice.client);
            setType(invoice.type);
            setStatus(invoice.status);
            setSelectedDate(moment(invoice.dueDate).format("YYYY-MM-DD"));
        }
    }, [invoice]);

    React.useEffect(() => {
        if (type === "Receipt") {
            setStatus("Paid");
        } else {
            setStatus("Unpaid");
        }
    }, [type]);

    const handleRates = (e) => {
        setRates(e.target.value);
        setInvoiceData((prevState) => ({ ...prevState, tax: e.target.value }));
    };

    // Change handler for dynamically added input field
    const handleChange = (index, e) => {
        const values = [...invoiceData.items];
        values[index][e.target.name] = e.target.value;
        setInvoiceData({ ...invoiceData, items: values });
    };

    React.useEffect(() => {
        //Get the subtotal
        const subTotal = () => {
            var arr = document.getElementsByName("amount");
            var subtotal = 0;
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].value) {
                    subtotal += +arr[i].value;
                }
                setSubTotal(subtotal);
            }
        };
        subTotal();
    }, [invoiceData]);

    React.useEffect(() => {
        const total = () => {
            //Tax rate is calculated as (input / 100 ) * subtotal + subtotal
            const overallSum = (rates / 100) * subTotal + subTotal;
            //VAT is calculated as tax rates /100 * subtotal
            setVat((rates / 100) * subTotal);
            setTotal(overallSum);
        };
        total();
    }, [invoiceData, rates, subTotal]);

    const handleAddField = (e) => {
        e.preventDefault();
        setInvoiceData((prevState) => ({
            ...prevState,
            items: [...prevState.items, { itemName: "", unitPrice: "", quantity: "", discount: "", amount: "" }],
        }));
    };

    const handleRemoveField = (index) => {
        const values = invoiceData.items;
        values.splice(index, 1);
        setInvoiceData((prevState) => ({ ...prevState, values }));
    };

    const addClient = (e) => {
        e.preventDefault();
        dispatch(createClient({ ...clientData, userId: user?.result?._id }));
        handleClickClose();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (invoice) {
            dispatch(
                updateInvoice(invoice._id, {
                    ...invoiceData,
                    subTotal: subTotal,
                    total: total,
                    vat: vat,
                    rates: rates,
                    currency: currency,
                    dueDate: selectedDate,
                    client,
                    type: type,
                    status: status,
                })
            );
            navigate(`/invoice/${invoice._id}`);
        } else {
            dispatch(
                createInvoice({
                    ...invoiceData,
                    subTotal: subTotal,
                    total: total,
                    vat: vat,
                    rates: rates,
                    currency: currency,
                    dueDate: selectedDate,
                    invoiceNumber: `${
                        invoiceData.invoiceNumber < 100
                            ? Number(invoiceData.invoiceNumber).toString().padStart(3, "0")
                            : Number(invoiceData.invoiceNumber)
                    }`,
                    client,
                    type: type,
                    status: status,
                    paymentRecords: [],
                    creator: [user?.result?._id],
                })
            );
            navigate("/dashboard");
        }
    };

    if (!user) {
        navigate("/login");
    }

    return (
        <div className="ml-16 pb-4 bg-gray-200" style={{ minHeight: "92.7vh" }}>
            <br />
            <div className="p-6 bg-white border-2 border-gray-400 rounded-md w-3/5 mx-auto mt-12">
                <form onSubmit={handleSubmit}>
                    <div className="flex justify-end">
                        <TextField
                            id="filled-select-currency"
                            select
                            label="Select Type"
                            defaultValue="Invoice"
                            helperText="Please select your Type"
                            variant="filled"
                        >
                            {typesOfBill.map((option) => (
                                <MenuItem key={option.value} value={option.value} onClick={() => setType(option.value)}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </div>
                    <div className="flex justify-end mt-2 border-b border-gray-400">
                        <span className="my-auto text-xl mr-2">Invoice#:</span>
                        <input
                            type="text"
                            placeholder=""
                            readOnly
                            className="bg-gray-300 pl-2 w-20 max-w-xs h-8"
                            value={invoiceData.invoiceNumber}
                            onInput={(e) =>
                                setInvoiceData({
                                    ...invoiceData,
                                    invoiceNumber: e.currentTarget.textContent,
                                })
                            }
                        />
                    </div>
                    <div className="flex justify-between px-4">
                        <div className="my-4 w-1/2">
                            <h1 className="mb-4 font-medium">BILL TO</h1>

                            {client && (
                                <div>
                                    <h1 className="font-bold">{client.name}</h1>
                                    <h1>{client.email}</h1>
                                    <h1>{client.phone}</h1>
                                    <h1>{client.address}</h1>
                                    <button className="text-blue-700" onClick={() => setClient(null)}>
                                        Change
                                    </button>
                                </div>
                            )}
                            <div style={client ? { display: "none" } : { display: "block" }}>
                                <TextField
                                    id="outlined-select-currency"
                                    select
                                    label="Select Customer"
                                    helperText="Please select Customer"
                                    color="info"
                                    required={!invoice && true}
                                >
                                    <MenuItem>Select Customer</MenuItem>
                                    {clients?.map((option) => (
                                        <MenuItem
                                            key={option.name}
                                            value={option.name}
                                            onClick={() => setClient(option)}
                                        >
                                            {option.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </div>
                            {!client && (
                                <div className="">
                                    <button
                                        className="border-gray-400 border rounded-3xl btn-sm text-lg normal-case mt-3 hover:bg-gray-200 h-10 text-gray-600"
                                        type="button"
                                        onClick={handleClickOpen}
                                    >
                                        <AddCircleIcon sx={{ marginRight: "5px", fontSize: "30px" }} />
                                        New Customer
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="my-4 w-1/2 text-end">
                            <h1 className="text-xs text-gray-500">STATUS</h1>
                            <h1 className="text-xl font-bold" style={{ color: type === "Receipt" ? "green" : "red" }}>
                                {type === "Receipt" ? "Paid" : "Unpaid"}
                            </h1>
                            <h1 className="text-xs text-gray-500 mt-2">Date</h1>
                            <h1 className="font-medium">{moment().format("MMM Do YYYY")}</h1>
                            <h1 className="text-xs text-gray-500 mt-2">Due Date</h1>
                            <h1 className="font-medium">
                                {selectedDate ? moment(selectedDate).format("MMM Do YYYY") : "27 sep 2023"}
                            </h1>
                            <h1 className="text-xs text-gray-500 mt-2">AMOUNT</h1>
                            <h1 className="font-medium text-2xl">
                                {currency} {toCommas(total)}
                            </h1>
                        </div>
                    </div>

                    <div>
                        <Paper sx={{ width: "100%", overflow: "hidden" }}>
                            <TableContainer sx={{ maxHeight: 440, border: "4px solid #d1d5db" }}>
                                <Table stickyHeader aria-label="sticky table">
                                    <TableHead>
                                        <TableRow>
                                            {columns.map((column) => (
                                                <TableCell
                                                    key={column.id}
                                                    align={column.align}
                                                    style={{
                                                        minWidth: column.minWidth,
                                                        backgroundColor: "gray",
                                                        fontSize: "large",
                                                        fontWeight: "bold",
                                                        color: "white",
                                                    }}
                                                >
                                                    {column.label}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {invoiceData?.items
                                            ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            ?.map((item, index) => {
                                                return (
                                                    <TableRow hover role="checkbox" tabIndex={-1} key={item.index}>
                                                        <TableCell scope="row">
                                                            <input
                                                                type="text"
                                                                value={item.itemName}
                                                                name="itemName"
                                                                onChange={(e) => handleChange(index, e)}
                                                                placeholder="Item name or description"
                                                                required
                                                                className="pl-2 w-full max-w-xs h-8"
                                                            />
                                                        </TableCell>
                                                        <TableCell align="left">
                                                            <input
                                                                type="number"
                                                                value={item.quantity}
                                                                name="quantity"
                                                                onChange={(e) => handleChange(index, e)}
                                                                placeholder="0"
                                                                required
                                                                className="pl-2 w-20 max-w-xs h-8"
                                                            />
                                                        </TableCell>
                                                        <TableCell align="left">
                                                            <input
                                                                type="number"
                                                                value={item.unitPrice}
                                                                name="unitPrice"
                                                                onChange={(e) => handleChange(index, e)}
                                                                placeholder="0"
                                                                required
                                                                className="pl-2 w-20 max-w-xs h-8"
                                                            />
                                                        </TableCell>
                                                        <TableCell align="left">
                                                            <input
                                                                type="number"
                                                                value={item.discount}
                                                                name="discount"
                                                                onChange={(e) => handleChange(index, e)}
                                                                placeholder="0"
                                                                required
                                                                className="pl-2 w-20 max-w-xs h-8"
                                                            />
                                                        </TableCell>
                                                        <TableCell align="left">
                                                            <input
                                                                type="number"
                                                                value={(
                                                                    item.quantity * item.unitPrice -
                                                                    (item.quantity * item.unitPrice * item.discount) /
                                                                        100
                                                                ).toFixed(2)}
                                                                name="amount"
                                                                disabled
                                                                className="pl-2 w-20 max-w-xs h-8"
                                                            />
                                                        </TableCell>
                                                        <TableCell align="left">
                                                            <IconButton onClick={() => handleRemoveField(index)}>
                                                                <DeleteOutlineRoundedIcon
                                                                    style={{ width: "20px", height: "20px" }}
                                                                />
                                                            </IconButton>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    </div>
                    <div>
                        <button type="button" onClick={handleAddField} className="my-2 ml-2">
                            <AddCircleOutlinedIcon style={{ color: "#1976D2", fontSize: "40px" }} />
                        </button>
                    </div>
                    <div className="flex my-6">
                        <div className="w-4/6"></div>
                        <div className="w-2/6">
                            <h1 className="bg-zinc-200 p-2 text-zinc-700 font-semibold rounded-sm border-b-2 border-gray-400">
                                Invoice Summary
                            </h1>
                            <div className="flex justify-between px-2 py-1 border-b-2 border-gray-400">
                                <h1>Sub Total:</h1>
                                <h1>{subTotal.toFixed(2)}</h1>
                            </div>
                            <div className="flex justify-between px-2 py-1 border-b-2 border-gray-400">
                                <h1>VAT(%)</h1>
                                <h1>{vat}</h1>
                            </div>
                            <div className="flex justify-between px-2 py-1 border-b-2 border-gray-400">
                                <h1>Total</h1>
                                <h1 className="font-bold">
                                    {currency} {toCommas(total.toFixed(2))}
                                </h1>
                            </div>
                        </div>
                    </div>
                    <div className="flex my-6">
                        <div className="mx-2">
                            <h1 className="text-zinc-400">Tax Rates(%)</h1>
                            <TextField
                                id="standard-size-small"
                                defaultValue={0}
                                size="small"
                                variant="standard"
                                type="number"
                                onChange={handleRates}
                            />
                        </div>

                        <div className="mx-2">
                            <h1 className="text-zinc-400">Due Date</h1>
                            <TextField
                                id="standard-size-small"
                                size="small"
                                variant="standard"
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(moment(new Date(e.target.value)).format("YYYY-MM-DD"))}
                            />
                        </div>
                        <div className="mx-2">
                            <h1 className="text-zinc-400">Select currency</h1>
                            <TextField
                                id="standard-select-currency"
                                size="small"
                                select
                                // defaultValue="EUR"
                                variant="standard"
                                placeholder="Select currency"
                                sx={{ width: "150px" }}
                            >
                                {currencies.map((option) => (
                                    <MenuItem
                                        key={option.label}
                                        value={option.value}
                                        onClick={() => setCurrency(option.value)}
                                    >
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </div>
                    </div>

                    <div>
                        <h1 className="font-bold">Note / Payment Info:-</h1>
                        <TextField
                            type="text"
                            multiline
                            rows={3}
                            sx={{ width: "100%" }}
                            value={invoiceData?.notes}
                            // placeholder="Provide additional details or terms of service"
                            onChange={(e) => setInvoiceData({ ...invoiceData, notes: e.target.value })}
                        />
                    </div>

                    <div className="flex justify-center">
                        <button
                            className="btn btn-sm text-xl mt-4 normal-case bg-blue-600 text-white
                hover:bg-blue-500 border-none  w-1/3 h-10"
                            type="submit"
                        >
                            <SaveIcon sx={{ marginRight: "6px" }} />
                            SAVE AND CONTINUE
                        </button>
                    </div>
                </form>
            </div>
            <Dialog
                open={openn}
                onClose={handleClickClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title" sx={{ backgroundColor: "#1976D2", color: "white" }}>
                    {"New Customer"}
                </DialogTitle>
                <DialogContent sx={{ marginTop: "10px" }}>
                    <form onSubmit={addClient}>
                        <TextField
                            label="Name"
                            type="text"
                            variant="filled"
                            onChange={(e) => setClientData({ ...clientData, name: e.target.value })}
                            required
                            sx={{ width: "100%" }}
                        />
                        <TextField
                            label="Email"
                            type="email"
                            variant="filled"
                            onChange={(e) => setClientData({ ...clientData, email: e.target.value })}
                            required
                            sx={{ width: "100%" }}
                        />
                        <TextField
                            label="Phone"
                            type="text"
                            variant="filled"
                            onChange={(e) => setClientData({ ...clientData, phone: e.target.value })}
                            required
                            sx={{ width: "100%" }}
                        />
                        <TextField
                            label="Address"
                            type="text"
                            variant="filled"
                            onChange={(e) => setClientData({ ...clientData, address: e.target.value })}
                            required
                            sx={{ width: "100%" }}
                        />
                        <div className="flex justify-end mt-4">
                            <Button
                                onClick={handleClickClose}
                                style={{ backgroundColor: "#1976D2", color: "white", marginRight: "8px" }}
                            >
                                Close
                            </Button>
                            <Button type="submit" autoFocus style={{ backgroundColor: "#1976D2", color: "white" }}>
                                Save Customer
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Invoice;
