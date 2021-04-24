
import { validate } from "../../../generic/fields/elements/fieldItem/utils";

export const treeToArray = (treeData = [], parent) => {
  const treeArray = [];
  parent = parent || 0;
  const { children, ...newNode } = treeData;
  treeArray.push(newNode);
  if (treeData.children && treeData.children.length > 0) {
    for (var i = 0, len = treeData.children.length; i < len; i++) {
      treeArray.push(...treeToArray(treeData.children[i]));
    }
  }
  return treeArray;
}





//For checking a privilage is present ot nor
export function checkForPrivilege(privilages, item) {
  if (validate(privilages) && validate(item)) {
    for (var i = 0; i < privilages.length; i++) {
      if (privilages[i] === item)
        return true;
    }
  }
  return false;
}


//checking for atleast 1 privilage in multiple privilags
export function containAtleastOnePrivilage(privilages, menuPrivilages, items) {
  if (validate(privilages) && validate(items)) {
    for (var i = 0; i < items.length; i++) {
      if (checkForPrivilege(privilages, menuPrivilages[items[i]])) {
        return true;
      }
    }
  }
  return false;
}

//checking for atleast 1 privilage in multiple privilags
export function containAtleastOnePrivilageId(privilages, menuPrivilages, items) {
  if (validate(privilages) && validate(items)) {
    for (var i = 0; i < items.length; i++) {
      if (checkForPrivilege(privilages, menuPrivilages[items[i]])) {
        return menuPrivilages[items[i]];
      }
    }
  }
  return 0;
}


