import axios from 'axios';
import { useEffect, useState } from 'react';
import NotificationAlert from 'react-notification-alert';
import ReactBSAlert from 'react-bootstrap-sweetalert';
import cellEditFactory, { Type } from 'react-bootstrap-table2-editor';
import filterFactory, { selectFilter } from 'react-bootstrap-table2-filter';
import React from 'react';
import {
    Card,
    CardHeader,
    UncontrolledTooltip,
    Button,
    Container,
    Row,
    Col,
    Form,
    Input,
    Modal,
    Label,
    FormGroup
} from 'reactstrap';
import SimpleHeader from 'components/Headers/SimpleHeader.js';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, {
    Search,
    CSVExport
} from 'react-bootstrap-table2-toolkit';
import ReactToPrint from 'react-to-print';
import { RowResponse, RowRequest, AddRowRequest } from '../..';

const { REACT_APP_API_URL } = process.env;
interface ColumnOptions {
    id: number;
    name: string;
}
type Props = {
    tableData: {
        id: number;
        name: string;
        row: RowResponse[];
    };
    onDeleteEntry: (tableID: number, rowEntryID: number) => void;
    onEditIndicatorName: (indicatorName: string, tableID: number) => void;
    onEditRowEntry: (
        tableID: number,
        row: RowRequest,
        responseCallback: (isSuccess: boolean) => void
    ) => void;
    onAddNewEntry: (tableID: number, rowData: AddRowRequest) => void;
};
function DynamicIndicatorTable({
    tableData,
    onEditIndicatorName,
    onEditRowEntry,
    onAddNewEntry,
    onDeleteEntry
}: Props) {
    const componentRef = React.useRef(null);
    const { SearchBar } = Search;
    const { ExportCSVButton } = CSVExport;
    const [addEntryModal, setShowAddEntryModal] = React.useState(false);
    const [alert, setalert] = React.useState<JSX.Element | null>(null);
    const notificationAlertRef = React.useRef(null);
    const [inputEntry, setInputEntry] = useState<AddRowRequest>({
        locationID: null,
        subIndicatorID: null,
        unitID: null,
        yearID: null,
        periodID: null,
        value: 0
    } as AddRowRequest);
    const [locationOptions, setLocationOptions] = useState<ColumnOptions[]>([]);
    const [subIndicatorOptions, setSubIndicatorOptions] = useState<
        ColumnOptions[]
    >([]);
    const [unitOptions, setUnitOptions] = useState<ColumnOptions[]>([]);
    const [yearOptions, setYearOptions] = useState<ColumnOptions[]>([]);
    const [periodOptions, setPeriodOptions] = useState<ColumnOptions[]>([]);

    const onInputEntryChangeHandler = (event) => {
        let key = event.target.name;
        const value = event.target.value;

        if (key !== 'value') {
            key = key + 'ID';
        }

        console.log(key + ' ' + value);
        setInputEntry((values) => ({ ...values, [key]: value }));
    };

    const getLocationOptions = () => {
        axios
            .get<ColumnOptions[]>(
                `${REACT_APP_API_URL}/indicator_table/read.php?type=columnOptions&columnType=locations`
            )
            .then((response) => {
                const { data } = response;
                if (response.status === 200) {
                    setInputEntry((prevState) => ({
                        ...prevState,
                        locationID: data[0].id
                    }));
                    setLocationOptions(data);
                } else {
                    //error handle section
                }
            })
            .catch((error) => console.log(error));
    };

    const getSubIndicatorOptions = () => {
        axios
            .get<ColumnOptions[]>(
                `${REACT_APP_API_URL}/indicator_table/read.php?type=columnOptions&columnType=subIndicators`
            )
            .then((response) => {
                const { data } = response;
                if (response.status === 200) {
                    setInputEntry((prevState) => ({
                        ...prevState,
                        subIndicatorID: data[0].id
                    }));
                    setSubIndicatorOptions(data);
                } else {
                    //error handle section
                }
            })
            .catch((error) => console.log(error));
    };

    const getYearsOptions = () => {
        axios
            .get<ColumnOptions[]>(
                `${REACT_APP_API_URL}/indicator_table/read.php?type=columnOptions&columnType=years`
            )
            .then((response) => {
                const { data } = response;
                if (response.status === 200) {
                    setInputEntry((prevState) => ({
                        ...prevState,
                        yearID: data[0].id
                    }));
                    setYearOptions(data);
                } else {
                    //error handle section
                }
            })
            .catch((error) => console.log(error));
    };

    const getPeriodOptions = () => {
        axios
            .get<ColumnOptions[]>(
                `${REACT_APP_API_URL}/indicator_table/read.php?type=columnOptions&columnType=periods`
            )
            .then((response) => {
                const { data } = response;
                if (response.status === 200) {
                    setInputEntry((prevState) => ({
                        ...prevState,
                        periodID: data[0].id
                    }));
                    setPeriodOptions(data);
                } else {
                    //error handle section
                }
            })
            .catch((error) => console.log(error));
    };

    const getUnitOptions = () => {
        axios
            .get<ColumnOptions[]>(
                `${REACT_APP_API_URL}/indicator_table/read.php?type=columnOptions&columnType=units`
            )
            .then((response) => {
                const { data } = response;
                if (response.status === 200) {
                    setInputEntry((prevState) => ({
                        ...prevState,
                        unitID: data[0].id
                    }));
                    setUnitOptions(data);
                } else {
                    //error handle section
                }
            })
            .catch((error) => console.log(error));
    };

    const updateNotify = (type) => {
        let options = {
            place: 'tc',
            message: (
                <div className="alert-text">
                    <span className="alert-title" data-notify="title">
                        Successfully Updated!
                    </span>
                    <span data-notify="message">
                        Entry Updated on Poverty Statistics
                    </span>
                </div>
            ),
            type: type,
            icon: 'ni ni-check-bold',
            autoDismiss: 4
        };
        notificationAlertRef.current.notificationAlert(options);
    };

    const addnotify = (type) => {
        let options = {
            place: 'tc',
            message: (
                <div className="alert-text">
                    <span className="alert-title" data-notify="title">
                        Successfully Added!
                    </span>
                    <span data-notify="message">
                        {`An entry added on table ${tableData.name}`}
                    </span>
                </div>
            ),
            type: type,
            icon: 'ni ni-check-bold',
            autoDismiss: 4
        };
        notificationAlertRef.current.notificationAlert(options);
    };

    const deletenotify = (type) => {
        let options = {
            place: 'tc',
            message: (
                <div className="alert-text">
                    <span className="alert-title" data-notify="title">
                        Successfully Deleted!
                    </span>
                    <span data-notify="message">
                        {`An entry deleted on table ${tableData.name}`}
                    </span>
                </div>
            ),
            type: type,
            icon: 'ni ni-check-bold',
            autoDismiss: 3
        };
        notificationAlertRef.current.notificationAlert(options);
    };

    const onDeleteRowHandler = (rowEntryID: number) => {
        setalert(
            <ReactBSAlert
                custom
                style={{ display: 'block', marginTop: '-100px' }}
                title="Are you sure you want to delete?"
                customIcon={
                    <div
                        className="swal2-icon swal2-question swal2-animate-question-icon"
                        style={{ display: 'flex' }}>
                        <span className="swal2-icon-text">?</span>
                    </div>
                }
                onConfirm={() => {
                    onDeleteEntry(tableData.id, rowEntryID);
                    setalert(null);
                    deletenotify('danger');
                }}
                onCancel={() => setalert(null)}
                confirmBtnBsStyle="default"
                confirmBtnText="Delete"
                showCancel
                btnSize=""></ReactBSAlert>
        );
    };

    const copyToClipboardAsTable = (el: React.ReactNode) => {
        var body = document.body,
            range,
            sel;
        if (document.createRange && window.getSelection) {
            range = document.createRange();
            sel = window.getSelection();
            sel.removeAllRanges();
            try {
                range.selectNodeContents(el);
                sel.addRange(range);
            } catch (e) {
                range.selectNode(el);
                sel.addRange(range);
            }
            document.execCommand('copy');
        }
        // else if (body.createTextRange) {
        //     range = body.createTextRange();
        //     range.moveToElementText(el);
        //     range.select();
        //     range.execCommand('Copy');
        // }
        setalert(
            <ReactBSAlert
                success
                style={{ display: 'block', marginTop: '-100px' }}
                title="Copied data table!"
                onConfirm={() => setalert(null)}
                onCancel={() => setalert(null)}
                confirmBtnBsStyle="info"
                btnSize=""></ReactBSAlert>
        );
    };

    const pagination = paginationFactory({
        page: 1,
        alwaysShowAllBtns: true,
        showTotal: true,
        withFirstAndLast: false,
        sizePerPageRenderer: ({
            options,
            currSizePerPage,
            onSizePerPageChange
        }) => (
            <div className="dataTables_length" id="datatable-basic_length">
                <label>
                    Show
                    {
                        <select
                            name="datatable-basic_length"
                            aria-controls="datatable-basic"
                            className="form-control form-control-sm"
                            onChange={(e) =>
                                onSizePerPageChange(e.target.value)
                            }>
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select>
                    }
                    entries.
                </label>
            </div>
        )
    });

    function columnHeadFormat(
        column,
        colIndex,
        { sortElement, filterElement }
    ) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                {column.text}
                {sortElement}
                {filterElement}
            </div>
        );
    }

    const onUpdateCellChanges = (oldValue, newValue, row, column) => {
        const findOptionID = (optionType: string, optionName) => {
            let optionArray = yearOptions;
            let resultID = 0;

            switch (optionType) {
                case 'location':
                    optionArray = locationOptions;
                    break;
                case 'subIndicator':
                    optionArray = subIndicatorOptions;
                    break;
                case 'unit':
                    optionArray = unitOptions;
                    break;
                case 'period':
                    optionArray = periodOptions;
                    break;
                case 'year':
                    optionArray = yearOptions;
                    break;
                default:
                    break;
            }

            optionArray.every((element) => {
                if (element.name === optionName) {
                    resultID = element.id;
                    return false;
                }
                return true;
            });

            return resultID;
        };

        const resultRow = {
            id: row['id'],
            locationID: findOptionID('location', row['location']),
            subIndicatorID: findOptionID('subIndicator', row['subIndicator']),
            unitID: findOptionID('unit', row['unit']),
            periodID: findOptionID('period', row['period']),
            yearID: findOptionID('year', row['year']),
            value: row['value']
        } as RowRequest;

        onEditRowEntry(tableData.id, resultRow, (isSuccess: boolean) => {});
    };

    function amountFormatter(numberString) {
        if (numberString === null) {
            return null;
        }
        let number = parseFloat(numberString);
        return number.toLocaleString('Php');
    }

    const onAddEntryHandler = (entryData: AddRowRequest) => {
        onAddNewEntry(tableData.id, entryData);
        console.log(entryData);
        addnotify('success');
    };

    useEffect(() => {
        getSubIndicatorOptions();
        getLocationOptions();
        getYearsOptions();
        getUnitOptions();
        getPeriodOptions();
    }, [
        JSON.stringify(tableData),
        JSON.stringify(subIndicatorOptions),
        JSON.stringify(locationOptions),
        JSON.stringify(yearOptions),
        JSON.stringify(unitOptions),
        JSON.stringify(periodOptions)
    ]);

    return (
        <>
            {alert}
            <div className="rna-wrapper">
                <NotificationAlert ref={notificationAlertRef} />
            </div>
            {/* Start Region: Add new data  */}
            <Modal
                className="modal-dialog-centered"
                isOpen={addEntryModal}
                toggle={() => setShowAddEntryModal(false)}>
                <div className="modal-header">
                    <h6 className="modal-title" id="modal-title-default">
                        Add Entry
                    </h6>
                    <button
                        aria-label="Close"
                        className="close"
                        data-dismiss="modal"
                        type="button"
                        onClick={() => setShowAddEntryModal(false)}>
                        <span aria-hidden={true}>x</span>
                    </button>
                </div>
                <div className="modal-body">
                    <Form>
                        <FormGroup className="row">
                            <Label
                                className="form-control-label"
                                htmlFor="example-text-input"
                                md="2">
                                Location
                            </Label>
                            <Col md="10">
                                <Input
                                    disabled={inputEntry.locationID === null}
                                    placeholder="Please Select Location"
                                    defaultValue={inputEntry.locationID}
                                    id="location"
                                    name="location"
                                    type="select"
                                    required
                                    onChange={onInputEntryChangeHandler}>
                                    <option disabled>Please Select</option>
                                    {locationOptions.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.name}
                                        </option>
                                    ))}
                                </Input>
                            </Col>
                        </FormGroup>
                        <FormGroup className="row">
                            <Label
                                className="form-control-label"
                                htmlFor="example-date-input"
                                md="2">
                                Sub Indicator
                            </Label>
                            <Col md="10">
                                <Input
                                    disabled={
                                        inputEntry.subIndicatorID === null
                                    }
                                    placeholder="Please Select Sub Indicator"
                                    defaultValue={inputEntry.subIndicatorID}
                                    id="sub-indicator"
                                    name="subIndicator"
                                    type="select"
                                    required
                                    onChange={onInputEntryChangeHandler}>
                                    <option disabled>Please Select</option>
                                    {subIndicatorOptions.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.name}
                                        </option>
                                    ))}
                                </Input>
                            </Col>
                        </FormGroup>
                        <FormGroup className="row">
                            <Label
                                className="form-control-label"
                                htmlFor="example-date-input"
                                md="2">
                                Year
                            </Label>
                            <Col md="10">
                                <Input
                                    disabled={inputEntry.yearID === null}
                                    placeholder="Please Select Year"
                                    defaultValue={inputEntry.yearID}
                                    id="year"
                                    name="year"
                                    type="select"
                                    required
                                    onChange={onInputEntryChangeHandler}>
                                    <option disabled>Please Select</option>
                                    {yearOptions.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.name}
                                        </option>
                                    ))}
                                </Input>
                            </Col>
                        </FormGroup>
                        <FormGroup className="row">
                            <Label
                                className="form-control-label"
                                htmlFor="example-password-input"
                                md="2">
                                Unit
                            </Label>
                            <Col md="10">
                                <Input
                                    disabled={inputEntry.unitID === null}
                                    placeholder="Please Select Unit"
                                    defaultValue={inputEntry.unitID}
                                    id="unit"
                                    name="unit"
                                    type="select"
                                    required
                                    onChange={onInputEntryChangeHandler}>
                                    <option disabled>Please Select</option>
                                    {unitOptions.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.name}
                                        </option>
                                    ))}
                                </Input>
                            </Col>
                        </FormGroup>
                        <FormGroup className="row">
                            <Label
                                className="form-control-label"
                                htmlFor="example-password-input"
                                md="2">
                                Period
                            </Label>
                            <Col md="10">
                                <Input
                                    disabled={inputEntry.periodID === null}
                                    placeholder="Please Select Period"
                                    defaultValue={inputEntry.periodID}
                                    id="period"
                                    name="period"
                                    type="select"
                                    required
                                    onChange={onInputEntryChangeHandler}>
                                    <option disabled>Please Select</option>
                                    {periodOptions.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.name}
                                        </option>
                                    ))}
                                </Input>
                            </Col>
                        </FormGroup>
                        <FormGroup className="row">
                            <Label
                                className="form-control-label"
                                htmlFor="example-tel-input"
                                md="2">
                                Value
                            </Label>
                            <Col md="10">
                                <Input
                                    placeholder="Please add value"
                                    defaultValue={inputEntry.value}
                                    htmlFor="example-text-input"
                                    id="value"
                                    name="value"
                                    type="number"
                                    required
                                    onChange={onInputEntryChangeHandler}
                                />
                            </Col>
                        </FormGroup>
                        <div className="modal-footer">
                            <Button
                                color="primary"
                                onClick={() => {
                                    setShowAddEntryModal(false);
                                    onAddEntryHandler(inputEntry);
                                }}>
                                Add
                            </Button>
                            <Button
                                className="ml-auto"
                                color="link"
                                data-dismiss="modal"
                                type="button"
                                onClick={() => setShowAddEntryModal(false)}>
                                Cancel
                            </Button>
                        </div>
                    </Form>
                </div>
            </Modal>

            <div className="col">
                <Row>
                    <Col xs="6">
                        <h3 className="mb-0">{tableData.name}</h3>
                    </Col>
                    <Col className="text-right" xs="6">
                        <Button
                            className="btn-round btn-icon"
                            color="primary"
                            id="tooltip-add-entry"
                            onClick={() => {
                                setShowAddEntryModal(true);
                            }}
                            size="sm">
                            <span className="btn-inner--icon mr-1">
                                <i className="fas fa-user-plus" />
                            </span>
                            <span className="btn-inner--text">Add Entry</span>
                        </Button>

                        <UncontrolledTooltip
                            delay={0}
                            target="tooltip-add-entry">
                            Add Entry
                        </UncontrolledTooltip>
                    </Col>
                </Row>
                <ToolkitProvider
                    data={tableData.row}
                    keyField="id"
                    columns={[
                        {
                            dataField: 'location',
                            text: 'Location',
                            editor: {
                                type: Type.SELECT,
                                options: locationOptions.map((item) => ({
                                    value: item.name,
                                    label: item.name
                                }))
                            },
                            filter: selectFilter({
                                options: locationOptions.map((item) => ({
                                    value: item.name,
                                    label: item.name
                                })),
                                withoutEmptyOption: false
                            }),

                            sort: true,
                            align: 'center',
                            headerAlign: 'center',
                            headerFormatter: columnHeadFormat,
                            title: () => `Double click to edit`
                        },
                        {
                            dataField: 'subIndicator',
                            text: 'Sub indicators ',
                            editor: {
                                type: Type.SELECT,
                                options: subIndicatorOptions.map((item) => ({
                                    value: item.name,
                                    label: item.name
                                }))
                            },
                            filter: selectFilter({
                                options: subIndicatorOptions.map((item) => ({
                                    value: item.name,
                                    label: item.name
                                })),
                                withoutEmptyOption: false
                            }),
                            sort: true,
                            align: 'center',
                            headerAlign: 'center',
                            headerFormatter: columnHeadFormat,
                            title: () => `Double click to edit`
                        },
                        {
                            dataField: 'unit',
                            text: 'Unit',
                            editor: {
                                type: Type.SELECT,
                                options: unitOptions.map((item) => ({
                                    value: item.name,
                                    label: item.name
                                }))
                            },
                            filter: selectFilter({
                                options: unitOptions.map((item) => ({
                                    value: item.name,
                                    label: item.name
                                })),
                                withoutEmptyOption: false
                            }),
                            sort: true,
                            align: 'center',
                            headerAlign: 'center',
                            headerFormatter: columnHeadFormat,
                            title: () => `Double click to edit`
                        },
                        {
                            dataField: 'year',
                            text: 'Year',
                            editor: {
                                type: Type.SELECT,
                                options: yearOptions.map((item) => ({
                                    value: item.name,
                                    label: item.name
                                }))
                            },
                            filter: selectFilter({
                                options: yearOptions.map((item) => ({
                                    value: item.name,
                                    label: item.name
                                })),
                                withoutEmptyOption: false
                            }),
                            sort: true,
                            align: 'center',
                            headerAlign: 'center',
                            headerFormatter: columnHeadFormat,
                            title: () => `Double click to edit`
                        },
                        {
                            dataField: 'period',
                            text: 'Period',
                            editor: {
                                type: Type.SELECT,
                                options: periodOptions.map((item) => ({
                                    value: item.name,
                                    label: item.name
                                }))
                            },
                            filter: selectFilter({
                                options: periodOptions.map((item) => ({
                                    value: item.name,
                                    label: item.name
                                })),
                                withoutEmptyOption: false
                            }),
                            sort: true,
                            align: 'center',
                            headerAlign: 'center',
                            headerFormatter: columnHeadFormat,
                            title: () => `Double click to edit`
                        },
                        {
                            dataField: 'value',
                            text: 'Value',
                            validator: (newValue) => {
                                if (isNaN(newValue)) {
                                    return {
                                        valid: false,
                                        message: 'Value should be numeric'
                                    };
                                }
                                return true;
                            },
                            align: 'center',
                            headerAlign: 'center',
                            sort: true,
                            order: 'desc',
                            title: () => `Double click to edit`,
                            formatter: amountFormatter
                        },

                        {
                            dataField: 'id',
                            text: '',
                            sort: false,
                            csvExport: false,
                            formatter: (id) => {
                                return (
                                    // eslint-disable-next-line
                                    <p
                                        className="table-action table-action-delete"
                                        id="deletetooltip"
                                        color="primary"
                                        onClick={() => {
                                            onDeleteRowHandler(id);
                                        }}>
                                        <i className="fas fa-trash" />
                                        <UncontrolledTooltip
                                            delay={0}
                                            target="deletetooltip">
                                            Delete entry
                                        </UncontrolledTooltip>
                                    </p>
                                );
                            },
                            align: 'center',
                            headerAlign: 'center'
                        }
                    ]}
                    search>
                    {(props) => (
                        <div>
                            <Container fluid>
                                <Col className="my-4" xs={12} sm={6}>
                                    <ReactToPrint
                                        trigger={() => (
                                            <Button
                                                color="primary"
                                                size="sm"
                                                className="buttons-copy buttons-html5"
                                                id="print-tooltip">
                                                <span className="btn-inner--icon mr-1">
                                                    <i className="fas fa-print" />
                                                </span>
                                                <span>Print </span>
                                            </Button>
                                        )}
                                        content={() => componentRef.current}
                                        pageStyle={
                                            "'@media print { body { -webkit-print-color-adjust: exact; } @page { size: A4; margin: 200mm !important }}'"
                                        }
                                    />
                                    <ExportCSVButton
                                        id="csv-tooltip"
                                        className="btn-round btn-icon btn btn-primary btn-sm"
                                        {...props.csvProps}>
                                        <span className="btn-inner--icon mr-1">
                                            <i className="fas fa-file-export" />
                                        </span>
                                        <span>Export CSV Bulk Data</span>
                                    </ExportCSVButton>
                                    <UncontrolledTooltip
                                        placement="top"
                                        target="csv-tooltip">
                                        This will generate csv file based on
                                        available data
                                    </UncontrolledTooltip>
                                    <UncontrolledTooltip
                                        placement="top"
                                        target="print-tooltip">
                                        This will open a print page with the
                                        visible rows of the table.
                                    </UncontrolledTooltip>
                                </Col>
                            </Container>
                            <BootstrapTable
                                ref={componentRef}
                                {...props.baseProps}
                                bootstrap4={true}
                                pagination={pagination}
                                hover
                                loading={true}
                                id="table-id"
                                keyField="id"
                                striped
                                data={tableData.row}
                                cellEdit={cellEditFactory({
                                    mode: 'dbclick',
                                    blurToSave: true,
                                    afterSaveCell: onUpdateCellChanges
                                })}
                                noDataIndication="No available data"
                                filter={filterFactory()}
                            />
                        </div>
                    )}
                </ToolkitProvider>
            </div>
        </>
    );
}

export default DynamicIndicatorTable;
