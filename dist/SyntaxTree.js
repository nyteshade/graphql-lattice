"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.SyntaxTree = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _neTypes = require("ne-types");

var _graphql = require("graphql");

var _lodash = require("lodash");

var _utils = require("./utils");

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

// Shorthand for the key storing the internal AST
// @prop
var AST_KEY = Symbol["for"]('Internal AST Storage Key');
/**
 * A parser and processor of GraphQL IDL Abstract Syntax Trees. Used to combine
 * a set of {@link GQLBase} class instances.
 *
 * @class SyntaxTree
 */

var SyntaxTree = /*#__PURE__*/function (_Symbol$iterator, _Symbol$toStringTag, _Symbol$toStringTag2) {
  /**
   * Constructs a new `SyntaxTree` object. If a string schema is supplied or
   * an already parsed AST object, either of which is valid GraphQL IDL, then
   * its parsed AST will be the internals of this object.
   *
   * @constructor
   * @memberof SyntaxTree
   * @method ⎆⠀constructor
   *
   * @param {string|Object|SyntaxTree} schemaOrASTOrST if supplied the tree
   * will be constructed with the contents of the data. If a string of IDL is
   * given, it will be parsed. If an AST is given, it will be verified. If a
   * SyntaxTree is supplied, it will be copied.
   */
  function SyntaxTree(schemaOrASTOrST) {
    (0, _classCallCheck2["default"])(this, SyntaxTree);
    // $ComputedType
    this[AST_KEY] = {};

    if (schemaOrASTOrST) {
      this.setAST(schemaOrASTOrST);
    }
  }
  /**
   * Getter that retrieves the abstract syntax tree created by `graphql.parse`
   * when it is presented with a valid string of IDL.
   *
   * @instance
   * @memberof SyntaxTree
   * @method ⬇︎⠀ast
   *
   * @return {Object} a GraphQL AST object
   */


  (0, _createClass2["default"])(SyntaxTree, [{
    key: "ast",
    get: function get() {
      // $ComputedType
      return this[AST_KEY];
    }
    /**
     * Setter that assigns the abstract syntax tree, typically created by
     * `graphql.parse` when given a valid string of IDL.
     *
     * @instance
     * @memberof SyntaxTree
     * @method ⬆︎⠀ast
     *
     * @param {Object} value a valid AST object. Other operations will act
     * in an undefined manner should this object not be a valid AST
     */
    ,
    set: function set(value) {
      // $ComputedType
      this[AST_KEY] = value;
    }
    /**
     * Sets the underlying AST object with either schema which will be parsed
     * into a valid AST or an existing AST. Previous ast values will be erased.
     *
     * @instance
     * @memberof SyntaxTree
     * @method ⌾⠀setAST
     *
     * @param {string|Object} schemaOrAST a valid GraphQL IDL schema or a
     * previosuly parsed or compatible GraphQL IDL AST object.
     * @return {SyntaxTree} this for inlining.
     */

  }, {
    key: "setAST",
    value: function setAST(schemaOrASTOrST) {
      // $ComputedType
      this[AST_KEY] = {};
      var type = (0, _neTypes.typeOf)(schemaOrASTOrST);
      var ast;
      var st;

      switch (type) {
        case String.name:
          try {
            ast = (0, _graphql.parse)(schemaOrASTOrST);
            (0, _lodash.merge)(this.ast, ast);
          } catch (ignore) {
            /* Ignore this error */
          }

          break;

        case Object.name:
          ast = schemaOrASTOrST;

          try {
            ast = (0, _graphql.parse)((0, _graphql.print)(ast));
            (0, _lodash.merge)(this.ast, ast);
          } catch (ignore) {
            /* Ignore this error */
          }

          break;

        case SyntaxTree.name:
          st = schemaOrASTOrST;
          (0, _lodash.merge)(this.ast, st.ast);
          break;
      }

      return this;
    }
    /**
     * As passthru update method that works on the internal AST object. If
     * an error occurs, the update is skipped. An error can occur if adding the
     * changes would make the AST invalid. In such a case, the error is logged
     * to the error console.
     *
     * @instance
     * @memberof SyntaxTree
     * @method ⌾⠀updateAST
     *
     * @param {Object} ast an existing GraphQL IDL AST object that will be
     * merged on top of the existing tree using _.merge()
     * @return {SyntaxTree} this for inlining.
     */

  }, {
    key: "updateAST",
    value: function updateAST(ast) {
      if ((0, _neTypes.typeOf)(ast) === Object.name) {
        var newAST = (0, _lodash.merge)({}, this.ast, ast);

        try {
          (0, _graphql.print)(newAST);
          this.ast = (0, _lodash.merge)(this.ast, ast);
        } catch (error) {
          _utils.LatticeLogs.error('[SyntaxTree] Failed to updateAST with %o', ast);

          _utils.LatticeLogs.error('Resulting object would be %o', newAST);

          _utils.LatticeLogs.error(error);
        }
      }

      return this;
    }
    /**
     * Appends all definitions from another AST to this one. The method will
     * actually create a copy using SyntaxTree.from() so the input types can
     * be any one of a valid GraphQL IDL schema string, a GraphQL IDL AST or
     * another SyntaxTree object instance.
     *
     * Definitions of the same name but different kinds will be replaced by the
     * new copy. Those of the same kind and name will be merged (TODO handle more
     * than ObjectTypeDefinition kinds when merging; currently other types are
     * overwritten).
     *
     * @instance
     * @memberof SyntaxTree
     * @method ⌾⠀appendDefinitions
     *
     * @param {string|Object|SyntaxTree} schemaOrASTOrST an instance of one of
     * the valid types for SyntaxTree.from() that can be used to create or
     * duplicate the source from which to copy definitions.
     * @return {SyntaxTree} this for inlining
     */

  }, {
    key: "appendDefinitions",
    value: function appendDefinitions(schemaOrASTOrST) {
      var source = SyntaxTree.from(schemaOrASTOrST);
      var set = new Set();
      this.ast.definitions.map(function (definition) {
        set.add(definition.name.value);
      });

      if (source && source.ast.definitions && this.ast.definitions) {
        var _iterator = _createForOfIteratorHelper(source),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var theirs = _step.value;
            var name = theirs.name.value;
            var ours = this.find(name);
            var index = ours && this.ast.definitions.indexOf(ours) || -1; // We don't yet have one with that name

            if (!set.has(name)) {
              set.add(name);
              this.ast.definitions.push(theirs);
            } // We do have one with that name
            else {
              // The kinds aren't the same, just replace theirs with ours
              if (theirs.kind !== ours.kind) {
                // replace with the new one
                this.ast.definitions[index] = theirs;
              } // The kinds are the same, lets just merge their fields
              else {
                // merge the properties of the same types.
                switch (theirs.kind) {
                  case 'ObjectTypeDefinition':
                    ours.interfaces = [].concat(ours.interfaces, theirs.interfaces);
                    ours.directives = [].concat(ours.directives, theirs.directives);
                    ours.fields = [].concat(ours.fields, theirs.fields);
                    break;

                  default:
                    // Since we don't support other types yet. Let's replace
                    this.ast.definitions[index] = theirs;
                    break;
                }
              }
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }

      return this;
    }
    /**
     * This method finds the Query type definitions in the supplied AST or
     * SyntaxTree objects, takes its defined fields and adds it to the current
     * instances. If this instance does not have a Query type defined but the
     * supplied object does, then the supplied one is moved over. If neither
     * has a query handler, then nothing happens.
     *
     * NOTE this *removes* the Query type definition from the supplied AST or
     * SyntaxTree object.
     *
     * @instance
     * @memberof SyntaxTree
     * @method ⌾⠀consumeDefinition
     *
     * @param {Object|SyntaxTree} astOrSyntaxTree a valid GraphQL IDL AST or
     * an instance of SyntaxTree that represents one.
     * @param {string|RegExp} definitionType a valid search input as would be
     * accepted for the #find() method of this object.
     * @return {SyntaxTree} returns this for inlining
     */

  }, {
    key: "consumeDefinition",
    value: function consumeDefinition(astOrSyntaxTree) {
      var definitionType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "Query";

      if (!astOrSyntaxTree || !this.ast || !this.ast.definitions) {
        return this;
      }

      var tree = (0, _neTypes.typeOf)(SyntaxTree) === SyntaxTree.name ? astOrSyntaxTree : SyntaxTree.from(astOrSyntaxTree);
      var left = this.find(definitionType);
      var right = tree && tree.find(definitionType) || null;

      if (!tree) {
        _utils.LatticeLogs.error('There seems to be something wrong with your tree');

        _utils.LatticeLogs.error(new Error('Missing tree; continuing...'));

        return this;
      }

      if (!right) {
        return this;
      }

      if (!left) {
        this.ast.definitions.push(right); // Remove the copied definition from the source

        tree.ast.definitions.splice(tree.ast.definitions.indexOf(right), 1);
        return this;
      } // TODO support other types aside from ObjectTypeDefinitions
      // TODO see if there is a better way to achieve this with built-in
      // graphql code someplace


      switch (left.kind) {
        case 'ObjectTypeDefinition':
          if (left.interfaces && right.interfaces) {
            left.interfaces = [].concat(left.interfaces, right.interfaces);
          }

          if (left.directives && right.directives) {
            left.directives = [].concat(left.directives, right.directives);
          }

          if (left.fields && right.fields) {
            left.fields = [].concat(left.fields, right.fields);
          }

          break;

        default:
          break;
      } // Remove the copied definition from the source


      tree.ast.definitions.splice(tree.ast.definitions.indexOf(right), 1);
      return this;
    }
    /**
     * When iterating over an instance of SyntaxTree, you are actually
     * iterating over the definitions of the SyntaxTree if there are any;
     *
     * @instance
     * @memberof SyntaxTree
     * @method *[Symbol.iterator]
     *
     * @return {TypeDefinitionNode} an instance of a TypeDefinitionNode; see
     * graphql/language/ast.js.flow for more information
     * @ComputedType
     */

  }, {
    key: _Symbol$iterator,
    value:
    /*#__PURE__*/
    _regenerator["default"].mark(function value() {
      return _regenerator["default"].wrap(function value$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!this[AST_KEY].definitions) {
                _context.next = 5;
                break;
              }

              return _context.delegateYield(this[AST_KEY].definitions, "t0", 2);

            case 2:
              return _context.abrupt("return", _context.t0);

            case 5:
              return _context.delegateYield(this, "t1", 6);

            case 6:
              return _context.abrupt("return", _context.t1);

            case 7:
            case "end":
              return _context.stop();
          }
        }
      }, value, this);
    })
    /**
     * Getter that builds a small outline object denoting the schema being
     * processed. If you have a schema that looks like the following:
     *
     * ```javascript
     * let st = SyntaxTree.from(`
     *   type Contrived {
     *     name: String
     *     age: Int
     *   }
     *
     *   type Query {
     *     getContrived: Contrived
     *   }
     * `)
     * let outline = st.outline
     * ```
     *
     * You will end up with an object that looks like the following:
     *
     * ```javascript
     * {
     *   Contrived: { name: 'String', age: 'Int' },
     *   Query: { getContrived: 'Contrived' }
     * }
     * ```
     *
     * As may be evidenced by the example above, the name of the type is
     * represented by an object where the name of each field (sans arguments)
     * is mapped to a string denoting the type.
     */

  }, {
    key: "outline",
    get: function get() {
      var outline = {};
      var interfaces = Symbol["for"]('interfaces'); // $FlowFixMe

      var _iterator2 = _createForOfIteratorHelper(this),
          _step2;

      try {
        var _loop = function _loop() {
          var definition = _step2.value;
          var out = void 0;

          switch (definition.kind) {
            case 'InterfaceTypeDefinition':
            case 'ObjectTypeDefinition':
              out = outline[definition.name.value] = {};
              definition.fields.forEach(function (field) {
                if (field.type.kind === 'NamedType') out[field.name.value] = field.type.name.value;else if (field.type.kind === 'ListType') out[field.name.value] = field.type.type.name.value;
              });

              if (definition.interfaces) {
                // $FlowFixMe
                out = out[interfaces] = out[interfaces] || [];
                definition.interfaces.forEach(function (_interface) {
                  return out.push(_interface.name.value);
                });
              }

              break;

            case 'EnumTypeDefinition':
              out = outline[definition.name.value] = [];
              definition.values.forEach(function (value) {
                return out[value.name.value] = value.name.value;
              });
              break;

            case 'UnionTypeDefinition':
              out = outline[definition.name.value] = [];
              definition.types.forEach(function (type) {
                return out.push(type.name.value);
              });
              break;
          }
        };

        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          _loop();
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }

      return outline;
    }
    /**
     * Iterate through the definitions of the AST if there are any. For each
     * definition the name property's value field is compared to the supplied
     * definitionName. The definitionName can be a string or a regular
     * expression if finer granularity is desired.
     *
     * @instance
     * @memberof SyntaxTree
     * @method ⌾⠀find
     *
     * @param {string|RegExp} definitionName a string or regular expression used
     * to match against the definition name field in a given AST.
     * @return {Object|null} a reference to the internal definition field or
     * null if one with a matching name could not be found.
     */

  }, {
    key: "find",
    value: function find(definitionName) {
      // $ComputedType
      return SyntaxTree.findDefinition(this[AST_KEY], definitionName);
    }
    /**
     * SyntaxTree instances that are toString()'ed will have the graphql method
     * print() called on them to convert their internal structures back to a
     * GraphQL IDL schema syntax. If the object is in an invalid state, it WILL
     * throw an error.
     *
     * @instance
     * @memberof SyntaxTree
     * @method ⌾⠀toString
     *
     * @return {string} the AST for the tree parsed back into a string
     */

  }, {
    key: "toString",
    value: function toString() {
      // $ComputedType
      return (0, _graphql.print)(this[AST_KEY]);
    }
    /**
     * A runtime constant denoting a query type.
     *
     * @type {string}
     * @static
     * @memberof SyntaxTree
     * @method ⬇︎⠀QUERY
     * @readonly
     * @const
     */

  }, {
    key: _Symbol$toStringTag,
    get:
    /**
     * Returns the `constructor` name. If invoked as the context, or `this`,
     * object of the `toString` method of `Object`'s `prototype`, the resulting
     * value will be `[object MyClass]`, given an instance of `MyClass`
     *
     * @method ⌾⠀[Symbol.toStringTag]
     * @memberof SyntaxTree
     *
     * @return {string} the name of the class this is an instance of
     * @ComputedType
     */
    function get() {
      return this.constructor.name;
    }
    /**
     * Applies the same logic as {@link #[Symbol.toStringTag]} but on a static
     * scale. So, if you perform `Object.prototype.toString.call(MyClass)`
     * the result would be `[object MyClass]`.
     *
     * @method ⌾⠀[Symbol.toStringTag]
     * @memberof SyntaxTree
     * @static
     *
     * @return {string} the name of this class
     * @ComputedType
     */

  }], [{
    key: "QUERY",
    get: function get() {
      return 'Query';
    }
    /**
     * A runtime constant denoting a mutation type.
     *
     * @type {string}
     * @static
     * @memberof SyntaxTree
     * @method ⬇︎⠀MUTATION
     * @readonly
     * @const
     */

  }, {
    key: "MUTATION",
    get: function get() {
      return 'Mutation';
    }
    /**
    * A runtime constant denoting a subscription type.
    *
    * @type {string}
    * @static
    * @memberof SyntaxTree
    * @method SUBSCRIPTION
    * @readonly
    * @const
    */

  }, {
    key: "SUBSCRIPTION",
    get: function get() {
      return 'Subscription';
    }
  }, {
    key: _Symbol$toStringTag2,
    get: function get() {
      return this.name;
    }
    /**
     * Given one of, a valid GraphQL IDL schema string, a valid GraphQL AST or
     * an instance of SyntaxTree, the static from() method will create a new
     * instance of the SyntaxTree with the values you provide.
     *
     * @static
     * @memberof SyntaxTree
     * @method ⌾⠀from
     *
     * @param {String|Object|SyntaxTree} mixed an instance of one of the valid
     * types specified above. Everything else will result in a null value.
     * @return {SyntaxTree} a newly created and populated instance of SyntaxTree
     * or null if an invalid type was supplied for mixed.
     */

  }, {
    key: "from",
    value: function from(mixed) {
      var schema;
      var ast;

      switch ((0, _neTypes.typeOf)(mixed)) {
        case String.name:
          schema = mixed;

          try {
            (0, _graphql.parse)(schema);
          } catch (error) {
            _utils.LatticeLogs.error(error);

            return null;
          }

          return SyntaxTree.fromSchema(String(schema));

        case Object.name:
          ast = mixed;

          try {
            (0, _graphql.print)(ast);
          } catch (error) {
            return null;
          }

          return SyntaxTree.fromAST(ast);

        case SyntaxTree.name:
          schema = mixed.toString();
          return SyntaxTree.from(schema);

        default:
          return null;
      }
    }
    /**
     * Generates a new instance of SyntaxTree from the supplied, valid, GraphQL
     * schema. This method does not perform try/catch validation and if an
     * invalid GraphQL schema is supplied an error will be thrown.
     *
     * @static
     * @memberof SyntaxTree
     * @method ⌾⠀fromSchema
     *
     * @param {string} schema a valid GraphQL IDL schema string.
     * @return {SyntaxTree} a new instance of SyntaxTree initialized with a
     * parsed response from require('graphql').parse().
     */

  }, {
    key: "fromSchema",
    value: function fromSchema(schema) {
      var ast = (0, _graphql.parse)(schema);
      var tree = new SyntaxTree(ast);
      return tree;
    }
    /**
     * Generates a new instance of SyntaxTree from the supplied, valid, GraphQL
     * schema. This method does not perform try/catch validation and if an
     * invalid GraphQL schema is supplied an error will be thrown.
     *
     * @static
     * @memberof SyntaxTree
     * @method ⌾⠀fromAST
     *
     * @param {object} ast a valid GraphQL AST object.
     * @return {SyntaxTree} a new instance of SyntaxTree initialized with a
     * supplied abstract syntax tree generated by require('graphql').parse() or
     * other compatible method.
     */

  }, {
    key: "fromAST",
    value: function fromAST(ast) {
      var source = (0, _graphql.parse)((0, _graphql.print)(ast));
      var tree = new SyntaxTree(source);
      return source ? tree : null;
    }
    /**
     * Iterate through the definitions of the AST if there are any. For each
     * definition the name property's value field is compared to the supplied
     * definitionName. The definitionName can be a string or a regular
     * expression if finer granularity is desired.
     *
     * @static
     * @memberof SyntaxTree
     * @method ⌾⠀findDefinition
     *
     * @param {Object} ast an abstract syntax tree object created from a GQL SDL
     * @param {string|RegExp} definitionName a string or regular expression used
     * to match against the definition name field in a given AST.
     * @return {Object|null} a reference to the internal definition field or
     * null if one with a matching name could not be found.
     */

  }, {
    key: "findDefinition",
    value: function findDefinition(ast, definitionName) {
      return this.findInASTArrayByNameValue(ast.definitions, definitionName);
    }
    /**
     * Iterate through the fields of a definition AST if there are any. For each
     * field, the name property's value field is compared to the supplied
     * fieldName. The fieldName can be a string or a regular expression if
     * finer granularity is desired.
     *
     * Before iterating over the fields, however, the definition is found using
     * `SyntaxTree#findDefinition`. If either the field or definition are not
     * found, null is returned.
     *
     * @static
     * @memberof SyntaxTree
     * @method ⌾⠀findField
     * @since 2.7.0
     *
     * @param {Object} ast an abstract syntax tree object created from a GQL SDL
     * @param {string|RegExp} definitionName a string or regular expression used
     * to match against the definition name field in a given AST.
     * @param {string|RegExp} fieldName a string or regular expression used
     * to match against the field name field in a given AST.
     * @return {Object|null} an object containing two keys, the first being
     * `field` which points to the requested AST definition field. The second
     * being `meta` which contains three commonly requested bits of data; `name`,
     * `type` and `nullable`. Non-nullable fields have their actual type wrapped
     * in a `NonNullType` GraphQL construct. The actual field type is contained
     * within. The meta object surfaces those values for easy use.
     */

  }, {
    key: "findField",
    value: function findField(ast, definitionName, fieldName) {
      var definition = this.findDefinition(ast, definitionName);
      var meta;

      if (!definition || !definition.fields) {
        return null;
      }

      var field = this.findInASTArrayByNameValue(definition.fields, fieldName);

      if (field) {
        meta = {
          name: field.name && field.name.value || null,
          type: field.type && field.type.kind === 'NonNullType' ? field.type.type.name.value : field.type && field.type.name && field.type.name.value || null,
          nullable: !!(field.type && field.type.kind !== 'NonNullType')
        };
      }

      return {
        field: field,
        meta: meta
      };
    }
    /**
     * Enum AST definitions operate differently than object type definitions
     * do. Namely, they do not have a `fields` array but instead have a `values`
     * array. This wrapper method, first finds the enum definition in the ast
     * and then searches the values for the named node desired and returns that
     * or null, if one could not be found.
     *
     * @method SyntaxTree#⌾⠀findEnumDefinition
     * @since 2.7.0
     *
     * @param {Object} ast the abstract syntax tree parsed by graphql
     * @param {string|RegExp} enumDefinitionName a string or regular expression
     * used to locate the enum definition in the AST.
     * @param {string|RegExp} enumValueName a string or regular expression used
     * to locate the value by name in the values of the enum definition.
     * @return {Object|null} the desired AST node or null if one does not exist
     */

  }, {
    key: "findEnumDefinition",
    value: function findEnumDefinition(ast, enumDefinitionName, enumValueName) {
      // Fetch the enum definition
      var definition = this.findDefinition(ast, enumDefinitionName); // Ensure we have one or that it has a values array

      if (!definition || !definition.values) {
        return null;
      } // Return the results of an `findInASTArrayByNameValue()` search of the
      // aforementioned 'values' array.


      return this.findInASTArrayByNameValue(definition.values, enumValueName);
    }
    /**
     * A lot of searching in ASTs is filtering through arrays and matching on
     * subobject properties on each iteration. A common theme is find something
     * by its `.name.value`. This method simplifies that by taking an array of
     * AST nodes and searching them for a `.name.value` property that exists
     * within.
     *
     * @static
     * @memberof SyntaxTree
     * @method ⌾⠀findInASTArrayByNameValue
     * @since 2.7.0
     *
     * @param {Array} array of mixed AST object nodes containing `name.value`s
     * @param {string|RegExp} name a string or regular expression used
     * to match against the node name value
     * @return {Object|null} the AST leaf if one matches or null otherwise.
     */

  }, {
    key: "findInASTArrayByNameValue",
    value: function findInASTArrayByNameValue(array, name) {
      var isRegExp = /RegExp/.test((0, _neTypes.typeOf)(name));
      var regex = !isRegExp // $FlowFixMe
      ? new RegExp(RegExp.escape(name.toString())) // $FlowFixMe
      : name;
      var flags = regex.flags;
      var source = regex.source;

      var reducer = function reducer(last, cur, i) {
        if (last !== -1) return last;
        if (!cur || !cur.name || !cur.name.value) return -1;
        return new RegExp(source, flags).test(cur.name.value) ? i : -1;
      };

      var index = array.reduce(reducer, -1);
      return ~index ? array[index] : null;
    }
    /**
     * Query types in GraphQL are an ObjectTypeDefinition of importance for
     * placement on the root object. There is utility in creating an empty
     * one that can be injected with the fields of other GraphQL object query
     * entries.
     *
     * @static
     * @memberof SyntaxTree
     * @method ⌾⠀EmptyQuery
     *
     * @return {SyntaxTree} an instance of SyntaxTree with a base AST generated
     * by parsing the graph query, "type Query {}"
     */

  }, {
    key: "EmptyQuery",
    value: function EmptyQuery() {
      return SyntaxTree.from("type ".concat(this.QUERY, " {}"));
    }
    /**
     * Mutation types in GraphQL are an ObjectTypeDefinition of importance for
     * placement on the root object. There is utility in creating an empty
     * one that can be injected with the fields of other GraphQL object mutation
     * entries.
     *
     * @static
     * @memberof SyntaxTree
     * @method ⌾⠀EmptyMutation
     *
     * @return {SyntaxTree} an instance of SyntaxTree with a base AST generated
     * by parsing the graph query, "type Mutation {}"
     */

  }, {
    key: "EmptyMutation",
    value: function EmptyMutation() {
      return SyntaxTree.from("type ".concat(this.MUTATION, " {}"));
    }
    /**
     * The starting point for a SyntaxTree that will be built up programmatically.
     *
     * @static
     * @memberof SyntaxTree
     * @method ⌾⠀EmptyDocument
     *
     * @param {string|Object|SyntaxTree} schemaOrASTOrST any valid type taken by
     * SyntaxTree.from() used to further populate the new empty document
     * @return {SyntaxTree} an instance of SyntaxTree with no definitions and a
     * kind set to 'Document'
     */

  }, {
    key: "EmptyDocument",
    value: function EmptyDocument(schemaOrASTOrST) {
      var tree = new SyntaxTree(); // Due to normal validation methods with ASTs (i.e. converting to string
      // and then back to an AST object), doing this with an empty document
      // fails. Therefore, we manually set the document contents here. This allows
      // toString(), consumeDefinition() and similar methods to still work.

      tree.ast = {
        kind: 'Document',
        definitions: [],
        loc: {
          start: 0,
          end: 0
        }
      };

      if (schemaOrASTOrST) {
        tree.appendDefinitions(schemaOrASTOrST);
      }

      return tree;
    }
  }]);
  return SyntaxTree;
}(Symbol.iterator, Symbol.toStringTag, Symbol.toStringTag);

exports.SyntaxTree = SyntaxTree;
var _default = SyntaxTree;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2VzNi9TeW50YXhUcmVlLmpzIl0sIm5hbWVzIjpbIkFTVF9LRVkiLCJTeW1ib2wiLCJTeW50YXhUcmVlIiwic2NoZW1hT3JBU1RPclNUIiwic2V0QVNUIiwidmFsdWUiLCJ0eXBlIiwiYXN0Iiwic3QiLCJTdHJpbmciLCJuYW1lIiwiaWdub3JlIiwiT2JqZWN0IiwibmV3QVNUIiwiZXJyb3IiLCJsbCIsInNvdXJjZSIsImZyb20iLCJzZXQiLCJTZXQiLCJkZWZpbml0aW9ucyIsIm1hcCIsImRlZmluaXRpb24iLCJhZGQiLCJ0aGVpcnMiLCJvdXJzIiwiZmluZCIsImluZGV4IiwiaW5kZXhPZiIsImhhcyIsInB1c2giLCJraW5kIiwiaW50ZXJmYWNlcyIsImNvbmNhdCIsImRpcmVjdGl2ZXMiLCJmaWVsZHMiLCJhc3RPclN5bnRheFRyZWUiLCJkZWZpbml0aW9uVHlwZSIsInRyZWUiLCJsZWZ0IiwicmlnaHQiLCJFcnJvciIsInNwbGljZSIsIm91dGxpbmUiLCJvdXQiLCJmb3JFYWNoIiwiZmllbGQiLCJfaW50ZXJmYWNlIiwidmFsdWVzIiwidHlwZXMiLCJkZWZpbml0aW9uTmFtZSIsImZpbmREZWZpbml0aW9uIiwiY29uc3RydWN0b3IiLCJtaXhlZCIsInNjaGVtYSIsImZyb21TY2hlbWEiLCJmcm9tQVNUIiwidG9TdHJpbmciLCJmaW5kSW5BU1RBcnJheUJ5TmFtZVZhbHVlIiwiZmllbGROYW1lIiwibWV0YSIsIm51bGxhYmxlIiwiZW51bURlZmluaXRpb25OYW1lIiwiZW51bVZhbHVlTmFtZSIsImFycmF5IiwiaXNSZWdFeHAiLCJ0ZXN0IiwicmVnZXgiLCJSZWdFeHAiLCJlc2NhcGUiLCJmbGFncyIsInJlZHVjZXIiLCJsYXN0IiwiY3VyIiwiaSIsInJlZHVjZSIsIlFVRVJZIiwiTVVUQVRJT04iLCJsb2MiLCJzdGFydCIsImVuZCIsImFwcGVuZERlZmluaXRpb25zIiwiaXRlcmF0b3IiLCJ0b1N0cmluZ1RhZyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBR0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7O0FBY0E7QUFDQTtBQUNBLElBQU1BLE9BQU8sR0FBR0MsTUFBTSxPQUFOLENBQVcsMEJBQVgsQ0FBaEI7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0lBQ2FDLFU7QUFFWDtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Usc0JBQVlDLGVBQVosRUFBNEQ7QUFBQTtBQUMxRDtBQUNBLFNBQUtILE9BQUwsSUFBZ0IsRUFBaEI7O0FBRUEsUUFBSUcsZUFBSixFQUFxQjtBQUNuQixXQUFLQyxNQUFMLENBQVlELGVBQVo7QUFDRDtBQUNGO0FBRUQ7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O1NBQ0UsZUFBa0I7QUFDaEI7QUFDQSxhQUFPLEtBQUtILE9BQUwsQ0FBUDtBQUNEO0FBRUQ7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7U0FDRSxhQUFRSyxLQUFSLEVBQTZCO0FBQzNCO0FBQ0EsV0FBS0wsT0FBTCxJQUFnQkssS0FBaEI7QUFDRDtBQUVEO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztXQUNFLGdCQUFPRixlQUFQLEVBQThEO0FBQzVEO0FBQ0EsV0FBS0gsT0FBTCxJQUFnQixFQUFoQjtBQUVBLFVBQU1NLElBQUksR0FBRyxxQkFBT0gsZUFBUCxDQUFiO0FBQ0EsVUFBSUksR0FBSjtBQUNBLFVBQUlDLEVBQUo7O0FBRUEsY0FBUUYsSUFBUjtBQUNFLGFBQUtHLE1BQU0sQ0FBQ0MsSUFBWjtBQUNFLGNBQUk7QUFDRkgsWUFBQUEsR0FBRyxHQUFHLG9CQUFPSixlQUFQLENBQU47QUFFQSwrQkFBTSxLQUFLSSxHQUFYLEVBQWdCQSxHQUFoQjtBQUNELFdBSkQsQ0FLQSxPQUFPSSxNQUFQLEVBQWU7QUFBRTtBQUF5Qjs7QUFFMUM7O0FBQ0YsYUFBS0MsTUFBTSxDQUFDRixJQUFaO0FBQ0VILFVBQUFBLEdBQUcsR0FBSUosZUFBUDs7QUFFQSxjQUFJO0FBQ0ZJLFlBQUFBLEdBQUcsR0FBRyxvQkFBTSxvQkFBTUEsR0FBTixDQUFOLENBQU47QUFDQSwrQkFBTSxLQUFLQSxHQUFYLEVBQWdCQSxHQUFoQjtBQUNELFdBSEQsQ0FJQSxPQUFPSSxNQUFQLEVBQWU7QUFBRTtBQUF5Qjs7QUFFMUM7O0FBQ0YsYUFBS1QsVUFBVSxDQUFDUSxJQUFoQjtBQUNFRixVQUFBQSxFQUFFLEdBQUlMLGVBQU47QUFFQSw2QkFBTSxLQUFLSSxHQUFYLEVBQWdCQyxFQUFFLENBQUNELEdBQW5CO0FBRUE7QUF6Qko7O0FBNEJBLGFBQU8sSUFBUDtBQUNEO0FBRUQ7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztXQUNFLG1CQUFVQSxHQUFWLEVBQW1DO0FBQ2pDLFVBQUkscUJBQU9BLEdBQVAsTUFBZ0JLLE1BQU0sQ0FBQ0YsSUFBM0IsRUFBaUM7QUFDL0IsWUFBSUcsTUFBTSxHQUFHLG1CQUFNLEVBQU4sRUFBVSxLQUFLTixHQUFmLEVBQW9CQSxHQUFwQixDQUFiOztBQUVBLFlBQUk7QUFDRiw4QkFBTU0sTUFBTjtBQUNBLGVBQUtOLEdBQUwsR0FBVyxtQkFBTSxLQUFLQSxHQUFYLEVBQWdCQSxHQUFoQixDQUFYO0FBQ0QsU0FIRCxDQUlBLE9BQU9PLEtBQVAsRUFBYztBQUNaQyw2QkFBR0QsS0FBSCxDQUFTLDBDQUFULEVBQXFEUCxHQUFyRDs7QUFDQVEsNkJBQUdELEtBQUgsQ0FBUyw4QkFBVCxFQUF5Q0QsTUFBekM7O0FBQ0FFLDZCQUFHRCxLQUFILENBQVNBLEtBQVQ7QUFDRDtBQUNGOztBQUVELGFBQU8sSUFBUDtBQUNEO0FBRUQ7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztXQUNFLDJCQUFrQlgsZUFBbEIsRUFBNkU7QUFDM0UsVUFBTWEsTUFBTSxHQUFHZCxVQUFVLENBQUNlLElBQVgsQ0FBZ0JkLGVBQWhCLENBQWY7QUFDQSxVQUFNZSxHQUFHLEdBQUcsSUFBSUMsR0FBSixFQUFaO0FBRUEsV0FBS1osR0FBTCxDQUFTYSxXQUFULENBQXFCQyxHQUFyQixDQUF5QixVQUFDQyxVQUFELEVBQWdCO0FBQ3ZDSixRQUFBQSxHQUFHLENBQUNLLEdBQUosQ0FBUUQsVUFBVSxDQUFDWixJQUFYLENBQWdCTCxLQUF4QjtBQUNELE9BRkQ7O0FBSUEsVUFBSVcsTUFBTSxJQUFJQSxNQUFNLENBQUNULEdBQVAsQ0FBV2EsV0FBckIsSUFBb0MsS0FBS2IsR0FBTCxDQUFTYSxXQUFqRCxFQUE4RDtBQUFBLG1EQUN4Q0osTUFEd0M7QUFBQTs7QUFBQTtBQUM1RCw4REFBa0M7QUFBQSxnQkFBekJRLE1BQXlCO0FBQ2hDLGdCQUFJZCxJQUFJLEdBQUdjLE1BQU0sQ0FBQ2QsSUFBUCxDQUFZTCxLQUF2QjtBQUNBLGdCQUFJb0IsSUFBSSxHQUFHLEtBQUtDLElBQUwsQ0FBVWhCLElBQVYsQ0FBWDtBQUNBLGdCQUFJaUIsS0FBSyxHQUFHRixJQUFJLElBQUksS0FBS2xCLEdBQUwsQ0FBU2EsV0FBVCxDQUFxQlEsT0FBckIsQ0FBNkJILElBQTdCLENBQVIsSUFBOEMsQ0FBQyxDQUEzRCxDQUhnQyxDQUtoQzs7QUFDQSxnQkFBSSxDQUFDUCxHQUFHLENBQUNXLEdBQUosQ0FBUW5CLElBQVIsQ0FBTCxFQUFvQjtBQUNsQlEsY0FBQUEsR0FBRyxDQUFDSyxHQUFKLENBQVFiLElBQVI7QUFDQSxtQkFBS0gsR0FBTCxDQUFTYSxXQUFULENBQXFCVSxJQUFyQixDQUEwQk4sTUFBMUI7QUFDRCxhQUhELENBS0E7QUFMQSxpQkFNSztBQUNIO0FBQ0Esa0JBQUlBLE1BQU0sQ0FBQ08sSUFBUCxLQUFnQk4sSUFBSSxDQUFDTSxJQUF6QixFQUErQjtBQUM3QjtBQUNBLHFCQUFLeEIsR0FBTCxDQUFTYSxXQUFULENBQXFCTyxLQUFyQixJQUE4QkgsTUFBOUI7QUFDRCxlQUhELENBS0E7QUFMQSxtQkFNSztBQUNIO0FBQ0Esd0JBQVFBLE1BQU0sQ0FBQ08sSUFBZjtBQUNFLHVCQUFLLHNCQUFMO0FBQ0VOLG9CQUFBQSxJQUFJLENBQUNPLFVBQUwsR0FBa0IsR0FBR0MsTUFBSCxDQUFVUixJQUFJLENBQUNPLFVBQWYsRUFBMkJSLE1BQU0sQ0FBQ1EsVUFBbEMsQ0FBbEI7QUFDQVAsb0JBQUFBLElBQUksQ0FBQ1MsVUFBTCxHQUFrQixHQUFHRCxNQUFILENBQVVSLElBQUksQ0FBQ1MsVUFBZixFQUEyQlYsTUFBTSxDQUFDVSxVQUFsQyxDQUFsQjtBQUNBVCxvQkFBQUEsSUFBSSxDQUFDVSxNQUFMLEdBQWMsR0FBR0YsTUFBSCxDQUFVUixJQUFJLENBQUNVLE1BQWYsRUFBdUJYLE1BQU0sQ0FBQ1csTUFBOUIsQ0FBZDtBQUNBOztBQUNGO0FBQ0U7QUFDQSx5QkFBSzVCLEdBQUwsQ0FBU2EsV0FBVCxDQUFxQk8sS0FBckIsSUFBOEJILE1BQTlCO0FBQ0E7QUFUSjtBQVdEO0FBQ0Y7QUFDRjtBQXBDMkQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQXFDN0Q7O0FBRUQsYUFBTyxJQUFQO0FBQ0Q7QUFFRDtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O1dBQ0UsMkJBQ0VZLGVBREYsRUFHYztBQUFBLFVBRFpDLGNBQ1ksdUVBRHNCLE9BQ3RCOztBQUNaLFVBQUksQ0FBQ0QsZUFBRCxJQUFvQixDQUFDLEtBQUs3QixHQUExQixJQUFpQyxDQUFDLEtBQUtBLEdBQUwsQ0FBU2EsV0FBL0MsRUFBNEQ7QUFBRSxlQUFPLElBQVA7QUFBYTs7QUFFM0UsVUFBTWtCLElBQUksR0FBRyxxQkFBT3BDLFVBQVAsTUFBdUJBLFVBQVUsQ0FBQ1EsSUFBbEMsR0FDVDBCLGVBRFMsR0FFVGxDLFVBQVUsQ0FBQ2UsSUFBWCxDQUFnQm1CLGVBQWhCLENBRko7QUFHQSxVQUFJRyxJQUFJLEdBQUcsS0FBS2IsSUFBTCxDQUFVVyxjQUFWLENBQVg7QUFDQSxVQUFJRyxLQUFLLEdBQUdGLElBQUksSUFBSUEsSUFBSSxDQUFDWixJQUFMLENBQVVXLGNBQVYsQ0FBUixJQUFxQyxJQUFqRDs7QUFFQSxVQUFJLENBQUNDLElBQUwsRUFBVztBQUNUdkIsMkJBQUdELEtBQUgsQ0FBUyxrREFBVDs7QUFDQUMsMkJBQUdELEtBQUgsQ0FBUyxJQUFJMkIsS0FBSixDQUFVLDZCQUFWLENBQVQ7O0FBQ0EsZUFBTyxJQUFQO0FBQ0Q7O0FBRUQsVUFBSSxDQUFDRCxLQUFMLEVBQVk7QUFBRSxlQUFPLElBQVA7QUFBYTs7QUFFM0IsVUFBSSxDQUFDRCxJQUFMLEVBQVc7QUFDVCxhQUFLaEMsR0FBTCxDQUFTYSxXQUFULENBQXFCVSxJQUFyQixDQUEwQlUsS0FBMUIsRUFEUyxDQUdUOztBQUNBRixRQUFBQSxJQUFJLENBQUMvQixHQUFMLENBQVNhLFdBQVQsQ0FBcUJzQixNQUFyQixDQUE0QkosSUFBSSxDQUFDL0IsR0FBTCxDQUFTYSxXQUFULENBQXFCUSxPQUFyQixDQUE2QlksS0FBN0IsQ0FBNUIsRUFBaUUsQ0FBakU7QUFFQSxlQUFPLElBQVA7QUFDRCxPQXhCVyxDQTBCWjtBQUNBO0FBQ0E7OztBQUNBLGNBQU9ELElBQUksQ0FBQ1IsSUFBWjtBQUNFLGFBQUssc0JBQUw7QUFDRSxjQUFJUSxJQUFJLENBQUNQLFVBQUwsSUFBbUJRLEtBQUssQ0FBQ1IsVUFBN0IsRUFBeUM7QUFDdkNPLFlBQUFBLElBQUksQ0FBQ1AsVUFBTCxHQUFrQixHQUFHQyxNQUFILENBQVVNLElBQUksQ0FBQ1AsVUFBZixFQUEyQlEsS0FBSyxDQUFDUixVQUFqQyxDQUFsQjtBQUNEOztBQUVELGNBQUlPLElBQUksQ0FBQ0wsVUFBTCxJQUFtQk0sS0FBSyxDQUFDTixVQUE3QixFQUF5QztBQUN2Q0ssWUFBQUEsSUFBSSxDQUFDTCxVQUFMLEdBQWtCLEdBQUdELE1BQUgsQ0FBVU0sSUFBSSxDQUFDTCxVQUFmLEVBQTJCTSxLQUFLLENBQUNOLFVBQWpDLENBQWxCO0FBQ0Q7O0FBRUQsY0FBSUssSUFBSSxDQUFDSixNQUFMLElBQWVLLEtBQUssQ0FBQ0wsTUFBekIsRUFBaUM7QUFDL0JJLFlBQUFBLElBQUksQ0FBQ0osTUFBTCxHQUFjLEdBQUdGLE1BQUgsQ0FBVU0sSUFBSSxDQUFDSixNQUFmLEVBQXVCSyxLQUFLLENBQUNMLE1BQTdCLENBQWQ7QUFDRDs7QUFFRDs7QUFDRjtBQUNFO0FBaEJKLE9BN0JZLENBZ0RaOzs7QUFDQUcsTUFBQUEsSUFBSSxDQUFDL0IsR0FBTCxDQUFTYSxXQUFULENBQXFCc0IsTUFBckIsQ0FBNEJKLElBQUksQ0FBQy9CLEdBQUwsQ0FBU2EsV0FBVCxDQUFxQlEsT0FBckIsQ0FBNkJZLEtBQTdCLENBQTVCLEVBQWlFLENBQWpFO0FBRUEsYUFBTyxJQUFQO0FBQ0Q7QUFFRDtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7OztpQ0FDRTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsbUJBQ00sS0FBS3hDLE9BQUwsRUFBY29CLFdBRHBCO0FBQUE7QUFBQTtBQUFBOztBQUVXLDRDQUFPLEtBQUtwQixPQUFMLEVBQWNvQixXQUFyQjs7QUFGWDtBQUFBOztBQUFBO0FBS1csNENBQU8sSUFBUDs7QUFMWDtBQUFBOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEs7QUFTQTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztTQUNFLGVBQXNCO0FBQ3BCLFVBQUl1QixPQUFPLEdBQUcsRUFBZDtBQUNBLFVBQUlYLFVBQVUsR0FBRy9CLE1BQU0sT0FBTixDQUFXLFlBQVgsQ0FBakIsQ0FGb0IsQ0FJcEI7O0FBSm9CLGtEQUtHLElBTEg7QUFBQTs7QUFBQTtBQUFBO0FBQUEsY0FLWHFCLFVBTFc7QUFNbEIsY0FBSXNCLEdBQUcsU0FBUDs7QUFFQSxrQkFBUXRCLFVBQVUsQ0FBQ1MsSUFBbkI7QUFDRSxpQkFBSyx5QkFBTDtBQUNBLGlCQUFLLHNCQUFMO0FBQ0VhLGNBQUFBLEdBQUcsR0FBR0QsT0FBTyxDQUFDckIsVUFBVSxDQUFDWixJQUFYLENBQWdCTCxLQUFqQixDQUFQLEdBQWlDLEVBQXZDO0FBQ0FpQixjQUFBQSxVQUFVLENBQUNhLE1BQVgsQ0FBa0JVLE9BQWxCLENBQ0UsVUFBQUMsS0FBSyxFQUFJO0FBQ1Asb0JBQUlBLEtBQUssQ0FBQ3hDLElBQU4sQ0FBV3lCLElBQVgsS0FBb0IsV0FBeEIsRUFDRWEsR0FBRyxDQUFDRSxLQUFLLENBQUNwQyxJQUFOLENBQVdMLEtBQVosQ0FBSCxHQUF3QnlDLEtBQUssQ0FBQ3hDLElBQU4sQ0FBV0ksSUFBWCxDQUFnQkwsS0FBeEMsQ0FERixLQUVLLElBQUl5QyxLQUFLLENBQUN4QyxJQUFOLENBQVd5QixJQUFYLEtBQW9CLFVBQXhCLEVBQ0hhLEdBQUcsQ0FBQ0UsS0FBSyxDQUFDcEMsSUFBTixDQUFXTCxLQUFaLENBQUgsR0FBd0J5QyxLQUFLLENBQUN4QyxJQUFOLENBQVdBLElBQVgsQ0FBZ0JJLElBQWhCLENBQXFCTCxLQUE3QztBQUNILGVBTkg7O0FBU0Esa0JBQUlpQixVQUFVLENBQUNVLFVBQWYsRUFBMkI7QUFDekI7QUFDQVksZ0JBQUFBLEdBQUcsR0FBSUEsR0FBRyxDQUFDWixVQUFELENBQUgsR0FBa0JZLEdBQUcsQ0FBQ1osVUFBRCxDQUFILElBQW1CLEVBQTVDO0FBRUFWLGdCQUFBQSxVQUFVLENBQUNVLFVBQVgsQ0FBc0JhLE9BQXRCLENBQ0UsVUFBQUUsVUFBVTtBQUFBLHlCQUFJSCxHQUFHLENBQUNkLElBQUosQ0FBU2lCLFVBQVUsQ0FBQ3JDLElBQVgsQ0FBZ0JMLEtBQXpCLENBQUo7QUFBQSxpQkFEWjtBQUdEOztBQUVEOztBQUVGLGlCQUFLLG9CQUFMO0FBQ0V1QyxjQUFBQSxHQUFHLEdBQUdELE9BQU8sQ0FBQ3JCLFVBQVUsQ0FBQ1osSUFBWCxDQUFnQkwsS0FBakIsQ0FBUCxHQUFpQyxFQUF2QztBQUNBaUIsY0FBQUEsVUFBVSxDQUFDMEIsTUFBWCxDQUFrQkgsT0FBbEIsQ0FDRSxVQUFBeEMsS0FBSztBQUFBLHVCQUFJdUMsR0FBRyxDQUFDdkMsS0FBSyxDQUFDSyxJQUFOLENBQVdMLEtBQVosQ0FBSCxHQUF3QkEsS0FBSyxDQUFDSyxJQUFOLENBQVdMLEtBQXZDO0FBQUEsZUFEUDtBQUdBOztBQUVGLGlCQUFLLHFCQUFMO0FBQ0V1QyxjQUFBQSxHQUFHLEdBQUdELE9BQU8sQ0FBQ3JCLFVBQVUsQ0FBQ1osSUFBWCxDQUFnQkwsS0FBakIsQ0FBUCxHQUFpQyxFQUF2QztBQUNBaUIsY0FBQUEsVUFBVSxDQUFDMkIsS0FBWCxDQUFpQkosT0FBakIsQ0FDRSxVQUFBdkMsSUFBSTtBQUFBLHVCQUFJc0MsR0FBRyxDQUFDZCxJQUFKLENBQVN4QixJQUFJLENBQUNJLElBQUwsQ0FBVUwsS0FBbkIsQ0FBSjtBQUFBLGVBRE47QUFHQTtBQXBDSjtBQVJrQjs7QUFLcEIsK0RBQTZCO0FBQUE7QUF5QzVCO0FBOUNtQjtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQWdEcEIsYUFBT3NDLE9BQVA7QUFDRDtBQUVEO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztXQUNFLGNBQUtPLGNBQUwsRUFBbUQ7QUFDakQ7QUFDQSxhQUFPaEQsVUFBVSxDQUFDaUQsY0FBWCxDQUEwQixLQUFLbkQsT0FBTCxDQUExQixFQUF5Q2tELGNBQXpDLENBQVA7QUFDRDtBQUVEO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztXQUNFLG9CQUFtQjtBQUNqQjtBQUNBLGFBQU8sb0JBQU0sS0FBS2xELE9BQUwsQ0FBTixDQUFQO0FBQ0Q7QUFFRDtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUEyQkU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNFLG1CQUEyQjtBQUFFLGFBQU8sS0FBS29ELFdBQUwsQ0FBaUIxQyxJQUF4QjtBQUE4QjtBQUUzRDtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7U0FsREUsZUFBMkI7QUFBRSxhQUFPLE9BQVA7QUFBZ0I7QUFFN0M7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7U0FDRSxlQUE4QjtBQUFFLGFBQU8sVUFBUDtBQUFtQjtBQUVqRDtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztTQUNFLGVBQWtDO0FBQUUsYUFBTyxjQUFQO0FBQXVCOzs7U0EyQjNELGVBQWtDO0FBQUUsYUFBTyxLQUFLQSxJQUFaO0FBQWtCO0FBRXREO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7V0FDRSxjQUFZMkMsS0FBWixFQUFvRTtBQUNsRSxVQUFJQyxNQUFKO0FBQ0EsVUFBSS9DLEdBQUo7O0FBRUEsY0FBUSxxQkFBTzhDLEtBQVAsQ0FBUjtBQUNFLGFBQUs1QyxNQUFNLENBQUNDLElBQVo7QUFDRTRDLFVBQUFBLE1BQU0sR0FBSUQsS0FBVjs7QUFDQSxjQUFJO0FBQUUsZ0NBQU1DLE1BQU47QUFBZSxXQUFyQixDQUFzQixPQUFNeEMsS0FBTixFQUFhO0FBQUVDLCtCQUFHRCxLQUFILENBQVNBLEtBQVQ7O0FBQWlCLG1CQUFPLElBQVA7QUFBYzs7QUFFcEUsaUJBQU9aLFVBQVUsQ0FBQ3FELFVBQVgsQ0FBc0I5QyxNQUFNLENBQUM2QyxNQUFELENBQTVCLENBQVA7O0FBQ0YsYUFBSzFDLE1BQU0sQ0FBQ0YsSUFBWjtBQUNFSCxVQUFBQSxHQUFHLEdBQUk4QyxLQUFQOztBQUNBLGNBQUk7QUFBRSxnQ0FBTTlDLEdBQU47QUFBWSxXQUFsQixDQUFtQixPQUFNTyxLQUFOLEVBQWE7QUFBRSxtQkFBTyxJQUFQO0FBQWM7O0FBRWhELGlCQUFPWixVQUFVLENBQUNzRCxPQUFYLENBQW1CakQsR0FBbkIsQ0FBUDs7QUFDRixhQUFLTCxVQUFVLENBQUNRLElBQWhCO0FBQ0U0QyxVQUFBQSxNQUFNLEdBQUdELEtBQUssQ0FBQ0ksUUFBTixFQUFUO0FBRUEsaUJBQU92RCxVQUFVLENBQUNlLElBQVgsQ0FBZ0JxQyxNQUFoQixDQUFQOztBQUNGO0FBQ0UsaUJBQU8sSUFBUDtBQWhCSjtBQWtCRDtBQUVEO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O1dBQ0Usb0JBQWtCQSxNQUFsQixFQUE4QztBQUM1QyxVQUFNL0MsR0FBRyxHQUFHLG9CQUFNK0MsTUFBTixDQUFaO0FBQ0EsVUFBSWhCLElBQUksR0FBRyxJQUFJcEMsVUFBSixDQUFlSyxHQUFmLENBQVg7QUFFQSxhQUFPK0IsSUFBUDtBQUNEO0FBRUQ7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztXQUNFLGlCQUFlL0IsR0FBZixFQUErQztBQUM3QyxVQUFNUyxNQUFNLEdBQUcsb0JBQU0sb0JBQU1ULEdBQU4sQ0FBTixDQUFmO0FBQ0EsVUFBSStCLElBQUksR0FBRyxJQUFJcEMsVUFBSixDQUFlYyxNQUFmLENBQVg7QUFFQSxhQUFPQSxNQUFNLEdBQUdzQixJQUFILEdBQVUsSUFBdkI7QUFDRDtBQUVEO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O1dBQ0Usd0JBQXNCL0IsR0FBdEIsRUFBbUMyQyxjQUFuQyxFQUFvRTtBQUNsRSxhQUFPLEtBQUtRLHlCQUFMLENBQ0xuRCxHQUFHLENBQUNhLFdBREMsRUFFTDhCLGNBRkssQ0FBUDtBQUlEO0FBRUQ7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O1dBQ0UsbUJBQ0UzQyxHQURGLEVBRUUyQyxjQUZGLEVBR0VTLFNBSEYsRUFJRTtBQUNBLFVBQU1yQyxVQUFVLEdBQUcsS0FBSzZCLGNBQUwsQ0FBb0I1QyxHQUFwQixFQUF5QjJDLGNBQXpCLENBQW5CO0FBQ0EsVUFBSVUsSUFBSjs7QUFFQSxVQUFJLENBQUN0QyxVQUFELElBQWUsQ0FBQ0EsVUFBVSxDQUFDYSxNQUEvQixFQUF1QztBQUNyQyxlQUFPLElBQVA7QUFDRDs7QUFFRCxVQUFNVyxLQUFLLEdBQUcsS0FBS1kseUJBQUwsQ0FBK0JwQyxVQUFVLENBQUNhLE1BQTFDLEVBQWtEd0IsU0FBbEQsQ0FBZDs7QUFFQSxVQUFJYixLQUFKLEVBQVc7QUFDVGMsUUFBQUEsSUFBSSxHQUFHO0FBQ0xsRCxVQUFBQSxJQUFJLEVBQUVvQyxLQUFLLENBQUNwQyxJQUFOLElBQWNvQyxLQUFLLENBQUNwQyxJQUFOLENBQVdMLEtBQXpCLElBQWtDLElBRG5DO0FBRUxDLFVBQUFBLElBQUksRUFBRXdDLEtBQUssQ0FBQ3hDLElBQU4sSUFBY3dDLEtBQUssQ0FBQ3hDLElBQU4sQ0FBV3lCLElBQVgsS0FBb0IsYUFBbEMsR0FDRmUsS0FBSyxDQUFDeEMsSUFBTixDQUFXQSxJQUFYLENBQWdCSSxJQUFoQixDQUFxQkwsS0FEbkIsR0FFRnlDLEtBQUssQ0FBQ3hDLElBQU4sSUFBY3dDLEtBQUssQ0FBQ3hDLElBQU4sQ0FBV0ksSUFBekIsSUFBaUNvQyxLQUFLLENBQUN4QyxJQUFOLENBQVdJLElBQVgsQ0FBZ0JMLEtBQWpELElBQTBELElBSnpEO0FBS0x3RCxVQUFBQSxRQUFRLEVBQUUsQ0FBQyxFQUFFZixLQUFLLENBQUN4QyxJQUFOLElBQWN3QyxLQUFLLENBQUN4QyxJQUFOLENBQVd5QixJQUFYLEtBQW9CLGFBQXBDO0FBTE4sU0FBUDtBQU9EOztBQUVELGFBQU87QUFBRWUsUUFBQUEsS0FBSyxFQUFMQSxLQUFGO0FBQVNjLFFBQUFBLElBQUksRUFBSkE7QUFBVCxPQUFQO0FBQ0Q7QUFFRDtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O1dBQ0UsNEJBQ0VyRCxHQURGLEVBRUV1RCxrQkFGRixFQUdFQyxhQUhGLEVBSVc7QUFDVDtBQUNBLFVBQU16QyxVQUFVLEdBQUcsS0FBSzZCLGNBQUwsQ0FBb0I1QyxHQUFwQixFQUF5QnVELGtCQUF6QixDQUFuQixDQUZTLENBSVQ7O0FBQ0EsVUFBSSxDQUFDeEMsVUFBRCxJQUFlLENBQUNBLFVBQVUsQ0FBQzBCLE1BQS9CLEVBQXVDO0FBQ3JDLGVBQU8sSUFBUDtBQUNELE9BUFEsQ0FTVDtBQUNBOzs7QUFDQSxhQUFPLEtBQUtVLHlCQUFMLENBQ0xwQyxVQUFVLENBQUMwQixNQUROLEVBRUxlLGFBRkssQ0FBUDtBQUlEO0FBRUQ7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztXQUNFLG1DQUNFQyxLQURGLEVBRUV0RCxJQUZGLEVBR1c7QUFDVCxVQUFNdUQsUUFBaUIsR0FBRyxTQUFTQyxJQUFULENBQWMscUJBQU94RCxJQUFQLENBQWQsQ0FBMUI7QUFDQSxVQUFNeUQsS0FBSyxHQUFHLENBQUNGLFFBQUQsQ0FDWjtBQURZLFFBRVYsSUFBSUcsTUFBSixDQUFXQSxNQUFNLENBQUNDLE1BQVAsQ0FBYzNELElBQUksQ0FBQytDLFFBQUwsRUFBZCxDQUFYLENBRlUsQ0FHWjtBQUhZLFFBSVQvQyxJQUpMO0FBS0EsVUFBTTRELEtBQUssR0FBR0gsS0FBSyxDQUFDRyxLQUFwQjtBQUNBLFVBQU10RCxNQUFNLEdBQUdtRCxLQUFLLENBQUNuRCxNQUFyQjs7QUFDQSxVQUFNdUQsT0FBTyxHQUFHLFNBQVZBLE9BQVUsQ0FBQ0MsSUFBRCxFQUFNQyxHQUFOLEVBQVVDLENBQVYsRUFBZ0I7QUFDOUIsWUFBSUYsSUFBSSxLQUFLLENBQUMsQ0FBZCxFQUFpQixPQUFPQSxJQUFQO0FBQ2pCLFlBQUksQ0FBQ0MsR0FBRCxJQUFRLENBQUNBLEdBQUcsQ0FBQy9ELElBQWIsSUFBcUIsQ0FBQytELEdBQUcsQ0FBQy9ELElBQUosQ0FBU0wsS0FBbkMsRUFBMEMsT0FBTyxDQUFDLENBQVI7QUFDMUMsZUFBTyxJQUFJK0QsTUFBSixDQUFXcEQsTUFBWCxFQUFtQnNELEtBQW5CLEVBQTBCSixJQUExQixDQUErQk8sR0FBRyxDQUFDL0QsSUFBSixDQUFTTCxLQUF4QyxJQUFpRHFFLENBQWpELEdBQXFELENBQUMsQ0FBN0Q7QUFDRCxPQUpEOztBQUtBLFVBQU0vQyxLQUFLLEdBQUdxQyxLQUFLLENBQUNXLE1BQU4sQ0FBYUosT0FBYixFQUFzQixDQUFDLENBQXZCLENBQWQ7QUFFQSxhQUFRLENBQUM1QyxLQUFGLEdBQVdxQyxLQUFLLENBQUNyQyxLQUFELENBQWhCLEdBQTBCLElBQWpDO0FBQ0Q7QUFFRDtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztXQUNFLHNCQUFpQztBQUMvQixhQUFPekIsVUFBVSxDQUFDZSxJQUFYLGdCQUF3QixLQUFLMkQsS0FBN0IsU0FBUDtBQUNEO0FBRUQ7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7V0FDRSx5QkFBb0M7QUFDbEMsYUFBTzFFLFVBQVUsQ0FBQ2UsSUFBWCxnQkFBd0IsS0FBSzRELFFBQTdCLFNBQVA7QUFDRDtBQUVEO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztXQUNFLHVCQUNFMUUsZUFERixFQUVjO0FBQ1osVUFBSW1DLElBQUksR0FBRyxJQUFJcEMsVUFBSixFQUFYLENBRFksQ0FHWjtBQUNBO0FBQ0E7QUFDQTs7QUFDQW9DLE1BQUFBLElBQUksQ0FBQy9CLEdBQUwsR0FBVztBQUNUd0IsUUFBQUEsSUFBSSxFQUFFLFVBREc7QUFFVFgsUUFBQUEsV0FBVyxFQUFFLEVBRko7QUFHVDBELFFBQUFBLEdBQUcsRUFBRTtBQUFDQyxVQUFBQSxLQUFLLEVBQUUsQ0FBUjtBQUFXQyxVQUFBQSxHQUFHLEVBQUU7QUFBaEI7QUFISSxPQUFYOztBQU1BLFVBQUk3RSxlQUFKLEVBQXFCO0FBQ25CbUMsUUFBQUEsSUFBSSxDQUFDMkMsaUJBQUwsQ0FBdUI5RSxlQUF2QjtBQUNEOztBQUVELGFBQU9tQyxJQUFQO0FBQ0Q7OztFQTFlQ3JDLE1BQU0sQ0FBQ2lGLFEsRUErS0pqRixNQUFNLENBQUNrRixXLEVBY0FsRixNQUFNLENBQUNrRixXOzs7ZUFnVE5qRixVIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQGZsb3dcbi8vIEBtb2R1bGUgU3ludGF4VHJlZVxuXG5pbXBvcnQgeyB0eXBlT2YgfSBmcm9tICduZS10eXBlcydcbmltcG9ydCB7IHByaW50LCBwYXJzZSB9IGZyb20gJ2dyYXBocWwnXG5pbXBvcnQgeyBtZXJnZSB9IGZyb20gJ2xvZGFzaCdcbmltcG9ydCB7IExhdHRpY2VMb2dzIGFzIGxsIH0gZnJvbSAnLi91dGlscydcblxuaW1wb3J0IHR5cGUgeyBHcmFwaFFMT2JqZWN0VHlwZSB9IGZyb20gJ2dyYXBocWwvdHlwZS9kZWZpbml0aW9uJ1xuaW1wb3J0IHR5cGUge1xuICBPYmplY3RUeXBlRGVmaW5pdGlvbk5vZGUsXG4gIEludGVyZmFjZVR5cGVEZWZpbml0aW9uTm9kZSxcbiAgRW51bVR5cGVEZWZpbml0aW9uTm9kZSxcbiAgVW5pb25UeXBlRGVmaW5pdGlvbk5vZGUsXG4gIEZpZWxkRGVmaW5pdGlvbk5vZGUsXG4gIFR5cGVEZWZpbml0aW9uTm9kZSxcbiAgVHlwZU5vZGVcbn0gZnJvbSAnZ3JhcGhxbC9sYW5ndWFnZS9hc3QnXG5cblxuLy8gU2hvcnRoYW5kIGZvciB0aGUga2V5IHN0b3JpbmcgdGhlIGludGVybmFsIEFTVFxuLy8gQHByb3BcbmNvbnN0IEFTVF9LRVkgPSBTeW1ib2wuZm9yKCdJbnRlcm5hbCBBU1QgU3RvcmFnZSBLZXknKTtcblxuLyoqXG4gKiBBIHBhcnNlciBhbmQgcHJvY2Vzc29yIG9mIEdyYXBoUUwgSURMIEFic3RyYWN0IFN5bnRheCBUcmVlcy4gVXNlZCB0byBjb21iaW5lXG4gKiBhIHNldCBvZiB7QGxpbmsgR1FMQmFzZX0gY2xhc3MgaW5zdGFuY2VzLlxuICpcbiAqIEBjbGFzcyBTeW50YXhUcmVlXG4gKi9cbmV4cG9ydCBjbGFzcyBTeW50YXhUcmVlXG57XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RzIGEgbmV3IGBTeW50YXhUcmVlYCBvYmplY3QuIElmIGEgc3RyaW5nIHNjaGVtYSBpcyBzdXBwbGllZCBvclxuICAgKiBhbiBhbHJlYWR5IHBhcnNlZCBBU1Qgb2JqZWN0LCBlaXRoZXIgb2Ygd2hpY2ggaXMgdmFsaWQgR3JhcGhRTCBJREwsIHRoZW5cbiAgICogaXRzIHBhcnNlZCBBU1Qgd2lsbCBiZSB0aGUgaW50ZXJuYWxzIG9mIHRoaXMgb2JqZWN0LlxuICAgKlxuICAgKiBAY29uc3RydWN0b3JcbiAgICogQG1lbWJlcm9mIFN5bnRheFRyZWVcbiAgICogQG1ldGhvZCDijobioIBjb25zdHJ1Y3RvclxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ3xPYmplY3R8U3ludGF4VHJlZX0gc2NoZW1hT3JBU1RPclNUIGlmIHN1cHBsaWVkIHRoZSB0cmVlXG4gICAqIHdpbGwgYmUgY29uc3RydWN0ZWQgd2l0aCB0aGUgY29udGVudHMgb2YgdGhlIGRhdGEuIElmIGEgc3RyaW5nIG9mIElETCBpc1xuICAgKiBnaXZlbiwgaXQgd2lsbCBiZSBwYXJzZWQuIElmIGFuIEFTVCBpcyBnaXZlbiwgaXQgd2lsbCBiZSB2ZXJpZmllZC4gSWYgYVxuICAgKiBTeW50YXhUcmVlIGlzIHN1cHBsaWVkLCBpdCB3aWxsIGJlIGNvcGllZC5cbiAgICovXG4gIGNvbnN0cnVjdG9yKHNjaGVtYU9yQVNUT3JTVD86IHN0cmluZyB8IE9iamVjdCB8IFN5bnRheFRyZWUpIHtcbiAgICAvLyAkQ29tcHV0ZWRUeXBlXG4gICAgdGhpc1tBU1RfS0VZXSA9IHt9O1xuXG4gICAgaWYgKHNjaGVtYU9yQVNUT3JTVCkge1xuICAgICAgdGhpcy5zZXRBU1Qoc2NoZW1hT3JBU1RPclNUKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIHRoYXQgcmV0cmlldmVzIHRoZSBhYnN0cmFjdCBzeW50YXggdHJlZSBjcmVhdGVkIGJ5IGBncmFwaHFsLnBhcnNlYFxuICAgKiB3aGVuIGl0IGlzIHByZXNlbnRlZCB3aXRoIGEgdmFsaWQgc3RyaW5nIG9mIElETC5cbiAgICpcbiAgICogQGluc3RhbmNlXG4gICAqIEBtZW1iZXJvZiBTeW50YXhUcmVlXG4gICAqIEBtZXRob2Qg4qyH77iO4qCAYXN0XG4gICAqXG4gICAqIEByZXR1cm4ge09iamVjdH0gYSBHcmFwaFFMIEFTVCBvYmplY3RcbiAgICovXG4gIGdldCBhc3QoKTogT2JqZWN0IHtcbiAgICAvLyAkQ29tcHV0ZWRUeXBlXG4gICAgcmV0dXJuIHRoaXNbQVNUX0tFWV07XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIHRoYXQgYXNzaWducyB0aGUgYWJzdHJhY3Qgc3ludGF4IHRyZWUsIHR5cGljYWxseSBjcmVhdGVkIGJ5XG4gICAqIGBncmFwaHFsLnBhcnNlYCB3aGVuIGdpdmVuIGEgdmFsaWQgc3RyaW5nIG9mIElETC5cbiAgICpcbiAgICogQGluc3RhbmNlXG4gICAqIEBtZW1iZXJvZiBTeW50YXhUcmVlXG4gICAqIEBtZXRob2Qg4qyG77iO4qCAYXN0XG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSB2YWx1ZSBhIHZhbGlkIEFTVCBvYmplY3QuIE90aGVyIG9wZXJhdGlvbnMgd2lsbCBhY3RcbiAgICogaW4gYW4gdW5kZWZpbmVkIG1hbm5lciBzaG91bGQgdGhpcyBvYmplY3Qgbm90IGJlIGEgdmFsaWQgQVNUXG4gICAqL1xuICBzZXQgYXN0KHZhbHVlOiBPYmplY3QpOiB2b2lkIHtcbiAgICAvLyAkQ29tcHV0ZWRUeXBlXG4gICAgdGhpc1tBU1RfS0VZXSA9IHZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIHVuZGVybHlpbmcgQVNUIG9iamVjdCB3aXRoIGVpdGhlciBzY2hlbWEgd2hpY2ggd2lsbCBiZSBwYXJzZWRcbiAgICogaW50byBhIHZhbGlkIEFTVCBvciBhbiBleGlzdGluZyBBU1QuIFByZXZpb3VzIGFzdCB2YWx1ZXMgd2lsbCBiZSBlcmFzZWQuXG4gICAqXG4gICAqIEBpbnN0YW5jZVxuICAgKiBAbWVtYmVyb2YgU3ludGF4VHJlZVxuICAgKiBAbWV0aG9kIOKMvuKggHNldEFTVFxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ3xPYmplY3R9IHNjaGVtYU9yQVNUIGEgdmFsaWQgR3JhcGhRTCBJREwgc2NoZW1hIG9yIGFcbiAgICogcHJldmlvc3VseSBwYXJzZWQgb3IgY29tcGF0aWJsZSBHcmFwaFFMIElETCBBU1Qgb2JqZWN0LlxuICAgKiBAcmV0dXJuIHtTeW50YXhUcmVlfSB0aGlzIGZvciBpbmxpbmluZy5cbiAgICovXG4gIHNldEFTVChzY2hlbWFPckFTVE9yU1Q6IHN0cmluZ3xPYmplY3R8U3ludGF4VHJlZSk6IFN5bnRheFRyZWUge1xuICAgIC8vICRDb21wdXRlZFR5cGVcbiAgICB0aGlzW0FTVF9LRVldID0ge307XG5cbiAgICBjb25zdCB0eXBlID0gdHlwZU9mKHNjaGVtYU9yQVNUT3JTVCk7XG4gICAgbGV0IGFzdDogT2JqZWN0O1xuICAgIGxldCBzdDogU3ludGF4VHJlZTtcblxuICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgY2FzZSBTdHJpbmcubmFtZTpcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBhc3QgPSBwYXJzZSgoc2NoZW1hT3JBU1RPclNUOiBhbnkpKTtcblxuICAgICAgICAgIG1lcmdlKHRoaXMuYXN0LCBhc3QpO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChpZ25vcmUpIHsgLyogSWdub3JlIHRoaXMgZXJyb3IgKi8gfVxuXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBPYmplY3QubmFtZTpcbiAgICAgICAgYXN0ID0gKHNjaGVtYU9yQVNUT3JTVDogYW55KTtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgIGFzdCA9IHBhcnNlKHByaW50KGFzdCkpO1xuICAgICAgICAgIG1lcmdlKHRoaXMuYXN0LCBhc3QpO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChpZ25vcmUpIHsgLyogSWdub3JlIHRoaXMgZXJyb3IgKi8gfVxuXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBTeW50YXhUcmVlLm5hbWU6XG4gICAgICAgIHN0ID0gKHNjaGVtYU9yQVNUT3JTVDogYW55KTtcblxuICAgICAgICBtZXJnZSh0aGlzLmFzdCwgc3QuYXN0KTtcblxuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBBcyBwYXNzdGhydSB1cGRhdGUgbWV0aG9kIHRoYXQgd29ya3Mgb24gdGhlIGludGVybmFsIEFTVCBvYmplY3QuIElmXG4gICAqIGFuIGVycm9yIG9jY3VycywgdGhlIHVwZGF0ZSBpcyBza2lwcGVkLiBBbiBlcnJvciBjYW4gb2NjdXIgaWYgYWRkaW5nIHRoZVxuICAgKiBjaGFuZ2VzIHdvdWxkIG1ha2UgdGhlIEFTVCBpbnZhbGlkLiBJbiBzdWNoIGEgY2FzZSwgdGhlIGVycm9yIGlzIGxvZ2dlZFxuICAgKiB0byB0aGUgZXJyb3IgY29uc29sZS5cbiAgICpcbiAgICogQGluc3RhbmNlXG4gICAqIEBtZW1iZXJvZiBTeW50YXhUcmVlXG4gICAqIEBtZXRob2Qg4oy+4qCAdXBkYXRlQVNUXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBhc3QgYW4gZXhpc3RpbmcgR3JhcGhRTCBJREwgQVNUIG9iamVjdCB0aGF0IHdpbGwgYmVcbiAgICogbWVyZ2VkIG9uIHRvcCBvZiB0aGUgZXhpc3RpbmcgdHJlZSB1c2luZyBfLm1lcmdlKClcbiAgICogQHJldHVybiB7U3ludGF4VHJlZX0gdGhpcyBmb3IgaW5saW5pbmcuXG4gICAqL1xuICB1cGRhdGVBU1QoYXN0OiBPYmplY3QpOiBTeW50YXhUcmVlIHtcbiAgICBpZiAodHlwZU9mKGFzdCkgPT09IE9iamVjdC5uYW1lKSB7XG4gICAgICBsZXQgbmV3QVNUID0gbWVyZ2Uoe30sIHRoaXMuYXN0LCBhc3QpO1xuXG4gICAgICB0cnkge1xuICAgICAgICBwcmludChuZXdBU1QpO1xuICAgICAgICB0aGlzLmFzdCA9IG1lcmdlKHRoaXMuYXN0LCBhc3QpO1xuICAgICAgfVxuICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGxsLmVycm9yKCdbU3ludGF4VHJlZV0gRmFpbGVkIHRvIHVwZGF0ZUFTVCB3aXRoICVvJywgYXN0KTtcbiAgICAgICAgbGwuZXJyb3IoJ1Jlc3VsdGluZyBvYmplY3Qgd291bGQgYmUgJW8nLCBuZXdBU1QpO1xuICAgICAgICBsbC5lcnJvcihlcnJvcik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogQXBwZW5kcyBhbGwgZGVmaW5pdGlvbnMgZnJvbSBhbm90aGVyIEFTVCB0byB0aGlzIG9uZS4gVGhlIG1ldGhvZCB3aWxsXG4gICAqIGFjdHVhbGx5IGNyZWF0ZSBhIGNvcHkgdXNpbmcgU3ludGF4VHJlZS5mcm9tKCkgc28gdGhlIGlucHV0IHR5cGVzIGNhblxuICAgKiBiZSBhbnkgb25lIG9mIGEgdmFsaWQgR3JhcGhRTCBJREwgc2NoZW1hIHN0cmluZywgYSBHcmFwaFFMIElETCBBU1Qgb3JcbiAgICogYW5vdGhlciBTeW50YXhUcmVlIG9iamVjdCBpbnN0YW5jZS5cbiAgICpcbiAgICogRGVmaW5pdGlvbnMgb2YgdGhlIHNhbWUgbmFtZSBidXQgZGlmZmVyZW50IGtpbmRzIHdpbGwgYmUgcmVwbGFjZWQgYnkgdGhlXG4gICAqIG5ldyBjb3B5LiBUaG9zZSBvZiB0aGUgc2FtZSBraW5kIGFuZCBuYW1lIHdpbGwgYmUgbWVyZ2VkIChUT0RPIGhhbmRsZSBtb3JlXG4gICAqIHRoYW4gT2JqZWN0VHlwZURlZmluaXRpb24ga2luZHMgd2hlbiBtZXJnaW5nOyBjdXJyZW50bHkgb3RoZXIgdHlwZXMgYXJlXG4gICAqIG92ZXJ3cml0dGVuKS5cbiAgICpcbiAgICogQGluc3RhbmNlXG4gICAqIEBtZW1iZXJvZiBTeW50YXhUcmVlXG4gICAqIEBtZXRob2Qg4oy+4qCAYXBwZW5kRGVmaW5pdGlvbnNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd8T2JqZWN0fFN5bnRheFRyZWV9IHNjaGVtYU9yQVNUT3JTVCBhbiBpbnN0YW5jZSBvZiBvbmUgb2ZcbiAgICogdGhlIHZhbGlkIHR5cGVzIGZvciBTeW50YXhUcmVlLmZyb20oKSB0aGF0IGNhbiBiZSB1c2VkIHRvIGNyZWF0ZSBvclxuICAgKiBkdXBsaWNhdGUgdGhlIHNvdXJjZSBmcm9tIHdoaWNoIHRvIGNvcHkgZGVmaW5pdGlvbnMuXG4gICAqIEByZXR1cm4ge1N5bnRheFRyZWV9IHRoaXMgZm9yIGlubGluaW5nXG4gICAqL1xuICBhcHBlbmREZWZpbml0aW9ucyhzY2hlbWFPckFTVE9yU1Q6IHN0cmluZyB8IE9iamVjdCB8IFN5bnRheFRyZWUpOiBTeW50YXhUcmVlIHtcbiAgICBjb25zdCBzb3VyY2UgPSBTeW50YXhUcmVlLmZyb20oc2NoZW1hT3JBU1RPclNUKTtcbiAgICBjb25zdCBzZXQgPSBuZXcgU2V0KCk7XG5cbiAgICB0aGlzLmFzdC5kZWZpbml0aW9ucy5tYXAoKGRlZmluaXRpb24pID0+IHtcbiAgICAgIHNldC5hZGQoZGVmaW5pdGlvbi5uYW1lLnZhbHVlKTtcbiAgICB9KVxuXG4gICAgaWYgKHNvdXJjZSAmJiBzb3VyY2UuYXN0LmRlZmluaXRpb25zICYmIHRoaXMuYXN0LmRlZmluaXRpb25zKSB7XG4gICAgICBmb3IgKGxldCB0aGVpcnMgb2YgKHNvdXJjZTogYW55KSkge1xuICAgICAgICBsZXQgbmFtZSA9IHRoZWlycy5uYW1lLnZhbHVlO1xuICAgICAgICBsZXQgb3VycyA9IHRoaXMuZmluZChuYW1lKTtcbiAgICAgICAgbGV0IGluZGV4ID0gb3VycyAmJiB0aGlzLmFzdC5kZWZpbml0aW9ucy5pbmRleE9mKG91cnMpIHx8IC0xO1xuXG4gICAgICAgIC8vIFdlIGRvbid0IHlldCBoYXZlIG9uZSB3aXRoIHRoYXQgbmFtZVxuICAgICAgICBpZiAoIXNldC5oYXMobmFtZSkpIHtcbiAgICAgICAgICBzZXQuYWRkKG5hbWUpO1xuICAgICAgICAgIHRoaXMuYXN0LmRlZmluaXRpb25zLnB1c2godGhlaXJzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFdlIGRvIGhhdmUgb25lIHdpdGggdGhhdCBuYW1lXG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIC8vIFRoZSBraW5kcyBhcmVuJ3QgdGhlIHNhbWUsIGp1c3QgcmVwbGFjZSB0aGVpcnMgd2l0aCBvdXJzXG4gICAgICAgICAgaWYgKHRoZWlycy5raW5kICE9PSBvdXJzLmtpbmQpIHtcbiAgICAgICAgICAgIC8vIHJlcGxhY2Ugd2l0aCB0aGUgbmV3IG9uZVxuICAgICAgICAgICAgdGhpcy5hc3QuZGVmaW5pdGlvbnNbaW5kZXhdID0gdGhlaXJzO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIFRoZSBraW5kcyBhcmUgdGhlIHNhbWUsIGxldHMganVzdCBtZXJnZSB0aGVpciBmaWVsZHNcbiAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vIG1lcmdlIHRoZSBwcm9wZXJ0aWVzIG9mIHRoZSBzYW1lIHR5cGVzLlxuICAgICAgICAgICAgc3dpdGNoICh0aGVpcnMua2luZCkge1xuICAgICAgICAgICAgICBjYXNlICdPYmplY3RUeXBlRGVmaW5pdGlvbic6XG4gICAgICAgICAgICAgICAgb3Vycy5pbnRlcmZhY2VzID0gW10uY29uY2F0KG91cnMuaW50ZXJmYWNlcywgdGhlaXJzLmludGVyZmFjZXMpXG4gICAgICAgICAgICAgICAgb3Vycy5kaXJlY3RpdmVzID0gW10uY29uY2F0KG91cnMuZGlyZWN0aXZlcywgdGhlaXJzLmRpcmVjdGl2ZXMpXG4gICAgICAgICAgICAgICAgb3Vycy5maWVsZHMgPSBbXS5jb25jYXQob3Vycy5maWVsZHMsIHRoZWlycy5maWVsZHMpXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgLy8gU2luY2Ugd2UgZG9uJ3Qgc3VwcG9ydCBvdGhlciB0eXBlcyB5ZXQuIExldCdzIHJlcGxhY2VcbiAgICAgICAgICAgICAgICB0aGlzLmFzdC5kZWZpbml0aW9uc1tpbmRleF0gPSB0aGVpcnM7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogVGhpcyBtZXRob2QgZmluZHMgdGhlIFF1ZXJ5IHR5cGUgZGVmaW5pdGlvbnMgaW4gdGhlIHN1cHBsaWVkIEFTVCBvclxuICAgKiBTeW50YXhUcmVlIG9iamVjdHMsIHRha2VzIGl0cyBkZWZpbmVkIGZpZWxkcyBhbmQgYWRkcyBpdCB0byB0aGUgY3VycmVudFxuICAgKiBpbnN0YW5jZXMuIElmIHRoaXMgaW5zdGFuY2UgZG9lcyBub3QgaGF2ZSBhIFF1ZXJ5IHR5cGUgZGVmaW5lZCBidXQgdGhlXG4gICAqIHN1cHBsaWVkIG9iamVjdCBkb2VzLCB0aGVuIHRoZSBzdXBwbGllZCBvbmUgaXMgbW92ZWQgb3Zlci4gSWYgbmVpdGhlclxuICAgKiBoYXMgYSBxdWVyeSBoYW5kbGVyLCB0aGVuIG5vdGhpbmcgaGFwcGVucy5cbiAgICpcbiAgICogTk9URSB0aGlzICpyZW1vdmVzKiB0aGUgUXVlcnkgdHlwZSBkZWZpbml0aW9uIGZyb20gdGhlIHN1cHBsaWVkIEFTVCBvclxuICAgKiBTeW50YXhUcmVlIG9iamVjdC5cbiAgICpcbiAgICogQGluc3RhbmNlXG4gICAqIEBtZW1iZXJvZiBTeW50YXhUcmVlXG4gICAqIEBtZXRob2Qg4oy+4qCAY29uc3VtZURlZmluaXRpb25cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R8U3ludGF4VHJlZX0gYXN0T3JTeW50YXhUcmVlIGEgdmFsaWQgR3JhcGhRTCBJREwgQVNUIG9yXG4gICAqIGFuIGluc3RhbmNlIG9mIFN5bnRheFRyZWUgdGhhdCByZXByZXNlbnRzIG9uZS5cbiAgICogQHBhcmFtIHtzdHJpbmd8UmVnRXhwfSBkZWZpbml0aW9uVHlwZSBhIHZhbGlkIHNlYXJjaCBpbnB1dCBhcyB3b3VsZCBiZVxuICAgKiBhY2NlcHRlZCBmb3IgdGhlICNmaW5kKCkgbWV0aG9kIG9mIHRoaXMgb2JqZWN0LlxuICAgKiBAcmV0dXJuIHtTeW50YXhUcmVlfSByZXR1cm5zIHRoaXMgZm9yIGlubGluaW5nXG4gICAqL1xuICBjb25zdW1lRGVmaW5pdGlvbihcbiAgICBhc3RPclN5bnRheFRyZWU6IE9iamVjdCB8IFN5bnRheFRyZWUsXG4gICAgZGVmaW5pdGlvblR5cGU6IHN0cmluZyB8IFJlZ0V4cCA9IFwiUXVlcnlcIlxuICApOiBTeW50YXhUcmVlIHtcbiAgICBpZiAoIWFzdE9yU3ludGF4VHJlZSB8fCAhdGhpcy5hc3QgfHwgIXRoaXMuYXN0LmRlZmluaXRpb25zKSB7IHJldHVybiB0aGlzIH1cblxuICAgIGNvbnN0IHRyZWUgPSB0eXBlT2YoU3ludGF4VHJlZSkgPT09IFN5bnRheFRyZWUubmFtZVxuICAgICAgPyBhc3RPclN5bnRheFRyZWVcbiAgICAgIDogU3ludGF4VHJlZS5mcm9tKGFzdE9yU3ludGF4VHJlZSk7XG4gICAgbGV0IGxlZnQgPSB0aGlzLmZpbmQoZGVmaW5pdGlvblR5cGUpO1xuICAgIGxldCByaWdodCA9IHRyZWUgJiYgdHJlZS5maW5kKGRlZmluaXRpb25UeXBlKSB8fCBudWxsO1xuXG4gICAgaWYgKCF0cmVlKSB7XG4gICAgICBsbC5lcnJvcignVGhlcmUgc2VlbXMgdG8gYmUgc29tZXRoaW5nIHdyb25nIHdpdGggeW91ciB0cmVlJylcbiAgICAgIGxsLmVycm9yKG5ldyBFcnJvcignTWlzc2luZyB0cmVlOyBjb250aW51aW5nLi4uJykpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgaWYgKCFyaWdodCkgeyByZXR1cm4gdGhpcyB9XG5cbiAgICBpZiAoIWxlZnQpIHtcbiAgICAgIHRoaXMuYXN0LmRlZmluaXRpb25zLnB1c2gocmlnaHQpO1xuXG4gICAgICAvLyBSZW1vdmUgdGhlIGNvcGllZCBkZWZpbml0aW9uIGZyb20gdGhlIHNvdXJjZVxuICAgICAgdHJlZS5hc3QuZGVmaW5pdGlvbnMuc3BsaWNlKHRyZWUuYXN0LmRlZmluaXRpb25zLmluZGV4T2YocmlnaHQpLCAxKTtcblxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLy8gVE9ETyBzdXBwb3J0IG90aGVyIHR5cGVzIGFzaWRlIGZyb20gT2JqZWN0VHlwZURlZmluaXRpb25zXG4gICAgLy8gVE9ETyBzZWUgaWYgdGhlcmUgaXMgYSBiZXR0ZXIgd2F5IHRvIGFjaGlldmUgdGhpcyB3aXRoIGJ1aWx0LWluXG4gICAgLy8gZ3JhcGhxbCBjb2RlIHNvbWVwbGFjZVxuICAgIHN3aXRjaChsZWZ0LmtpbmQpIHtcbiAgICAgIGNhc2UgJ09iamVjdFR5cGVEZWZpbml0aW9uJzpcbiAgICAgICAgaWYgKGxlZnQuaW50ZXJmYWNlcyAmJiByaWdodC5pbnRlcmZhY2VzKSB7XG4gICAgICAgICAgbGVmdC5pbnRlcmZhY2VzID0gW10uY29uY2F0KGxlZnQuaW50ZXJmYWNlcywgcmlnaHQuaW50ZXJmYWNlcyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobGVmdC5kaXJlY3RpdmVzICYmIHJpZ2h0LmRpcmVjdGl2ZXMpIHtcbiAgICAgICAgICBsZWZ0LmRpcmVjdGl2ZXMgPSBbXS5jb25jYXQobGVmdC5kaXJlY3RpdmVzLCByaWdodC5kaXJlY3RpdmVzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChsZWZ0LmZpZWxkcyAmJiByaWdodC5maWVsZHMpIHtcbiAgICAgICAgICBsZWZ0LmZpZWxkcyA9IFtdLmNvbmNhdChsZWZ0LmZpZWxkcywgcmlnaHQuZmllbGRzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgLy8gUmVtb3ZlIHRoZSBjb3BpZWQgZGVmaW5pdGlvbiBmcm9tIHRoZSBzb3VyY2VcbiAgICB0cmVlLmFzdC5kZWZpbml0aW9ucy5zcGxpY2UodHJlZS5hc3QuZGVmaW5pdGlvbnMuaW5kZXhPZihyaWdodCksIDEpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogV2hlbiBpdGVyYXRpbmcgb3ZlciBhbiBpbnN0YW5jZSBvZiBTeW50YXhUcmVlLCB5b3UgYXJlIGFjdHVhbGx5XG4gICAqIGl0ZXJhdGluZyBvdmVyIHRoZSBkZWZpbml0aW9ucyBvZiB0aGUgU3ludGF4VHJlZSBpZiB0aGVyZSBhcmUgYW55O1xuICAgKlxuICAgKiBAaW5zdGFuY2VcbiAgICogQG1lbWJlcm9mIFN5bnRheFRyZWVcbiAgICogQG1ldGhvZCAqW1N5bWJvbC5pdGVyYXRvcl1cbiAgICpcbiAgICogQHJldHVybiB7VHlwZURlZmluaXRpb25Ob2RlfSBhbiBpbnN0YW5jZSBvZiBhIFR5cGVEZWZpbml0aW9uTm9kZTsgc2VlXG4gICAqIGdyYXBocWwvbGFuZ3VhZ2UvYXN0LmpzLmZsb3cgZm9yIG1vcmUgaW5mb3JtYXRpb25cbiAgICogQENvbXB1dGVkVHlwZVxuICAgKi9cbiAgKltTeW1ib2wuaXRlcmF0b3JdKCk6IFR5cGVEZWZpbml0aW9uTm9kZSB7XG4gICAgaWYgKHRoaXNbQVNUX0tFWV0uZGVmaW5pdGlvbnMpIHtcbiAgICAgIHJldHVybiB5aWVsZCogdGhpc1tBU1RfS0VZXS5kZWZpbml0aW9ucztcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICByZXR1cm4geWllbGQqIHRoaXM7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciB0aGF0IGJ1aWxkcyBhIHNtYWxsIG91dGxpbmUgb2JqZWN0IGRlbm90aW5nIHRoZSBzY2hlbWEgYmVpbmdcbiAgICogcHJvY2Vzc2VkLiBJZiB5b3UgaGF2ZSBhIHNjaGVtYSB0aGF0IGxvb2tzIGxpa2UgdGhlIGZvbGxvd2luZzpcbiAgICpcbiAgICogYGBgamF2YXNjcmlwdFxuICAgKiBsZXQgc3QgPSBTeW50YXhUcmVlLmZyb20oYFxuICAgKiAgIHR5cGUgQ29udHJpdmVkIHtcbiAgICogICAgIG5hbWU6IFN0cmluZ1xuICAgKiAgICAgYWdlOiBJbnRcbiAgICogICB9XG4gICAqXG4gICAqICAgdHlwZSBRdWVyeSB7XG4gICAqICAgICBnZXRDb250cml2ZWQ6IENvbnRyaXZlZFxuICAgKiAgIH1cbiAgICogYClcbiAgICogbGV0IG91dGxpbmUgPSBzdC5vdXRsaW5lXG4gICAqIGBgYFxuICAgKlxuICAgKiBZb3Ugd2lsbCBlbmQgdXAgd2l0aCBhbiBvYmplY3QgdGhhdCBsb29rcyBsaWtlIHRoZSBmb2xsb3dpbmc6XG4gICAqXG4gICAqIGBgYGphdmFzY3JpcHRcbiAgICoge1xuICAgKiAgIENvbnRyaXZlZDogeyBuYW1lOiAnU3RyaW5nJywgYWdlOiAnSW50JyB9LFxuICAgKiAgIFF1ZXJ5OiB7IGdldENvbnRyaXZlZDogJ0NvbnRyaXZlZCcgfVxuICAgKiB9XG4gICAqIGBgYFxuICAgKlxuICAgKiBBcyBtYXkgYmUgZXZpZGVuY2VkIGJ5IHRoZSBleGFtcGxlIGFib3ZlLCB0aGUgbmFtZSBvZiB0aGUgdHlwZSBpc1xuICAgKiByZXByZXNlbnRlZCBieSBhbiBvYmplY3Qgd2hlcmUgdGhlIG5hbWUgb2YgZWFjaCBmaWVsZCAoc2FucyBhcmd1bWVudHMpXG4gICAqIGlzIG1hcHBlZCB0byBhIHN0cmluZyBkZW5vdGluZyB0aGUgdHlwZS5cbiAgICovXG4gIGdldCBvdXRsaW5lKCk6IE9iamVjdCB7XG4gICAgbGV0IG91dGxpbmUgPSB7fVxuICAgIGxldCBpbnRlcmZhY2VzID0gU3ltYm9sLmZvcignaW50ZXJmYWNlcycpXG5cbiAgICAvLyAkRmxvd0ZpeE1lXG4gICAgZm9yIChsZXQgZGVmaW5pdGlvbiBvZiB0aGlzKSB7XG4gICAgICBsZXQgb3V0XG5cbiAgICAgIHN3aXRjaCAoZGVmaW5pdGlvbi5raW5kKSB7XG4gICAgICAgIGNhc2UgJ0ludGVyZmFjZVR5cGVEZWZpbml0aW9uJzpcbiAgICAgICAgY2FzZSAnT2JqZWN0VHlwZURlZmluaXRpb24nOlxuICAgICAgICAgIG91dCA9IG91dGxpbmVbZGVmaW5pdGlvbi5uYW1lLnZhbHVlXSA9IHt9XG4gICAgICAgICAgZGVmaW5pdGlvbi5maWVsZHMuZm9yRWFjaChcbiAgICAgICAgICAgIGZpZWxkID0+IHtcbiAgICAgICAgICAgICAgaWYgKGZpZWxkLnR5cGUua2luZCA9PT0gJ05hbWVkVHlwZScpXG4gICAgICAgICAgICAgICAgb3V0W2ZpZWxkLm5hbWUudmFsdWVdID0gZmllbGQudHlwZS5uYW1lLnZhbHVlXG4gICAgICAgICAgICAgIGVsc2UgaWYgKGZpZWxkLnR5cGUua2luZCA9PT0gJ0xpc3RUeXBlJylcbiAgICAgICAgICAgICAgICBvdXRbZmllbGQubmFtZS52YWx1ZV0gPSBmaWVsZC50eXBlLnR5cGUubmFtZS52YWx1ZVxuICAgICAgICAgICAgfVxuICAgICAgICAgIClcblxuICAgICAgICAgIGlmIChkZWZpbml0aW9uLmludGVyZmFjZXMpIHtcbiAgICAgICAgICAgIC8vICRGbG93Rml4TWVcbiAgICAgICAgICAgIG91dCA9IChvdXRbaW50ZXJmYWNlc10gPSBvdXRbaW50ZXJmYWNlc10gfHwgW10pXG5cbiAgICAgICAgICAgIGRlZmluaXRpb24uaW50ZXJmYWNlcy5mb3JFYWNoKFxuICAgICAgICAgICAgICBfaW50ZXJmYWNlID0+IG91dC5wdXNoKF9pbnRlcmZhY2UubmFtZS52YWx1ZSlcbiAgICAgICAgICAgIClcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlICdFbnVtVHlwZURlZmluaXRpb24nOlxuICAgICAgICAgIG91dCA9IG91dGxpbmVbZGVmaW5pdGlvbi5uYW1lLnZhbHVlXSA9IFtdXG4gICAgICAgICAgZGVmaW5pdGlvbi52YWx1ZXMuZm9yRWFjaChcbiAgICAgICAgICAgIHZhbHVlID0+IG91dFt2YWx1ZS5uYW1lLnZhbHVlXSA9IHZhbHVlLm5hbWUudmFsdWVcbiAgICAgICAgICApXG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSAnVW5pb25UeXBlRGVmaW5pdGlvbic6XG4gICAgICAgICAgb3V0ID0gb3V0bGluZVtkZWZpbml0aW9uLm5hbWUudmFsdWVdID0gW11cbiAgICAgICAgICBkZWZpbml0aW9uLnR5cGVzLmZvckVhY2goXG4gICAgICAgICAgICB0eXBlID0+IG91dC5wdXNoKHR5cGUubmFtZS52YWx1ZSlcbiAgICAgICAgICApXG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG91dGxpbmVcbiAgfVxuXG4gIC8qKlxuICAgKiBJdGVyYXRlIHRocm91Z2ggdGhlIGRlZmluaXRpb25zIG9mIHRoZSBBU1QgaWYgdGhlcmUgYXJlIGFueS4gRm9yIGVhY2hcbiAgICogZGVmaW5pdGlvbiB0aGUgbmFtZSBwcm9wZXJ0eSdzIHZhbHVlIGZpZWxkIGlzIGNvbXBhcmVkIHRvIHRoZSBzdXBwbGllZFxuICAgKiBkZWZpbml0aW9uTmFtZS4gVGhlIGRlZmluaXRpb25OYW1lIGNhbiBiZSBhIHN0cmluZyBvciBhIHJlZ3VsYXJcbiAgICogZXhwcmVzc2lvbiBpZiBmaW5lciBncmFudWxhcml0eSBpcyBkZXNpcmVkLlxuICAgKlxuICAgKiBAaW5zdGFuY2VcbiAgICogQG1lbWJlcm9mIFN5bnRheFRyZWVcbiAgICogQG1ldGhvZCDijL7ioIBmaW5kXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfFJlZ0V4cH0gZGVmaW5pdGlvbk5hbWUgYSBzdHJpbmcgb3IgcmVndWxhciBleHByZXNzaW9uIHVzZWRcbiAgICogdG8gbWF0Y2ggYWdhaW5zdCB0aGUgZGVmaW5pdGlvbiBuYW1lIGZpZWxkIGluIGEgZ2l2ZW4gQVNULlxuICAgKiBAcmV0dXJuIHtPYmplY3R8bnVsbH0gYSByZWZlcmVuY2UgdG8gdGhlIGludGVybmFsIGRlZmluaXRpb24gZmllbGQgb3JcbiAgICogbnVsbCBpZiBvbmUgd2l0aCBhIG1hdGNoaW5nIG5hbWUgY291bGQgbm90IGJlIGZvdW5kLlxuICAgKi9cbiAgZmluZChkZWZpbml0aW9uTmFtZTogc3RyaW5nfFJlZ0V4cCk6IE9iamVjdCB8IG51bGwge1xuICAgIC8vICRDb21wdXRlZFR5cGVcbiAgICByZXR1cm4gU3ludGF4VHJlZS5maW5kRGVmaW5pdGlvbih0aGlzW0FTVF9LRVldLCBkZWZpbml0aW9uTmFtZSk7XG4gIH1cblxuICAvKipcbiAgICogU3ludGF4VHJlZSBpbnN0YW5jZXMgdGhhdCBhcmUgdG9TdHJpbmcoKSdlZCB3aWxsIGhhdmUgdGhlIGdyYXBocWwgbWV0aG9kXG4gICAqIHByaW50KCkgY2FsbGVkIG9uIHRoZW0gdG8gY29udmVydCB0aGVpciBpbnRlcm5hbCBzdHJ1Y3R1cmVzIGJhY2sgdG8gYVxuICAgKiBHcmFwaFFMIElETCBzY2hlbWEgc3ludGF4LiBJZiB0aGUgb2JqZWN0IGlzIGluIGFuIGludmFsaWQgc3RhdGUsIGl0IFdJTExcbiAgICogdGhyb3cgYW4gZXJyb3IuXG4gICAqXG4gICAqIEBpbnN0YW5jZVxuICAgKiBAbWVtYmVyb2YgU3ludGF4VHJlZVxuICAgKiBAbWV0aG9kIOKMvuKggHRvU3RyaW5nXG4gICAqXG4gICAqIEByZXR1cm4ge3N0cmluZ30gdGhlIEFTVCBmb3IgdGhlIHRyZWUgcGFyc2VkIGJhY2sgaW50byBhIHN0cmluZ1xuICAgKi9cbiAgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAvLyAkQ29tcHV0ZWRUeXBlXG4gICAgcmV0dXJuIHByaW50KHRoaXNbQVNUX0tFWV0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEEgcnVudGltZSBjb25zdGFudCBkZW5vdGluZyBhIHF1ZXJ5IHR5cGUuXG4gICAqXG4gICAqIEB0eXBlIHtzdHJpbmd9XG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlcm9mIFN5bnRheFRyZWVcbiAgICogQG1ldGhvZCDirIfvuI7ioIBRVUVSWVxuICAgKiBAcmVhZG9ubHlcbiAgICogQGNvbnN0XG4gICAqL1xuICBzdGF0aWMgZ2V0IFFVRVJZKCk6IHN0cmluZyB7IHJldHVybiAnUXVlcnknIH1cblxuICAvKipcbiAgICogQSBydW50aW1lIGNvbnN0YW50IGRlbm90aW5nIGEgbXV0YXRpb24gdHlwZS5cbiAgICpcbiAgICogQHR5cGUge3N0cmluZ31cbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyb2YgU3ludGF4VHJlZVxuICAgKiBAbWV0aG9kIOKsh++4juKggE1VVEFUSU9OXG4gICAqIEByZWFkb25seVxuICAgKiBAY29uc3RcbiAgICovXG4gIHN0YXRpYyBnZXQgTVVUQVRJT04oKTogc3RyaW5nIHsgcmV0dXJuICdNdXRhdGlvbicgfVxuXG4gICAgLyoqXG4gICAqIEEgcnVudGltZSBjb25zdGFudCBkZW5vdGluZyBhIHN1YnNjcmlwdGlvbiB0eXBlLlxuICAgKlxuICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJvZiBTeW50YXhUcmVlXG4gICAqIEBtZXRob2QgU1VCU0NSSVBUSU9OXG4gICAqIEByZWFkb25seVxuICAgKiBAY29uc3RcbiAgICovXG4gIHN0YXRpYyBnZXQgU1VCU0NSSVBUSU9OKCk6IHN0cmluZyB7IHJldHVybiAnU3Vic2NyaXB0aW9uJyB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGBjb25zdHJ1Y3RvcmAgbmFtZS4gSWYgaW52b2tlZCBhcyB0aGUgY29udGV4dCwgb3IgYHRoaXNgLFxuICAgKiBvYmplY3Qgb2YgdGhlIGB0b1N0cmluZ2AgbWV0aG9kIG9mIGBPYmplY3RgJ3MgYHByb3RvdHlwZWAsIHRoZSByZXN1bHRpbmdcbiAgICogdmFsdWUgd2lsbCBiZSBgW29iamVjdCBNeUNsYXNzXWAsIGdpdmVuIGFuIGluc3RhbmNlIG9mIGBNeUNsYXNzYFxuICAgKlxuICAgKiBAbWV0aG9kIOKMvuKggFtTeW1ib2wudG9TdHJpbmdUYWddXG4gICAqIEBtZW1iZXJvZiBTeW50YXhUcmVlXG4gICAqXG4gICAqIEByZXR1cm4ge3N0cmluZ30gdGhlIG5hbWUgb2YgdGhlIGNsYXNzIHRoaXMgaXMgYW4gaW5zdGFuY2Ugb2ZcbiAgICogQENvbXB1dGVkVHlwZVxuICAgKi9cbiAgZ2V0IFtTeW1ib2wudG9TdHJpbmdUYWddKCkgeyByZXR1cm4gdGhpcy5jb25zdHJ1Y3Rvci5uYW1lIH1cblxuICAvKipcbiAgICogQXBwbGllcyB0aGUgc2FtZSBsb2dpYyBhcyB7QGxpbmsgI1tTeW1ib2wudG9TdHJpbmdUYWddfSBidXQgb24gYSBzdGF0aWNcbiAgICogc2NhbGUuIFNvLCBpZiB5b3UgcGVyZm9ybSBgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKE15Q2xhc3MpYFxuICAgKiB0aGUgcmVzdWx0IHdvdWxkIGJlIGBbb2JqZWN0IE15Q2xhc3NdYC5cbiAgICpcbiAgICogQG1ldGhvZCDijL7ioIBbU3ltYm9sLnRvU3RyaW5nVGFnXVxuICAgKiBAbWVtYmVyb2YgU3ludGF4VHJlZVxuICAgKiBAc3RhdGljXG4gICAqXG4gICAqIEByZXR1cm4ge3N0cmluZ30gdGhlIG5hbWUgb2YgdGhpcyBjbGFzc1xuICAgKiBAQ29tcHV0ZWRUeXBlXG4gICAqL1xuICBzdGF0aWMgZ2V0IFtTeW1ib2wudG9TdHJpbmdUYWddKCkgeyByZXR1cm4gdGhpcy5uYW1lIH1cblxuICAvKipcbiAgICogR2l2ZW4gb25lIG9mLCBhIHZhbGlkIEdyYXBoUUwgSURMIHNjaGVtYSBzdHJpbmcsIGEgdmFsaWQgR3JhcGhRTCBBU1Qgb3JcbiAgICogYW4gaW5zdGFuY2Ugb2YgU3ludGF4VHJlZSwgdGhlIHN0YXRpYyBmcm9tKCkgbWV0aG9kIHdpbGwgY3JlYXRlIGEgbmV3XG4gICAqIGluc3RhbmNlIG9mIHRoZSBTeW50YXhUcmVlIHdpdGggdGhlIHZhbHVlcyB5b3UgcHJvdmlkZS5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyb2YgU3ludGF4VHJlZVxuICAgKiBAbWV0aG9kIOKMvuKggGZyb21cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd8T2JqZWN0fFN5bnRheFRyZWV9IG1peGVkIGFuIGluc3RhbmNlIG9mIG9uZSBvZiB0aGUgdmFsaWRcbiAgICogdHlwZXMgc3BlY2lmaWVkIGFib3ZlLiBFdmVyeXRoaW5nIGVsc2Ugd2lsbCByZXN1bHQgaW4gYSBudWxsIHZhbHVlLlxuICAgKiBAcmV0dXJuIHtTeW50YXhUcmVlfSBhIG5ld2x5IGNyZWF0ZWQgYW5kIHBvcHVsYXRlZCBpbnN0YW5jZSBvZiBTeW50YXhUcmVlXG4gICAqIG9yIG51bGwgaWYgYW4gaW52YWxpZCB0eXBlIHdhcyBzdXBwbGllZCBmb3IgbWl4ZWQuXG4gICAqL1xuICBzdGF0aWMgZnJvbShtaXhlZDogc3RyaW5nIHwgT2JqZWN0IHwgU3ludGF4VHJlZSk6IFN5bnRheFRyZWUgfCBudWxsIHtcbiAgICBsZXQgc2NoZW1hOiBzdHJpbmc7XG4gICAgbGV0IGFzdDogT2JqZWN0O1xuXG4gICAgc3dpdGNoICh0eXBlT2YobWl4ZWQpKSB7XG4gICAgICBjYXNlIFN0cmluZy5uYW1lOlxuICAgICAgICBzY2hlbWEgPSAobWl4ZWQ6IGFueSk7XG4gICAgICAgIHRyeSB7IHBhcnNlKHNjaGVtYSkgfSBjYXRjaChlcnJvcikgeyBsbC5lcnJvcihlcnJvcik7IHJldHVybiBudWxsOyB9XG5cbiAgICAgICAgcmV0dXJuIFN5bnRheFRyZWUuZnJvbVNjaGVtYShTdHJpbmcoc2NoZW1hKSk7XG4gICAgICBjYXNlIE9iamVjdC5uYW1lOlxuICAgICAgICBhc3QgPSAobWl4ZWQ6IGFueSk7XG4gICAgICAgIHRyeSB7IHByaW50KGFzdCkgfSBjYXRjaChlcnJvcikgeyByZXR1cm4gbnVsbDsgfVxuXG4gICAgICAgIHJldHVybiBTeW50YXhUcmVlLmZyb21BU1QoYXN0KTtcbiAgICAgIGNhc2UgU3ludGF4VHJlZS5uYW1lOlxuICAgICAgICBzY2hlbWEgPSBtaXhlZC50b1N0cmluZygpO1xuXG4gICAgICAgIHJldHVybiBTeW50YXhUcmVlLmZyb20oc2NoZW1hKTtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZW5lcmF0ZXMgYSBuZXcgaW5zdGFuY2Ugb2YgU3ludGF4VHJlZSBmcm9tIHRoZSBzdXBwbGllZCwgdmFsaWQsIEdyYXBoUUxcbiAgICogc2NoZW1hLiBUaGlzIG1ldGhvZCBkb2VzIG5vdCBwZXJmb3JtIHRyeS9jYXRjaCB2YWxpZGF0aW9uIGFuZCBpZiBhblxuICAgKiBpbnZhbGlkIEdyYXBoUUwgc2NoZW1hIGlzIHN1cHBsaWVkIGFuIGVycm9yIHdpbGwgYmUgdGhyb3duLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJvZiBTeW50YXhUcmVlXG4gICAqIEBtZXRob2Qg4oy+4qCAZnJvbVNjaGVtYVxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gc2NoZW1hIGEgdmFsaWQgR3JhcGhRTCBJREwgc2NoZW1hIHN0cmluZy5cbiAgICogQHJldHVybiB7U3ludGF4VHJlZX0gYSBuZXcgaW5zdGFuY2Ugb2YgU3ludGF4VHJlZSBpbml0aWFsaXplZCB3aXRoIGFcbiAgICogcGFyc2VkIHJlc3BvbnNlIGZyb20gcmVxdWlyZSgnZ3JhcGhxbCcpLnBhcnNlKCkuXG4gICAqL1xuICBzdGF0aWMgZnJvbVNjaGVtYShzY2hlbWE6IHN0cmluZyk6IFN5bnRheFRyZWUge1xuICAgIGNvbnN0IGFzdCA9IHBhcnNlKHNjaGVtYSk7XG4gICAgbGV0IHRyZWUgPSBuZXcgU3ludGF4VHJlZShhc3QpO1xuXG4gICAgcmV0dXJuIHRyZWU7XG4gIH1cblxuICAvKipcbiAgICogR2VuZXJhdGVzIGEgbmV3IGluc3RhbmNlIG9mIFN5bnRheFRyZWUgZnJvbSB0aGUgc3VwcGxpZWQsIHZhbGlkLCBHcmFwaFFMXG4gICAqIHNjaGVtYS4gVGhpcyBtZXRob2QgZG9lcyBub3QgcGVyZm9ybSB0cnkvY2F0Y2ggdmFsaWRhdGlvbiBhbmQgaWYgYW5cbiAgICogaW52YWxpZCBHcmFwaFFMIHNjaGVtYSBpcyBzdXBwbGllZCBhbiBlcnJvciB3aWxsIGJlIHRocm93bi5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyb2YgU3ludGF4VHJlZVxuICAgKiBAbWV0aG9kIOKMvuKggGZyb21BU1RcbiAgICpcbiAgICogQHBhcmFtIHtvYmplY3R9IGFzdCBhIHZhbGlkIEdyYXBoUUwgQVNUIG9iamVjdC5cbiAgICogQHJldHVybiB7U3ludGF4VHJlZX0gYSBuZXcgaW5zdGFuY2Ugb2YgU3ludGF4VHJlZSBpbml0aWFsaXplZCB3aXRoIGFcbiAgICogc3VwcGxpZWQgYWJzdHJhY3Qgc3ludGF4IHRyZWUgZ2VuZXJhdGVkIGJ5IHJlcXVpcmUoJ2dyYXBocWwnKS5wYXJzZSgpIG9yXG4gICAqIG90aGVyIGNvbXBhdGlibGUgbWV0aG9kLlxuICAgKi9cbiAgc3RhdGljIGZyb21BU1QoYXN0OiBPYmplY3QpOiBTeW50YXhUcmVlIHwgbnVsbCB7XG4gICAgY29uc3Qgc291cmNlID0gcGFyc2UocHJpbnQoYXN0KSk7XG4gICAgbGV0IHRyZWUgPSBuZXcgU3ludGF4VHJlZShzb3VyY2UpO1xuXG4gICAgcmV0dXJuIHNvdXJjZSA/IHRyZWUgOiBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIEl0ZXJhdGUgdGhyb3VnaCB0aGUgZGVmaW5pdGlvbnMgb2YgdGhlIEFTVCBpZiB0aGVyZSBhcmUgYW55LiBGb3IgZWFjaFxuICAgKiBkZWZpbml0aW9uIHRoZSBuYW1lIHByb3BlcnR5J3MgdmFsdWUgZmllbGQgaXMgY29tcGFyZWQgdG8gdGhlIHN1cHBsaWVkXG4gICAqIGRlZmluaXRpb25OYW1lLiBUaGUgZGVmaW5pdGlvbk5hbWUgY2FuIGJlIGEgc3RyaW5nIG9yIGEgcmVndWxhclxuICAgKiBleHByZXNzaW9uIGlmIGZpbmVyIGdyYW51bGFyaXR5IGlzIGRlc2lyZWQuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlcm9mIFN5bnRheFRyZWVcbiAgICogQG1ldGhvZCDijL7ioIBmaW5kRGVmaW5pdGlvblxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gYXN0IGFuIGFic3RyYWN0IHN5bnRheCB0cmVlIG9iamVjdCBjcmVhdGVkIGZyb20gYSBHUUwgU0RMXG4gICAqIEBwYXJhbSB7c3RyaW5nfFJlZ0V4cH0gZGVmaW5pdGlvbk5hbWUgYSBzdHJpbmcgb3IgcmVndWxhciBleHByZXNzaW9uIHVzZWRcbiAgICogdG8gbWF0Y2ggYWdhaW5zdCB0aGUgZGVmaW5pdGlvbiBuYW1lIGZpZWxkIGluIGEgZ2l2ZW4gQVNULlxuICAgKiBAcmV0dXJuIHtPYmplY3R8bnVsbH0gYSByZWZlcmVuY2UgdG8gdGhlIGludGVybmFsIGRlZmluaXRpb24gZmllbGQgb3JcbiAgICogbnVsbCBpZiBvbmUgd2l0aCBhIG1hdGNoaW5nIG5hbWUgY291bGQgbm90IGJlIGZvdW5kLlxuICAgKi9cbiAgc3RhdGljIGZpbmREZWZpbml0aW9uKGFzdDogT2JqZWN0LCBkZWZpbml0aW9uTmFtZTogc3RyaW5nIHwgUmVnRXhwKSB7XG4gICAgcmV0dXJuIHRoaXMuZmluZEluQVNUQXJyYXlCeU5hbWVWYWx1ZShcbiAgICAgIGFzdC5kZWZpbml0aW9ucyxcbiAgICAgIGRlZmluaXRpb25OYW1lXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJdGVyYXRlIHRocm91Z2ggdGhlIGZpZWxkcyBvZiBhIGRlZmluaXRpb24gQVNUIGlmIHRoZXJlIGFyZSBhbnkuIEZvciBlYWNoXG4gICAqIGZpZWxkLCB0aGUgbmFtZSBwcm9wZXJ0eSdzIHZhbHVlIGZpZWxkIGlzIGNvbXBhcmVkIHRvIHRoZSBzdXBwbGllZFxuICAgKiBmaWVsZE5hbWUuIFRoZSBmaWVsZE5hbWUgY2FuIGJlIGEgc3RyaW5nIG9yIGEgcmVndWxhciBleHByZXNzaW9uIGlmXG4gICAqIGZpbmVyIGdyYW51bGFyaXR5IGlzIGRlc2lyZWQuXG4gICAqXG4gICAqIEJlZm9yZSBpdGVyYXRpbmcgb3ZlciB0aGUgZmllbGRzLCBob3dldmVyLCB0aGUgZGVmaW5pdGlvbiBpcyBmb3VuZCB1c2luZ1xuICAgKiBgU3ludGF4VHJlZSNmaW5kRGVmaW5pdGlvbmAuIElmIGVpdGhlciB0aGUgZmllbGQgb3IgZGVmaW5pdGlvbiBhcmUgbm90XG4gICAqIGZvdW5kLCBudWxsIGlzIHJldHVybmVkLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJvZiBTeW50YXhUcmVlXG4gICAqIEBtZXRob2Qg4oy+4qCAZmluZEZpZWxkXG4gICAqIEBzaW5jZSAyLjcuMFxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gYXN0IGFuIGFic3RyYWN0IHN5bnRheCB0cmVlIG9iamVjdCBjcmVhdGVkIGZyb20gYSBHUUwgU0RMXG4gICAqIEBwYXJhbSB7c3RyaW5nfFJlZ0V4cH0gZGVmaW5pdGlvbk5hbWUgYSBzdHJpbmcgb3IgcmVndWxhciBleHByZXNzaW9uIHVzZWRcbiAgICogdG8gbWF0Y2ggYWdhaW5zdCB0aGUgZGVmaW5pdGlvbiBuYW1lIGZpZWxkIGluIGEgZ2l2ZW4gQVNULlxuICAgKiBAcGFyYW0ge3N0cmluZ3xSZWdFeHB9IGZpZWxkTmFtZSBhIHN0cmluZyBvciByZWd1bGFyIGV4cHJlc3Npb24gdXNlZFxuICAgKiB0byBtYXRjaCBhZ2FpbnN0IHRoZSBmaWVsZCBuYW1lIGZpZWxkIGluIGEgZ2l2ZW4gQVNULlxuICAgKiBAcmV0dXJuIHtPYmplY3R8bnVsbH0gYW4gb2JqZWN0IGNvbnRhaW5pbmcgdHdvIGtleXMsIHRoZSBmaXJzdCBiZWluZ1xuICAgKiBgZmllbGRgIHdoaWNoIHBvaW50cyB0byB0aGUgcmVxdWVzdGVkIEFTVCBkZWZpbml0aW9uIGZpZWxkLiBUaGUgc2Vjb25kXG4gICAqIGJlaW5nIGBtZXRhYCB3aGljaCBjb250YWlucyB0aHJlZSBjb21tb25seSByZXF1ZXN0ZWQgYml0cyBvZiBkYXRhOyBgbmFtZWAsXG4gICAqIGB0eXBlYCBhbmQgYG51bGxhYmxlYC4gTm9uLW51bGxhYmxlIGZpZWxkcyBoYXZlIHRoZWlyIGFjdHVhbCB0eXBlIHdyYXBwZWRcbiAgICogaW4gYSBgTm9uTnVsbFR5cGVgIEdyYXBoUUwgY29uc3RydWN0LiBUaGUgYWN0dWFsIGZpZWxkIHR5cGUgaXMgY29udGFpbmVkXG4gICAqIHdpdGhpbi4gVGhlIG1ldGEgb2JqZWN0IHN1cmZhY2VzIHRob3NlIHZhbHVlcyBmb3IgZWFzeSB1c2UuXG4gICAqL1xuICBzdGF0aWMgZmluZEZpZWxkKFxuICAgIGFzdDogT2JqZWN0LFxuICAgIGRlZmluaXRpb25OYW1lOiBzdHJpbmcgfCBSZWdFeHAsXG4gICAgZmllbGROYW1lOiBzdHJpbmcgfCBSZWdFeHBcbiAgKSB7XG4gICAgY29uc3QgZGVmaW5pdGlvbiA9IHRoaXMuZmluZERlZmluaXRpb24oYXN0LCBkZWZpbml0aW9uTmFtZSlcbiAgICBsZXQgbWV0YTtcblxuICAgIGlmICghZGVmaW5pdGlvbiB8fCAhZGVmaW5pdGlvbi5maWVsZHMpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IGZpZWxkID0gdGhpcy5maW5kSW5BU1RBcnJheUJ5TmFtZVZhbHVlKGRlZmluaXRpb24uZmllbGRzLCBmaWVsZE5hbWUpXG5cbiAgICBpZiAoZmllbGQpIHtcbiAgICAgIG1ldGEgPSB7XG4gICAgICAgIG5hbWU6IGZpZWxkLm5hbWUgJiYgZmllbGQubmFtZS52YWx1ZSB8fCBudWxsLFxuICAgICAgICB0eXBlOiBmaWVsZC50eXBlICYmIGZpZWxkLnR5cGUua2luZCA9PT0gJ05vbk51bGxUeXBlJ1xuICAgICAgICAgID8gZmllbGQudHlwZS50eXBlLm5hbWUudmFsdWVcbiAgICAgICAgICA6IGZpZWxkLnR5cGUgJiYgZmllbGQudHlwZS5uYW1lICYmIGZpZWxkLnR5cGUubmFtZS52YWx1ZSB8fCBudWxsLFxuICAgICAgICBudWxsYWJsZTogISEoZmllbGQudHlwZSAmJiBmaWVsZC50eXBlLmtpbmQgIT09ICdOb25OdWxsVHlwZScpXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHsgZmllbGQsIG1ldGEgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFbnVtIEFTVCBkZWZpbml0aW9ucyBvcGVyYXRlIGRpZmZlcmVudGx5IHRoYW4gb2JqZWN0IHR5cGUgZGVmaW5pdGlvbnNcbiAgICogZG8uIE5hbWVseSwgdGhleSBkbyBub3QgaGF2ZSBhIGBmaWVsZHNgIGFycmF5IGJ1dCBpbnN0ZWFkIGhhdmUgYSBgdmFsdWVzYFxuICAgKiBhcnJheS4gVGhpcyB3cmFwcGVyIG1ldGhvZCwgZmlyc3QgZmluZHMgdGhlIGVudW0gZGVmaW5pdGlvbiBpbiB0aGUgYXN0XG4gICAqIGFuZCB0aGVuIHNlYXJjaGVzIHRoZSB2YWx1ZXMgZm9yIHRoZSBuYW1lZCBub2RlIGRlc2lyZWQgYW5kIHJldHVybnMgdGhhdFxuICAgKiBvciBudWxsLCBpZiBvbmUgY291bGQgbm90IGJlIGZvdW5kLlxuICAgKlxuICAgKiBAbWV0aG9kIFN5bnRheFRyZWUj4oy+4qCAZmluZEVudW1EZWZpbml0aW9uXG4gICAqIEBzaW5jZSAyLjcuMFxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gYXN0IHRoZSBhYnN0cmFjdCBzeW50YXggdHJlZSBwYXJzZWQgYnkgZ3JhcGhxbFxuICAgKiBAcGFyYW0ge3N0cmluZ3xSZWdFeHB9IGVudW1EZWZpbml0aW9uTmFtZSBhIHN0cmluZyBvciByZWd1bGFyIGV4cHJlc3Npb25cbiAgICogdXNlZCB0byBsb2NhdGUgdGhlIGVudW0gZGVmaW5pdGlvbiBpbiB0aGUgQVNULlxuICAgKiBAcGFyYW0ge3N0cmluZ3xSZWdFeHB9IGVudW1WYWx1ZU5hbWUgYSBzdHJpbmcgb3IgcmVndWxhciBleHByZXNzaW9uIHVzZWRcbiAgICogdG8gbG9jYXRlIHRoZSB2YWx1ZSBieSBuYW1lIGluIHRoZSB2YWx1ZXMgb2YgdGhlIGVudW0gZGVmaW5pdGlvbi5cbiAgICogQHJldHVybiB7T2JqZWN0fG51bGx9IHRoZSBkZXNpcmVkIEFTVCBub2RlIG9yIG51bGwgaWYgb25lIGRvZXMgbm90IGV4aXN0XG4gICAqL1xuICBzdGF0aWMgZmluZEVudW1EZWZpbml0aW9uKFxuICAgIGFzdDogT2JqZWN0LFxuICAgIGVudW1EZWZpbml0aW9uTmFtZTogc3RyaW5nIHwgUmVnRXhwLFxuICAgIGVudW1WYWx1ZU5hbWU6IHN0cmluZyB8IFJlZ0V4cFxuICApOiA/T2JqZWN0IHtcbiAgICAvLyBGZXRjaCB0aGUgZW51bSBkZWZpbml0aW9uXG4gICAgY29uc3QgZGVmaW5pdGlvbiA9IHRoaXMuZmluZERlZmluaXRpb24oYXN0LCBlbnVtRGVmaW5pdGlvbk5hbWUpO1xuXG4gICAgLy8gRW5zdXJlIHdlIGhhdmUgb25lIG9yIHRoYXQgaXQgaGFzIGEgdmFsdWVzIGFycmF5XG4gICAgaWYgKCFkZWZpbml0aW9uIHx8ICFkZWZpbml0aW9uLnZhbHVlcykge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgLy8gUmV0dXJuIHRoZSByZXN1bHRzIG9mIGFuIGBmaW5kSW5BU1RBcnJheUJ5TmFtZVZhbHVlKClgIHNlYXJjaCBvZiB0aGVcbiAgICAvLyBhZm9yZW1lbnRpb25lZCAndmFsdWVzJyBhcnJheS5cbiAgICByZXR1cm4gdGhpcy5maW5kSW5BU1RBcnJheUJ5TmFtZVZhbHVlKFxuICAgICAgZGVmaW5pdGlvbi52YWx1ZXMsXG4gICAgICBlbnVtVmFsdWVOYW1lXG4gICAgKVxuICB9XG5cbiAgLyoqXG4gICAqIEEgbG90IG9mIHNlYXJjaGluZyBpbiBBU1RzIGlzIGZpbHRlcmluZyB0aHJvdWdoIGFycmF5cyBhbmQgbWF0Y2hpbmcgb25cbiAgICogc3Vib2JqZWN0IHByb3BlcnRpZXMgb24gZWFjaCBpdGVyYXRpb24uIEEgY29tbW9uIHRoZW1lIGlzIGZpbmQgc29tZXRoaW5nXG4gICAqIGJ5IGl0cyBgLm5hbWUudmFsdWVgLiBUaGlzIG1ldGhvZCBzaW1wbGlmaWVzIHRoYXQgYnkgdGFraW5nIGFuIGFycmF5IG9mXG4gICAqIEFTVCBub2RlcyBhbmQgc2VhcmNoaW5nIHRoZW0gZm9yIGEgYC5uYW1lLnZhbHVlYCBwcm9wZXJ0eSB0aGF0IGV4aXN0c1xuICAgKiB3aXRoaW4uXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlcm9mIFN5bnRheFRyZWVcbiAgICogQG1ldGhvZCDijL7ioIBmaW5kSW5BU1RBcnJheUJ5TmFtZVZhbHVlXG4gICAqIEBzaW5jZSAyLjcuMFxuICAgKlxuICAgKiBAcGFyYW0ge0FycmF5fSBhcnJheSBvZiBtaXhlZCBBU1Qgb2JqZWN0IG5vZGVzIGNvbnRhaW5pbmcgYG5hbWUudmFsdWVgc1xuICAgKiBAcGFyYW0ge3N0cmluZ3xSZWdFeHB9IG5hbWUgYSBzdHJpbmcgb3IgcmVndWxhciBleHByZXNzaW9uIHVzZWRcbiAgICogdG8gbWF0Y2ggYWdhaW5zdCB0aGUgbm9kZSBuYW1lIHZhbHVlXG4gICAqIEByZXR1cm4ge09iamVjdHxudWxsfSB0aGUgQVNUIGxlYWYgaWYgb25lIG1hdGNoZXMgb3IgbnVsbCBvdGhlcndpc2UuXG4gICAqL1xuICBzdGF0aWMgZmluZEluQVNUQXJyYXlCeU5hbWVWYWx1ZShcbiAgICBhcnJheTogQXJyYXk8T2JqZWN0PixcbiAgICBuYW1lOiBzdHJpbmcgfCBSZWdFeHBcbiAgKTogP09iamVjdCB7XG4gICAgY29uc3QgaXNSZWdFeHA6IGJvb2xlYW4gPSAvUmVnRXhwLy50ZXN0KHR5cGVPZihuYW1lKSk7XG4gICAgY29uc3QgcmVnZXggPSAhaXNSZWdFeHBcbiAgICAgIC8vICRGbG93Rml4TWVcbiAgICAgID8gbmV3IFJlZ0V4cChSZWdFeHAuZXNjYXBlKG5hbWUudG9TdHJpbmcoKSkpXG4gICAgICAvLyAkRmxvd0ZpeE1lXG4gICAgICA6IChuYW1lOiBSZWdFeHApO1xuICAgIGNvbnN0IGZsYWdzID0gcmVnZXguZmxhZ3NcbiAgICBjb25zdCBzb3VyY2UgPSByZWdleC5zb3VyY2VcbiAgICBjb25zdCByZWR1Y2VyID0gKGxhc3QsY3VyLGkpID0+IHtcbiAgICAgIGlmIChsYXN0ICE9PSAtMSkgcmV0dXJuIGxhc3Q7XG4gICAgICBpZiAoIWN1ciB8fCAhY3VyLm5hbWUgfHwgIWN1ci5uYW1lLnZhbHVlKSByZXR1cm4gLTE7XG4gICAgICByZXR1cm4gbmV3IFJlZ0V4cChzb3VyY2UsIGZsYWdzKS50ZXN0KGN1ci5uYW1lLnZhbHVlKSA/IGkgOiAtMVxuICAgIH1cbiAgICBjb25zdCBpbmRleCA9IGFycmF5LnJlZHVjZShyZWR1Y2VyLCAtMSk7XG5cbiAgICByZXR1cm4gKH5pbmRleCkgPyBhcnJheVtpbmRleF0gOiBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIFF1ZXJ5IHR5cGVzIGluIEdyYXBoUUwgYXJlIGFuIE9iamVjdFR5cGVEZWZpbml0aW9uIG9mIGltcG9ydGFuY2UgZm9yXG4gICAqIHBsYWNlbWVudCBvbiB0aGUgcm9vdCBvYmplY3QuIFRoZXJlIGlzIHV0aWxpdHkgaW4gY3JlYXRpbmcgYW4gZW1wdHlcbiAgICogb25lIHRoYXQgY2FuIGJlIGluamVjdGVkIHdpdGggdGhlIGZpZWxkcyBvZiBvdGhlciBHcmFwaFFMIG9iamVjdCBxdWVyeVxuICAgKiBlbnRyaWVzLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJvZiBTeW50YXhUcmVlXG4gICAqIEBtZXRob2Qg4oy+4qCARW1wdHlRdWVyeVxuICAgKlxuICAgKiBAcmV0dXJuIHtTeW50YXhUcmVlfSBhbiBpbnN0YW5jZSBvZiBTeW50YXhUcmVlIHdpdGggYSBiYXNlIEFTVCBnZW5lcmF0ZWRcbiAgICogYnkgcGFyc2luZyB0aGUgZ3JhcGggcXVlcnksIFwidHlwZSBRdWVyeSB7fVwiXG4gICAqL1xuICBzdGF0aWMgRW1wdHlRdWVyeSgpOiA/U3ludGF4VHJlZSB7XG4gICAgcmV0dXJuIFN5bnRheFRyZWUuZnJvbShgdHlwZSAke3RoaXMuUVVFUll9IHt9YCk7XG4gIH1cblxuICAvKipcbiAgICogTXV0YXRpb24gdHlwZXMgaW4gR3JhcGhRTCBhcmUgYW4gT2JqZWN0VHlwZURlZmluaXRpb24gb2YgaW1wb3J0YW5jZSBmb3JcbiAgICogcGxhY2VtZW50IG9uIHRoZSByb290IG9iamVjdC4gVGhlcmUgaXMgdXRpbGl0eSBpbiBjcmVhdGluZyBhbiBlbXB0eVxuICAgKiBvbmUgdGhhdCBjYW4gYmUgaW5qZWN0ZWQgd2l0aCB0aGUgZmllbGRzIG9mIG90aGVyIEdyYXBoUUwgb2JqZWN0IG11dGF0aW9uXG4gICAqIGVudHJpZXMuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlcm9mIFN5bnRheFRyZWVcbiAgICogQG1ldGhvZCDijL7ioIBFbXB0eU11dGF0aW9uXG4gICAqXG4gICAqIEByZXR1cm4ge1N5bnRheFRyZWV9IGFuIGluc3RhbmNlIG9mIFN5bnRheFRyZWUgd2l0aCBhIGJhc2UgQVNUIGdlbmVyYXRlZFxuICAgKiBieSBwYXJzaW5nIHRoZSBncmFwaCBxdWVyeSwgXCJ0eXBlIE11dGF0aW9uIHt9XCJcbiAgICovXG4gIHN0YXRpYyBFbXB0eU11dGF0aW9uKCk6ID9TeW50YXhUcmVlIHtcbiAgICByZXR1cm4gU3ludGF4VHJlZS5mcm9tKGB0eXBlICR7dGhpcy5NVVRBVElPTn0ge31gKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgc3RhcnRpbmcgcG9pbnQgZm9yIGEgU3ludGF4VHJlZSB0aGF0IHdpbGwgYmUgYnVpbHQgdXAgcHJvZ3JhbW1hdGljYWxseS5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyb2YgU3ludGF4VHJlZVxuICAgKiBAbWV0aG9kIOKMvuKggEVtcHR5RG9jdW1lbnRcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd8T2JqZWN0fFN5bnRheFRyZWV9IHNjaGVtYU9yQVNUT3JTVCBhbnkgdmFsaWQgdHlwZSB0YWtlbiBieVxuICAgKiBTeW50YXhUcmVlLmZyb20oKSB1c2VkIHRvIGZ1cnRoZXIgcG9wdWxhdGUgdGhlIG5ldyBlbXB0eSBkb2N1bWVudFxuICAgKiBAcmV0dXJuIHtTeW50YXhUcmVlfSBhbiBpbnN0YW5jZSBvZiBTeW50YXhUcmVlIHdpdGggbm8gZGVmaW5pdGlvbnMgYW5kIGFcbiAgICoga2luZCBzZXQgdG8gJ0RvY3VtZW50J1xuICAgKi9cbiAgc3RhdGljIEVtcHR5RG9jdW1lbnQoXG4gICAgc2NoZW1hT3JBU1RPclNUPzogc3RyaW5nIHwgT2JqZWN0IHwgU3ludGF4VHJlZVxuICApOiBTeW50YXhUcmVlIHtcbiAgICBsZXQgdHJlZSA9IG5ldyBTeW50YXhUcmVlKCk7XG5cbiAgICAvLyBEdWUgdG8gbm9ybWFsIHZhbGlkYXRpb24gbWV0aG9kcyB3aXRoIEFTVHMgKGkuZS4gY29udmVydGluZyB0byBzdHJpbmdcbiAgICAvLyBhbmQgdGhlbiBiYWNrIHRvIGFuIEFTVCBvYmplY3QpLCBkb2luZyB0aGlzIHdpdGggYW4gZW1wdHkgZG9jdW1lbnRcbiAgICAvLyBmYWlscy4gVGhlcmVmb3JlLCB3ZSBtYW51YWxseSBzZXQgdGhlIGRvY3VtZW50IGNvbnRlbnRzIGhlcmUuIFRoaXMgYWxsb3dzXG4gICAgLy8gdG9TdHJpbmcoKSwgY29uc3VtZURlZmluaXRpb24oKSBhbmQgc2ltaWxhciBtZXRob2RzIHRvIHN0aWxsIHdvcmsuXG4gICAgdHJlZS5hc3QgPSB7XG4gICAgICBraW5kOiAnRG9jdW1lbnQnLFxuICAgICAgZGVmaW5pdGlvbnM6IFtdLFxuICAgICAgbG9jOiB7c3RhcnQ6IDAsIGVuZDogMH1cbiAgICB9O1xuXG4gICAgaWYgKHNjaGVtYU9yQVNUT3JTVCkge1xuICAgICAgdHJlZS5hcHBlbmREZWZpbml0aW9ucyhzY2hlbWFPckFTVE9yU1QpO1xuICAgIH1cblxuICAgIHJldHVybiB0cmVlO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFN5bnRheFRyZWU7XG4iXX0=