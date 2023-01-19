import React, { useEffect, useState, Fragment, useId } from 'react';
import {
    Box,
    Avatar,
    Divider,
    Typography,
    IconButton,
    Button,
    Backdrop,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from '@mui/material';
import axios from 'axios';
import { Stack } from '@mui/system';

const { REACT_APP_API_URL } = process.env;
type Props = {
    isOpen: boolean;
    title: string;
    message: string;
    onCloseClicked: () => void;
    onFailed: (msg: string) => void;
    onSaveSuccess: (importedTable: { id: number; name: string }) => void;
};
const ImportDialog = ({
    isOpen,
    onFailed,
    onCloseClicked,
    onSaveSuccess,
    title,
    message
}: Props) => {
    const [fileName, setFileName] = useState('');
    const [file, setFile] = useState();
    const fileReader = new FileReader();

    const handleOnChange = (e) => {
        setFileName(e.target.files[0].name);
        setFile(e.target.files[0]);
    };
    const submitCSVRequest = (rows) => {
        axios
            .post(`${REACT_APP_API_URL}/indicator_table/create.php`, {
                createType: 'import',
                tableName: fileName,
                data: rows
            })
            .then((res) => {
                console.log(res.status);
                if (res.status === 200 && res.data !== null) {
                    onSaveSuccess(res.data);
                    onCloseClicked();
                    console.log(res.data);
                } else {
                    console.log(res);
                    onFailed(res.data.message);
                    onCloseClicked();
                }
            })
            .catch((err) => {
                console.log(err);
                onFailed(err.data.message);
                onCloseClicked();
            });
    };

    const csvFileToArray = (string) => {
        const csvHeader = string.slice(0, string.indexOf('\r\n')).split(',');
        const csvRows = string.slice(string.indexOf('\n') + 1).split('\r\n');

        const rows = csvRows.map((i) => {
            const values = i.split(',');
            const obj = csvHeader.reduce((object, header, index) => {
                object[header] = values[index];
                return object;
            }, {});
            return obj;
        });

        submitCSVRequest(rows);
    };

    const onSaveHandler = (e) => {
        e.preventDefault();

        if (file) {
            fileReader.onload = function (event) {
                const text = event.target.result;
                csvFileToArray(text);
            };

            fileReader.readAsText(file);
        }
    };

    return (
        <Dialog
            fullWidth={true}
            maxWidth="sm"
            open={isOpen}
            onClose={onCloseClicked}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>{message}</DialogContentText>
                <Box
                    noValidate
                    component="form"
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                    <Stack my={4} width={'100%'}>
                        <Button component="label" variant="contained">
                            {fileName !== ''
                                ? `Selected CSV File: ${fileName}`
                                : 'Click to Select CSV File'}
                            <input
                                type={'file'}
                                id={'csvFileInput'}
                                accept={'.csv'}
                                onChange={handleOnChange}
                                hidden
                            />
                        </Button>
                    </Stack>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCloseClicked}>Close</Button>
                <Button
                    type="submit"
                    onClick={onSaveHandler}
                    variant="contained">
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ImportDialog;
