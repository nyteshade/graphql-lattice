'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SyntaxTree = undefined;

var _escape = require('babel-runtime/core-js/regexp/escape');

var _escape2 = _interopRequireDefault(_escape);

var _toStringTag = require('babel-runtime/core-js/symbol/to-string-tag');

var _toStringTag2 = _interopRequireDefault(_toStringTag);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _iterator3 = require('babel-runtime/core-js/symbol/iterator');

var _iterator4 = _interopRequireDefault(_iterator3);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _set = require('babel-runtime/core-js/set');

var _set2 = _interopRequireDefault(_set);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _for = require('babel-runtime/core-js/symbol/for');

var _for2 = _interopRequireDefault(_for);

var _types = require('./types');

var _graphql = require('graphql');

var _lodash = require('lodash');

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Shorthand for the key storing the internal AST
// @prop

// @module SyntaxTree

var AST_KEY = (0, _for2.default)('Internal AST Storage Key');

/**
 * A parser and processor of GraphQL IDL Abstract Syntax Trees. Used to combine
 * a set of {@link GQLBase} class instances.
 *
 * @class SyntaxTree
 */

var SyntaxTree = exports.SyntaxTree = function () {
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
    (0, _classCallCheck3.default)(this, SyntaxTree);

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


  (0, _createClass3.default)(SyntaxTree, [{
    key: 'setAST',


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
    value: function setAST(schemaOrASTOrST) {
      // $ComputedType
      this[AST_KEY] = {};

      var type = (0, _types.typeOf)(schemaOrASTOrST);
      var ast = void 0;
      var st = void 0;

      switch (type) {
        case String.name:
          try {
            ast = (0, _graphql.parse)(schemaOrASTOrST);

            (0, _lodash.merge)(this.ast, ast);
          } catch (ignore) {/* Ignore this error */}

          break;
        case Object.name:
          ast = schemaOrASTOrST;

          try {
            ast = (0, _graphql.parse)((0, _graphql.print)(ast));
            (0, _lodash.merge)(this.ast, ast);
          } catch (ignore) {/* Ignore this error */}

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
    key: 'updateAST',
    value: function updateAST(ast) {
      if ((0, _types.typeOf)(ast) === Object.name) {
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
    key: 'appendDefinitions',
    value: function appendDefinitions(schemaOrASTOrST) {
      var source = SyntaxTree.from(schemaOrASTOrST);
      var set = new _set2.default();

      this.ast.definitions.map(function (definition) {
        set.add(definition.name.value);
      });

      if (source && source.ast.definitions && this.ast.definitions) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = (0, _getIterator3.default)(source), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var theirs = _step.value;

            var name = theirs.name.value;
            var ours = this.find(name);
            var index = ours && this.ast.definitions.indexOf(ours) || -1;

            // We don't yet have one with that name
            if (!set.has(name)) {
              set.add(name);
              this.ast.definitions.push(theirs);
            }

            // We do have one with that name
            else {
                // The kinds aren't the same, just replace theirs with ours
                if (theirs.kind !== ours.kind) {
                  // replace with the new one
                  this.ast.definitions[index] = theirs;
                }

                // The kinds are the same, lets just merge their fields
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
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
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
    key: 'consumeDefinition',
    value: function consumeDefinition(astOrSyntaxTree) {
      var definitionType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "Query";

      if (!astOrSyntaxTree || !this.ast || !this.ast.definitions) {
        return this;
      }

      var tree = (0, _types.typeOf)(SyntaxTree) === SyntaxTree.name ? astOrSyntaxTree : SyntaxTree.from(astOrSyntaxTree);
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
        this.ast.definitions.push(right);

        // Remove the copied definition from the source
        tree.ast.definitions.splice(tree.ast.definitions.indexOf(right), 1);

        return this;
      }

      // TODO support other types aside from ObjectTypeDefinitions
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
      }

      // Remove the copied definition from the source
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
    key: _iterator4.default,
    value: /*#__PURE__*/_regenerator2.default.mark(function value() {
      return _regenerator2.default.wrap(function value$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!this[AST_KEY].definitions) {
                _context.next = 5;
                break;
              }

              return _context.delegateYield(this[AST_KEY].definitions, 't0', 2);

            case 2:
              return _context.abrupt('return', _context.t0);

            case 5:
              return _context.delegateYield(this, 't1', 6);

            case 6:
              return _context.abrupt('return', _context.t1);

            case 7:
            case 'end':
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
    key: 'find',


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
    key: 'toString',
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
    key: 'ast',
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
  }, {
    key: 'outline',
    get: function get() {
      var outline = {};
      var interfaces = (0, _for2.default)('interfaces');

      // $FlowFixMe

      var _loop = function _loop(definition) {
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

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = (0, _getIterator3.default)(this), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var definition = _step2.value;

          _loop(definition);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      return outline;
    }
  }, {
    key: _toStringTag2.default,


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
    get: function get() {
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
    key: 'from',


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
    value: function from(mixed) {
      var schema = void 0;
      var ast = void 0;

      switch ((0, _types.typeOf)(mixed)) {
        case String.name:
          schema = mixed;
          try {
            (0, _graphql.parse)(schema);
          } catch (error) {
            _utils.LatticeLogs.error(error);return null;
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
    key: 'fromSchema',
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
    key: 'fromAST',
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
    key: 'findDefinition',
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
    key: 'findField',
    value: function findField(ast, definitionName, fieldName) {
      var definition = this.findDefinition(ast, definitionName);
      var meta = void 0;

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

      return { field, meta };
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
    key: 'findEnumDefinition',
    value: function findEnumDefinition(ast, enumDefinitionName, enumValueName) {
      // Fetch the enum definition
      var definition = this.findDefinition(ast, enumDefinitionName);

      // Ensure we have one or that it has a values array
      if (!definition || !definition.values) {
        return null;
      }

      // Return the results of an `findInASTArrayByNameValue()` search of the
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
    key: 'findInASTArrayByNameValue',
    value: function findInASTArrayByNameValue(array, name) {
      var isRegExp = /RegExp/.test((0, _types.typeOf)(name));
      var regex = !isRegExp
      // $FlowFixMe
      ? new RegExp((0, _escape2.default)(name.toString()))
      // $FlowFixMe
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
    key: 'EmptyQuery',
    value: function EmptyQuery() {
      return SyntaxTree.from(`type ${this.QUERY} {}`);
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
    key: 'EmptyMutation',
    value: function EmptyMutation() {
      return SyntaxTree.from(`type ${this.MUTATION} {}`);
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
    key: 'EmptyDocument',
    value: function EmptyDocument(schemaOrASTOrST) {
      var tree = new SyntaxTree();

      // Due to normal validation methods with ASTs (i.e. converting to string
      // and then back to an AST object), doing this with an empty document
      // fails. Therefore, we manually set the document contents here. This allows
      // toString(), consumeDefinition() and similar methods to still work.
      tree.ast = {
        kind: 'Document',
        definitions: [],
        loc: { start: 0, end: 0 }
      };

      if (schemaOrASTOrST) {
        tree.appendDefinitions(schemaOrASTOrST);
      }

      return tree;
    }
  }, {
    key: 'QUERY',
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
    key: 'MUTATION',
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
    key: 'SUBSCRIPTION',
    get: function get() {
      return 'Subscription';
    }
  }, {
    key: _toStringTag2.default,
    get: function get() {
      return this.name;
    }
  }]);
  return SyntaxTree;
}();

exports.default = SyntaxTree;
//# sourceMappingURL=SyntaxTree.js.map