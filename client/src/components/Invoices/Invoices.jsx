import React, { useEffect, useState } from "react";
import useRedirectLoggedOutUser from "../../customHook/useRedirectLoggedOutUser";
import image_1 from "../../images/image_1.jpeg";

import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import Spinner from "../Spinner/Spinner";
import moment from "moment";

import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import { deleteInvoice, getInvoicesByUser } from "../../actions/invoiceActions";

const columns = [
  { id: "number", label: "Number" },
  { id: "client", label: "Client" },
  {
    id: "amount",
    label: "Amount",
    align: "left",
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "dueDate",
    label: "Due Date",
    align: "left",
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "status",
    label: "Status",
    align: "left",
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "edit",
    label: "Edit",
    align: "left",
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "delete",
    label: "Delete",
    align: "left",
    format: (value) => value.toLocaleString("en-US"),
  },
];
const Invoices = () => {
  useRedirectLoggedOutUser("/login");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("profile"));
  const invoices = useSelector((state) => state.invoices.invoices);
  const isLoading = useSelector((state) => state.invoices.isLoading);

  if (!user) {
    navigate("/login");
  }

  useEffect(() => {
    dispatch(getInvoicesByUser({ search: user?.result?._id }));
  }, [location]);

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const toCommas = (value) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const editInvoice = (id) => {
    navigate(`/edit/invoice/${id}`);
  };

  const openInvoice = (id) => {
    navigate(`/invoice/${id}`);
  };

  function checkStatus(status) {
    return status === "Partial"
      ? { border: "solid 0px #1976d2", backgroundColor: "#baddff", padding: "8px 18px", borderRadius: "20px" }
      : status === "Paid"
      ? { border: "solid 0px green", backgroundColor: "#a5ffcd", padding: "8px 18px", borderRadius: "20px" }
      : status === "Unpaid"
      ? { border: "solid 0px red", backgroundColor: "#ffaa91", padding: "8px 18px", borderRadius: "20px" }
      : "red";
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center flex-col pt-20">
        <Spinner />
      </div>
    );
  }

  if (invoices.length === 0) {
    return (
      <div className="flex items-center justify-center flex-col pt-20">
        <img src={image_1} alt="emptyIcon" />
        <p style={{ color: "gray", textAlign: "center" }} className="text-xl">
          No invoice yet. Click the plus icon to add Invoice
        </p>
      </div>
    );
  }

  return (
    <div className="ml-16 pb-4 bg-gray-200" style={{ minHeight: "92.7vh" }}>
      <div className="mx-6">
        <div className="pt-20 px-20">
          <Paper sx={{ width: "100%", overflow: "hidden" }}>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        style={{
                          minWidth: column.minWidth,
                          backgroundColor: "white",
                          fontSize: "large",
                          fontWeight: "bold",
                          color: "rgb(67, 65, 65)",
                        }}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {invoices.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((invoice) => {
                    return (
                      <TableRow hover role="checkbox" tabIndex={-1} key={invoice._id} style={{ cursor: "pointer" }}>
                        <TableCell onClick={() => openInvoice(invoice._id)}>{invoice.invoiceNumber}</TableCell>

                        <TableCell onClick={() => openInvoice(invoice._id)}>{invoice.client.name}</TableCell>

                        <TableCell onClick={() => openInvoice(invoice._id)}>
                          {invoice.currency} {invoice.total ? toCommas(invoice.total) : invoice.total}
                        </TableCell>

                        <TableCell onClick={() => openInvoice(invoice._id)}>
                          {moment(invoice.dueDate).format("MMM Do YYYY")}
                        </TableCell>

                        <TableCell onClick={() => openInvoice(invoice._id)}>{invoice.status}</TableCell>

                        <TableCell
                          align="center"
                          onClick={() => editInvoice(invoice._id)}
                          sx={{ backgroundColor: "", width: "50px", cursor: "pointer" }}
                        >
                          <ModeEditIcon />
                        </TableCell>

                        <TableCell
                          align="center"
                          onClick={() => dispatch(deleteInvoice(invoice._id))}
                          sx={{ backgroundColor: "", width: "50px", cursor: "pointer" }}
                        >
                          <DeleteIcon />
                        </TableCell>
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
              style={{ color: "black", fontWeight: "bold" }}
            />
          </Paper>
        </div>
      </div>
    </div>
  );
};

export default Invoices;
