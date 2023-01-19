import React from 'react';
import { Card, CardBody, Container, Row, Col } from 'reactstrap';
import {useContext} from 'react';
import {UserContext} from '../../../context/UserContext';

function Geomap() {
    const {user, logout} = useContext(UserContext);
    return (
        <div>
            <Row>
                <Col xl="12">
                    <Card>
                        <CardBody>
                            <div className="reportwrapper">
                                <iframe
                                    title="GIS"
                                    width="100%"
                                    height="1500px"
                                    src={
                                        'https://datastudio.google.com/embed/reporting/64857891-7218-4800-b466-4842bf1c0ce2/page/gwxCD'
                                    }
                                    allowFullScreen
                                    frameBorder="0"
                                />
                            </div>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default Geomap;
