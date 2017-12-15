'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isFactoryClass = exports.LatticeFactory = exports.ValidationResults = exports.CHECK_API_DOCS = exports.CHECK_RESOLVERS = exports.CHECK_SCHEMA = exports.CHECKLIST = undefined;

var _entries = require('babel-runtime/core-js/object/entries');

var _entries2 = _interopRequireDefault(_entries);

var _getOwnPropertyDescriptor = require('babel-runtime/core-js/object/get-own-property-descriptor');

var _getOwnPropertyDescriptor2 = _interopRequireDefault(_getOwnPropertyDescriptor);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _defineProperty = require('babel-runtime/core-js/object/define-property');

var _defineProperty2 = _interopRequireDefault(_defineProperty);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _toStringTag = require('babel-runtime/core-js/symbol/to-string-tag');

var _toStringTag2 = _interopRequireDefault(_toStringTag);

var _for = require('babel-runtime/core-js/symbol/for');

var _for2 = _interopRequireDefault(_for);

exports.getChecklist = getChecklist;
exports.setChecklist = setChecklist;
exports.hasChecklist = hasChecklist;
exports.newChecklist = newChecklist;

var _GQLBase = require('./GQLBase');

var _GQLEnum = require('./GQLEnum');

var _GQLInterface = require('./GQLInterface');

var _GQLScalar = require('./GQLScalar');

var _SyntaxTree = require('./SyntaxTree');

var _neTagFns = require('ne-tag-fns');

var _types = require('./types');

var _util = require('util');

var _Resolvers = require('./decorators/Resolvers');

var _ModelProperties = require('./decorators/ModelProperties');

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const _i = (...args) => (0, _util.inspect)(...args, { colors: true, depth: 3 });

/**
 * The CHECKLIST Symbol is used as a storage key in the metadata staging
 * area for each of the GQLBase extended classes. In the LatticeFactory
 * it is used to determine where in the flow of construction the class
 * currently is.
 *
 * @type {Symbol}
 */

// import { GQLUnion } from './GQLUnion'


const CHECKLIST = exports.CHECKLIST = (0, _for2.default)('checklist');

/**
 * The CHECK_SCHEMA Symbol is part of the CHECKLIST for a constructed
 * GQLBase extended class. It denotes that the class has had its SCHEMA
 * getter defined.
 *
 * @type {Symbol}
 */
const CHECK_SCHEMA = exports.CHECK_SCHEMA = (0, _for2.default)('checklist-schema');

/**
 * The CHECK_RESOLVERS Symbol is part of the CHECKLIST for a constructed
 * GQLBase extended class. It denotes that the class has had its instance
 * field resolvers as well as its static Query, Mutation and Subscription
 * resolvers injected and defined.
 *
 * @type {Symbol}
 */
const CHECK_RESOLVERS = exports.CHECK_RESOLVERS = (0, _for2.default)('checklist-resolvers');

/**
 * The CHECK_API_DOCS Symbol is part of the CHECKLIST for a constructed
 * GQLBase extended class. It denotes that the class has had its api docs
 * defined, processed and setup on the class in a way that it will be
 * picked up in the build lifecycle.
 *
 * @type {Symbol}
 */
const CHECK_API_DOCS = exports.CHECK_API_DOCS = (0, _for2.default)('checklist-api-docs');

/**
 * Peeks into the metadata storage area of a given GQLBase extended
 * class and fetches the factory checklist if one exists.
 *
 * @param {Function} Class a reference to the GQLBase class to peek in
 * @return {Object} an object setup with at least three booleans keyed by
 * the constants CHECK_SCHEMA, CHECK_RESOLVERS, and CHECK_API_DOCS or null
 * if none exists
 */
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
 * @return {[type]}        [description]
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
    throw new Error((0, _neTagFns.customDedent)({ dropLowest: true })`
      Cannot create new checklist metadata on a non-existent class
    `);
  }
}

let ValidationResults = exports.ValidationResults = class ValidationResults {

  constructor(errors = []) {
    this.errors = errors;
  }

  get valid() {
    return this.errors.length === 0;
  }

  // $FlowFixMe
  get [_toStringTag2.default]() {
    return this.constructor.name;
  }

  // $FlowFixMe
  static get [_toStringTag2.default]() {
    return this.name;
  }
};
let LatticeFactory = exports.LatticeFactory = class LatticeFactory {

  /**
   * Walks through a supplied template object and collects errors with its
   * format before bubbling up an exception if any part of it fails to
   * pass muster. The exception can be prevented from throwing if hide is set
   * to true
   *
   * @param {*} template an object to be parsed for construction via the
   * Lattice Factory
   * @param {boolean} hide if true, an invalid template will NOT throw errors
   * @return {ValidationResults} a `ValidationResults` object containing the
   * collected errors and a `valid` that is dynamically calculated.
   */
  static validateTemplate(template, hide = false) {
    let results = new ValidationResults();
    let indent = (string, count = 4, space = ' ') => string.split('\n').map(s => s.trim().replace(/(^)/gm, `$1${space.repeat(count)}`)).join('\n');

    if (typeof template.name === 'undefined') {
      results.errors.push(new Error((0, _neTagFns.customDedent)({ dropLowest: true })`
        The \`template.name\` field must exist or the creation for the Lattice
        factory class generation to succeed.

        Please read the documentation for more information on the format of
        a LatticeFactory template.
      `));
    }

    if (!(0, _types.extendsFrom)(template.name, String)) {
      results.errors.push(new Error((0, _neTagFns.customDedent)({ dropLowest: true })`
        The \`template.name\` field must be a string.

        Please read the documentation for more information on the format of
        a LatticeFactory template.
      `));
    }

    if (typeof template.schema === 'undefined') {
      results.errors.push(new Error((0, _neTagFns.customDedent)({ dropLowest: true })`
        The \`template.schema\` field must exist or the creation for the
        Lattice factory class generation to succeed.

        Please read the documentation for more information on the format of
        a LatticeFactory template.
      `));
    }

    if (!(0, _types.extendsFrom)(template.schema, String)) {
      results.errors.push(new Error((0, _neTagFns.customDedent)({ dropLowest: true })`
        The \`template.schema\` field must be a string of GraphQL SDL/IDL

        Please read the documentation for more information on the format of
        a LatticeFactory template.
      `));
    }

    if (!(0, _types.extendsFrom)(template.resolvers, Object) // Supports 95% of objects
    || typeof template.resolvers !== 'object' // Supports Object.create(null)
    ) {
        results.errors.push(new Error((0, _neTagFns.customDedent)({ dropLowest: true })`\x1b[91;1m
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
      results.errors.push(new Error((0, _neTagFns.customDedent)({ dropLowest: true })`
        The \`template.docs\` field must exist for the creation of the
        Lattice factory class generation to succeed.

        Please read the documentation for more information on the format of
        a LatticeFactory template.
      `));
    }

    if (!(0, _types.extendsFrom)(template.docs, Object) // Supports 95% of objects
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

        results.errors.push(new Error((0, _neTagFns.customDedent)({ dropLowest: true })`\x1b[1;91m
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
        let { message, stack } = error;

        stack = stack.trim().split('\n').splice(message.split('\n').length).map(s => s.trim()).join('\n');
        message = message.replace(/(Error:\s)/, '$1\n').trim();

        errorStrings.push(`\x1b[31;1m${message}\x1b[0m\n` + indent(stack));
      }

      let error = new Error((0, _neTagFns.customDedent)({ dropLowest: true })`
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
    }

    // Alright ladies and gentlemen, hold onto your hats; we're entering the
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
      throw new Error((0, _neTagFns.customDedent)({ dropLowest: true })`
        Either the supplied schema string is invalid
          SCHEMA: \`
            ${schema}
          \`

        Or your supplied class ${Class && Class.name || 'undefined'} is
        non-existent. Please check your code and try the LatticeFactory
        again.
      `);
    }

    // $FlowFixMe
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
      throw new Error((0, _neTagFns.customDedent)({ dropLowest: true })`
        \`injectResolvers\` cannot be called on a class without a SCHEMA.
        Please verify your progress in the process and try again.
      `);
    }

    let tree = _SyntaxTree.SyntaxTree.from(Class.SCHEMA);
    let outline = tree ? tree.outline : {};

    if (Class.name in outline && Class.name in resolvers) {
      let fields = (0, _keys2.default)(outline[Class.name]);

      for (let fieldResolver of fields) {
        if (!fieldResolver in resolvers[Class.name]) {
          _utils.LatticeLogs.warn((0, _neTagFns.customDedent)({ dropLowest: true })`
            ${fieldResolver} not supplied in resolvers for ${Class.name}
          `);
          continue;
        }

        let prop = resolvers[Class.name][fieldResolver];

        if (prop && typeof prop === 'function') {
          _utils.LatticeLogs.info('Injecting [fn] %s', fieldResolver);
          (0, _defineProperty2.default)(Class.prototype, fieldResolver, {
            value: prop
          });
        } else {
          _utils.LatticeLogs.info('Injecting [prop] %s', fieldResolver);
          (0, _ModelProperties.Properties)(fieldResolver)(Class, ['factory-props']);
        }
      }
    }

    for (let [type, decorator] of [['Query', _Resolvers.resolver], ['Mutation', _Resolvers.mutator], ['Subscription', _Resolvers.subscriptor]]) {
      let keys = (0, _keys2.default)(outline[type] || {});

      // $FlowFixMe
      if (!type in outline || !keys.length) {
        continue;
      }

      for (let fnName of keys) {
        let fn = resolvers[fnName];
        decorator(Class, fnName, { value: fn });
        _utils.LatticeLogs.info('Adding %s resolver [%s]', type, fnName);
      }
    }

    setChecklist(Class, CHECK_RESOLVERS);

    return Class;
  }

  static injectDocs(Class, docs) {
    if (!hasChecklist(Class, CHECK_SCHEMA, CHECK_RESOLVERS)) {
      throw new Error((0, _neTagFns.customDedent)({ dropLowest: true })`
        \`injectDocs\` cannot be called on a class without a SCHEMA or
        RESOLVERS defined. Please verify your progress in the process and try
        again.
      `);
    }

    let copyProp = (o, prop, to, as) => {
      // $FlowFixMe
      let prototype = o.prototype || (0, _getPrototypeOf2.default)(o);
      let descriptor = (0, _getOwnPropertyDescriptor2.default)(prototype, prop);

      if (!as) {
        as = prop;
      }

      if (descriptor) {
        (0, _defineProperty2.default)(to, as, descriptor);
      } else {
        // $FlowFixMe
        to[as] = o[prop];
      }
    };

    // Create an object our future `static apiDocs()` method of our factory
    // generated class will return
    let result = {};

    // Setup the constants we will need in this conversion
    const { TYPE } = this;
    const {
      DOC_CLASS, DOC_FIELDS, DOC_QUERY, DOC_MUTATION, DOC_SUBSCRIPTION,
      DOC_QUERIES, DOC_MUTATIONS, DOC_SUBSCRIPTIONS
    } = _GQLBase.GQLBase;

    // This part might get a little meta, so I have provided comments. You are
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
        }

        // Fetch the properties from the supplied docs object; TYPE Symbols
        // do not show up in a call to entries which is why it is handled above
        // $FlowFixMe
        let entries = (0, _entries2.default)(docs[Type]);

        // If we have entries to document, create an object to hold those
        // values; i.e. if we have `{ Query: { getPeople: 'desc' } }`, we need
        // to make sure we have `{ [DOC_QUERIES]: { getPeople: 'desc' } }` in
        // our result. The object holding getPeople in the end there is defined
        // below when we have something to copy.
        if (entries.length) {
          result[FieldConstants] = {};
        }

        // For each name value pair defined above, copy its descriptor or base
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
      throw new Error((0, _neTagFns.customDedent)({ dropLowest: true })`
        LatticeFactory was unable to build your Class from the name and types
        supplied in your template. You provided the following template. Please
        look it over and correct any errors before trying again.

        \x1b[1mTemplate\x1b[0m
          ${_i(template)}
      `);
    }

    this.injectSchema(Class, template.schema);
    this.injectResolvers(Class, template.resolvers || {});
    this.injectDocs(Class, template.docs || {});

    // Need to fix how auto-props work; for now create one instance...
    new Class({});

    if (!hasChecklist(Class, CHECK_SCHEMA, CHECK_RESOLVERS, CHECK_API_DOCS)) {
      let _schema = hasChecklist(Class, CHECK_SCHEMA) ? '✅' : '❌';
      let _resolvers = hasChecklist(Class, CHECK_RESOLVERS) ? '✅' : '❌';
      let _apiDocs = hasChecklist(Class, CHECK_API_DOCS) ? '✅' : '❌';

      throw new Error((0, _neTagFns.customDedent)({ dropLowest: true })`
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
      if ((0, _types.extendsFrom)(Class, _GQLBase.GQLBase)) {
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
      return (0, _types.extendsFrom)(Class, _GQLBase.GQLBase) ? !!Class[_GQLBase.META_KEY][this.FACTORY_CLASS] : !!Class[this.FACTORY_CLASS];
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
      if ((0, _types.extendsFrom)(Class, _GQLBase.GQLBase)) {
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
  static get [_toStringTag2.default]() {
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
    return (0, _for2.default)('API Docs Type Constant');
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
    return (0, _for2.default)('Factory Class');
  }
};
const isFactoryClass = exports.isFactoryClass = LatticeFactory.isFactoryClass;

// TESTING REPL
/**
var { LatticeFactory, getChecklist, hasChecklist, CHECKLIST, CHECK_SCHEMA, CHECK_RESOLVERS } = require('./dist/LatticeFactory'); var { GQLBase, META_KEY, joinLines, SyntaxTree, typeOf } = require('./dist/lattice'); var gql = joinLines, LF = LatticeFactory, TYPE = LF.TYPE;
var PersonDef = { name: 'Person', schema: gql` enum StatType { PHYSICAL, MENTAL } type Person { name: String stats(type:StatType): Stat } type Query { findPerson(id: ID): Person } `, resolvers: { Query: { findPerson({req, res, next}, {id}) { console.log('find person') } }, Person: { stats({type}) { let { req, res, next} = this.requestData } } }, docs: { StatType: { [TYPE]: `A type of statistic associated with people`, PHYSICAL: `Physical attributes`, MENTAL: `Mental attributes` }, Person: { [TYPE]: `Represents a person`, personId: `Unique id of the person in question`, name: `The name of the person`, stats: `Allows you to query the stats of a person based on type` }, Query: { [TYPE]: 'Top level query desc.', findPerson: `Searches the system for the specified user` } } };
var Person = LF.build(PersonDef), p = new Person({name: 'Brielle'})
Person.getProp('stats',true,{requestData:{req:1,res:2,next:3}})
var Broke = LF.build({name: 'Broke', schema: gql`type Broke {name: String}`, resolvers:{}, docs:{}})
var t = LF.validateTemplate({name: '',  type: GQLBase, resolvers: {}, docs: {}, schema: ''});
*/
//# sourceMappingURL=LatticeFactory.js.map