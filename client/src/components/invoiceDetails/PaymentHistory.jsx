import React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Badge from "@mui/material/Badge";
import { styled } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import moment from "moment";
import { toCommas } from "../../utils/utils";

const columnsAcc = [
    { id: "date", label: "Date Paid", minWidth: 200 },
    { id: "amount", label: "Amount Paid" },
    {
        id: "payment",
        label: "Payment Method",
        // minWidth: 10,
        align: "left",
        format: (value) => value.toLocaleString("en-US"),
    },
];

const StyledBadge = styled(Badge)(({ theme }) => ({
    "& .MuiBadge-badge": {
        right: -20,
        top: 15,
        border: `2px solid ${theme.palette.background.paper}`,
        padding: "0 4px",
    },
}));

const useStyles = makeStyles(() => ({
    font1: {
        fontSize: "1.2rem",
    },
}));

const PaymentHistory = ({ paymentRecords }) => {
    const classes = useStyles();
    return (
        <div className="w-3/5 mx-auto mt-6">
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    sx={{ backgroundColor: "#40404d" }}
                >
                    <Typography sx={{ fontSize: "20px", color: "white" }}>Payment History</Typography>
                    <Badge
                        badgeContent={paymentRecords?.length}
                        color="primary"
                        sx={{ marginY: "15px", marginX: "17px", bgcolor: "red" }}
                        classes={{ badge: classes.font1 }}
                    ></Badge>
                </AccordionSummary>
                <AccordionDetails>
                    <Paper sx={{ width: "100%", overflow: "hidden" }}>
                        <TableContainer sx={{ maxHeight: 440, border: "4px solid #d1d5db" }}>
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow>
                                        {columnsAcc.map((column) => (
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
                                    {paymentRecords?.map((record, index) => {
                                        return (
                                            <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                                                <TableCell scope="row">
                                                    {moment(record.datePaid).format("YYYY-MM-DD")}
                                                </TableCell>
                                                <TableCell align="left">
                                                    {toCommas(record.amountPaid.toFixed(2))}
                                                </TableCell>
                                                <TableCell align="left">{record.paymentMethod}</TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </AccordionDetails>
            </Accordion>
        </div>
    );
};

export default PaymentHistory;
