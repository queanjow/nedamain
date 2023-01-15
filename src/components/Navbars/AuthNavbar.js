import React from 'react';
// react library for routing
import { Link } from 'react-router-dom';
// reactstrap components
import {
    UncontrolledCollapse,
    NavbarBrand,
    Navbar,
    NavItem,
    Nav,
    Container,
    Row,
    Col
} from 'reactstrap';

function AdminNavbar() {
    return (
        <>
            <Navbar
                className="navbar-horizontal navbar-main navbar-dark navbar-transparent"
                expand="lg"
                id="navbar-main">
                <Container>
                    
                </Container>
            </Navbar>
        </>
    );
}

export default AdminNavbar;
