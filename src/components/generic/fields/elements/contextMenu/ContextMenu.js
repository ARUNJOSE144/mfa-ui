import React from "react";
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";

const CustomContextMenu = (props) => {
  const {
    screenWidth = 0
  } = props;

  let positionX = 0;
  if(screenWidth != 0){
    positionX = Math.ceil((window.screen.width * (100 - screenWidth)) / 100);
  }

  return (
    <div className={props.className} style={props.style}>
      <ContextMenuTrigger id={props.id} posX={positionX}>
        {props.children}
      </ContextMenuTrigger>
      <ContextMenu id={props.id}>
        {props.options &&
          props.options.map(data => (
            <div className="custom-context-menu" key={data.value}>
              <MenuItem data={{ data }} onClick={props.onChange}>
                {data.label}
              </MenuItem>
            </div>
          ))}
      </ContextMenu>
    </div>
  )
}
export default CustomContextMenu;