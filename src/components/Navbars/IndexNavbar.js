import React from 'react';
// react library for routing
import { Link } from 'react-router-dom';
// reactstrap components
import {
    UncontrolledCollapse,
    NavbarBrand,
    Navbar,
    NavItem,
    NavLink,
    Nav,
    Container,
    Row,
    Col,
    UncontrolledTooltip,
    Button
} from 'reactstrap';

function AdminNavbar() {
    return (
        <>
            <Navbar
                className="navbar-horizontal navbar-main navbar-dark bg-info"
                expand="lg"
                id="navbar-main">
            </Navbar>
        </>
    );
}

export default AdminNavbar;
