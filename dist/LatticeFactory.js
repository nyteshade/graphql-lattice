"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getChecklist = getChecklist;
exports.setChecklist = setChecklist;
exports.hasChecklist = hasChecklist;
exports.newChecklist = newChecklist;
exports.isFactoryClass = exports.LatticeFactory = exports.ValidationResults = exports.CHECK_API_DOCS = exports.CHECK_RESOLVERS = exports.CHECK_SCHEMA = exports.CHECKLIST = void 0;

require("core-js/modules/es7.symbol.async-iterator");

var _GQLBase = require("./GQLBase");

var _GQLEnum = require("./GQLEnum");

var _GQLInterface = require("./GQLInterface");

var _GQLScalar = require("./GQLScalar");

var _SyntaxTree = require("./SyntaxTree");

var _neTagFns = require("ne-tag-fns");

var _neTypes = require("ne-types");

var _util = require("util");

var _Resolvers = require("./decorators/Resolvers");

var _ModelProperties = require("./decorators/ModelProperties");

var _utils = require("./utils");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const _i = (...args) => (0, _util.inspect)(...args, {
  colors: true,
  depth: 3
});
/**
 * The CHECKLIST Symbol is used as a storage key in the metadata staging
 * area for each of the GQLBase extended classes. In the LatticeFactory
 * it is used to determine where in the flow of construction the class
 * currently is.
 *
 * @type {Symbol}
 */


const CHECKLIST = Symbol.for('checklist');
/**
 * The CHECK_SCHEMA Symbol is part of the CHECKLIST for a constructed
 * GQLBase extended class. It denotes that the class has had its SCHEMA
 * getter defined.
 *
 * @type {Symbol}
 */

exports.CHECKLIST = CHECKLIST;
const CHECK_SCHEMA = Symbol.for('checklist-schema');
/**
 * The CHECK_RESOLVERS Symbol is part of the CHECKLIST for a constructed
 * GQLBase extended class. It denotes that the class has had its instance
 * field resolvers as well as its static Query, Mutation and Subscription
 * resolvers injected and defined.
 *
 * @type {Symbol}
 */

exports.CHECK_SCHEMA = CHECK_SCHEMA;
const CHECK_RESOLVERS = Symbol.for('checklist-resolvers');
/**
 * The CHECK_API_DOCS Symbol is part of the CHECKLIST for a constructed
 * GQLBase extended class. It denotes that the class has had its api docs
 * defined, processed and setup on the class in a way that it will be
 * picked up in the build lifecycle.
 *
 * @type {Symbol}
 */

exports.CHECK_RESOLVERS = CHECK_RESOLVERS;
const CHECK_API_DOCS = Symbol.for('checklist-api-docs');
/**
 * Peeks into the metadata storage area of a given GQLBase extended
 * class and fetches the factory checklist if one exists.
 *
 * @param {Function} Class a reference to the GQLBase class to peek in
 * @return {Object} an object setup with at least three booleans keyed by
 * the constants CHECK_SCHEMA, CHECK_RESOLVERS, and CHECK_API_DOCS or null
 * if none exists
 */

exports.CHECK_API_DOCS = CHECK_API_DOCS;

function getChecklist(Class) {
  return Class && Class[_GQLBase.META_KEY] && Class[_GQLBase.META_KEY][CHECKLIST] || null;
}
/**
 * Obtains the checklist from the supplied GQLBase extended class. If the
 * class has a checklist, its checklist item is set to true or the boolean
 * value specified.
 *
 * @param {Function} Class a reference to the GQLBase class to set
 * @param {Symbol} item one of CHECK_SCHEMA, CHECK_RESOLVERS, or
 * CHECK_API_DOCS
 * @param {Boolean} value the value for the checklist item to set
 */


function setChecklist(Class, item, value = true) {
  let checklist = getChecklist(Class);

  if (checklist) {
    // $FlowFixMe
    checklist[item] = value;
  }
}
/**
 * This function, when invoked with only a class will return true if the
 * Class has a defined checklist. If one ore more CHECKLIST symbols are
 * passed, the function will only return true if all the supplied symbols
 * are set to truthy values.
 *
 * @param {Function} Class a reference to the GQLBase class to set
 * @param {Array<Symbol>} items any of CHECK_SCHEMA, CHECK_RESOLVERS, or
 * CHECK_API_DOCS
 * @return {Boolean} true if the checklist and/or all items are true and
 * present.
 */


function hasChecklist(Class, ...items) {
  let checklist = getChecklist(Class);

  if (checklist && items.length) {
    for (let item of items) {
      if (!checklist[item]) {
        return false;
      }
    }

    return true;
  }

  return checklist;
}
/**
 * Injects and creates a new CHECKLIST object on the supplied GQLBase
 * extended class. All items are installed and set to false.
 *
 * @param {Function} Class a reference to the GQLBase class to set
 */


function newChecklist(Class) {
  if (Class) {
    // $FlowFixMe
    Class[_GQLBase.META_KEY][CHECKLIST] = {
      [CHECK_SCHEMA]: false,
      [CHECK_RESOLVERS]: false,
      [CHECK_API_DOCS]: false,

      get keys() {
        return [CHECK_SCHEMA, CHECK_RESOLVERS, CHECK_API_DOCS];
      },

      get complete() {
        return this.keys.reduce((p, c, i, a) => {
          if (!p || !this[c]) {
            return false;
          }
        }, true);
      }

    };
  } else {
    throw new Error((0, _neTagFns.customDedent)({
      dropLowest: true
    })`
      Cannot create new checklist metadata on a non-existent class
    `);
  }
}

var _Symbol$toStringTag = Symbol.toStringTag;
var _Symbol$toStringTag2 = Symbol.toStringTag;

class ValidationResults {
  constructor(errors = []) {
    _defineProperty(this, "errors", void 0);

    this.errors = errors;
  }

  get valid() {
    return this.errors.length === 0;
  } // $FlowFixMe


  get [_Symbol$toStringTag]() {
    return this.constructor.name;
  } // $FlowFixMe


  static get [_Symbol$toStringTag2]() {
    return this.name;
  }

}

exports.ValidationResults = ValidationResults;

class LatticeFactory {
  /**
   * Walks through a supplied template object and collects errors with its
   * format before bubbling up an exception if any part of it fails to
   * pass muster. The exception can be prevented from throwing if hide is set
   * to true
   *
   * @param {Object} template an object to be parsed for construction via the
   * Lattice Factory
   * @param {boolean} hide if true, an invalid template will NOT throw errors
   * @return {ValidationResults} a `ValidationResults` object containing the
   * collected errors and a `valid` that is dynamically calculated.
   */
  static validateTemplate(template, hide = false) {
    let results = new ValidationResults();

    let indent = (string, count = 4, space = ' ') => string.split('\n').map(s => s.trim().replace(/(^)/gm, `$1${space.repeat(count)}`)).join('\n');

    if (typeof template.name === 'undefined') {
      results.errors.push(new Error((0, _neTagFns.customDedent)({
        dropLowest: true
      })`
        The \`template.name\` field must exist or the creation for the Lattice
        factory class generation to succeed.

        Please read the documentation for more information on the format of
        a LatticeFactory template.
      `));
    }

    if (!(0, _neTypes.extendsFrom)(template.name, String)) {
      results.errors.push(new Error((0, _neTagFns.customDedent)({
        dropLowest: true
      })`
        The \`template.name\` field must be a string.

        Please read the documentation for more information on the format of
        a LatticeFactory template.
      `));
    }

    if (typeof template.schema === 'undefined') {
      results.errors.push(new Error((0, _neTagFns.customDedent)({
        dropLowest: true
      })`
        The \`template.schema\` field must exist or the creation for the
        Lattice factory class generation to succeed.

        Please read the documentation for more information on the format of
        a LatticeFactory template.
      `));
    }

    if (!(0, _neTypes.extendsFrom)(template.schema, String)) {
      results.errors.push(new Error((0, _neTagFns.customDedent)({
        dropLowest: true
      })`
        The \`template.schema\` field must be a string of GraphQL SDL/IDL

        Please read the documentation for more information on the format of
        a LatticeFactory template.
      `));
    }

    if (!(0, _neTypes.extendsFrom)(template.resolvers, Object) // Supports 95% of objects
    || typeof template.resolvers !== 'object' // Supports Object.create(null)
    ) {
        results.errors.push(new Error((0, _neTagFns.customDedent)({
          dropLowest: true
        })`\x1b[91;1m
        The \`template.resolvers\` field must be an Object containing the
        resolver functions. Query, Mutation and Subscription resolvers will
        take the following signature. Additionally, the keys for these special
        resolvers must be Query, Mutation or Subscription; respectively
        \x1b[37;22m
          Query: { [resolver]: (requestData, resolverParameters) => {} }
          Mutation: { [resolver]: (requestData, resolverParameters) => {} }
          Subscription: { [resolver]: (requestData, resolverParameters) => {} }

          where:
            \`requestData\` is an object with { req, res, gql|next } depending
              on the graphql server implementation (FB Reference, Apollo, etc)
            \`resovlerParameters\` is an object with keys matching those
              parameters defined in the SCHEMA for the resolver in question.
        \x1b[91;1m
        Field resolvers should be found under the key name of the type
        or interface in question and must correspond to the following signature
        \x1b[37;22m
          [Type]: { [resolver]: (resolverParameters) => {} }

          where:
            \`Type\` is the name of the GQL type defined in the schema
            \`resovlerParameters\` is an object with keys matching those
              parameters defined in the SCHEMA for the resolver in question.

          * it is worth noting that the field resolvers are not static and
            can access the \`requestData\` object via \`this.requestData\`
        \x1b[91;1m
        Please read the documentation for more information on the format of
        a LatticeFactory template.\x1b[0m
      `));
      }

    if (typeof template.docs === 'undefined') {
      results.errors.push(new Error((0, _neTagFns.customDedent)({
        dropLowest: true
      })`
        The \`template.docs\` field must exist for the creation of the
        Lattice factory class generation to succeed.

        Please read the documentation for more information on the format of
        a LatticeFactory template.
      `));
    }

    if (!(0, _neTypes.extendsFrom)(template.docs, Object) // Supports 95% of objects
    || typeof template.docs !== 'object' // Supports Object.create(null)
    ) {
        let dr = '\x1b[31m',
            br = '\x1b[91m';
        let b1 = '\x1b[1m',
            b0 = '\x1b[22m';
        let bb = '\x1b[90m';
        let dg = '\x1b[37m',
            bg = '\x1b[97m';
        let a0 = '\x1b[0m';
        let gr = '\x1b[32m',
            bgr = '\x1b[92m';
        results.errors.push(new Error((0, _neTagFns.customDedent)({
          dropLowest: true
        })`\x1b[1;91m
        The \`template.docs\` field must be an object containing keys and
        value pairs matching the types, enums, unions and interfaces defined
        in your schema.

        The special Symbol object TYPE can be used to reference the docs for
        the named or keyed field describing the documentation to be processed
        Comments for the \`Query\`, \`Mutation\`, and \`Subscription\` [TYPE]
        entries will replace any previous one that comes before it. Typically
        this field is best left undescribed since there will ever only be
        one of each at most.

        \x1b[22;31mExamples should look something like this:\x1b[22;37m
          import { TYPE, joinLines } from 'graphql-lattice'

          export default {
            ${bb}/* other fields */${dg}

            ${b1}schema:${b0} joinLines${gr}\`
              type Person { id: ID name: String }
              type Query { findPerson(id: ID): Person }
              type Mutation { setPersonName(id: ID, name: String): Person }
            \`${dg},

            ${b1}docs:${b0} {
              ${b1}Person:${b0} {
                [TYPE]: ${gr}'A contrived person type'${dg},
                id: ${gr}'A unique identifier for a person'${dg},
                name: ${gr}'A string denoting the name of a person'${dg}
              },
              ${b1}Query:${b0} {
                findPerson: ${gr}'A query taking an ID, returns a Person'${dg},
              },
              ${b1}Mutation:${b0} {
                setPersonName: joinLines${gr}\`
                  A mutation that sets the name of the user identified by an
                  ID to the new name value supplied
                \`${dg}
              }
            }
          }
        \x1b[22;31m
        Note the usage of \`Person\`, \`Query\` and \`Mutation\` explicitly
        as keys to the supplied \`docs\` object.\x1b[0m
      `));
      }

    if (!results.valid) {
      let errorStrings = [];

      for (let error of results.errors) {
        let {
          message,
          stack
        } = error;
        stack = stack.trim().split('\n').splice(message.split('\n').length).map(s => s.trim()).join('\n');
        message = message.replace(/(Error:\s)/, '$1\n').trim();
        errorStrings.push(`\x1b[31;1m${message}\x1b[0m\n` + indent(stack));
      }

      let error = new Error((0, _neTagFns.customDedent)({
        dropLowest: true
      })`
        OOPS!

        An error occurred validating your factory template. The object
        in question is as follows:

        @template

        The individual errors that occurred are:
        \n@errors`.replace(/@template/, indent(_i(template))).replace(/@errors/, errorStrings.join('\n\n')));
      error.stack = error.message;
      error.message = '';
      if (!hide) throw error;
    }

    return results;
  }
  /**
   * The starting point of a LatticeFactory object -> class creation. The name
   * of the class and baseClass to use are provided and are created from there.
   * At this point, the generated class is still incomplete. It must complete
   * the entire checklist before being deemed valid.
   *
   * @param {string} name name of the class to create
   * @param {Function} baseClass the Lattice class your new class should extend;
   * while this can be anything, it should be GQLBase, GQLInterface, GQLEnum or
   * GQLUnion. This defaults to GQLBase should nothing be supplied
   * @return {Function} actually this returns the generated class
   */


  static generateClass(name, baseClass = _GQLBase.GQLBase) {
    if (!name) {
      throw new Error('LatticeFactory.generateClass needs a name!!');
    } // Alright ladies and gentlemen, hold onto your hats; we're entering the
    // meta zone!!! The way the following works is to make sure that our
    // passed in base class `baseClass` is actually in scope as the name of
    // the value it represents. We use the `new Function()` syntax to do that
    // but we do it via eval since we don't know the name of the function
    // at the time we write the code
    //
    // So given a class name of "Car" and baseName equalling GQLBase, the Class
    // instance, fn would look something like the results of calling this
    //
    // let fn = new Function(
    //   "GQLBase",
    //   "class Car extends GQLBase {}; return Car;"
    // )
    //
    // Which in turn sets fn to something that would be the same as
    //
    // function fn(GQLBase) { class Car extends GQLBase {}; return Car }
    //
    // Which means that when we invoke fn(baseClass), which is fn(GQLBase),
    // we get the results we intend; even if GQLBase is not necessarily in
    // the scope of the function at the time of call. Neat. Scary. OMG Thanks
    // for code comments. You're welcome future me.


    let fn = eval(`(new Function(
      "${baseClass.name}",
      "class ${name} extends ${baseClass.name} {}; return ${name};"
    ))`);
    let Class = fn(baseClass);
    this.brandClass(Class);
    newChecklist(Class);
    return Class;
  }
  /**
   * Injects the SCHEMA property into the newly defined class. The supplied
   * `schema` string becomes what the new class returns when `.SCHEMA` is
   * gotten.
   *
   * @param {Function} Class this will throw an error if the class is not one
   * generated by the LatticeFactory or if the class itself is null or undefined
   * @param {string} schema the string that the new class should return
   * @return {Function} returns the modified Class with the `CHECK_SCHEMA`
   * portion ticked off internally.
   */


  static injectSchema(Class, schema) {
    if (!Class || !hasChecklist(Class)) {
      throw new Error((0, _neTagFns.customDedent)({
        dropLowest: true
      })`
        Either the supplied schema string is invalid
          SCHEMA: \`
            ${schema}
          \`

        Or your supplied class ${Class && Class.name || 'undefined'} is
        non-existent. Please check your code and try the LatticeFactory
        again.
      `);
    } // $FlowFixMe


    Object.defineProperty(Class, 'SCHEMA', {
      get() {
        return schema;
      }

    });
    setChecklist(Class, CHECK_SCHEMA);
    return Class;
  }
  /**
   * Injects the resolvers into appropriate areas. Resolvers keyed by `Query`,
   * `Mutation`, or `Subscription` will be placed into the appropriate area
   * in `Class[META_KEY]` which acts as a staging area originally designed for
   * use with the @resolver, @mutator and @subscriptor decorators. These will
   * be bound in a typical fashion as is done with the decorators making the
   * first parameter becoming the requestData of the object instance and the
   * second being the object containing the parameters for the resolver as
   * passed in by GraphQL. Subsequent parameters will be supplied as is the
   * fashion of the system you're using; Facebook's reference implementation or
   * Apollo or something else.
   *
   * Resolvers keyed by type name are considered to be field resolvers and
   * have a different signature. They can be properties of the key, in
   * which case they will simply be installed as getters. Or they can be
   * functions; synchronous or asynchronous. Function field resolvers are
   * instance methods and can make use of `this.getModel()` or
   * `this.requestData` internally.
   *
   * @param {Function} Class the class, generated by generateClass() lest an
   * error be thrown, to which to add the resolvers from a template
   * @param {Object} resolverObj an object containing the resolvers as dictated
   * by the new format.
   * @return {Function} returns the modified Class with the `CHECK_RESOLVERS`
   * portion ticked off internally.
   */


  static injectResolvers(Class, resolvers) {
    if (!hasChecklist(Class, CHECK_SCHEMA)) {
      throw new Error((0, _neTagFns.customDedent)({
        dropLowest: true
      })`
        \`injectResolvers\` cannot be called on a class without a SCHEMA.
        Please verify your progress in the process and try again.
      `);
    }

    let tree = _SyntaxTree.SyntaxTree.from(Class.SCHEMA);

    let outline = tree ? tree.outline : {};

    if (Class.name in outline && Class.name in resolvers) {
      let fields = Object.keys(outline[Class.name]);

      for (let fieldResolver of fields) {
        if (!fieldResolver in resolvers[Class.name]) {
          _utils.LatticeLogs.warn((0, _neTagFns.customDedent)({
            dropLowest: true
          })`
            ${fieldResolver} not supplied in resolvers for ${Class.name}
          `);

          continue;
        }

        let prop = resolvers[Class.name][fieldResolver];

        if (prop && typeof prop === 'function') {
          _utils.LatticeLogs.info('Injecting [fn] %s', fieldResolver);

          Object.defineProperty(Class.prototype, fieldResolver, {
            value: prop
          });
        } else {
          _utils.LatticeLogs.info('Injecting [prop] %s', fieldResolver);

          (0, _ModelProperties.Properties)(fieldResolver)(Class, ['factory-props']);
        }
      }
    }

    for (let [type, decorator] of [['Query', _Resolvers.resolver], ['Mutation', _Resolvers.mutator], ['Subscription', _Resolvers.subscriptor]]) {
      let keys = Object.keys(outline[type] || {}); // $FlowFixMe

      if (!type in outline || !keys.length) {
        continue;
      }

      for (let fnName of keys) {
        let fn = resolvers[fnName];
        decorator(Class, fnName, {
          value: fn
        });

        _utils.LatticeLogs.info('Adding %s resolver [%s]', type, fnName);
      }
    }

    setChecklist(Class, CHECK_RESOLVERS);
    return Class;
  }

  static injectDocs(Class, docs) {
    if (!hasChecklist(Class, CHECK_SCHEMA, CHECK_RESOLVERS)) {
      throw new Error((0, _neTagFns.customDedent)({
        dropLowest: true
      })`
        \`injectDocs\` cannot be called on a class without a SCHEMA or
        RESOLVERS defined. Please verify your progress in the process and try
        again.
      `);
    }

    let copyProp = (o, prop, to, as) => {
      // $FlowFixMe
      let prototype = o.prototype || Object.getPrototypeOf(o);
      let descriptor = Object.getOwnPropertyDescriptor(prototype, prop);

      if (!as) {
        as = prop;
      }

      if (descriptor) {
        Object.defineProperty(to, as, descriptor);
      } else {
        // $FlowFixMe
        to[as] = o[prop];
      }
    }; // Create an object our future `static apiDocs()` method of our factory
    // generated class will return


    let result = {}; // Setup the constants we will need in this conversion

    const {
      TYPE
    } = this;
    const {
      DOC_CLASS,
      DOC_FIELDS,
      DOC_QUERY,
      DOC_MUTATION,
      DOC_SUBSCRIPTION,
      DOC_QUERIES,
      DOC_MUTATIONS,
      DOC_SUBSCRIPTIONS
    } = _GQLBase.GQLBase; // This part might get a little meta, so I have provided comments. You are
    // welcome future me. I hope it helps. This gnarly block should cover all
    // the descriptions for Query, Mutation, Subscription and the Class we
    // are creating. Other superfluous

    for (let [Type, TopLevelConstant, FieldConstants] of [['Query', DOC_QUERY, DOC_QUERIES], ['Mutation', DOC_MUTATION, DOC_MUTATIONS], ['Subscription', DOC_SUBSCRIPTION, DOC_SUBSCRIPTIONS], [Class.name, DOC_CLASS, DOC_FIELDS]]) {
      // One of 'Query', 'Mutation', or 'Subscription'
      if (docs[Type]) {
        // If a top level description is present (i.e. Query, Mutation or
        // Subscription description)
        if (docs[Type][TYPE]) {
          copyProp(docs[Type], TYPE, result, TopLevelConstant);
        } // Fetch the properties from the supplied docs object; TYPE Symbols
        // do not show up in a call to entries which is why it is handled above
        // $FlowFixMe


        let entries = Object.entries(docs[Type]); // If we have entries to document, create an object to hold those
        // values; i.e. if we have `{ Query: { getPeople: 'desc' } }`, we need
        // to make sure we have `{ [DOC_QUERIES]: { getPeople: 'desc' } }` in
        // our result. The object holding getPeople in the end there is defined
        // below when we have something to copy.

        if (entries.length) {
          result[FieldConstants] = {};
        } // For each name value pair defined above, copy its descriptor or base
        // value if a descriptor isn't available


        for (let [prop, value] of entries) {
          copyProp(docs[Type], prop, result[FieldConstants]);
        }
      }
    }

    Object.defineProperty(Class, 'apiDocs', {
      value: function () {
        return result;
      }
    });
    setChecklist(Class, CHECK_API_DOCS);
    return Class;
  }

  static build(template) {
    let validationResults = this.validateTemplate(template);
    let Class = this.generateClass(template.name, template.type || _GQLBase.GQLBase);

    if (!Class) {
      throw new Error((0, _neTagFns.customDedent)({
        dropLowest: true
      })`
        LatticeFactory was unable to build your Class from the name and types
        supplied in your template. You provided the following template. Please
        look it over and correct any errors before trying again.

        \x1b[1mTemplate\x1b[0m
          ${_i(template)}
      `);
    }

    this.injectSchema(Class, template.schema);
    this.injectResolvers(Class, template.resolvers || {});
    this.injectDocs(Class, template.docs || {}); // Need to fix how auto-props work; for now create one instance...

    new Class({});

    if (!hasChecklist(Class, CHECK_SCHEMA, CHECK_RESOLVERS, CHECK_API_DOCS)) {
      let _schema = hasChecklist(Class, CHECK_SCHEMA) ? '✅' : '❌';

      let _resolvers = hasChecklist(Class, CHECK_RESOLVERS) ? '✅' : '❌';

      let _apiDocs = hasChecklist(Class, CHECK_API_DOCS) ? '✅' : '❌';

      throw new Error((0, _neTagFns.customDedent)({
        dropLowest: true
      })`
        Something went wrong in the process of building the class called
        ${Class && Class.name || template && template.name || 'Unknown!'},
        please check the supplied template for errors.

        [ ${_schema} ] Has a SCHEMA defined
        [ ${_resolvers} ] Has defined RESOLVERS matching the SCHEMA
        [ ${_apiDocs} ] Has defined API Docs matching the SCHEMA

        \x1b[1mTemplate\x1b[0m
        ${_i(template)}

        \x1b[1mClass\x1b[0m
        ${_i(Class)}
      `);
    }

    return Class;
  }
  /**
   * A static helper method to consistently tag, or brand, classes with a
   * symbol that denotes they were created using the LatticeFactory process.
   * This is done by setting a `Symbol` on the root of the class or in the
   * `[META_KEY]` object for classes extending `GQLBase`.
   *
   * @method ⌾⠀brandClass
   * @memberof LatticeFactory
   * @static
   *
   * @param {Function} Class the class to brand with the `FACTORY_CLASS` symbol
   * @return {Function} returns the Class value passed in
   */


  static brandClass(Class) {
    if (Class) {
      if ((0, _neTypes.extendsFrom)(Class, _GQLBase.GQLBase)) {
        Class[_GQLBase.META_KEY][this.FACTORY_CLASS] = true;
      } else {
        Class[this.FACTORY_CLASS] = true;
      }
    }

    return Class;
  }
  /**
   * A static helper to check and see if the supplied class or function was
   * branded with the `brandClass()` function. This amounts to storing the
   * boolean true under the property `Class[LatticeFactory.FACTORY_CLASS]` or
   * `Class[META_KEY][LatticeFacatory.FACTORY_CLASS]` for `GQLBase` extended
   * classes.
   *
   * @method ⌾⠀isFactoryClass
   * @memberof LatticeFactory
   * @static
   *
   * @param {Function} Class the class to check for `FACTORY_CLASS` branding
   * @return {boolean} true if the brand exists, false otherwise
   */


  static isFactoryClass(Class) {
    if (Class) {
      return (0, _neTypes.extendsFrom)(Class, _GQLBase.GQLBase) ? !!Class[_GQLBase.META_KEY][this.FACTORY_CLASS] : !!Class[this.FACTORY_CLASS];
    }

    return false;
  }
  /**
   * A static helper method to consistently remove any previous tag or brand
   * applied with `brandClass`, this is done by removing a previously set
   * `Symbol` on the root of the class or in the `[META_KEY]` object for
   * classes extending `GQLBase`.
   *
   * @method ⌾⠀removeClassBrand
   * @memberof LatticeFactory
   * @static
   *
   * @param {Function} Class the class to brand with the `FACTORY_CLASS` symbol
   * @return {Function} returns the Class value passed in
   */


  static removeClassBrand(Class) {
    if (Class) {
      if ((0, _neTypes.extendsFrom)(Class, _GQLBase.GQLBase)) {
        delete Class[_GQLBase.META_KEY][this.FACTORY_CLASS];
      } else {
        delete Class[this.FACTORY_CLASS];
      }
    }

    return Class;
  }
  /**
   * A constant that reports that this class is `'[object LatticeFactory]'`
   * rather than `'[object Object]'` when introspected with tools such as
   * `Object.prototype.toString.apply(class)`.
   *
   * @memberof LatticeFactory
   * @type {Symbol}
   * @static
   */
  // $FlowFixMe


  static get [Symbol.toStringTag]() {
    return this.name;
  }
  /**
   * A constant exported as part of LatticeFactory that can be used for
   * defining documentation for the type itself.
   *
   * @memberof LatticeFactory
   * @type {Symbol}
   * @static
   */


  static get TYPE() {
    return Symbol.for('API Docs Type Constant');
  }
  /**
   * A constant exported as part of LatticeFactory that can be used for
   * identifying classes that were generated with LatticeFactory.
   *
   * @memberof LatticeFactory
   * @type {Symbol}
   * @static
   */


  static get FACTORY_CLASS() {
    return Symbol.for('Factory Class');
  }

}

exports.LatticeFactory = LatticeFactory;
const isFactoryClass = LatticeFactory.isFactoryClass; // TESTING REPL

/**
var { LatticeFactory, getChecklist, hasChecklist, CHECKLIST, CHECK_SCHEMA, CHECK_RESOLVERS } = require('./dist/LatticeFactory'); var { GQLBase, META_KEY, joinLines, SyntaxTree, typeOf } = require('./dist/lattice'); var gql = joinLines, LF = LatticeFactory, TYPE = LF.TYPE;
var PersonDef = { name: 'Person', schema: gql` enum StatType { PHYSICAL, MENTAL } type Person { name: String stats(type:StatType): Stat } type Query { findPerson(id: ID): Person } `, resolvers: { Query: { findPerson({req, res, next}, {id}) { console.log('find person') } }, Person: { stats({type}) { let { req, res, next} = this.requestData } } }, docs: { StatType: { [TYPE]: `A type of statistic associated with people`, PHYSICAL: `Physical attributes`, MENTAL: `Mental attributes` }, Person: { [TYPE]: `Represents a person`, personId: `Unique id of the person in question`, name: `The name of the person`, stats: `Allows you to query the stats of a person based on type` }, Query: { [TYPE]: 'Top level query desc.', findPerson: `Searches the system for the specified user` } } };
var Person = LF.build(PersonDef), p = new Person({name: 'Brielle'})
Person.getProp('stats',true,{requestData:{req:1,res:2,next:3}})
var Broke = LF.build({name: 'Broke', schema: gql`type Broke {name: String}`, resolvers:{}, docs:{}})
var t = LF.validateTemplate({name: '',  type: GQLBase, resolvers: {}, docs: {}, schema: ''});
*/

exports.isFactoryClass = isFactoryClass;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2VzNi9MYXR0aWNlRmFjdG9yeS5qcyJdLCJuYW1lcyI6WyJfaSIsImFyZ3MiLCJjb2xvcnMiLCJkZXB0aCIsIkNIRUNLTElTVCIsIlN5bWJvbCIsImZvciIsIkNIRUNLX1NDSEVNQSIsIkNIRUNLX1JFU09MVkVSUyIsIkNIRUNLX0FQSV9ET0NTIiwiZ2V0Q2hlY2tsaXN0IiwiQ2xhc3MiLCJNRVRBX0tFWSIsInNldENoZWNrbGlzdCIsIml0ZW0iLCJ2YWx1ZSIsImNoZWNrbGlzdCIsImhhc0NoZWNrbGlzdCIsIml0ZW1zIiwibGVuZ3RoIiwibmV3Q2hlY2tsaXN0Iiwia2V5cyIsImNvbXBsZXRlIiwicmVkdWNlIiwicCIsImMiLCJpIiwiYSIsIkVycm9yIiwiZHJvcExvd2VzdCIsInRvU3RyaW5nVGFnIiwiVmFsaWRhdGlvblJlc3VsdHMiLCJjb25zdHJ1Y3RvciIsImVycm9ycyIsInZhbGlkIiwibmFtZSIsIkxhdHRpY2VGYWN0b3J5IiwidmFsaWRhdGVUZW1wbGF0ZSIsInRlbXBsYXRlIiwiaGlkZSIsInJlc3VsdHMiLCJpbmRlbnQiLCJzdHJpbmciLCJjb3VudCIsInNwYWNlIiwic3BsaXQiLCJtYXAiLCJzIiwidHJpbSIsInJlcGxhY2UiLCJyZXBlYXQiLCJqb2luIiwicHVzaCIsIlN0cmluZyIsInNjaGVtYSIsInJlc29sdmVycyIsIk9iamVjdCIsImRvY3MiLCJkciIsImJyIiwiYjEiLCJiMCIsImJiIiwiZGciLCJiZyIsImEwIiwiZ3IiLCJiZ3IiLCJlcnJvclN0cmluZ3MiLCJlcnJvciIsIm1lc3NhZ2UiLCJzdGFjayIsInNwbGljZSIsImdlbmVyYXRlQ2xhc3MiLCJiYXNlQ2xhc3MiLCJHUUxCYXNlIiwiZm4iLCJldmFsIiwiYnJhbmRDbGFzcyIsImluamVjdFNjaGVtYSIsImRlZmluZVByb3BlcnR5IiwiZ2V0IiwiaW5qZWN0UmVzb2x2ZXJzIiwidHJlZSIsIlN5bnRheFRyZWUiLCJmcm9tIiwiU0NIRU1BIiwib3V0bGluZSIsImZpZWxkcyIsImZpZWxkUmVzb2x2ZXIiLCJMTCIsIndhcm4iLCJwcm9wIiwiaW5mbyIsInByb3RvdHlwZSIsInR5cGUiLCJkZWNvcmF0b3IiLCJyZXNvbHZlciIsIm11dGF0b3IiLCJzdWJzY3JpcHRvciIsImZuTmFtZSIsImluamVjdERvY3MiLCJjb3B5UHJvcCIsIm8iLCJ0byIsImFzIiwiZ2V0UHJvdG90eXBlT2YiLCJkZXNjcmlwdG9yIiwiZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yIiwicmVzdWx0IiwiVFlQRSIsIkRPQ19DTEFTUyIsIkRPQ19GSUVMRFMiLCJET0NfUVVFUlkiLCJET0NfTVVUQVRJT04iLCJET0NfU1VCU0NSSVBUSU9OIiwiRE9DX1FVRVJJRVMiLCJET0NfTVVUQVRJT05TIiwiRE9DX1NVQlNDUklQVElPTlMiLCJUeXBlIiwiVG9wTGV2ZWxDb25zdGFudCIsIkZpZWxkQ29uc3RhbnRzIiwiZW50cmllcyIsImJ1aWxkIiwidmFsaWRhdGlvblJlc3VsdHMiLCJfc2NoZW1hIiwiX3Jlc29sdmVycyIsIl9hcGlEb2NzIiwiRkFDVE9SWV9DTEFTUyIsImlzRmFjdG9yeUNsYXNzIiwicmVtb3ZlQ2xhc3NCcmFuZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUVBOztBQUNBOztBQUNBOztBQUNBOztBQUVBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7O0FBRUEsTUFBTUEsRUFBRSxHQUFHLENBQUMsR0FBR0MsSUFBSixLQUFhLG1CQUFRLEdBQUdBLElBQVgsRUFBaUI7QUFBQ0MsRUFBQUEsTUFBTSxFQUFFLElBQVQ7QUFBZUMsRUFBQUEsS0FBSyxFQUFFO0FBQXRCLENBQWpCLENBQXhCO0FBR0E7Ozs7Ozs7Ozs7QUFRTyxNQUFNQyxTQUFTLEdBQUdDLE1BQU0sQ0FBQ0MsR0FBUCxDQUFXLFdBQVgsQ0FBbEI7QUFFUDs7Ozs7Ozs7O0FBT08sTUFBTUMsWUFBWSxHQUFHRixNQUFNLENBQUNDLEdBQVAsQ0FBVyxrQkFBWCxDQUFyQjtBQUVQOzs7Ozs7Ozs7O0FBUU8s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MEJBQVlBLEtBQVosRUFBbUJnRSxnQkFBbkIsSUFDSixDQUFDLENBQUNoRSxLQUFLLENBQUNDLGlCQUFELENBQUwsQ0FBZ0IsS0FBS29ILGFBQXJCLENBREUsR0FFSixDQUFDLENBQUNySCxLQUFLLENBQUMsS0FBS3FILGFBQU4sQ0FGWDtBQUlEOztBQUVELFdBQU8sS0FBUDtBQUNEO0FBRUQ7Ozs7Ozs7Ozs7Ozs7OztBQWFBLFNBQU9FLGdCQUFQLENBQXdCdkgsS0FBeEIsRUFBbUQ7QUFDakQsUUFBSUEsS0FBSixFQUFXO0FBQ1QsVUFBSSwwQkFBWUEsS0FBWixFQUFtQmdFLGdCQUFuQixDQUFKLEVBQWlDO0FBQy9CLGVBQU9oRSxLQUFLLENBQUNDLGlCQUFELENBQUwsQ0FBZ0IsS0FBS29ILGFBQXJCLENBQVA7QUFDRCxPQUZELE1BR0s7QUFDSCxlQUFPckgsS0FBSyxDQUFDLEtBQUtxSCxhQUFOLENBQVo7QUFDRDtBQUNGOztBQUVELFdBQU9ySCxLQUFQO0FBQ0Q7QUFFRDs7Ozs7Ozs7O0FBU0E7OztBQUNBLGNBQVlOLE1BQU0sQ0FBQ3lCLFdBQW5CLElBQWtDO0FBQUUsV0FBTyxLQUFLSyxJQUFaO0FBQWtCO0FBRXREOzs7Ozs7Ozs7O0FBUUEsYUFBVzJFLElBQVgsR0FBMEI7QUFBRSxXQUFPekcsTUFBTSxDQUFDQyxHQUFQLENBQVcsd0JBQVgsQ0FBUDtBQUE2QztBQUV6RTs7Ozs7Ozs7OztBQVFBLGFBQVcwSCxhQUFYLEdBQW1DO0FBQUUsV0FBTzNILE1BQU0sQ0FBQ0MsR0FBUCxDQUFXLGVBQVgsQ0FBUDtBQUFvQzs7QUF2bkIvQzs7O0FBMG5CckIsTUFBTTJILGNBQWMsR0FBRzdGLGNBQWMsQ0FBQzZGLGNBQXRDLEMsQ0FFUDs7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbIi8vIEBmbG93XG5cbmltcG9ydCB7IEdRTEJhc2UsIE1FVEFfS0VZIH0gZnJvbSAnLi9HUUxCYXNlJ1xuaW1wb3J0IHsgR1FMRW51bSB9IGZyb20gJy4vR1FMRW51bSdcbmltcG9ydCB7IEdRTEludGVyZmFjZSB9IGZyb20gJy4vR1FMSW50ZXJmYWNlJ1xuaW1wb3J0IHsgR1FMU2NhbGFyIH0gZnJvbSAnLi9HUUxTY2FsYXInXG4vLyBpbXBvcnQgeyBHUUxVbmlvbiB9IGZyb20gJy4vR1FMVW5pb24nXG5pbXBvcnQgeyBTeW50YXhUcmVlIH0gZnJvbSAnLi9TeW50YXhUcmVlJ1xuaW1wb3J0IHsgY3VzdG9tRGVkZW50IH0gZnJvbSAnbmUtdGFnLWZucydcbmltcG9ydCB7IHR5cGVPZiwgZXh0ZW5kc0Zyb20gfSBmcm9tICduZS10eXBlcydcbmltcG9ydCB7IGluc3BlY3QgfSBmcm9tICd1dGlsJ1xuaW1wb3J0IHsgcmVzb2x2ZXIsIG11dGF0b3IsIHN1YnNjcmlwdG9yIH0gZnJvbSAnLi9kZWNvcmF0b3JzL1Jlc29sdmVycydcbmltcG9ydCB7IFByb3BlcnRpZXMgfSBmcm9tICcuL2RlY29yYXRvcnMvTW9kZWxQcm9wZXJ0aWVzJ1xuaW1wb3J0IHsgTGF0dGljZUxvZ3MgYXMgTEwgfSBmcm9tICcuL3V0aWxzJ1xuXG5jb25zdCBfaSA9ICguLi5hcmdzKSA9PiBpbnNwZWN0KC4uLmFyZ3MsIHtjb2xvcnM6IHRydWUsIGRlcHRoOiAzfSlcblxuXG4vKipcbiAqIFRoZSBDSEVDS0xJU1QgU3ltYm9sIGlzIHVzZWQgYXMgYSBzdG9yYWdlIGtleSBpbiB0aGUgbWV0YWRhdGEgc3RhZ2luZ1xuICogYXJlYSBmb3IgZWFjaCBvZiB0aGUgR1FMQmFzZSBleHRlbmRlZCBjbGFzc2VzLiBJbiB0aGUgTGF0dGljZUZhY3RvcnlcbiAqIGl0IGlzIHVzZWQgdG8gZGV0ZXJtaW5lIHdoZXJlIGluIHRoZSBmbG93IG9mIGNvbnN0cnVjdGlvbiB0aGUgY2xhc3NcbiAqIGN1cnJlbnRseSBpcy5cbiAqXG4gKiBAdHlwZSB7U3ltYm9sfVxuICovXG5leHBvcnQgY29uc3QgQ0hFQ0tMSVNUID0gU3ltYm9sLmZvcignY2hlY2tsaXN0JylcblxuLyoqXG4gKiBUaGUgQ0hFQ0tfU0NIRU1BIFN5bWJvbCBpcyBwYXJ0IG9mIHRoZSBDSEVDS0xJU1QgZm9yIGEgY29uc3RydWN0ZWRcbiAqIEdRTEJhc2UgZXh0ZW5kZWQgY2xhc3MuIEl0IGRlbm90ZXMgdGhhdCB0aGUgY2xhc3MgaGFzIGhhZCBpdHMgU0NIRU1BXG4gKiBnZXR0ZXIgZGVmaW5lZC5cbiAqXG4gKiBAdHlwZSB7U3ltYm9sfVxuICovXG5leHBvcnQgY29uc3QgQ0hFQ0tfU0NIRU1BID0gU3ltYm9sLmZvcignY2hlY2tsaXN0LXNjaGVtYScpXG5cbi8qKlxuICogVGhlIENIRUNLX1JFU09MVkVSUyBTeW1ib2wgaXMgcGFydCBvZiB0aGUgQ0hFQ0tMSVNUIGZvciBhIGNvbnN0cnVjdGVkXG4gKiBHUUxCYXNlIGV4dGVuZGVkIGNsYXNzLiBJdCBkZW5vdGVzIHRoYXQgdGhlIGNsYXNzIGhhcyBoYWQgaXRzIGluc3RhbmNlXG4gKiBmaWVsZCByZXNvbHZlcnMgYXMgd2VsbCBhcyBpdHMgc3RhdGljIFF1ZXJ5LCBNdXRhdGlvbiBhbmQgU3Vic2NyaXB0aW9uXG4gKiByZXNvbHZlcnMgaW5qZWN0ZWQgYW5kIGRlZmluZWQuXG4gKlxuICogQHR5cGUge1N5bWJvbH1cbiAqL1xuZXhwb3J0IGNvbnN0IENIRUNLX1JFU09MVkVSUyA9IFN5bWJvbC5mb3IoJ2NoZWNrbGlzdC1yZXNvbHZlcnMnKVxuXG4vKipcbiAqIFRoZSBDSEVDS19BUElfRE9DUyBTeW1ib2wgaXMgcGFydCBvZiB0aGUgQ0hFQ0tMSVNUIGZvciBhIGNvbnN0cnVjdGVkXG4gKiBHUUxCYXNlIGV4dGVuZGVkIGNsYXNzLiBJdCBkZW5vdGVzIHRoYXQgdGhlIGNsYXNzIGhhcyBoYWQgaXRzIGFwaSBkb2NzXG4gKiBkZWZpbmVkLCBwcm9jZXNzZWQgYW5kIHNldHVwIG9uIHRoZSBjbGFzcyBpbiBhIHdheSB0aGF0IGl0IHdpbGwgYmVcbiAqIHBpY2tlZCB1cCBpbiB0aGUgYnVpbGQgbGlmZWN5Y2xlLlxuICpcbiAqIEB0eXBlIHtTeW1ib2x9XG4gKi9cbmV4cG9ydCBjb25zdCBDSEVDS19BUElfRE9DUyA9IFN5bWJvbC5mb3IoJ2NoZWNrbGlzdC1hcGktZG9jcycpXG5cbi8qKlxuICogUGVla3MgaW50byB0aGUgbWV0YWRhdGEgc3RvcmFnZSBhcmVhIG9mIGEgZ2l2ZW4gR1FMQmFzZSBleHRlbmRlZFxuICogY2xhc3MgYW5kIGZldGNoZXMgdGhlIGZhY3RvcnkgY2hlY2tsaXN0IGlmIG9uZSBleGlzdHMuXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gQ2xhc3MgYSByZWZlcmVuY2UgdG8gdGhlIEdRTEJhc2UgY2xhc3MgdG8gcGVlayBpblxuICogQHJldHVybiB7T2JqZWN0fSBhbiBvYmplY3Qgc2V0dXAgd2l0aCBhdCBsZWFzdCB0aHJlZSBib29sZWFucyBrZXllZCBieVxuICogdGhlIGNvbnN0YW50cyBDSEVDS19TQ0hFTUEsIENIRUNLX1JFU09MVkVSUywgYW5kIENIRUNLX0FQSV9ET0NTIG9yIG51bGxcbiAqIGlmIG5vbmUgZXhpc3RzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRDaGVja2xpc3QoQ2xhc3M6IEZ1bmN0aW9uKSB7XG4gIHJldHVybiAoQ2xhc3MgJiYgQ2xhc3NbTUVUQV9LRVldICYmIENsYXNzW01FVEFfS0VZXVtDSEVDS0xJU1RdKSB8fCBudWxsXG59XG5cbi8qKlxuICogT2J0YWlucyB0aGUgY2hlY2tsaXN0IGZyb20gdGhlIHN1cHBsaWVkIEdRTEJhc2UgZXh0ZW5kZWQgY2xhc3MuIElmIHRoZVxuICogY2xhc3MgaGFzIGEgY2hlY2tsaXN0LCBpdHMgY2hlY2tsaXN0IGl0ZW0gaXMgc2V0IHRvIHRydWUgb3IgdGhlIGJvb2xlYW5cbiAqIHZhbHVlIHNwZWNpZmllZC5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBDbGFzcyBhIHJlZmVyZW5jZSB0byB0aGUgR1FMQmFzZSBjbGFzcyB0byBzZXRcbiAqIEBwYXJhbSB7U3ltYm9sfSBpdGVtIG9uZSBvZiBDSEVDS19TQ0hFTUEsIENIRUNLX1JFU09MVkVSUywgb3JcbiAqIENIRUNLX0FQSV9ET0NTXG4gKiBAcGFyYW0ge0Jvb2xlYW59IHZhbHVlIHRoZSB2YWx1ZSBmb3IgdGhlIGNoZWNrbGlzdCBpdGVtIHRvIHNldFxuICovXG5leHBvcnQgZnVuY3Rpb24gc2V0Q2hlY2tsaXN0KFxuICBDbGFzczogRnVuY3Rpb24sXG4gIGl0ZW06IFN5bWJvbCxcbiAgdmFsdWU6IGJvb2xlYW4gPSB0cnVlXG4pIHtcbiAgbGV0IGNoZWNrbGlzdCA9IGdldENoZWNrbGlzdChDbGFzcylcblxuICBpZiAoY2hlY2tsaXN0KSB7XG4gICAgLy8gJEZsb3dGaXhNZVxuICAgIGNoZWNrbGlzdFtpdGVtXSA9IHZhbHVlXG4gIH1cbn1cblxuLyoqXG4gKiBUaGlzIGZ1bmN0aW9uLCB3aGVuIGludm9rZWQgd2l0aCBvbmx5IGEgY2xhc3Mgd2lsbCByZXR1cm4gdHJ1ZSBpZiB0aGVcbiAqIENsYXNzIGhhcyBhIGRlZmluZWQgY2hlY2tsaXN0LiBJZiBvbmUgb3JlIG1vcmUgQ0hFQ0tMSVNUIHN5bWJvbHMgYXJlXG4gKiBwYXNzZWQsIHRoZSBmdW5jdGlvbiB3aWxsIG9ubHkgcmV0dXJuIHRydWUgaWYgYWxsIHRoZSBzdXBwbGllZCBzeW1ib2xzXG4gKiBhcmUgc2V0IHRvIHRydXRoeSB2YWx1ZXMuXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gQ2xhc3MgYSByZWZlcmVuY2UgdG8gdGhlIEdRTEJhc2UgY2xhc3MgdG8gc2V0XG4gKiBAcGFyYW0ge0FycmF5PFN5bWJvbD59IGl0ZW1zIGFueSBvZiBDSEVDS19TQ0hFTUEsIENIRUNLX1JFU09MVkVSUywgb3JcbiAqIENIRUNLX0FQSV9ET0NTXG4gKiBAcmV0dXJuIHtCb29sZWFufSB0cnVlIGlmIHRoZSBjaGVja2xpc3QgYW5kL29yIGFsbCBpdGVtcyBhcmUgdHJ1ZSBhbmRcbiAqIHByZXNlbnQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBoYXNDaGVja2xpc3QoQ2xhc3M6IEZ1bmN0aW9uLCAuLi5pdGVtczogQXJyYXk8U3ltYm9sPikge1xuICBsZXQgY2hlY2tsaXN0ID0gZ2V0Q2hlY2tsaXN0KENsYXNzKVxuXG4gIGlmIChjaGVja2xpc3QgJiYgaXRlbXMubGVuZ3RoKSB7XG4gICAgZm9yIChsZXQgaXRlbSBvZiBpdGVtcykge1xuICAgICAgaWYgKCFjaGVja2xpc3RbaXRlbV0pIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWVcbiAgfVxuXG4gIHJldHVybiBjaGVja2xpc3Rcbn1cblxuLyoqXG4gKiBJbmplY3RzIGFuZCBjcmVhdGVzIGEgbmV3IENIRUNLTElTVCBvYmplY3Qgb24gdGhlIHN1cHBsaWVkIEdRTEJhc2VcbiAqIGV4dGVuZGVkIGNsYXNzLiBBbGwgaXRlbXMgYXJlIGluc3RhbGxlZCBhbmQgc2V0IHRvIGZhbHNlLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IENsYXNzIGEgcmVmZXJlbmNlIHRvIHRoZSBHUUxCYXNlIGNsYXNzIHRvIHNldFxuICovXG5leHBvcnQgZnVuY3Rpb24gbmV3Q2hlY2tsaXN0KENsYXNzOiBGdW5jdGlvbikge1xuICBpZiAoQ2xhc3MpIHtcbiAgICAvLyAkRmxvd0ZpeE1lXG4gICAgQ2xhc3NbTUVUQV9LRVldW0NIRUNLTElTVF0gPSB7XG4gICAgICBbQ0hFQ0tfU0NIRU1BXTogZmFsc2UsXG4gICAgICBbQ0hFQ0tfUkVTT0xWRVJTXTogZmFsc2UsXG4gICAgICBbQ0hFQ0tfQVBJX0RPQ1NdOiBmYWxzZSxcblxuICAgICAgZ2V0IGtleXMoKSB7XG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgQ0hFQ0tfU0NIRU1BLCBDSEVDS19SRVNPTFZFUlMsIENIRUNLX0FQSV9ET0NTXG4gICAgICAgIF1cbiAgICAgIH0sXG5cbiAgICAgIGdldCBjb21wbGV0ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMua2V5cy5yZWR1Y2UoKHAsYyxpLGEpID0+IHtcbiAgICAgICAgICBpZiAoIXAgfHwgIXRoaXNbY10pIHsgcmV0dXJuIGZhbHNlIH1cbiAgICAgICAgfSwgdHJ1ZSlcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgZWxzZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGN1c3RvbURlZGVudCh7ZHJvcExvd2VzdDp0cnVlfSlgXG4gICAgICBDYW5ub3QgY3JlYXRlIG5ldyBjaGVja2xpc3QgbWV0YWRhdGEgb24gYSBub24tZXhpc3RlbnQgY2xhc3NcbiAgICBgKVxuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBWYWxpZGF0aW9uUmVzdWx0cyB7XG4gIGVycm9yczogQXJyYXk8RXJyb3I+XG5cbiAgY29uc3RydWN0b3IoZXJyb3JzOiBBcnJheTxFcnJvcj4gPSBbXSkge1xuICAgIHRoaXMuZXJyb3JzID0gZXJyb3JzXG4gIH1cblxuICBnZXQgdmFsaWQoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLmVycm9ycy5sZW5ndGggPT09IDAgfVxuXG4gIC8vICRGbG93Rml4TWVcbiAgZ2V0IFtTeW1ib2wudG9TdHJpbmdUYWddKCk6IHN0cmluZyB7IHJldHVybiB0aGlzLmNvbnN0cnVjdG9yLm5hbWUgfVxuXG4gIC8vICRGbG93Rml4TWVcbiAgc3RhdGljIGdldCBbU3ltYm9sLnRvU3RyaW5nVGFnXSgpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5uYW1lIH1cbn1cblxuZXhwb3J0IGNsYXNzIExhdHRpY2VGYWN0b3J5IHtcblxuICAvKipcbiAgICogV2Fsa3MgdGhyb3VnaCBhIHN1cHBsaWVkIHRlbXBsYXRlIG9iamVjdCBhbmQgY29sbGVjdHMgZXJyb3JzIHdpdGggaXRzXG4gICAqIGZvcm1hdCBiZWZvcmUgYnViYmxpbmcgdXAgYW4gZXhjZXB0aW9uIGlmIGFueSBwYXJ0IG9mIGl0IGZhaWxzIHRvXG4gICAqIHBhc3MgbXVzdGVyLiBUaGUgZXhjZXB0aW9uIGNhbiBiZSBwcmV2ZW50ZWQgZnJvbSB0aHJvd2luZyBpZiBoaWRlIGlzIHNldFxuICAgKiB0byB0cnVlXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSB0ZW1wbGF0ZSBhbiBvYmplY3QgdG8gYmUgcGFyc2VkIGZvciBjb25zdHJ1Y3Rpb24gdmlhIHRoZVxuICAgKiBMYXR0aWNlIEZhY3RvcnlcbiAgICogQHBhcmFtIHtib29sZWFufSBoaWRlIGlmIHRydWUsIGFuIGludmFsaWQgdGVtcGxhdGUgd2lsbCBOT1QgdGhyb3cgZXJyb3JzXG4gICAqIEByZXR1cm4ge1ZhbGlkYXRpb25SZXN1bHRzfSBhIGBWYWxpZGF0aW9uUmVzdWx0c2Agb2JqZWN0IGNvbnRhaW5pbmcgdGhlXG4gICAqIGNvbGxlY3RlZCBlcnJvcnMgYW5kIGEgYHZhbGlkYCB0aGF0IGlzIGR5bmFtaWNhbGx5IGNhbGN1bGF0ZWQuXG4gICAqL1xuICBzdGF0aWMgdmFsaWRhdGVUZW1wbGF0ZShcbiAgICB0ZW1wbGF0ZTogT2JqZWN0LFxuICAgIGhpZGU6IGJvb2xlYW4gPSBmYWxzZVxuICApOiBWYWxpZGF0aW9uUmVzdWx0cyB7XG4gICAgbGV0IHJlc3VsdHMgPSBuZXcgVmFsaWRhdGlvblJlc3VsdHMoKVxuICAgIGxldCBpbmRlbnQgPSAoc3RyaW5nOiBzdHJpbmcsIGNvdW50OiBudW1iZXIgPSA0LCBzcGFjZTogc3RyaW5nID0gJyAnKSA9PiAoXG4gICAgICBzdHJpbmdcbiAgICAgICAgLnNwbGl0KCdcXG4nKVxuICAgICAgICAubWFwKHMgPT4gcy50cmltKCkucmVwbGFjZSgvKF4pL2dtLCBgJDEke3NwYWNlLnJlcGVhdChjb3VudCl9YCkpXG4gICAgICAgIC5qb2luKCdcXG4nKVxuICAgIClcblxuICAgIGlmICh0eXBlb2YgdGVtcGxhdGUubmFtZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHJlc3VsdHMuZXJyb3JzLnB1c2gobmV3IEVycm9yKGN1c3RvbURlZGVudCh7ZHJvcExvd2VzdDp0cnVlfSlgXG4gICAgICAgIFRoZSBcXGB0ZW1wbGF0ZS5uYW1lXFxgIGZpZWxkIG11c3QgZXhpc3Qgb3IgdGhlIGNyZWF0aW9uIGZvciB0aGUgTGF0dGljZVxuICAgICAgICBmYWN0b3J5IGNsYXNzIGdlbmVyYXRpb24gdG8gc3VjY2VlZC5cblxuICAgICAgICBQbGVhc2UgcmVhZCB0aGUgZG9jdW1lbnRhdGlvbiBmb3IgbW9yZSBpbmZvcm1hdGlvbiBvbiB0aGUgZm9ybWF0IG9mXG4gICAgICAgIGEgTGF0dGljZUZhY3RvcnkgdGVtcGxhdGUuXG4gICAgICBgKSlcbiAgICB9XG5cbiAgICBpZiAoIWV4dGVuZHNGcm9tKHRlbXBsYXRlLm5hbWUsIFN0cmluZykpIHtcbiAgICAgIHJlc3VsdHMuZXJyb3JzLnB1c2gobmV3IEVycm9yKGN1c3RvbURlZGVudCh7ZHJvcExvd2VzdDp0cnVlfSlgXG4gICAgICAgIFRoZSBcXGB0ZW1wbGF0ZS5uYW1lXFxgIGZpZWxkIG11c3QgYmUgYSBzdHJpbmcuXG5cbiAgICAgICAgUGxlYXNlIHJlYWQgdGhlIGRvY3VtZW50YXRpb24gZm9yIG1vcmUgaW5mb3JtYXRpb24gb24gdGhlIGZvcm1hdCBvZlxuICAgICAgICBhIExhdHRpY2VGYWN0b3J5IHRlbXBsYXRlLlxuICAgICAgYCkpXG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiB0ZW1wbGF0ZS5zY2hlbWEgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICByZXN1bHRzLmVycm9ycy5wdXNoKG5ldyBFcnJvcihjdXN0b21EZWRlbnQoe2Ryb3BMb3dlc3Q6dHJ1ZX0pYFxuICAgICAgICBUaGUgXFxgdGVtcGxhdGUuc2NoZW1hXFxgIGZpZWxkIG11c3QgZXhpc3Qgb3IgdGhlIGNyZWF0aW9uIGZvciB0aGVcbiAgICAgICAgTGF0dGljZSBmYWN0b3J5IGNsYXNzIGdlbmVyYXRpb24gdG8gc3VjY2VlZC5cblxuICAgICAgICBQbGVhc2UgcmVhZCB0aGUgZG9jdW1lbnRhdGlvbiBmb3IgbW9yZSBpbmZvcm1hdGlvbiBvbiB0aGUgZm9ybWF0IG9mXG4gICAgICAgIGEgTGF0dGljZUZhY3RvcnkgdGVtcGxhdGUuXG4gICAgICBgKSlcbiAgICB9XG5cbiAgICBpZiAoIWV4dGVuZHNGcm9tKHRlbXBsYXRlLnNjaGVtYSwgU3RyaW5nKSkge1xuICAgICAgcmVzdWx0cy5lcnJvcnMucHVzaChuZXcgRXJyb3IoY3VzdG9tRGVkZW50KHtkcm9wTG93ZXN0OnRydWV9KWBcbiAgICAgICAgVGhlIFxcYHRlbXBsYXRlLnNjaGVtYVxcYCBmaWVsZCBtdXN0IGJlIGEgc3RyaW5nIG9mIEdyYXBoUUwgU0RML0lETFxuXG4gICAgICAgIFBsZWFzZSByZWFkIHRoZSBkb2N1bWVudGF0aW9uIGZvciBtb3JlIGluZm9ybWF0aW9uIG9uIHRoZSBmb3JtYXQgb2ZcbiAgICAgICAgYSBMYXR0aWNlRmFjdG9yeSB0ZW1wbGF0ZS5cbiAgICAgIGApKVxuICAgIH1cblxuICAgIGlmIChcbiAgICAgICFleHRlbmRzRnJvbSh0ZW1wbGF0ZS5yZXNvbHZlcnMsIE9iamVjdCkgIC8vIFN1cHBvcnRzIDk1JSBvZiBvYmplY3RzXG4gICAgICB8fCB0eXBlb2YgdGVtcGxhdGUucmVzb2x2ZXJzICE9PSAnb2JqZWN0JyAvLyBTdXBwb3J0cyBPYmplY3QuY3JlYXRlKG51bGwpXG4gICAgKSB7XG4gICAgICByZXN1bHRzLmVycm9ycy5wdXNoKG5ldyBFcnJvcihjdXN0b21EZWRlbnQoe2Ryb3BMb3dlc3Q6dHJ1ZX0pYFxceDFiWzkxOzFtXG4gICAgICAgIFRoZSBcXGB0ZW1wbGF0ZS5yZXNvbHZlcnNcXGAgZmllbGQgbXVzdCBiZSBhbiBPYmplY3QgY29udGFpbmluZyB0aGVcbiAgICAgICAgcmVzb2x2ZXIgZnVuY3Rpb25zLiBRdWVyeSwgTXV0YXRpb24gYW5kIFN1YnNjcmlwdGlvbiByZXNvbHZlcnMgd2lsbFxuICAgICAgICB0YWtlIHRoZSBmb2xsb3dpbmcgc2lnbmF0dXJlLiBBZGRpdGlvbmFsbHksIHRoZSBrZXlzIGZvciB0aGVzZSBzcGVjaWFsXG4gICAgICAgIHJlc29sdmVycyBtdXN0IGJlIFF1ZXJ5LCBNdXRhdGlvbiBvciBTdWJzY3JpcHRpb247IHJlc3BlY3RpdmVseVxuICAgICAgICBcXHgxYlszNzsyMm1cbiAgICAgICAgICBRdWVyeTogeyBbcmVzb2x2ZXJdOiAocmVxdWVzdERhdGEsIHJlc29sdmVyUGFyYW1ldGVycykgPT4ge30gfVxuICAgICAgICAgIE11dGF0aW9uOiB7IFtyZXNvbHZlcl06IChyZXF1ZXN0RGF0YSwgcmVzb2x2ZXJQYXJhbWV0ZXJzKSA9PiB7fSB9XG4gICAgICAgICAgU3Vic2NyaXB0aW9uOiB7IFtyZXNvbHZlcl06IChyZXF1ZXN0RGF0YSwgcmVzb2x2ZXJQYXJhbWV0ZXJzKSA9PiB7fSB9XG5cbiAgICAgICAgICB3aGVyZTpcbiAgICAgICAgICAgIFxcYHJlcXVlc3REYXRhXFxgIGlzIGFuIG9iamVjdCB3aXRoIHsgcmVxLCByZXMsIGdxbHxuZXh0IH0gZGVwZW5kaW5nXG4gICAgICAgICAgICAgIG9uIHRoZSBncmFwaHFsIHNlcnZlciBpbXBsZW1lbnRhdGlvbiAoRkIgUmVmZXJlbmNlLCBBcG9sbG8sIGV0YylcbiAgICAgICAgICAgIFxcYHJlc292bGVyUGFyYW1ldGVyc1xcYCBpcyBhbiBvYmplY3Qgd2l0aCBrZXlzIG1hdGNoaW5nIHRob3NlXG4gICAgICAgICAgICAgIHBhcmFtZXRlcnMgZGVmaW5lZCBpbiB0aGUgU0NIRU1BIGZvciB0aGUgcmVzb2x2ZXIgaW4gcXVlc3Rpb24uXG4gICAgICAgIFxceDFiWzkxOzFtXG4gICAgICAgIEZpZWxkIHJlc29sdmVycyBzaG91bGQgYmUgZm91bmQgdW5kZXIgdGhlIGtleSBuYW1lIG9mIHRoZSB0eXBlXG4gICAgICAgIG9yIGludGVyZmFjZSBpbiBxdWVzdGlvbiBhbmQgbXVzdCBjb3JyZXNwb25kIHRvIHRoZSBmb2xsb3dpbmcgc2lnbmF0dXJlXG4gICAgICAgIFxceDFiWzM3OzIybVxuICAgICAgICAgIFtUeXBlXTogeyBbcmVzb2x2ZXJdOiAocmVzb2x2ZXJQYXJhbWV0ZXJzKSA9PiB7fSB9XG5cbiAgICAgICAgICB3aGVyZTpcbiAgICAgICAgICAgIFxcYFR5cGVcXGAgaXMgdGhlIG5hbWUgb2YgdGhlIEdRTCB0eXBlIGRlZmluZWQgaW4gdGhlIHNjaGVtYVxuICAgICAgICAgICAgXFxgcmVzb3ZsZXJQYXJhbWV0ZXJzXFxgIGlzIGFuIG9iamVjdCB3aXRoIGtleXMgbWF0Y2hpbmcgdGhvc2VcbiAgICAgICAgICAgICAgcGFyYW1ldGVycyBkZWZpbmVkIGluIHRoZSBTQ0hFTUEgZm9yIHRoZSByZXNvbHZlciBpbiBxdWVzdGlvbi5cblxuICAgICAgICAgICogaXQgaXMgd29ydGggbm90aW5nIHRoYXQgdGhlIGZpZWxkIHJlc29sdmVycyBhcmUgbm90IHN0YXRpYyBhbmRcbiAgICAgICAgICAgIGNhbiBhY2Nlc3MgdGhlIFxcYHJlcXVlc3REYXRhXFxgIG9iamVjdCB2aWEgXFxgdGhpcy5yZXF1ZXN0RGF0YVxcYFxuICAgICAgICBcXHgxYls5MTsxbVxuICAgICAgICBQbGVhc2UgcmVhZCB0aGUgZG9jdW1lbnRhdGlvbiBmb3IgbW9yZSBpbmZvcm1hdGlvbiBvbiB0aGUgZm9ybWF0IG9mXG4gICAgICAgIGEgTGF0dGljZUZhY3RvcnkgdGVtcGxhdGUuXFx4MWJbMG1cbiAgICAgIGApKVxuICAgIH1cblxuICAgIGlmICh0eXBlb2YgdGVtcGxhdGUuZG9jcyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHJlc3VsdHMuZXJyb3JzLnB1c2gobmV3IEVycm9yKGN1c3RvbURlZGVudCh7ZHJvcExvd2VzdDp0cnVlfSlgXG4gICAgICAgIFRoZSBcXGB0ZW1wbGF0ZS5kb2NzXFxgIGZpZWxkIG11c3QgZXhpc3QgZm9yIHRoZSBjcmVhdGlvbiBvZiB0aGVcbiAgICAgICAgTGF0dGljZSBmYWN0b3J5IGNsYXNzIGdlbmVyYXRpb24gdG8gc3VjY2VlZC5cblxuICAgICAgICBQbGVhc2UgcmVhZCB0aGUgZG9jdW1lbnRhdGlvbiBmb3IgbW9yZSBpbmZvcm1hdGlvbiBvbiB0aGUgZm9ybWF0IG9mXG4gICAgICAgIGEgTGF0dGljZUZhY3RvcnkgdGVtcGxhdGUuXG4gICAgICBgKSlcbiAgICB9XG5cbiAgICBpZiAoXG4gICAgICAhZXh0ZW5kc0Zyb20odGVtcGxhdGUuZG9jcywgT2JqZWN0KSAgLy8gU3VwcG9ydHMgOTUlIG9mIG9iamVjdHNcbiAgICAgIHx8IHR5cGVvZiB0ZW1wbGF0ZS5kb2NzICE9PSAnb2JqZWN0JyAvLyBTdXBwb3J0cyBPYmplY3QuY3JlYXRlKG51bGwpXG4gICAgKSB7XG4gICAgICBsZXQgZHIgPSAnXFx4MWJbMzFtJywgYnIgPSAnXFx4MWJbOTFtJ1xuICAgICAgbGV0IGIxID0gJ1xceDFiWzFtJywgYjAgPSAnXFx4MWJbMjJtJ1xuICAgICAgbGV0IGJiID0gJ1xceDFiWzkwbSdcbiAgICAgIGxldCBkZyA9ICdcXHgxYlszN20nLCBiZyA9ICdcXHgxYls5N20nXG4gICAgICBsZXQgYTAgPSAnXFx4MWJbMG0nXG4gICAgICBsZXQgZ3IgPSAnXFx4MWJbMzJtJywgYmdyID0gJ1xceDFiWzkybSdcblxuICAgICAgcmVzdWx0cy5lcnJvcnMucHVzaChuZXcgRXJyb3IoY3VzdG9tRGVkZW50KHtkcm9wTG93ZXN0OnRydWV9KWBcXHgxYlsxOzkxbVxuICAgICAgICBUaGUgXFxgdGVtcGxhdGUuZG9jc1xcYCBmaWVsZCBtdXN0IGJlIGFuIG9iamVjdCBjb250YWluaW5nIGtleXMgYW5kXG4gICAgICAgIHZhbHVlIHBhaXJzIG1hdGNoaW5nIHRoZSB0eXBlcywgZW51bXMsIHVuaW9ucyBhbmQgaW50ZXJmYWNlcyBkZWZpbmVkXG4gICAgICAgIGluIHlvdXIgc2NoZW1hLlxuXG4gICAgICAgIFRoZSBzcGVjaWFsIFN5bWJvbCBvYmplY3QgVFlQRSBjYW4gYmUgdXNlZCB0byByZWZlcmVuY2UgdGhlIGRvY3MgZm9yXG4gICAgICAgIHRoZSBuYW1lZCBvciBrZXllZCBmaWVsZCBkZXNjcmliaW5nIHRoZSBkb2N1bWVudGF0aW9uIHRvIGJlIHByb2Nlc3NlZFxuICAgICAgICBDb21tZW50cyBmb3IgdGhlIFxcYFF1ZXJ5XFxgLCBcXGBNdXRhdGlvblxcYCwgYW5kIFxcYFN1YnNjcmlwdGlvblxcYCBbVFlQRV1cbiAgICAgICAgZW50cmllcyB3aWxsIHJlcGxhY2UgYW55IHByZXZpb3VzIG9uZSB0aGF0IGNvbWVzIGJlZm9yZSBpdC4gVHlwaWNhbGx5XG4gICAgICAgIHRoaXMgZmllbGQgaXMgYmVzdCBsZWZ0IHVuZGVzY3JpYmVkIHNpbmNlIHRoZXJlIHdpbGwgZXZlciBvbmx5IGJlXG4gICAgICAgIG9uZSBvZiBlYWNoIGF0IG1vc3QuXG5cbiAgICAgICAgXFx4MWJbMjI7MzFtRXhhbXBsZXMgc2hvdWxkIGxvb2sgc29tZXRoaW5nIGxpa2UgdGhpczpcXHgxYlsyMjszN21cbiAgICAgICAgICBpbXBvcnQgeyBUWVBFLCBqb2luTGluZXMgfSBmcm9tICdncmFwaHFsLWxhdHRpY2UnXG5cbiAgICAgICAgICBleHBvcnQgZGVmYXVsdCB7XG4gICAgICAgICAgICAke2JifS8qIG90aGVyIGZpZWxkcyAqLyR7ZGd9XG5cbiAgICAgICAgICAgICR7YjF9c2NoZW1hOiR7YjB9IGpvaW5MaW5lcyR7Z3J9XFxgXG4gICAgICAgICAgICAgIHR5cGUgUGVyc29uIHsgaWQ6IElEIG5hbWU6IFN0cmluZyB9XG4gICAgICAgICAgICAgIHR5cGUgUXVlcnkgeyBmaW5kUGVyc29uKGlkOiBJRCk6IFBlcnNvbiB9XG4gICAgICAgICAgICAgIHR5cGUgTXV0YXRpb24geyBzZXRQZXJzb25OYW1lKGlkOiBJRCwgbmFtZTogU3RyaW5nKTogUGVyc29uIH1cbiAgICAgICAgICAgIFxcYCR7ZGd9LFxuXG4gICAgICAgICAgICAke2IxfWRvY3M6JHtiMH0ge1xuICAgICAgICAgICAgICAke2IxfVBlcnNvbjoke2IwfSB7XG4gICAgICAgICAgICAgICAgW1RZUEVdOiAke2dyfSdBIGNvbnRyaXZlZCBwZXJzb24gdHlwZScke2RnfSxcbiAgICAgICAgICAgICAgICBpZDogJHtncn0nQSB1bmlxdWUgaWRlbnRpZmllciBmb3IgYSBwZXJzb24nJHtkZ30sXG4gICAgICAgICAgICAgICAgbmFtZTogJHtncn0nQSBzdHJpbmcgZGVub3RpbmcgdGhlIG5hbWUgb2YgYSBwZXJzb24nJHtkZ31cbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgJHtiMX1RdWVyeToke2IwfSB7XG4gICAgICAgICAgICAgICAgZmluZFBlcnNvbjogJHtncn0nQSBxdWVyeSB0YWtpbmcgYW4gSUQsIHJldHVybnMgYSBQZXJzb24nJHtkZ30sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICR7YjF9TXV0YXRpb246JHtiMH0ge1xuICAgICAgICAgICAgICAgIHNldFBlcnNvbk5hbWU6IGpvaW5MaW5lcyR7Z3J9XFxgXG4gICAgICAgICAgICAgICAgICBBIG11dGF0aW9uIHRoYXQgc2V0cyB0aGUgbmFtZSBvZiB0aGUgdXNlciBpZGVudGlmaWVkIGJ5IGFuXG4gICAgICAgICAgICAgICAgICBJRCB0byB0aGUgbmV3IG5hbWUgdmFsdWUgc3VwcGxpZWRcbiAgICAgICAgICAgICAgICBcXGAke2RnfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICBcXHgxYlsyMjszMW1cbiAgICAgICAgTm90ZSB0aGUgdXNhZ2Ugb2YgXFxgUGVyc29uXFxgLCBcXGBRdWVyeVxcYCBhbmQgXFxgTXV0YXRpb25cXGAgZXhwbGljaXRseVxuICAgICAgICBhcyBrZXlzIHRvIHRoZSBzdXBwbGllZCBcXGBkb2NzXFxgIG9iamVjdC5cXHgxYlswbVxuICAgICAgYCkpXG4gICAgfVxuXG4gICAgaWYgKCFyZXN1bHRzLnZhbGlkKSB7XG4gICAgICBsZXQgZXJyb3JTdHJpbmdzID0gW11cblxuICAgICAgZm9yIChsZXQgZXJyb3Igb2YgcmVzdWx0cy5lcnJvcnMpIHtcbiAgICAgICAgbGV0IHsgbWVzc2FnZSwgc3RhY2sgfSA9IGVycm9yXG5cbiAgICAgICAgc3RhY2sgPSBzdGFja1xuICAgICAgICAgIC50cmltKClcbiAgICAgICAgICAuc3BsaXQoJ1xcbicpXG4gICAgICAgICAgLnNwbGljZShtZXNzYWdlLnNwbGl0KCdcXG4nKS5sZW5ndGgpXG4gICAgICAgICAgLm1hcChzID0+IHMudHJpbSgpKVxuICAgICAgICAgIC5qb2luKCdcXG4nKVxuICAgICAgICBtZXNzYWdlID0gbWVzc2FnZS5yZXBsYWNlKC8oRXJyb3I6XFxzKS8sICckMVxcbicpLnRyaW0oKVxuXG4gICAgICAgIGVycm9yU3RyaW5ncy5wdXNoKFxuICAgICAgICAgIGBcXHgxYlszMTsxbSR7bWVzc2FnZX1cXHgxYlswbVxcbmAgKyBpbmRlbnQoc3RhY2spXG4gICAgICAgIClcbiAgICAgIH1cblxuICAgICAgbGV0IGVycm9yID0gbmV3IEVycm9yKGN1c3RvbURlZGVudCh7ZHJvcExvd2VzdDp0cnVlfSlgXG4gICAgICAgIE9PUFMhXG5cbiAgICAgICAgQW4gZXJyb3Igb2NjdXJyZWQgdmFsaWRhdGluZyB5b3VyIGZhY3RvcnkgdGVtcGxhdGUuIFRoZSBvYmplY3RcbiAgICAgICAgaW4gcXVlc3Rpb24gaXMgYXMgZm9sbG93czpcblxuICAgICAgICBAdGVtcGxhdGVcblxuICAgICAgICBUaGUgaW5kaXZpZHVhbCBlcnJvcnMgdGhhdCBvY2N1cnJlZCBhcmU6XG4gICAgICAgIFxcbkBlcnJvcnNgXG4gICAgICAgIC5yZXBsYWNlKC9AdGVtcGxhdGUvLCBpbmRlbnQoX2kodGVtcGxhdGUpKSlcbiAgICAgICAgLnJlcGxhY2UoL0BlcnJvcnMvLCBlcnJvclN0cmluZ3Muam9pbignXFxuXFxuJykpXG4gICAgICApXG5cbiAgICAgIGVycm9yLnN0YWNrID0gZXJyb3IubWVzc2FnZVxuICAgICAgZXJyb3IubWVzc2FnZSA9ICcnXG5cbiAgICAgIGlmICghaGlkZSkgdGhyb3cgZXJyb3JcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0c1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBzdGFydGluZyBwb2ludCBvZiBhIExhdHRpY2VGYWN0b3J5IG9iamVjdCAtPiBjbGFzcyBjcmVhdGlvbi4gVGhlIG5hbWVcbiAgICogb2YgdGhlIGNsYXNzIGFuZCBiYXNlQ2xhc3MgdG8gdXNlIGFyZSBwcm92aWRlZCBhbmQgYXJlIGNyZWF0ZWQgZnJvbSB0aGVyZS5cbiAgICogQXQgdGhpcyBwb2ludCwgdGhlIGdlbmVyYXRlZCBjbGFzcyBpcyBzdGlsbCBpbmNvbXBsZXRlLiBJdCBtdXN0IGNvbXBsZXRlXG4gICAqIHRoZSBlbnRpcmUgY2hlY2tsaXN0IGJlZm9yZSBiZWluZyBkZWVtZWQgdmFsaWQuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIG5hbWUgb2YgdGhlIGNsYXNzIHRvIGNyZWF0ZVxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBiYXNlQ2xhc3MgdGhlIExhdHRpY2UgY2xhc3MgeW91ciBuZXcgY2xhc3Mgc2hvdWxkIGV4dGVuZDtcbiAgICogd2hpbGUgdGhpcyBjYW4gYmUgYW55dGhpbmcsIGl0IHNob3VsZCBiZSBHUUxCYXNlLCBHUUxJbnRlcmZhY2UsIEdRTEVudW0gb3JcbiAgICogR1FMVW5pb24uIFRoaXMgZGVmYXVsdHMgdG8gR1FMQmFzZSBzaG91bGQgbm90aGluZyBiZSBzdXBwbGllZFxuICAgKiBAcmV0dXJuIHtGdW5jdGlvbn0gYWN0dWFsbHkgdGhpcyByZXR1cm5zIHRoZSBnZW5lcmF0ZWQgY2xhc3NcbiAgICovXG4gIHN0YXRpYyBnZW5lcmF0ZUNsYXNzKG5hbWU6IHN0cmluZywgYmFzZUNsYXNzOiBGdW5jdGlvbiA9IEdRTEJhc2UpIHtcbiAgICBpZiAoIW5hbWUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignTGF0dGljZUZhY3RvcnkuZ2VuZXJhdGVDbGFzcyBuZWVkcyBhIG5hbWUhIScpXG4gICAgfVxuXG4gICAgLy8gQWxyaWdodCBsYWRpZXMgYW5kIGdlbnRsZW1lbiwgaG9sZCBvbnRvIHlvdXIgaGF0czsgd2UncmUgZW50ZXJpbmcgdGhlXG4gICAgLy8gbWV0YSB6b25lISEhIFRoZSB3YXkgdGhlIGZvbGxvd2luZyB3b3JrcyBpcyB0byBtYWtlIHN1cmUgdGhhdCBvdXJcbiAgICAvLyBwYXNzZWQgaW4gYmFzZSBjbGFzcyBgYmFzZUNsYXNzYCBpcyBhY3R1YWxseSBpbiBzY29wZSBhcyB0aGUgbmFtZSBvZlxuICAgIC8vIHRoZSB2YWx1ZSBpdCByZXByZXNlbnRzLiBXZSB1c2UgdGhlIGBuZXcgRnVuY3Rpb24oKWAgc3ludGF4IHRvIGRvIHRoYXRcbiAgICAvLyBidXQgd2UgZG8gaXQgdmlhIGV2YWwgc2luY2Ugd2UgZG9uJ3Qga25vdyB0aGUgbmFtZSBvZiB0aGUgZnVuY3Rpb25cbiAgICAvLyBhdCB0aGUgdGltZSB3ZSB3cml0ZSB0aGUgY29kZVxuICAgIC8vXG4gICAgLy8gU28gZ2l2ZW4gYSBjbGFzcyBuYW1lIG9mIFwiQ2FyXCIgYW5kIGJhc2VOYW1lIGVxdWFsbGluZyBHUUxCYXNlLCB0aGUgQ2xhc3NcbiAgICAvLyBpbnN0YW5jZSwgZm4gd291bGQgbG9vayBzb21ldGhpbmcgbGlrZSB0aGUgcmVzdWx0cyBvZiBjYWxsaW5nIHRoaXNcbiAgICAvL1xuICAgIC8vIGxldCBmbiA9IG5ldyBGdW5jdGlvbihcbiAgICAvLyAgIFwiR1FMQmFzZVwiLFxuICAgIC8vICAgXCJjbGFzcyBDYXIgZXh0ZW5kcyBHUUxCYXNlIHt9OyByZXR1cm4gQ2FyO1wiXG4gICAgLy8gKVxuICAgIC8vXG4gICAgLy8gV2hpY2ggaW4gdHVybiBzZXRzIGZuIHRvIHNvbWV0aGluZyB0aGF0IHdvdWxkIGJlIHRoZSBzYW1lIGFzXG4gICAgLy9cbiAgICAvLyBmdW5jdGlvbiBmbihHUUxCYXNlKSB7IGNsYXNzIENhciBleHRlbmRzIEdRTEJhc2Uge307IHJldHVybiBDYXIgfVxuICAgIC8vXG4gICAgLy8gV2hpY2ggbWVhbnMgdGhhdCB3aGVuIHdlIGludm9rZSBmbihiYXNlQ2xhc3MpLCB3aGljaCBpcyBmbihHUUxCYXNlKSxcbiAgICAvLyB3ZSBnZXQgdGhlIHJlc3VsdHMgd2UgaW50ZW5kOyBldmVuIGlmIEdRTEJhc2UgaXMgbm90IG5lY2Vzc2FyaWx5IGluXG4gICAgLy8gdGhlIHNjb3BlIG9mIHRoZSBmdW5jdGlvbiBhdCB0aGUgdGltZSBvZiBjYWxsLiBOZWF0LiBTY2FyeS4gT01HIFRoYW5rc1xuICAgIC8vIGZvciBjb2RlIGNvbW1lbnRzLiBZb3UncmUgd2VsY29tZSBmdXR1cmUgbWUuXG4gICAgbGV0IGZuID0gZXZhbChgKG5ldyBGdW5jdGlvbihcbiAgICAgIFwiJHtiYXNlQ2xhc3MubmFtZX1cIixcbiAgICAgIFwiY2xhc3MgJHtuYW1lfSBleHRlbmRzICR7YmFzZUNsYXNzLm5hbWV9IHt9OyByZXR1cm4gJHtuYW1lfTtcIlxuICAgICkpYCk7XG5cbiAgICBsZXQgQ2xhc3MgPSBmbihiYXNlQ2xhc3MpXG5cbiAgICB0aGlzLmJyYW5kQ2xhc3MoQ2xhc3MpXG4gICAgbmV3Q2hlY2tsaXN0KENsYXNzKVxuXG4gICAgcmV0dXJuIENsYXNzO1xuICB9XG5cbiAgLyoqXG4gICAqIEluamVjdHMgdGhlIFNDSEVNQSBwcm9wZXJ0eSBpbnRvIHRoZSBuZXdseSBkZWZpbmVkIGNsYXNzLiBUaGUgc3VwcGxpZWRcbiAgICogYHNjaGVtYWAgc3RyaW5nIGJlY29tZXMgd2hhdCB0aGUgbmV3IGNsYXNzIHJldHVybnMgd2hlbiBgLlNDSEVNQWAgaXNcbiAgICogZ290dGVuLlxuICAgKlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBDbGFzcyB0aGlzIHdpbGwgdGhyb3cgYW4gZXJyb3IgaWYgdGhlIGNsYXNzIGlzIG5vdCBvbmVcbiAgICogZ2VuZXJhdGVkIGJ5IHRoZSBMYXR0aWNlRmFjdG9yeSBvciBpZiB0aGUgY2xhc3MgaXRzZWxmIGlzIG51bGwgb3IgdW5kZWZpbmVkXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzY2hlbWEgdGhlIHN0cmluZyB0aGF0IHRoZSBuZXcgY2xhc3Mgc2hvdWxkIHJldHVyblxuICAgKiBAcmV0dXJuIHtGdW5jdGlvbn0gcmV0dXJucyB0aGUgbW9kaWZpZWQgQ2xhc3Mgd2l0aCB0aGUgYENIRUNLX1NDSEVNQWBcbiAgICogcG9ydGlvbiB0aWNrZWQgb2ZmIGludGVybmFsbHkuXG4gICAqL1xuICBzdGF0aWMgaW5qZWN0U2NoZW1hKENsYXNzOiBGdW5jdGlvbiwgc2NoZW1hOiBzdHJpbmcpIHtcbiAgICBpZiAoIUNsYXNzIHx8ICFoYXNDaGVja2xpc3QoQ2xhc3MpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoY3VzdG9tRGVkZW50KHtkcm9wTG93ZXN0OnRydWV9KWBcbiAgICAgICAgRWl0aGVyIHRoZSBzdXBwbGllZCBzY2hlbWEgc3RyaW5nIGlzIGludmFsaWRcbiAgICAgICAgICBTQ0hFTUE6IFxcYFxuICAgICAgICAgICAgJHtzY2hlbWF9XG4gICAgICAgICAgXFxgXG5cbiAgICAgICAgT3IgeW91ciBzdXBwbGllZCBjbGFzcyAkeyhDbGFzcyAmJiBDbGFzcy5uYW1lKSB8fCAndW5kZWZpbmVkJ30gaXNcbiAgICAgICAgbm9uLWV4aXN0ZW50LiBQbGVhc2UgY2hlY2sgeW91ciBjb2RlIGFuZCB0cnkgdGhlIExhdHRpY2VGYWN0b3J5XG4gICAgICAgIGFnYWluLlxuICAgICAgYClcbiAgICB9XG5cbiAgICAvLyAkRmxvd0ZpeE1lXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KENsYXNzLCAnU0NIRU1BJywge1xuICAgICAgZ2V0KCkgeyByZXR1cm4gc2NoZW1hIH1cbiAgICB9KVxuXG4gICAgc2V0Q2hlY2tsaXN0KENsYXNzLCBDSEVDS19TQ0hFTUEpXG5cbiAgICByZXR1cm4gQ2xhc3NcbiAgfVxuXG4gIC8qKlxuICAgKiBJbmplY3RzIHRoZSByZXNvbHZlcnMgaW50byBhcHByb3ByaWF0ZSBhcmVhcy4gUmVzb2x2ZXJzIGtleWVkIGJ5IGBRdWVyeWAsXG4gICAqIGBNdXRhdGlvbmAsIG9yIGBTdWJzY3JpcHRpb25gIHdpbGwgYmUgcGxhY2VkIGludG8gdGhlIGFwcHJvcHJpYXRlIGFyZWFcbiAgICogaW4gYENsYXNzW01FVEFfS0VZXWAgd2hpY2ggYWN0cyBhcyBhIHN0YWdpbmcgYXJlYSBvcmlnaW5hbGx5IGRlc2lnbmVkIGZvclxuICAgKiB1c2Ugd2l0aCB0aGUgQHJlc29sdmVyLCBAbXV0YXRvciBhbmQgQHN1YnNjcmlwdG9yIGRlY29yYXRvcnMuIFRoZXNlIHdpbGxcbiAgICogYmUgYm91bmQgaW4gYSB0eXBpY2FsIGZhc2hpb24gYXMgaXMgZG9uZSB3aXRoIHRoZSBkZWNvcmF0b3JzIG1ha2luZyB0aGVcbiAgICogZmlyc3QgcGFyYW1ldGVyIGJlY29taW5nIHRoZSByZXF1ZXN0RGF0YSBvZiB0aGUgb2JqZWN0IGluc3RhbmNlIGFuZCB0aGVcbiAgICogc2Vjb25kIGJlaW5nIHRoZSBvYmplY3QgY29udGFpbmluZyB0aGUgcGFyYW1ldGVycyBmb3IgdGhlIHJlc29sdmVyIGFzXG4gICAqIHBhc3NlZCBpbiBieSBHcmFwaFFMLiBTdWJzZXF1ZW50IHBhcmFtZXRlcnMgd2lsbCBiZSBzdXBwbGllZCBhcyBpcyB0aGVcbiAgICogZmFzaGlvbiBvZiB0aGUgc3lzdGVtIHlvdSdyZSB1c2luZzsgRmFjZWJvb2sncyByZWZlcmVuY2UgaW1wbGVtZW50YXRpb24gb3JcbiAgICogQXBvbGxvIG9yIHNvbWV0aGluZyBlbHNlLlxuICAgKlxuICAgKiBSZXNvbHZlcnMga2V5ZWQgYnkgdHlwZSBuYW1lIGFyZSBjb25zaWRlcmVkIHRvIGJlIGZpZWxkIHJlc29sdmVycyBhbmRcbiAgICogaGF2ZSBhIGRpZmZlcmVudCBzaWduYXR1cmUuIFRoZXkgY2FuIGJlIHByb3BlcnRpZXMgb2YgdGhlIGtleSwgaW5cbiAgICogd2hpY2ggY2FzZSB0aGV5IHdpbGwgc2ltcGx5IGJlIGluc3RhbGxlZCBhcyBnZXR0ZXJzLiBPciB0aGV5IGNhbiBiZVxuICAgKiBmdW5jdGlvbnM7IHN5bmNocm9ub3VzIG9yIGFzeW5jaHJvbm91cy4gRnVuY3Rpb24gZmllbGQgcmVzb2x2ZXJzIGFyZVxuICAgKiBpbnN0YW5jZSBtZXRob2RzIGFuZCBjYW4gbWFrZSB1c2Ugb2YgYHRoaXMuZ2V0TW9kZWwoKWAgb3JcbiAgICogYHRoaXMucmVxdWVzdERhdGFgIGludGVybmFsbHkuXG4gICAqXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IENsYXNzIHRoZSBjbGFzcywgZ2VuZXJhdGVkIGJ5IGdlbmVyYXRlQ2xhc3MoKSBsZXN0IGFuXG4gICAqIGVycm9yIGJlIHRocm93biwgdG8gd2hpY2ggdG8gYWRkIHRoZSByZXNvbHZlcnMgZnJvbSBhIHRlbXBsYXRlXG4gICAqIEBwYXJhbSB7T2JqZWN0fSByZXNvbHZlck9iaiBhbiBvYmplY3QgY29udGFpbmluZyB0aGUgcmVzb2x2ZXJzIGFzIGRpY3RhdGVkXG4gICAqIGJ5IHRoZSBuZXcgZm9ybWF0LlxuICAgKiBAcmV0dXJuIHtGdW5jdGlvbn0gcmV0dXJucyB0aGUgbW9kaWZpZWQgQ2xhc3Mgd2l0aCB0aGUgYENIRUNLX1JFU09MVkVSU2BcbiAgICogcG9ydGlvbiB0aWNrZWQgb2ZmIGludGVybmFsbHkuXG4gICAqL1xuICBzdGF0aWMgaW5qZWN0UmVzb2x2ZXJzKENsYXNzOiBGdW5jdGlvbiwgcmVzb2x2ZXJzOiBPYmplY3QpOiBGdW5jdGlvbiB7XG4gICAgaWYgKCFoYXNDaGVja2xpc3QoQ2xhc3MsIENIRUNLX1NDSEVNQSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihjdXN0b21EZWRlbnQoe2Ryb3BMb3dlc3Q6dHJ1ZX0pYFxuICAgICAgICBcXGBpbmplY3RSZXNvbHZlcnNcXGAgY2Fubm90IGJlIGNhbGxlZCBvbiBhIGNsYXNzIHdpdGhvdXQgYSBTQ0hFTUEuXG4gICAgICAgIFBsZWFzZSB2ZXJpZnkgeW91ciBwcm9ncmVzcyBpbiB0aGUgcHJvY2VzcyBhbmQgdHJ5IGFnYWluLlxuICAgICAgYClcbiAgICB9XG5cbiAgICBsZXQgdHJlZSA9IFN5bnRheFRyZWUuZnJvbShDbGFzcy5TQ0hFTUEpXG4gICAgbGV0IG91dGxpbmUgPSB0cmVlID8gdHJlZS5vdXRsaW5lIDoge31cblxuICAgIGlmIChDbGFzcy5uYW1lIGluIG91dGxpbmUgJiYgQ2xhc3MubmFtZSBpbiByZXNvbHZlcnMpIHtcbiAgICAgIGxldCBmaWVsZHMgPSBPYmplY3Qua2V5cyhvdXRsaW5lW0NsYXNzLm5hbWVdKVxuXG4gICAgICBmb3IgKGxldCBmaWVsZFJlc29sdmVyIG9mIGZpZWxkcykge1xuICAgICAgICBpZiAoIWZpZWxkUmVzb2x2ZXIgaW4gcmVzb2x2ZXJzW0NsYXNzLm5hbWVdKSB7XG4gICAgICAgICAgTEwud2FybihjdXN0b21EZWRlbnQoe2Ryb3BMb3dlc3Q6IHRydWV9KWBcbiAgICAgICAgICAgICR7ZmllbGRSZXNvbHZlcn0gbm90IHN1cHBsaWVkIGluIHJlc29sdmVycyBmb3IgJHtDbGFzcy5uYW1lfVxuICAgICAgICAgIGApXG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgcHJvcCA9IHJlc29sdmVyc1tDbGFzcy5uYW1lXVtmaWVsZFJlc29sdmVyXVxuXG4gICAgICAgIGlmIChwcm9wICYmIHR5cGVvZiBwcm9wID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgTEwuaW5mbygnSW5qZWN0aW5nIFtmbl0gJXMnLCBmaWVsZFJlc29sdmVyKVxuICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShDbGFzcy5wcm90b3R5cGUsIGZpZWxkUmVzb2x2ZXIsIHtcbiAgICAgICAgICAgIHZhbHVlOiBwcm9wXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBMTC5pbmZvKCdJbmplY3RpbmcgW3Byb3BdICVzJywgZmllbGRSZXNvbHZlcilcbiAgICAgICAgICBQcm9wZXJ0aWVzKGZpZWxkUmVzb2x2ZXIpKENsYXNzLCBbJ2ZhY3RvcnktcHJvcHMnXSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGZvciAobGV0IFt0eXBlOiBzdHJpbmcsIGRlY29yYXRvcjogRnVuY3Rpb25dIG9mIFtcbiAgICAgIFsnUXVlcnknLCByZXNvbHZlcl0sXG4gICAgICBbJ011dGF0aW9uJywgbXV0YXRvcl0sXG4gICAgICBbJ1N1YnNjcmlwdGlvbicsIHN1YnNjcmlwdG9yXVxuICAgIF0pIHtcbiAgICAgIGxldCBrZXlzID0gT2JqZWN0LmtleXMob3V0bGluZVt0eXBlXSB8fCB7fSlcblxuICAgICAgLy8gJEZsb3dGaXhNZVxuICAgICAgaWYgKCF0eXBlIGluIG91dGxpbmUgfHwgIWtleXMubGVuZ3RoKSB7IGNvbnRpbnVlOyB9XG5cbiAgICAgIGZvciAobGV0IGZuTmFtZSBvZiBrZXlzKSB7XG4gICAgICAgIGxldCBmbiA9IHJlc29sdmVyc1tmbk5hbWVdXG4gICAgICAgIGRlY29yYXRvcihDbGFzcywgZm5OYW1lLCB7dmFsdWU6IGZufSlcbiAgICAgICAgTEwuaW5mbygnQWRkaW5nICVzIHJlc29sdmVyIFslc10nLCB0eXBlLCBmbk5hbWUpXG4gICAgICB9XG4gICAgfVxuXG4gICAgc2V0Q2hlY2tsaXN0KENsYXNzLCBDSEVDS19SRVNPTFZFUlMpXG5cbiAgICByZXR1cm4gQ2xhc3NcbiAgfVxuXG4gIHN0YXRpYyBpbmplY3REb2NzKENsYXNzOiBGdW5jdGlvbiwgZG9jczogT2JqZWN0KTogRnVuY3Rpb24ge1xuICAgIGlmICghaGFzQ2hlY2tsaXN0KENsYXNzLCBDSEVDS19TQ0hFTUEsIENIRUNLX1JFU09MVkVSUykpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihjdXN0b21EZWRlbnQoe2Ryb3BMb3dlc3Q6dHJ1ZX0pYFxuICAgICAgICBcXGBpbmplY3REb2NzXFxgIGNhbm5vdCBiZSBjYWxsZWQgb24gYSBjbGFzcyB3aXRob3V0IGEgU0NIRU1BIG9yXG4gICAgICAgIFJFU09MVkVSUyBkZWZpbmVkLiBQbGVhc2UgdmVyaWZ5IHlvdXIgcHJvZ3Jlc3MgaW4gdGhlIHByb2Nlc3MgYW5kIHRyeVxuICAgICAgICBhZ2Fpbi5cbiAgICAgIGApXG4gICAgfVxuXG4gICAgbGV0IGNvcHlQcm9wID0gKFxuICAgICAgbzogbWl4ZWQsXG4gICAgICBwcm9wOiBzdHJpbmcgfCBTeW1ib2wsXG4gICAgICB0bzogbWl4ZWQsXG4gICAgICBhczogPyhzdHJpbmcgfCBTeW1ib2wpXG4gICAgKTogbWl4ZWQgPT4ge1xuICAgICAgLy8gJEZsb3dGaXhNZVxuICAgICAgbGV0IHByb3RvdHlwZSA9IG8ucHJvdG90eXBlIHx8IE9iamVjdC5nZXRQcm90b3R5cGVPZihvKVxuICAgICAgbGV0IGRlc2NyaXB0b3IgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHByb3RvdHlwZSwgcHJvcClcblxuICAgICAgaWYgKCFhcykge1xuICAgICAgICBhcyA9IHByb3BcbiAgICAgIH1cblxuICAgICAgaWYgKGRlc2NyaXB0b3IpIHtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRvLCBhcywgZGVzY3JpcHRvcilcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICAvLyAkRmxvd0ZpeE1lXG4gICAgICAgIHRvW2FzXSA9IG9bcHJvcF1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBDcmVhdGUgYW4gb2JqZWN0IG91ciBmdXR1cmUgYHN0YXRpYyBhcGlEb2NzKClgIG1ldGhvZCBvZiBvdXIgZmFjdG9yeVxuICAgIC8vIGdlbmVyYXRlZCBjbGFzcyB3aWxsIHJldHVyblxuICAgIGxldCByZXN1bHQgPSB7fVxuXG4gICAgLy8gU2V0dXAgdGhlIGNvbnN0YW50cyB3ZSB3aWxsIG5lZWQgaW4gdGhpcyBjb252ZXJzaW9uXG4gICAgY29uc3QgeyBUWVBFIH0gPSB0aGlzO1xuICAgIGNvbnN0IHtcbiAgICAgIERPQ19DTEFTUywgRE9DX0ZJRUxEUywgRE9DX1FVRVJZLCBET0NfTVVUQVRJT04sIERPQ19TVUJTQ1JJUFRJT04sXG4gICAgICBET0NfUVVFUklFUywgRE9DX01VVEFUSU9OUywgRE9DX1NVQlNDUklQVElPTlNcbiAgICB9ID0gR1FMQmFzZVxuXG4gICAgLy8gVGhpcyBwYXJ0IG1pZ2h0IGdldCBhIGxpdHRsZSBtZXRhLCBzbyBJIGhhdmUgcHJvdmlkZWQgY29tbWVudHMuIFlvdSBhcmVcbiAgICAvLyB3ZWxjb21lIGZ1dHVyZSBtZS4gSSBob3BlIGl0IGhlbHBzLiBUaGlzIGduYXJseSBibG9jayBzaG91bGQgY292ZXIgYWxsXG4gICAgLy8gdGhlIGRlc2NyaXB0aW9ucyBmb3IgUXVlcnksIE11dGF0aW9uLCBTdWJzY3JpcHRpb24gYW5kIHRoZSBDbGFzcyB3ZVxuICAgIC8vIGFyZSBjcmVhdGluZy4gT3RoZXIgc3VwZXJmbHVvdXNcbiAgICBmb3IgKGxldCBbVHlwZSwgVG9wTGV2ZWxDb25zdGFudCwgRmllbGRDb25zdGFudHNdIG9mIFtcbiAgICAgIFsnUXVlcnknLCBET0NfUVVFUlksIERPQ19RVUVSSUVTXSxcbiAgICAgIFsnTXV0YXRpb24nLCBET0NfTVVUQVRJT04sIERPQ19NVVRBVElPTlNdLFxuICAgICAgWydTdWJzY3JpcHRpb24nLCBET0NfU1VCU0NSSVBUSU9OLCBET0NfU1VCU0NSSVBUSU9OU10sXG4gICAgICBbQ2xhc3MubmFtZSwgRE9DX0NMQVNTLCBET0NfRklFTERTXVxuICAgIF0pIHtcbiAgICAgIC8vIE9uZSBvZiAnUXVlcnknLCAnTXV0YXRpb24nLCBvciAnU3Vic2NyaXB0aW9uJ1xuICAgICAgaWYgKGRvY3NbVHlwZV0pIHtcbiAgICAgICAgLy8gSWYgYSB0b3AgbGV2ZWwgZGVzY3JpcHRpb24gaXMgcHJlc2VudCAoaS5lLiBRdWVyeSwgTXV0YXRpb24gb3JcbiAgICAgICAgLy8gU3Vic2NyaXB0aW9uIGRlc2NyaXB0aW9uKVxuICAgICAgICBpZiAoZG9jc1tUeXBlXVtUWVBFXSkge1xuICAgICAgICAgIGNvcHlQcm9wKGRvY3NbVHlwZV0sIFRZUEUsIHJlc3VsdCwgVG9wTGV2ZWxDb25zdGFudClcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEZldGNoIHRoZSBwcm9wZXJ0aWVzIGZyb20gdGhlIHN1cHBsaWVkIGRvY3Mgb2JqZWN0OyBUWVBFIFN5bWJvbHNcbiAgICAgICAgLy8gZG8gbm90IHNob3cgdXAgaW4gYSBjYWxsIHRvIGVudHJpZXMgd2hpY2ggaXMgd2h5IGl0IGlzIGhhbmRsZWQgYWJvdmVcbiAgICAgICAgLy8gJEZsb3dGaXhNZVxuICAgICAgICBsZXQgZW50cmllcyA9IE9iamVjdC5lbnRyaWVzKGRvY3NbVHlwZV0pXG5cbiAgICAgICAgLy8gSWYgd2UgaGF2ZSBlbnRyaWVzIHRvIGRvY3VtZW50LCBjcmVhdGUgYW4gb2JqZWN0IHRvIGhvbGQgdGhvc2VcbiAgICAgICAgLy8gdmFsdWVzOyBpLmUuIGlmIHdlIGhhdmUgYHsgUXVlcnk6IHsgZ2V0UGVvcGxlOiAnZGVzYycgfSB9YCwgd2UgbmVlZFxuICAgICAgICAvLyB0byBtYWtlIHN1cmUgd2UgaGF2ZSBgeyBbRE9DX1FVRVJJRVNdOiB7IGdldFBlb3BsZTogJ2Rlc2MnIH0gfWAgaW5cbiAgICAgICAgLy8gb3VyIHJlc3VsdC4gVGhlIG9iamVjdCBob2xkaW5nIGdldFBlb3BsZSBpbiB0aGUgZW5kIHRoZXJlIGlzIGRlZmluZWRcbiAgICAgICAgLy8gYmVsb3cgd2hlbiB3ZSBoYXZlIHNvbWV0aGluZyB0byBjb3B5LlxuICAgICAgICBpZiAoZW50cmllcy5sZW5ndGgpIHtcbiAgICAgICAgICByZXN1bHRbRmllbGRDb25zdGFudHNdID0ge31cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEZvciBlYWNoIG5hbWUgdmFsdWUgcGFpciBkZWZpbmVkIGFib3ZlLCBjb3B5IGl0cyBkZXNjcmlwdG9yIG9yIGJhc2VcbiAgICAgICAgLy8gdmFsdWUgaWYgYSBkZXNjcmlwdG9yIGlzbid0IGF2YWlsYWJsZVxuICAgICAgICBmb3IgKGxldCBbcHJvcCwgdmFsdWVdIG9mIGVudHJpZXMpIHtcbiAgICAgICAgICBjb3B5UHJvcChkb2NzW1R5cGVdLCBwcm9wLCByZXN1bHRbRmllbGRDb25zdGFudHNdKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KENsYXNzLCAnYXBpRG9jcycsIHtcbiAgICAgIHZhbHVlOiBmdW5jdGlvbigpIHsgcmV0dXJuIHJlc3VsdCB9XG4gICAgfSlcblxuICAgIHNldENoZWNrbGlzdChDbGFzcywgQ0hFQ0tfQVBJX0RPQ1MpXG5cbiAgICByZXR1cm4gQ2xhc3NcbiAgfVxuXG4gIHN0YXRpYyBidWlsZCh0ZW1wbGF0ZTogT2JqZWN0KTogRnVuY3Rpb24ge1xuICAgIGxldCB2YWxpZGF0aW9uUmVzdWx0cyA9IHRoaXMudmFsaWRhdGVUZW1wbGF0ZSh0ZW1wbGF0ZSlcbiAgICBsZXQgQ2xhc3MgPSB0aGlzLmdlbmVyYXRlQ2xhc3ModGVtcGxhdGUubmFtZSwgdGVtcGxhdGUudHlwZSB8fCBHUUxCYXNlKVxuXG4gICAgaWYgKCFDbGFzcykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGN1c3RvbURlZGVudCh7ZHJvcExvd2VzdDogdHJ1ZX0pYFxuICAgICAgICBMYXR0aWNlRmFjdG9yeSB3YXMgdW5hYmxlIHRvIGJ1aWxkIHlvdXIgQ2xhc3MgZnJvbSB0aGUgbmFtZSBhbmQgdHlwZXNcbiAgICAgICAgc3VwcGxpZWQgaW4geW91ciB0ZW1wbGF0ZS4gWW91IHByb3ZpZGVkIHRoZSBmb2xsb3dpbmcgdGVtcGxhdGUuIFBsZWFzZVxuICAgICAgICBsb29rIGl0IG92ZXIgYW5kIGNvcnJlY3QgYW55IGVycm9ycyBiZWZvcmUgdHJ5aW5nIGFnYWluLlxuXG4gICAgICAgIFxceDFiWzFtVGVtcGxhdGVcXHgxYlswbVxuICAgICAgICAgICR7X2kodGVtcGxhdGUpfVxuICAgICAgYClcbiAgICB9XG5cbiAgICB0aGlzLmluamVjdFNjaGVtYShDbGFzcywgdGVtcGxhdGUuc2NoZW1hKVxuICAgIHRoaXMuaW5qZWN0UmVzb2x2ZXJzKENsYXNzLCB0ZW1wbGF0ZS5yZXNvbHZlcnMgfHwge30pXG4gICAgdGhpcy5pbmplY3REb2NzKENsYXNzLCB0ZW1wbGF0ZS5kb2NzIHx8IHt9KVxuXG4gICAgLy8gTmVlZCB0byBmaXggaG93IGF1dG8tcHJvcHMgd29yazsgZm9yIG5vdyBjcmVhdGUgb25lIGluc3RhbmNlLi4uXG4gICAgbmV3IENsYXNzKHt9KVxuXG4gICAgaWYgKCFoYXNDaGVja2xpc3QoQ2xhc3MsIENIRUNLX1NDSEVNQSwgQ0hFQ0tfUkVTT0xWRVJTLCBDSEVDS19BUElfRE9DUykpIHtcbiAgICAgIGxldCBfc2NoZW1hID0gaGFzQ2hlY2tsaXN0KENsYXNzLCBDSEVDS19TQ0hFTUEpID8gJ+KchScgOiAn4p2MJ1xuICAgICAgbGV0IF9yZXNvbHZlcnMgPSBoYXNDaGVja2xpc3QoQ2xhc3MsIENIRUNLX1JFU09MVkVSUykgPyAn4pyFJyA6ICfinYwnXG4gICAgICBsZXQgX2FwaURvY3MgPSBoYXNDaGVja2xpc3QoQ2xhc3MsIENIRUNLX0FQSV9ET0NTKSA/ICfinIUnIDogJ+KdjCdcblxuICAgICAgdGhyb3cgbmV3IEVycm9yKGN1c3RvbURlZGVudCh7ZHJvcExvd2VzdDogdHJ1ZX0pYFxuICAgICAgICBTb21ldGhpbmcgd2VudCB3cm9uZyBpbiB0aGUgcHJvY2VzcyBvZiBidWlsZGluZyB0aGUgY2xhc3MgY2FsbGVkXG4gICAgICAgICR7Q2xhc3MgJiYgQ2xhc3MubmFtZSB8fCB0ZW1wbGF0ZSAmJiB0ZW1wbGF0ZS5uYW1lIHx8ICdVbmtub3duISd9LFxuICAgICAgICBwbGVhc2UgY2hlY2sgdGhlIHN1cHBsaWVkIHRlbXBsYXRlIGZvciBlcnJvcnMuXG5cbiAgICAgICAgWyAke19zY2hlbWF9IF0gSGFzIGEgU0NIRU1BIGRlZmluZWRcbiAgICAgICAgWyAke19yZXNvbHZlcnN9IF0gSGFzIGRlZmluZWQgUkVTT0xWRVJTIG1hdGNoaW5nIHRoZSBTQ0hFTUFcbiAgICAgICAgWyAke19hcGlEb2NzfSBdIEhhcyBkZWZpbmVkIEFQSSBEb2NzIG1hdGNoaW5nIHRoZSBTQ0hFTUFcblxuICAgICAgICBcXHgxYlsxbVRlbXBsYXRlXFx4MWJbMG1cbiAgICAgICAgJHtfaSh0ZW1wbGF0ZSl9XG5cbiAgICAgICAgXFx4MWJbMW1DbGFzc1xceDFiWzBtXG4gICAgICAgICR7X2koQ2xhc3MpfVxuICAgICAgYClcbiAgICB9XG5cbiAgICByZXR1cm4gQ2xhc3NcbiAgfVxuXG4gIC8qKlxuICAgKiBBIHN0YXRpYyBoZWxwZXIgbWV0aG9kIHRvIGNvbnNpc3RlbnRseSB0YWcsIG9yIGJyYW5kLCBjbGFzc2VzIHdpdGggYVxuICAgKiBzeW1ib2wgdGhhdCBkZW5vdGVzIHRoZXkgd2VyZSBjcmVhdGVkIHVzaW5nIHRoZSBMYXR0aWNlRmFjdG9yeSBwcm9jZXNzLlxuICAgKiBUaGlzIGlzIGRvbmUgYnkgc2V0dGluZyBhIGBTeW1ib2xgIG9uIHRoZSByb290IG9mIHRoZSBjbGFzcyBvciBpbiB0aGVcbiAgICogYFtNRVRBX0tFWV1gIG9iamVjdCBmb3IgY2xhc3NlcyBleHRlbmRpbmcgYEdRTEJhc2VgLlxuICAgKlxuICAgKiBAbWV0aG9kIOKMvuKggGJyYW5kQ2xhc3NcbiAgICogQG1lbWJlcm9mIExhdHRpY2VGYWN0b3J5XG4gICAqIEBzdGF0aWNcbiAgICpcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gQ2xhc3MgdGhlIGNsYXNzIHRvIGJyYW5kIHdpdGggdGhlIGBGQUNUT1JZX0NMQVNTYCBzeW1ib2xcbiAgICogQHJldHVybiB7RnVuY3Rpb259IHJldHVybnMgdGhlIENsYXNzIHZhbHVlIHBhc3NlZCBpblxuICAgKi9cbiAgc3RhdGljIGJyYW5kQ2xhc3MoQ2xhc3M6ID9GdW5jdGlvbik6ID9GdW5jdGlvbiB7XG4gICAgaWYgKENsYXNzKSB7XG4gICAgICBpZiAoZXh0ZW5kc0Zyb20oQ2xhc3MsIEdRTEJhc2UpKSB7XG4gICAgICAgIENsYXNzW01FVEFfS0VZXVt0aGlzLkZBQ1RPUllfQ0xBU1NdID0gdHJ1ZVxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIENsYXNzW3RoaXMuRkFDVE9SWV9DTEFTU10gPSB0cnVlXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIENsYXNzXG4gIH1cblxuICAvKipcbiAgICogQSBzdGF0aWMgaGVscGVyIHRvIGNoZWNrIGFuZCBzZWUgaWYgdGhlIHN1cHBsaWVkIGNsYXNzIG9yIGZ1bmN0aW9uIHdhc1xuICAgKiBicmFuZGVkIHdpdGggdGhlIGBicmFuZENsYXNzKClgIGZ1bmN0aW9uLiBUaGlzIGFtb3VudHMgdG8gc3RvcmluZyB0aGVcbiAgICogYm9vbGVhbiB0cnVlIHVuZGVyIHRoZSBwcm9wZXJ0eSBgQ2xhc3NbTGF0dGljZUZhY3RvcnkuRkFDVE9SWV9DTEFTU11gIG9yXG4gICAqIGBDbGFzc1tNRVRBX0tFWV1bTGF0dGljZUZhY2F0b3J5LkZBQ1RPUllfQ0xBU1NdYCBmb3IgYEdRTEJhc2VgIGV4dGVuZGVkXG4gICAqIGNsYXNzZXMuXG4gICAqXG4gICAqIEBtZXRob2Qg4oy+4qCAaXNGYWN0b3J5Q2xhc3NcbiAgICogQG1lbWJlcm9mIExhdHRpY2VGYWN0b3J5XG4gICAqIEBzdGF0aWNcbiAgICpcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gQ2xhc3MgdGhlIGNsYXNzIHRvIGNoZWNrIGZvciBgRkFDVE9SWV9DTEFTU2AgYnJhbmRpbmdcbiAgICogQHJldHVybiB7Ym9vbGVhbn0gdHJ1ZSBpZiB0aGUgYnJhbmQgZXhpc3RzLCBmYWxzZSBvdGhlcndpc2VcbiAgICovXG4gIHN0YXRpYyBpc0ZhY3RvcnlDbGFzcyhDbGFzczogRnVuY3Rpb24pOiBib29sZWFuIHtcbiAgICBpZiAoQ2xhc3MpIHtcbiAgICAgIHJldHVybiAoZXh0ZW5kc0Zyb20oQ2xhc3MsIEdRTEJhc2UpXG4gICAgICAgID8gISFDbGFzc1tNRVRBX0tFWV1bdGhpcy5GQUNUT1JZX0NMQVNTXVxuICAgICAgICA6ICEhQ2xhc3NbdGhpcy5GQUNUT1JZX0NMQVNTXVxuICAgICAgKVxuICAgIH1cblxuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgLyoqXG4gICAqIEEgc3RhdGljIGhlbHBlciBtZXRob2QgdG8gY29uc2lzdGVudGx5IHJlbW92ZSBhbnkgcHJldmlvdXMgdGFnIG9yIGJyYW5kXG4gICAqIGFwcGxpZWQgd2l0aCBgYnJhbmRDbGFzc2AsIHRoaXMgaXMgZG9uZSBieSByZW1vdmluZyBhIHByZXZpb3VzbHkgc2V0XG4gICAqIGBTeW1ib2xgIG9uIHRoZSByb290IG9mIHRoZSBjbGFzcyBvciBpbiB0aGUgYFtNRVRBX0tFWV1gIG9iamVjdCBmb3JcbiAgICogY2xhc3NlcyBleHRlbmRpbmcgYEdRTEJhc2VgLlxuICAgKlxuICAgKiBAbWV0aG9kIOKMvuKggHJlbW92ZUNsYXNzQnJhbmRcbiAgICogQG1lbWJlcm9mIExhdHRpY2VGYWN0b3J5XG4gICAqIEBzdGF0aWNcbiAgICpcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gQ2xhc3MgdGhlIGNsYXNzIHRvIGJyYW5kIHdpdGggdGhlIGBGQUNUT1JZX0NMQVNTYCBzeW1ib2xcbiAgICogQHJldHVybiB7RnVuY3Rpb259IHJldHVybnMgdGhlIENsYXNzIHZhbHVlIHBhc3NlZCBpblxuICAgKi9cbiAgc3RhdGljIHJlbW92ZUNsYXNzQnJhbmQoQ2xhc3M6IEZ1bmN0aW9uKTogRnVuY3Rpb24ge1xuICAgIGlmIChDbGFzcykge1xuICAgICAgaWYgKGV4dGVuZHNGcm9tKENsYXNzLCBHUUxCYXNlKSkge1xuICAgICAgICBkZWxldGUgQ2xhc3NbTUVUQV9LRVldW3RoaXMuRkFDVE9SWV9DTEFTU11cbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBkZWxldGUgQ2xhc3NbdGhpcy5GQUNUT1JZX0NMQVNTXVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBDbGFzc1xuICB9XG5cbiAgLyoqXG4gICAqIEEgY29uc3RhbnQgdGhhdCByZXBvcnRzIHRoYXQgdGhpcyBjbGFzcyBpcyBgJ1tvYmplY3QgTGF0dGljZUZhY3RvcnldJ2BcbiAgICogcmF0aGVyIHRoYW4gYCdbb2JqZWN0IE9iamVjdF0nYCB3aGVuIGludHJvc3BlY3RlZCB3aXRoIHRvb2xzIHN1Y2ggYXNcbiAgICogYE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuYXBwbHkoY2xhc3MpYC5cbiAgICpcbiAgICogQG1lbWJlcm9mIExhdHRpY2VGYWN0b3J5XG4gICAqIEB0eXBlIHtTeW1ib2x9XG4gICAqIEBzdGF0aWNcbiAgICovXG4gIC8vICRGbG93Rml4TWVcbiAgc3RhdGljIGdldCBbU3ltYm9sLnRvU3RyaW5nVGFnXSgpIHsgcmV0dXJuIHRoaXMubmFtZSB9XG5cbiAgLyoqXG4gICAqIEEgY29uc3RhbnQgZXhwb3J0ZWQgYXMgcGFydCBvZiBMYXR0aWNlRmFjdG9yeSB0aGF0IGNhbiBiZSB1c2VkIGZvclxuICAgKiBkZWZpbmluZyBkb2N1bWVudGF0aW9uIGZvciB0aGUgdHlwZSBpdHNlbGYuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBMYXR0aWNlRmFjdG9yeVxuICAgKiBAdHlwZSB7U3ltYm9sfVxuICAgKiBAc3RhdGljXG4gICAqL1xuICBzdGF0aWMgZ2V0IFRZUEUoKTogU3ltYm9sIHsgcmV0dXJuIFN5bWJvbC5mb3IoJ0FQSSBEb2NzIFR5cGUgQ29uc3RhbnQnKSB9XG5cbiAgLyoqXG4gICAqIEEgY29uc3RhbnQgZXhwb3J0ZWQgYXMgcGFydCBvZiBMYXR0aWNlRmFjdG9yeSB0aGF0IGNhbiBiZSB1c2VkIGZvclxuICAgKiBpZGVudGlmeWluZyBjbGFzc2VzIHRoYXQgd2VyZSBnZW5lcmF0ZWQgd2l0aCBMYXR0aWNlRmFjdG9yeS5cbiAgICpcbiAgICogQG1lbWJlcm9mIExhdHRpY2VGYWN0b3J5XG4gICAqIEB0eXBlIHtTeW1ib2x9XG4gICAqIEBzdGF0aWNcbiAgICovXG4gIHN0YXRpYyBnZXQgRkFDVE9SWV9DTEFTUygpOiBTeW1ib2wgeyByZXR1cm4gU3ltYm9sLmZvcignRmFjdG9yeSBDbGFzcycpIH1cbn1cblxuZXhwb3J0IGNvbnN0IGlzRmFjdG9yeUNsYXNzID0gTGF0dGljZUZhY3RvcnkuaXNGYWN0b3J5Q2xhc3NcblxuLy8gVEVTVElORyBSRVBMXG4vKipcbnZhciB7IExhdHRpY2VGYWN0b3J5LCBnZXRDaGVja2xpc3QsIGhhc0NoZWNrbGlzdCwgQ0hFQ0tMSVNULCBDSEVDS19TQ0hFTUEsIENIRUNLX1JFU09MVkVSUyB9ID0gcmVxdWlyZSgnLi9kaXN0L0xhdHRpY2VGYWN0b3J5Jyk7IHZhciB7IEdRTEJhc2UsIE1FVEFfS0VZLCBqb2luTGluZXMsIFN5bnRheFRyZWUsIHR5cGVPZiB9ID0gcmVxdWlyZSgnLi9kaXN0L2xhdHRpY2UnKTsgdmFyIGdxbCA9IGpvaW5MaW5lcywgTEYgPSBMYXR0aWNlRmFjdG9yeSwgVFlQRSA9IExGLlRZUEU7XG52YXIgUGVyc29uRGVmID0geyBuYW1lOiAnUGVyc29uJywgc2NoZW1hOiBncWxgIGVudW0gU3RhdFR5cGUgeyBQSFlTSUNBTCwgTUVOVEFMIH0gdHlwZSBQZXJzb24geyBuYW1lOiBTdHJpbmcgc3RhdHModHlwZTpTdGF0VHlwZSk6IFN0YXQgfSB0eXBlIFF1ZXJ5IHsgZmluZFBlcnNvbihpZDogSUQpOiBQZXJzb24gfSBgLCByZXNvbHZlcnM6IHsgUXVlcnk6IHsgZmluZFBlcnNvbih7cmVxLCByZXMsIG5leHR9LCB7aWR9KSB7IGNvbnNvbGUubG9nKCdmaW5kIHBlcnNvbicpIH0gfSwgUGVyc29uOiB7IHN0YXRzKHt0eXBlfSkgeyBsZXQgeyByZXEsIHJlcywgbmV4dH0gPSB0aGlzLnJlcXVlc3REYXRhIH0gfSB9LCBkb2NzOiB7IFN0YXRUeXBlOiB7IFtUWVBFXTogYEEgdHlwZSBvZiBzdGF0aXN0aWMgYXNzb2NpYXRlZCB3aXRoIHBlb3BsZWAsIFBIWVNJQ0FMOiBgUGh5c2ljYWwgYXR0cmlidXRlc2AsIE1FTlRBTDogYE1lbnRhbCBhdHRyaWJ1dGVzYCB9LCBQZXJzb246IHsgW1RZUEVdOiBgUmVwcmVzZW50cyBhIHBlcnNvbmAsIHBlcnNvbklkOiBgVW5pcXVlIGlkIG9mIHRoZSBwZXJzb24gaW4gcXVlc3Rpb25gLCBuYW1lOiBgVGhlIG5hbWUgb2YgdGhlIHBlcnNvbmAsIHN0YXRzOiBgQWxsb3dzIHlvdSB0byBxdWVyeSB0aGUgc3RhdHMgb2YgYSBwZXJzb24gYmFzZWQgb24gdHlwZWAgfSwgUXVlcnk6IHsgW1RZUEVdOiAnVG9wIGxldmVsIHF1ZXJ5IGRlc2MuJywgZmluZFBlcnNvbjogYFNlYXJjaGVzIHRoZSBzeXN0ZW0gZm9yIHRoZSBzcGVjaWZpZWQgdXNlcmAgfSB9IH07XG52YXIgUGVyc29uID0gTEYuYnVpbGQoUGVyc29uRGVmKSwgcCA9IG5ldyBQZXJzb24oe25hbWU6ICdCcmllbGxlJ30pXG5QZXJzb24uZ2V0UHJvcCgnc3RhdHMnLHRydWUse3JlcXVlc3REYXRhOntyZXE6MSxyZXM6MixuZXh0OjN9fSlcbnZhciBCcm9rZSA9IExGLmJ1aWxkKHtuYW1lOiAnQnJva2UnLCBzY2hlbWE6IGdxbGB0eXBlIEJyb2tlIHtuYW1lOiBTdHJpbmd9YCwgcmVzb2x2ZXJzOnt9LCBkb2NzOnt9fSlcbnZhciB0ID0gTEYudmFsaWRhdGVUZW1wbGF0ZSh7bmFtZTogJycsICB0eXBlOiBHUUxCYXNlLCByZXNvbHZlcnM6IHt9LCBkb2NzOiB7fSwgc2NoZW1hOiAnJ30pO1xuKi9cbiJdfQ==