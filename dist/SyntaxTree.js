"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.SyntaxTree = void 0;

require("core-js/modules/web.dom.iterable");

require("core-js/modules/es7.symbol.async-iterator");

var _neTypes = require("ne-types");

var _graphql = require("graphql");

var _lodash = require("lodash");

var _utils = require("./utils");

// @module SyntaxTree
// Shorthand for the key storing the internal AST
// @prop
const AST_KEY = Symbol.for('Internal AST Storage Key');
/**
 * A parser and processor of GraphQL IDL Abstract Syntax Trees. Used to combine
 * a set of {@link GQLBase} class instances.
 *
 * @class SyntaxTree
 */

class SyntaxTree {
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
  constructor(schemaOrASTOrST) {
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


  get ast() {
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


  set ast(value) {
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


  setAST(schemaOrASTOrST) {
    // $ComputedType
    this[AST_KEY] = {};
    const type = (0, _neTypes.typeOf)(schemaOrASTOrST);
    let ast;
    let st;

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


  updateAST(ast) {
    if ((0, _neTypes.typeOf)(ast) === Object.name) {
      let newAST = (0, _lodash.merge)({}, this.ast, ast);

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


  appendDefinitions(schemaOrASTOrST) {
    const source = SyntaxTree.from(schemaOrASTOrST);
    const set = new Set();
    this.ast.definitions.map(definition => {
      set.add(definition.name.value);
    });

    if (source && source.ast.definitions && this.ast.definitions) {
      for (let theirs of source) {
        let name = theirs.name.value;
        let ours = this.find(name);
        let index = ours && this.ast.definitions.indexOf(ours) || -1; // We don't yet have one with that name

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


  consumeDefinition(astOrSyntaxTree, definitionType = "Query") {
    if (!astOrSyntaxTree || !this.ast || !this.ast.definitions) {
      return this;
    }

    const tree = (0, _neTypes.typeOf)(SyntaxTree) === SyntaxTree.name ? astOrSyntaxTree : SyntaxTree.from(astOrSyntaxTree);
    let left = this.find(definitionType);
    let right = tree && tree.find(definitionType) || null;

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


  *[Symbol.iterator]() {
    if (this[AST_KEY].definitions) {
      return yield* this[AST_KEY].definitions;
    } else {
      return yield* this;
    }
  }
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


  get outline() {
    let outline = {};
    let interfaces = Symbol.for('interfaces'); // $FlowFixMe

    for (let definition of this) {
      let out;

      switch (definition.kind) {
        case 'InterfaceTypeDefinition':
        case 'ObjectTypeDefinition':
          out = outline[definition.name.value] = {};
          definition.fields.forEach(field => {
            if (field.type.kind === 'NamedType') out[field.name.value] = field.type.name.value;else if (field.type.kind === 'ListType') out[field.name.value] = field.type.type.name.value;
          });

          if (definition.interfaces) {
            // $FlowFixMe
            out = out[interfaces] = out[interfaces] || [];
            definition.interfaces.forEach(_interface => out.push(_interface.name.value));
          }

          break;

        case 'EnumTypeDefinition':
          out = outline[definition.name.value] = [];
          definition.values.forEach(value => out[value.name.value] = value.name.value);
          break;

        case 'UnionTypeDefinition':
          out = outline[definition.name.value] = [];
          definition.types.forEach(type => out.push(type.name.value));
          break;
      }
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


  find(definitionName) {
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


  toString() {
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


  static get QUERY() {
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


  static get MUTATION() {
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


  static get SUBSCRIPTION() {
    return 'Subscription';
  }
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


  get [Symbol.toStringTag]() {
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


  static get [Symbol.toStringTag]() {
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


  static from(mixed) {
    let schema;
    let ast;

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


  static fromSchema(schema) {
    const ast = (0, _graphql.parse)(schema);
    let tree = new SyntaxTree(ast);
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


  static fromAST(ast) {
    const source = (0, _graphql.parse)((0, _graphql.print)(ast));
    let tree = new SyntaxTree(source);
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


  static findDefinition(ast, definitionName) {
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


  static findField(ast, definitionName, fieldName) {
    const definition = this.findDefinition(ast, definitionName);
    let meta;

    if (!definition || !definition.fields) {
      return null;
    }

    const field = this.findInASTArrayByNameValue(definition.fields, fieldName);

    if (field) {
      meta = {
        name: field.name && field.name.value || null,
        type: field.type && field.type.kind === 'NonNullType' ? field.type.type.name.value : field.type && field.type.name && field.type.name.value || null,
        nullable: !!(field.type && field.type.kind !== 'NonNullType')
      };
    }

    return {
      field,
      meta
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


  static findEnumDefinition(ast, enumDefinitionName, enumValueName) {
    // Fetch the enum definition
    const definition = this.findDefinition(ast, enumDefinitionName); // Ensure we have one or that it has a values array

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


  static findInASTArrayByNameValue(array, name) {
    const isRegExp = /RegExp/.test((0, _neTypes.typeOf)(name));
    const regex = !isRegExp // $FlowFixMe
    ? new RegExp(RegExp.escape(name.toString())) // $FlowFixMe
    : name;
    const flags = regex.flags;
    const source = regex.source;

    const reducer = (last, cur, i) => {
      if (last !== -1) return last;
      if (!cur || !cur.name || !cur.name.value) return -1;
      return new RegExp(source, flags).test(cur.name.value) ? i : -1;
    };

    const index = array.reduce(reducer, -1);
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


  static EmptyQuery() {
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


  static EmptyMutation() {
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


  static EmptyDocument(schemaOrASTOrST) {
    let tree = new SyntaxTree(); // Due to normal validation methods with ASTs (i.e. converting to string
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

}

exports.SyntaxTree = SyntaxTree;
var _default = SyntaxTree;
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2VzNi9TeW50YXhUcmVlLmpzIl0sIm5hbWVzIjpbIkFTVF9LRVkiLCJTeW1ib2wiLCJmb3IiLCJTeW50YXhUcmVlIiwiY29uc3RydWN0b3IiLCJzY2hlbWFPckFTVE9yU1QiLCJzZXRBU1QiLCJhc3QiLCJ2YWx1ZSIsInR5cGUiLCJzdCIsIlN0cmluZyIsIm5hbWUiLCJpZ25vcmUiLCJPYmplY3QiLCJ1cGRhdGVBU1QiLCJuZXdBU1QiLCJlcnJvciIsImxsIiwiYXBwZW5kRGVmaW5pdGlvbnMiLCJzb3VyY2UiLCJmcm9tIiwic2V0IiwiU2V0IiwiZGVmaW5pdGlvbnMiLCJtYXAiLCJkZWZpbml0aW9uIiwiYWRkIiwidGhlaXJzIiwib3VycyIsImZpbmQiLCJpbmRleCIsImluZGV4T2YiLCJoYXMiLCJwdXNoIiwia2luZCIsImludGVyZmFjZXMiLCJjb25jYXQiLCJkaXJlY3RpdmVzIiwiZmllbGRzIiwiY29uc3VtZURlZmluaXRpb24iLCJhc3RPclN5bnRheFRyZWUiLCJkZWZpbml0aW9uVHlwZSIsInRyZWUiLCJsZWZ0IiwicmlnaHQiLCJFcnJvciIsInNwbGljZSIsIml0ZXJhdG9yIiwib3V0bGluZSIsIm91dCIsImZvckVhY2giLCJmaWVsZCIsIl9pbnRlcmZhY2UiLCJ2YWx1ZXMiLCJ0eXBlcyIsImRlZmluaXRpb25OYW1lIiwiZmluZERlZmluaXRpb24iLCJ0b1N0cmluZyIsIlFVRVJZIiwiTVVUQVRJT04iLCJTVUJTQ1JJUFRJT04iLCJ0b1N0cmluZ1RhZyIsIm1peGVkIiwic2NoZW1hIiwiZnJvbVNjaGVtYSIsImZyb21BU1QiLCJmaW5kSW5BU1RBcnJheUJ5TmFtZVZhbHVlIiwiZmluZEZpZWxkIiwiZmllbGROYW1lIiwibWV0YSIsIm51bGxhYmxlIiwiZmluZEVudW1EZWZpbml0aW9uIiwiZW51bURlZmluaXRpb25OYW1lIiwiZW51bVZhbHVlTmFtZSIsImFycmF5IiwiaXNSZWdFeHAiLCJ0ZXN0IiwicmVnZXgiLCJSZWdFeHAiLCJlc2NhcGUiLCJmbGFncyIsInJlZHVjZXIiLCJsYXN0IiwiY3VyIiwiaSIsInJlZHVjZSIsIkVtcHR5UXVlcnkiLCJFbXB0eU11dGF0aW9uIiwiRW1wdHlEb2N1bWVudCIsImxvYyIsInN0YXJ0IiwiZW5kIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUdBOztBQUNBOztBQUNBOztBQUNBOztBQUxBO0FBbUJBO0FBQ0E7QUFDQSxNQUFNQSxPQUFPLEdBQUdDLE1BQU0sQ0FBQ0MsR0FBUCxDQUFXLDBCQUFYLENBQWhCO0FBRUE7Ozs7Ozs7QUFNTyxNQUFNQyxVQUFOLENBQ1A7QUFDRTs7Ozs7Ozs7Ozs7Ozs7QUFjQUMsRUFBQUEsV0FBVyxDQUFDQyxlQUFELEVBQWlEO0FBQzFEO0FBQ0EsU0FBS0wsT0FBTCxJQUFnQixFQUFoQjs7QUFFQSxRQUFJSyxlQUFKLEVBQXFCO0FBQ25CLFdBQUtDLE1BQUwsQ0FBWUQsZUFBWjtBQUNEO0FBQ0Y7QUFFRDs7Ozs7Ozs7Ozs7O0FBVUEsTUFBSUUsR0FBSixHQUFrQjtBQUNoQjtBQUNBLFdBQU8sS0FBS1AsT0FBTCxDQUFQO0FBQ0Q7QUFFRDs7Ozs7Ozs7Ozs7OztBQVdBLE1BQUlPLEdBQUosQ0FBUUMsS0FBUixFQUE2QjtBQUMzQjtBQUNBLFNBQUtSLE9BQUwsSUFBZ0JRLEtBQWhCO0FBQ0Q7QUFFRDs7Ozs7Ozs7Ozs7Ozs7QUFZQUYsRUFBQUEsTUFBTSxDQUFDRCxlQUFELEVBQXdEO0FBQzVEO0FBQ0EsU0FBS0wsT0FBTCxJQUFnQixFQUFoQjtBQUVBLFVBQU1TLElBQUksR0FBRyxxQkFBT0osZUFBUCxDQUFiO0FBQ0EsUUFBSUUsR0FBSjtBQUNBLFFBQUlHLEVBQUo7O0FBRUEsWUFBUUQsSUFBUjtBQUNFLFdBQUtFLE1BQU0sQ0FBQ0MsSUFBWjtBQUNFLFlBQUk7QUFDRkwsVUFBQUEsR0FBRyxHQUFHLG9CQUFPRixlQUFQLENBQU47QUFFQSw2QkFBTSxLQUFLRSxHQUFYLEVBQWdCQSxHQUFoQjtBQUNELFNBSkQsQ0FLQSxPQUFPTSxNQUFQLEVBQWU7QUFBRTtBQUF5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QUFISSxLQUFYOztBQU1BLFFBQUl2RixlQUFKLEVBQXFCO0FBQ25Cc0MsTUFBQUEsSUFBSSxDQUFDeEIsaUJBQUwsQ0FBdUJkLGVBQXZCO0FBQ0Q7O0FBRUQsV0FBT3NDLElBQVA7QUFDRDs7QUFueEJIOzs7ZUFzeEJleEMsVSIsInNvdXJjZXNDb250ZW50IjpbIi8vIEBmbG93XG4vLyBAbW9kdWxlIFN5bnRheFRyZWVcblxuaW1wb3J0IHsgdHlwZU9mIH0gZnJvbSAnbmUtdHlwZXMnXG5pbXBvcnQgeyBwcmludCwgcGFyc2UgfSBmcm9tICdncmFwaHFsJ1xuaW1wb3J0IHsgbWVyZ2UgfSBmcm9tICdsb2Rhc2gnXG5pbXBvcnQgeyBMYXR0aWNlTG9ncyBhcyBsbCB9IGZyb20gJy4vdXRpbHMnXG5cbmltcG9ydCB0eXBlIHsgR3JhcGhRTE9iamVjdFR5cGUgfSBmcm9tICdncmFwaHFsL3R5cGUvZGVmaW5pdGlvbidcbmltcG9ydCB0eXBlIHtcbiAgT2JqZWN0VHlwZURlZmluaXRpb25Ob2RlLFxuICBJbnRlcmZhY2VUeXBlRGVmaW5pdGlvbk5vZGUsXG4gIEVudW1UeXBlRGVmaW5pdGlvbk5vZGUsXG4gIFVuaW9uVHlwZURlZmluaXRpb25Ob2RlLFxuICBGaWVsZERlZmluaXRpb25Ob2RlLFxuICBUeXBlRGVmaW5pdGlvbk5vZGUsXG4gIFR5cGVOb2RlXG59IGZyb20gJ2dyYXBocWwvbGFuZ3VhZ2UvYXN0J1xuXG5cbi8vIFNob3J0aGFuZCBmb3IgdGhlIGtleSBzdG9yaW5nIHRoZSBpbnRlcm5hbCBBU1Rcbi8vIEBwcm9wXG5jb25zdCBBU1RfS0VZID0gU3ltYm9sLmZvcignSW50ZXJuYWwgQVNUIFN0b3JhZ2UgS2V5Jyk7XG5cbi8qKlxuICogQSBwYXJzZXIgYW5kIHByb2Nlc3NvciBvZiBHcmFwaFFMIElETCBBYnN0cmFjdCBTeW50YXggVHJlZXMuIFVzZWQgdG8gY29tYmluZVxuICogYSBzZXQgb2Yge0BsaW5rIEdRTEJhc2V9IGNsYXNzIGluc3RhbmNlcy5cbiAqXG4gKiBAY2xhc3MgU3ludGF4VHJlZVxuICovXG5leHBvcnQgY2xhc3MgU3ludGF4VHJlZVxue1xuICAvKipcbiAgICogQ29uc3RydWN0cyBhIG5ldyBgU3ludGF4VHJlZWAgb2JqZWN0LiBJZiBhIHN0cmluZyBzY2hlbWEgaXMgc3VwcGxpZWQgb3JcbiAgICogYW4gYWxyZWFkeSBwYXJzZWQgQVNUIG9iamVjdCwgZWl0aGVyIG9mIHdoaWNoIGlzIHZhbGlkIEdyYXBoUUwgSURMLCB0aGVuXG4gICAqIGl0cyBwYXJzZWQgQVNUIHdpbGwgYmUgdGhlIGludGVybmFscyBvZiB0aGlzIG9iamVjdC5cbiAgICpcbiAgICogQGNvbnN0cnVjdG9yXG4gICAqIEBtZW1iZXJvZiBTeW50YXhUcmVlXG4gICAqIEBtZXRob2Qg4o6G4qCAY29uc3RydWN0b3JcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd8T2JqZWN0fFN5bnRheFRyZWV9IHNjaGVtYU9yQVNUT3JTVCBpZiBzdXBwbGllZCB0aGUgdHJlZVxuICAgKiB3aWxsIGJlIGNvbnN0cnVjdGVkIHdpdGggdGhlIGNvbnRlbnRzIG9mIHRoZSBkYXRhLiBJZiBhIHN0cmluZyBvZiBJREwgaXNcbiAgICogZ2l2ZW4sIGl0IHdpbGwgYmUgcGFyc2VkLiBJZiBhbiBBU1QgaXMgZ2l2ZW4sIGl0IHdpbGwgYmUgdmVyaWZpZWQuIElmIGFcbiAgICogU3ludGF4VHJlZSBpcyBzdXBwbGllZCwgaXQgd2lsbCBiZSBjb3BpZWQuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihzY2hlbWFPckFTVE9yU1Q/OiBzdHJpbmcgfCBPYmplY3QgfCBTeW50YXhUcmVlKSB7XG4gICAgLy8gJENvbXB1dGVkVHlwZVxuICAgIHRoaXNbQVNUX0tFWV0gPSB7fTtcblxuICAgIGlmIChzY2hlbWFPckFTVE9yU1QpIHtcbiAgICAgIHRoaXMuc2V0QVNUKHNjaGVtYU9yQVNUT3JTVCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciB0aGF0IHJldHJpZXZlcyB0aGUgYWJzdHJhY3Qgc3ludGF4IHRyZWUgY3JlYXRlZCBieSBgZ3JhcGhxbC5wYXJzZWBcbiAgICogd2hlbiBpdCBpcyBwcmVzZW50ZWQgd2l0aCBhIHZhbGlkIHN0cmluZyBvZiBJREwuXG4gICAqXG4gICAqIEBpbnN0YW5jZVxuICAgKiBAbWVtYmVyb2YgU3ludGF4VHJlZVxuICAgKiBAbWV0aG9kIOKsh++4juKggGFzdFxuICAgKlxuICAgKiBAcmV0dXJuIHtPYmplY3R9IGEgR3JhcGhRTCBBU1Qgb2JqZWN0XG4gICAqL1xuICBnZXQgYXN0KCk6IE9iamVjdCB7XG4gICAgLy8gJENvbXB1dGVkVHlwZVxuICAgIHJldHVybiB0aGlzW0FTVF9LRVldO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciB0aGF0IGFzc2lnbnMgdGhlIGFic3RyYWN0IHN5bnRheCB0cmVlLCB0eXBpY2FsbHkgY3JlYXRlZCBieVxuICAgKiBgZ3JhcGhxbC5wYXJzZWAgd2hlbiBnaXZlbiBhIHZhbGlkIHN0cmluZyBvZiBJREwuXG4gICAqXG4gICAqIEBpbnN0YW5jZVxuICAgKiBAbWVtYmVyb2YgU3ludGF4VHJlZVxuICAgKiBAbWV0aG9kIOKshu+4juKggGFzdFxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gdmFsdWUgYSB2YWxpZCBBU1Qgb2JqZWN0LiBPdGhlciBvcGVyYXRpb25zIHdpbGwgYWN0XG4gICAqIGluIGFuIHVuZGVmaW5lZCBtYW5uZXIgc2hvdWxkIHRoaXMgb2JqZWN0IG5vdCBiZSBhIHZhbGlkIEFTVFxuICAgKi9cbiAgc2V0IGFzdCh2YWx1ZTogT2JqZWN0KTogdm9pZCB7XG4gICAgLy8gJENvbXB1dGVkVHlwZVxuICAgIHRoaXNbQVNUX0tFWV0gPSB2YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSB1bmRlcmx5aW5nIEFTVCBvYmplY3Qgd2l0aCBlaXRoZXIgc2NoZW1hIHdoaWNoIHdpbGwgYmUgcGFyc2VkXG4gICAqIGludG8gYSB2YWxpZCBBU1Qgb3IgYW4gZXhpc3RpbmcgQVNULiBQcmV2aW91cyBhc3QgdmFsdWVzIHdpbGwgYmUgZXJhc2VkLlxuICAgKlxuICAgKiBAaW5zdGFuY2VcbiAgICogQG1lbWJlcm9mIFN5bnRheFRyZWVcbiAgICogQG1ldGhvZCDijL7ioIBzZXRBU1RcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd8T2JqZWN0fSBzY2hlbWFPckFTVCBhIHZhbGlkIEdyYXBoUUwgSURMIHNjaGVtYSBvciBhXG4gICAqIHByZXZpb3N1bHkgcGFyc2VkIG9yIGNvbXBhdGlibGUgR3JhcGhRTCBJREwgQVNUIG9iamVjdC5cbiAgICogQHJldHVybiB7U3ludGF4VHJlZX0gdGhpcyBmb3IgaW5saW5pbmcuXG4gICAqL1xuICBzZXRBU1Qoc2NoZW1hT3JBU1RPclNUOiBzdHJpbmd8T2JqZWN0fFN5bnRheFRyZWUpOiBTeW50YXhUcmVlIHtcbiAgICAvLyAkQ29tcHV0ZWRUeXBlXG4gICAgdGhpc1tBU1RfS0VZXSA9IHt9O1xuXG4gICAgY29uc3QgdHlwZSA9IHR5cGVPZihzY2hlbWFPckFTVE9yU1QpO1xuICAgIGxldCBhc3Q6IE9iamVjdDtcbiAgICBsZXQgc3Q6IFN5bnRheFRyZWU7XG5cbiAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgIGNhc2UgU3RyaW5nLm5hbWU6XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgYXN0ID0gcGFyc2UoKHNjaGVtYU9yQVNUT3JTVDogYW55KSk7XG5cbiAgICAgICAgICBtZXJnZSh0aGlzLmFzdCwgYXN0KTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoaWdub3JlKSB7IC8qIElnbm9yZSB0aGlzIGVycm9yICovIH1cblxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgT2JqZWN0Lm5hbWU6XG4gICAgICAgIGFzdCA9IChzY2hlbWFPckFTVE9yU1Q6IGFueSk7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBhc3QgPSBwYXJzZShwcmludChhc3QpKTtcbiAgICAgICAgICBtZXJnZSh0aGlzLmFzdCwgYXN0KTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoaWdub3JlKSB7IC8qIElnbm9yZSB0aGlzIGVycm9yICovIH1cblxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgU3ludGF4VHJlZS5uYW1lOlxuICAgICAgICBzdCA9IChzY2hlbWFPckFTVE9yU1Q6IGFueSk7XG5cbiAgICAgICAgbWVyZ2UodGhpcy5hc3QsIHN0LmFzdCk7XG5cbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogQXMgcGFzc3RocnUgdXBkYXRlIG1ldGhvZCB0aGF0IHdvcmtzIG9uIHRoZSBpbnRlcm5hbCBBU1Qgb2JqZWN0LiBJZlxuICAgKiBhbiBlcnJvciBvY2N1cnMsIHRoZSB1cGRhdGUgaXMgc2tpcHBlZC4gQW4gZXJyb3IgY2FuIG9jY3VyIGlmIGFkZGluZyB0aGVcbiAgICogY2hhbmdlcyB3b3VsZCBtYWtlIHRoZSBBU1QgaW52YWxpZC4gSW4gc3VjaCBhIGNhc2UsIHRoZSBlcnJvciBpcyBsb2dnZWRcbiAgICogdG8gdGhlIGVycm9yIGNvbnNvbGUuXG4gICAqXG4gICAqIEBpbnN0YW5jZVxuICAgKiBAbWVtYmVyb2YgU3ludGF4VHJlZVxuICAgKiBAbWV0aG9kIOKMvuKggHVwZGF0ZUFTVFxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gYXN0IGFuIGV4aXN0aW5nIEdyYXBoUUwgSURMIEFTVCBvYmplY3QgdGhhdCB3aWxsIGJlXG4gICAqIG1lcmdlZCBvbiB0b3Agb2YgdGhlIGV4aXN0aW5nIHRyZWUgdXNpbmcgXy5tZXJnZSgpXG4gICAqIEByZXR1cm4ge1N5bnRheFRyZWV9IHRoaXMgZm9yIGlubGluaW5nLlxuICAgKi9cbiAgdXBkYXRlQVNUKGFzdDogT2JqZWN0KTogU3ludGF4VHJlZSB7XG4gICAgaWYgKHR5cGVPZihhc3QpID09PSBPYmplY3QubmFtZSkge1xuICAgICAgbGV0IG5ld0FTVCA9IG1lcmdlKHt9LCB0aGlzLmFzdCwgYXN0KTtcblxuICAgICAgdHJ5IHtcbiAgICAgICAgcHJpbnQobmV3QVNUKTtcbiAgICAgICAgdGhpcy5hc3QgPSBtZXJnZSh0aGlzLmFzdCwgYXN0KTtcbiAgICAgIH1cbiAgICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICBsbC5lcnJvcignW1N5bnRheFRyZWVdIEZhaWxlZCB0byB1cGRhdGVBU1Qgd2l0aCAlbycsIGFzdCk7XG4gICAgICAgIGxsLmVycm9yKCdSZXN1bHRpbmcgb2JqZWN0IHdvdWxkIGJlICVvJywgbmV3QVNUKTtcbiAgICAgICAgbGwuZXJyb3IoZXJyb3IpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIEFwcGVuZHMgYWxsIGRlZmluaXRpb25zIGZyb20gYW5vdGhlciBBU1QgdG8gdGhpcyBvbmUuIFRoZSBtZXRob2Qgd2lsbFxuICAgKiBhY3R1YWxseSBjcmVhdGUgYSBjb3B5IHVzaW5nIFN5bnRheFRyZWUuZnJvbSgpIHNvIHRoZSBpbnB1dCB0eXBlcyBjYW5cbiAgICogYmUgYW55IG9uZSBvZiBhIHZhbGlkIEdyYXBoUUwgSURMIHNjaGVtYSBzdHJpbmcsIGEgR3JhcGhRTCBJREwgQVNUIG9yXG4gICAqIGFub3RoZXIgU3ludGF4VHJlZSBvYmplY3QgaW5zdGFuY2UuXG4gICAqXG4gICAqIERlZmluaXRpb25zIG9mIHRoZSBzYW1lIG5hbWUgYnV0IGRpZmZlcmVudCBraW5kcyB3aWxsIGJlIHJlcGxhY2VkIGJ5IHRoZVxuICAgKiBuZXcgY29weS4gVGhvc2Ugb2YgdGhlIHNhbWUga2luZCBhbmQgbmFtZSB3aWxsIGJlIG1lcmdlZCAoVE9ETyBoYW5kbGUgbW9yZVxuICAgKiB0aGFuIE9iamVjdFR5cGVEZWZpbml0aW9uIGtpbmRzIHdoZW4gbWVyZ2luZzsgY3VycmVudGx5IG90aGVyIHR5cGVzIGFyZVxuICAgKiBvdmVyd3JpdHRlbikuXG4gICAqXG4gICAqIEBpbnN0YW5jZVxuICAgKiBAbWVtYmVyb2YgU3ludGF4VHJlZVxuICAgKiBAbWV0aG9kIOKMvuKggGFwcGVuZERlZmluaXRpb25zXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfE9iamVjdHxTeW50YXhUcmVlfSBzY2hlbWFPckFTVE9yU1QgYW4gaW5zdGFuY2Ugb2Ygb25lIG9mXG4gICAqIHRoZSB2YWxpZCB0eXBlcyBmb3IgU3ludGF4VHJlZS5mcm9tKCkgdGhhdCBjYW4gYmUgdXNlZCB0byBjcmVhdGUgb3JcbiAgICogZHVwbGljYXRlIHRoZSBzb3VyY2UgZnJvbSB3aGljaCB0byBjb3B5IGRlZmluaXRpb25zLlxuICAgKiBAcmV0dXJuIHtTeW50YXhUcmVlfSB0aGlzIGZvciBpbmxpbmluZ1xuICAgKi9cbiAgYXBwZW5kRGVmaW5pdGlvbnMoc2NoZW1hT3JBU1RPclNUOiBzdHJpbmcgfCBPYmplY3QgfCBTeW50YXhUcmVlKTogU3ludGF4VHJlZSB7XG4gICAgY29uc3Qgc291cmNlID0gU3ludGF4VHJlZS5mcm9tKHNjaGVtYU9yQVNUT3JTVCk7XG4gICAgY29uc3Qgc2V0ID0gbmV3IFNldCgpO1xuXG4gICAgdGhpcy5hc3QuZGVmaW5pdGlvbnMubWFwKChkZWZpbml0aW9uKSA9PiB7XG4gICAgICBzZXQuYWRkKGRlZmluaXRpb24ubmFtZS52YWx1ZSk7XG4gICAgfSlcblxuICAgIGlmIChzb3VyY2UgJiYgc291cmNlLmFzdC5kZWZpbml0aW9ucyAmJiB0aGlzLmFzdC5kZWZpbml0aW9ucykge1xuICAgICAgZm9yIChsZXQgdGhlaXJzIG9mIChzb3VyY2U6IGFueSkpIHtcbiAgICAgICAgbGV0IG5hbWUgPSB0aGVpcnMubmFtZS52YWx1ZTtcbiAgICAgICAgbGV0IG91cnMgPSB0aGlzLmZpbmQobmFtZSk7XG4gICAgICAgIGxldCBpbmRleCA9IG91cnMgJiYgdGhpcy5hc3QuZGVmaW5pdGlvbnMuaW5kZXhPZihvdXJzKSB8fCAtMTtcblxuICAgICAgICAvLyBXZSBkb24ndCB5ZXQgaGF2ZSBvbmUgd2l0aCB0aGF0IG5hbWVcbiAgICAgICAgaWYgKCFzZXQuaGFzKG5hbWUpKSB7XG4gICAgICAgICAgc2V0LmFkZChuYW1lKTtcbiAgICAgICAgICB0aGlzLmFzdC5kZWZpbml0aW9ucy5wdXNoKHRoZWlycyk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBXZSBkbyBoYXZlIG9uZSB3aXRoIHRoYXQgbmFtZVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAvLyBUaGUga2luZHMgYXJlbid0IHRoZSBzYW1lLCBqdXN0IHJlcGxhY2UgdGhlaXJzIHdpdGggb3Vyc1xuICAgICAgICAgIGlmICh0aGVpcnMua2luZCAhPT0gb3Vycy5raW5kKSB7XG4gICAgICAgICAgICAvLyByZXBsYWNlIHdpdGggdGhlIG5ldyBvbmVcbiAgICAgICAgICAgIHRoaXMuYXN0LmRlZmluaXRpb25zW2luZGV4XSA9IHRoZWlycztcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBUaGUga2luZHMgYXJlIHRoZSBzYW1lLCBsZXRzIGp1c3QgbWVyZ2UgdGhlaXIgZmllbGRzXG4gICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvLyBtZXJnZSB0aGUgcHJvcGVydGllcyBvZiB0aGUgc2FtZSB0eXBlcy5cbiAgICAgICAgICAgIHN3aXRjaCAodGhlaXJzLmtpbmQpIHtcbiAgICAgICAgICAgICAgY2FzZSAnT2JqZWN0VHlwZURlZmluaXRpb24nOlxuICAgICAgICAgICAgICAgIG91cnMuaW50ZXJmYWNlcyA9IFtdLmNvbmNhdChvdXJzLmludGVyZmFjZXMsIHRoZWlycy5pbnRlcmZhY2VzKVxuICAgICAgICAgICAgICAgIG91cnMuZGlyZWN0aXZlcyA9IFtdLmNvbmNhdChvdXJzLmRpcmVjdGl2ZXMsIHRoZWlycy5kaXJlY3RpdmVzKVxuICAgICAgICAgICAgICAgIG91cnMuZmllbGRzID0gW10uY29uY2F0KG91cnMuZmllbGRzLCB0aGVpcnMuZmllbGRzKVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIC8vIFNpbmNlIHdlIGRvbid0IHN1cHBvcnQgb3RoZXIgdHlwZXMgeWV0LiBMZXQncyByZXBsYWNlXG4gICAgICAgICAgICAgICAgdGhpcy5hc3QuZGVmaW5pdGlvbnNbaW5kZXhdID0gdGhlaXJzO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgbWV0aG9kIGZpbmRzIHRoZSBRdWVyeSB0eXBlIGRlZmluaXRpb25zIGluIHRoZSBzdXBwbGllZCBBU1Qgb3JcbiAgICogU3ludGF4VHJlZSBvYmplY3RzLCB0YWtlcyBpdHMgZGVmaW5lZCBmaWVsZHMgYW5kIGFkZHMgaXQgdG8gdGhlIGN1cnJlbnRcbiAgICogaW5zdGFuY2VzLiBJZiB0aGlzIGluc3RhbmNlIGRvZXMgbm90IGhhdmUgYSBRdWVyeSB0eXBlIGRlZmluZWQgYnV0IHRoZVxuICAgKiBzdXBwbGllZCBvYmplY3QgZG9lcywgdGhlbiB0aGUgc3VwcGxpZWQgb25lIGlzIG1vdmVkIG92ZXIuIElmIG5laXRoZXJcbiAgICogaGFzIGEgcXVlcnkgaGFuZGxlciwgdGhlbiBub3RoaW5nIGhhcHBlbnMuXG4gICAqXG4gICAqIE5PVEUgdGhpcyAqcmVtb3ZlcyogdGhlIFF1ZXJ5IHR5cGUgZGVmaW5pdGlvbiBmcm9tIHRoZSBzdXBwbGllZCBBU1Qgb3JcbiAgICogU3ludGF4VHJlZSBvYmplY3QuXG4gICAqXG4gICAqIEBpbnN0YW5jZVxuICAgKiBAbWVtYmVyb2YgU3ludGF4VHJlZVxuICAgKiBAbWV0aG9kIOKMvuKggGNvbnN1bWVEZWZpbml0aW9uXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fFN5bnRheFRyZWV9IGFzdE9yU3ludGF4VHJlZSBhIHZhbGlkIEdyYXBoUUwgSURMIEFTVCBvclxuICAgKiBhbiBpbnN0YW5jZSBvZiBTeW50YXhUcmVlIHRoYXQgcmVwcmVzZW50cyBvbmUuXG4gICAqIEBwYXJhbSB7c3RyaW5nfFJlZ0V4cH0gZGVmaW5pdGlvblR5cGUgYSB2YWxpZCBzZWFyY2ggaW5wdXQgYXMgd291bGQgYmVcbiAgICogYWNjZXB0ZWQgZm9yIHRoZSAjZmluZCgpIG1ldGhvZCBvZiB0aGlzIG9iamVjdC5cbiAgICogQHJldHVybiB7U3ludGF4VHJlZX0gcmV0dXJucyB0aGlzIGZvciBpbmxpbmluZ1xuICAgKi9cbiAgY29uc3VtZURlZmluaXRpb24oXG4gICAgYXN0T3JTeW50YXhUcmVlOiBPYmplY3QgfCBTeW50YXhUcmVlLFxuICAgIGRlZmluaXRpb25UeXBlOiBzdHJpbmcgfCBSZWdFeHAgPSBcIlF1ZXJ5XCJcbiAgKTogU3ludGF4VHJlZSB7XG4gICAgaWYgKCFhc3RPclN5bnRheFRyZWUgfHwgIXRoaXMuYXN0IHx8ICF0aGlzLmFzdC5kZWZpbml0aW9ucykgeyByZXR1cm4gdGhpcyB9XG5cbiAgICBjb25zdCB0cmVlID0gdHlwZU9mKFN5bnRheFRyZWUpID09PSBTeW50YXhUcmVlLm5hbWVcbiAgICAgID8gYXN0T3JTeW50YXhUcmVlXG4gICAgICA6IFN5bnRheFRyZWUuZnJvbShhc3RPclN5bnRheFRyZWUpO1xuICAgIGxldCBsZWZ0ID0gdGhpcy5maW5kKGRlZmluaXRpb25UeXBlKTtcbiAgICBsZXQgcmlnaHQgPSB0cmVlICYmIHRyZWUuZmluZChkZWZpbml0aW9uVHlwZSkgfHwgbnVsbDtcblxuICAgIGlmICghdHJlZSkge1xuICAgICAgbGwuZXJyb3IoJ1RoZXJlIHNlZW1zIHRvIGJlIHNvbWV0aGluZyB3cm9uZyB3aXRoIHlvdXIgdHJlZScpXG4gICAgICBsbC5lcnJvcihuZXcgRXJyb3IoJ01pc3NpbmcgdHJlZTsgY29udGludWluZy4uLicpKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGlmICghcmlnaHQpIHsgcmV0dXJuIHRoaXMgfVxuXG4gICAgaWYgKCFsZWZ0KSB7XG4gICAgICB0aGlzLmFzdC5kZWZpbml0aW9ucy5wdXNoKHJpZ2h0KTtcblxuICAgICAgLy8gUmVtb3ZlIHRoZSBjb3BpZWQgZGVmaW5pdGlvbiBmcm9tIHRoZSBzb3VyY2VcbiAgICAgIHRyZWUuYXN0LmRlZmluaXRpb25zLnNwbGljZSh0cmVlLmFzdC5kZWZpbml0aW9ucy5pbmRleE9mKHJpZ2h0KSwgMSk7XG5cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8vIFRPRE8gc3VwcG9ydCBvdGhlciB0eXBlcyBhc2lkZSBmcm9tIE9iamVjdFR5cGVEZWZpbml0aW9uc1xuICAgIC8vIFRPRE8gc2VlIGlmIHRoZXJlIGlzIGEgYmV0dGVyIHdheSB0byBhY2hpZXZlIHRoaXMgd2l0aCBidWlsdC1pblxuICAgIC8vIGdyYXBocWwgY29kZSBzb21lcGxhY2VcbiAgICBzd2l0Y2gobGVmdC5raW5kKSB7XG4gICAgICBjYXNlICdPYmplY3RUeXBlRGVmaW5pdGlvbic6XG4gICAgICAgIGlmIChsZWZ0LmludGVyZmFjZXMgJiYgcmlnaHQuaW50ZXJmYWNlcykge1xuICAgICAgICAgIGxlZnQuaW50ZXJmYWNlcyA9IFtdLmNvbmNhdChsZWZ0LmludGVyZmFjZXMsIHJpZ2h0LmludGVyZmFjZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGxlZnQuZGlyZWN0aXZlcyAmJiByaWdodC5kaXJlY3RpdmVzKSB7XG4gICAgICAgICAgbGVmdC5kaXJlY3RpdmVzID0gW10uY29uY2F0KGxlZnQuZGlyZWN0aXZlcywgcmlnaHQuZGlyZWN0aXZlcyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobGVmdC5maWVsZHMgJiYgcmlnaHQuZmllbGRzKSB7XG4gICAgICAgICAgbGVmdC5maWVsZHMgPSBbXS5jb25jYXQobGVmdC5maWVsZHMsIHJpZ2h0LmZpZWxkcyk7XG4gICAgICAgIH1cblxuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIC8vIFJlbW92ZSB0aGUgY29waWVkIGRlZmluaXRpb24gZnJvbSB0aGUgc291cmNlXG4gICAgdHJlZS5hc3QuZGVmaW5pdGlvbnMuc3BsaWNlKHRyZWUuYXN0LmRlZmluaXRpb25zLmluZGV4T2YocmlnaHQpLCAxKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIFdoZW4gaXRlcmF0aW5nIG92ZXIgYW4gaW5zdGFuY2Ugb2YgU3ludGF4VHJlZSwgeW91IGFyZSBhY3R1YWxseVxuICAgKiBpdGVyYXRpbmcgb3ZlciB0aGUgZGVmaW5pdGlvbnMgb2YgdGhlIFN5bnRheFRyZWUgaWYgdGhlcmUgYXJlIGFueTtcbiAgICpcbiAgICogQGluc3RhbmNlXG4gICAqIEBtZW1iZXJvZiBTeW50YXhUcmVlXG4gICAqIEBtZXRob2QgKltTeW1ib2wuaXRlcmF0b3JdXG4gICAqXG4gICAqIEByZXR1cm4ge1R5cGVEZWZpbml0aW9uTm9kZX0gYW4gaW5zdGFuY2Ugb2YgYSBUeXBlRGVmaW5pdGlvbk5vZGU7IHNlZVxuICAgKiBncmFwaHFsL2xhbmd1YWdlL2FzdC5qcy5mbG93IGZvciBtb3JlIGluZm9ybWF0aW9uXG4gICAqIEBDb21wdXRlZFR5cGVcbiAgICovXG4gICpbU3ltYm9sLml0ZXJhdG9yXSgpOiBUeXBlRGVmaW5pdGlvbk5vZGUge1xuICAgIGlmICh0aGlzW0FTVF9LRVldLmRlZmluaXRpb25zKSB7XG4gICAgICByZXR1cm4geWllbGQqIHRoaXNbQVNUX0tFWV0uZGVmaW5pdGlvbnM7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgcmV0dXJuIHlpZWxkKiB0aGlzO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgdGhhdCBidWlsZHMgYSBzbWFsbCBvdXRsaW5lIG9iamVjdCBkZW5vdGluZyB0aGUgc2NoZW1hIGJlaW5nXG4gICAqIHByb2Nlc3NlZC4gSWYgeW91IGhhdmUgYSBzY2hlbWEgdGhhdCBsb29rcyBsaWtlIHRoZSBmb2xsb3dpbmc6XG4gICAqXG4gICAqIGBgYGphdmFzY3JpcHRcbiAgICogbGV0IHN0ID0gU3ludGF4VHJlZS5mcm9tKGBcbiAgICogICB0eXBlIENvbnRyaXZlZCB7XG4gICAqICAgICBuYW1lOiBTdHJpbmdcbiAgICogICAgIGFnZTogSW50XG4gICAqICAgfVxuICAgKlxuICAgKiAgIHR5cGUgUXVlcnkge1xuICAgKiAgICAgZ2V0Q29udHJpdmVkOiBDb250cml2ZWRcbiAgICogICB9XG4gICAqIGApXG4gICAqIGxldCBvdXRsaW5lID0gc3Qub3V0bGluZVxuICAgKiBgYGBcbiAgICpcbiAgICogWW91IHdpbGwgZW5kIHVwIHdpdGggYW4gb2JqZWN0IHRoYXQgbG9va3MgbGlrZSB0aGUgZm9sbG93aW5nOlxuICAgKlxuICAgKiBgYGBqYXZhc2NyaXB0XG4gICAqIHtcbiAgICogICBDb250cml2ZWQ6IHsgbmFtZTogJ1N0cmluZycsIGFnZTogJ0ludCcgfSxcbiAgICogICBRdWVyeTogeyBnZXRDb250cml2ZWQ6ICdDb250cml2ZWQnIH1cbiAgICogfVxuICAgKiBgYGBcbiAgICpcbiAgICogQXMgbWF5IGJlIGV2aWRlbmNlZCBieSB0aGUgZXhhbXBsZSBhYm92ZSwgdGhlIG5hbWUgb2YgdGhlIHR5cGUgaXNcbiAgICogcmVwcmVzZW50ZWQgYnkgYW4gb2JqZWN0IHdoZXJlIHRoZSBuYW1lIG9mIGVhY2ggZmllbGQgKHNhbnMgYXJndW1lbnRzKVxuICAgKiBpcyBtYXBwZWQgdG8gYSBzdHJpbmcgZGVub3RpbmcgdGhlIHR5cGUuXG4gICAqL1xuICBnZXQgb3V0bGluZSgpOiBPYmplY3Qge1xuICAgIGxldCBvdXRsaW5lID0ge31cbiAgICBsZXQgaW50ZXJmYWNlcyA9IFN5bWJvbC5mb3IoJ2ludGVyZmFjZXMnKVxuXG4gICAgLy8gJEZsb3dGaXhNZVxuICAgIGZvciAobGV0IGRlZmluaXRpb24gb2YgdGhpcykge1xuICAgICAgbGV0IG91dFxuXG4gICAgICBzd2l0Y2ggKGRlZmluaXRpb24ua2luZCkge1xuICAgICAgICBjYXNlICdJbnRlcmZhY2VUeXBlRGVmaW5pdGlvbic6XG4gICAgICAgIGNhc2UgJ09iamVjdFR5cGVEZWZpbml0aW9uJzpcbiAgICAgICAgICBvdXQgPSBvdXRsaW5lW2RlZmluaXRpb24ubmFtZS52YWx1ZV0gPSB7fVxuICAgICAgICAgIGRlZmluaXRpb24uZmllbGRzLmZvckVhY2goXG4gICAgICAgICAgICBmaWVsZCA9PiB7XG4gICAgICAgICAgICAgIGlmIChmaWVsZC50eXBlLmtpbmQgPT09ICdOYW1lZFR5cGUnKVxuICAgICAgICAgICAgICAgIG91dFtmaWVsZC5uYW1lLnZhbHVlXSA9IGZpZWxkLnR5cGUubmFtZS52YWx1ZVxuICAgICAgICAgICAgICBlbHNlIGlmIChmaWVsZC50eXBlLmtpbmQgPT09ICdMaXN0VHlwZScpXG4gICAgICAgICAgICAgICAgb3V0W2ZpZWxkLm5hbWUudmFsdWVdID0gZmllbGQudHlwZS50eXBlLm5hbWUudmFsdWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgICApXG5cbiAgICAgICAgICBpZiAoZGVmaW5pdGlvbi5pbnRlcmZhY2VzKSB7XG4gICAgICAgICAgICAvLyAkRmxvd0ZpeE1lXG4gICAgICAgICAgICBvdXQgPSAob3V0W2ludGVyZmFjZXNdID0gb3V0W2ludGVyZmFjZXNdIHx8IFtdKVxuXG4gICAgICAgICAgICBkZWZpbml0aW9uLmludGVyZmFjZXMuZm9yRWFjaChcbiAgICAgICAgICAgICAgX2ludGVyZmFjZSA9PiBvdXQucHVzaChfaW50ZXJmYWNlLm5hbWUudmFsdWUpXG4gICAgICAgICAgICApXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSAnRW51bVR5cGVEZWZpbml0aW9uJzpcbiAgICAgICAgICBvdXQgPSBvdXRsaW5lW2RlZmluaXRpb24ubmFtZS52YWx1ZV0gPSBbXVxuICAgICAgICAgIGRlZmluaXRpb24udmFsdWVzLmZvckVhY2goXG4gICAgICAgICAgICB2YWx1ZSA9PiBvdXRbdmFsdWUubmFtZS52YWx1ZV0gPSB2YWx1ZS5uYW1lLnZhbHVlXG4gICAgICAgICAgKVxuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgJ1VuaW9uVHlwZURlZmluaXRpb24nOlxuICAgICAgICAgIG91dCA9IG91dGxpbmVbZGVmaW5pdGlvbi5uYW1lLnZhbHVlXSA9IFtdXG4gICAgICAgICAgZGVmaW5pdGlvbi50eXBlcy5mb3JFYWNoKFxuICAgICAgICAgICAgdHlwZSA9PiBvdXQucHVzaCh0eXBlLm5hbWUudmFsdWUpXG4gICAgICAgICAgKVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBvdXRsaW5lXG4gIH1cblxuICAvKipcbiAgICogSXRlcmF0ZSB0aHJvdWdoIHRoZSBkZWZpbml0aW9ucyBvZiB0aGUgQVNUIGlmIHRoZXJlIGFyZSBhbnkuIEZvciBlYWNoXG4gICAqIGRlZmluaXRpb24gdGhlIG5hbWUgcHJvcGVydHkncyB2YWx1ZSBmaWVsZCBpcyBjb21wYXJlZCB0byB0aGUgc3VwcGxpZWRcbiAgICogZGVmaW5pdGlvbk5hbWUuIFRoZSBkZWZpbml0aW9uTmFtZSBjYW4gYmUgYSBzdHJpbmcgb3IgYSByZWd1bGFyXG4gICAqIGV4cHJlc3Npb24gaWYgZmluZXIgZ3JhbnVsYXJpdHkgaXMgZGVzaXJlZC5cbiAgICpcbiAgICogQGluc3RhbmNlXG4gICAqIEBtZW1iZXJvZiBTeW50YXhUcmVlXG4gICAqIEBtZXRob2Qg4oy+4qCAZmluZFxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ3xSZWdFeHB9IGRlZmluaXRpb25OYW1lIGEgc3RyaW5nIG9yIHJlZ3VsYXIgZXhwcmVzc2lvbiB1c2VkXG4gICAqIHRvIG1hdGNoIGFnYWluc3QgdGhlIGRlZmluaXRpb24gbmFtZSBmaWVsZCBpbiBhIGdpdmVuIEFTVC5cbiAgICogQHJldHVybiB7T2JqZWN0fG51bGx9IGEgcmVmZXJlbmNlIHRvIHRoZSBpbnRlcm5hbCBkZWZpbml0aW9uIGZpZWxkIG9yXG4gICAqIG51bGwgaWYgb25lIHdpdGggYSBtYXRjaGluZyBuYW1lIGNvdWxkIG5vdCBiZSBmb3VuZC5cbiAgICovXG4gIGZpbmQoZGVmaW5pdGlvbk5hbWU6IHN0cmluZ3xSZWdFeHApOiBPYmplY3QgfCBudWxsIHtcbiAgICAvLyAkQ29tcHV0ZWRUeXBlXG4gICAgcmV0dXJuIFN5bnRheFRyZWUuZmluZERlZmluaXRpb24odGhpc1tBU1RfS0VZXSwgZGVmaW5pdGlvbk5hbWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFN5bnRheFRyZWUgaW5zdGFuY2VzIHRoYXQgYXJlIHRvU3RyaW5nKCknZWQgd2lsbCBoYXZlIHRoZSBncmFwaHFsIG1ldGhvZFxuICAgKiBwcmludCgpIGNhbGxlZCBvbiB0aGVtIHRvIGNvbnZlcnQgdGhlaXIgaW50ZXJuYWwgc3RydWN0dXJlcyBiYWNrIHRvIGFcbiAgICogR3JhcGhRTCBJREwgc2NoZW1hIHN5bnRheC4gSWYgdGhlIG9iamVjdCBpcyBpbiBhbiBpbnZhbGlkIHN0YXRlLCBpdCBXSUxMXG4gICAqIHRocm93IGFuIGVycm9yLlxuICAgKlxuICAgKiBAaW5zdGFuY2VcbiAgICogQG1lbWJlcm9mIFN5bnRheFRyZWVcbiAgICogQG1ldGhvZCDijL7ioIB0b1N0cmluZ1xuICAgKlxuICAgKiBAcmV0dXJuIHtzdHJpbmd9IHRoZSBBU1QgZm9yIHRoZSB0cmVlIHBhcnNlZCBiYWNrIGludG8gYSBzdHJpbmdcbiAgICovXG4gIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgLy8gJENvbXB1dGVkVHlwZVxuICAgIHJldHVybiBwcmludCh0aGlzW0FTVF9LRVldKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBIHJ1bnRpbWUgY29uc3RhbnQgZGVub3RpbmcgYSBxdWVyeSB0eXBlLlxuICAgKlxuICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJvZiBTeW50YXhUcmVlXG4gICAqIEBtZXRob2Qg4qyH77iO4qCAUVVFUllcbiAgICogQHJlYWRvbmx5XG4gICAqIEBjb25zdFxuICAgKi9cbiAgc3RhdGljIGdldCBRVUVSWSgpOiBzdHJpbmcgeyByZXR1cm4gJ1F1ZXJ5JyB9XG5cbiAgLyoqXG4gICAqIEEgcnVudGltZSBjb25zdGFudCBkZW5vdGluZyBhIG11dGF0aW9uIHR5cGUuXG4gICAqXG4gICAqIEB0eXBlIHtzdHJpbmd9XG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlcm9mIFN5bnRheFRyZWVcbiAgICogQG1ldGhvZCDirIfvuI7ioIBNVVRBVElPTlxuICAgKiBAcmVhZG9ubHlcbiAgICogQGNvbnN0XG4gICAqL1xuICBzdGF0aWMgZ2V0IE1VVEFUSU9OKCk6IHN0cmluZyB7IHJldHVybiAnTXV0YXRpb24nIH1cblxuICAgIC8qKlxuICAgKiBBIHJ1bnRpbWUgY29uc3RhbnQgZGVub3RpbmcgYSBzdWJzY3JpcHRpb24gdHlwZS5cbiAgICpcbiAgICogQHR5cGUge3N0cmluZ31cbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyb2YgU3ludGF4VHJlZVxuICAgKiBAbWV0aG9kIFNVQlNDUklQVElPTlxuICAgKiBAcmVhZG9ubHlcbiAgICogQGNvbnN0XG4gICAqL1xuICBzdGF0aWMgZ2V0IFNVQlNDUklQVElPTigpOiBzdHJpbmcgeyByZXR1cm4gJ1N1YnNjcmlwdGlvbicgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBgY29uc3RydWN0b3JgIG5hbWUuIElmIGludm9rZWQgYXMgdGhlIGNvbnRleHQsIG9yIGB0aGlzYCxcbiAgICogb2JqZWN0IG9mIHRoZSBgdG9TdHJpbmdgIG1ldGhvZCBvZiBgT2JqZWN0YCdzIGBwcm90b3R5cGVgLCB0aGUgcmVzdWx0aW5nXG4gICAqIHZhbHVlIHdpbGwgYmUgYFtvYmplY3QgTXlDbGFzc11gLCBnaXZlbiBhbiBpbnN0YW5jZSBvZiBgTXlDbGFzc2BcbiAgICpcbiAgICogQG1ldGhvZCDijL7ioIBbU3ltYm9sLnRvU3RyaW5nVGFnXVxuICAgKiBAbWVtYmVyb2YgU3ludGF4VHJlZVxuICAgKlxuICAgKiBAcmV0dXJuIHtzdHJpbmd9IHRoZSBuYW1lIG9mIHRoZSBjbGFzcyB0aGlzIGlzIGFuIGluc3RhbmNlIG9mXG4gICAqIEBDb21wdXRlZFR5cGVcbiAgICovXG4gIGdldCBbU3ltYm9sLnRvU3RyaW5nVGFnXSgpIHsgcmV0dXJuIHRoaXMuY29uc3RydWN0b3IubmFtZSB9XG5cbiAgLyoqXG4gICAqIEFwcGxpZXMgdGhlIHNhbWUgbG9naWMgYXMge0BsaW5rICNbU3ltYm9sLnRvU3RyaW5nVGFnXX0gYnV0IG9uIGEgc3RhdGljXG4gICAqIHNjYWxlLiBTbywgaWYgeW91IHBlcmZvcm0gYE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChNeUNsYXNzKWBcbiAgICogdGhlIHJlc3VsdCB3b3VsZCBiZSBgW29iamVjdCBNeUNsYXNzXWAuXG4gICAqXG4gICAqIEBtZXRob2Qg4oy+4qCAW1N5bWJvbC50b1N0cmluZ1RhZ11cbiAgICogQG1lbWJlcm9mIFN5bnRheFRyZWVcbiAgICogQHN0YXRpY1xuICAgKlxuICAgKiBAcmV0dXJuIHtzdHJpbmd9IHRoZSBuYW1lIG9mIHRoaXMgY2xhc3NcbiAgICogQENvbXB1dGVkVHlwZVxuICAgKi9cbiAgc3RhdGljIGdldCBbU3ltYm9sLnRvU3RyaW5nVGFnXSgpIHsgcmV0dXJuIHRoaXMubmFtZSB9XG5cbiAgLyoqXG4gICAqIEdpdmVuIG9uZSBvZiwgYSB2YWxpZCBHcmFwaFFMIElETCBzY2hlbWEgc3RyaW5nLCBhIHZhbGlkIEdyYXBoUUwgQVNUIG9yXG4gICAqIGFuIGluc3RhbmNlIG9mIFN5bnRheFRyZWUsIHRoZSBzdGF0aWMgZnJvbSgpIG1ldGhvZCB3aWxsIGNyZWF0ZSBhIG5ld1xuICAgKiBpbnN0YW5jZSBvZiB0aGUgU3ludGF4VHJlZSB3aXRoIHRoZSB2YWx1ZXMgeW91IHByb3ZpZGUuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlcm9mIFN5bnRheFRyZWVcbiAgICogQG1ldGhvZCDijL7ioIBmcm9tXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfE9iamVjdHxTeW50YXhUcmVlfSBtaXhlZCBhbiBpbnN0YW5jZSBvZiBvbmUgb2YgdGhlIHZhbGlkXG4gICAqIHR5cGVzIHNwZWNpZmllZCBhYm92ZS4gRXZlcnl0aGluZyBlbHNlIHdpbGwgcmVzdWx0IGluIGEgbnVsbCB2YWx1ZS5cbiAgICogQHJldHVybiB7U3ludGF4VHJlZX0gYSBuZXdseSBjcmVhdGVkIGFuZCBwb3B1bGF0ZWQgaW5zdGFuY2Ugb2YgU3ludGF4VHJlZVxuICAgKiBvciBudWxsIGlmIGFuIGludmFsaWQgdHlwZSB3YXMgc3VwcGxpZWQgZm9yIG1peGVkLlxuICAgKi9cbiAgc3RhdGljIGZyb20obWl4ZWQ6IHN0cmluZyB8IE9iamVjdCB8IFN5bnRheFRyZWUpOiBTeW50YXhUcmVlIHwgbnVsbCB7XG4gICAgbGV0IHNjaGVtYTogc3RyaW5nO1xuICAgIGxldCBhc3Q6IE9iamVjdDtcblxuICAgIHN3aXRjaCAodHlwZU9mKG1peGVkKSkge1xuICAgICAgY2FzZSBTdHJpbmcubmFtZTpcbiAgICAgICAgc2NoZW1hID0gKG1peGVkOiBhbnkpO1xuICAgICAgICB0cnkgeyBwYXJzZShzY2hlbWEpIH0gY2F0Y2goZXJyb3IpIHsgbGwuZXJyb3IoZXJyb3IpOyByZXR1cm4gbnVsbDsgfVxuXG4gICAgICAgIHJldHVybiBTeW50YXhUcmVlLmZyb21TY2hlbWEoU3RyaW5nKHNjaGVtYSkpO1xuICAgICAgY2FzZSBPYmplY3QubmFtZTpcbiAgICAgICAgYXN0ID0gKG1peGVkOiBhbnkpO1xuICAgICAgICB0cnkgeyBwcmludChhc3QpIH0gY2F0Y2goZXJyb3IpIHsgcmV0dXJuIG51bGw7IH1cblxuICAgICAgICByZXR1cm4gU3ludGF4VHJlZS5mcm9tQVNUKGFzdCk7XG4gICAgICBjYXNlIFN5bnRheFRyZWUubmFtZTpcbiAgICAgICAgc2NoZW1hID0gbWl4ZWQudG9TdHJpbmcoKTtcblxuICAgICAgICByZXR1cm4gU3ludGF4VHJlZS5mcm9tKHNjaGVtYSk7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2VuZXJhdGVzIGEgbmV3IGluc3RhbmNlIG9mIFN5bnRheFRyZWUgZnJvbSB0aGUgc3VwcGxpZWQsIHZhbGlkLCBHcmFwaFFMXG4gICAqIHNjaGVtYS4gVGhpcyBtZXRob2QgZG9lcyBub3QgcGVyZm9ybSB0cnkvY2F0Y2ggdmFsaWRhdGlvbiBhbmQgaWYgYW5cbiAgICogaW52YWxpZCBHcmFwaFFMIHNjaGVtYSBpcyBzdXBwbGllZCBhbiBlcnJvciB3aWxsIGJlIHRocm93bi5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyb2YgU3ludGF4VHJlZVxuICAgKiBAbWV0aG9kIOKMvuKggGZyb21TY2hlbWFcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHNjaGVtYSBhIHZhbGlkIEdyYXBoUUwgSURMIHNjaGVtYSBzdHJpbmcuXG4gICAqIEByZXR1cm4ge1N5bnRheFRyZWV9IGEgbmV3IGluc3RhbmNlIG9mIFN5bnRheFRyZWUgaW5pdGlhbGl6ZWQgd2l0aCBhXG4gICAqIHBhcnNlZCByZXNwb25zZSBmcm9tIHJlcXVpcmUoJ2dyYXBocWwnKS5wYXJzZSgpLlxuICAgKi9cbiAgc3RhdGljIGZyb21TY2hlbWEoc2NoZW1hOiBzdHJpbmcpOiBTeW50YXhUcmVlIHtcbiAgICBjb25zdCBhc3QgPSBwYXJzZShzY2hlbWEpO1xuICAgIGxldCB0cmVlID0gbmV3IFN5bnRheFRyZWUoYXN0KTtcblxuICAgIHJldHVybiB0cmVlO1xuICB9XG5cbiAgLyoqXG4gICAqIEdlbmVyYXRlcyBhIG5ldyBpbnN0YW5jZSBvZiBTeW50YXhUcmVlIGZyb20gdGhlIHN1cHBsaWVkLCB2YWxpZCwgR3JhcGhRTFxuICAgKiBzY2hlbWEuIFRoaXMgbWV0aG9kIGRvZXMgbm90IHBlcmZvcm0gdHJ5L2NhdGNoIHZhbGlkYXRpb24gYW5kIGlmIGFuXG4gICAqIGludmFsaWQgR3JhcGhRTCBzY2hlbWEgaXMgc3VwcGxpZWQgYW4gZXJyb3Igd2lsbCBiZSB0aHJvd24uXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlcm9mIFN5bnRheFRyZWVcbiAgICogQG1ldGhvZCDijL7ioIBmcm9tQVNUXG4gICAqXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBhc3QgYSB2YWxpZCBHcmFwaFFMIEFTVCBvYmplY3QuXG4gICAqIEByZXR1cm4ge1N5bnRheFRyZWV9IGEgbmV3IGluc3RhbmNlIG9mIFN5bnRheFRyZWUgaW5pdGlhbGl6ZWQgd2l0aCBhXG4gICAqIHN1cHBsaWVkIGFic3RyYWN0IHN5bnRheCB0cmVlIGdlbmVyYXRlZCBieSByZXF1aXJlKCdncmFwaHFsJykucGFyc2UoKSBvclxuICAgKiBvdGhlciBjb21wYXRpYmxlIG1ldGhvZC5cbiAgICovXG4gIHN0YXRpYyBmcm9tQVNUKGFzdDogT2JqZWN0KTogU3ludGF4VHJlZSB8IG51bGwge1xuICAgIGNvbnN0IHNvdXJjZSA9IHBhcnNlKHByaW50KGFzdCkpO1xuICAgIGxldCB0cmVlID0gbmV3IFN5bnRheFRyZWUoc291cmNlKTtcblxuICAgIHJldHVybiBzb3VyY2UgPyB0cmVlIDogbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBJdGVyYXRlIHRocm91Z2ggdGhlIGRlZmluaXRpb25zIG9mIHRoZSBBU1QgaWYgdGhlcmUgYXJlIGFueS4gRm9yIGVhY2hcbiAgICogZGVmaW5pdGlvbiB0aGUgbmFtZSBwcm9wZXJ0eSdzIHZhbHVlIGZpZWxkIGlzIGNvbXBhcmVkIHRvIHRoZSBzdXBwbGllZFxuICAgKiBkZWZpbml0aW9uTmFtZS4gVGhlIGRlZmluaXRpb25OYW1lIGNhbiBiZSBhIHN0cmluZyBvciBhIHJlZ3VsYXJcbiAgICogZXhwcmVzc2lvbiBpZiBmaW5lciBncmFudWxhcml0eSBpcyBkZXNpcmVkLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJvZiBTeW50YXhUcmVlXG4gICAqIEBtZXRob2Qg4oy+4qCAZmluZERlZmluaXRpb25cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IGFzdCBhbiBhYnN0cmFjdCBzeW50YXggdHJlZSBvYmplY3QgY3JlYXRlZCBmcm9tIGEgR1FMIFNETFxuICAgKiBAcGFyYW0ge3N0cmluZ3xSZWdFeHB9IGRlZmluaXRpb25OYW1lIGEgc3RyaW5nIG9yIHJlZ3VsYXIgZXhwcmVzc2lvbiB1c2VkXG4gICAqIHRvIG1hdGNoIGFnYWluc3QgdGhlIGRlZmluaXRpb24gbmFtZSBmaWVsZCBpbiBhIGdpdmVuIEFTVC5cbiAgICogQHJldHVybiB7T2JqZWN0fG51bGx9IGEgcmVmZXJlbmNlIHRvIHRoZSBpbnRlcm5hbCBkZWZpbml0aW9uIGZpZWxkIG9yXG4gICAqIG51bGwgaWYgb25lIHdpdGggYSBtYXRjaGluZyBuYW1lIGNvdWxkIG5vdCBiZSBmb3VuZC5cbiAgICovXG4gIHN0YXRpYyBmaW5kRGVmaW5pdGlvbihhc3Q6IE9iamVjdCwgZGVmaW5pdGlvbk5hbWU6IHN0cmluZyB8IFJlZ0V4cCkge1xuICAgIHJldHVybiB0aGlzLmZpbmRJbkFTVEFycmF5QnlOYW1lVmFsdWUoXG4gICAgICBhc3QuZGVmaW5pdGlvbnMsXG4gICAgICBkZWZpbml0aW9uTmFtZVxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogSXRlcmF0ZSB0aHJvdWdoIHRoZSBmaWVsZHMgb2YgYSBkZWZpbml0aW9uIEFTVCBpZiB0aGVyZSBhcmUgYW55LiBGb3IgZWFjaFxuICAgKiBmaWVsZCwgdGhlIG5hbWUgcHJvcGVydHkncyB2YWx1ZSBmaWVsZCBpcyBjb21wYXJlZCB0byB0aGUgc3VwcGxpZWRcbiAgICogZmllbGROYW1lLiBUaGUgZmllbGROYW1lIGNhbiBiZSBhIHN0cmluZyBvciBhIHJlZ3VsYXIgZXhwcmVzc2lvbiBpZlxuICAgKiBmaW5lciBncmFudWxhcml0eSBpcyBkZXNpcmVkLlxuICAgKlxuICAgKiBCZWZvcmUgaXRlcmF0aW5nIG92ZXIgdGhlIGZpZWxkcywgaG93ZXZlciwgdGhlIGRlZmluaXRpb24gaXMgZm91bmQgdXNpbmdcbiAgICogYFN5bnRheFRyZWUjZmluZERlZmluaXRpb25gLiBJZiBlaXRoZXIgdGhlIGZpZWxkIG9yIGRlZmluaXRpb24gYXJlIG5vdFxuICAgKiBmb3VuZCwgbnVsbCBpcyByZXR1cm5lZC5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyb2YgU3ludGF4VHJlZVxuICAgKiBAbWV0aG9kIOKMvuKggGZpbmRGaWVsZFxuICAgKiBAc2luY2UgMi43LjBcbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IGFzdCBhbiBhYnN0cmFjdCBzeW50YXggdHJlZSBvYmplY3QgY3JlYXRlZCBmcm9tIGEgR1FMIFNETFxuICAgKiBAcGFyYW0ge3N0cmluZ3xSZWdFeHB9IGRlZmluaXRpb25OYW1lIGEgc3RyaW5nIG9yIHJlZ3VsYXIgZXhwcmVzc2lvbiB1c2VkXG4gICAqIHRvIG1hdGNoIGFnYWluc3QgdGhlIGRlZmluaXRpb24gbmFtZSBmaWVsZCBpbiBhIGdpdmVuIEFTVC5cbiAgICogQHBhcmFtIHtzdHJpbmd8UmVnRXhwfSBmaWVsZE5hbWUgYSBzdHJpbmcgb3IgcmVndWxhciBleHByZXNzaW9uIHVzZWRcbiAgICogdG8gbWF0Y2ggYWdhaW5zdCB0aGUgZmllbGQgbmFtZSBmaWVsZCBpbiBhIGdpdmVuIEFTVC5cbiAgICogQHJldHVybiB7T2JqZWN0fG51bGx9IGFuIG9iamVjdCBjb250YWluaW5nIHR3byBrZXlzLCB0aGUgZmlyc3QgYmVpbmdcbiAgICogYGZpZWxkYCB3aGljaCBwb2ludHMgdG8gdGhlIHJlcXVlc3RlZCBBU1QgZGVmaW5pdGlvbiBmaWVsZC4gVGhlIHNlY29uZFxuICAgKiBiZWluZyBgbWV0YWAgd2hpY2ggY29udGFpbnMgdGhyZWUgY29tbW9ubHkgcmVxdWVzdGVkIGJpdHMgb2YgZGF0YTsgYG5hbWVgLFxuICAgKiBgdHlwZWAgYW5kIGBudWxsYWJsZWAuIE5vbi1udWxsYWJsZSBmaWVsZHMgaGF2ZSB0aGVpciBhY3R1YWwgdHlwZSB3cmFwcGVkXG4gICAqIGluIGEgYE5vbk51bGxUeXBlYCBHcmFwaFFMIGNvbnN0cnVjdC4gVGhlIGFjdHVhbCBmaWVsZCB0eXBlIGlzIGNvbnRhaW5lZFxuICAgKiB3aXRoaW4uIFRoZSBtZXRhIG9iamVjdCBzdXJmYWNlcyB0aG9zZSB2YWx1ZXMgZm9yIGVhc3kgdXNlLlxuICAgKi9cbiAgc3RhdGljIGZpbmRGaWVsZChcbiAgICBhc3Q6IE9iamVjdCxcbiAgICBkZWZpbml0aW9uTmFtZTogc3RyaW5nIHwgUmVnRXhwLFxuICAgIGZpZWxkTmFtZTogc3RyaW5nIHwgUmVnRXhwXG4gICkge1xuICAgIGNvbnN0IGRlZmluaXRpb24gPSB0aGlzLmZpbmREZWZpbml0aW9uKGFzdCwgZGVmaW5pdGlvbk5hbWUpXG4gICAgbGV0IG1ldGE7XG5cbiAgICBpZiAoIWRlZmluaXRpb24gfHwgIWRlZmluaXRpb24uZmllbGRzKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBmaWVsZCA9IHRoaXMuZmluZEluQVNUQXJyYXlCeU5hbWVWYWx1ZShkZWZpbml0aW9uLmZpZWxkcywgZmllbGROYW1lKVxuXG4gICAgaWYgKGZpZWxkKSB7XG4gICAgICBtZXRhID0ge1xuICAgICAgICBuYW1lOiBmaWVsZC5uYW1lICYmIGZpZWxkLm5hbWUudmFsdWUgfHwgbnVsbCxcbiAgICAgICAgdHlwZTogZmllbGQudHlwZSAmJiBmaWVsZC50eXBlLmtpbmQgPT09ICdOb25OdWxsVHlwZSdcbiAgICAgICAgICA/IGZpZWxkLnR5cGUudHlwZS5uYW1lLnZhbHVlXG4gICAgICAgICAgOiBmaWVsZC50eXBlICYmIGZpZWxkLnR5cGUubmFtZSAmJiBmaWVsZC50eXBlLm5hbWUudmFsdWUgfHwgbnVsbCxcbiAgICAgICAgbnVsbGFibGU6ICEhKGZpZWxkLnR5cGUgJiYgZmllbGQudHlwZS5raW5kICE9PSAnTm9uTnVsbFR5cGUnKVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB7IGZpZWxkLCBtZXRhIH07XG4gIH1cblxuICAvKipcbiAgICogRW51bSBBU1QgZGVmaW5pdGlvbnMgb3BlcmF0ZSBkaWZmZXJlbnRseSB0aGFuIG9iamVjdCB0eXBlIGRlZmluaXRpb25zXG4gICAqIGRvLiBOYW1lbHksIHRoZXkgZG8gbm90IGhhdmUgYSBgZmllbGRzYCBhcnJheSBidXQgaW5zdGVhZCBoYXZlIGEgYHZhbHVlc2BcbiAgICogYXJyYXkuIFRoaXMgd3JhcHBlciBtZXRob2QsIGZpcnN0IGZpbmRzIHRoZSBlbnVtIGRlZmluaXRpb24gaW4gdGhlIGFzdFxuICAgKiBhbmQgdGhlbiBzZWFyY2hlcyB0aGUgdmFsdWVzIGZvciB0aGUgbmFtZWQgbm9kZSBkZXNpcmVkIGFuZCByZXR1cm5zIHRoYXRcbiAgICogb3IgbnVsbCwgaWYgb25lIGNvdWxkIG5vdCBiZSBmb3VuZC5cbiAgICpcbiAgICogQG1ldGhvZCBTeW50YXhUcmVlI+KMvuKggGZpbmRFbnVtRGVmaW5pdGlvblxuICAgKiBAc2luY2UgMi43LjBcbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IGFzdCB0aGUgYWJzdHJhY3Qgc3ludGF4IHRyZWUgcGFyc2VkIGJ5IGdyYXBocWxcbiAgICogQHBhcmFtIHtzdHJpbmd8UmVnRXhwfSBlbnVtRGVmaW5pdGlvbk5hbWUgYSBzdHJpbmcgb3IgcmVndWxhciBleHByZXNzaW9uXG4gICAqIHVzZWQgdG8gbG9jYXRlIHRoZSBlbnVtIGRlZmluaXRpb24gaW4gdGhlIEFTVC5cbiAgICogQHBhcmFtIHtzdHJpbmd8UmVnRXhwfSBlbnVtVmFsdWVOYW1lIGEgc3RyaW5nIG9yIHJlZ3VsYXIgZXhwcmVzc2lvbiB1c2VkXG4gICAqIHRvIGxvY2F0ZSB0aGUgdmFsdWUgYnkgbmFtZSBpbiB0aGUgdmFsdWVzIG9mIHRoZSBlbnVtIGRlZmluaXRpb24uXG4gICAqIEByZXR1cm4ge09iamVjdHxudWxsfSB0aGUgZGVzaXJlZCBBU1Qgbm9kZSBvciBudWxsIGlmIG9uZSBkb2VzIG5vdCBleGlzdFxuICAgKi9cbiAgc3RhdGljIGZpbmRFbnVtRGVmaW5pdGlvbihcbiAgICBhc3Q6IE9iamVjdCxcbiAgICBlbnVtRGVmaW5pdGlvbk5hbWU6IHN0cmluZyB8IFJlZ0V4cCxcbiAgICBlbnVtVmFsdWVOYW1lOiBzdHJpbmcgfCBSZWdFeHBcbiAgKTogP09iamVjdCB7XG4gICAgLy8gRmV0Y2ggdGhlIGVudW0gZGVmaW5pdGlvblxuICAgIGNvbnN0IGRlZmluaXRpb24gPSB0aGlzLmZpbmREZWZpbml0aW9uKGFzdCwgZW51bURlZmluaXRpb25OYW1lKTtcblxuICAgIC8vIEVuc3VyZSB3ZSBoYXZlIG9uZSBvciB0aGF0IGl0IGhhcyBhIHZhbHVlcyBhcnJheVxuICAgIGlmICghZGVmaW5pdGlvbiB8fCAhZGVmaW5pdGlvbi52YWx1ZXMpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIC8vIFJldHVybiB0aGUgcmVzdWx0cyBvZiBhbiBgZmluZEluQVNUQXJyYXlCeU5hbWVWYWx1ZSgpYCBzZWFyY2ggb2YgdGhlXG4gICAgLy8gYWZvcmVtZW50aW9uZWQgJ3ZhbHVlcycgYXJyYXkuXG4gICAgcmV0dXJuIHRoaXMuZmluZEluQVNUQXJyYXlCeU5hbWVWYWx1ZShcbiAgICAgIGRlZmluaXRpb24udmFsdWVzLFxuICAgICAgZW51bVZhbHVlTmFtZVxuICAgIClcbiAgfVxuXG4gIC8qKlxuICAgKiBBIGxvdCBvZiBzZWFyY2hpbmcgaW4gQVNUcyBpcyBmaWx0ZXJpbmcgdGhyb3VnaCBhcnJheXMgYW5kIG1hdGNoaW5nIG9uXG4gICAqIHN1Ym9iamVjdCBwcm9wZXJ0aWVzIG9uIGVhY2ggaXRlcmF0aW9uLiBBIGNvbW1vbiB0aGVtZSBpcyBmaW5kIHNvbWV0aGluZ1xuICAgKiBieSBpdHMgYC5uYW1lLnZhbHVlYC4gVGhpcyBtZXRob2Qgc2ltcGxpZmllcyB0aGF0IGJ5IHRha2luZyBhbiBhcnJheSBvZlxuICAgKiBBU1Qgbm9kZXMgYW5kIHNlYXJjaGluZyB0aGVtIGZvciBhIGAubmFtZS52YWx1ZWAgcHJvcGVydHkgdGhhdCBleGlzdHNcbiAgICogd2l0aGluLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJvZiBTeW50YXhUcmVlXG4gICAqIEBtZXRob2Qg4oy+4qCAZmluZEluQVNUQXJyYXlCeU5hbWVWYWx1ZVxuICAgKiBAc2luY2UgMi43LjBcbiAgICpcbiAgICogQHBhcmFtIHtBcnJheX0gYXJyYXkgb2YgbWl4ZWQgQVNUIG9iamVjdCBub2RlcyBjb250YWluaW5nIGBuYW1lLnZhbHVlYHNcbiAgICogQHBhcmFtIHtzdHJpbmd8UmVnRXhwfSBuYW1lIGEgc3RyaW5nIG9yIHJlZ3VsYXIgZXhwcmVzc2lvbiB1c2VkXG4gICAqIHRvIG1hdGNoIGFnYWluc3QgdGhlIG5vZGUgbmFtZSB2YWx1ZVxuICAgKiBAcmV0dXJuIHtPYmplY3R8bnVsbH0gdGhlIEFTVCBsZWFmIGlmIG9uZSBtYXRjaGVzIG9yIG51bGwgb3RoZXJ3aXNlLlxuICAgKi9cbiAgc3RhdGljIGZpbmRJbkFTVEFycmF5QnlOYW1lVmFsdWUoXG4gICAgYXJyYXk6IEFycmF5PE9iamVjdD4sXG4gICAgbmFtZTogc3RyaW5nIHwgUmVnRXhwXG4gICk6ID9PYmplY3Qge1xuICAgIGNvbnN0IGlzUmVnRXhwOiBib29sZWFuID0gL1JlZ0V4cC8udGVzdCh0eXBlT2YobmFtZSkpO1xuICAgIGNvbnN0IHJlZ2V4ID0gIWlzUmVnRXhwXG4gICAgICAvLyAkRmxvd0ZpeE1lXG4gICAgICA/IG5ldyBSZWdFeHAoUmVnRXhwLmVzY2FwZShuYW1lLnRvU3RyaW5nKCkpKVxuICAgICAgLy8gJEZsb3dGaXhNZVxuICAgICAgOiAobmFtZTogUmVnRXhwKTtcbiAgICBjb25zdCBmbGFncyA9IHJlZ2V4LmZsYWdzXG4gICAgY29uc3Qgc291cmNlID0gcmVnZXguc291cmNlXG4gICAgY29uc3QgcmVkdWNlciA9IChsYXN0LGN1cixpKSA9PiB7XG4gICAgICBpZiAobGFzdCAhPT0gLTEpIHJldHVybiBsYXN0O1xuICAgICAgaWYgKCFjdXIgfHwgIWN1ci5uYW1lIHx8ICFjdXIubmFtZS52YWx1ZSkgcmV0dXJuIC0xO1xuICAgICAgcmV0dXJuIG5ldyBSZWdFeHAoc291cmNlLCBmbGFncykudGVzdChjdXIubmFtZS52YWx1ZSkgPyBpIDogLTFcbiAgICB9XG4gICAgY29uc3QgaW5kZXggPSBhcnJheS5yZWR1Y2UocmVkdWNlciwgLTEpO1xuXG4gICAgcmV0dXJuICh+aW5kZXgpID8gYXJyYXlbaW5kZXhdIDogbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBRdWVyeSB0eXBlcyBpbiBHcmFwaFFMIGFyZSBhbiBPYmplY3RUeXBlRGVmaW5pdGlvbiBvZiBpbXBvcnRhbmNlIGZvclxuICAgKiBwbGFjZW1lbnQgb24gdGhlIHJvb3Qgb2JqZWN0LiBUaGVyZSBpcyB1dGlsaXR5IGluIGNyZWF0aW5nIGFuIGVtcHR5XG4gICAqIG9uZSB0aGF0IGNhbiBiZSBpbmplY3RlZCB3aXRoIHRoZSBmaWVsZHMgb2Ygb3RoZXIgR3JhcGhRTCBvYmplY3QgcXVlcnlcbiAgICogZW50cmllcy5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyb2YgU3ludGF4VHJlZVxuICAgKiBAbWV0aG9kIOKMvuKggEVtcHR5UXVlcnlcbiAgICpcbiAgICogQHJldHVybiB7U3ludGF4VHJlZX0gYW4gaW5zdGFuY2Ugb2YgU3ludGF4VHJlZSB3aXRoIGEgYmFzZSBBU1QgZ2VuZXJhdGVkXG4gICAqIGJ5IHBhcnNpbmcgdGhlIGdyYXBoIHF1ZXJ5LCBcInR5cGUgUXVlcnkge31cIlxuICAgKi9cbiAgc3RhdGljIEVtcHR5UXVlcnkoKTogP1N5bnRheFRyZWUge1xuICAgIHJldHVybiBTeW50YXhUcmVlLmZyb20oYHR5cGUgJHt0aGlzLlFVRVJZfSB7fWApO1xuICB9XG5cbiAgLyoqXG4gICAqIE11dGF0aW9uIHR5cGVzIGluIEdyYXBoUUwgYXJlIGFuIE9iamVjdFR5cGVEZWZpbml0aW9uIG9mIGltcG9ydGFuY2UgZm9yXG4gICAqIHBsYWNlbWVudCBvbiB0aGUgcm9vdCBvYmplY3QuIFRoZXJlIGlzIHV0aWxpdHkgaW4gY3JlYXRpbmcgYW4gZW1wdHlcbiAgICogb25lIHRoYXQgY2FuIGJlIGluamVjdGVkIHdpdGggdGhlIGZpZWxkcyBvZiBvdGhlciBHcmFwaFFMIG9iamVjdCBtdXRhdGlvblxuICAgKiBlbnRyaWVzLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJvZiBTeW50YXhUcmVlXG4gICAqIEBtZXRob2Qg4oy+4qCARW1wdHlNdXRhdGlvblxuICAgKlxuICAgKiBAcmV0dXJuIHtTeW50YXhUcmVlfSBhbiBpbnN0YW5jZSBvZiBTeW50YXhUcmVlIHdpdGggYSBiYXNlIEFTVCBnZW5lcmF0ZWRcbiAgICogYnkgcGFyc2luZyB0aGUgZ3JhcGggcXVlcnksIFwidHlwZSBNdXRhdGlvbiB7fVwiXG4gICAqL1xuICBzdGF0aWMgRW1wdHlNdXRhdGlvbigpOiA/U3ludGF4VHJlZSB7XG4gICAgcmV0dXJuIFN5bnRheFRyZWUuZnJvbShgdHlwZSAke3RoaXMuTVVUQVRJT059IHt9YCk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIHN0YXJ0aW5nIHBvaW50IGZvciBhIFN5bnRheFRyZWUgdGhhdCB3aWxsIGJlIGJ1aWx0IHVwIHByb2dyYW1tYXRpY2FsbHkuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlcm9mIFN5bnRheFRyZWVcbiAgICogQG1ldGhvZCDijL7ioIBFbXB0eURvY3VtZW50XG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfE9iamVjdHxTeW50YXhUcmVlfSBzY2hlbWFPckFTVE9yU1QgYW55IHZhbGlkIHR5cGUgdGFrZW4gYnlcbiAgICogU3ludGF4VHJlZS5mcm9tKCkgdXNlZCB0byBmdXJ0aGVyIHBvcHVsYXRlIHRoZSBuZXcgZW1wdHkgZG9jdW1lbnRcbiAgICogQHJldHVybiB7U3ludGF4VHJlZX0gYW4gaW5zdGFuY2Ugb2YgU3ludGF4VHJlZSB3aXRoIG5vIGRlZmluaXRpb25zIGFuZCBhXG4gICAqIGtpbmQgc2V0IHRvICdEb2N1bWVudCdcbiAgICovXG4gIHN0YXRpYyBFbXB0eURvY3VtZW50KFxuICAgIHNjaGVtYU9yQVNUT3JTVD86IHN0cmluZyB8IE9iamVjdCB8IFN5bnRheFRyZWVcbiAgKTogU3ludGF4VHJlZSB7XG4gICAgbGV0IHRyZWUgPSBuZXcgU3ludGF4VHJlZSgpO1xuXG4gICAgLy8gRHVlIHRvIG5vcm1hbCB2YWxpZGF0aW9uIG1ldGhvZHMgd2l0aCBBU1RzIChpLmUuIGNvbnZlcnRpbmcgdG8gc3RyaW5nXG4gICAgLy8gYW5kIHRoZW4gYmFjayB0byBhbiBBU1Qgb2JqZWN0KSwgZG9pbmcgdGhpcyB3aXRoIGFuIGVtcHR5IGRvY3VtZW50XG4gICAgLy8gZmFpbHMuIFRoZXJlZm9yZSwgd2UgbWFudWFsbHkgc2V0IHRoZSBkb2N1bWVudCBjb250ZW50cyBoZXJlLiBUaGlzIGFsbG93c1xuICAgIC8vIHRvU3RyaW5nKCksIGNvbnN1bWVEZWZpbml0aW9uKCkgYW5kIHNpbWlsYXIgbWV0aG9kcyB0byBzdGlsbCB3b3JrLlxuICAgIHRyZWUuYXN0ID0ge1xuICAgICAga2luZDogJ0RvY3VtZW50JyxcbiAgICAgIGRlZmluaXRpb25zOiBbXSxcbiAgICAgIGxvYzoge3N0YXJ0OiAwLCBlbmQ6IDB9XG4gICAgfTtcblxuICAgIGlmIChzY2hlbWFPckFTVE9yU1QpIHtcbiAgICAgIHRyZWUuYXBwZW5kRGVmaW5pdGlvbnMoc2NoZW1hT3JBU1RPclNUKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJlZTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTeW50YXhUcmVlO1xuIl19