import React, { useEffect, useState } from 'react'
import styles from './ManageRent.module.css'
import UserNavbar from '../Navbar/UserNavbar'
import { collection, getDocs, addDoc, query, where, updateDoc, doc, deleteDoc, GeoPoint } from 'firebase/firestore';
import { db } from '../../Auth/firebase'
import { useSelector } from 'react-redux';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { IconButton, TablePagination, Tooltip } from '@mui/material';
import { Stack } from '@mui/system';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';

function ManageRent() {

    const user = useSelector((state) => state.user.userInfo);
    const [sell, setSell] = useState([])
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(6);
    const navigate = useNavigate()

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: theme.palette.common.black,
            color: theme.palette.common.white,
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 14,
        },
    }));

    const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
        // hide last border
        '&:last-child td, &:last-child th': {
            border: 0,
        },
    }));


    const getSells = async () => {
        const docRef = doc(db, "users", user.id);
        const colRef = collection(docRef, "rent")
        const data = await getDocs(colRef)
        setSell(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
        console.log(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    }
    useEffect(() => {

        getSells()
    }, [])


    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleEdit = (item) => {
        navigate('/RentEdit', { state: { data: item } })
    };
    const handleDelete = (item) => {
        const docRef = doc(db, "users", user.id);
        const colRef = collection(docRef, "rent")
        const abc = doc(colRef, item.id)
        deleteDoc(abc).then((res) => {
            getSells()
        })

        console.log('triggered');
    };

    return (
        <>
            <UserNavbar />

            <div className={styles.tableOverall}>
                <div className={styles.table}>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 700 }} aria-label="customized table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>Title</StyledTableCell>
                                    <StyledTableCell align="right">Price</StyledTableCell>
                                    <StyledTableCell align="right">Type</StyledTableCell>
                                    <StyledTableCell align="right">Area&nbsp;(marla)</StyledTableCell>
                                    <StyledTableCell align="center">Actions</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {sell.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                                    <StyledTableRow key={row.id}>
                                        <StyledTableCell component="th" scope="row">
                                            {row.title}
                                        </StyledTableCell>
                                        <StyledTableCell align="right">{row.price}</StyledTableCell>
                                        <StyledTableCell align="right">{row.type}</StyledTableCell>
                                        <StyledTableCell align="right">{row.area}</StyledTableCell>
                                        <StyledTableCell align="center">

                                            <Tooltip placement="top" arrow title="Edit"><IconButton color="primary" aria-label="add to shopping cart">
                                                <EditIcon onClick={() => handleEdit(row)} style={{ color: '#2A84EB' }} />
                                            </IconButton></Tooltip>
                                            <Tooltip placement="top" onClick={() => handleDelete(row)} arrow title="Delete"><IconButton color="primary" aria-label="add to shopping cart"><DeleteIcon style={{ color: '#E53472' }} /></IconButton></Tooltip>

                                        </StyledTableCell>
                                    </StyledTableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[7]}
                        component="div"
                        count={sell.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </div>
            </div>
        </>
    )
}

export default ManageRent