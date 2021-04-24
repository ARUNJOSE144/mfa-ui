import { ajax as NavigateTable } from '../../../../ajax/elements/ajax/Ajax';
import _ from 'lodash';

export default class DataTableUtils {
  constructor(obj) {
    this.listUrl = obj.listUrl;
    this.searchFilters = obj.searchFilters;
    this.setState = obj.setState;
    this.listName = obj.listName;
    this.rowIdParam = obj.rowIdParam;
    this.labelList = obj.labelList;
    this.apiVersion = obj.apiVersion || 2;
    this.loadingFunction = obj.loadingFunction;
    this.makeCallBack = obj.makeCallBack;
    this.deleteMessage = obj.deleteMessage;
    this.deleteMessageParam = obj.deleteMessageParam;
    this.postRequestCallback = obj.postRequestCallback;
    this.responseList = [];
    this.API_Options = {
      isShowSuccess: false,
      //  method: 'get',
      authKey: obj.authKey
    }

    this.showData = this.showData.bind(this);
    this.changeAttributes = this.changeAttributes.bind(this);
    this.highlightRow = this.highlightRow.bind(this);
  }
  load(isReset, data, firstLoad, currentState) {
    return this.reloadDataTable(isReset, data, firstLoad, currentState);
  }
  reloadDataTable(isReset, data, firstLoad, currentState) {
    const dataObj = this.getRequestData(isReset, data, currentState);
    NavigateTable(this.listUrl, dataObj, this.makeCallBack, this.showData, this.loadingFunction, { ...this.API_Options, firstLoad });
  }
  getRequestData(isReset, data, currentState = {}) {
    //Is Reset = true --> pageNumber : 1; noFilters;
    const getFilterData = (data, name) => {
      return (data && data.isAdvanceSearch ? data[name] : (currentState && currentState.filterParams ? currentState.filterParams[name] : ''));
    }
    const getFilters = () => {
      if (data && data.isCommonSearch)
        return null;
      else {
        const filterObj = [];
        if (this.searchFilters !== undefined) {
          this.searchFilters.forEach(name => {
            filterObj.push({ "name": name, "value": getFilterData(data, name) || "" });
          });
        }
        return filterObj;
      }
    }
    var advanceSearch = false;
    const filterObj = getFilters() || [];
    filterObj.forEach(obj => {
      if (obj.value) {
        advanceSearch = true;
        return false;
      }
    });
    const searchParams = {
      "pageNumber": (isReset === true ? 1 : ((data && data.pageNumber) ? data.pageNumber : currentState.pageNumber)) || "",
      "rowCount": (data && data.rowCount ? data.rowCount : currentState.rowCount) || "",
      "orderByCol": (data && data.orderByCol ? data.orderByCol : currentState.orderByCol) || "",
      "sort": (data && data.sort ? data.sort : currentState.sort) || "",
      "keyword": (advanceSearch ? "" : currentState.keyword) || "",
      "totalRecords": (data && data.totalRecords ? data.totalRecords : currentState.totalRecords) || "",
      "filters": filterObj
    }
    if (this.apiVersion === 1) {
      return { searchParams };
    }
    else {
      return searchParams;
    }

  }
  changeAttributes(currentState, data, evt) {
    var dataSet = null;
    const { name, isNotUpdateState, isOnlyUpdateState, sort,
      orderByCol, isResetTable, filterName } = data;

    if (isNotUpdateState) {
      this.reloadDataTable(isResetTable, { "isCommonSearch": true }, false, currentState);
      return false;
    }

    if (name === "pageNumber")
      evt.target.value++;

    if (name === "sortOptions") {
      const order = (!sort ? 'asc' : (sort === 'desc' ? 'asc' : 'desc'));
      dataSet = { "orderByCol": orderByCol, "sort": order, "currentRow": '' };
    } else if (name === "rowCount") {
      dataSet = { [name]: evt.target.textContent };
    } else if (name === "clearFilter") {
      dataSet = { [filterName]: '' };
    } else
      dataSet = { [name]: evt.target.value };

    if (!isOnlyUpdateState) {
      this.reloadDataTable(isResetTable, dataSet, false, currentState);
    } else {
      this.setState(dataSet);
    }
  }
  highlightRow(id) {
    this.setState({ "currentRow": id });
  }
  showData(response) {
    if (!response) {
      this.setState({ rowData: "", totalRecords: 0 });
      return false;
    }
    if (this.postRequestCallback && _.isFunction(this.postRequestCallback)) {
      const tableData = this.postRequestCallback(response);
      this.setState(tableData);
    } else {
      (this.apiVersion)
      switch (this.apiVersion) {
        case 1:
          const paramData = {};
          if (this.searchFilters !== undefined) {
            this.searchFilters.forEach(name => {
              paramData[name] = response[name];
            });
          }

          if (!response.searchResponse) {
            this.setState({ rowData: "", totalRecords: 0, ...paramData });
            return false;
          }
          if (
            !response.searchResponse.rowData ||
            response.searchResponse.rowData.length === 0
          ) {
            this.setState({
              rowData: "",
              totalRecords: 0,
              ...paramData,
              // keyword: response.searchResponse.keyword
            });
            return false;
          }
          const responseData_v1 = {
            totalRecords_v1: response.searchResponse.totalRecords,
            rowCount_v1: response.searchResponse.rowCount,
            keyword: response.searchResponse.keyword,
            orderByCol: response.searchResponse.orderByCol,
            sort: response.searchResponse.sort,
            filters: response.searchResponse.filters,
            rowData_v1: response.searchResponse.rowData,
            pageNumber_v1: response.searchResponse.pageNumber
          };
          const { totalRecords_v1, rowCount_v1, rowData_v1, pageNumber_v1 } = responseData_v1;
          const startRow_v1 = rowCount_v1 * (pageNumber_v1 - 1) + 1;
          const endRow_v1 = rowData_v1 && rowData_v1.length > 0
            ? rowData_v1.length < rowCount_v1
              ? startRow_v1 + rowData_v1.length - 1
              : startRow_v1 + rowCount_v1 - 1
            : 0;
          const totalPages_v1 = totalRecords_v1 && totalRecords_v1 !== 0 && rowCount_v1 && rowCount_v1 !== 0
            ? Math.ceil(totalRecords_v1 / rowCount_v1)
            : 0;
          this.setState({
            startRow: startRow_v1,
            endRow: endRow_v1,
            totalPages: totalPages_v1,
            currentRow: "",
            totalRecords: totalRecords_v1,
            rowCount: rowCount_v1,
            rowData: rowData_v1,
            pageNumber: pageNumber_v1,
            // keyword: responseData_v1.keyword,
            orderByCol: responseData_v1.orderByCol,
            sort: responseData_v1.sort,
            filters: responseData_v1.filters,
            ...paramData
          });
          break;
        case 2:
          const filtersData = { 'filterParams': {} };
          if (!response.search) {
            this.setState({ "rowData": '', "totalRecords": 0 });
            return false;
          }
          if (response.search.filters)
            filtersData.filterParams = this.transformFilterData(response.search.filters);

          if (!response[this.listName]
            || response[this.listName].length === 0) {
            this.setState({ "rowData": '', "totalRecords": 0, "keyword": response.search.keyword, ...filtersData });
            return false;
          }
          const rowDataList = this.transformToTableData(response[this.listName]);
          this.responseList = response[this.listName];

          const responseData = {
            "totalRecords": response.search.totalRecords,
            "rowCount": response.search.rowCount,
            // "keyword": response.search.keyword,
            "orderByCol": response.search.orderByCol,
            "sort": response.search.sort,
            "pageNumber": response.search.pageNumber,
            "rowData": rowDataList
          }
          const { totalRecords, rowCount, rowData, pageNumber } = responseData;
          const startRow = (rowCount * (pageNumber - 1)) + 1;
          const endRow = (rowData && rowData.length > 0 ? (rowData.length < rowCount ? (startRow + rowData.length) - 1 : (startRow + rowCount) - 1) : 0);
          const totalPages = ((totalRecords && totalRecords !== 0 && rowCount && rowCount !== 0) ? Math.ceil(totalRecords / rowCount) : 0);
          this.setState({ startRow, endRow, totalPages, "currentRow": '', ...responseData, ...filtersData });
          break;
        default:
          break;
      }
    }

  }
  transformToTableData(data) {
    const rowDataList = [];
    data.forEach((tableData) => {
      const deleteParam = [];
      if (this.deleteMessageParam) {
        this.deleteMessageParam.forEach((delParam) => {
          deleteParam.push(tableData[delParam]);
        });
      } else {
        deleteParam.push(this.rowIdParam)
      }
      const result = {};
      result.rowId = tableData[this.rowIdParam];
      result.confirmationMessage = `${this.deleteMessage} ${deleteParam && deleteParam.length > 1 ? deleteParam.join(' ') : (deleteParam && deleteParam.length === 1 ? deleteParam[0] : '')}?`;
      result.columnValues = [];
      this.labelList.forEach((row) => {
        const className = [];
        const fieldName = [];
        if (row.condition && row.condition.length > 0) {
          row.condition.forEach((condition) => {
            switch (condition.condition) {
              case "=":
                if (tableData[condition.paramId] === condition.value)
                  className.push(condition.className);
                break;
              case "combine":
                condition.paramIds.forEach((paramId) => {
                  fieldName.push(tableData[paramId]);
                });
                break;
              default:
                break;
            }
          });
        }

        result.columnValues.push({
          value: (fieldName && fieldName.length > 0 ? fieldName.join(' ') :
            (row.paramId ? tableData[row.paramId] : tableData[row.id])), className: className.toString()
        });
      });
      rowDataList.push(result);
    });
    return rowDataList;
  }
  transformFilterData(filters) {
    const filterDetails = {};
    filters.forEach((filterData) => {
      filterDetails[filterData.name] = filterData.value;
    });
    return filterDetails;
  }
  getResponseList() {
    return this.responseList;
  }
}
