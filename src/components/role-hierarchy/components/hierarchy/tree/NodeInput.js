import React, { Component } from 'react';

class NodeInput extends Component {

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.focusInput = this.focusInput.bind(this);
    }

    componentDidMount() {
        this.focusInput();
    }

    focusInput() {
        const inputLen = this.props.nodeInput.length * 2;
        this.textInput.focus();
        this.textInput.setSelectionRange(inputLen, inputLen);
    }

    handleChange(e) {
        this.props.setNodeInput(e.target.value);
    }

    render() {
        return <input ref={(input) => { this.textInput = input }} value={this.props.nodeInput} onChange={this.handleChange} />
    }

}

export default NodeInput;