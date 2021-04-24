import React from 'react';
import { Container, Row, Col  } from 'reactstrap';
import Dropzone from 'react-dropzone'
// import FieldItem from '../common/FieldItem';
import {
    CustomButton,
    BUTTON_STYLE,
    BUTTON_TYPE,
    BUTTON_SIZE
} from '@6d-ui/buttons';
import { FieldItem } from '@6d-ui/fields';

const getEnabledOptions = (options, inputs) => {
    const selectedOpts = inputs.map(input => (input && input.docType) ? input.docType.value : null);
    return options ? options.map(option => {
        option.disabled = selectedOpts.indexOf(option.value) >= 0;
        return option;
    }) : [];
}

const DocumentRow = props => {
    const { document, options, onDocTypeChange, onRemove, onDrop, index } = props;
    const dzStyle = {
        width: '100px',
        padding: '5px 10px',
        marginRight: '8px',
        border: '1px solid',
        color: '#0096DE',
        cursor: 'pointer',
        textAlign: 'center',
        lineHeight: 1.5,
        fontSize: '1rem'
    };
    const handleDocTypeChange = (value,obj) => {
        const { isTouched } = obj || { isTouched: false };
        if (isTouched) return;
        onDocTypeChange(value, index)
    }
    return (
        <Row className="mx-0 mb-2">
            <FieldItem
                width="md"
                type="1"
                values={options}
                value={document.docType}
                // onChange={value => onDocTypeChange(value, index)}
                onChange={handleDocTypeChange}
                label="Document Type"
            />
            <Col md="4">
                <label className="form-control-label">Document Name</label>
                <input disabled className="form-control" value={document.file && document.file.name} style={{ borderColor: '#cccccc' }} />
            </Col>
            <Col md="4">
                <label className="form-control-label">&nbsp;</label>
                <div className="onClick={() => onRemove(index)}">
                    <Dropzone style={dzStyle} onDrop={files => onDrop(files, index)} className="fs-600 float-left rounded">
                        <span>Browse</span>
                    </Dropzone>
                    <CustomButton
                        style={BUTTON_STYLE.BRICK}
                        type={BUTTON_TYPE.SECONDARY}
                        size={BUTTON_SIZE.MEDIUM_LARGE}
                        align="left"
                        label="Remove"
                        isButtonGroup={true}
                        onClick={() => onRemove(index)} outline style={{ width: '100px' }}
                    />
                </div>
            </Col>
        </Row>
    )
}

const DocumentInput = props => {
    const { documents, onDocTypeChange, onRemoveInput, onDocumentDrop } = props;
    const docTypeOptions = getEnabledOptions(props.docTypeOptions, documents)

    return (
        <Container className="form-Brick-body mb-3">
            
            {
                documents && documents.map((document, index) => <DocumentRow
                    key={index}
                    document={document}
                    index={index}
                    options={docTypeOptions}
                    onDocTypeChange={onDocTypeChange}
                    onRemove={onRemoveInput}
                    onDrop={onDocumentDrop}
                />)
            }
            <Row>
                <Col className="clearfix mt-3 mr-4">
                    <CustomButton
                        style={BUTTON_STYLE.BRICK}
                        type={BUTTON_TYPE.PRIMARY}
                        size={BUTTON_SIZE.MEDIUM}
                        align="right"
                        label="Add"
                        isButtonGroup={true}
                        disabled={docTypeOptions.length <= documents.length}
                        onClick={docTypeOptions.length <= documents.length ? null : props.onAddInput}
                    />
                </Col>
            </Row>

        </Container>
    )
}

export default DocumentInput;