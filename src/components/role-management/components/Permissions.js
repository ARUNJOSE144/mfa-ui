import { Redirect, Switch } from "react-router-dom";
import _ from "lodash";
import React, { Component } from "react";
import { Col, Container, Row } from "reactstrap";
import FieldItem from '../../generic/fields/elements/fieldItem/FieldItem';
import FIELD_TYPES from '../../generic/fields/elements/fieldItem/FieldTypes';

class Permissions extends Component {
  render() {
    console.log("Modules in Permissions.js: ", this.props.modules);
    const getModuleList = modules => {
      return modules.map((item, index) => {
        return (
          <Row key={index} style={{ paddingBottom: "0.3rem", paddingTop: "0.3rem" }}          >

            <Col md="3">{item.moduleName}</Col>
            <Col md="3">
              <Switch
                moduleId={item.moduleId}
                handleChange={e => this.props.handleSwitch({ moduleId: item.moduleId, features: item.features }, e)}
                checked={!_.isEmpty(this.props.permissions[item.moduleId])}
              />
            </Col>
            <Col md="6" style={{ paddingLeft: "0rem" }}>
              <Row>
                <Col md="10">
                  <FieldItem
                    values={this.props.getPermissions(item.features)}
                    value={this.props.permissions[item.moduleId]}
                    type={FIELD_TYPES.MUTLI_SELECT}
                    width="xs"
                    onChange={value => this.props.handleDropDownChange(item.moduleId, value, this.props.getPermissions(item.features))}
                    placeholder={selectText}
                    disabled={false}
                    touched={false}
                    error=""
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        );
      });
    };

    const selectText = "Select";
    return <Container>{getModuleList(this.props.modules)}</Container>;
  }
}

export default Permissions;
