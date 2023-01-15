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

import { Stack } from '@mui/system';
type Props = {
    isOpen: boolean;
    title: string;
    message: string;
    onCloseClicked: () => void;
    onSaveClicked: (indicatorName: string) => void;
};
const NewIndicatorDialog = ({
    isOpen,
    onCloseClicked,
    onSaveClicked,
    title,
    message
}: Props) => {
    const [indicatorName, setIndicatorName] = useState('');
    const onSaveHandler = () => {
        onSaveClicked(indicatorName);
        onCloseClicked();
    };
    return (
        <Dialog
            fullWidth={true}
            maxWidth="md"
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
                        <TextField
                            fullWidth
                            id="new-indicator-name-input"
                            label="Enter Indicator table name"
                            onChange={(event) => {
                                setIndicatorName(event.target.value);
                            }}></TextField>
                    </Stack>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCloseClicked}>Close</Button>
                <Button onClick={onSaveHandler} variant="contained">
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default NewIndicatorDialog;
