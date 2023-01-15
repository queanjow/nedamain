/*eslint-disable*/
import React from 'react';

// reactstrap components
import {Container} from 'reactstrap';

function AdminFooter() {
    return (
        <>
            <Container fluid>
                <footer className="footer pt-0">
                    <div className="copyright text-center">
                        © {new Date().getFullYear()}{' '}
                        <a
                            className="font-weight-bold ml-1"
                            href="https://jmc.edu.ph/"
                            target="_blank">
                            Jose Maria College Foundation Inc.
                        </a>
                    </div>
                </footer>
            </Container>
        </>
    );
}

export default AdminFooter;
