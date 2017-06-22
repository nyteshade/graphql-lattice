// @flow

import { typeOf } from './utils'
import { print, parse } from 'graphql'

// Shorthand for the key storing the internal AST 
const AST_KEY = Symbol.for('Internal AST Storage Key');

export class SyntaxTree
{
  /**
   * Constructs a new SyntaxTree object. If a string schema is supplied or
   * an already parsed AST object, either of which is valid GraphQL IDL, then
   * its parsed AST will be the internals of this object.
   * 
   * @method constructor
   * @param {string|Object|SyntaxTree} schemaOrASTOrST if supplied the tree 
   * will be constructed with the contents of the data. If a string of IDL is
   * given, it will be parsed. If an AST is given, it will be verified. If a
   * SyntaxTree is supplied, it will be copied.
   */
  constructor(schemaOrASTOrST: string | Object | SyntaxTree | undefined) {
    this[Symbol.toStringTag] = this.constructor.name; 
    this[AST_KEY] = {};
    
    if (schemaOrASTOrST) {
      this.setAST(schemaOrASTOrST);
    }
  }
  
  /** @return {Object} the underlying GraphQL IDL AST object */
  get ast(): Object {
    return this[AST_KEY];
  }
  
  /** @param {Object} value sets the underlying AST object to this value */
  set ast(value: Object): void {
    this[AST_KEY] = value;
  }
  
  /**
   * Sets the underlying AST object with either schema which will be parsed
   * into a valid AST or an existing AST. Previous ast values will be erased.
   * 
   * @method setAST
   * @param {string|Object} schemaOrAST a valid GraphQL IDL schema or a
   * previosuly parsed or compatible GraphQL IDL AST object.
   * @return {SyntaxTree} this for inlining.
   */
  setAST(schemaOrASTOrST: string|Object|SyntaxTree): SyntaxTree {
    this[AST_KEY] = {};
    
    const type = typeOf(schemaOrASTOrST);
    let schema;
    let ast;
    let st;
    
    switch (type) {
      case String.name: 
        try {
          ast = parse(schemaOrASTOrST);
          
          Object.assign(this.ast, ast);
        }
        catch (ignore) { /* Ignore this error */ }
        
        break;
      case Object.name:
        ast = schemaOrASTOrST;
        
        try {
          ast = parse(print(ast));
          Object.assign(this.ast, ast);
        }
        catch (ignore) { /* Ignore this error */ }
        
        break;
      case SyntaxTree.name:
        st = schemaOrASTOrST;
        
        Object.assign(this.ast, st.ast);

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
   * @method updateAST
   * @param {Object} ast an existing GraphQL IDL AST object that will be 
   * merged on top of the existing tree using Object.assign()
   * @return {SyntaxTree} this for inlining.
   */
  updateAST(ast: Object): SyntaxTree {
    if (typeOf(ast) === Object.name) {
      let newAST = Object.assign({}, this.ast, ast);
      
      try {
        print(newAST);
        this.ast = Object.assign(this.ast, ast);
      }
      catch (error) {
        console.error('[SyntaxTree] Failed to updateAST with %o', ast);
        console.error('Resulting object would be %o', newAST);
        console.error(error.message);
        console.error(error.stack);
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
   * @method appendDefinitions
   * @param {string|Object|SyntaxTree} schemaOrASTOrST an instance of one of 
   * the valid types for SyntaxTree.from() that can be used to create or 
   * duplicate the source from which to copy definitions.
   * @return {SyntaxTree} this for inlining 
   */
  appendDefinitions(schemaOrASTOrST: string | Object | SyntaxTree): SyntaxTree {
    const source = SyntaxTree.from(schemaOrASTOrST);
    const set = new Set();    
    
    this.ast.definitions.map((definition) => {
      set.add(definition.name.value);
    })
    
    if (source && source.ast.definitions && this.ast.definitions) {
      for (let theirs of source) {
        let name = theirs.name.value;
        let ours = this.find(name);
        let index = ours && this.ast.definitions.indexOf(ours) || -1;
        
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
                ours.interfaces = [].concat(ours.interfaces, theirs.interfaces)
                ours.directives = [].concat(ours.directives, theirs.directives)
                ours.fields = [].concat(ours.fields, theirs.fields)
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
   * @method consumeDefinition
   * @param {Object|SyntaxTree} astOrSyntaxTree a valid GraphQL IDL AST or
   * an instance of SyntaxTree that represents one.
   * @param {string|RegExp} definitionType a valid search input as would be
   * accepted for the #find() method of this object.
   * @return {SyntaxTree} returns this for inlining
   */
  consumeDefinition(
    astOrSyntaxTree: Object | SyntaxTree, 
    definitionType: string | RegExp = "Query"
  ): SyntaxTree {
    if (!astOrSyntaxTree || !this.ast || !this.ast.definitions) { return this }
    
    const tree = typeOf(SyntaxTree) === SyntaxTree.name 
      ? astOrSyntaxTree
      : SyntaxTree.from(astOrSyntaxTree);      
    let left = this.find(definitionType);
    let right = tree.find(definitionType);    
    
    if (!right) { return this }    
    
    if (!left) {
      console.log('Here')
      console.log('Before', this.ast.definitions)
      this.ast.definitions.push(right);
      console.log('After', this.ast.definitions)
      
      // Remove the copied definition from the source
      tree.ast.definitions.splice(tree.ast.definitions.indexOf(right), 1);
      
      return this;
    }
    
    // TODO support other types aside from ObjectTypeDefinitions
    // TODO see if there is a better way to achieve this with built-in
    // graphql code someplace
    switch(left.kind) {
      case 'ObjectTypeDefinition':
        if (left.interfaces && right.interfaces) {
          left.interfaces = [].concat(left.interfaces, right.interfaces);
        }
        if (left.directives && right.directives) {
          left.directives = [].concat(left.directives, right.directives);
        }
        if (left.fields && right.fields) {
          console.log('Left fields before', left.fields);
          console.log('Right fields', right.fields);
          left.fields = [].concat(left.fields, right.fields);
          console.log('Left fields after', left.fields);
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
   */ 
  *[Symbol.iterator](): any {
    if (this[AST_KEY].definitions) {
      return yield* this[AST_KEY].definitions;
    }
    else {
      return yield* this;
    }
  }
  
  /**
   * Iterate through the definitions of the AST if there are any. For each
   * definition the name property's value field is compared to the supplied 
   * definitionName. The definitionName can be a string or a regular
   * expression if finer granularity is desired. 
   * 
   * @method find
   * @param {string|RegExp} definitionName a string or regular expression used
   * to match against the definition name field in a given AST. 
   * @return {Object|null} a reference to the internal definition field or 
   * null if one with a matching name could not be found.
   */
  find(definitionName: string|RegExp): Object | null {
    const isRegExp = /RegExp/.test(typeOf(definitionName));
    const regex = !isRegExp 
      ? new RegExp(RegExp.escape(definitionName.toString())) 
      : definitionName;
    const flags = regex.flags;
    const source = regex.source;
    const reducer = (last,cur,i) => {
      if (last !== -1) return last;
      return new RegExp(source, flags).test(cur.name.value) ? i : -1
    }
    const index = this[AST_KEY].definitions.reduce(reducer, -1);
    
    return (~index) ? this[AST_KEY].definitions[index] : null;
  }
  
  /**
   * SyntaxTree instances that are toString()'ed will have the graphql method
   * print() called on them to convert their internal structures back to a
   * GraphQL IDL schema syntax. If the object is in an invalid state, it WILL
   * throw an error.
   * 
   * @method toString
   * @return {[type]} [description]
   */
  toString(): string {
    return print(this[AST_KEY]);
  }
  
  /** @type {string} QUERY a runtime constant denoting the Query type */
  static get QUERY(): string { return 'Query' }
  
  /** @type {string} QUERY a runtime constant denoting the Mutation type */
  static get MUTATION(): string { return 'Mutation' }

  /** @return {string} dynamically determined named of class */
  static get [Symbol.toStringTag](): string { return SyntaxTree.name; }
  
  /**
   * Given one of, a valid GraphQL IDL schema string, a valid GraphQL AST or
   * an instance of SyntaxTree, the static from() method will create a new 
   * instance of the SyntaxTree with the values you provide.
   * 
   * @method from
   * @param {String|Object|SyntaxTree} mixed an instance of one of the valid
   * types specified above. Everything else will result in a null value.
   * @return {SyntaxTree} a newly created and populated instance of SyntaxTree
   * or null if an invalid type was supplied for mixed.
   */
  static from(mixed: string | Object | SyntaxTree): SyntaxTree | null {
    let schema;
    let ast;
    
    switch (typeOf(mixed)) {
      case String.name:
        schema = mixed;
        try { parse(schema) } catch(error) { console.log(error); return null; }
        
        return SyntaxTree.fromSchema(schema);
      case Object.name:
        ast = mixed;
        try { print(ast) } catch(error) { return null; }
        
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
   * @method fromSchema
   * @param {string} schema a valid GraphQL IDL schema string.
   * @return {SyntaxTree} a new instance of SyntaxTree initialized with a 
   * parsed response from require('graphql').parse().
   */
  static fromSchema(schema: string): SyntaxTree {
    const ast = parse(schema);
    let tree = new SyntaxTree(ast);
    
    return tree;
  }
  
  /**
   * Generates a new instance of SyntaxTree from the supplied, valid, GraphQL 
   * schema. This method does not perform try/catch validation and if an
   * invalid GraphQL schema is supplied an error will be thrown.
   * 
   * @method fromAST
   * @param {object} ast a valid GraphQL AST object.
   * @return {SyntaxTree} a new instance of SyntaxTree initialized with a 
   * supplied abstract syntax tree generated by require('graphql').parse() or
   * other compatible method.
   */
  static fromAST(ast: Object): SyntaxTree | null {
    const source = parse(print(ast));
    let tree = new SyntaxTree(source);
    
    return source ? tree : null;
  }
  
  /**
   * Query types in GraphQL are an ObjectTypeDefinition of importance for 
   * placement on the root object. There is utility in creating an empty 
   * one that can be injected with the fields of other GraphQL object query 
   * entries.
   *
   * @method EmptyQuery
   * @return {SyntaxTree} an instance of SyntaxTree with a base AST generated 
   * by parsing the graph query, "type Query {}"
   */
  static EmptyQuery(): SyntaxTree {
    return SyntaxTree.from(`type ${this.QUERY} {}`);
  }
  
  /**
   * Mutation types in GraphQL are an ObjectTypeDefinition of importance for 
   * placement on the root object. There is utility in creating an empty 
   * one that can be injected with the fields of other GraphQL object mutation 
   * entries.
   *
   * @method EmptyMutation
   * @return {SyntaxTree} an instance of SyntaxTree with a base AST generated 
   * by parsing the graph query, "type Mutation {}"
   */
  static EmptyMutation(): SyntaxTree {
    return SyntaxTree.from(`type ${this.MUTATION} {}`);
  }
  
  /**
   * The starting point for a SyntaxTree that will be built up programmatically.
   *
   * @method EmptyDocument
   * @param {string|Object|SyntaxTree} schemaOrASTOrST any valid type taken by
   * SyntaxTree.from() used to further populate the new empty document
   * @return {SyntaxTree} an instance of SyntaxTree with no definitions and a
   * kind set to 'Document'
   */
  static EmptyDocument(
    schemaOrASTOrST: string | Object | SyntaxTree | undefined
  ): SyntaxTree {
    let tree = new SyntaxTree();
    
    // Due to normal validation methods with ASTs (i.e. converting to string 
    // and then back to an AST object), doing this with an empty document
    // fails. Therefore, we manually set the document contents here. This allows
    // toString(), consumeDefinition() and similar methods to still work.
    tree.ast = {
      kind: 'Document',
      definitions: [],
      loc: {start: 0, end: 0}
    };
    
    if (schemaOrASTOrST) {
      tree.appendDefinitions(schemaOrASTOrST);
    }
    
    return tree;
  }
}

export default SyntaxTree;

// repl testing
// require('./bootstrap'); let typeOf = require('./lib/utils').typeOf, GQL=require('graphql'), ST = require('./lib/GraphQL/SyntaxTree').SyntaxTree, schema = `input MessageInput { content: String author: String } type Message { id: ID! content: String author: String } type Query { getMessage(id: ID!): Message } type Mutation { createMessage(input: MessageInput): Message updateMessage(id: ID!, input: MessageInput): Message }`, ast = GQL.parse(schema), st = ST.fromSchema(schema), query = ST.EmptyQuery(), mutation = ST.EmptyMutation()