/*eslint-disable*/
import React from 'react';

// reactstrap components
import {Container} from 'reactstrap';

function AuthFooter() {
    return (
        <>
            <footer className="py-5" id="footer-main">
                <Container>
                    <div className="copyright text-center">
                        © {new Date().getFullYear()}{' '}
                        <a
                            className="font-weight-bold ml-1"
                            href="https://jmc.edu.ph/"
                            target="_blank">
                            Jose Maria College Foundation Inc.
                        </a>
                    </div>
                </Container>
            </footer>
        </>
    );
}

export default AuthFooter;
