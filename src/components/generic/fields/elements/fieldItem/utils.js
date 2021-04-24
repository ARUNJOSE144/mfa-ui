export const expandSelectValue = (valueArray, options) => {
    if (isArray(valueArray)) {
        return valueArray.map(value => expandValue(value, options));
    }
    return expandValue(valueArray, options)
}

const expandValue = (value, options) => {
    const valueType = typeof value;
    if (valueType !== 'string' && valueType !== 'number' && valueType !== 'boolean') return value;
    if (!options) return;
    for (let i = 0; i < options.length; i++) {
        if (String(options[i].value) === String(value)) return options[i];
    }
};

const isArray = function (obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
}

export function sortOptionsByLabel(options = []) {
    if (options == null || !Array.isArray(options));

    try {
        if (options) {
            options.sort(function (a = {}, b = {}) {
                let { label: aLabel = "" } = a;
                let { label: bLabel = "" } = b;
                if (aLabel == null) aLabel = "";
                if (bLabel == null) bLabel = "";
                if (aLabel.toLowerCase() < bLabel.toLowerCase()) return -1; else if (aLabel.toLowerCase() > bLabel.toLowerCase()) return 1; else return 0;
            });
        }
    } catch (error) {
        console.warn(error);
    }


    return options;
};



export const createOptions = (options, value, label) => {
    if (validate(options)) {
        for (var i = 0; i < options.length; i++) {
            options[i].value = options[i][value];
            options[i].label = options[i][label];
        }
    }
    return options;
}


export const validate = (value) => {
    if (value !== null && value !== undefined && value !== "")
        return true;
    else
        return false;
}