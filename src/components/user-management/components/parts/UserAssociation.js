import React, { Component } from 'react';
import { Container, Row, Col, Input, Badge } from 'reactstrap';
import Pager from 'react-pager';
import _ from 'lodash';
import {
    CustomButton,
    BUTTON_TYPE,
    BUTTON_SIZE,
    BUTTON_STYLE,
    COLOR
} from '@6d-ui/buttons';
import { FieldItem, FIELD_TYPES } from '@6d-ui/fields';

export default class UserAssociation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchParam: '',
            selected: this.props.selected ? this.props.selected : [],
            options: [],
            searchFilters: {},
            channelPartnerTypeId: this.props.channelPartnerTypeId,
            isLoading: false
        }
        this.ROW_COUNT = 10;
        this.getLoader = this.getLoader.bind(this);
    }

    componentDidMount() {
        this.fetchChannelTypes();
        this.fetchEntities();       
    }

    componentDidUpdate(prevProps, prevState){
        if(prevProps.entityId !== this.props.entityId)
            this.fetchEntities();
    }

    onClear(){
        this.setState({
            searchFilters : "",
        });
    }

    fetchEntities = (data, isReset) => {
        const request = {
            pageNumber: isReset === true ? 1 : this.state.pageNumber || 1,
            rowCount: this.ROW_COUNT,
            orderByCol: "id", sort: "asc", 
            totalRecords: this.state.totalRecords || "",
            keyword: this.state.searchParam
        }

        const { searchFilters } = this.state;
        if(this.props.entityId && this.props.entityId !== "0" ){
            const reqFilters = [{
                name: "parentId", 
                value: this.props.entityId
            }]
            request.filters = reqFilters;
        }           
        if (!_.isEmpty(searchFilters)) {
            const reqFilters = [];
            searchFilters.territoryId && reqFilters.push({ name: "locationId", value: searchFilters.territoryId });
            searchFilters.channelType && reqFilters.push({ name: "channelType", value: searchFilters.channelType });
            (this.props.entityId && this.props.entityId !== "0") && reqFilters.push({ name: "parentId", value: this.props.entityId });
            request.filters = reqFilters;
        }
        this.props.ajaxUtil.sendRequest (`${this.props.url_ChannelPartners_SearchUrl}`, request, (response, hasError) => {
            if (!hasError) {
                const { channelPartnerEnitities, search = {} } = response;
                const options = channelPartnerEnitities ? 
                                    channelPartnerEnitities.map(({ id, name, channelType }) => 
                                            ({ value:id, label:name, subLabel:channelType })
                                    ) 
                                : [];

                const { totalRecords, rowCount, pageNumber } = search;
                const totalPages = ((totalRecords && totalRecords !== 0 && rowCount && rowCount !== 0) ? Math.ceil(totalRecords / rowCount) : this.state.totalPages || 0);
                this.setState({ options, pageNumber, totalPages });
            }
        }, this.addLoading.bind(this),{ isShowSuccess: false, isProceedOnError: false });
    }

    addLoading(isLoading) {
        this.setState({ isLoading });
    }

    getLoader() {
        if (this.state.isLoading && this.state.isLoading === true) {
          return (
            <div
              className="loadingActionContainer"
              style={{ background: "rgba(245, 245, 245, 0.56)" }}
            >
              <div style={{ margin: "auto", marginTop: "40%", width: "200px" }}>
                <div className="three-cogs fa-3x">
                  <i className="fa fa-cog fa-spin fa-2x fa-fw" />
                  <i className="fa fa-cog fa-spin fa-1x fa-fw" />
                  <i className="fa fa-cog fa-spin fa-1x fa-fw" />
                </div>
              </div>
            </div>
          );
        }
      }

    fetchChannelTypes = opts => {
        const request = {};
        const reqFilters = [{
            name: "ChannelType", 
            value: this.props.channelPartnerTypeId
        }]
        request.filters = reqFilters;
        this.props.ajaxUtil.sendRequest (`${this.props.url_User.VIEW_CHANNELTYPE_URL}`, request, (response, hasError) => {
            const { channelTypeNodes } = response;
            const channelTypeOptions = [];
            if (channelTypeNodes.type === this.props.url_SalesHierarchy_OpNodeType) {
                channelTypeOptions.push(this.getOptionsForSelect(channelTypeNodes));
                channelTypeOptions.push(
                    ...(channelTypeNodes.children ? channelTypeNodes.children.map(
                        child => {
                            const salesEntites = [];
                            child.children && child.children.map(subChild => salesEntites.push(...this.treeToArray(subChild)));
                            const tempChild = { ...this.getOptionsForSelect(child) }
                            tempChild.children = salesEntites.map(salesEntity => this.getOptionsForSelect(salesEntity));
                            return tempChild;
                        }
                    ) : [])
                );
            } else 
            if (channelTypeNodes.type === this.props.url_SalesHierarchy_BuNodeType) {
                channelTypeOptions.push(
                    ...(channelTypeNodes.children ? channelTypeNodes.children.map(
                        child => {
                            const salesEntites = [];
                            child.children && child.children.map(subChild => salesEntites.push(...this.treeToArray(subChild)));
                            const tempChild = { ...this.getOptionsForSelect(child) }
                            tempChild.children = salesEntites.map(salesEntity => this.getOptionsForSelect(salesEntity));
                            return tempChild;
                        }
                    ) : [])
                );
            } else {
                const tempArray = this.treeToArray(channelTypeNodes);
                channelTypeOptions.push(...tempArray.map(obj => this.getOptionsForSelect(obj)));
            }
            this.setState({ channelTypeOptions })
        },this.addLoading.bind(this), {isShowSuccess: false, isProceedOnError: false });
    }

    getOptionsForSelect(rawOpt) {
        if (!_.isEmpty(rawOpt)) {
            if(rawOpt.type !== 1)
                return {
                    label: rawOpt.nodeName,
                    value: rawOpt.nodeId
                }
        }
        return {};
    }

    treeToArray(treeData = [], parent) {
        const treeArray = [];
        parent = parent || 0;
        const { children, ...newNode } = treeData;
        treeArray.push(newNode);
        if (treeData.children && treeData.children.length > 0) {
            for (var i = 0, len = treeData.children.length; i < len; i++) {
                treeArray.push(...this.treeToArray(treeData.children[i]));
            }
        }
        return treeArray;
    }

    onSearch(evt) {
        this.setState({ searchParam: evt.target.value });
    }

    onSearchKeyUp = e => {
        if (e.keyCode === 13) {
            this.fetchEntities({}, true);
        }
    }

    onSelect = (name, value, obj) => {
        const {isTouched} = obj || {isTouched : false};
        if (!isTouched) {
            const oldSelected = this.props.selected || this.state.selected;
            const selected = [...oldSelected];
            if (selected.includes(value)) {
                var index = selected.indexOf(value);
                if (index > -1) {
                    selected.splice(index, 1);
                }
            } else {
                selected.push(value);
            }
            this.setState({ selected }, () => this.props.onSelect(selected));
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.selected) {
            const { selected: selectedInState } = this.state;
            const isSame = nextProps.selected && nextProps.selected.every(val => selectedInState.includes(val));
            if (!isSame) {
                this.setState({ selected: nextProps.selected });
            }
        }
    }

    handleSearchInputChange = (name, value, obj) => {
        const {isTouched} = obj || {isTouched : false};
        let locationIds =  this.props.locationId ? this.props.locationId.map((item) => {
            return item.value;
        }) : [];
        const searchFilters = { ...this.state.searchFilters };
        if(!isTouched){
            if (name === 'territoryType' && value && value.value) {
                this.props.ajaxUtil.sendRequest (`${this.props.url_User.VIEW_LOCATION_URL}0&locationType=${value.value}&locationId=${locationIds}`, {}, 
                    (response, hasError) => {
                        const optionList = [];
                        response.childLocList.locDetails.forEach((options) => {
                            const temp = {
                                'value': options.locId,
                                'label': options.locName
                            }
                            optionList.push(temp);
                        });
                        searchFilters[name] = value.value;
                        this.setState({ searchFilters, territoryOptions: optionList })
                }, this.props.loadingFunction, { method: 'GET', isShowSuccess: false, isProceedOnError: false });
            } else {
                searchFilters[name] = value && value.value;
                this.setState({ searchFilters });
            }
        }
        
    }

    render() {
        const { selected } = this.state;
        return (
            <div className="form-Brick-body">
                <Container>
                    <Row>
                        <Col>
                            <Container>
                                <Row>
                                    <Col className="mb-2">
                                        <div className="fs-16 fw-600" style={{borderBottom: '2px solid #e9ecef'}}>
                                            <span>Search Filters</span>
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    {this.props.teritoryTypeOptions && this.props.teritoryTypeOptions.length > 0 && <FieldItem
                                        label="Location Type"
                                        value={this.state.searchFilters.territoryType}
                                        type={FIELD_TYPES.DROP_DOWN}
                                        values={this.props.teritoryTypeOptions}
                                        width="sm"
                                        onChange={this.handleSearchInputChange.bind(this, 'territoryType')}
                                    />}
                                    <FieldItem
                                        label="Location"
                                        value={this.state.searchFilters.territoryId}
                                        type={FIELD_TYPES.DROP_DOWN}
                                        values={this.state.territoryOptions}
                                        width="sm"
                                        onChange={this.handleSearchInputChange.bind(this, 'territoryId')}
                                    />
                                    <FieldItem
                                        label="Channel Type"
                                        values={this.state.channelTypeOptions}
                                        value={this.state.searchFilters.channelType}
                                        type={FIELD_TYPES.NESTED_DROP_DOWN}
                                        width="sm"
                                        onChange={this.handleSearchInputChange.bind(this, 'channelType')}
                                        touched={false}
                                        error=""
                                        placeholder="Select"
                                        disabled={false}
                                    />
                                    {this.getLoader()}
                                </Row>

                                <Row>
                                    <Col className="pt-4">
                                        <CustomButton
                                            style={BUTTON_STYLE.BRICK}
                                            type={BUTTON_TYPE.PRIMARY}
                                            size={BUTTON_SIZE.LARGE}
                                            align="right"
                                            label="Search"
                                            isButtonGroup={true}
                                            onClick={() => this.fetchEntities({ filters: this.state.searchFilters }, true)}
                                        />
                                        <CustomButton
                                            style={BUTTON_STYLE.BRICK}
                                            type={BUTTON_TYPE.SECONDARY}
                                            size={BUTTON_SIZE.LARGE}
                                            color={COLOR.PRIMARY}
                                            align="right"
                                            label="Clear"
                                            isButtonGroup={true}
                                            onClick={this.onClear.bind(this)}
                                        />                                        
                                    </Col>
                                </Row>
                            </Container>
                        </Col>
                        <Col>
                            <div style={{ width: '100%'}} className="h-100">
                                <Container className="border">
                                    <Row style={{ backgroundColor: '#D3DEE4', }}>
                                        <Col>
                                            <div className="h-100 w-100 d-table">
                                                <span style={{ color: '#6D6D6D' }} className="d-table-cell align-middle fs-16 fw-600">
                                                    Select Channel Partners
                                                    <Badge pill className="ml-2 px-2">{this.state.selected ? this.state.selected.length : 0}
                                                    </Badge>
                                                </span>
                                            </div>
                                        </Col>
                                        <Col className="p-0">
                                            <div className="p-1">
                                                <Input
                                                    type="search"
                                                    className="dataTable_common_search"
                                                    placeholder="Quick Search"
                                                    size="sm"
                                                    onKeyUp={this.onSearchKeyUp}
                                                    onChange={this.onSearch.bind(this)}
                                                    value={this.state.searchParam}
                                                />

                                            </div>
                                        </Col>
                                    </Row>
                                    <Row>  
                                        <Col className="px-0">                                    
                                        <FieldItem
                                            values={this.state.options}
                                            isListedInput={true}
                                            type={FIELD_TYPES.CHECK_BOX}
                                            value={selected}
                                            onChange={this.onSelect.bind(this,"entitySelected")}
                                        />
                                        </Col>
                                    </Row>
                                    <Row>
                                        {
                                            (this.state.options && this.state.options.length > 0)
                                                ? <Col className="text-center mt-2">
                                                    <Pager
                                                        total={this.state.totalPages ? this.state.totalPages : 0}
                                                        current={this.state.pageNumber ? this.state.pageNumber - 1 : 0}
                                                        visiblePages={3}
                                                        titles={{ first: 'First', last: 'Last', prev: 'Prev', next: 'Next' }}
                                                        className="pagination-sm"
                                                        onPageChanged={pageNumber => this.setState({ pageNumber: pageNumber + 1 }, 
                                                                            () => this.fetchEntities())}
                                                    />

                                                </Col>
                                                : <Col className="text-center mt-2 mb-2 text-danger fw-600">
                                                    <span>No results found..!</span>
                                                </Col>
                                        }
                                    </Row>                             
                                </Container>
                            </div>
                        </Col>
                    </Row>
                </Container>         
            </div>
        );
    }
}