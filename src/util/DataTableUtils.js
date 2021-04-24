import {NavigateTable} from './Utils';

export default class DataTableUtils {
  constructor(obj) {
   this.listUrl = obj.listUrl;
   this.searchFilters = obj.searchFilters;
   this.setState = obj.setState;
   this.listName = obj.listName;
   this.rowIdParam = obj.rowIdParam;
   this.labelList = obj.labelList;

   this.showData = this.showData.bind(this);
   this.changeAttributes = this.changeAttributes.bind(this);
   this.highlightRow = this.highlightRow.bind(this);
  }
  load (isReset, data, firstLoad, currentState) {
    return this.reloadDataTable(isReset, data, firstLoad, currentState);
  }
  reloadDataTable(isReset, data, firstLoad, currentState) {
    const dataObj = this.getRequestData(isReset, data, currentState);
    NavigateTable(this.listUrl, dataObj, this.showData, firstLoad);
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
          this.searchFilters.forEach(name => {
            filterObj.push({"name": name, "value": getFilterData(data, name) || ""});
          });
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
        "pageNumber"  : (isReset === true ? 1 : ((data && data.pageNumber) ? data.pageNumber : currentState.pageNumber)) || "",
        "rowCount"    : (data && data.rowCount ? data.rowCount : currentState.rowCount) || "",
        "orderByCol"  : (data && data.orderByCol ? data.orderByCol : currentState.orderByCol) || "",
        "sort"        : (data && data.sort ? data.sort : currentState.sort) || "",
        "keyword"     : (advanceSearch ? "" : currentState.keyword) || "",
        "totalRecords": (data && data.totalRecords ? data.totalRecords : currentState.totalRecords) || "",
        "filters" : filterObj
      }
      return searchParams;
    }
    changeAttributes(currentState, data, evt) {
      var dataSet = null;
      const {name, isNotUpdateState, isOnlyUpdateState, sort,
        orderByCol, isResetTable, filterName} = data;

      if (isNotUpdateState) {
          this.reloadDataTable(isResetTable, {"isCommonSearch" : true}, false, currentState);
          return false;
      }

      if (name === "pageNumber")
        evt.target.value ++;

      if (name === "sortOptions") {
        const order = (!sort ? 'asc' : (sort === 'desc' ? 'asc' : 'desc'));
        dataSet = { "orderByCol": orderByCol, "sort": order, "currentRow": ''};
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
      const filtersData = {'filterParams' : {}};
      if (!response) {
        this.setState({"rowData" : '', "totalRecords" : 0});
        return false;
      }
      if (!response.search) {
        this.setState({"rowData" : '', "totalRecords" : 0});
        return false;
      }
      if (response.search.filters)
        filtersData.filterParams = this.transformFilterData(response.search.filters);

      if (!response[this.listName]
        || response[this.listName].length === 0) {
          this.setState({"rowData" : '', "totalRecords" : 0, "keyword" : response.search.keyword, ...filtersData});
          return false;
      }
      const rowDataList = this.transformToTableData(response[this.listName]);

      const responseData = {
        "totalRecords" : response.search.totalRecords,
        "rowCount" : response.search.rowCount,
        "keyword" : response.search.keyword,
        "orderByCol" : response.search.orderByCol,
        "sort" : response.search.sort,
        "pageNumber" : response.search.pageNumber,
        "rowData" : rowDataList
      }
      const {totalRecords, rowCount, rowData, pageNumber} = responseData;
      const startRow = (rowCount * (pageNumber -1)) + 1;
      const endRow = (rowData && rowData.length > 0 ? (rowData.length < rowCount ? (startRow + rowData.length) - 1 : (startRow + rowCount) - 1) : 0);
      const totalPages = ((totalRecords && totalRecords !== 0 && rowCount && rowCount !== 0) ? Math.ceil(totalRecords/rowCount) : 0);
      this.setState({ startRow, endRow, totalPages, "currentRow": '', ...responseData, ...filtersData });
    }
    transformToTableData(data){
      const rowDataList=[];
      data.forEach((tableData) => {
        const result = {};
          result.rowId = tableData[this.rowIdParam];
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
            result.columnValues.push({value:(fieldName && fieldName.length > 0 ? fieldName.join(' ') : tableData[row.paramId]), className: className.toString()});
          });
          rowDataList.push(result);
      });
      return rowDataList;
    }
    transformFilterData(filters){
      const filterDetails = {};
      filters.forEach((filterData) => {
        filterDetails[filterData.name] = filterData.value;
      });
      return filterDetails;
    }
}
