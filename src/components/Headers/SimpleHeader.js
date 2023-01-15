import React from 'react';
// nodejs library to set properties for components
import PropTypes from 'prop-types';
// reactstrap components
import {
    Breadcrumb,
    BreadcrumbItem,
    Button,
    Container,
    Row,
    Col
} from 'reactstrap';

function TimelineHeader({ name, parentName }) {
    return (
        <>
            <div className="header header-dark bg-info pb-6 content__title content__title--calendar">
            </div>
        </>
    );
}

TimelineHeader.propTypes = {
    name: PropTypes.string,
    parentName: PropTypes.string
};

export default TimelineHeader;
