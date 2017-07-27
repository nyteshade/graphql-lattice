import { SyntaxTree } from '../dist/lattice'

test('Should convert simple IDL to AST and back', () => {
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
