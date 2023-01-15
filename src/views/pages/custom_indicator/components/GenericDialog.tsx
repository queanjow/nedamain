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
    dialogTitle: string;
    dialogDesc: string;
    onCloseClicked: () => void;
    onContinueClicked: () => void;
    titleColor?: 'error' | 'warning' | 'inherit';
};
const GenericDialog = ({
    isOpen,
    dialogTitle,
    dialogDesc,
    onCloseClicked,
    onContinueClicked,
    titleColor = 'inherit'
}: Props) => {
    return (
        <Dialog
            fullWidth={true}
            maxWidth="md"
            open={isOpen}
            onClose={onCloseClicked}>
            <DialogTitle color={titleColor}>{dialogTitle}</DialogTitle>
            <DialogContent>
                <DialogContentText>{dialogDesc}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCloseClicked}>Close</Button>
                <Button
                    color={titleColor}
                    onClick={onContinueClicked}
                    variant="contained">
                    Continue
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default GenericDialog;
