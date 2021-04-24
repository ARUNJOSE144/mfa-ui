import React, { Component } from 'react';
import { ModalBody } from 'reactstrap';

export default class DocumentViewModal extends Component {

    constructor(props) {
        super(props);
        this.state = {isfileSupported: true};
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }

    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener("resize", this.updateWindowDimensions);

        // let authOptions = {
        //     method: 'GET',
        //     url: this.props.srcPath,
        //     headers: getToken(),
        //     responseType: 'blob'
        // };
        // console.log(authOptions);
        // const that = this;
        // axios(authOptions).then(response => {
            
        // }).catch(err => {
        //     console.log('fileerr', err)
        // })
        this.props.ajaxUtil.sendRequest(this.props.srcPath, {}, (response, hasError) => {
            if (response && !hasError) {
                
                const { headers } = response;
                const contentType = headers['content-type'];
                if (contentType.indexOf('pdf') > -1 || contentType.indexOf('image') > -1) {
                    const fileUrl = window.URL.createObjectURL(response.data);
                    that.setState({ fileUrl, isfileSupported: true })
                } else {
                    that.setState({ isfileSupported: false })
                }
            }
        }, null, {method: 'GET', returnFullResponse: true, responseType: 'blob'});
    }

    updateWindowDimensions() {
        this.setState({ windowHeight: window.innerHeight });
    }

    onError(e) {
        console.error(e, 'error in file-viewer');
    }

    render() {
        const height = { height: this.state.windowHeight - 131 };
        return (
            <ModalBody className="px-4 py-4">
                <div className="form-tab overlay_position" style={height}>

                    {
                        this.state.fileUrl && <iframe
                            title="documentViewModalIframe"
                            src={this.state.fileUrl}
                            style={{ width: '95%', height: '500px' }}
                            frameborder="0">
                        </iframe>
                    }
                    {
                        !this.state.isfileSupported && <div className="errorMsg_login text-center">
                            Downloading...
                        </div>
                    }

                </div>
            </ModalBody>
        );
    }

}