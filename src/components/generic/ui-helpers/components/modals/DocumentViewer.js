import React, { Component } from 'react';
import { ModalBody } from 'reactstrap';
import { Popup, POPUP_ALIGN } from '@6d-ui/popup';

export default class DocumentViewer extends Component {

    constructor(props) {
        super(props);
        this.state = { isfileSupported: true, isOpen: false };
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }

    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener("resize", this.updateWindowDimensions);
        this.props.isOpen && this.getFileToView();
    }

    componentDidUpdate(prevProps) {
        if (this.props.isOpen && prevProps.isOpen !== this.props.isOpen) {
            this.getFileToView();
        }
    }

    getFileToView = () => {
        
        this.props.ajaxUtil.sendRequest(this.props.srcPath, this.props.requestData, (response, hasError) => {
            
            if (response && !hasError) {
                const { headers } = response;
                const contentType = headers['content-type'];
                if (contentType.indexOf('pdf') > -1 || contentType.indexOf('image') > -1) {
                    const fileUrl = window.URL.createObjectURL(response.data);
                    this.setState({ fileUrl, isfileSupported: true, isOpen: true })
                } else {
                    this.setState({ isfileSupported: false });
                    this.props.toggleModal();
                }
            }else{
                this.toggleModal(this.props.isOpen);
            }
        
        }, this.props.loadingFunction, {
                isShowSuccess: false,
                method: 'GET',
                returnFullResponse: true,
                responseType: 'blob'
            });
    }

    updateWindowDimensions() {
        this.setState({ windowHeight: window.innerHeight });
    }

    toggleModal = (isOpen) => {
        this.setState({ isOpen: false }, () => this.props.toggleModal());
    }

    render() {
        const height = { height: this.state.windowHeight - 131 };
        return (
            <Popup
                type={POPUP_ALIGN.RIGHT}
                title="View Document"
                isOpen={this.state.isOpen}
                close={this.toggleModal}
                minWidth="85%"
                component={
                    <ModalBody className="px-4 py-4">
                        <div className="form-tab overlay_position" style={height}>

                            {
                                this.state.fileUrl && <iframe
                                    title="documentViewModalIframe"
                                    src={this.state.fileUrl}
                                    style={{ width: '95%', height: '500px' }}
                                    frameBorder="0">
                                </iframe>
                            }
                            {
                                !this.state.isfileSupported && <div className="errorMsg_login text-center">
                                    Downloading...
                                </div>
                            }
                        </div>
                    </ModalBody>
                }
            />
        );
    }

}