import React from 'react';

const NavLink = (props) => {
  return (
    <a onClick={() => props.redirect(props.menu, props.menu.linkTo)}
      className={props.selectedMenu === props.menu.id ? 'selected' : ''}
    >
      {(!props.isSubmenu ? <i className={`fa ${props.menu.icon} menu-icon`} /> : "")}
      {props.menu.label}
    </a>
  );
}
export default NavLink;
