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

export const toFlatObject = (outerObj) => {
    let finalObj = {};
    for (var outerKey in outerObj) {
        if (outerObj.hasOwnProperty(outerKey)) {
            let innerObj = outerObj[outerKey];
            for (var innerKey in innerObj) {
                if (innerObj.hasOwnProperty(innerKey)) {
                    finalObj[`${outerKey}.${innerKey}`] = innerObj[innerKey] || '';
                }
            }
        }
    }
    return finalObj;
}

export const expandSelectedValue = (value, options) => {
    const valueType = typeof value;
    if (valueType === 'string' || valueType === 'number' || valueType === 'boolean') {
        if (!options) return;
        for (let i = 0; i < options.length; i++) {
            if (String(options[i][value]) === String(value)) return options[i];
        }
    }
    return value;
};

export const reduceSelectedOption = (value) => {
    const valueType = typeof value;
    if (valueType === 'string' || valueType === 'number' || valueType === 'boolean') return value;
    return value.value;
};





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