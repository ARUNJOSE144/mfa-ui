import _ from "lodash";
import React, { Component } from "react";
import { Switch } from "react-router-dom";
import { Col, Container, Input, Label, ModalBody, Row } from "reactstrap";
import FieldItem from '../../generic/fields/elements/fieldItem/FieldItem';
import FIELD_TYPES from '../../generic/fields/elements/fieldItem/FieldTypes';

const modules = [];
export default class RoleDetails extends Component {
  constructor(props) {
    super(props);
    this.getAllPermissions = this.getAllPermissions.bind(this);
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.state = {
      isLoading: true,
      roleId: "",
      roleName: "",
      isSuccess: false,
      permissions: "",
      windowHeight: 0
    };
  }

  componentDidMount() {
    this.getAllPermissions();
    this.updateWindowDimensions();
    window.addEventListener("resize", this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.setState({ windowHeight: window.innerHeight });
  }

  getAllPermissions() {
    const permissionList = [];
    for (var key in this.props.permissions) {
      if (this.props.permissions.hasOwnProperty) {
        var arr = this.props.permissions[key];
        arr.map(data => permissionList.push(data.value, data.label));
      }
    }
    return permissionList;
  }

  render() {
    const getPermissions = permissions => {
      const permissionList = [];
      _.forEach(permissions, function(feature) {
        const temp = {
          value: feature.featureId,
          label: customiseOptions(feature.featurName, feature.featureId)
        };
        permissionList.push(temp);
      });
      return permissionList;
    };

    const customiseOptions = (featureName, key) => {
      return (
        <Container>
          <Input
            id={featureName + "_" + key}
            type="checkbox"
            onClick={() => {
              return false;
            }}
          />
          <span
            style={
              {
                /* color: 'black' */
              }
            }
          >
            <Label for={featureName + "_" + key}>{featureName}</Label>
          </span>
        </Container>
      );
    };

    const getModuleList = modules => {
      return this.props.modules.map((item, index) => viewList(item, index));
    };

    const viewList = (item, index) => {
      return (
        <Row
          key={index}
          style={{
            paddingBottom: "0.3rem",
            paddingTop: "0.3rem"
          }}
        >
          <Col md="3">{item.moduleName}</Col>
          <Col md="3">
            <Switch
              moduleId={item.moduleId}
              handleChange={() => {
                return null;
              }}
              checked={!_.isEmpty(this.props.permissions[item.moduleId])}
            />
          </Col>
          <Col md="6" style={{ paddingLeft: "0rem" }}>
            <Row>
              <Col md="9" style={{"pointer-events":"none"}}>
                <FieldItem 
                  values={getPermissions(item.features)}
                  value={this.props.permissions[item.moduleId]}
                  type={FIELD_TYPES.MUTLI_SELECT}
                  width="xs"
                  onChange={() => {
                    return false;
                  }}
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
    };

    const selectText = "No Permissions Assigned";
    const height = {
      height: this.state.windowHeight - 68
    };
    return (
      <ModalBody>
        <div
          className="custom-container overlay_position scrollbar"
          style={height}
        >
          <div className="form-Brick">
            <div className="form-Brick-Head">
              <span>Role Details</span>
            </div>
            <div className="form-Brick-body">
              <Row className="mx-0">
                <Container>
                  <Row className="form-data">
                    <Col xs="6">
                      <Row>
                        <Col className="form-data-label" xs="6">
                          Role Id
                        </Col>
                        <Col className="form-data-value" xs="6">
                          {this.props.roleId}
                        </Col>
                      </Row>
                    </Col>
                    <Col xs="6">
                      <Row>
                        <Col className="form-data-label" xs="6">
                          Role Name
                        </Col>
                        <Col className="form-data-value" xs="6">
                          {this.props.roleName}
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Container>
              </Row>
            </div>
          </div>

          <div className="form-Brick">
            <div className="form-Brick-Head">
              <span>Permissions</span>
            </div>
            <div className="form-Brick-body form-card">
              <Row className="mx-0">
                <Container>
                  <Row className="form-card-header">
                    <Col md="3">Modules</Col>
                    <Col md="3" />
                    <Col md="6">Permissions</Col>
                  </Row>
                </Container>
                <Container>{getModuleList(modules)}</Container>
              </Row>
            </div>
          </div>
        </div>
      </ModalBody>
    );
  }
}
