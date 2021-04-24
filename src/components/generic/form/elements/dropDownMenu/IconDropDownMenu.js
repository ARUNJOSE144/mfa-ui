import React from 'react';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

const IconDropDownMenu = ({menus,color}) => {
    const iconClass = color === 'secondary' ? 'menu-icon-o-2' : 'menu-icon-o'
    
    return (
        <UncontrolledDropdown>
            <DropdownToggle tag="span" className={`d-block ${iconClass}`} />
            <DropdownMenu right className="dropdown-menu-sm fs-13">
                {
                    menus.map(
                        menu => <DropdownItem key={menu.label} onClick={menu.handleClick}>{menu.label}</DropdownItem>
                    )
                }
            </DropdownMenu>
        </UncontrolledDropdown>
    )

}

export default IconDropDownMenu;