import * as React from "react";
import useRedirectLoggedOutUser from "../../customHook/useRedirectLoggedOutUser";
import { toCommas } from "../../utils/utils";
import axios from "axios";
import moment from "moment";
import { saveAs } from "file-saver";

import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getInvoice } from "../../actions/invoiceActions";
import Modal from "../Payment/Modal";
import PaymentHistory from "./PaymentHistory";
import Spinner from "../Spinner/Spinner";
import { toast } from "react-toastify";

const columns = [
  { id: "item", label: "Item", minWidth: 200 },
  { id: "qty", label: "Qty" },
  {
    id: "price",
    label: "Price",
    align: "left",
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "disc",
    label: "Disc(%)",
    align: "left",
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "amount",
    label: "Amount",
    align: "left",
    format: (value) => value.toLocaleString("en-US"),
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

const InvoiceDetails = () => {
  useRedirectLoggedOutUser("/login");

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const location = useLocation();
  const [invoiceData, setInvoiceData] = React.useState(initialState);
  const [rates, setRates] = React.useState(0);
  const [vat, setVat] = React.useState(0);
  const [currency, setCurrency] = React.useState("");
  const [subTotal, setSubTotal] = React.useState(0);
  const [total, setTotal] = React.useState(0);
  const [selectedDate, setSelectedDate] = React.useState(moment().format("YYYY-MM-DD"));
  const [client, setClient] = React.useState([]);
  const [type, setType] = React.useState("");
  const [status, setStatus] = React.useState("");
  const isLoading = useSelector((state) => state.invoices.isLoading);

  const { id } = useParams();

  const { invoice } = useSelector((state) => state.invoices);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [company, setCompany] = React.useState({});
  const [sendStatus, setSendStatus] = React.useState(null);
  const [downloadStatus, setDownloadStatus] = React.useState(null);

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  React.useEffect(() => {
    dispatch(getInvoice(id));
  }, [id, dispatch, location]);

  React.useEffect(() => {
    if (invoice) {
      //Automatically set the default invoice values as the ones in the invoice to be updated
      setInvoiceData(invoice);
      setRates(invoice.rates);
      setClient(invoice.client);
      setType(invoice.type);
      setStatus(invoice.status);
      setSelectedDate(moment(invoice.dueDate).format("YYYY-MM-DD"));
      setVat(invoice.vat);
      setCurrency(invoice.currency);
      setSubTotal(invoice.subTotal);
      setTotal(invoice.total);
      setCompany(invoice?.businessDetails?.data?.data);
    }
  }, [invoice]);

  //Get the total amount paid
  let totalAmountReceived = 0;
  for (var i = 0; i < invoice?.paymentRecords?.length; i++) {
    totalAmountReceived += Number(invoice?.paymentRecords[i].amountPaid);
  }

  const editInvoice = (id) => {
    navigate(`/edit/invoice/${id}`);
  };

  const createAndDownloadPDF = () => {
    setDownloadStatus("loading");
    axios
      .post("/api/create-pdf", {
        name: invoice.client.name,
        address: invoice.client.address,
        phone: invoice.client.phone,
        email: invoice.client.email,
        dueDate: invoice.dueDate,
        date: invoice.createdAt,
        id: invoice.invoiceNumber,
        notes: invoice.notes,
        subTotal: toCommas(invoice.subTotal),
        total: toCommas(invoice.total),
        type: invoice.type,
        vat: invoice.vat,
        items: invoice.items,
        status: invoice.status,
        totalAmountReceived: toCommas(totalAmountReceived),
        balanceDue: toCommas(total - totalAmountReceived),
        company: company,
      })
      .then(() => axios.get("/api/fetch-pdf", { responseType: "blob" }))
      .then((res) => {
        const pdfBlob = new Blob([res.data], { type: "application/pdf" });
        saveAs(pdfBlob, "invoice.pdf");
      })
      .then(() => setDownloadStatus("success"));
  };

  //SEND PDF INVOICE VIA EMAIL
  const sendPdf = (e) => {
    e.preventDefault();
    setSendStatus("loading");
    axios
      .post("/api/send-pdf", {
        name: invoice.client.name,
        address: invoice.client.address,
        phone: invoice.client.phone,
        email: invoice.client.email,
        dueDate: invoice.dueDate,
        date: invoice.createdAt,
        id: invoice.invoiceNumber,
        notes: invoice.notes,
        subTotal: toCommas(invoice.subTotal),
        total: toCommas(invoice.total),
        type: invoice.type,
        vat: invoice.vat,
        items: invoice.items,
        status: invoice.status,
        totalAmountReceived: toCommas(totalAmountReceived),
        balanceDue: toCommas(total - totalAmountReceived),
        link: `http://localhost:3000/invoice/${invoice._id}`,
        company: company,
      })
      .then(() => {
        toast.success("Invoice send successfully");
        setSendStatus("success");
      })
      .catch((error) => {
        console.log(error);
        setSendStatus("error");
      });
  };

  function checkStatus() {
    return totalAmountReceived >= total
      ? "green"
      : status === "Partial"
      ? "#1976d2"
      : status === "Paid"
      ? "green"
      : status === "Unpaid"
      ? "red"
      : "red";
  }

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="ml-16 pb-4 bg-gray-200" style={{ minHeight: "92.7vh" }}>
      <br />
      {invoice?.creator?.includes(user?.result?._id) && (
        <div className="text-center">
          <button className="border border-blue-400 rounded-3xl px-6 py-2 text-lg bg-white mx-2" onClick={sendPdf}>
            Send to Customer
          </button>
          <button
            className="border border-blue-400 rounded-3xl px-6 py-2 text-lg bg-white mx-2"
            onClick={createAndDownloadPDF}
          >
            Download PDF
          </button>
          <button
            className="border border-blue-400 rounded-3xl px-6 py-2 text-lg bg-white mx-2"
            onClick={() => editInvoice(invoiceData._id)}
          >
            Edit Invoice
          </button>
          <button
            className="border border-blue-400 rounded-3xl px-6 py-2 text-lg bg-white mx-2"
            onClick={handleClickOpen}
          >
            Report Payment
          </button>
          <Modal open={open} setOpen={setOpen} invoice={invoice} />
        </div>
      )}

      {invoice?.paymentRecords.length !== 0 && <PaymentHistory paymentRecords={invoiceData?.paymentRecords} />}

      <div className="p-6 bg-white border-2 border-gray-400 rounded-md w-3/5 mx-auto mt-6">
        <form>
          <div className="flex justify-end">
            <h1>{Number(total - totalAmountReceived) <= 0 ? "Receipt" : type}</h1>
          </div>
          <div className="flex justify-end mt-2 border-b border-gray-400">
            <span className="my-auto text-xl mr-2">Invoice#:</span>
            <input
              type="text"
              placeholder=""
              className="bg-gray-300 pl-2 w-20 max-w-xs h-8"
              value={invoiceData.invoiceNumber}
              disabled
            />
          </div>
          <div className="flex justify-between px-4">
            <div className="my-4 w-1/2">
              {invoice?.creator?.includes(user?.result?._id) && (
                <div>
                  <h1 className="mb-4 font-medium">From</h1>
                  <div>
                    <h1 className="font-bold">{invoice?.businessDetails?.data?.data?.businessName}</h1>
                    <h1>{invoice?.businessDetails?.data?.data?.email}</h1>
                    <h1>{invoice?.businessDetails?.data?.data?.phoneNumber}</h1>
                    <h1>{invoice?.businessDetails?.data?.data?.contactAddress}</h1>
                  </div>
                </div>
              )}

              <h1 className="my-4 font-medium">Bill to</h1>
              <div>
                <h1 className="font-bold">{client?.name}</h1>
                <h1>{client?.email}</h1>
                <h1>{client?.phone}</h1>
                <h1>{client?.address}</h1>
              </div>
            </div>
            <div className="my-4 w-1/2 text-end">
              <h1 className="text-xs text-gray-500">STATUS</h1>
              <h1 className="text-xl font-bold" style={{ color: checkStatus() }}>
                {totalAmountReceived >= total ? "Paid" : status}
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
                    {invoiceData.items
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((item, index) => {
                        return (
                          <TableRow hover role="checkbox" tabIndex={-1} key={item.index}>
                            <TableCell scope="row">{item.itemName}</TableCell>
                            <TableCell align="left">{item.quantity}</TableCell>
                            <TableCell align="left">{item.unitPrice}</TableCell>
                            <TableCell align="left">{item.discount}</TableCell>
                            <TableCell align="left">
                              {(
                                item.quantity * item.unitPrice -
                                (item.quantity * item.unitPrice * item.discount) / 100
                              ).toFixed(2)}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </div>
          <div className="flex my-6">
            <div className="w-4/6"></div>
            <div className="w-2/6">
              <h1 className="bg-zinc-200 p-2 text-zinc-700 font-semibold rounded-sm border-b-2 border-gray-400">
                Invoice Summary
              </h1>
              <div className="flex justify-between px-2 py-1 border-b-2 border-gray-400">
                <h1>Sub Total:</h1>
                <h1>{subTotal}</h1>
              </div>
              <div className="flex justify-between px-2 py-1 border-b-2 border-gray-400">
                <h1>VAT(%)</h1>
                <h1>{vat}</h1>
              </div>
              <div className="flex justify-between px-2 py-1 border-b-2 border-gray-400">
                <h1>Total</h1>
                <h1 className="">
                  {currency} {toCommas(total)}
                </h1>
              </div>
              <div className="flex justify-between px-2 py-1 border-b-2 border-gray-400">
                <h1>Paid</h1>
                <h1 className="">
                  {currency} {toCommas(totalAmountReceived)}
                </h1>
              </div>
              <div className="flex justify-between px-2 py-1 border-b-2 border-gray-400">
                <h1>Balance</h1>
                <h1 className="font-bold">
                  {currency} {toCommas((total - totalAmountReceived).toFixed(2))}
                </h1>
              </div>
            </div>
          </div>
          <div className="flex my-6">
            <div className="mx-2">
              <h1 className="text-zinc-400">Tax Rates(%)</h1>
              <h1>{rates}</h1>
            </div>

            <div className="mx-6">
              <h1 className="text-zinc-400">Due Date</h1>
              <h1>{selectedDate}</h1>
            </div>
            <div className="mx-2">
              <h1 className="text-zinc-400">currency</h1>
              <h1>{currency}</h1>
            </div>
          </div>

          {invoiceData.notes !== undefined ? (
            <div className="mb-20">
              <h1 className="font-bold">Note/Payment Info:-</h1>
              <p className="text-sm w-full h-24 p-2 border-zinc-600 border-2 rounded-md">{invoiceData.notes}</p>
            </div>
          ) : (
            <div className="mb-20"></div>
          )}
        </form>
      </div>
    </div>
  );
};

export default InvoiceDetails;
