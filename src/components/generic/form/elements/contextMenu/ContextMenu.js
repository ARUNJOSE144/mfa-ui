import React from "react";
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";

const CustomContextMenu = (props) => {
  return (
    <div className={props.className} style={props.style}>
      <ContextMenuTrigger id={props.id}>
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
