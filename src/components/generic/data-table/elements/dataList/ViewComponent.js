import React, { Component } from 'react';
import {
    ModalBody,
    Col,
    Row,
    Input
  } from 'reactstrap';
  import classnames from 'classnames';
import { IconDropDownMenu } from '@6d-ui/form';

  export default class ViewComponent extends Component {
    render(){
     const getIconDropDown =() =>{
        if(this.props.isDropDown){
          return(
            <IconDropDownMenu color="secondary" 
                  menus={ddMenus(this.props.details)}
                  />
          )
        }
      }
      const dropDownMenu = (dropdownMenu ,details) => {
       return dropdownMenu.map(
          menu => ({label: menu.label, handleClick: () => menu.handleClick(details)})
        ) 
      }
      const ddMenus = details =>  details.dropdownMenu ? 
      dropDownMenu(details.dropdownMenu ,details): 
      dropDownMenu(this.props.dropdownMenus ,details)
      

        return (
            <div className={classnames('list-Brick-component px-3 py-2',
              { 'selectedUser': this.props.selectedId === this.props.details.id }
            )} key={this.props.details.id} onClick={(this.props.selectedId !== this.props.details.id)
             ? (() => this.props.onClick(this.props.details)):undefined}>
              {
                (this.props.selectedId === this.props.details.id) && <div className="float-right mt-2">
                {getIconDropDown()}
                </div>
              }
              <div className="fs-16">
                <b>{this.props.details.name}</b>
              </div>
              <div className="fs-12">
                {this.props.details.label}
              </div>
            
            </div>
          )
      }
    
    }

