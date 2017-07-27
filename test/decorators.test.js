import { 
  AdjacentSchema, 
  GQLBase,
  Getters,
  Setters,
  Properties,
  Schema
} from '../dist/lattice'

describe('@AdjacentSchema', () => {
  @AdjacentSchema(module)
  class Sample extends GQLBase { }
  
  it('should add a module getter', () => {
    expect(Sample.module).toEqual(module);
  })
  
  it('should add a SCHEMA property matching ADJACENT_FILE', () => {
    expect(Sample.SCHEMA).toEqual(GQLBase.ADJACENT_FILE)
  })
})

describe('@Getters', () => {
  @Getters('test', 'fun')
  class Sample extends GQLBase { }
  
  const test = 'with jest'
  const fun = 'always'
  
  let instance = new Sample({test, fun})
  
  it('should have a getter for "test"', () => {
    expect(instance.test).toEqual(test)
    expect(() => {
      instance.test = 'Something else'
    }).toThrow();    
  })

  it('should have a getter for "fun"', () => {
    expect(instance.fun).toEqual(fun)
    expect(() => {
      instance.fun = 'Something else'
    }).toThrow();    
  })
})

describe('@Setters', () => {
  @Setters('test', 'fun')
  class Sample extends GQLBase { }
  
  const test = 'with jest'
  const fun = 'always'
  
  let instance = new Sample({test, fun})
  
  it('should have a setter for "test"', () => {    
    expect(() => {
      instance.test = 'Something else'
    }).not.toThrow(); 
    expect(instance.test).toBeUndefined()
  })

  it('should have a setter for "fun"', () => {
    expect(() => {
      instance.fun = 'Something else'
    }).not.toThrow(); 
    expect(instance.fun).toBeUndefined()
  })
})

describe('@Properties', () => {
  @Properties('test', 'fun')
  class Sample extends GQLBase { }
  
  const test = 'with jest'
  const fun = 'always'
  
  let instance = new Sample({test, fun})
  
  it('should have a setter for "test"', () => {    
    expect(instance.test).toEqual(test)
    expect(() => {
      instance.test = 'Something else'
    }).not.toThrow(); 
    expect(instance.test).not.toBeUndefined()
  })

  it('should have a setter for "fun"', () => {
    expect(instance.fun).toEqual(fun)
    expect(() => {
      instance.fun = 'Something else'
    }).not.toThrow(); 
    expect(instance.fun).not.toBeUndefined()
  })
})

describe('@Schema', () => {
  const schema = `
    type Sample {
      name: String!
      id: ID
    }
  `
  
  @Schema(schema)
  class Sample extends GQLBase { }
  
  let instance = new Sample()
  
  it('should have a schema matching ours', () => {
    expect(Sample.SCHEMA).toEqual(schema);
  })
})