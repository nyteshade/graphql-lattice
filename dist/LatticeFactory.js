"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getChecklist = getChecklist;
exports.setChecklist = setChecklist;
exports.hasChecklist = hasChecklist;
exports.newChecklist = newChecklist;
exports.isFactoryClass = exports.LatticeFactory = exports.ValidationResults = exports.CHECK_API_DOCS = exports.CHECK_RESOLVERS = exports.CHECK_SCHEMA = exports.CHECKLIST = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _defineEnumerableProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/defineEnumerableProperties"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

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

function _templateObject15() {
  var data = (0, _taggedTemplateLiteral2.default)(["\n        Something went wrong in the process of building the class called\n        ", ",\n        please check the supplied template for errors.\n\n        [ ", " ] Has a SCHEMA defined\n        [ ", " ] Has defined RESOLVERS matching the SCHEMA\n        [ ", " ] Has defined API Docs matching the SCHEMA\n\n        \x1B[1mTemplate\x1B[0m\n        ", "\n\n        \x1B[1mClass\x1B[0m\n        ", "\n      "], ["\n        Something went wrong in the process of building the class called\n        ", ",\n        please check the supplied template for errors.\n\n        [ ", " ] Has a SCHEMA defined\n        [ ", " ] Has defined RESOLVERS matching the SCHEMA\n        [ ", " ] Has defined API Docs matching the SCHEMA\n\n        \\x1b[1mTemplate\\x1b[0m\n        ", "\n\n        \\x1b[1mClass\\x1b[0m\n        ", "\n      "]);

  _templateObject15 = function _templateObject15() {
    return data;
  };

  return data;
}

function _templateObject14() {
  var data = (0, _taggedTemplateLiteral2.default)(["\n        LatticeFactory was unable to build your Class from the name and types\n        supplied in your template. You provided the following template. Please\n        look it over and correct any errors before trying again.\n\n        \x1B[1mTemplate\x1B[0m\n          ", "\n      "], ["\n        LatticeFactory was unable to build your Class from the name and types\n        supplied in your template. You provided the following template. Please\n        look it over and correct any errors before trying again.\n\n        \\x1b[1mTemplate\\x1b[0m\n          ", "\n      "]);

  _templateObject14 = function _templateObject14() {
    return data;
  };

  return data;
}

function _templateObject13() {
  var data = (0, _taggedTemplateLiteral2.default)(["\n        `injectDocs` cannot be called on a class without a SCHEMA or\n        RESOLVERS defined. Please verify your progress in the process and try\n        again.\n      "], ["\n        \\`injectDocs\\` cannot be called on a class without a SCHEMA or\n        RESOLVERS defined. Please verify your progress in the process and try\n        again.\n      "]);

  _templateObject13 = function _templateObject13() {
    return data;
  };

  return data;
}

function _templateObject12() {
  var data = (0, _taggedTemplateLiteral2.default)(["\n            ", " not supplied in resolvers for ", "\n          "]);

  _templateObject12 = function _templateObject12() {
    return data;
  };

  return data;
}

function _templateObject11() {
  var data = (0, _taggedTemplateLiteral2.default)(["\n        `injectResolvers` cannot be called on a class without a SCHEMA.\n        Please verify your progress in the process and try again.\n      "], ["\n        \\`injectResolvers\\` cannot be called on a class without a SCHEMA.\n        Please verify your progress in the process and try again.\n      "]);

  _templateObject11 = function _templateObject11() {
    return data;
  };

  return data;
}

function _templateObject10() {
  var data = (0, _taggedTemplateLiteral2.default)(["\n        Either the supplied schema string is invalid\n          SCHEMA: `\n            ", "\n          `\n\n        Or your supplied class ", " is\n        non-existent. Please check your code and try the LatticeFactory\n        again.\n      "], ["\n        Either the supplied schema string is invalid\n          SCHEMA: \\`\n            ", "\n          \\`\n\n        Or your supplied class ", " is\n        non-existent. Please check your code and try the LatticeFactory\n        again.\n      "]);

  _templateObject10 = function _templateObject10() {
    return data;
  };

  return data;
}

function _templateObject9() {
  var data = (0, _taggedTemplateLiteral2.default)(["\n        OOPS!\n\n        An error occurred validating your factory template. The object\n        in question is as follows:\n\n        @template\n\n        The individual errors that occurred are:\n        \n@errors"], ["\n        OOPS!\n\n        An error occurred validating your factory template. The object\n        in question is as follows:\n\n        @template\n\n        The individual errors that occurred are:\n        \\n@errors"]);

  _templateObject9 = function _templateObject9() {
    return data;
  };

  return data;
}

function _templateObject8() {
  var data = (0, _taggedTemplateLiteral2.default)(["\x1B[1;91m\n        The `template.docs` field must be an object containing keys and\n        value pairs matching the types, enums, unions and interfaces defined\n        in your schema.\n\n        The special Symbol object TYPE can be used to reference the docs for\n        the named or keyed field describing the documentation to be processed\n        Comments for the `Query`, `Mutation`, and `Subscription` [TYPE]\n        entries will replace any previous one that comes before it. Typically\n        this field is best left undescribed since there will ever only be\n        one of each at most.\n\n        \x1B[22;31mExamples should look something like this:\x1B[22;37m\n          import { TYPE, joinLines } from 'graphql-lattice'\n\n          export default {\n            ", "/* other fields */", "\n\n            ", "schema:", " joinLines", "`\n              type Person { id: ID name: String }\n              type Query { findPerson(id: ID): Person }\n              type Mutation { setPersonName(id: ID, name: String): Person }\n            `", ",\n\n            ", "docs:", " {\n              ", "Person:", " {\n                [TYPE]: ", "'A contrived person type'", ",\n                id: ", "'A unique identifier for a person'", ",\n                name: ", "'A string denoting the name of a person'", "\n              },\n              ", "Query:", " {\n                findPerson: ", "'A query taking an ID, returns a Person'", ",\n              },\n              ", "Mutation:", " {\n                setPersonName: joinLines", "`\n                  A mutation that sets the name of the user identified by an\n                  ID to the new name value supplied\n                `", "\n              }\n            }\n          }\n        \x1B[22;31m\n        Note the usage of `Person`, `Query` and `Mutation` explicitly\n        as keys to the supplied `docs` object.\x1B[0m\n      "], ["\\x1b[1;91m\n        The \\`template.docs\\` field must be an object containing keys and\n        value pairs matching the types, enums, unions and interfaces defined\n        in your schema.\n\n        The special Symbol object TYPE can be used to reference the docs for\n        the named or keyed field describing the documentation to be processed\n        Comments for the \\`Query\\`, \\`Mutation\\`, and \\`Subscription\\` [TYPE]\n        entries will replace any previous one that comes before it. Typically\n        this field is best left undescribed since there will ever only be\n        one of each at most.\n\n        \\x1b[22;31mExamples should look something like this:\\x1b[22;37m\n          import { TYPE, joinLines } from 'graphql-lattice'\n\n          export default {\n            ", "/* other fields */", "\n\n            ", "schema:", " joinLines", "\\`\n              type Person { id: ID name: String }\n              type Query { findPerson(id: ID): Person }\n              type Mutation { setPersonName(id: ID, name: String): Person }\n            \\`", ",\n\n            ", "docs:", " {\n              ", "Person:", " {\n                [TYPE]: ", "'A contrived person type'", ",\n                id: ", "'A unique identifier for a person'", ",\n                name: ", "'A string denoting the name of a person'", "\n              },\n              ", "Query:", " {\n                findPerson: ", "'A query taking an ID, returns a Person'", ",\n              },\n              ", "Mutation:", " {\n                setPersonName: joinLines", "\\`\n                  A mutation that sets the name of the user identified by an\n                  ID to the new name value supplied\n                \\`", "\n              }\n            }\n          }\n        \\x1b[22;31m\n        Note the usage of \\`Person\\`, \\`Query\\` and \\`Mutation\\` explicitly\n        as keys to the supplied \\`docs\\` object.\\x1b[0m\n      "]);

  _templateObject8 = function _templateObject8() {
    return data;
  };

  return data;
}

function _templateObject7() {
  var data = (0, _taggedTemplateLiteral2.default)(["\n        The `template.docs` field must exist for the creation of the\n        Lattice factory class generation to succeed.\n\n        Please read the documentation for more information on the format of\n        a LatticeFactory template.\n      "], ["\n        The \\`template.docs\\` field must exist for the creation of the\n        Lattice factory class generation to succeed.\n\n        Please read the documentation for more information on the format of\n        a LatticeFactory template.\n      "]);

  _templateObject7 = function _templateObject7() {
    return data;
  };

  return data;
}

function _templateObject6() {
  var data = (0, _taggedTemplateLiteral2.default)(["\x1B[91;1m\n        The `template.resolvers` field must be an Object containing the\n        resolver functions. Query, Mutation and Subscription resolvers will\n        take the following signature. Additionally, the keys for these special\n        resolvers must be Query, Mutation or Subscription; respectively\n        \x1B[37;22m\n          Query: { [resolver]: (requestData, resolverParameters) => {} }\n          Mutation: { [resolver]: (requestData, resolverParameters) => {} }\n          Subscription: { [resolver]: (requestData, resolverParameters) => {} }\n\n          where:\n            `requestData` is an object with { req, res, gql|next } depending\n              on the graphql server implementation (FB Reference, Apollo, etc)\n            `resovlerParameters` is an object with keys matching those\n              parameters defined in the SCHEMA for the resolver in question.\n        \x1B[91;1m\n        Field resolvers should be found under the key name of the type\n        or interface in question and must correspond to the following signature\n        \x1B[37;22m\n          [Type]: { [resolver]: (resolverParameters) => {} }\n\n          where:\n            `Type` is the name of the GQL type defined in the schema\n            `resovlerParameters` is an object with keys matching those\n              parameters defined in the SCHEMA for the resolver in question.\n\n          * it is worth noting that the field resolvers are not static and\n            can access the `requestData` object via `this.requestData`\n        \x1B[91;1m\n        Please read the documentation for more information on the format of\n        a LatticeFactory template.\x1B[0m\n      "], ["\\x1b[91;1m\n        The \\`template.resolvers\\` field must be an Object containing the\n        resolver functions. Query, Mutation and Subscription resolvers will\n        take the following signature. Additionally, the keys for these special\n        resolvers must be Query, Mutation or Subscription; respectively\n        \\x1b[37;22m\n          Query: { [resolver]: (requestData, resolverParameters) => {} }\n          Mutation: { [resolver]: (requestData, resolverParameters) => {} }\n          Subscription: { [resolver]: (requestData, resolverParameters) => {} }\n\n          where:\n            \\`requestData\\` is an object with { req, res, gql|next } depending\n              on the graphql server implementation (FB Reference, Apollo, etc)\n            \\`resovlerParameters\\` is an object with keys matching those\n              parameters defined in the SCHEMA for the resolver in question.\n        \\x1b[91;1m\n        Field resolvers should be found under the key name of the type\n        or interface in question and must correspond to the following signature\n        \\x1b[37;22m\n          [Type]: { [resolver]: (resolverParameters) => {} }\n\n          where:\n            \\`Type\\` is the name of the GQL type defined in the schema\n            \\`resovlerParameters\\` is an object with keys matching those\n              parameters defined in the SCHEMA for the resolver in question.\n\n          * it is worth noting that the field resolvers are not static and\n            can access the \\`requestData\\` object via \\`this.requestData\\`\n        \\x1b[91;1m\n        Please read the documentation for more information on the format of\n        a LatticeFactory template.\\x1b[0m\n      "]);

  _templateObject6 = function _templateObject6() {
    return data;
  };

  return data;
}

function _templateObject5() {
  var data = (0, _taggedTemplateLiteral2.default)(["\n        The `template.schema` field must be a string of GraphQL SDL/IDL\n\n        Please read the documentation for more information on the format of\n        a LatticeFactory template.\n      "], ["\n        The \\`template.schema\\` field must be a string of GraphQL SDL/IDL\n\n        Please read the documentation for more information on the format of\n        a LatticeFactory template.\n      "]);

  _templateObject5 = function _templateObject5() {
    return data;
  };

  return data;
}

function _templateObject4() {
  var data = (0, _taggedTemplateLiteral2.default)(["\n        The `template.schema` field must exist or the creation for the\n        Lattice factory class generation to succeed.\n\n        Please read the documentation for more information on the format of\n        a LatticeFactory template.\n      "], ["\n        The \\`template.schema\\` field must exist or the creation for the\n        Lattice factory class generation to succeed.\n\n        Please read the documentation for more information on the format of\n        a LatticeFactory template.\n      "]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = (0, _taggedTemplateLiteral2.default)(["\n        The `template.name` field must be a string.\n\n        Please read the documentation for more information on the format of\n        a LatticeFactory template.\n      "], ["\n        The \\`template.name\\` field must be a string.\n\n        Please read the documentation for more information on the format of\n        a LatticeFactory template.\n      "]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = (0, _taggedTemplateLiteral2.default)(["\n        The `template.name` field must exist or the creation for the Lattice\n        factory class generation to succeed.\n\n        Please read the documentation for more information on the format of\n        a LatticeFactory template.\n      "], ["\n        The \\`template.name\\` field must exist or the creation for the Lattice\n        factory class generation to succeed.\n\n        Please read the documentation for more information on the format of\n        a LatticeFactory template.\n      "]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = (0, _taggedTemplateLiteral2.default)(["\n      Cannot create new checklist metadata on a non-existent class\n    "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

var _i = function _i() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return _util.inspect.apply(void 0, args.concat([{
    colors: true,
    depth: 3
  }]));
};
/**
 * The CHECKLIST Symbol is used as a storage key in the metadata staging
 * area for each of the GQLBase extended classes. In the LatticeFactory
 * it is used to determine where in the flow of construction the class
 * currently is.
 *
 * @type {Symbol}
 */


var CHECKLIST = Symbol.for('checklist');
/**
 * The CHECK_SCHEMA Symbol is part of the CHECKLIST for a constructed
 * GQLBase extended class. It denotes that the class has had its SCHEMA
 * getter defined.
 *
 * @type {Symbol}
 */

exports.CHECKLIST = CHECKLIST;
var CHECK_SCHEMA = Symbol.for('checklist-schema');
/**
 * The CHECK_RESOLVERS Symbol is part of the CHECKLIST for a constructed
 * GQLBase extended class. It denotes that the class has had its instance
 * field resolvers as well as its static Query, Mutation and Subscription
 * resolvers injected and defined.
 *
 * @type {Symbol}
 */

exports.CHECK_SCHEMA = CHECK_SCHEMA;
var CHECK_RESOLVERS = Symbol.for('checklist-resolvers');
/**
 * The CHECK_API_DOCS Symbol is part of the CHECKLIST for a constructed
 * GQLBase extended class. It denotes that the class has had its api docs
 * defined, processed and setup on the class in a way that it will be
 * picked up in the build lifecycle.
 *
 * @type {Symbol}
 */

exports.CHECK_RESOLVERS = CHECK_RESOLVERS;
var CHECK_API_DOCS = Symbol.for('checklist-api-docs');
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


function setChecklist(Class, item) {
  var value = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  var checklist = getChecklist(Class);

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


function hasChecklist(Class) {
  var checklist = getChecklist(Class);

  for (var _len2 = arguments.length, items = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    items[_key2 - 1] = arguments[_key2];
  }

  if (checklist && items.length) {
    for (var _i2 = 0; _i2 < items.length; _i2++) {
      var item = items[_i2];

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
    var _keys, _complete, _Class$META_KEY$CHECK, _mutatorMap;

    // $FlowFixMe
    Class[_GQLBase.META_KEY][CHECKLIST] = (_Class$META_KEY$CHECK = {}, (0, _defineProperty2.default)(_Class$META_KEY$CHECK, CHECK_SCHEMA, false), (0, _defineProperty2.default)(_Class$META_KEY$CHECK, CHECK_RESOLVERS, false), (0, _defineProperty2.default)(_Class$META_KEY$CHECK, CHECK_API_DOCS, false), _keys = "keys", _mutatorMap = {}, _mutatorMap[_keys] = _mutatorMap[_keys] || {}, _mutatorMap[_keys].get = function () {
      return [CHECK_SCHEMA, CHECK_RESOLVERS, CHECK_API_DOCS];
    }, _complete = "complete", _mutatorMap[_complete] = _mutatorMap[_complete] || {}, _mutatorMap[_complete].get = function () {
      var _this = this;

      return this.keys.reduce(function (p, c, i, a) {
        if (!p || !_this[c]) {
          return false;
        }
      }, true);
    }, (0, _defineEnumerableProperties2.default)(_Class$META_KEY$CHECK, _mutatorMap), _Class$META_KEY$CHECK);
  } else {
    throw new Error((0, _neTagFns.customDedent)({
      dropLowest: true
    })(_templateObject()));
  }
}

var ValidationResults =
/*#__PURE__*/
function () {
  function ValidationResults() {
    var errors = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    (0, _classCallCheck2.default)(this, ValidationResults);
    this.errors = errors;
  }

  (0, _createClass2.default)(ValidationResults, [{
    key: "valid",
    get: function get() {
      return this.errors.length === 0;
    } // $FlowFixMe

  }, {
    key: Symbol.toStringTag,
    get: function get() {
      return this.constructor.name;
    } // $FlowFixMe

  }], [{
    key: Symbol.toStringTag,
    get: function get() {
      return this.name;
    }
  }]);
  return ValidationResults;
}();

exports.ValidationResults = ValidationResults;

var LatticeFactory =
/*#__PURE__*/
function () {
  function LatticeFactory() {
    (0, _classCallCheck2.default)(this, LatticeFactory);
  }

  (0, _createClass2.default)(LatticeFactory, null, [{
    key: "validateTemplate",

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
    value: function validateTemplate(template) {
      var hide = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var results = new ValidationResults();

      var indent = function indent(string) {
        var count = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;
        var space = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ' ';
        return string.split('\n').map(function (s) {
          return s.trim().replace(/(^)/gm, "$1".concat(space.repeat(count)));
        }).join('\n');
      };

      if (typeof template.name === 'undefined') {
        results.errors.push(new Error((0, _neTagFns.customDedent)({
          dropLowest: true
        })(_templateObject2())));
      }

      if (!(0, _neTypes.extendsFrom)(template.name, String)) {
        results.errors.push(new Error((0, _neTagFns.customDedent)({
          dropLowest: true
        })(_templateObject3())));
      }

      if (typeof template.schema === 'undefined') {
        results.errors.push(new Error((0, _neTagFns.customDedent)({
          dropLowest: true
        })(_templateObject4())));
      }

      if (!(0, _neTypes.extendsFrom)(template.schema, String)) {
        results.errors.push(new Error((0, _neTagFns.customDedent)({
          dropLowest: true
        })(_templateObject5())));
      }

      if (!(0, _neTypes.extendsFrom)(template.resolvers, Object) // Supports 95% of objects
      || (0, _typeof2.default)(template.resolvers) !== 'object' // Supports Object.create(null)
      ) {
          results.errors.push(new Error((0, _neTagFns.customDedent)({
            dropLowest: true
          })(_templateObject6())));
        }

      if (typeof template.docs === 'undefined') {
        results.errors.push(new Error((0, _neTagFns.customDedent)({
          dropLowest: true
        })(_templateObject7())));
      }

      if (!(0, _neTypes.extendsFrom)(template.docs, Object) // Supports 95% of objects
      || (0, _typeof2.default)(template.docs) !== 'object' // Supports Object.create(null)
      ) {
          var dr = '\x1b[31m',
              br = '\x1b[91m';
          var b1 = '\x1b[1m',
              b0 = '\x1b[22m';
          var bb = '\x1b[90m';
          var dg = '\x1b[37m',
              bg = '\x1b[97m';
          var a0 = '\x1b[0m';
          var gr = '\x1b[32m',
              bgr = '\x1b[92m';
          results.errors.push(new Error((0, _neTagFns.customDedent)({
            dropLowest: true
          })(_templateObject8(), bb, dg, b1, b0, gr, dg, b1, b0, b1, b0, gr, dg, gr, dg, gr, dg, b1, b0, gr, dg, b1, b0, gr, dg)));
        }

      if (!results.valid) {
        var errorStrings = [];
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = results.errors[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _error = _step.value;
            var message = _error.message,
                stack = _error.stack;
            stack = stack.trim().split('\n').splice(message.split('\n').length).map(function (s) {
              return s.trim();
            }).join('\n');
            message = message.replace(/(Error:\s)/, '$1\n').trim();
            errorStrings.push("\x1B[31;1m".concat(message, "\x1B[0m\n") + indent(stack));
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        var error = new Error((0, _neTagFns.customDedent)({
          dropLowest: true
        })(_templateObject9()).replace(/@template/, indent(_i(template))).replace(/@errors/, errorStrings.join('\n\n')));
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

  }, {
    key: "generateClass",
    value: function generateClass(name) {
      var baseClass = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _GQLBase.GQLBase;

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


      var fn = eval("(new Function(\n      \"".concat(baseClass.name, "\",\n      \"class ").concat(name, " extends ").concat(baseClass.name, " {}; return ").concat(name, ";\"\n    ))"));
      var Class = fn(baseClass);
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

  }, {
    key: "injectSchema",
    value: function injectSchema(Class, schema) {
      if (!Class || !hasChecklist(Class)) {
        throw new Error((0, _neTagFns.customDedent)({
          dropLowest: true
        })(_templateObject10(), schema, Class && Class.name || 'undefined'));
      } // $FlowFixMe


      Object.defineProperty(Class, 'SCHEMA', {
        get: function get() {
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

  }, {
    key: "injectResolvers",
    value: function injectResolvers(Class, resolvers) {
      if (!hasChecklist(Class, CHECK_SCHEMA)) {
        throw new Error((0, _neTagFns.customDedent)({
          dropLowest: true
        })(_templateObject11()));
      }

      var tree = _SyntaxTree.SyntaxTree.from(Class.SCHEMA);

      var outline = tree ? tree.outline : {};

      if (Class.name in outline && Class.name in resolvers) {
        var fields = Object.keys(outline[Class.name]);

        for (var _i3 = 0; _i3 < fields.length; _i3++) {
          var fieldResolver = fields[_i3];

          if (!fieldResolver in resolvers[Class.name]) {
            _utils.LatticeLogs.warn((0, _neTagFns.customDedent)({
              dropLowest: true
            })(_templateObject12(), fieldResolver, Class.name));

            continue;
          }

          var prop = resolvers[Class.name][fieldResolver];

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

      var _arr = [['Query', _Resolvers.resolver], ['Mutation', _Resolvers.mutator], ['Subscription', _Resolvers.subscriptor]];

      for (var _i4 = 0; _i4 < _arr.length; _i4++) {
        var _arr$_i = (0, _slicedToArray2.default)(_arr[_i4], 2),
            type = _arr$_i[0],
            decorator = _arr$_i[1];

        var keys = Object.keys(outline[type] || {}); // $FlowFixMe

        if (!type in outline || !keys.length) {
          continue;
        }

        for (var _i5 = 0; _i5 < keys.length; _i5++) {
          var fnName = keys[_i5];
          var fn = resolvers[fnName];
          decorator(Class, fnName, {
            value: fn
          });

          _utils.LatticeLogs.info('Adding %s resolver [%s]', type, fnName);
        }
      }

      setChecklist(Class, CHECK_RESOLVERS);
      return Class;
    }
  }, {
    key: "injectDocs",
    value: function injectDocs(Class, docs) {
      if (!hasChecklist(Class, CHECK_SCHEMA, CHECK_RESOLVERS)) {
        throw new Error((0, _neTagFns.customDedent)({
          dropLowest: true
        })(_templateObject13()));
      }

      var copyProp = function copyProp(o, prop, to, as) {
        // $FlowFixMe
        var prototype = o.prototype || Object.getPrototypeOf(o);
        var descriptor = Object.getOwnPropertyDescriptor(prototype, prop);

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


      var result = {}; // Setup the constants we will need in this conversion

      var TYPE = this.TYPE;
      var DOC_CLASS = _GQLBase.GQLBase.DOC_CLASS,
          DOC_FIELDS = _GQLBase.GQLBase.DOC_FIELDS,
          DOC_QUERY = _GQLBase.GQLBase.DOC_QUERY,
          DOC_MUTATION = _GQLBase.GQLBase.DOC_MUTATION,
          DOC_SUBSCRIPTION = _GQLBase.GQLBase.DOC_SUBSCRIPTION,
          DOC_QUERIES = _GQLBase.GQLBase.DOC_QUERIES,
          DOC_MUTATIONS = _GQLBase.GQLBase.DOC_MUTATIONS,
          DOC_SUBSCRIPTIONS = _GQLBase.GQLBase.DOC_SUBSCRIPTIONS; // This part might get a little meta, so I have provided comments. You are
      // welcome future me. I hope it helps. This gnarly block should cover all
      // the descriptions for Query, Mutation, Subscription and the Class we
      // are creating. Other superfluous

      var _arr2 = [['Query', DOC_QUERY, DOC_QUERIES], ['Mutation', DOC_MUTATION, DOC_MUTATIONS], ['Subscription', DOC_SUBSCRIPTION, DOC_SUBSCRIPTIONS], [Class.name, DOC_CLASS, DOC_FIELDS]];

      for (var _i6 = 0; _i6 < _arr2.length; _i6++) {
        var _arr2$_i = (0, _slicedToArray2.default)(_arr2[_i6], 3),
            Type = _arr2$_i[0],
            TopLevelConstant = _arr2$_i[1],
            FieldConstants = _arr2$_i[2];

        // One of 'Query', 'Mutation', or 'Subscription'
        if (docs[Type]) {
          // If a top level description is present (i.e. Query, Mutation or
          // Subscription description)
          if (docs[Type][TYPE]) {
            copyProp(docs[Type], TYPE, result, TopLevelConstant);
          } // Fetch the properties from the supplied docs object; TYPE Symbols
          // do not show up in a call to entries which is why it is handled above
          // $FlowFixMe


          var entries = Object.entries(docs[Type]); // If we have entries to document, create an object to hold those
          // values; i.e. if we have `{ Query: { getPeople: 'desc' } }`, we need
          // to make sure we have `{ [DOC_QUERIES]: { getPeople: 'desc' } }` in
          // our result. The object holding getPeople in the end there is defined
          // below when we have something to copy.

          if (entries.length) {
            result[FieldConstants] = {};
          } // For each name value pair defined above, copy its descriptor or base
          // value if a descriptor isn't available


          for (var _i7 = 0; _i7 < entries.length; _i7++) {
            var _entries$_i = (0, _slicedToArray2.default)(entries[_i7], 2),
                prop = _entries$_i[0],
                value = _entries$_i[1];

            copyProp(docs[Type], prop, result[FieldConstants]);
          }
        }
      }

      Object.defineProperty(Class, 'apiDocs', {
        value: function value() {
          return result;
        }
      });
      setChecklist(Class, CHECK_API_DOCS);
      return Class;
    }
  }, {
    key: "build",
    value: function build(template) {
      var validationResults = this.validateTemplate(template);
      var Class = this.generateClass(template.name, template.type || _GQLBase.GQLBase);

      if (!Class) {
        throw new Error((0, _neTagFns.customDedent)({
          dropLowest: true
        })(_templateObject14(), _i(template)));
      }

      this.injectSchema(Class, template.schema);
      this.injectResolvers(Class, template.resolvers || {});
      this.injectDocs(Class, template.docs || {}); // Need to fix how auto-props work; for now create one instance...

      new Class({});

      if (!hasChecklist(Class, CHECK_SCHEMA, CHECK_RESOLVERS, CHECK_API_DOCS)) {
        var _schema = hasChecklist(Class, CHECK_SCHEMA) ? '✅' : '❌';

        var _resolvers = hasChecklist(Class, CHECK_RESOLVERS) ? '✅' : '❌';

        var _apiDocs = hasChecklist(Class, CHECK_API_DOCS) ? '✅' : '❌';

        throw new Error((0, _neTagFns.customDedent)({
          dropLowest: true
        })(_templateObject15(), Class && Class.name || template && template.name || 'Unknown!', _schema, _resolvers, _apiDocs, _i(template), _i(Class)));
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

  }, {
    key: "brandClass",
    value: function brandClass(Class) {
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

  }, {
    key: "isFactoryClass",
    value: function isFactoryClass(Class) {
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

  }, {
    key: "removeClassBrand",
    value: function removeClassBrand(Class) {
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

  }, {
    key: Symbol.toStringTag,
    get: function get() {
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

  }, {
    key: "TYPE",
    get: function get() {
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

  }, {
    key: "FACTORY_CLASS",
    get: function get() {
      return Symbol.for('Factory Class');
    }
  }]);
  return LatticeFactory;
}();

exports.LatticeFactory = LatticeFactory;
var isFactoryClass = LatticeFactory.isFactoryClass; // TESTING REPL

/**
var { LatticeFactory, getChecklist, hasChecklist, CHECKLIST, CHECK_SCHEMA, CHECK_RESOLVERS } = require('./dist/LatticeFactory'); var { GQLBase, META_KEY, joinLines, SyntaxTree, typeOf } = require('./dist/lattice'); var gql = joinLines, LF = LatticeFactory, TYPE = LF.TYPE;
var PersonDef = { name: 'Person', schema: gql` enum StatType { PHYSICAL, MENTAL } type Person { name: String stats(type:StatType): Stat } type Query { findPerson(id: ID): Person } `, resolvers: { Query: { findPerson({req, res, next}, {id}) { console.log('find person') } }, Person: { stats({type}) { let { req, res, next} = this.requestData } } }, docs: { StatType: { [TYPE]: `A type of statistic associated with people`, PHYSICAL: `Physical attributes`, MENTAL: `Mental attributes` }, Person: { [TYPE]: `Represents a person`, personId: `Unique id of the person in question`, name: `The name of the person`, stats: `Allows you to query the stats of a person based on type` }, Query: { [TYPE]: 'Top level query desc.', findPerson: `Searches the system for the specified user` } } };
var Person = LF.build(PersonDef), p = new Person({name: 'Brielle'})
Person.getProp('stats',true,{requestData:{req:1,res:2,next:3}})
var Broke = LF.build({name: 'Broke', schema: gql`type Broke {name: String}`, resolvers:{}, docs:{}})
var t = LF.validateTemplate({name: '',  type: GQLBase, resolvers: {}, docs: {}, schema: ''});
*/

exports.isFactoryClass = isFactoryClass;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2VzNi9MYXR0aWNlRmFjdG9yeS5qcyJdLCJuYW1lcyI6WyJfaSIsImFyZ3MiLCJpbnNwZWN0IiwiY29sb3JzIiwiZGVwdGgiLCJDSEVDS0xJU1QiLCJTeW1ib2wiLCJmb3IiLCJDSEVDS19TQ0hFTUEiLCJDSEVDS19SRVNPTFZFUlMiLCJDSEVDS19BUElfRE9DUyIsImdldENoZWNrbGlzdCIsIkNsYXNzIiwiTUVUQV9LRVkiLCJzZXRDaGVja2xpc3QiLCJpdGVtIiwidmFsdWUiLCJjaGVja2xpc3QiLCJoYXNDaGVja2xpc3QiLCJpdGVtcyIsImxlbmd0aCIsIm5ld0NoZWNrbGlzdCIsImtleXMiLCJyZWR1Y2UiLCJwIiwiYyIsImkiLCJhIiwiRXJyb3IiLCJkcm9wTG93ZXN0IiwiVmFsaWRhdGlvblJlc3VsdHMiLCJlcnJvcnMiLCJ0b1N0cmluZ1RhZyIsImNvbnN0cnVjdG9yIiwibmFtZSIsIkxhdHRpY2VGYWN0b3J5IiwidGVtcGxhdGUiLCJoaWRlIiwicmVzdWx0cyIsImluZGVudCIsInN0cmluZyIsImNvdW50Iiwic3BhY2UiLCJzcGxpdCIsIm1hcCIsInMiLCJ0cmltIiwicmVwbGFjZSIsInJlcGVhdCIsImpvaW4iLCJwdXNoIiwiU3RyaW5nIiwic2NoZW1hIiwicmVzb2x2ZXJzIiwiT2JqZWN0IiwiZG9jcyIsImRyIiwiYnIiLCJiMSIsImIwIiwiYmIiLCJkZyIsImJnIiwiYTAiLCJnciIsImJnciIsInZhbGlkIiwiZXJyb3JTdHJpbmdzIiwiZXJyb3IiLCJtZXNzYWdlIiwic3RhY2siLCJzcGxpY2UiLCJiYXNlQ2xhc3MiLCJHUUxCYXNlIiwiZm4iLCJldmFsIiwiYnJhbmRDbGFzcyIsImRlZmluZVByb3BlcnR5IiwiZ2V0IiwidHJlZSIsIlN5bnRheFRyZWUiLCJmcm9tIiwiU0NIRU1BIiwib3V0bGluZSIsImZpZWxkcyIsImZpZWxkUmVzb2x2ZXIiLCJMTCIsIndhcm4iLCJwcm9wIiwiaW5mbyIsInByb3RvdHlwZSIsInJlc29sdmVyIiwibXV0YXRvciIsInN1YnNjcmlwdG9yIiwidHlwZSIsImRlY29yYXRvciIsImZuTmFtZSIsImNvcHlQcm9wIiwibyIsInRvIiwiYXMiLCJnZXRQcm90b3R5cGVPZiIsImRlc2NyaXB0b3IiLCJnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IiLCJyZXN1bHQiLCJUWVBFIiwiRE9DX0NMQVNTIiwiRE9DX0ZJRUxEUyIsIkRPQ19RVUVSWSIsIkRPQ19NVVRBVElPTiIsIkRPQ19TVUJTQ1JJUFRJT04iLCJET0NfUVVFUklFUyIsIkRPQ19NVVRBVElPTlMiLCJET0NfU1VCU0NSSVBUSU9OUyIsIlR5cGUiLCJUb3BMZXZlbENvbnN0YW50IiwiRmllbGRDb25zdGFudHMiLCJlbnRyaWVzIiwidmFsaWRhdGlvblJlc3VsdHMiLCJ2YWxpZGF0ZVRlbXBsYXRlIiwiZ2VuZXJhdGVDbGFzcyIsImluamVjdFNjaGVtYSIsImluamVjdFJlc29sdmVycyIsImluamVjdERvY3MiLCJfc2NoZW1hIiwiX3Jlc29sdmVycyIsIl9hcGlEb2NzIiwiRkFDVE9SWV9DTEFTUyIsImlzRmFjdG9yeUNsYXNzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFFQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSxFQUFFLEdBQUcsU0FBTEEsRUFBSztBQUFBLG9DQUFJQyxJQUFKO0FBQUlBLElBQUFBLElBQUo7QUFBQTs7QUFBQSxTQUFhQyw0QkFBV0QsSUFBWCxTQUFpQjtBQUFDRSxJQUFBQSxNQUFNLEVBQUUsSUFBVDtBQUFlQyxJQUFBQSxLQUFLLEVBQUU7QUFB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QkFBWCxDQUFQO0FBQTZDO0FBRXpFOzs7Ozs7Ozs7Ozt3QkFRbUM7QUFBRSxhQUFPRCxNQUFNLENBQUNDLEdBQVAsQ0FBVyxlQUFYLENBQVA7QUFBb0M7Ozs7OztBQUdwRSxJQUFNeUgsY0FBYyxHQUFHN0YsY0FBYyxDQUFDNkYsY0FBdEMsQyxDQUVQOztBQUNBIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQGZsb3dcblxuaW1wb3J0IHsgR1FMQmFzZSwgTUVUQV9LRVkgfSBmcm9tICcuL0dRTEJhc2UnXG5pbXBvcnQgeyBHUUxFbnVtIH0gZnJvbSAnLi9HUUxFbnVtJ1xuaW1wb3J0IHsgR1FMSW50ZXJmYWNlIH0gZnJvbSAnLi9HUUxJbnRlcmZhY2UnXG5pbXBvcnQgeyBHUUxTY2FsYXIgfSBmcm9tICcuL0dRTFNjYWxhcidcbi8vIGltcG9ydCB7IEdRTFVuaW9uIH0gZnJvbSAnLi9HUUxVbmlvbidcbmltcG9ydCB7IFN5bnRheFRyZWUgfSBmcm9tICcuL1N5bnRheFRyZWUnXG5pbXBvcnQgeyBjdXN0b21EZWRlbnQgfSBmcm9tICduZS10YWctZm5zJ1xuaW1wb3J0IHsgdHlwZU9mLCBleHRlbmRzRnJvbSB9IGZyb20gJ25lLXR5cGVzJ1xuaW1wb3J0IHsgaW5zcGVjdCB9IGZyb20gJ3V0aWwnXG5pbXBvcnQgeyByZXNvbHZlciwgbXV0YXRvciwgc3Vic2NyaXB0b3IgfSBmcm9tICcuL2RlY29yYXRvcnMvUmVzb2x2ZXJzJ1xuaW1wb3J0IHsgUHJvcGVydGllcyB9IGZyb20gJy4vZGVjb3JhdG9ycy9Nb2RlbFByb3BlcnRpZXMnXG5pbXBvcnQgeyBMYXR0aWNlTG9ncyBhcyBMTCB9IGZyb20gJy4vdXRpbHMnXG5cbmNvbnN0IF9pID0gKC4uLmFyZ3MpID0+IGluc3BlY3QoLi4uYXJncywge2NvbG9yczogdHJ1ZSwgZGVwdGg6IDN9KVxuXG5cbi8qKlxuICogVGhlIENIRUNLTElTVCBTeW1ib2wgaXMgdXNlZCBhcyBhIHN0b3JhZ2Uga2V5IGluIHRoZSBtZXRhZGF0YSBzdGFnaW5nXG4gKiBhcmVhIGZvciBlYWNoIG9mIHRoZSBHUUxCYXNlIGV4dGVuZGVkIGNsYXNzZXMuIEluIHRoZSBMYXR0aWNlRmFjdG9yeVxuICogaXQgaXMgdXNlZCB0byBkZXRlcm1pbmUgd2hlcmUgaW4gdGhlIGZsb3cgb2YgY29uc3RydWN0aW9uIHRoZSBjbGFzc1xuICogY3VycmVudGx5IGlzLlxuICpcbiAqIEB0eXBlIHtTeW1ib2x9XG4gKi9cbmV4cG9ydCBjb25zdCBDSEVDS0xJU1QgPSBTeW1ib2wuZm9yKCdjaGVja2xpc3QnKVxuXG4vKipcbiAqIFRoZSBDSEVDS19TQ0hFTUEgU3ltYm9sIGlzIHBhcnQgb2YgdGhlIENIRUNLTElTVCBmb3IgYSBjb25zdHJ1Y3RlZFxuICogR1FMQmFzZSBleHRlbmRlZCBjbGFzcy4gSXQgZGVub3RlcyB0aGF0IHRoZSBjbGFzcyBoYXMgaGFkIGl0cyBTQ0hFTUFcbiAqIGdldHRlciBkZWZpbmVkLlxuICpcbiAqIEB0eXBlIHtTeW1ib2x9XG4gKi9cbmV4cG9ydCBjb25zdCBDSEVDS19TQ0hFTUEgPSBTeW1ib2wuZm9yKCdjaGVja2xpc3Qtc2NoZW1hJylcblxuLyoqXG4gKiBUaGUgQ0hFQ0tfUkVTT0xWRVJTIFN5bWJvbCBpcyBwYXJ0IG9mIHRoZSBDSEVDS0xJU1QgZm9yIGEgY29uc3RydWN0ZWRcbiAqIEdRTEJhc2UgZXh0ZW5kZWQgY2xhc3MuIEl0IGRlbm90ZXMgdGhhdCB0aGUgY2xhc3MgaGFzIGhhZCBpdHMgaW5zdGFuY2VcbiAqIGZpZWxkIHJlc29sdmVycyBhcyB3ZWxsIGFzIGl0cyBzdGF0aWMgUXVlcnksIE11dGF0aW9uIGFuZCBTdWJzY3JpcHRpb25cbiAqIHJlc29sdmVycyBpbmplY3RlZCBhbmQgZGVmaW5lZC5cbiAqXG4gKiBAdHlwZSB7U3ltYm9sfVxuICovXG5leHBvcnQgY29uc3QgQ0hFQ0tfUkVTT0xWRVJTID0gU3ltYm9sLmZvcignY2hlY2tsaXN0LXJlc29sdmVycycpXG5cbi8qKlxuICogVGhlIENIRUNLX0FQSV9ET0NTIFN5bWJvbCBpcyBwYXJ0IG9mIHRoZSBDSEVDS0xJU1QgZm9yIGEgY29uc3RydWN0ZWRcbiAqIEdRTEJhc2UgZXh0ZW5kZWQgY2xhc3MuIEl0IGRlbm90ZXMgdGhhdCB0aGUgY2xhc3MgaGFzIGhhZCBpdHMgYXBpIGRvY3NcbiAqIGRlZmluZWQsIHByb2Nlc3NlZCBhbmQgc2V0dXAgb24gdGhlIGNsYXNzIGluIGEgd2F5IHRoYXQgaXQgd2lsbCBiZVxuICogcGlja2VkIHVwIGluIHRoZSBidWlsZCBsaWZlY3ljbGUuXG4gKlxuICogQHR5cGUge1N5bWJvbH1cbiAqL1xuZXhwb3J0IGNvbnN0IENIRUNLX0FQSV9ET0NTID0gU3ltYm9sLmZvcignY2hlY2tsaXN0LWFwaS1kb2NzJylcblxuLyoqXG4gKiBQZWVrcyBpbnRvIHRoZSBtZXRhZGF0YSBzdG9yYWdlIGFyZWEgb2YgYSBnaXZlbiBHUUxCYXNlIGV4dGVuZGVkXG4gKiBjbGFzcyBhbmQgZmV0Y2hlcyB0aGUgZmFjdG9yeSBjaGVja2xpc3QgaWYgb25lIGV4aXN0cy5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBDbGFzcyBhIHJlZmVyZW5jZSB0byB0aGUgR1FMQmFzZSBjbGFzcyB0byBwZWVrIGluXG4gKiBAcmV0dXJuIHtPYmplY3R9IGFuIG9iamVjdCBzZXR1cCB3aXRoIGF0IGxlYXN0IHRocmVlIGJvb2xlYW5zIGtleWVkIGJ5XG4gKiB0aGUgY29uc3RhbnRzIENIRUNLX1NDSEVNQSwgQ0hFQ0tfUkVTT0xWRVJTLCBhbmQgQ0hFQ0tfQVBJX0RPQ1Mgb3IgbnVsbFxuICogaWYgbm9uZSBleGlzdHNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldENoZWNrbGlzdChDbGFzczogRnVuY3Rpb24pIHtcbiAgcmV0dXJuIChDbGFzcyAmJiBDbGFzc1tNRVRBX0tFWV0gJiYgQ2xhc3NbTUVUQV9LRVldW0NIRUNLTElTVF0pIHx8IG51bGxcbn1cblxuLyoqXG4gKiBPYnRhaW5zIHRoZSBjaGVja2xpc3QgZnJvbSB0aGUgc3VwcGxpZWQgR1FMQmFzZSBleHRlbmRlZCBjbGFzcy4gSWYgdGhlXG4gKiBjbGFzcyBoYXMgYSBjaGVja2xpc3QsIGl0cyBjaGVja2xpc3QgaXRlbSBpcyBzZXQgdG8gdHJ1ZSBvciB0aGUgYm9vbGVhblxuICogdmFsdWUgc3BlY2lmaWVkLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IENsYXNzIGEgcmVmZXJlbmNlIHRvIHRoZSBHUUxCYXNlIGNsYXNzIHRvIHNldFxuICogQHBhcmFtIHtTeW1ib2x9IGl0ZW0gb25lIG9mIENIRUNLX1NDSEVNQSwgQ0hFQ0tfUkVTT0xWRVJTLCBvclxuICogQ0hFQ0tfQVBJX0RPQ1NcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gdmFsdWUgdGhlIHZhbHVlIGZvciB0aGUgY2hlY2tsaXN0IGl0ZW0gdG8gc2V0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzZXRDaGVja2xpc3QoXG4gIENsYXNzOiBGdW5jdGlvbixcbiAgaXRlbTogU3ltYm9sLFxuICB2YWx1ZTogYm9vbGVhbiA9IHRydWVcbikge1xuICBsZXQgY2hlY2tsaXN0ID0gZ2V0Q2hlY2tsaXN0KENsYXNzKVxuXG4gIGlmIChjaGVja2xpc3QpIHtcbiAgICAvLyAkRmxvd0ZpeE1lXG4gICAgY2hlY2tsaXN0W2l0ZW1dID0gdmFsdWVcbiAgfVxufVxuXG4vKipcbiAqIFRoaXMgZnVuY3Rpb24sIHdoZW4gaW52b2tlZCB3aXRoIG9ubHkgYSBjbGFzcyB3aWxsIHJldHVybiB0cnVlIGlmIHRoZVxuICogQ2xhc3MgaGFzIGEgZGVmaW5lZCBjaGVja2xpc3QuIElmIG9uZSBvcmUgbW9yZSBDSEVDS0xJU1Qgc3ltYm9scyBhcmVcbiAqIHBhc3NlZCwgdGhlIGZ1bmN0aW9uIHdpbGwgb25seSByZXR1cm4gdHJ1ZSBpZiBhbGwgdGhlIHN1cHBsaWVkIHN5bWJvbHNcbiAqIGFyZSBzZXQgdG8gdHJ1dGh5IHZhbHVlcy5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBDbGFzcyBhIHJlZmVyZW5jZSB0byB0aGUgR1FMQmFzZSBjbGFzcyB0byBzZXRcbiAqIEBwYXJhbSB7QXJyYXk8U3ltYm9sPn0gaXRlbXMgYW55IG9mIENIRUNLX1NDSEVNQSwgQ0hFQ0tfUkVTT0xWRVJTLCBvclxuICogQ0hFQ0tfQVBJX0RPQ1NcbiAqIEByZXR1cm4ge0Jvb2xlYW59IHRydWUgaWYgdGhlIGNoZWNrbGlzdCBhbmQvb3IgYWxsIGl0ZW1zIGFyZSB0cnVlIGFuZFxuICogcHJlc2VudC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGhhc0NoZWNrbGlzdChDbGFzczogRnVuY3Rpb24sIC4uLml0ZW1zOiBBcnJheTxTeW1ib2w+KSB7XG4gIGxldCBjaGVja2xpc3QgPSBnZXRDaGVja2xpc3QoQ2xhc3MpXG5cbiAgaWYgKGNoZWNrbGlzdCAmJiBpdGVtcy5sZW5ndGgpIHtcbiAgICBmb3IgKGxldCBpdGVtIG9mIGl0ZW1zKSB7XG4gICAgICBpZiAoIWNoZWNrbGlzdFtpdGVtXSkge1xuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZVxuICB9XG5cbiAgcmV0dXJuIGNoZWNrbGlzdFxufVxuXG4vKipcbiAqIEluamVjdHMgYW5kIGNyZWF0ZXMgYSBuZXcgQ0hFQ0tMSVNUIG9iamVjdCBvbiB0aGUgc3VwcGxpZWQgR1FMQmFzZVxuICogZXh0ZW5kZWQgY2xhc3MuIEFsbCBpdGVtcyBhcmUgaW5zdGFsbGVkIGFuZCBzZXQgdG8gZmFsc2UuXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gQ2xhc3MgYSByZWZlcmVuY2UgdG8gdGhlIEdRTEJhc2UgY2xhc3MgdG8gc2V0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBuZXdDaGVja2xpc3QoQ2xhc3M6IEZ1bmN0aW9uKSB7XG4gIGlmIChDbGFzcykge1xuICAgIC8vICRGbG93Rml4TWVcbiAgICBDbGFzc1tNRVRBX0tFWV1bQ0hFQ0tMSVNUXSA9IHtcbiAgICAgIFtDSEVDS19TQ0hFTUFdOiBmYWxzZSxcbiAgICAgIFtDSEVDS19SRVNPTFZFUlNdOiBmYWxzZSxcbiAgICAgIFtDSEVDS19BUElfRE9DU106IGZhbHNlLFxuXG4gICAgICBnZXQga2V5cygpIHtcbiAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICBDSEVDS19TQ0hFTUEsIENIRUNLX1JFU09MVkVSUywgQ0hFQ0tfQVBJX0RPQ1NcbiAgICAgICAgXVxuICAgICAgfSxcblxuICAgICAgZ2V0IGNvbXBsZXRlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5rZXlzLnJlZHVjZSgocCxjLGksYSkgPT4ge1xuICAgICAgICAgIGlmICghcCB8fCAhdGhpc1tjXSkgeyByZXR1cm4gZmFsc2UgfVxuICAgICAgICB9LCB0cnVlKVxuICAgICAgfVxuICAgIH1cbiAgfVxuICBlbHNlIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoY3VzdG9tRGVkZW50KHtkcm9wTG93ZXN0OnRydWV9KWBcbiAgICAgIENhbm5vdCBjcmVhdGUgbmV3IGNoZWNrbGlzdCBtZXRhZGF0YSBvbiBhIG5vbi1leGlzdGVudCBjbGFzc1xuICAgIGApXG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFZhbGlkYXRpb25SZXN1bHRzIHtcbiAgZXJyb3JzOiBBcnJheTxFcnJvcj5cblxuICBjb25zdHJ1Y3RvcihlcnJvcnM6IEFycmF5PEVycm9yPiA9IFtdKSB7XG4gICAgdGhpcy5lcnJvcnMgPSBlcnJvcnNcbiAgfVxuXG4gIGdldCB2YWxpZCgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuZXJyb3JzLmxlbmd0aCA9PT0gMCB9XG5cbiAgLy8gJEZsb3dGaXhNZVxuICBnZXQgW1N5bWJvbC50b1N0cmluZ1RhZ10oKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMuY29uc3RydWN0b3IubmFtZSB9XG5cbiAgLy8gJEZsb3dGaXhNZVxuICBzdGF0aWMgZ2V0IFtTeW1ib2wudG9TdHJpbmdUYWddKCk6IHN0cmluZyB7IHJldHVybiB0aGlzLm5hbWUgfVxufVxuXG5leHBvcnQgY2xhc3MgTGF0dGljZUZhY3Rvcnkge1xuXG4gIC8qKlxuICAgKiBXYWxrcyB0aHJvdWdoIGEgc3VwcGxpZWQgdGVtcGxhdGUgb2JqZWN0IGFuZCBjb2xsZWN0cyBlcnJvcnMgd2l0aCBpdHNcbiAgICogZm9ybWF0IGJlZm9yZSBidWJibGluZyB1cCBhbiBleGNlcHRpb24gaWYgYW55IHBhcnQgb2YgaXQgZmFpbHMgdG9cbiAgICogcGFzcyBtdXN0ZXIuIFRoZSBleGNlcHRpb24gY2FuIGJlIHByZXZlbnRlZCBmcm9tIHRocm93aW5nIGlmIGhpZGUgaXMgc2V0XG4gICAqIHRvIHRydWVcbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IHRlbXBsYXRlIGFuIG9iamVjdCB0byBiZSBwYXJzZWQgZm9yIGNvbnN0cnVjdGlvbiB2aWEgdGhlXG4gICAqIExhdHRpY2UgRmFjdG9yeVxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGhpZGUgaWYgdHJ1ZSwgYW4gaW52YWxpZCB0ZW1wbGF0ZSB3aWxsIE5PVCB0aHJvdyBlcnJvcnNcbiAgICogQHJldHVybiB7VmFsaWRhdGlvblJlc3VsdHN9IGEgYFZhbGlkYXRpb25SZXN1bHRzYCBvYmplY3QgY29udGFpbmluZyB0aGVcbiAgICogY29sbGVjdGVkIGVycm9ycyBhbmQgYSBgdmFsaWRgIHRoYXQgaXMgZHluYW1pY2FsbHkgY2FsY3VsYXRlZC5cbiAgICovXG4gIHN0YXRpYyB2YWxpZGF0ZVRlbXBsYXRlKFxuICAgIHRlbXBsYXRlOiBPYmplY3QsXG4gICAgaGlkZTogYm9vbGVhbiA9IGZhbHNlXG4gICk6IFZhbGlkYXRpb25SZXN1bHRzIHtcbiAgICBsZXQgcmVzdWx0cyA9IG5ldyBWYWxpZGF0aW9uUmVzdWx0cygpXG4gICAgbGV0IGluZGVudCA9IChzdHJpbmc6IHN0cmluZywgY291bnQ6IG51bWJlciA9IDQsIHNwYWNlOiBzdHJpbmcgPSAnICcpID0+IChcbiAgICAgIHN0cmluZ1xuICAgICAgICAuc3BsaXQoJ1xcbicpXG4gICAgICAgIC5tYXAocyA9PiBzLnRyaW0oKS5yZXBsYWNlKC8oXikvZ20sIGAkMSR7c3BhY2UucmVwZWF0KGNvdW50KX1gKSlcbiAgICAgICAgLmpvaW4oJ1xcbicpXG4gICAgKVxuXG4gICAgaWYgKHR5cGVvZiB0ZW1wbGF0ZS5uYW1lID09PSAndW5kZWZpbmVkJykge1xuICAgICAgcmVzdWx0cy5lcnJvcnMucHVzaChuZXcgRXJyb3IoY3VzdG9tRGVkZW50KHtkcm9wTG93ZXN0OnRydWV9KWBcbiAgICAgICAgVGhlIFxcYHRlbXBsYXRlLm5hbWVcXGAgZmllbGQgbXVzdCBleGlzdCBvciB0aGUgY3JlYXRpb24gZm9yIHRoZSBMYXR0aWNlXG4gICAgICAgIGZhY3RvcnkgY2xhc3MgZ2VuZXJhdGlvbiB0byBzdWNjZWVkLlxuXG4gICAgICAgIFBsZWFzZSByZWFkIHRoZSBkb2N1bWVudGF0aW9uIGZvciBtb3JlIGluZm9ybWF0aW9uIG9uIHRoZSBmb3JtYXQgb2ZcbiAgICAgICAgYSBMYXR0aWNlRmFjdG9yeSB0ZW1wbGF0ZS5cbiAgICAgIGApKVxuICAgIH1cblxuICAgIGlmICghZXh0ZW5kc0Zyb20odGVtcGxhdGUubmFtZSwgU3RyaW5nKSkge1xuICAgICAgcmVzdWx0cy5lcnJvcnMucHVzaChuZXcgRXJyb3IoY3VzdG9tRGVkZW50KHtkcm9wTG93ZXN0OnRydWV9KWBcbiAgICAgICAgVGhlIFxcYHRlbXBsYXRlLm5hbWVcXGAgZmllbGQgbXVzdCBiZSBhIHN0cmluZy5cblxuICAgICAgICBQbGVhc2UgcmVhZCB0aGUgZG9jdW1lbnRhdGlvbiBmb3IgbW9yZSBpbmZvcm1hdGlvbiBvbiB0aGUgZm9ybWF0IG9mXG4gICAgICAgIGEgTGF0dGljZUZhY3RvcnkgdGVtcGxhdGUuXG4gICAgICBgKSlcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIHRlbXBsYXRlLnNjaGVtYSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHJlc3VsdHMuZXJyb3JzLnB1c2gobmV3IEVycm9yKGN1c3RvbURlZGVudCh7ZHJvcExvd2VzdDp0cnVlfSlgXG4gICAgICAgIFRoZSBcXGB0ZW1wbGF0ZS5zY2hlbWFcXGAgZmllbGQgbXVzdCBleGlzdCBvciB0aGUgY3JlYXRpb24gZm9yIHRoZVxuICAgICAgICBMYXR0aWNlIGZhY3RvcnkgY2xhc3MgZ2VuZXJhdGlvbiB0byBzdWNjZWVkLlxuXG4gICAgICAgIFBsZWFzZSByZWFkIHRoZSBkb2N1bWVudGF0aW9uIGZvciBtb3JlIGluZm9ybWF0aW9uIG9uIHRoZSBmb3JtYXQgb2ZcbiAgICAgICAgYSBMYXR0aWNlRmFjdG9yeSB0ZW1wbGF0ZS5cbiAgICAgIGApKVxuICAgIH1cblxuICAgIGlmICghZXh0ZW5kc0Zyb20odGVtcGxhdGUuc2NoZW1hLCBTdHJpbmcpKSB7XG4gICAgICByZXN1bHRzLmVycm9ycy5wdXNoKG5ldyBFcnJvcihjdXN0b21EZWRlbnQoe2Ryb3BMb3dlc3Q6dHJ1ZX0pYFxuICAgICAgICBUaGUgXFxgdGVtcGxhdGUuc2NoZW1hXFxgIGZpZWxkIG11c3QgYmUgYSBzdHJpbmcgb2YgR3JhcGhRTCBTREwvSURMXG5cbiAgICAgICAgUGxlYXNlIHJlYWQgdGhlIGRvY3VtZW50YXRpb24gZm9yIG1vcmUgaW5mb3JtYXRpb24gb24gdGhlIGZvcm1hdCBvZlxuICAgICAgICBhIExhdHRpY2VGYWN0b3J5IHRlbXBsYXRlLlxuICAgICAgYCkpXG4gICAgfVxuXG4gICAgaWYgKFxuICAgICAgIWV4dGVuZHNGcm9tKHRlbXBsYXRlLnJlc29sdmVycywgT2JqZWN0KSAgLy8gU3VwcG9ydHMgOTUlIG9mIG9iamVjdHNcbiAgICAgIHx8IHR5cGVvZiB0ZW1wbGF0ZS5yZXNvbHZlcnMgIT09ICdvYmplY3QnIC8vIFN1cHBvcnRzIE9iamVjdC5jcmVhdGUobnVsbClcbiAgICApIHtcbiAgICAgIHJlc3VsdHMuZXJyb3JzLnB1c2gobmV3IEVycm9yKGN1c3RvbURlZGVudCh7ZHJvcExvd2VzdDp0cnVlfSlgXFx4MWJbOTE7MW1cbiAgICAgICAgVGhlIFxcYHRlbXBsYXRlLnJlc29sdmVyc1xcYCBmaWVsZCBtdXN0IGJlIGFuIE9iamVjdCBjb250YWluaW5nIHRoZVxuICAgICAgICByZXNvbHZlciBmdW5jdGlvbnMuIFF1ZXJ5LCBNdXRhdGlvbiBhbmQgU3Vic2NyaXB0aW9uIHJlc29sdmVycyB3aWxsXG4gICAgICAgIHRha2UgdGhlIGZvbGxvd2luZyBzaWduYXR1cmUuIEFkZGl0aW9uYWxseSwgdGhlIGtleXMgZm9yIHRoZXNlIHNwZWNpYWxcbiAgICAgICAgcmVzb2x2ZXJzIG11c3QgYmUgUXVlcnksIE11dGF0aW9uIG9yIFN1YnNjcmlwdGlvbjsgcmVzcGVjdGl2ZWx5XG4gICAgICAgIFxceDFiWzM3OzIybVxuICAgICAgICAgIFF1ZXJ5OiB7IFtyZXNvbHZlcl06IChyZXF1ZXN0RGF0YSwgcmVzb2x2ZXJQYXJhbWV0ZXJzKSA9PiB7fSB9XG4gICAgICAgICAgTXV0YXRpb246IHsgW3Jlc29sdmVyXTogKHJlcXVlc3REYXRhLCByZXNvbHZlclBhcmFtZXRlcnMpID0+IHt9IH1cbiAgICAgICAgICBTdWJzY3JpcHRpb246IHsgW3Jlc29sdmVyXTogKHJlcXVlc3REYXRhLCByZXNvbHZlclBhcmFtZXRlcnMpID0+IHt9IH1cblxuICAgICAgICAgIHdoZXJlOlxuICAgICAgICAgICAgXFxgcmVxdWVzdERhdGFcXGAgaXMgYW4gb2JqZWN0IHdpdGggeyByZXEsIHJlcywgZ3FsfG5leHQgfSBkZXBlbmRpbmdcbiAgICAgICAgICAgICAgb24gdGhlIGdyYXBocWwgc2VydmVyIGltcGxlbWVudGF0aW9uIChGQiBSZWZlcmVuY2UsIEFwb2xsbywgZXRjKVxuICAgICAgICAgICAgXFxgcmVzb3ZsZXJQYXJhbWV0ZXJzXFxgIGlzIGFuIG9iamVjdCB3aXRoIGtleXMgbWF0Y2hpbmcgdGhvc2VcbiAgICAgICAgICAgICAgcGFyYW1ldGVycyBkZWZpbmVkIGluIHRoZSBTQ0hFTUEgZm9yIHRoZSByZXNvbHZlciBpbiBxdWVzdGlvbi5cbiAgICAgICAgXFx4MWJbOTE7MW1cbiAgICAgICAgRmllbGQgcmVzb2x2ZXJzIHNob3VsZCBiZSBmb3VuZCB1bmRlciB0aGUga2V5IG5hbWUgb2YgdGhlIHR5cGVcbiAgICAgICAgb3IgaW50ZXJmYWNlIGluIHF1ZXN0aW9uIGFuZCBtdXN0IGNvcnJlc3BvbmQgdG8gdGhlIGZvbGxvd2luZyBzaWduYXR1cmVcbiAgICAgICAgXFx4MWJbMzc7MjJtXG4gICAgICAgICAgW1R5cGVdOiB7IFtyZXNvbHZlcl06IChyZXNvbHZlclBhcmFtZXRlcnMpID0+IHt9IH1cblxuICAgICAgICAgIHdoZXJlOlxuICAgICAgICAgICAgXFxgVHlwZVxcYCBpcyB0aGUgbmFtZSBvZiB0aGUgR1FMIHR5cGUgZGVmaW5lZCBpbiB0aGUgc2NoZW1hXG4gICAgICAgICAgICBcXGByZXNvdmxlclBhcmFtZXRlcnNcXGAgaXMgYW4gb2JqZWN0IHdpdGgga2V5cyBtYXRjaGluZyB0aG9zZVxuICAgICAgICAgICAgICBwYXJhbWV0ZXJzIGRlZmluZWQgaW4gdGhlIFNDSEVNQSBmb3IgdGhlIHJlc29sdmVyIGluIHF1ZXN0aW9uLlxuXG4gICAgICAgICAgKiBpdCBpcyB3b3J0aCBub3RpbmcgdGhhdCB0aGUgZmllbGQgcmVzb2x2ZXJzIGFyZSBub3Qgc3RhdGljIGFuZFxuICAgICAgICAgICAgY2FuIGFjY2VzcyB0aGUgXFxgcmVxdWVzdERhdGFcXGAgb2JqZWN0IHZpYSBcXGB0aGlzLnJlcXVlc3REYXRhXFxgXG4gICAgICAgIFxceDFiWzkxOzFtXG4gICAgICAgIFBsZWFzZSByZWFkIHRoZSBkb2N1bWVudGF0aW9uIGZvciBtb3JlIGluZm9ybWF0aW9uIG9uIHRoZSBmb3JtYXQgb2ZcbiAgICAgICAgYSBMYXR0aWNlRmFjdG9yeSB0ZW1wbGF0ZS5cXHgxYlswbVxuICAgICAgYCkpXG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiB0ZW1wbGF0ZS5kb2NzID09PSAndW5kZWZpbmVkJykge1xuICAgICAgcmVzdWx0cy5lcnJvcnMucHVzaChuZXcgRXJyb3IoY3VzdG9tRGVkZW50KHtkcm9wTG93ZXN0OnRydWV9KWBcbiAgICAgICAgVGhlIFxcYHRlbXBsYXRlLmRvY3NcXGAgZmllbGQgbXVzdCBleGlzdCBmb3IgdGhlIGNyZWF0aW9uIG9mIHRoZVxuICAgICAgICBMYXR0aWNlIGZhY3RvcnkgY2xhc3MgZ2VuZXJhdGlvbiB0byBzdWNjZWVkLlxuXG4gICAgICAgIFBsZWFzZSByZWFkIHRoZSBkb2N1bWVudGF0aW9uIGZvciBtb3JlIGluZm9ybWF0aW9uIG9uIHRoZSBmb3JtYXQgb2ZcbiAgICAgICAgYSBMYXR0aWNlRmFjdG9yeSB0ZW1wbGF0ZS5cbiAgICAgIGApKVxuICAgIH1cblxuICAgIGlmIChcbiAgICAgICFleHRlbmRzRnJvbSh0ZW1wbGF0ZS5kb2NzLCBPYmplY3QpICAvLyBTdXBwb3J0cyA5NSUgb2Ygb2JqZWN0c1xuICAgICAgfHwgdHlwZW9mIHRlbXBsYXRlLmRvY3MgIT09ICdvYmplY3QnIC8vIFN1cHBvcnRzIE9iamVjdC5jcmVhdGUobnVsbClcbiAgICApIHtcbiAgICAgIGxldCBkciA9ICdcXHgxYlszMW0nLCBiciA9ICdcXHgxYls5MW0nXG4gICAgICBsZXQgYjEgPSAnXFx4MWJbMW0nLCBiMCA9ICdcXHgxYlsyMm0nXG4gICAgICBsZXQgYmIgPSAnXFx4MWJbOTBtJ1xuICAgICAgbGV0IGRnID0gJ1xceDFiWzM3bScsIGJnID0gJ1xceDFiWzk3bSdcbiAgICAgIGxldCBhMCA9ICdcXHgxYlswbSdcbiAgICAgIGxldCBnciA9ICdcXHgxYlszMm0nLCBiZ3IgPSAnXFx4MWJbOTJtJ1xuXG4gICAgICByZXN1bHRzLmVycm9ycy5wdXNoKG5ldyBFcnJvcihjdXN0b21EZWRlbnQoe2Ryb3BMb3dlc3Q6dHJ1ZX0pYFxceDFiWzE7OTFtXG4gICAgICAgIFRoZSBcXGB0ZW1wbGF0ZS5kb2NzXFxgIGZpZWxkIG11c3QgYmUgYW4gb2JqZWN0IGNvbnRhaW5pbmcga2V5cyBhbmRcbiAgICAgICAgdmFsdWUgcGFpcnMgbWF0Y2hpbmcgdGhlIHR5cGVzLCBlbnVtcywgdW5pb25zIGFuZCBpbnRlcmZhY2VzIGRlZmluZWRcbiAgICAgICAgaW4geW91ciBzY2hlbWEuXG5cbiAgICAgICAgVGhlIHNwZWNpYWwgU3ltYm9sIG9iamVjdCBUWVBFIGNhbiBiZSB1c2VkIHRvIHJlZmVyZW5jZSB0aGUgZG9jcyBmb3JcbiAgICAgICAgdGhlIG5hbWVkIG9yIGtleWVkIGZpZWxkIGRlc2NyaWJpbmcgdGhlIGRvY3VtZW50YXRpb24gdG8gYmUgcHJvY2Vzc2VkXG4gICAgICAgIENvbW1lbnRzIGZvciB0aGUgXFxgUXVlcnlcXGAsIFxcYE11dGF0aW9uXFxgLCBhbmQgXFxgU3Vic2NyaXB0aW9uXFxgIFtUWVBFXVxuICAgICAgICBlbnRyaWVzIHdpbGwgcmVwbGFjZSBhbnkgcHJldmlvdXMgb25lIHRoYXQgY29tZXMgYmVmb3JlIGl0LiBUeXBpY2FsbHlcbiAgICAgICAgdGhpcyBmaWVsZCBpcyBiZXN0IGxlZnQgdW5kZXNjcmliZWQgc2luY2UgdGhlcmUgd2lsbCBldmVyIG9ubHkgYmVcbiAgICAgICAgb25lIG9mIGVhY2ggYXQgbW9zdC5cblxuICAgICAgICBcXHgxYlsyMjszMW1FeGFtcGxlcyBzaG91bGQgbG9vayBzb21ldGhpbmcgbGlrZSB0aGlzOlxceDFiWzIyOzM3bVxuICAgICAgICAgIGltcG9ydCB7IFRZUEUsIGpvaW5MaW5lcyB9IGZyb20gJ2dyYXBocWwtbGF0dGljZSdcblxuICAgICAgICAgIGV4cG9ydCBkZWZhdWx0IHtcbiAgICAgICAgICAgICR7YmJ9Lyogb3RoZXIgZmllbGRzICovJHtkZ31cblxuICAgICAgICAgICAgJHtiMX1zY2hlbWE6JHtiMH0gam9pbkxpbmVzJHtncn1cXGBcbiAgICAgICAgICAgICAgdHlwZSBQZXJzb24geyBpZDogSUQgbmFtZTogU3RyaW5nIH1cbiAgICAgICAgICAgICAgdHlwZSBRdWVyeSB7IGZpbmRQZXJzb24oaWQ6IElEKTogUGVyc29uIH1cbiAgICAgICAgICAgICAgdHlwZSBNdXRhdGlvbiB7IHNldFBlcnNvbk5hbWUoaWQ6IElELCBuYW1lOiBTdHJpbmcpOiBQZXJzb24gfVxuICAgICAgICAgICAgXFxgJHtkZ30sXG5cbiAgICAgICAgICAgICR7YjF9ZG9jczoke2IwfSB7XG4gICAgICAgICAgICAgICR7YjF9UGVyc29uOiR7YjB9IHtcbiAgICAgICAgICAgICAgICBbVFlQRV06ICR7Z3J9J0EgY29udHJpdmVkIHBlcnNvbiB0eXBlJyR7ZGd9LFxuICAgICAgICAgICAgICAgIGlkOiAke2dyfSdBIHVuaXF1ZSBpZGVudGlmaWVyIGZvciBhIHBlcnNvbicke2RnfSxcbiAgICAgICAgICAgICAgICBuYW1lOiAke2dyfSdBIHN0cmluZyBkZW5vdGluZyB0aGUgbmFtZSBvZiBhIHBlcnNvbicke2RnfVxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAke2IxfVF1ZXJ5OiR7YjB9IHtcbiAgICAgICAgICAgICAgICBmaW5kUGVyc29uOiAke2dyfSdBIHF1ZXJ5IHRha2luZyBhbiBJRCwgcmV0dXJucyBhIFBlcnNvbicke2RnfSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgJHtiMX1NdXRhdGlvbjoke2IwfSB7XG4gICAgICAgICAgICAgICAgc2V0UGVyc29uTmFtZTogam9pbkxpbmVzJHtncn1cXGBcbiAgICAgICAgICAgICAgICAgIEEgbXV0YXRpb24gdGhhdCBzZXRzIHRoZSBuYW1lIG9mIHRoZSB1c2VyIGlkZW50aWZpZWQgYnkgYW5cbiAgICAgICAgICAgICAgICAgIElEIHRvIHRoZSBuZXcgbmFtZSB2YWx1ZSBzdXBwbGllZFxuICAgICAgICAgICAgICAgIFxcYCR7ZGd9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIFxceDFiWzIyOzMxbVxuICAgICAgICBOb3RlIHRoZSB1c2FnZSBvZiBcXGBQZXJzb25cXGAsIFxcYFF1ZXJ5XFxgIGFuZCBcXGBNdXRhdGlvblxcYCBleHBsaWNpdGx5XG4gICAgICAgIGFzIGtleXMgdG8gdGhlIHN1cHBsaWVkIFxcYGRvY3NcXGAgb2JqZWN0LlxceDFiWzBtXG4gICAgICBgKSlcbiAgICB9XG5cbiAgICBpZiAoIXJlc3VsdHMudmFsaWQpIHtcbiAgICAgIGxldCBlcnJvclN0cmluZ3MgPSBbXVxuXG4gICAgICBmb3IgKGxldCBlcnJvciBvZiByZXN1bHRzLmVycm9ycykge1xuICAgICAgICBsZXQgeyBtZXNzYWdlLCBzdGFjayB9ID0gZXJyb3JcblxuICAgICAgICBzdGFjayA9IHN0YWNrXG4gICAgICAgICAgLnRyaW0oKVxuICAgICAgICAgIC5zcGxpdCgnXFxuJylcbiAgICAgICAgICAuc3BsaWNlKG1lc3NhZ2Uuc3BsaXQoJ1xcbicpLmxlbmd0aClcbiAgICAgICAgICAubWFwKHMgPT4gcy50cmltKCkpXG4gICAgICAgICAgLmpvaW4oJ1xcbicpXG4gICAgICAgIG1lc3NhZ2UgPSBtZXNzYWdlLnJlcGxhY2UoLyhFcnJvcjpcXHMpLywgJyQxXFxuJykudHJpbSgpXG5cbiAgICAgICAgZXJyb3JTdHJpbmdzLnB1c2goXG4gICAgICAgICAgYFxceDFiWzMxOzFtJHttZXNzYWdlfVxceDFiWzBtXFxuYCArIGluZGVudChzdGFjaylcbiAgICAgICAgKVxuICAgICAgfVxuXG4gICAgICBsZXQgZXJyb3IgPSBuZXcgRXJyb3IoY3VzdG9tRGVkZW50KHtkcm9wTG93ZXN0OnRydWV9KWBcbiAgICAgICAgT09QUyFcblxuICAgICAgICBBbiBlcnJvciBvY2N1cnJlZCB2YWxpZGF0aW5nIHlvdXIgZmFjdG9yeSB0ZW1wbGF0ZS4gVGhlIG9iamVjdFxuICAgICAgICBpbiBxdWVzdGlvbiBpcyBhcyBmb2xsb3dzOlxuXG4gICAgICAgIEB0ZW1wbGF0ZVxuXG4gICAgICAgIFRoZSBpbmRpdmlkdWFsIGVycm9ycyB0aGF0IG9jY3VycmVkIGFyZTpcbiAgICAgICAgXFxuQGVycm9yc2BcbiAgICAgICAgLnJlcGxhY2UoL0B0ZW1wbGF0ZS8sIGluZGVudChfaSh0ZW1wbGF0ZSkpKVxuICAgICAgICAucmVwbGFjZSgvQGVycm9ycy8sIGVycm9yU3RyaW5ncy5qb2luKCdcXG5cXG4nKSlcbiAgICAgIClcblxuICAgICAgZXJyb3Iuc3RhY2sgPSBlcnJvci5tZXNzYWdlXG4gICAgICBlcnJvci5tZXNzYWdlID0gJydcblxuICAgICAgaWYgKCFoaWRlKSB0aHJvdyBlcnJvclxuICAgIH1cblxuICAgIHJldHVybiByZXN1bHRzXG4gIH1cblxuICAvKipcbiAgICogVGhlIHN0YXJ0aW5nIHBvaW50IG9mIGEgTGF0dGljZUZhY3Rvcnkgb2JqZWN0IC0+IGNsYXNzIGNyZWF0aW9uLiBUaGUgbmFtZVxuICAgKiBvZiB0aGUgY2xhc3MgYW5kIGJhc2VDbGFzcyB0byB1c2UgYXJlIHByb3ZpZGVkIGFuZCBhcmUgY3JlYXRlZCBmcm9tIHRoZXJlLlxuICAgKiBBdCB0aGlzIHBvaW50LCB0aGUgZ2VuZXJhdGVkIGNsYXNzIGlzIHN0aWxsIGluY29tcGxldGUuIEl0IG11c3QgY29tcGxldGVcbiAgICogdGhlIGVudGlyZSBjaGVja2xpc3QgYmVmb3JlIGJlaW5nIGRlZW1lZCB2YWxpZC5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgbmFtZSBvZiB0aGUgY2xhc3MgdG8gY3JlYXRlXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGJhc2VDbGFzcyB0aGUgTGF0dGljZSBjbGFzcyB5b3VyIG5ldyBjbGFzcyBzaG91bGQgZXh0ZW5kO1xuICAgKiB3aGlsZSB0aGlzIGNhbiBiZSBhbnl0aGluZywgaXQgc2hvdWxkIGJlIEdRTEJhc2UsIEdRTEludGVyZmFjZSwgR1FMRW51bSBvclxuICAgKiBHUUxVbmlvbi4gVGhpcyBkZWZhdWx0cyB0byBHUUxCYXNlIHNob3VsZCBub3RoaW5nIGJlIHN1cHBsaWVkXG4gICAqIEByZXR1cm4ge0Z1bmN0aW9ufSBhY3R1YWxseSB0aGlzIHJldHVybnMgdGhlIGdlbmVyYXRlZCBjbGFzc1xuICAgKi9cbiAgc3RhdGljIGdlbmVyYXRlQ2xhc3MobmFtZTogc3RyaW5nLCBiYXNlQ2xhc3M6IEZ1bmN0aW9uID0gR1FMQmFzZSkge1xuICAgIGlmICghbmFtZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdMYXR0aWNlRmFjdG9yeS5nZW5lcmF0ZUNsYXNzIG5lZWRzIGEgbmFtZSEhJylcbiAgICB9XG5cbiAgICAvLyBBbHJpZ2h0IGxhZGllcyBhbmQgZ2VudGxlbWVuLCBob2xkIG9udG8geW91ciBoYXRzOyB3ZSdyZSBlbnRlcmluZyB0aGVcbiAgICAvLyBtZXRhIHpvbmUhISEgVGhlIHdheSB0aGUgZm9sbG93aW5nIHdvcmtzIGlzIHRvIG1ha2Ugc3VyZSB0aGF0IG91clxuICAgIC8vIHBhc3NlZCBpbiBiYXNlIGNsYXNzIGBiYXNlQ2xhc3NgIGlzIGFjdHVhbGx5IGluIHNjb3BlIGFzIHRoZSBuYW1lIG9mXG4gICAgLy8gdGhlIHZhbHVlIGl0IHJlcHJlc2VudHMuIFdlIHVzZSB0aGUgYG5ldyBGdW5jdGlvbigpYCBzeW50YXggdG8gZG8gdGhhdFxuICAgIC8vIGJ1dCB3ZSBkbyBpdCB2aWEgZXZhbCBzaW5jZSB3ZSBkb24ndCBrbm93IHRoZSBuYW1lIG9mIHRoZSBmdW5jdGlvblxuICAgIC8vIGF0IHRoZSB0aW1lIHdlIHdyaXRlIHRoZSBjb2RlXG4gICAgLy9cbiAgICAvLyBTbyBnaXZlbiBhIGNsYXNzIG5hbWUgb2YgXCJDYXJcIiBhbmQgYmFzZU5hbWUgZXF1YWxsaW5nIEdRTEJhc2UsIHRoZSBDbGFzc1xuICAgIC8vIGluc3RhbmNlLCBmbiB3b3VsZCBsb29rIHNvbWV0aGluZyBsaWtlIHRoZSByZXN1bHRzIG9mIGNhbGxpbmcgdGhpc1xuICAgIC8vXG4gICAgLy8gbGV0IGZuID0gbmV3IEZ1bmN0aW9uKFxuICAgIC8vICAgXCJHUUxCYXNlXCIsXG4gICAgLy8gICBcImNsYXNzIENhciBleHRlbmRzIEdRTEJhc2Uge307IHJldHVybiBDYXI7XCJcbiAgICAvLyApXG4gICAgLy9cbiAgICAvLyBXaGljaCBpbiB0dXJuIHNldHMgZm4gdG8gc29tZXRoaW5nIHRoYXQgd291bGQgYmUgdGhlIHNhbWUgYXNcbiAgICAvL1xuICAgIC8vIGZ1bmN0aW9uIGZuKEdRTEJhc2UpIHsgY2xhc3MgQ2FyIGV4dGVuZHMgR1FMQmFzZSB7fTsgcmV0dXJuIENhciB9XG4gICAgLy9cbiAgICAvLyBXaGljaCBtZWFucyB0aGF0IHdoZW4gd2UgaW52b2tlIGZuKGJhc2VDbGFzcyksIHdoaWNoIGlzIGZuKEdRTEJhc2UpLFxuICAgIC8vIHdlIGdldCB0aGUgcmVzdWx0cyB3ZSBpbnRlbmQ7IGV2ZW4gaWYgR1FMQmFzZSBpcyBub3QgbmVjZXNzYXJpbHkgaW5cbiAgICAvLyB0aGUgc2NvcGUgb2YgdGhlIGZ1bmN0aW9uIGF0IHRoZSB0aW1lIG9mIGNhbGwuIE5lYXQuIFNjYXJ5LiBPTUcgVGhhbmtzXG4gICAgLy8gZm9yIGNvZGUgY29tbWVudHMuIFlvdSdyZSB3ZWxjb21lIGZ1dHVyZSBtZS5cbiAgICBsZXQgZm4gPSBldmFsKGAobmV3IEZ1bmN0aW9uKFxuICAgICAgXCIke2Jhc2VDbGFzcy5uYW1lfVwiLFxuICAgICAgXCJjbGFzcyAke25hbWV9IGV4dGVuZHMgJHtiYXNlQ2xhc3MubmFtZX0ge307IHJldHVybiAke25hbWV9O1wiXG4gICAgKSlgKTtcblxuICAgIGxldCBDbGFzcyA9IGZuKGJhc2VDbGFzcylcblxuICAgIHRoaXMuYnJhbmRDbGFzcyhDbGFzcylcbiAgICBuZXdDaGVja2xpc3QoQ2xhc3MpXG5cbiAgICByZXR1cm4gQ2xhc3M7XG4gIH1cblxuICAvKipcbiAgICogSW5qZWN0cyB0aGUgU0NIRU1BIHByb3BlcnR5IGludG8gdGhlIG5ld2x5IGRlZmluZWQgY2xhc3MuIFRoZSBzdXBwbGllZFxuICAgKiBgc2NoZW1hYCBzdHJpbmcgYmVjb21lcyB3aGF0IHRoZSBuZXcgY2xhc3MgcmV0dXJucyB3aGVuIGAuU0NIRU1BYCBpc1xuICAgKiBnb3R0ZW4uXG4gICAqXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IENsYXNzIHRoaXMgd2lsbCB0aHJvdyBhbiBlcnJvciBpZiB0aGUgY2xhc3MgaXMgbm90IG9uZVxuICAgKiBnZW5lcmF0ZWQgYnkgdGhlIExhdHRpY2VGYWN0b3J5IG9yIGlmIHRoZSBjbGFzcyBpdHNlbGYgaXMgbnVsbCBvciB1bmRlZmluZWRcbiAgICogQHBhcmFtIHtzdHJpbmd9IHNjaGVtYSB0aGUgc3RyaW5nIHRoYXQgdGhlIG5ldyBjbGFzcyBzaG91bGQgcmV0dXJuXG4gICAqIEByZXR1cm4ge0Z1bmN0aW9ufSByZXR1cm5zIHRoZSBtb2RpZmllZCBDbGFzcyB3aXRoIHRoZSBgQ0hFQ0tfU0NIRU1BYFxuICAgKiBwb3J0aW9uIHRpY2tlZCBvZmYgaW50ZXJuYWxseS5cbiAgICovXG4gIHN0YXRpYyBpbmplY3RTY2hlbWEoQ2xhc3M6IEZ1bmN0aW9uLCBzY2hlbWE6IHN0cmluZykge1xuICAgIGlmICghQ2xhc3MgfHwgIWhhc0NoZWNrbGlzdChDbGFzcykpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihjdXN0b21EZWRlbnQoe2Ryb3BMb3dlc3Q6dHJ1ZX0pYFxuICAgICAgICBFaXRoZXIgdGhlIHN1cHBsaWVkIHNjaGVtYSBzdHJpbmcgaXMgaW52YWxpZFxuICAgICAgICAgIFNDSEVNQTogXFxgXG4gICAgICAgICAgICAke3NjaGVtYX1cbiAgICAgICAgICBcXGBcblxuICAgICAgICBPciB5b3VyIHN1cHBsaWVkIGNsYXNzICR7KENsYXNzICYmIENsYXNzLm5hbWUpIHx8ICd1bmRlZmluZWQnfSBpc1xuICAgICAgICBub24tZXhpc3RlbnQuIFBsZWFzZSBjaGVjayB5b3VyIGNvZGUgYW5kIHRyeSB0aGUgTGF0dGljZUZhY3RvcnlcbiAgICAgICAgYWdhaW4uXG4gICAgICBgKVxuICAgIH1cblxuICAgIC8vICRGbG93Rml4TWVcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoQ2xhc3MsICdTQ0hFTUEnLCB7XG4gICAgICBnZXQoKSB7IHJldHVybiBzY2hlbWEgfVxuICAgIH0pXG5cbiAgICBzZXRDaGVja2xpc3QoQ2xhc3MsIENIRUNLX1NDSEVNQSlcblxuICAgIHJldHVybiBDbGFzc1xuICB9XG5cbiAgLyoqXG4gICAqIEluamVjdHMgdGhlIHJlc29sdmVycyBpbnRvIGFwcHJvcHJpYXRlIGFyZWFzLiBSZXNvbHZlcnMga2V5ZWQgYnkgYFF1ZXJ5YCxcbiAgICogYE11dGF0aW9uYCwgb3IgYFN1YnNjcmlwdGlvbmAgd2lsbCBiZSBwbGFjZWQgaW50byB0aGUgYXBwcm9wcmlhdGUgYXJlYVxuICAgKiBpbiBgQ2xhc3NbTUVUQV9LRVldYCB3aGljaCBhY3RzIGFzIGEgc3RhZ2luZyBhcmVhIG9yaWdpbmFsbHkgZGVzaWduZWQgZm9yXG4gICAqIHVzZSB3aXRoIHRoZSBAcmVzb2x2ZXIsIEBtdXRhdG9yIGFuZCBAc3Vic2NyaXB0b3IgZGVjb3JhdG9ycy4gVGhlc2Ugd2lsbFxuICAgKiBiZSBib3VuZCBpbiBhIHR5cGljYWwgZmFzaGlvbiBhcyBpcyBkb25lIHdpdGggdGhlIGRlY29yYXRvcnMgbWFraW5nIHRoZVxuICAgKiBmaXJzdCBwYXJhbWV0ZXIgYmVjb21pbmcgdGhlIHJlcXVlc3REYXRhIG9mIHRoZSBvYmplY3QgaW5zdGFuY2UgYW5kIHRoZVxuICAgKiBzZWNvbmQgYmVpbmcgdGhlIG9iamVjdCBjb250YWluaW5nIHRoZSBwYXJhbWV0ZXJzIGZvciB0aGUgcmVzb2x2ZXIgYXNcbiAgICogcGFzc2VkIGluIGJ5IEdyYXBoUUwuIFN1YnNlcXVlbnQgcGFyYW1ldGVycyB3aWxsIGJlIHN1cHBsaWVkIGFzIGlzIHRoZVxuICAgKiBmYXNoaW9uIG9mIHRoZSBzeXN0ZW0geW91J3JlIHVzaW5nOyBGYWNlYm9vaydzIHJlZmVyZW5jZSBpbXBsZW1lbnRhdGlvbiBvclxuICAgKiBBcG9sbG8gb3Igc29tZXRoaW5nIGVsc2UuXG4gICAqXG4gICAqIFJlc29sdmVycyBrZXllZCBieSB0eXBlIG5hbWUgYXJlIGNvbnNpZGVyZWQgdG8gYmUgZmllbGQgcmVzb2x2ZXJzIGFuZFxuICAgKiBoYXZlIGEgZGlmZmVyZW50IHNpZ25hdHVyZS4gVGhleSBjYW4gYmUgcHJvcGVydGllcyBvZiB0aGUga2V5LCBpblxuICAgKiB3aGljaCBjYXNlIHRoZXkgd2lsbCBzaW1wbHkgYmUgaW5zdGFsbGVkIGFzIGdldHRlcnMuIE9yIHRoZXkgY2FuIGJlXG4gICAqIGZ1bmN0aW9uczsgc3luY2hyb25vdXMgb3IgYXN5bmNocm9ub3VzLiBGdW5jdGlvbiBmaWVsZCByZXNvbHZlcnMgYXJlXG4gICAqIGluc3RhbmNlIG1ldGhvZHMgYW5kIGNhbiBtYWtlIHVzZSBvZiBgdGhpcy5nZXRNb2RlbCgpYCBvclxuICAgKiBgdGhpcy5yZXF1ZXN0RGF0YWAgaW50ZXJuYWxseS5cbiAgICpcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gQ2xhc3MgdGhlIGNsYXNzLCBnZW5lcmF0ZWQgYnkgZ2VuZXJhdGVDbGFzcygpIGxlc3QgYW5cbiAgICogZXJyb3IgYmUgdGhyb3duLCB0byB3aGljaCB0byBhZGQgdGhlIHJlc29sdmVycyBmcm9tIGEgdGVtcGxhdGVcbiAgICogQHBhcmFtIHtPYmplY3R9IHJlc29sdmVyT2JqIGFuIG9iamVjdCBjb250YWluaW5nIHRoZSByZXNvbHZlcnMgYXMgZGljdGF0ZWRcbiAgICogYnkgdGhlIG5ldyBmb3JtYXQuXG4gICAqIEByZXR1cm4ge0Z1bmN0aW9ufSByZXR1cm5zIHRoZSBtb2RpZmllZCBDbGFzcyB3aXRoIHRoZSBgQ0hFQ0tfUkVTT0xWRVJTYFxuICAgKiBwb3J0aW9uIHRpY2tlZCBvZmYgaW50ZXJuYWxseS5cbiAgICovXG4gIHN0YXRpYyBpbmplY3RSZXNvbHZlcnMoQ2xhc3M6IEZ1bmN0aW9uLCByZXNvbHZlcnM6IE9iamVjdCk6IEZ1bmN0aW9uIHtcbiAgICBpZiAoIWhhc0NoZWNrbGlzdChDbGFzcywgQ0hFQ0tfU0NIRU1BKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGN1c3RvbURlZGVudCh7ZHJvcExvd2VzdDp0cnVlfSlgXG4gICAgICAgIFxcYGluamVjdFJlc29sdmVyc1xcYCBjYW5ub3QgYmUgY2FsbGVkIG9uIGEgY2xhc3Mgd2l0aG91dCBhIFNDSEVNQS5cbiAgICAgICAgUGxlYXNlIHZlcmlmeSB5b3VyIHByb2dyZXNzIGluIHRoZSBwcm9jZXNzIGFuZCB0cnkgYWdhaW4uXG4gICAgICBgKVxuICAgIH1cblxuICAgIGxldCB0cmVlID0gU3ludGF4VHJlZS5mcm9tKENsYXNzLlNDSEVNQSlcbiAgICBsZXQgb3V0bGluZSA9IHRyZWUgPyB0cmVlLm91dGxpbmUgOiB7fVxuXG4gICAgaWYgKENsYXNzLm5hbWUgaW4gb3V0bGluZSAmJiBDbGFzcy5uYW1lIGluIHJlc29sdmVycykge1xuICAgICAgbGV0IGZpZWxkcyA9IE9iamVjdC5rZXlzKG91dGxpbmVbQ2xhc3MubmFtZV0pXG5cbiAgICAgIGZvciAobGV0IGZpZWxkUmVzb2x2ZXIgb2YgZmllbGRzKSB7XG4gICAgICAgIGlmICghZmllbGRSZXNvbHZlciBpbiByZXNvbHZlcnNbQ2xhc3MubmFtZV0pIHtcbiAgICAgICAgICBMTC53YXJuKGN1c3RvbURlZGVudCh7ZHJvcExvd2VzdDogdHJ1ZX0pYFxuICAgICAgICAgICAgJHtmaWVsZFJlc29sdmVyfSBub3Qgc3VwcGxpZWQgaW4gcmVzb2x2ZXJzIGZvciAke0NsYXNzLm5hbWV9XG4gICAgICAgICAgYClcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBwcm9wID0gcmVzb2x2ZXJzW0NsYXNzLm5hbWVdW2ZpZWxkUmVzb2x2ZXJdXG5cbiAgICAgICAgaWYgKHByb3AgJiYgdHlwZW9mIHByb3AgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICBMTC5pbmZvKCdJbmplY3RpbmcgW2ZuXSAlcycsIGZpZWxkUmVzb2x2ZXIpXG4gICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KENsYXNzLnByb3RvdHlwZSwgZmllbGRSZXNvbHZlciwge1xuICAgICAgICAgICAgdmFsdWU6IHByb3BcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIExMLmluZm8oJ0luamVjdGluZyBbcHJvcF0gJXMnLCBmaWVsZFJlc29sdmVyKVxuICAgICAgICAgIFByb3BlcnRpZXMoZmllbGRSZXNvbHZlcikoQ2xhc3MsIFsnZmFjdG9yeS1wcm9wcyddKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgZm9yIChsZXQgW3R5cGU6IHN0cmluZywgZGVjb3JhdG9yOiBGdW5jdGlvbl0gb2YgW1xuICAgICAgWydRdWVyeScsIHJlc29sdmVyXSxcbiAgICAgIFsnTXV0YXRpb24nLCBtdXRhdG9yXSxcbiAgICAgIFsnU3Vic2NyaXB0aW9uJywgc3Vic2NyaXB0b3JdXG4gICAgXSkge1xuICAgICAgbGV0IGtleXMgPSBPYmplY3Qua2V5cyhvdXRsaW5lW3R5cGVdIHx8IHt9KVxuXG4gICAgICAvLyAkRmxvd0ZpeE1lXG4gICAgICBpZiAoIXR5cGUgaW4gb3V0bGluZSB8fCAha2V5cy5sZW5ndGgpIHsgY29udGludWU7IH1cblxuICAgICAgZm9yIChsZXQgZm5OYW1lIG9mIGtleXMpIHtcbiAgICAgICAgbGV0IGZuID0gcmVzb2x2ZXJzW2ZuTmFtZV1cbiAgICAgICAgZGVjb3JhdG9yKENsYXNzLCBmbk5hbWUsIHt2YWx1ZTogZm59KVxuICAgICAgICBMTC5pbmZvKCdBZGRpbmcgJXMgcmVzb2x2ZXIgWyVzXScsIHR5cGUsIGZuTmFtZSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRDaGVja2xpc3QoQ2xhc3MsIENIRUNLX1JFU09MVkVSUylcblxuICAgIHJldHVybiBDbGFzc1xuICB9XG5cbiAgc3RhdGljIGluamVjdERvY3MoQ2xhc3M6IEZ1bmN0aW9uLCBkb2NzOiBPYmplY3QpOiBGdW5jdGlvbiB7XG4gICAgaWYgKCFoYXNDaGVja2xpc3QoQ2xhc3MsIENIRUNLX1NDSEVNQSwgQ0hFQ0tfUkVTT0xWRVJTKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGN1c3RvbURlZGVudCh7ZHJvcExvd2VzdDp0cnVlfSlgXG4gICAgICAgIFxcYGluamVjdERvY3NcXGAgY2Fubm90IGJlIGNhbGxlZCBvbiBhIGNsYXNzIHdpdGhvdXQgYSBTQ0hFTUEgb3JcbiAgICAgICAgUkVTT0xWRVJTIGRlZmluZWQuIFBsZWFzZSB2ZXJpZnkgeW91ciBwcm9ncmVzcyBpbiB0aGUgcHJvY2VzcyBhbmQgdHJ5XG4gICAgICAgIGFnYWluLlxuICAgICAgYClcbiAgICB9XG5cbiAgICBsZXQgY29weVByb3AgPSAoXG4gICAgICBvOiBtaXhlZCxcbiAgICAgIHByb3A6IHN0cmluZyB8IFN5bWJvbCxcbiAgICAgIHRvOiBtaXhlZCxcbiAgICAgIGFzOiA/KHN0cmluZyB8IFN5bWJvbClcbiAgICApOiBtaXhlZCA9PiB7XG4gICAgICAvLyAkRmxvd0ZpeE1lXG4gICAgICBsZXQgcHJvdG90eXBlID0gby5wcm90b3R5cGUgfHwgT2JqZWN0LmdldFByb3RvdHlwZU9mKG8pXG4gICAgICBsZXQgZGVzY3JpcHRvciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IocHJvdG90eXBlLCBwcm9wKVxuXG4gICAgICBpZiAoIWFzKSB7XG4gICAgICAgIGFzID0gcHJvcFxuICAgICAgfVxuXG4gICAgICBpZiAoZGVzY3JpcHRvcikge1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodG8sIGFzLCBkZXNjcmlwdG9yKVxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIC8vICRGbG93Rml4TWVcbiAgICAgICAgdG9bYXNdID0gb1twcm9wXVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIENyZWF0ZSBhbiBvYmplY3Qgb3VyIGZ1dHVyZSBgc3RhdGljIGFwaURvY3MoKWAgbWV0aG9kIG9mIG91ciBmYWN0b3J5XG4gICAgLy8gZ2VuZXJhdGVkIGNsYXNzIHdpbGwgcmV0dXJuXG4gICAgbGV0IHJlc3VsdCA9IHt9XG5cbiAgICAvLyBTZXR1cCB0aGUgY29uc3RhbnRzIHdlIHdpbGwgbmVlZCBpbiB0aGlzIGNvbnZlcnNpb25cbiAgICBjb25zdCB7IFRZUEUgfSA9IHRoaXM7XG4gICAgY29uc3Qge1xuICAgICAgRE9DX0NMQVNTLCBET0NfRklFTERTLCBET0NfUVVFUlksIERPQ19NVVRBVElPTiwgRE9DX1NVQlNDUklQVElPTixcbiAgICAgIERPQ19RVUVSSUVTLCBET0NfTVVUQVRJT05TLCBET0NfU1VCU0NSSVBUSU9OU1xuICAgIH0gPSBHUUxCYXNlXG5cbiAgICAvLyBUaGlzIHBhcnQgbWlnaHQgZ2V0IGEgbGl0dGxlIG1ldGEsIHNvIEkgaGF2ZSBwcm92aWRlZCBjb21tZW50cy4gWW91IGFyZVxuICAgIC8vIHdlbGNvbWUgZnV0dXJlIG1lLiBJIGhvcGUgaXQgaGVscHMuIFRoaXMgZ25hcmx5IGJsb2NrIHNob3VsZCBjb3ZlciBhbGxcbiAgICAvLyB0aGUgZGVzY3JpcHRpb25zIGZvciBRdWVyeSwgTXV0YXRpb24sIFN1YnNjcmlwdGlvbiBhbmQgdGhlIENsYXNzIHdlXG4gICAgLy8gYXJlIGNyZWF0aW5nLiBPdGhlciBzdXBlcmZsdW91c1xuICAgIGZvciAobGV0IFtUeXBlLCBUb3BMZXZlbENvbnN0YW50LCBGaWVsZENvbnN0YW50c10gb2YgW1xuICAgICAgWydRdWVyeScsIERPQ19RVUVSWSwgRE9DX1FVRVJJRVNdLFxuICAgICAgWydNdXRhdGlvbicsIERPQ19NVVRBVElPTiwgRE9DX01VVEFUSU9OU10sXG4gICAgICBbJ1N1YnNjcmlwdGlvbicsIERPQ19TVUJTQ1JJUFRJT04sIERPQ19TVUJTQ1JJUFRJT05TXSxcbiAgICAgIFtDbGFzcy5uYW1lLCBET0NfQ0xBU1MsIERPQ19GSUVMRFNdXG4gICAgXSkge1xuICAgICAgLy8gT25lIG9mICdRdWVyeScsICdNdXRhdGlvbicsIG9yICdTdWJzY3JpcHRpb24nXG4gICAgICBpZiAoZG9jc1tUeXBlXSkge1xuICAgICAgICAvLyBJZiBhIHRvcCBsZXZlbCBkZXNjcmlwdGlvbiBpcyBwcmVzZW50IChpLmUuIFF1ZXJ5LCBNdXRhdGlvbiBvclxuICAgICAgICAvLyBTdWJzY3JpcHRpb24gZGVzY3JpcHRpb24pXG4gICAgICAgIGlmIChkb2NzW1R5cGVdW1RZUEVdKSB7XG4gICAgICAgICAgY29weVByb3AoZG9jc1tUeXBlXSwgVFlQRSwgcmVzdWx0LCBUb3BMZXZlbENvbnN0YW50KVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gRmV0Y2ggdGhlIHByb3BlcnRpZXMgZnJvbSB0aGUgc3VwcGxpZWQgZG9jcyBvYmplY3Q7IFRZUEUgU3ltYm9sc1xuICAgICAgICAvLyBkbyBub3Qgc2hvdyB1cCBpbiBhIGNhbGwgdG8gZW50cmllcyB3aGljaCBpcyB3aHkgaXQgaXMgaGFuZGxlZCBhYm92ZVxuICAgICAgICAvLyAkRmxvd0ZpeE1lXG4gICAgICAgIGxldCBlbnRyaWVzID0gT2JqZWN0LmVudHJpZXMoZG9jc1tUeXBlXSlcblxuICAgICAgICAvLyBJZiB3ZSBoYXZlIGVudHJpZXMgdG8gZG9jdW1lbnQsIGNyZWF0ZSBhbiBvYmplY3QgdG8gaG9sZCB0aG9zZVxuICAgICAgICAvLyB2YWx1ZXM7IGkuZS4gaWYgd2UgaGF2ZSBgeyBRdWVyeTogeyBnZXRQZW9wbGU6ICdkZXNjJyB9IH1gLCB3ZSBuZWVkXG4gICAgICAgIC8vIHRvIG1ha2Ugc3VyZSB3ZSBoYXZlIGB7IFtET0NfUVVFUklFU106IHsgZ2V0UGVvcGxlOiAnZGVzYycgfSB9YCBpblxuICAgICAgICAvLyBvdXIgcmVzdWx0LiBUaGUgb2JqZWN0IGhvbGRpbmcgZ2V0UGVvcGxlIGluIHRoZSBlbmQgdGhlcmUgaXMgZGVmaW5lZFxuICAgICAgICAvLyBiZWxvdyB3aGVuIHdlIGhhdmUgc29tZXRoaW5nIHRvIGNvcHkuXG4gICAgICAgIGlmIChlbnRyaWVzLmxlbmd0aCkge1xuICAgICAgICAgIHJlc3VsdFtGaWVsZENvbnN0YW50c10gPSB7fVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gRm9yIGVhY2ggbmFtZSB2YWx1ZSBwYWlyIGRlZmluZWQgYWJvdmUsIGNvcHkgaXRzIGRlc2NyaXB0b3Igb3IgYmFzZVxuICAgICAgICAvLyB2YWx1ZSBpZiBhIGRlc2NyaXB0b3IgaXNuJ3QgYXZhaWxhYmxlXG4gICAgICAgIGZvciAobGV0IFtwcm9wLCB2YWx1ZV0gb2YgZW50cmllcykge1xuICAgICAgICAgIGNvcHlQcm9wKGRvY3NbVHlwZV0sIHByb3AsIHJlc3VsdFtGaWVsZENvbnN0YW50c10pXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoQ2xhc3MsICdhcGlEb2NzJywge1xuICAgICAgdmFsdWU6IGZ1bmN0aW9uKCkgeyByZXR1cm4gcmVzdWx0IH1cbiAgICB9KVxuXG4gICAgc2V0Q2hlY2tsaXN0KENsYXNzLCBDSEVDS19BUElfRE9DUylcblxuICAgIHJldHVybiBDbGFzc1xuICB9XG5cbiAgc3RhdGljIGJ1aWxkKHRlbXBsYXRlOiBPYmplY3QpOiBGdW5jdGlvbiB7XG4gICAgbGV0IHZhbGlkYXRpb25SZXN1bHRzID0gdGhpcy52YWxpZGF0ZVRlbXBsYXRlKHRlbXBsYXRlKVxuICAgIGxldCBDbGFzcyA9IHRoaXMuZ2VuZXJhdGVDbGFzcyh0ZW1wbGF0ZS5uYW1lLCB0ZW1wbGF0ZS50eXBlIHx8IEdRTEJhc2UpXG5cbiAgICBpZiAoIUNsYXNzKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoY3VzdG9tRGVkZW50KHtkcm9wTG93ZXN0OiB0cnVlfSlgXG4gICAgICAgIExhdHRpY2VGYWN0b3J5IHdhcyB1bmFibGUgdG8gYnVpbGQgeW91ciBDbGFzcyBmcm9tIHRoZSBuYW1lIGFuZCB0eXBlc1xuICAgICAgICBzdXBwbGllZCBpbiB5b3VyIHRlbXBsYXRlLiBZb3UgcHJvdmlkZWQgdGhlIGZvbGxvd2luZyB0ZW1wbGF0ZS4gUGxlYXNlXG4gICAgICAgIGxvb2sgaXQgb3ZlciBhbmQgY29ycmVjdCBhbnkgZXJyb3JzIGJlZm9yZSB0cnlpbmcgYWdhaW4uXG5cbiAgICAgICAgXFx4MWJbMW1UZW1wbGF0ZVxceDFiWzBtXG4gICAgICAgICAgJHtfaSh0ZW1wbGF0ZSl9XG4gICAgICBgKVxuICAgIH1cblxuICAgIHRoaXMuaW5qZWN0U2NoZW1hKENsYXNzLCB0ZW1wbGF0ZS5zY2hlbWEpXG4gICAgdGhpcy5pbmplY3RSZXNvbHZlcnMoQ2xhc3MsIHRlbXBsYXRlLnJlc29sdmVycyB8fCB7fSlcbiAgICB0aGlzLmluamVjdERvY3MoQ2xhc3MsIHRlbXBsYXRlLmRvY3MgfHwge30pXG5cbiAgICAvLyBOZWVkIHRvIGZpeCBob3cgYXV0by1wcm9wcyB3b3JrOyBmb3Igbm93IGNyZWF0ZSBvbmUgaW5zdGFuY2UuLi5cbiAgICBuZXcgQ2xhc3Moe30pXG5cbiAgICBpZiAoIWhhc0NoZWNrbGlzdChDbGFzcywgQ0hFQ0tfU0NIRU1BLCBDSEVDS19SRVNPTFZFUlMsIENIRUNLX0FQSV9ET0NTKSkge1xuICAgICAgbGV0IF9zY2hlbWEgPSBoYXNDaGVja2xpc3QoQ2xhc3MsIENIRUNLX1NDSEVNQSkgPyAn4pyFJyA6ICfinYwnXG4gICAgICBsZXQgX3Jlc29sdmVycyA9IGhhc0NoZWNrbGlzdChDbGFzcywgQ0hFQ0tfUkVTT0xWRVJTKSA/ICfinIUnIDogJ+KdjCdcbiAgICAgIGxldCBfYXBpRG9jcyA9IGhhc0NoZWNrbGlzdChDbGFzcywgQ0hFQ0tfQVBJX0RPQ1MpID8gJ+KchScgOiAn4p2MJ1xuXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoY3VzdG9tRGVkZW50KHtkcm9wTG93ZXN0OiB0cnVlfSlgXG4gICAgICAgIFNvbWV0aGluZyB3ZW50IHdyb25nIGluIHRoZSBwcm9jZXNzIG9mIGJ1aWxkaW5nIHRoZSBjbGFzcyBjYWxsZWRcbiAgICAgICAgJHtDbGFzcyAmJiBDbGFzcy5uYW1lIHx8IHRlbXBsYXRlICYmIHRlbXBsYXRlLm5hbWUgfHwgJ1Vua25vd24hJ30sXG4gICAgICAgIHBsZWFzZSBjaGVjayB0aGUgc3VwcGxpZWQgdGVtcGxhdGUgZm9yIGVycm9ycy5cblxuICAgICAgICBbICR7X3NjaGVtYX0gXSBIYXMgYSBTQ0hFTUEgZGVmaW5lZFxuICAgICAgICBbICR7X3Jlc29sdmVyc30gXSBIYXMgZGVmaW5lZCBSRVNPTFZFUlMgbWF0Y2hpbmcgdGhlIFNDSEVNQVxuICAgICAgICBbICR7X2FwaURvY3N9IF0gSGFzIGRlZmluZWQgQVBJIERvY3MgbWF0Y2hpbmcgdGhlIFNDSEVNQVxuXG4gICAgICAgIFxceDFiWzFtVGVtcGxhdGVcXHgxYlswbVxuICAgICAgICAke19pKHRlbXBsYXRlKX1cblxuICAgICAgICBcXHgxYlsxbUNsYXNzXFx4MWJbMG1cbiAgICAgICAgJHtfaShDbGFzcyl9XG4gICAgICBgKVxuICAgIH1cblxuICAgIHJldHVybiBDbGFzc1xuICB9XG5cbiAgLyoqXG4gICAqIEEgc3RhdGljIGhlbHBlciBtZXRob2QgdG8gY29uc2lzdGVudGx5IHRhZywgb3IgYnJhbmQsIGNsYXNzZXMgd2l0aCBhXG4gICAqIHN5bWJvbCB0aGF0IGRlbm90ZXMgdGhleSB3ZXJlIGNyZWF0ZWQgdXNpbmcgdGhlIExhdHRpY2VGYWN0b3J5IHByb2Nlc3MuXG4gICAqIFRoaXMgaXMgZG9uZSBieSBzZXR0aW5nIGEgYFN5bWJvbGAgb24gdGhlIHJvb3Qgb2YgdGhlIGNsYXNzIG9yIGluIHRoZVxuICAgKiBgW01FVEFfS0VZXWAgb2JqZWN0IGZvciBjbGFzc2VzIGV4dGVuZGluZyBgR1FMQmFzZWAuXG4gICAqXG4gICAqIEBtZXRob2Qg4oy+4qCAYnJhbmRDbGFzc1xuICAgKiBAbWVtYmVyb2YgTGF0dGljZUZhY3RvcnlcbiAgICogQHN0YXRpY1xuICAgKlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBDbGFzcyB0aGUgY2xhc3MgdG8gYnJhbmQgd2l0aCB0aGUgYEZBQ1RPUllfQ0xBU1NgIHN5bWJvbFxuICAgKiBAcmV0dXJuIHtGdW5jdGlvbn0gcmV0dXJucyB0aGUgQ2xhc3MgdmFsdWUgcGFzc2VkIGluXG4gICAqL1xuICBzdGF0aWMgYnJhbmRDbGFzcyhDbGFzczogP0Z1bmN0aW9uKTogP0Z1bmN0aW9uIHtcbiAgICBpZiAoQ2xhc3MpIHtcbiAgICAgIGlmIChleHRlbmRzRnJvbShDbGFzcywgR1FMQmFzZSkpIHtcbiAgICAgICAgQ2xhc3NbTUVUQV9LRVldW3RoaXMuRkFDVE9SWV9DTEFTU10gPSB0cnVlXG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgQ2xhc3NbdGhpcy5GQUNUT1JZX0NMQVNTXSA9IHRydWVcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gQ2xhc3NcbiAgfVxuXG4gIC8qKlxuICAgKiBBIHN0YXRpYyBoZWxwZXIgdG8gY2hlY2sgYW5kIHNlZSBpZiB0aGUgc3VwcGxpZWQgY2xhc3Mgb3IgZnVuY3Rpb24gd2FzXG4gICAqIGJyYW5kZWQgd2l0aCB0aGUgYGJyYW5kQ2xhc3MoKWAgZnVuY3Rpb24uIFRoaXMgYW1vdW50cyB0byBzdG9yaW5nIHRoZVxuICAgKiBib29sZWFuIHRydWUgdW5kZXIgdGhlIHByb3BlcnR5IGBDbGFzc1tMYXR0aWNlRmFjdG9yeS5GQUNUT1JZX0NMQVNTXWAgb3JcbiAgICogYENsYXNzW01FVEFfS0VZXVtMYXR0aWNlRmFjYXRvcnkuRkFDVE9SWV9DTEFTU11gIGZvciBgR1FMQmFzZWAgZXh0ZW5kZWRcbiAgICogY2xhc3Nlcy5cbiAgICpcbiAgICogQG1ldGhvZCDijL7ioIBpc0ZhY3RvcnlDbGFzc1xuICAgKiBAbWVtYmVyb2YgTGF0dGljZUZhY3RvcnlcbiAgICogQHN0YXRpY1xuICAgKlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBDbGFzcyB0aGUgY2xhc3MgdG8gY2hlY2sgZm9yIGBGQUNUT1JZX0NMQVNTYCBicmFuZGluZ1xuICAgKiBAcmV0dXJuIHtib29sZWFufSB0cnVlIGlmIHRoZSBicmFuZCBleGlzdHMsIGZhbHNlIG90aGVyd2lzZVxuICAgKi9cbiAgc3RhdGljIGlzRmFjdG9yeUNsYXNzKENsYXNzOiBGdW5jdGlvbik6IGJvb2xlYW4ge1xuICAgIGlmIChDbGFzcykge1xuICAgICAgcmV0dXJuIChleHRlbmRzRnJvbShDbGFzcywgR1FMQmFzZSlcbiAgICAgICAgPyAhIUNsYXNzW01FVEFfS0VZXVt0aGlzLkZBQ1RPUllfQ0xBU1NdXG4gICAgICAgIDogISFDbGFzc1t0aGlzLkZBQ1RPUllfQ0xBU1NdXG4gICAgICApXG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICAvKipcbiAgICogQSBzdGF0aWMgaGVscGVyIG1ldGhvZCB0byBjb25zaXN0ZW50bHkgcmVtb3ZlIGFueSBwcmV2aW91cyB0YWcgb3IgYnJhbmRcbiAgICogYXBwbGllZCB3aXRoIGBicmFuZENsYXNzYCwgdGhpcyBpcyBkb25lIGJ5IHJlbW92aW5nIGEgcHJldmlvdXNseSBzZXRcbiAgICogYFN5bWJvbGAgb24gdGhlIHJvb3Qgb2YgdGhlIGNsYXNzIG9yIGluIHRoZSBgW01FVEFfS0VZXWAgb2JqZWN0IGZvclxuICAgKiBjbGFzc2VzIGV4dGVuZGluZyBgR1FMQmFzZWAuXG4gICAqXG4gICAqIEBtZXRob2Qg4oy+4qCAcmVtb3ZlQ2xhc3NCcmFuZFxuICAgKiBAbWVtYmVyb2YgTGF0dGljZUZhY3RvcnlcbiAgICogQHN0YXRpY1xuICAgKlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBDbGFzcyB0aGUgY2xhc3MgdG8gYnJhbmQgd2l0aCB0aGUgYEZBQ1RPUllfQ0xBU1NgIHN5bWJvbFxuICAgKiBAcmV0dXJuIHtGdW5jdGlvbn0gcmV0dXJucyB0aGUgQ2xhc3MgdmFsdWUgcGFzc2VkIGluXG4gICAqL1xuICBzdGF0aWMgcmVtb3ZlQ2xhc3NCcmFuZChDbGFzczogRnVuY3Rpb24pOiBGdW5jdGlvbiB7XG4gICAgaWYgKENsYXNzKSB7XG4gICAgICBpZiAoZXh0ZW5kc0Zyb20oQ2xhc3MsIEdRTEJhc2UpKSB7XG4gICAgICAgIGRlbGV0ZSBDbGFzc1tNRVRBX0tFWV1bdGhpcy5GQUNUT1JZX0NMQVNTXVxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIGRlbGV0ZSBDbGFzc1t0aGlzLkZBQ1RPUllfQ0xBU1NdXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIENsYXNzXG4gIH1cblxuICAvKipcbiAgICogQSBjb25zdGFudCB0aGF0IHJlcG9ydHMgdGhhdCB0aGlzIGNsYXNzIGlzIGAnW29iamVjdCBMYXR0aWNlRmFjdG9yeV0nYFxuICAgKiByYXRoZXIgdGhhbiBgJ1tvYmplY3QgT2JqZWN0XSdgIHdoZW4gaW50cm9zcGVjdGVkIHdpdGggdG9vbHMgc3VjaCBhc1xuICAgKiBgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5hcHBseShjbGFzcylgLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgTGF0dGljZUZhY3RvcnlcbiAgICogQHR5cGUge1N5bWJvbH1cbiAgICogQHN0YXRpY1xuICAgKi9cbiAgLy8gJEZsb3dGaXhNZVxuICBzdGF0aWMgZ2V0IFtTeW1ib2wudG9TdHJpbmdUYWddKCkgeyByZXR1cm4gdGhpcy5uYW1lIH1cblxuICAvKipcbiAgICogQSBjb25zdGFudCBleHBvcnRlZCBhcyBwYXJ0IG9mIExhdHRpY2VGYWN0b3J5IHRoYXQgY2FuIGJlIHVzZWQgZm9yXG4gICAqIGRlZmluaW5nIGRvY3VtZW50YXRpb24gZm9yIHRoZSB0eXBlIGl0c2VsZi5cbiAgICpcbiAgICogQG1lbWJlcm9mIExhdHRpY2VGYWN0b3J5XG4gICAqIEB0eXBlIHtTeW1ib2x9XG4gICAqIEBzdGF0aWNcbiAgICovXG4gIHN0YXRpYyBnZXQgVFlQRSgpOiBTeW1ib2wgeyByZXR1cm4gU3ltYm9sLmZvcignQVBJIERvY3MgVHlwZSBDb25zdGFudCcpIH1cblxuICAvKipcbiAgICogQSBjb25zdGFudCBleHBvcnRlZCBhcyBwYXJ0IG9mIExhdHRpY2VGYWN0b3J5IHRoYXQgY2FuIGJlIHVzZWQgZm9yXG4gICAqIGlkZW50aWZ5aW5nIGNsYXNzZXMgdGhhdCB3ZXJlIGdlbmVyYXRlZCB3aXRoIExhdHRpY2VGYWN0b3J5LlxuICAgKlxuICAgKiBAbWVtYmVyb2YgTGF0dGljZUZhY3RvcnlcbiAgICogQHR5cGUge1N5bWJvbH1cbiAgICogQHN0YXRpY1xuICAgKi9cbiAgc3RhdGljIGdldCBGQUNUT1JZX0NMQVNTKCk6IFN5bWJvbCB7IHJldHVybiBTeW1ib2wuZm9yKCdGYWN0b3J5IENsYXNzJykgfVxufVxuXG5leHBvcnQgY29uc3QgaXNGYWN0b3J5Q2xhc3MgPSBMYXR0aWNlRmFjdG9yeS5pc0ZhY3RvcnlDbGFzc1xuXG4vLyBURVNUSU5HIFJFUExcbi8qKlxudmFyIHsgTGF0dGljZUZhY3RvcnksIGdldENoZWNrbGlzdCwgaGFzQ2hlY2tsaXN0LCBDSEVDS0xJU1QsIENIRUNLX1NDSEVNQSwgQ0hFQ0tfUkVTT0xWRVJTIH0gPSByZXF1aXJlKCcuL2Rpc3QvTGF0dGljZUZhY3RvcnknKTsgdmFyIHsgR1FMQmFzZSwgTUVUQV9LRVksIGpvaW5MaW5lcywgU3ludGF4VHJlZSwgdHlwZU9mIH0gPSByZXF1aXJlKCcuL2Rpc3QvbGF0dGljZScpOyB2YXIgZ3FsID0gam9pbkxpbmVzLCBMRiA9IExhdHRpY2VGYWN0b3J5LCBUWVBFID0gTEYuVFlQRTtcbnZhciBQZXJzb25EZWYgPSB7IG5hbWU6ICdQZXJzb24nLCBzY2hlbWE6IGdxbGAgZW51bSBTdGF0VHlwZSB7IFBIWVNJQ0FMLCBNRU5UQUwgfSB0eXBlIFBlcnNvbiB7IG5hbWU6IFN0cmluZyBzdGF0cyh0eXBlOlN0YXRUeXBlKTogU3RhdCB9IHR5cGUgUXVlcnkgeyBmaW5kUGVyc29uKGlkOiBJRCk6IFBlcnNvbiB9IGAsIHJlc29sdmVyczogeyBRdWVyeTogeyBmaW5kUGVyc29uKHtyZXEsIHJlcywgbmV4dH0sIHtpZH0pIHsgY29uc29sZS5sb2coJ2ZpbmQgcGVyc29uJykgfSB9LCBQZXJzb246IHsgc3RhdHMoe3R5cGV9KSB7IGxldCB7IHJlcSwgcmVzLCBuZXh0fSA9IHRoaXMucmVxdWVzdERhdGEgfSB9IH0sIGRvY3M6IHsgU3RhdFR5cGU6IHsgW1RZUEVdOiBgQSB0eXBlIG9mIHN0YXRpc3RpYyBhc3NvY2lhdGVkIHdpdGggcGVvcGxlYCwgUEhZU0lDQUw6IGBQaHlzaWNhbCBhdHRyaWJ1dGVzYCwgTUVOVEFMOiBgTWVudGFsIGF0dHJpYnV0ZXNgIH0sIFBlcnNvbjogeyBbVFlQRV06IGBSZXByZXNlbnRzIGEgcGVyc29uYCwgcGVyc29uSWQ6IGBVbmlxdWUgaWQgb2YgdGhlIHBlcnNvbiBpbiBxdWVzdGlvbmAsIG5hbWU6IGBUaGUgbmFtZSBvZiB0aGUgcGVyc29uYCwgc3RhdHM6IGBBbGxvd3MgeW91IHRvIHF1ZXJ5IHRoZSBzdGF0cyBvZiBhIHBlcnNvbiBiYXNlZCBvbiB0eXBlYCB9LCBRdWVyeTogeyBbVFlQRV06ICdUb3AgbGV2ZWwgcXVlcnkgZGVzYy4nLCBmaW5kUGVyc29uOiBgU2VhcmNoZXMgdGhlIHN5c3RlbSBmb3IgdGhlIHNwZWNpZmllZCB1c2VyYCB9IH0gfTtcbnZhciBQZXJzb24gPSBMRi5idWlsZChQZXJzb25EZWYpLCBwID0gbmV3IFBlcnNvbih7bmFtZTogJ0JyaWVsbGUnfSlcblBlcnNvbi5nZXRQcm9wKCdzdGF0cycsdHJ1ZSx7cmVxdWVzdERhdGE6e3JlcToxLHJlczoyLG5leHQ6M319KVxudmFyIEJyb2tlID0gTEYuYnVpbGQoe25hbWU6ICdCcm9rZScsIHNjaGVtYTogZ3FsYHR5cGUgQnJva2Uge25hbWU6IFN0cmluZ31gLCByZXNvbHZlcnM6e30sIGRvY3M6e319KVxudmFyIHQgPSBMRi52YWxpZGF0ZVRlbXBsYXRlKHtuYW1lOiAnJywgIHR5cGU6IEdRTEJhc2UsIHJlc29sdmVyczoge30sIGRvY3M6IHt9LCBzY2hlbWE6ICcnfSk7XG4qL1xuIl19