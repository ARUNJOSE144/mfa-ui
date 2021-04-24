import React from 'react';

export const ErrorPage = ({errorCode}) => {
  const message = {};

  switch (errorCode) {
    case 404:
      message.errorMessage = "Resource Not Found";
      message.subMessage = "The requested resource could not be found but may be available again in the future."
      break;
    default:
      message.errorMessage = "Resource Unavailable";
      message.subMessage = "The requested resource is unavailable but may be available again in the future."
      break;
  }

  return (
    <div style={{padding:'100px 0px'}} className="text-center">
      <div style={{fontSize: '24px',paddingBottom: '10px'}}>
        {message.errorMessage}
      </div>
      <div>
        {message.subMessage}
      </div>
    </div>
  );
}

export const Loading = () => {
  return (
    <div className="loadingPageContainer" style={{background: "#eaedf0"}}>
        <div style={{ margin: 'auto', marginTop: '100px', width: '200px' }}>
            <div className="three-cogs fa-3x">
              <i className="fa fa-cog fa-spin fa-2x fa-fw"></i>
              <i className="fa fa-cog fa-spin fa-1x fa-fw"></i>
              <i className="fa fa-cog fa-spin fa-1x fa-fw"></i>
            </div>
        </div>
    </div>
  );
}
