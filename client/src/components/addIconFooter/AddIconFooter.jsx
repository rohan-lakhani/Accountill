import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as React from "react";

import { Box } from "@mui/material";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import CreateIcon from "@mui/icons-material/Create";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import TextField from "@mui/material/TextField";

import { makeStyles } from "@mui/styles";
import { useDispatch } from "react-redux";
import { createClient } from "../../actions/clientActions";

const useStyles = makeStyles(() => ({
    staticTooltipLabel: {
        backgroundColor: "rgb(80,80,80)",
        color: "white",
        width: 150,
    },
    tooltip: {
        backgroundColor: "yellow",
    },
}));

const AddIconFooter = () => {
    const [clientData, setClientData] = React.useState({ name: "", email: "", phone: "", address: "", userId: "" });
    const user = JSON.parse(localStorage.getItem("profile"));
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [openn, setOpenn] = React.useState(false);

    const handleClickOpen = () => {
        setOpenn(true);
    };

    const handleClickClose = () => {
        setOpenn(false);
    };

    const addClient = (e) => {
        e.preventDefault();
        dispatch(createClient({ ...clientData, userId: user?.result?._id }));
        handleClickClose();
    };
    return (
        <div className="fixed right-4 bottom-4 z-10">
            <Box sx={{ transform: "translateZ(0px)", flexGrow: 1 }}>
                <SpeedDial
                    ariaLabel="SpeedDial tooltip example"
                    sx={{ position: "absolute", bottom: 16, right: 16, fontSize: "12px" }}
                    icon={<SpeedDialIcon />}
                    onClose={handleClose}
                    onMouseEnter={handleOpen}
                    open={open}
                >
                    <SpeedDialAction
                        classes={classes}
                        TooltipClasses={classes}
                        key="invoice"
                        icon={<CreateIcon />}
                        tooltipTitle="New Invoice"
                        tooltipOpen
                        onClick={() => {
                            handleClose();
                            navigate("/invoice");
                        }}
                    />
                    <SpeedDialAction
                        classes={classes}
                        TooltipClasses={classes}
                        key="customer"
                        icon={<PersonAddIcon />}
                        tooltipTitle="New Customer"
                        tooltipOpen
                        onClick={() => {
                            handleClose();
                            handleClickOpen();
                        }}
                    />
                </SpeedDial>
            </Box>
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
                            style={{ width: "100%" }}
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

export default AddIconFooter;
