import React, { useEffect, useState } from "react";
import useRedirectLoggedOutUser from "../../customHook/useRedirectLoggedOutUser";
import image_1 from "../../images/image_1.jpeg";

import { deleteClient, getClientsByUser, updateClient } from "../../actions/clientActions";

import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../Spinner/Spinner";

import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";

const columns = [
  { id: "number", label: "Number" },
  { id: "name", label: "Name" },
  {
    id: "email",
    label: "Email",
    align: "left",
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "phone",
    label: "Phone",
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

const Clients = () => {
  useRedirectLoggedOutUser("/login");

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [open, setOpen] = React.useState(false);
  const [clientData, setClientData] = useState({ name: "", email: "", phone: "", address: "", userId: "" });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("profile"));
  const { clients } = useSelector((state) => state.clients);
  const isLoading = useSelector((state) => state.clients.isLoading);

  useEffect(() => {
    dispatch(getClientsByUser({ search: user?.result?._id }));
  }, []);

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClickClose = () => {
    setOpen(false);
  };

  const editClient = (e) => {
    e.preventDefault();
    dispatch(updateClient(clientData._id, clientData));
    handleClickClose();
  };

  const dltClient = (id) => {
    dispatch(deleteClient(id));
  };

  if (!user) {
    navigate("/login");
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center flex-col pt-20">
        <Spinner />
      </div>
    );
  }

  if (clients?.length === 0) {
    return (
      <div className="flex items-center justify-center flex-col pt-20">
        <img src={image_1} alt="emptyIcon" />
        <p style={{ color: "gray", textAlign: "center" }} className="text-xl">
          No customers yet. Click the plus icon to add customer
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
                  {clients?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)?.map((client, index) => {
                    return (
                      <TableRow tabIndex={-1} key={client._id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{client.name}</TableCell>
                        <TableCell>{client.email}</TableCell>
                        <TableCell>{client.phone}</TableCell>
                        <TableCell
                          onClick={() => {
                            setClientData(client);
                            handleClickOpen();
                          }}
                          className="cursor-pointer"
                        >
                          <ModeEditIcon />
                        </TableCell>
                        <TableCell onClick={() => dltClient(client._id)} className="cursor-pointer">
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
              count={clients.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              style={{ color: "black", fontWeight: "bold" }}
            />
          </Paper>
        </div>
        <Dialog
          open={open}
          onClose={handleClickClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title" sx={{ backgroundColor: "#1976D2", color: "white" }}>
            Edit Customer
          </DialogTitle>
          <form onSubmit={editClient}>
            <DialogContent sx={{ marginTop: "10px" }}>
              <TextField
                label="Name"
                type="text"
                variant="filled"
                sx={{ width: "100%" }}
                value={clientData.name}
                required
                onChange={(e) => setClientData({ ...clientData, name: e.target.value })}
              />
              <TextField
                label="Email"
                type="email"
                variant="filled"
                sx={{ width: "100%" }}
                value={clientData.email}
                required
                onChange={(e) => setClientData({ ...clientData, email: e.target.value })}
              />
              <TextField
                label="Phone"
                type="text"
                variant="filled"
                sx={{ width: "100%" }}
                value={clientData.phone}
                required
                onChange={(e) => setClientData({ ...clientData, phone: e.target.value })}
              />
              <TextField
                label="Address"
                type="text"
                variant="filled"
                sx={{ width: "100%" }}
                value={clientData.address}
                required
                onChange={(e) => setClientData({ ...clientData, address: e.target.value })}
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
            </DialogContent>
          </form>
        </Dialog>
      </div>
    </div>
  );
};

export default Clients;
