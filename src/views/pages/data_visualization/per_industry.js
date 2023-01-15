import React from 'react';
import { Card, CardBody, Container, Row, Col } from 'reactstrap';
import SimpleHeader from 'components/Headers/SimpleHeader.js';

function VisualGrdpIndustry() {
    return (
        <>
            <SimpleHeader />
            <Container className="mt--6" fluid>
                <Row>
                    <Col xl="12">
                        <Card>
                            <CardBody>
                                <div className="reportwrapper">
                                    <iframe title="Per Capita Gross Regional Domestic Product"
                                        width="100%"
                                        height="700px"
                                        src={
                                            'https://datastudio.google.com/embed/reporting/b8952525-8560-4cfd-a88b-0b571aac63fb/page/UGy5C'
                                        }
                                        allowFullScreen
                                        frameBorder="0"
                                    />
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default VisualGrdpIndustry;
