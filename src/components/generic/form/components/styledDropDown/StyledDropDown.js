import React, { Component } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

class StyledDropDown extends Component {
    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
        this.onSelect = this.onSelect.bind(this);
        this.state = {
            dropdownOpen: false
        };
    }

    getSelectedOption(value, options) {
        if (!options) {
            return;
        } else {
            for (let i = 0, len = options.length; i < len; i++) {
                if (options[i].value === value) return options[i];
            }
        }
    }

    toggle() {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        });
    }

    onSelect(selected) {
        this.setState({ selected }, () => {
            this.props.onSelect && this.props.onSelect(this.state.selected)
        });
    }

    render() {
        const { options } = this.props;
        const selected = this.getSelectedOption(this.props.value, this.props.options) || this.state.selected;
        return (
            <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                <DropdownToggle tag="span" className="fs-12 text-primary" style={{ cursor: 'pointer' }}>
                    {selected ? <span>{selected.label}</span> : <span className="text-muted">Select</span>}
                    <i className="fa fa-chevron-down pl-2"></i>
                </DropdownToggle>
                <DropdownMenu className="fs-12">
                    {options && options.length > 0
                        ? options.map(option => <DropdownItem key={option.id ? option.id : option.value} onClick={e => this.onSelect(option)}>{option.label}</DropdownItem>)
                        : <span className="font-italic text-muted px-2">No values...</span>}
                </DropdownMenu>
            </Dropdown>
        )
    }
}
export default StyledDropDown;
