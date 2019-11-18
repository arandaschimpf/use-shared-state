"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
function setValue(setter, previous) {
    if (typeof setter === 'function') {
        return setter(previous);
    }
    else {
        return setter;
    }
}
function createSharedState(initialValue) {
    var value = setValue(initialValue);
    var listeners = new Set();
    return function useSharedState() {
        var memoizedSetState = react_1.useCallback(function setState(newValue) {
            value = setValue(newValue, value);
            listeners.forEach(function (listener) { return listener(value); });
        }, [listeners]);
        var _a = __read(react_1.useState(value), 2), setLocalState = _a[1];
        listeners.add(setLocalState);
        react_1.useEffect(function () { return function () {
            listeners.delete(setLocalState);
        }; }, [setLocalState]);
        return [value, memoizedSetState];
    };
}
exports.default = createSharedState;
