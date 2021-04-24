var utils = {
    findFirst: function (arr, predicate, ctx) {
        var result = null;
        if(Array.isArray(arr)){
            arr.some((el, i) => {
                return predicate.call(ctx, el, i, arr) ? ((result = el), true) : false;
            });
        }
        return result;
    }
}

export default utils;