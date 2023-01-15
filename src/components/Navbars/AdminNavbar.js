import { Link } from 'react-router-dom';

import React from 'react';
// nodejs library that concatenates classes
import classnames from 'classnames';
// nodejs library to set properties for components
import PropTypes from 'prop-types';
// reactstrap components
import {
    Collapse,
    DropdownMenu,
    DropdownItem,
    UncontrolledDropdown,
    DropdownToggle,
    FormGroup,
    Form,
    Input,
    InputGroupAddon,
    InputGroupText,
    InputGroup,
    ListGroupItem,
    ListGroup,
    Media,
    Navbar,
    NavItem,
    NavLink,
    Nav,
    Container,
    Row,
    Col
} from 'reactstrap';

function AdminNavbar({ theme, sidenavOpen, toggleSidenav }) {
    // function that on mobile devices makes the search open
    const openSearch = () => {
        document.body.classList.add('g-navbar-search-showing');
        setTimeout(function () {
            document.body.classList.remove('g-navbar-search-showing');
            document.body.classList.add('g-navbar-search-show');
        }, 150);
        setTimeout(function () {
            document.body.classList.add('g-navbar-search-shown');
        }, 300);
    };
    // function that on mobile devices makes the search close
    const closeSearch = () => {
        document.body.classList.remove('g-navbar-search-shown');
        setTimeout(function () {
            document.body.classList.remove('g-navbar-search-show');
            document.body.classList.add('g-navbar-search-hiding');
        }, 150);
        setTimeout(function () {
            document.body.classList.remove('g-navbar-search-hiding');
            document.body.classList.add('g-navbar-search-hidden');
        }, 300);
        setTimeout(function () {
            document.body.classList.remove('g-navbar-search-hidden');
        }, 500);
    };

    return (
        <>
            <Navbar
                className={classnames(
                    'navbar-top navbar-expand border-bottom',
                    { 'navbar-dark bg-info': theme === 'dark' },
                    { 'navbar-light bg-secondary': theme === 'light' }
                )}>
                <Container fluid>
                    <Collapse navbar isOpen={true}>
                        <Form
                            className={classnames(
                                'navbar-search form-inline mr-sm-3',
                                { 'navbar-search-light': theme === 'dark' },
                                { 'navbar-search-dark': theme === 'light' }
                            )}>
                            <button
                                aria-label="Close"
                                className="close"
                                type="button"
                                onClick={closeSearch}>
                                <span aria-hidden={true}>×</span>
                            </button>
                        </Form>
                        <Nav className="align-items-center ml-md-auto" navbar>
                            <NavItem className="d-xl-none">
                                <div
                                    className={classnames(
                                        'pr-3 sidenav-toggler',
                                        { active: sidenavOpen },
                                        {
                                            'sidenav-toggler-dark':
                                                theme === 'dark'
                                        }
                                    )}
                                    onClick={toggleSidenav}>
                                    <div className="sidenav-toggler-inner">
                                        <i className="sidenav-toggler-line" />
                                        <i className="sidenav-toggler-line" />
                                        <i className="sidenav-toggler-line" />
                                    </div>
                                </div>
                            </NavItem>
                            <NavItem className="d-sm-none">
                                <NavLink onClick={openSearch}>
                                    <i className="ni ni-zoom-split-in" />
                                </NavLink>
                            </NavItem>
                        </Nav>
                        <Nav
                            className="align-items-center ml-auto ml-md-0"
                            navbar>
                            <UncontrolledDropdown nav>
                                <DropdownToggle
                                    className="nav-link pr-0"
                                    color=""
                                    tag="a">
                                    <Media className="align-items-center">
                                        <span className="avatar avatar-sm rounded-circle">
                                            <img
                                                alt="..."
                                                src={require('assets/img/theme/team-4.jpg')}
                                            />
                                        </span>
                                        <Media className="ml-2 d-none d-lg-block">
                                            <span className="mb-0 text-sm font-weight-bold">
                                                Admin
                                            </span>
                                        </Media>
                                    </Media>
                                </DropdownToggle>
                                <DropdownMenu right>
                                    <DropdownItem
                                        className="noti-title"
                                        header
                                        tag="div">
                                        <h6 className="text-overflow m-0">
                                            Welcome!
                                        </h6>
                                    </DropdownItem>
                                    <DropdownItem to="/auth/login" tag={Link}>
                                        <i className="ni ni-user-run" />
                                        <span>Logout</span>
                                    </DropdownItem>
                                </DropdownMenu>
                            </UncontrolledDropdown>
                        </Nav>
                    </Collapse>
                </Container>
            </Navbar>
        </>
    );
}

AdminNavbar.defaultProps = {
    toggleSidenav: () => {},
    sidenavOpen: false,
    theme: 'dark'
};
AdminNavbar.propTypes = {
    toggleSidenav: PropTypes.func,
    sidenavOpen: PropTypes.bool,
    theme: PropTypes.oneOf(['dark', 'light'])
};

export default AdminNavbar;
