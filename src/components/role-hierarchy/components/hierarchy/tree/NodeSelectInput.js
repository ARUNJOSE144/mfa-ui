import React, { Component } from 'react';
import { Dropdown, DropdownMenu, DropdownToggle, DropdownItem } from 'reactstrap';
import { SALES_TERRITORY as PAGE_CONSTS, BL_RESULT_CODES as RESULT_CODES } from '../../../util/Constants';
import { _postRequest } from '../../../util/Utils';

const opts = [
    { id: 1, name: 'india' },
    { id: 2, name: 'Kerala' },
    { id: 3, name: 'North East' },
    { id: 4, name: 'Bangal' },
    { id: 5, name: 'Mahrastra' }
];
class NodeSelectInput extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isTyping: false,
            options: opts
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount() {
        this.textInput.focus();
    }

    handleChange(e) {
        const inputVal = e.target.value;
        // const options = opts.filter(({name}) => { return name.toLowerCase().indexOf("" + inputVal.toLowerCase() + "") > -1 });
        // options.find(({name}, i, optsArr) => {
        //         const matchStart = name.toLowerCase().indexOf("" + inputVal.toLowerCase() + "");
        //         const matchEnd = matchStart + inputVal.length - 1;
        //         const beforeMatch = name.slice(0, matchStart);
        //         const matchText = name.slice(matchStart, matchEnd + 1);
        //         const afterMatch = name.slice(matchEnd + 1);
        //         optsArr[i].label = <span>{beforeMatch}<b>{matchText}</b>{afterMatch}</span>
        //     }
        // );

        
        _postRequest(PAGE_CONSTS.LOOKUP_NODE_URL, { keyword: inputVal, locType: this.props.parent.childType }, (response) => {
            let options = [];
            if (response && response.resultCode === RESULT_CODES.SUCCESS) {
                const {locDetails} = response && response.childLocList;
                if(locDetails){
                    options = locDetails.map(locDetail => {
                        const {locationName} = locDetail;
                        return {
                            id: locDetail.locationId,
                            name: locationName,
                            label: this.renderDropDownLabel(locationName, inputVal)
                        }
                    });
                }
                
            }
            this.setState({ isTyping: true, options });
            this.props.setNodeInput(inputVal);
        });
    }

    renderDropDownLabel(label, input) {
        if (label.toLowerCase().indexOf("" + input.toLowerCase() + "") > -1) {
            const matchStart = label.toLowerCase().indexOf("" + input.toLowerCase() + "");
            const matchEnd = matchStart + input.length - 1;
            const beforeMatch = label.slice(0, matchStart);
            const matchText = label.slice(matchStart, matchEnd + 1);
            const afterMatch = label.slice(matchEnd + 1);
            return <span>{beforeMatch}<b>{matchText}</b>{afterMatch}</span>;
        } else {
            return <span>{label}</span>;
        }
    }

    handleFocus(e) {
        const inputVal = e.target.value;
        _postRequest(PAGE_CONSTS.LOOKUP_NODE_URL, { keyword: inputVal, locType: this.props.parent.childType }, (response) => {
            let options = [];
            if (response && response.resultCode === RESULT_CODES.SUCCESS) {
                const {locDetails} = response && response.childLocList;
                if(locDetails){
                    options = locDetails.map(locDetail => {
                        const {locationName} = locDetail;
                        return {
                            id: locDetail.locationId,
                            name: locationName,
                            label: this.renderDropDownLabel(locationName, inputVal)
                        }
                    });
                }
                
            }
            this.setState({ options });
        });
    }


    toggle() {
        const { isTyping } = this.state;
        this.setState({ isTyping: !isTyping });
    }

    handleClick(value) {
        this.setState({ isTyping: false });
        this.props.setNodeInput(value);
    }

    render() {
        const isOpen = this.props.nodeInput.length >= 2 && this.state.isTyping;
        const { options } = this.state;
        return (
            <Dropdown isOpen={isOpen} toggle={this.toggle.bind(this)}>
                <DropdownToggle
                    tag="span"
                    data-toggle="dropdown"
                    aria-expanded={isOpen}
                >
                    <input
                     ref={(input) => { this.textInput = input }}
                     value={this.props.nodeInput}
                     onChange={this.handleChange}
                     onFocus={this.handleFocus.bind(this)}
                     />
                </DropdownToggle>
                <DropdownMenu>
                    {
                        options && options.length > 0
                            ? options.map((option, index) => {
                                return <DropdownItem key={index} onClick={() => this.handleClick(option.name)}>{option.label}</DropdownItem>
                            }) : <DropdownItem disabled>No reults found.. !</DropdownItem>
                    }
                    <DropdownItem divider />
                    <DropdownItem onClick={() => this.props.activateDraw(true)}>Draw boundaries</DropdownItem>
                </DropdownMenu>
            </Dropdown>
        );
    }

}



export default NodeSelectInput;