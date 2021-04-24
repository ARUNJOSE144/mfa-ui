import React from 'react';
import { Row, Col } from 'reactstrap';


const ProfileInfo = props => {
    return(
    <Row>
        <Col className="profile-disp-pic"></Col>
        <Col>
            <div className="profile-details-container">
                <div className="profile-details-item fw-600 fs-14">
                    <span><i className="fa fa-user pr-2" />Floyed Nicols</span>
                </div>
                <div className="profile-details-item fw-600 fs-12">
                    <span><i className="fa fa-phone pr-2" />2343-232-3223</span>
                </div>
                <div className="profile-details-item fs-12">
                    <span><i className="fa fa-address-book pr-2" />672 Veum Throughway Suite 434</span>
                </div>
            </div>
        </Col>
    </Row>
    )
}

export default ProfileInfo;