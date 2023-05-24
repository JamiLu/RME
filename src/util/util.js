/**
 * General Utility methods.
 */
class Util {
    /**
     * Checks is a given value empty.
     * @param {*} value
     * @returns True if the give value is null, undefined, an empty string or an array and lenght of the array is 0.
     */
    static isEmpty(value) {
        return (value === null || value === undefined)
            || (Util.isString(value) && value === "")
            || (Util.isObject(value) && Object.keys(value).length === 0)
            || (Util.isArray(value) && value.length === 0);
    }

    /**
     * Checks is the given value not empty. This function is a negation to the Util.isEmpty function.
     * @param {*} value 
     * @returns True if the value is not empty otherwise false.
     */
    static notEmpty(value) {
        return !Util.isEmpty(value)
    }

    /**
     * Get the type of the given value.
     * @param {*} value
     * @returns The type of the given value.
     */
    static getType(value) {
        return typeof value;
    }

    /**
     * Checks is a given value is a given type.
     * @param {*} value
     * @param {string} type
     * @returns True if the given value is the given type otherwise false.
     */
    static isType(value, type) {
        return (Util.getType(value) === type);
    }

    /**
     * Checks is a given parameter a function.
     * @param {*} func 
     * @returns True if the given parameter is fuction otherwise false.
     */
    static isFunction(func) {
        return Util.isType(func, "function");
    }

    /**
     * Checks is a given parameter a boolean.
     * @param {*} boolean
     * @returns True if the given parameter is boolean otherwise false.
     */
    static isBoolean(boolean) {
        return Util.isType(boolean, "boolean");
    }

    /**
     * Checks is a given parameter a string.
     * @param {*} string
     * @returns True if the given parameter is string otherwise false.
     */
    static isString(string) {
        return Util.isType(string, "string");
    }

    /**
     * Checks is a given parameter a number.
     * @param {*} number
     * @returns True if the given parameter is number otherwise false.
     */
    static isNumber(number) {
        return Util.isType(number, "number");
    }

    /**
     * Checks is a given parameter a symbol.
     * @param {*} symbol
     * @returns True if the given parameter is symbol otherwise false.
     */
    static isSymbol(symbol) {
        return Util.isType(symbol, "symbol");
    }

    /**
     * Checks is a given parameter a object.
     * @param {*} object
     * @returns True if the given parameter is object otherwise false.
     */
    static isObject(object) {
        return Util.isType(object, "object");
    }

    /**
     * Checks is a given parameter an array.
     * @param {*} array
     * @returns True if the given parameter is array otherwise false.
     */
    static isArray(array) {
        return Array.isArray(array);
    }
}

export default Util;
