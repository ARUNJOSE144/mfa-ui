import React from 'react';
import { Col } from "reactstrap";

const DocumentCard = props => {
    return (
        <Col xs="12" md="6" lg="4" className="clearfix my-2">
            <div className="document-thumbnail float-left" style={{ cursor: 'pointer' }} onClick={() => props.onViewClick({ case: 'documentView', docId: props.docId })}></div>
            <div className="float-left ml-3 h-100" style={{ maxWidth: '170px' }}>
                <div style={{ height: '33%' }}>
                    <p className="mb-0">{props.docDate}</p>
                    <p className="mb-0 text-truncate">{props.docName}</p>
                </div>
                <div style={{ height: '33%' }} className="pt-2 text-primary">
                    {!props.hideDownload&&
                        <span onClick={() => props.onDownload(props.docId)} className="c-pointer">
                            <img src={`${process.env.PUBLIC_URL}/images/icons/download.svg`} className="img-icon" alt="" />
                            <span className="pl-1 pr-3">download</span>
                        </span>
                    }
                    {props.isView !== true
                        && <img
                            alt=""
                            src={`${process.env.PUBLIC_URL}/images/icons/delete.svg`}
                            className="img-icon"
                            onClick={() => props.onDeleteClick({ case: 'remove-document', rowId: props.docId, callBack: props.deleteCallBack })} />}
                </div>
            </div>
        </Col>
    )
}

export default DocumentCard;