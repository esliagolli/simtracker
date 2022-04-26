import React, { useState, useEffect, useMemo } from "react";
import { useTable } from 'react-table';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Toolbar from '@mui/material/Toolbar'
import SimServices from "../services/SimServices";
import SimDialog from './SimDialog'
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Badge from '@mui/material/Badge';

const SimList = () => {
    const [sims, setSims] = useState([]);
    const [searchTitle, setSearchTitle] = useState("");
    const [page, setPage] = useState(0);
    const [count, setCount] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [open, setOpen] = useState(false)
    const [openForEdit, setOpenForEdit] = useState(false)
    const [simToEdit, setSimToEdit] = useState({});
    const pageSizes = [5, 10, 25];
    const onChangeSearchTitle = (e) => {
        const searchTitle = e.target.value;
        setSearchTitle(searchTitle);
    };
    const getRequestParams = (searchTitle, page, pageSize) => {
        let params = {};
        if (searchTitle) {
            params["search"] = searchTitle;
        }
        if (page) {
            params["number"] = page;
        }
        if (pageSize) {
            params["size"] = pageSize;
        }
        return params;
    };
    const retrieveSims = () => {
        const params = getRequestParams(searchTitle, page, pageSize);
        SimServices.getSims(params)
            .then((response) => {
                const totalPages = Math.round(response.data.meta.page.total / pageSize);
                setSims(response.data.data);
                setCount(totalPages);
                console.log(response.data.data);
            })
            .catch((e) => {
                console.log(e);
            });
    }

    const columns = useMemo(() => [
        {
            Header: "ICCID",
            accessor: "iccid",
        },
        {
            Header: "IMSI",
            accessor: "imsi",
        },
        {
            Header: "Batch Name",
            accessor: "batchName",
        },
        {
            Header: "Status",
            accessor: "isActive",
            Cell: (props) => {
                return props.value
                    ? <Badge badgeContent={'Active'} color="success"/>
                    : <Badge badgeContent={'Active'} color="warning"/>;
            },
        },
        {
            Header: "Actions",
            accessor: "actions",
            Cell: (props) => {
                // const rowIdx = parseInt(props.row.id);
                const simObject = props.row.original
                return (
                    <div>
                        <IconButton aria-label="edit" onClick={() => handleSimToEdit(simObject)}>
                            <EditIcon />
                        </IconButton>
                    </div>
                );
            },
        }
    ], [])

    useEffect(retrieveSims, [page, pageSize]);

    const findByTitle = () => {
        setPage(1);
        retrieveSims();
    };

    const handlePageChange = (event, value) => {
        setPage(value);
    };
    const handlePageSizeChange = (event) => {
        setPageSize(event.target.value);
        setPage(0);
    };

    const handleClickOpen = () => {
        setOpen(true)
    }

    const handleSimToEdit = (simObject) => {
        setOpen(true)
        setOpenForEdit(true)
        setSimToEdit(simObject)
    }

    const handleClose = () => {
        setOpen(false)
        setOpenForEdit(false)
    }

    const {
        rows,
        prepareRow,
    } = useTable({
        columns,
        data: sims,
    });
    return (
        <>
            <Toolbar>
                <Tooltip title="Add Sim">
                    <IconButton aria-label="add" id='addSimBtn' onClick={handleClickOpen}>
                        <AddIcon />
                        <Typography variant="h6" component="h6" ml={2}>Add Sim</Typography>
                    </IconButton>
                </Tooltip>
                <SimDialog isOpen={open} close={handleClose} dialogAction={openForEdit ? 'edit' : 'add'} simToEdit={simToEdit} />
            </Toolbar>
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer sx={{ maxHeight: 800 }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell key={column.accessor}>
                                        {column.Header}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row, i) => {
                                prepareRow(row)
                                return (
                                    <TableRow {...row.getRowProps()}>
                                        {row.cells.map(cell => {
                                            return (
                                                <TableCell {...cell.getCellProps()}>
                                                    {cell.render('Cell')}
                                                </TableCell>
                                            )
                                        })}
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={sims.length >= 25 ? pageSizes : sims.length <= 10 && sims.length > 5 ? [5, 10] : [5]}
                    component="div"
                    count={sims.length}
                    rowsPerPage={pageSize}
                    page={page}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handlePageSizeChange}
                />
            </Paper>
        </>
    );
};
export default SimList;