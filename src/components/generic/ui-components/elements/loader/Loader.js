import React from 'react';

const Loader = ({isLoading, isFirstLoad}) => {
    return isLoading === true ? (
        <div className="loadingPageContainer" style={isFirstLoad ? {background: "#eaedf0"} : {background: "rgba(245, 245, 245, 0.56)"}}>
            <div style={{ margin: 'auto', marginTop: '100px', width: '200px' }}>
                <div className="three-cogs fa-3x">
                  <i className="fa fa-cog fa-spin fa-2x fa-fw"></i>
                  <i className="fa fa-cog fa-spin fa-1x fa-fw"></i>
                  <i className="fa fa-cog fa-spin fa-1x fa-fw"></i>
                </div>
            </div>
        </div>
    ) : null;
}
export default Loader;
