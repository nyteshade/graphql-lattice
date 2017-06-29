/** @namespace types */
// @flow

/**
 * One common way to determine the type of class that you are working with, 
 * in a fairly compatible manner, is to use .call or .apply on the function 
 * toString of the Object.prototype.
 *
 * Calling `Object.prototype.toString.call('hello')` will yield 
 * `"[object String]"` as an answer. This technique is fairly sound but is 
 * also fairly verbose to use often. This function extracts the detected value 
 * name from the above string; so "String" from "[object String]" and so forth. 
 *
 * The added advantage of using this method is that it works well with direct 
 * name comparisons, such as `typeOf("asdfas") === String.name`. The new 
 * `Symbol.toStringTag` allows you to define custom values that are 
 * reflected in this manner.
 * 
 * @method ⌾⠀typeOf
 * @memberof types
 * @inner
 * 
 * @param {any} object any value is acceptable here, including null and 
 * undefined
 * @return {string} for objects of type [object String] the value "String"
 * will be returned.
 */
export function typeOf(object: any): string { 
  return /(\b\w+\b)\]/.exec(Object.prototype.toString.call(object))[1];
}

/**
 * Returns true if the type supplied evaluates to `[object Function]`
 * 
 * @method ⌾⠀isFunction 
 * @memberof types
 * @inner
 * 
 * @param {any} obj any object that can be passed to Object.prototype.toString
 * @return {Boolean} true if it passes the test, false otherwise
 */
export const isFunction = (obj) => typeOf(obj) === Function.name

/**
 * Returns true if the type supplied evaluates to `[object Array]`
 * 
 * @method ⌾⠀isArray 
 * @memberof types
 * @inner
 * 
 * @param {any} obj any object that can be passed to Object.prototype.toString
 * @return {Boolean} true if it passes the test, false otherwise
 */
export const isArray = (obj) => typeOf(obj) === Array.name

/**
 * Returns true if the type supplied evaluates to `[object Date]`
 * 
 * @method ⌾⠀isDate 
 * @memberof types
 * @inner
 * 
 * @param {any} obj any object that can be passed to Object.prototype.toString
 * @return {Boolean} true if it passes the test, false otherwise
 */
export const isDate = (obj) => typeOf(obj) === Date.name

/**
 * Returns true if the type supplied evaluates to `[object Object]`
 * 
 * @method ⌾⠀isObject 
 * @memberof types
 * @inner
 * 
 * @param {any} obj any object that can be passed to Object.prototype.toString
 * @return {Boolean} true if it passes the test, false otherwise
 */
export const isObject = (obj) => typeOf(obj) === Object.name

/**
 * Returns true if the type supplied evaluates to `[object String]`
 * 
 * @method ⌾⠀isString 
 * @memberof types
 * @inner
 * 
 * @param {any} obj any object that can be passed to Object.prototype.toString
 * @return {Boolean} true if it passes the test, false otherwise
 */
export const isString = (obj) => typeOf(obj) === String.name

/**
 * Returns true if the type supplied evaluates to `[object Number]`
 * 
 * @method ⌾⠀isNumber 
 * @memberof types
 * @inner
 * 
 * @param {any} obj any object that can be passed to Object.prototype.toString
 * @return {Boolean} true if it passes the test, false otherwise
 */
export const isNumber = (obj) => typeOf(obj) === isNumber.name

/**
 * Returns true if the type supplied evaluates to `[object RegExp]`
 * 
 * @method ⌾⠀isRegExp 
 * @memberof types
 * @inner
 * 
 * @param {any} obj any object that can be passed to Object.prototype.toString
 * @return {Boolean} true if it passes the test, false otherwise
 */
export const isRegExp = (obj) => typeOf(obj) === RegExp.name

/**
 * Returns true if the type supplied evaluates to `[object Null]`
 * 
 * @method ⌾⠀isNull 
 * @memberof types
 * @inner
 * 
 * @param {any} obj any object that can be passed to Object.prototype.toString
 * @return {Boolean} true if it passes the test, false otherwise
 */
export const isNull = (obj) => typeOf(obj) === NULL

/**
 * Returns true if the type supplied evaluates to `[object Undefined]`
 * 
 * @method ⌾⠀isUndefined 
 * @memberof types
 * @inner
 * 
 * @param {any} obj any object that can be passed to Object.prototype.toString
 * @return {Boolean} true if it passes the test, false otherwise
 */
export const isUndefined = (obj) => typeOf(obj) === UNDEFINED

/**
 * Returns true if the type supplied evaluates to neither `[object Object]`
 * nor `[object Array]`. 
 * 
 * @method ⌾⠀isValue 
 * @memberof types
 * @inner
 * 
 * @param {any} obj any object that can be passed to Object.prototype.toString
 * @return {Boolean} true if it passes the test, false otherwise
 */
export const isValue = (obj) => !isObject(obj) && !isArray(obj)

/**
 * A shorthand way to test an object's declared toString type to a supplied 
 * string or Function/Class. Realistically, this checks typeOf(obj) to both 
 * T and T.name. If either are true, then true is returned; false otherwise.
 * 
 * @method ⌾⠀isOfType 
 * @memberof types
 * @inner
 * 
 * @param {any} obj any object that can be passed to Object.prototype.toString
 * @return {Boolean} true if it passes the test, false otherwise
 */
export const isOfType = (obj, T) => typeOf(obj) === T || typeOf(obj) === T.name

/**
 * Returns true if the supplied obj is a ECMAScript class definition. It first 
 * checks by examining the properties of the supplied class. Secondly it checks 
 * by searching the toString() method of the 'function' for the term class. If 
 * either are true, then true is returned; false is returned otherwise.
 *
 * NOTE Relying on this strictly, especially when used with other libraries
 * can cause some problems down the line, especially if the code wraps a class 
 * instance like react-jss or other similar use cases. Use at your own peril.
 *
 * @method ⌾⠀isClass
 * @memberof types
 * @inner
 *
 * @param {mixed} obj any object who's type is to be compared as a class
 * @return {boolean} true if the obj is an ECMAScript class object; not an 
 * instance. False otherwise. 
 *
 * @see #isNativeClassByProps
 * @see #isNativeClassByString
 */
export const isClass = (obj) => (
  isNativeClassByProps(obj) || 
  isNativeClassByString(obj))
   
/**
 * isNativeClass method taken from code submitted on stackoverflow. Logic and 
 * basis for the test appears there. See URL below for follow up if desired.
 *
 * @see  https://stackoverflow.com/questions/29093396/how-do-you-check-the-difference-between-an-ecmascript-6-class-and-function#32235645
 * 
 * @method ⌾⠀isNativeClassByProps
 * @memberof types
 * @inner
 * 
 * @param {mixed} thing any type of JavaScript value to test
 * @return {boolean} true if it is a ECMAScript class by testing properties;
 * false otherwise
 */
export function isNativeClassByProps(thing: mixed): boolean {
  return (
    typeof thing === 'function' 
    && thing.hasOwnProperty('prototype') 
    && !thing.hasOwnProperty('arguments'))
}

/**
 * isNativeClass method taken from code submitted on stackoverflow. Logic and 
 * basis for the test appears there. See URL below for follow up if desired.
 *
 * @see  https://stackoverflow.com/questions/29093396/how-do-you-check-the-difference-between-an-ecmascript-6-class-and-function#32235645
 * 
 * @method ⌾⠀isNativeClassByString
 * @memberof types
 * @inner
 * 
 * @param {mixed} thing any type of JavaScript value to test
 * @return {Boolean} true if it is a ECMAScript class by testing properties;
 * false otherwise
 */
export function isNativeClassByString(value: mixed):boolean {
  return (
    typeof value === 'function' 
    && value.toString().indexOf('class') === 0)
}

/**
 * NOTE This function will not work on nodejs versions less than 6 as Reflect 
 * is needed natively.
 * 
 * The instanceof keyword only works on instances of an object and not on 
 * the class objects the instances are created from.
 *
 * ```js
 * class A {}
 * class B extends A {}
 *
 * let a = new A();
 * let b = new B();
 *
 * b instanceof A; // true
 * a instanceof A; // true
 * B instanceof A; // false
 * ```
 *
 * Therefore the extendsFrom function checks this relationship at the class 
 * level and not at the instance level.
 *
 * ```js
 * import { extendsFrom } from '...'
 * 
 * class A {}
 * class B extends A {}
 * class C extends B {}
 *
 * extendsFrom(A, A); // true
 * extendsFrom(B, A); // true
 * extendsFrom(C, A); // true
 * extendsFrom(C, 1); // false
 * extendsFrom(B, null); // false
 * ```
 * 
 * @method ⌾⠀extendsFrom
 * @memberof types
 * @inner
 * 
 * @param {Function} TestedClass the class of which to test heredity 
 * @param {Function} RootClass the ancestor to test for
 * @param {Boolean} enforceClasses if true, false by default, an additional 
 * runtime check for the type of the supplied Class objects will be made. If 
 * either is not a Function, an error is thrown. 
 * @return {Boolean} true if the lineage exists; false otherwise 
 *
 * @see types#isClass 
 */
export function extendsFrom(
 TestedClass: Function, 
 RootClass: Function,
 enforceClasses: boolean = false
): boolean {
  if (parseInt(process.version.substring(1)) < 6) {
    throw new Error(`
      Reflect must be implemented in the JavaScript engine. This cannot be
      polyfilled and as such, if process.version is less than 6 an error will
      be thrown. Please try an alternate means of doing what you desire.
    `);
  }
  
  if (enforceClasses) {
    if (!isClass(TestedClass) && !isClass(RootClass)) {
      throw new Error(`
        When using extendsFrom() with enforceClasses true, each Function 
        argument supplied must pass the isClass() method testing. See the 
        function isClass to learn more about these requirements.
      `);
    }
  }
    
  if (!TestedClass || !RootClass) { return false; }
  
  let proto = TestedClass;
  
  while (true) {
    try {
      if (proto === RootClass) return true;
      if (proto === Function) break;      
      proto = Reflect.getPrototypeOf(proto);
    }
    catch (ignore) {
      return false;
    }
  }
  
  return false;
}

/**
 * Programmatic constant defintion of the result of a call to 
 * `typeOf(undefined)`.
 *
 * @memberof types
 * @type {string}
 * @const 
 */
export const UNDEFINED: string = typeOf(undefined);

/**
 * Programmatic constant defintion of the result of a call to 
 * `typeOf(null)`.
 *
 * @memberof types
 * @type {string}
 * @const 
 */
export const NULL: string = typeOf(null);