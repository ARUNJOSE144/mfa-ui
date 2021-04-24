import React, { Component } from "react";
import { ModalBody, ModalFooter, Row } from "reactstrap";
import { BUTTON_SIZE, BUTTON_STYLE, BUTTON_TYPE, COLOR } from '../../generic/buttons/elements/ButtonTypes';
import { CustomButton } from '../../generic/buttons/elements/CustomButton';
import FieldItem from '../../generic/fields/elements/fieldItem/FieldItem';
class SearchFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roleId: props.roleId,
      roleName: props.roleName,
      roleDesc: props.roleDesc
    };
  }
  handleChange(name, value) {
    this.setState({ [name]: value });
  }
  render() {
    return (
      <div>
        <ModalBody>
          <Row className="noMargin dataTableFilter">
            <FieldItem
              name="roleId"
              placeholder="Role Id"
              label="Role Id"
              width="md"
              value={this.state.roleId}
              onChange={this.handleChange.bind(this, "roleId")}
              touched={false}
              error=""
            />
            <FieldItem
              name="roleName"
              value={this.state.roleName}
              placeholder="Role Name"
              label="Role Name"
              width="md"
              onChange={this.handleChange.bind(this, "roleName")}
              touched={false}
              error=""
            />
            <FieldItem
              name="roleDesc"
              placeholder="Role Description"
              label="Role Description"
              width="md"
              value={this.state.roleDesc}
              onChange={this.handleChange.bind(this, "roleDesc")}
              touched={false}
              error=""
            />
          </Row>
        </ModalBody>
        <ModalFooter>
          <CustomButton
              style={BUTTON_STYLE.BRICK}
              type={BUTTON_TYPE.PRIMARY}
              size={BUTTON_SIZE.LARGE }
              align="right"
              label="Search"
              isButtonGroup={true}
              onClick={() => {
                this.props.onSubmitClick(this.state);
                this.props.onCancel();
              }}
          />
          <CustomButton
            style={BUTTON_STYLE.BRICK}
            type={BUTTON_TYPE.SECONDARY}
            size={BUTTON_SIZE.LARGE }
            color={COLOR.PRIMARY}
            align="right"
            label="Cancel"
            isButtonGroup={true}
            onClick={this.props.onCancel}
          />
        </ModalFooter>
      </div>
    );
  }
}

export default SearchFilter;
