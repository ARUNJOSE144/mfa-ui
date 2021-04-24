import Pager from 'react-pager';
import React, { Component } from 'react';
import ViewComponent from "./ViewComponent";

export default class SearchComponent extends Component {

  getPlanList = () => {
        if (this.props.isLoading && this.props.isLoading === true) {
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
        } else if (!this.props.data) {
          return (
            <div className="text-center p-4">
              Not Found !!
              </div>
          );
        } else {
          return this.props.data.map((details) => <ViewComponent
            details={details}
            onClick= {this.props.onClick}
            dropdownMenus={this.props.dropdownMenus}
            selectedId = {this.props.selectedId}
            isDropDown = {this.props.isDropDown}
            />
          );
        }
      }

      getPagination = () =>{
        if(this.props.isPagination)
        return(
          <Pager
                  total={this.props.totalPages ? this.props.totalPages : 0}
                  current={this.props.pageNumber ? this.props.pageNumber - 1 : 0}
                  visiblePages={1}
                  titles={{ first: '<<', last: '>>', prev: '<', next: '>' }}
                  className="pagination-sm mb-0"
                  onPageChanged={pageNumber => this.props.onSearch(false,pageNumber+1)}
                />
        );
      }


    render(){
        const customStyle = "custom-select-style p-3";
        return(
            <div>
            <div className={this.props.customClass ? this.props.customClass : customStyle}>
              {this.props.search}
            </div>
            <div className="list-Brick scrollbar" style={{ overflow: 'auto', ...this.props.leftHeight }}>
              {this.getPlanList()}
            </div>
            <div className="pager-css">
            {this.getPagination()} 
            </div>
          </div>
        )
    }
}