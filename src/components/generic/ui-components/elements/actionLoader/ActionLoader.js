import React from 'react';

const ActionLoader = ({isLoading}) => {
    return isLoading === true ? (
      <div className="loadingActionContainer" style={{ background: "rgba(245, 245, 245, 0.56)" }}>
        <div style={{ margin: "auto", marginTop: "40%", width: "200px" }}>
          <div className="three-cogs fa-3x">
            <i className="fa fa-cog fa-spin fa-2x fa-fw" />
            <i className="fa fa-cog fa-spin fa-1x fa-fw" />
            <i className="fa fa-cog fa-spin fa-1x fa-fw" />
          </div>
        </div>
      </div>
    ) : null;
}
export default ActionLoader;
