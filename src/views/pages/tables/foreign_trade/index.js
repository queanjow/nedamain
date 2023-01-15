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

const { REACT_APP_API_URL } = process.env;

function ForeignTrade() {
    const [addModalshow, setAddModal] = React.useState(false);
    const [alert, setalert] = React.useState(false);
    const [foreigntrade, setForeignTrade] = useState([]);
    const notificationAlertRef = React.useRef(false);
    const [inputs, setInputs] = useState({});
    const { ExportCSVButton } = CSVExport;
    const [unitLists, setUnitList] = useState([]);
    const [yearLists, setYearLists] = useState([]);
    const [subIndicatorsList, setSubIndicatorsList] = useState([]);
    const [periodLists, setPeriodLists] = useState([]);

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs((values) => ({ ...values, [name]: value }));
    };

    const getYears = () => {
        axios
            .get(`${REACT_APP_API_URL}/years.php/years`)
            .then((response) => {
                const { data } = response;
                if (response.status === 200) {
                    //check the api call is success by stats code 200,201 ...etc
                    setYearLists(data);
                } else {
                    //error handle section
                }
            })
            .catch((error) => console.log(error));
    };

    const getUnits = () => {
        axios
            .get(`${REACT_APP_API_URL}/povertystats-unit.php/units`)
            .then((response) => {
                const { data } = response;
                if (response.status === 200) {
                    //check the api call is success by stats code 200,201 ...etc
                    setUnitList(data);
                } else {
                    //error handle section
                }
            })
            .catch((error) => console.log(error));
    };

    const getSubIndicators = () => {
        axios
            .get(
                `${REACT_APP_API_URL}/foreign-trade-sub-indicators.php/subindicators`
            )
            .then((response) => {
                const { data } = response;
                if (response.status === 200) {
                    //check the api call is success by stats code 200,201 ...etc
                    setSubIndicatorsList(data);
                } else {
                    //error handle section
                }
            })
            .catch((error) => console.log(error));
    };

    useEffect(() => {
        getSubIndicators();
        getForeignTrade();
        getUserId();
        getUnits();
        getYears();
        getPeriod();
    }, []);

    const getPeriod = () => {
        axios
            .get(`${REACT_APP_API_URL}/period.php/period`)
            .then((response) => {
                const { data } = response;
                if (response.status === 200) {
                    //check the api call is success by stats code 200,201 ...etc
                    setPeriodLists(data);
                } else {
                    //error handle section
                }
            })
            .catch((error) => console.log(error));
    };

    function getUserId(id) {
        axios
            .get(
                `${REACT_APP_API_URL}/foreign-trade.php/rsep_foreign_trade/${id}`
            )
            .then(function (response) {
                console.log(response.data);
                setInputs(response.data);
            });
    }

    function getForeignTrade() {
        axios
            .get(
                `${REACT_APP_API_URL}/foreign-trade.php/rsep_foreign_trade`
            )
            .then(function (response) {
                console.log(response.data);
                setForeignTrade(response.data);
            });
    }

    const addHandleSubmit = () => {
        axios
            .post(
                `${REACT_APP_API_URL}/foreign-trade.php/rsep_foreign_trade/save`,
                inputs
            )
            .then(function (response) {
                console.log(response.data);
                getForeignTrade(response.data);
            });
    };

    const updateNotify = (type) => {
        let options = {
            place: 'tc',
            message: (
                <div className="alert-text">
                    <span className="alert-title" data-notify="title">
                        {' '}
                        Successfully Updated!
                    </span>
                    <span data-notify="message">
                        Entry Updated on Foreign Trade
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
                        {' '}
                        Successfully Added!
                    </span>
                    <span data-notify="message">
                        Entry Added on Foreign Trade
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
                        {' '}
                        Successfully Deleted!
                    </span>
                    <span data-notify="message">
                        Entry deleted from Foreign Trade
                    </span>
                </div>
            ),
            type: type,
            icon: 'ni ni-check-bold',
            autoDismiss: 3
        };
        notificationAlertRef.current.notificationAlert(options);
    };

    const questionAlert = (id) => {
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
                    getForeignTrade(
                        axios
                            .delete(
                                `${REACT_APP_API_URL}/foreign-trade.php/${id}/delete`
                            )
                            .then(function (response) {
                                console.log(response.data);
                                getForeignTrade(response.data);
                            }),
                        setalert(null)
                    );
                    deletenotify('danger');
                }}
                onCancel={() => setalert(null)}
                confirmBtnBsStyle="default"
                confirmBtnText="Delete"
                showCancel
                btnSize=""></ReactBSAlert>
        );
    };

    const { SearchBar } = Search;
    const componentRef = React.useRef(null);
    const copyToClipboardAsTable = (el) => {
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
        } else if (body.createTextRange) {
            range = body.createTextRange();
            range.moveToElementText(el);
            range.select();
            range.execCommand('Copy');
        }
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
        withFirstAndLast: true,
        sizePerPageRenderer: ({
            options,
            currSizePerPage,
            onSizePerPageChange
        }) => (
            <div className="dataTables_length" id="datatable-basic_length">
                <label>
                    Show{' '}
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
                    }{' '}
                    entries.
                </label>
            </div>
        )
    });

    const onAfterSaveCell = (id) => {
        axios
            .put(
                `${REACT_APP_API_URL}/foreign-trade.php/rsep_foreign_trade/${id}/edit`
            )
            .then(function (response) {
                console.log(response.data);
            });
        updateNotify('success');
    };

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

    function amountFormatter(numberString) {
        if (numberString === null) {
            return null;
        }
        let number = parseFloat(numberString);
        return number.toLocaleString('Php');
    }

    // temporary needs rework
    const perioditems = [
        {
            group: 'Annual',
            options: [
                { value: 'Annual', label: 'Annual' },
            ]
        },
        {
            group: 'Semestral',
            options: [
                { value: '1st Sem', label: '1st Sem' },
                { value: '2nd Sem', label: '2nd Sem' }
            ]
        },
        {
            group: 'Quarterly',
            options: [
                { value: '1st Quarter', label: '1st Quarter' },
                { value: '2nd Quarter', label: '2nd Quarter' },
                { value: '3rd Quarter', label: '3rd Quarter' },
                { value: '4th Quarter', label: '4th Quarter' }
            ]
        }
    ];

    const filterEditPeriodItems = [
                { value: 'Annual', label: 'Annual' },
                { value: '1st Sem', label: 'Semestral : 1st Sem' },
                { value: '2nd Sem', label: 'Semestral : 2nd Sem' },
                { value: '1st Quarter', label: 'Quarterly : 1st Quarter' },
                { value: '2nd Quarter', label: 'Quarterly : 2nd Quarter' },
                { value: '3rd Quarter', label: 'Quarterly : 3rd Quarter' },
                { value: '4th Quarter', label: 'Quarterly : 4th Quarter' }
            
    ];
    // temporary needs rework

    return (
        <>
            {alert}
            <div className="rna-wrapper">
                <NotificationAlert ref={notificationAlertRef} />
            </div>
            <SimpleHeader />
            <Container className="mt--6" fluid>
                <Row>
                    <div className="col">
                        <Card>
                            <CardHeader className="border-0">
                                <Row>
                                    <Col xs="6">
                                        <h3 className="mb-0">
                                            Foreign Trade
                                        </h3>
                                    </Col>
                                    <Col className="text-right" xs="6">
                                        <Button
                                            className="btn-round btn-icon"
                                            color="primary"
                                            id="tooltip443412080"
                                            onClick={() => setAddModal(true)}
                                            size="sm">
                                            <span className="btn-inner--icon mr-1">
                                                <i className="fas fa-user-plus" />
                                            </span>
                                            <span className="btn-inner--text">
                                                Add
                                            </span>
                                        </Button>
                                        <UncontrolledTooltip
                                            delay={0}
                                            target="tooltip443412080">
                                            Add new Entry
                                        </UncontrolledTooltip>
                                    </Col>
                                </Row>
                            </CardHeader>
                            <ToolkitProvider
                                data={foreigntrade}
                                keyField="id"
                                columns={[
                                    {
                                        dataField: 'sub_indicators',
                                        text: 'Sub indicators ',
                                        editor: {
                                            type: Type.SELECT,
                                            options: subIndicatorsList.map(
                                                (item) => ({
                                                    value: item.sub_indicators,
                                                    label: item.sub_indicators
                                                })
                                            )
                                        },
                                        filter: selectFilter({
                                            options: subIndicatorsList.map(
                                                (item) => ({
                                                    value: item.sub_indicators,
                                                    label: item.sub_indicators
                                                })
                                            ),
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
                                            options: yearLists.map((item) => ({
                                                value: item.year_name,
                                                label: item.year_name
                                            }))
                                        },
                                        filter: selectFilter({
                                            options: yearLists.map((item) => ({
                                                value: item.year_name,
                                                label: item.year_name
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
                                            options: filterEditPeriodItems.map((item) => ({
                                                value: item.value,
                                                label: item.label,
                                            }))
                                        },
                                        filter: selectFilter({
                                            options: filterEditPeriodItems.map((item) => ({
                                                value: item.value,
                                                label: item.label,
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
                                        text: 'Value (USD)',
                                        sort: true,
                                        validator: (newValue) => {
                                            if (isNaN(newValue)) {
                                                return {
                                                    valid: false,
                                                    message:
                                                        'Value should be numeric'
                                                };
                                            }
                                            return true;
                                        },
                                        align: 'center',
                                        headerAlign: 'center',
                                        title: () => `Double click to edit`,
                                        formatter: amountFormatter
                                    },
                                    {
                                        dataField: 'unit',
                                        text: 'Unit ',
                                        editor: {
                                            type: Type.SELECT,
                                            options: unitLists.map((item) => ({
                                                value: item.unit_name,
                                                label: item.unit_name
                                            }))
                                        },
                                        filter: selectFilter({
                                            options: unitLists.map((item) => ({
                                                value: item.unit_name,
                                                label: item.unit_name
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
                                        dataField: 'id',
                                        text: '',
                                        sort: false,
                                        csvExport: false,
                                        formatter: (tradeid) => {
                                            return (
                                                // eslint-disable-next-line
                                                <p
                                                    className="table-action table-action-delete"
                                                    id="deletetooltip"
                                                    color="primary"
                                                    size="sm"
                                                    onClick={() => {
                                                        questionAlert(
                                                            tradeid
                                                        );
                                                    }}>
                                                    <i className="fas fa-trash" />
                                                    <UncontrolledTooltip
                                                        delay={0}
                                                        target="deletetooltip">
                                                        Delete entry
                                                    </UncontrolledTooltip>
                                                </p>
                                                /* <p
                                                        className="table-action table-action-delete"
                                                        id="edittooltip"
                                                        color="primary"
                                                        size="sm"
                                                        onClick={() =>
                                                            setEditModal(
                                                                povertystat
                                                            )
                                                        }>
                                                        <i className="fas fa-edit" />
                                                        <UncontrolledTooltip
                                                            delay={0}
                                                            target="edittooltip">
                                                            Edit entry
                                                        </UncontrolledTooltip>
                                                    </p> */
                                            );
                                        },
                                        align: 'center',
                                        headerAlign: 'center'
                                    }
                                ]}
                                search>
                                {(props) => (
                                    <div className="py-4 table-responsive">
                                        <Container fluid>
                                            <Row>
                                                <Col xs={12} sm={6}>
                                                    <Button
                                                        className="btn-round btn-icon"
                                                        color="primary"
                                                        size="sm"
                                                        id="copy-tooltip"
                                                        onClick={() =>
                                                            copyToClipboardAsTable(
                                                                document.getElementById(
                                                                    'react-bs-table'
                                                                )
                                                            )
                                                        }>
                                                        <span className="btn-inner--icon mr-1">
                                                            <i className="fas fa-database" />
                                                        </span>
                                                        <span>Copy </span>
                                                    </Button>
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
                                                                <span>
                                                                    Print{' '}
                                                                </span>
                                                            </Button>
                                                        )}
                                                        content={() =>
                                                            componentRef.current
                                                        }
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
                                                        <span>
                                                            Export CSV Bulk Data
                                                        </span>
                                                    </ExportCSVButton>
                                                    <UncontrolledTooltip
                                                        placement="top"
                                                        target="csv-tooltip">
                                                        This will generate csv
                                                        file based on available
                                                        data
                                                    </UncontrolledTooltip>
                                                    <UncontrolledTooltip
                                                        placement="top"
                                                        target="print-tooltip">
                                                        This will open a print
                                                        page with the visible
                                                        rows of the table.
                                                    </UncontrolledTooltip>
                                                    <UncontrolledTooltip
                                                        placement="top"
                                                        target="copy-tooltip">
                                                        This will copy to your
                                                        clipboard the visible
                                                        rows of the table.
                                                    </UncontrolledTooltip>
                                                </Col>
                                                <Col xs={12} sm={6}>
                                                    <div
                                                        id="datatable-basic_filter"
                                                        className="dataTables_filter px-4 pb-1 float-right">
                                                        <label>
                                                            Search:
                                                            <SearchBar
                                                                className="form-control-sm"
                                                                placeholder=""
                                                                {...props.searchProps}
                                                            />
                                                        </label>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </Container>
                                        <BootstrapTable
                                            ref={componentRef}
                                            {...props.baseProps}
                                            bootstrap4={true}
                                            pagination={pagination}
                                            hover
                                            loading={true}
                                            id="react-bs-table"
                                            keyField="id"
                                            striped
                                            data={foreigntrade}
                                            cellEdit={cellEditFactory({
                                                mode: 'dbclick',
                                                blurToSave: true,
                                                afterSaveCell: onAfterSaveCell
                                            })}
                                            noDataIndication="No available data"
                                            filter={filterFactory()}
                                        />
                                    </div>
                                )}
                            </ToolkitProvider>
                        </Card>
                        <Card></Card>
                    </div>
                </Row>
            </Container>

            {/* START - Adding new data  */}
            <Modal
                className="modal-dialog-centered"
                isOpen={addModalshow}
                toggle={() => setAddModal(false)}>
                <div className="modal-header">
                    <h6 className="modal-title" id="modal-title-default">
                        Add new Entry
                    </h6>
                    <button
                        aria-label="Close"
                        className="close"
                        data-dismiss="modal"
                        type="button"
                        onClick={() => setAddModal(false)}>
                        <span aria-hidden={true}>×</span>
                    </button>
                </div>
                <div className="modal-body">
                    <Form>
                        <FormGroup className="row">
                            <Label
                                className="form-control-label"
                                htmlFor="example-text-input"
                                md="2">
                                Indicator
                            </Label>
                            <Col md="10">
                                <Input
                                    defaultValue="Foreign Trade"
                                    id="indicators"
                                    name="indicators"
                                    type="text"
                                    disabled
                                    onChange={handleChange}
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup className="row">
                            <Label
                                className="form-control-label"
                                htmlFor="example-text-input"
                                md="2">
                                Sub Indicators
                            </Label>
                            <Col md="10">
                                <Input
                                    id="sub_indicators"
                                    name="sub_indicators"
                                    type="select"
                                    required
                                    onChange={handleChange}>
                                    <option disabled selected>
                                        Please Select
                                    </option>
                                    {subIndicatorsList.map((item) => (
                                        <option
                                            key={item.id}
                                            value={item.sub_indicators}>
                                            {item.sub_indicators}
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
                                Period
                            </Label>
                            <Col md="10">
                                <Input
                                    id="period"
                                    name="period"
                                    type="select"
                                    required
                                    onChange={handleChange}>
                                    <optgroup>Please Select</optgroup>
                                    {perioditems.map((item) => (
                                        <optgroup
                                            key={item.group}
                                            label={item.group}>
                                            {item.options.map((option) => (
                                                <option
                                                    key={option.value}
                                                    value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </optgroup>
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
                                    id="year"
                                    name="year"
                                    type="select"
                                    required
                                    onChange={handleChange}>
                                    <option disabled selected>
                                        Please Select
                                    </option>
                                    {yearLists.map((item) => (
                                        <option
                                            key={item.year_id}
                                            value={item.year_name}>
                                            {item.year_name}
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
                                    placeholder="(ex. 2) | number only"
                                    htmlFor="example-text-input"
                                    id="value"
                                    name="value"
                                    type="text"
                                    required
                                    onChange={handleChange}
                                />
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
                                    placeholder="total"
                                    id="unit"
                                    name="unit"
                                    type="select"
                                    required
                                    onChange={handleChange}>
                                    <option disabled selected>
                                        Please Select
                                    </option>
                                    {unitLists.map((item) => (
                                        <option
                                            key={item.unit_id}
                                            value={item.unit_name}>
                                            {item.unit_name}
                                        </option>
                                    ))}
                                </Input>
                            </Col>
                        </FormGroup>
                        <div className="modal-footer">
                            <Button
                                color="primary"
                                onClick={() => {
                                    addHandleSubmit();
                                    addnotify('success');
                                    setAddModal(false);
                                }}>
                                Save
                            </Button>
                            <Button
                                className="ml-auto"
                                color="link"
                                data-dismiss="modal"
                                type="button"
                                onClick={() => setAddModal(false)}>
                                Cancel
                            </Button>
                        </div>
                    </Form>
                </div>
            </Modal>
            {/* END - adding new data  */}
        </>
    );
}

export default ForeignTrade;
