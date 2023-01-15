import React, { useEffect, useState, Fragment, useId } from 'react';
import SettingsSection from './components/SettingsSection';

import { nanoid } from 'nanoid';
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
    DialogTitle,
    Tooltip
} from '@mui/material';
import LayersClearIcon from '@mui/icons-material/LayersClear';
import AddIcon from '@mui/icons-material/Add';
import { Stack } from '@mui/system';
import NewIndicatorDialog from './components/NewIndicatorDialog';
import DynamicIndicatorTable from './components/dynamic_table';
import GenericDialog from './components/GenericDialog';
import axios from 'axios';

export interface RowResponse {
    id: number;
    location: string;
    subIndicator: string;
    unit: string;
    year: string;
    value: number;
}

export interface RowRequest {
    id: number;
    locationID: number;
    subIndicatorID: number;
    unitID: number;
    yearID: number;
    value: number;
}
export interface IndicatorTableType {
    id: number;
    name: string;
    rows: RowResponse[];
}

const { REACT_APP_API_URL } = process.env;
const CustomIndicatorDashboard = () => {
    const [tableKey, setTableKey] = useState(nanoid());
    const [showDelete, setShowDelete] = useState(false);
    const [showNewIndicatorDialog, setShowNewIndicatorDialog] = useState(false);
    const [showEditIndicatorName, setShowEditIndicatorName] = useState(false);
    const [currentTableData, setCurrentTableData] =
        useState<IndicatorTableType | null>(null);
    const [tableList, setTableList] = useState<
        { id: number; name: string }[] | null
    >(null);

    const onReportListClicked = (tableID: number) => {
        axios
            .get<IndicatorTableType>(
                `${REACT_APP_API_URL}/indicator_table/read.php?type=table&id=${tableID}`
            )
            .then((res) => {
                if (res.status === 200) {
                    setCurrentTableData(res.data);
                    setTableKey(nanoid());
                    console.log(res.data);
                } else {
                }
            });
    };

    const onAddRowEntry = (tableID: number, rowData: RowRequest) => {
        console.log(`TableID: ${tableID} rowData: ${JSON.stringify(rowData)}`);

        axios
            .post<RowResponse>(
                `${REACT_APP_API_URL}/indicator_table/create.php`,
                {
                    createType: 'row',
                    tableID: tableID,
                    data: rowData
                }
            )
            .then((res) => {
                if (res.status === 200) {
                    const tempRow = [...currentTableData.rows];
                    tempRow.push(res.data);

                    setCurrentTableData({ ...currentTableData, rows: tempRow });
                    setTableKey(nanoid());
                } else {
                }
            });
    };

    const onAddNewTable = (indicatorName: string) => {
        axios
            .post<{ id: number; name: string }>(
                `${REACT_APP_API_URL}/indicator_table/create.php`,
                {
                    createType: 'table',
                    data: {
                        name: indicatorName
                    }
                }
            )
            .then((res) => {
                if (res.status === 200) {
                    setTableList([...tableList, res.data]);
                } else {
                }
            });
    };

    const onEditTableName = (newIndicatorName: string, tableID: number) => {
        axios
            .put<{ id: number; name: string }>(
                `${REACT_APP_API_URL}/indicator_table/update.php`,
                {
                    updateType: 'table',
                    tableID: tableID,
                    data: {
                        name: newIndicatorName
                    }
                }
            )
            .then((res) => {
                if (res.status === 200) {
                    if (res.data) {
                        const { id, name } = res.data;
                        const tempTableList = [...tableList];

                        tempTableList.every((value, index) => {
                            if (value.id === id) {
                                tempTableList[index].name = name;
                                return false;
                            }

                            return true;
                        });

                        currentTableData.name = name;
                        setTableKey(nanoid());
                    }
                } else {
                }
            });
    };

    const onDeleteRowEntry = (tableID: number, rowEntryID: number) => {
        axios
            .delete<{ message: string }>(
                `${REACT_APP_API_URL}/indicator_table/delete.php`,
                {
                    data: {
                        type: 'row',
                        data: {
                            tableID: tableID,
                            rowID: rowEntryID
                        }
                    }
                }
            )
            .then((res) => {
                if (res.status === 200 && res.data.message === 'deleted') {
                    currentTableData.rows.every((row, rowIndex) => {
                        if (row.id === rowEntryID) {
                            const tempRows = [...currentTableData.rows];
                            tempRows.splice(rowIndex, 1);
                            setCurrentTableData({
                                ...currentTableData,
                                rows: tempRows
                            });
                            return false;
                        }
                        return true;
                    });
                    showDeleteHandler(false);
                    setTableKey(nanoid());
                } else {
                }
            });
    };

    const showAddNewIndicatorDialog = (isShow: boolean) => {
        setShowNewIndicatorDialog(isShow);
    };

    const showDeleteHandler = (isShow: boolean) => {
        setShowDelete(isShow);
    };
    const onEditRowEntry = (
        tableID: number,
        row: RowRequest,
        responseCallback: (isSuccess: boolean) => void
    ) => {
        axios
            .put<RowResponse>(
                `${REACT_APP_API_URL}/indicator_table/update.php`,
                {
                    updateType: 'row',
                    tableID: tableID,
                    data: row
                }
            )
            .then((res) => {
                if (res.status === 200) {
                    responseCallback(true);
                    console.log(res.data);
                } else {
                    responseCallback(false);
                }
            });
    };
    const deleteTableHandler = (tableID: number) => {
        axios
            .delete<{ message: string }>(
                `${REACT_APP_API_URL}/indicator_table/delete.php?`,
                {
                    data: {
                        type: 'table',
                        data: {
                            tableID: tableID
                        }
                    }
                }
            )
            .then((res) => {
                if (res.status === 200 && res.data.message === 'deleted') {
                    console.log(res.data);
                    setCurrentTableData(null);
                    setTableKey(nanoid());
                    showDeleteHandler(false);
                } else {
                }
            });
    };

    useEffect(() => {
        axios
            .get<{ id: number; name: string }[]>(
                `${REACT_APP_API_URL}/indicator_table/read.php?type=lists`
            )
            .then((res) => {
                setTableList(res.data);
            });
        console.log('Use effect called');
    }, [JSON.stringify(tableList), JSON.stringify(currentTableData)]);

    return (
        <Box
            sx={{
                flexGrow: 1,
                position: 'relative',
                flexDirection: 'column',
                display: 'flex'
            }}>
            {currentTableData !== null ? (
                <GenericDialog
                    titleColor="error"
                    isOpen={showDelete}
                    dialogTitle={"Oh no! You're trying to delete something..."}
                    dialogDesc={`Are you sure to delete table: ${currentTableData.name}`}
                    onCloseClicked={() => {
                        showDeleteHandler(false);
                    }}
                    onContinueClicked={() => {
                        deleteTableHandler(currentTableData.id);
                    }}></GenericDialog>
            ) : (
                ''
            )}
            <NewIndicatorDialog
                title={'Edit Table Name'}
                message={'Enter new name for the table.'}
                isOpen={showEditIndicatorName}
                onCloseClicked={() => {
                    setShowEditIndicatorName(false);
                }}
                onSaveClicked={(indicatorName: string) => {
                    onEditTableName(indicatorName, currentTableData.id);
                }}></NewIndicatorDialog>
            <NewIndicatorDialog
                title={'Add Table'}
                message={'Enter name for the new table.'}
                isOpen={showNewIndicatorDialog}
                onCloseClicked={() => {
                    showAddNewIndicatorDialog(false);
                }}
                onSaveClicked={onAddNewTable}></NewIndicatorDialog>
            <Stack direction="row" sx={{ display: 'flex' }} flexGrow={1}>
                {/* Settings Button Section */}
                <Box
                    sx={{
                        minWidth: '240px',
                        flexDirection: 'column',
                        display: 'flex',
                        width: '260px',
                        height: '100%'
                    }}>
                    <Stack
                        alignItems="center"
                        sx={{ height: '64px' }}
                        justifyContent="center">
                        <Typography
                            textAlign="center"
                            fontWeight="bold"
                            variant="body2"
                            color="primary">
                            Report List
                        </Typography>
                    </Stack>
                    <Divider />
                    <SettingsSection
                        reportLists={tableList}
                        onSettingsClicked={
                            onReportListClicked
                        }></SettingsSection>
                </Box>

                <Divider flexItem orientation="vertical" />
                {/* Custom Indicator Content */}
                <Stack flexGrow={1}>
                    <Box
                        sx={{
                            paddingX: '16px',
                            height: '64px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'end'
                        }}>
                        <Stack spacing={2} direction="row">
                            <Button
                                size="small"
                                variant="outlined"
                                onClick={() => {
                                    showAddNewIndicatorDialog(true);
                                }}>
                                Add Table
                            </Button>
                            {currentTableData !== null ? (
                                <>
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        onClick={() => {
                                            setShowEditIndicatorName(true);
                                        }}>
                                        Edit Table Name
                                    </Button>
                                    <Button
                                        color="error"
                                        size="small"
                                        variant="contained"
                                        onClick={() => {
                                            showDeleteHandler(true);
                                        }}>
                                        Delete Table
                                    </Button>
                                </>
                            ) : (
                                ''
                            )}
                        </Stack>
                    </Box>
                    <Divider />
                    {currentTableData !== null ? (
                        <Box pt={2}>
                            <DynamicIndicatorTable
                                key={tableKey}
                                onEditRowEntry={onEditRowEntry}
                                onDeleteEntry={onDeleteRowEntry}
                                onAddNewEntry={onAddRowEntry}
                                tableData={{
                                    id: currentTableData.id,
                                    name: currentTableData.name,
                                    row: currentTableData.rows
                                }}
                                onEditIndicatorName={(
                                    indicatorName,
                                    tableID
                                ) => {}}></DynamicIndicatorTable>
                        </Box>
                    ) : (
                        ''
                    )}
                </Stack>
            </Stack>
            <Divider />
        </Box>
    );
};

export default CustomIndicatorDashboard;
