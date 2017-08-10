import { 
  AdjacentSchema, 
  GQLBase,
  Getters,
  Setters,
  Properties,
  Schema
} from '../dist/lattice'

import { typeOf } from '../dist/lattice'

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
  
  @Getters(['name', 'firstName'], 'job')
  class Employee extends GQLBase { }
  
  @Getters(['employee', '_emp', Employee])
  class Person extends GQLBase { }
  
  const test = 'with jest'
  const fun = 'always'  
  const firstName = 'Jane'
  const job = 'Engineer'  
  const instance = new Sample({test, fun})
  const employee = new Employee({firstName, job})
  const person = new Person({_emp: {firstName, job}})
  
  it('should have a getter for "test"', () => {
    expect(instance.test).toEqual(test)
    expect(() => {
      instance.test = 'Something else'
    }).toThrow();    
    expect(instance.test).toEqual(test)
  })

  it('should have a getter for "fun"', () => {
    expect(instance.fun).toEqual(fun)
    expect(() => {
      instance.fun = 'Something else'
    }).toThrow();    
    expect(instance.fun).toEqual(fun)
  })
  
  it('should allow for remapping between type fields and model fields', () => {
    expect(employee.name).toEqual(firstName)
    expect(employee.job).toEqual(job);
  })
  
  it('should return an actual Employee object', () => {
    expect(typeOf(person.employee)).toEqual(Employee.name)
  })
})

describe('@Setters', () => {
  @Setters('test', 'fun')
  class Sample extends GQLBase { }

  @Setters(['name', 'firstName'], 'job')
  class Employee extends GQLBase { }
  
  const test = 'with jest'
  const fun = 'always'  
  const firstName = 'Brielle'
  const job = 'Engineer'  
  const instance = new Sample({test, fun})
  const employee = new Employee({firstName, job})
  
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
  
  it('should allow for remapping between type fields and model fields', () => {
    expect(() => {
      employee.name = 'Dorkis'
      employee.job = 'Vendor'
    }).not.toThrow()
    
    expect(employee.model.firstName).toEqual('Dorkis')
    expect(employee.model.job).toEqual('Vendor');
  })
})

describe('@Properties', () => {
  @Properties('test', 'fun')
  class Sample extends GQLBase { }

  @Properties(['name', 'firstName'], 'job')
  class Employee extends GQLBase { }
  
  const test = 'with jest'
  const fun = 'always'
  const firstName = 'Brielle'
  const job = 'Engineer'  
  const instance = new Sample({test, fun})
  const employee = new Employee({firstName, job})
  
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
  
  it('should allow for remapping between type fields and model fields', () => {
    expect(employee.name).toEqual(firstName);
    expect(employee.job).toEqual(job);
    expect(() => {
      employee.name = 'Dorkis'
      employee.job = 'Vendor'
    }).not.toThrow()
    
    expect(employee.name).toEqual('Dorkis')
    expect(employee.job).toEqual('Vendor');
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