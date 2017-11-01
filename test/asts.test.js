import { SyntaxTree } from '../es6/lattice'
import { parse } from 'graphql'

describe('validate IDL -> AST -> IDL works properly', () => {
  it('Should convert simple IDL to AST and back', () => {
    const IDL = `
      type Person {
        name: String
        job: String
      }
      
      type Query {
        person: Person
      }
    `
    
    const tree = new SyntaxTree(IDL);
    const ast = tree.ast;
    
    expect(Object.keys(ast).length).toBeGreaterThan(0)
    expect(tree.toString().replace(/\s/g, '')).toEqual(IDL.replace(/\s/g, ''))    
  })  
})

describe('Validate search static methods of SyntaxTree work properly', () => {
  const ast = parse(`
      type Person {
        name: String
        job: String
        status: Status
      }
      
      enum Status {
        SINGLE,
        MARRIED,
        DIVORCED
      }
  `)

  it('should be able to find an object type definition', () => {
    const node = SyntaxTree.findDefinition(ast, 'Person');
    expect(node).not.toBeNull();
    expect(node.name.value).toBe('Person')
  })
  
  it('should return null for a non-existent node', () => {
    const node = SyntaxTree.findDefinition(ast, 'Employee');
    expect(node).toBeNull();
  })
  
  it('should be able to find an enum by value', () => {
    const node = SyntaxTree.findEnumDefinition(ast, 'Status', 'MARRIED')
    expect(node).not.toBeNull();
    expect(node.name.value).toBe('MARRIED')    
  })
})

