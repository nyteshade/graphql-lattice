import {
  AdjacentSchema,
  GQLBase,
  GQLEnum,
  Getters,
  Setters,
  Properties,
  Schema,
  SchemaUtils,
  SyntaxTree,

  resolver,
  mutator,
  subscriptor,

  META_KEY,
  MODEL_KEY,
  AUTO_PROPS,
  PROPS,
  GETTERS,
  SETTERS,

  typeOf,
  types,
  DirectTypeManager
} from '../es6/lattice'

import { parse } from 'graphql'
import { inspect } from 'util'

const { isOfType } = types;

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
  @Schema('type Sample {test: String fun: String}')
  @Getters('test', 'fun')
  class Sample extends GQLBase { }

  @Schema('type Employee {name: String job: String}')
  @Getters(['name', 'firstName'], 'job')
  class Employee extends GQLBase { }

  @Schema('type Person {employee: Employee}')
  @Getters(['employee', '_emp', Employee])
  class Person extends GQLBase { }

  @Getters('broken')
  class InvalidGQLBase extends GQLBase { }

  const test = 'with jest'
  const fun = 'always'
  const firstName = 'Jane'
  const job = 'Engineer'
  const broken = 'It is just broke'
  const instance = new Sample({test, fun}, null, {autoProps: false})
  const employee = new Employee({firstName, job}, null, {autoProps: false})
  const person = new Person({_emp: {firstName, job}}, null, {autoProps: false})
  const invalid = new InvalidGQLBase({broken}, null, {autoProps: false})

  it('should have a getter for "test"', () => {
    expect(instance.test).toEqual(test)
    expect(() => {
      instance.test = 'Something else'
    }).toThrow();
    expect(instance.test).toEqual(test)
  })

  it('should allow for remapping between type fields and model fields', () => {
    expect(employee.name).toEqual(firstName)
    expect(employee.job).toEqual(job);
  })

  it('should return an actual Employee object', () => {
    expect(typeOf(person.employee)).toEqual(Employee.name)
    expect(person.employee.name).toEqual(firstName)
  })

  it('should throw an error due to a missing SCHEMA', () => {
    expect(() => {
      invalid.broken
    }).toThrow()
  })

  it('should have appropriately defined GETTERS tags', async () => {
    const sampleGetters = Object.keys(Sample[META_KEY][GETTERS])
    const sampleFields = ['test', 'fun']
    const employeeGetters = Object.keys(Employee[META_KEY][GETTERS])
    const employeeFields = ['name', 'job']
    const personGetters = Object.keys(Person[META_KEY][GETTERS])
    const personFields = ['employee']

    expect(sampleGetters).toEqual(expect.arrayContaining(sampleFields))
    expect(employeeGetters).toEqual(expect.arrayContaining(employeeFields))
    expect(personGetters).toEqual(expect.arrayContaining(personFields))
  })
})

describe('@Setters', () => {
  @Schema('type Sample {test: String fun: String}')
  @Setters('test', 'fun')
  class Sample extends GQLBase { }

  @Schema('type Employee {name: String job: String}')
  @Setters(['name', 'firstName'], 'job')
  class Employee extends GQLBase { }

  @Schema('type Person {employee: Employee}')
  @Setters(['employee', '_emp', Employee])
  class Person extends GQLBase { }

  const test = 'with jest'
  const fun = 'always'
  const firstName = 'Brielle'
  const job = 'Engineer'
  const instance = new Sample({test, fun}, null, {autoProps: false})
  const employee = new Employee({firstName, job}, null, {autoProps: false})

  it('should have a setter for "test"', () => {
    expect(() => {
      instance.test = 'Something else'
    }).not.toThrow();
    expect(instance.test).toBeUndefined()
  })

  it('should allow for remapping between type fields and model fields', () => {
    expect(() => {
      employee.name = 'Dorkis'
      employee.job = 'Vendor'
    }).not.toThrow()

    expect(employee.model.firstName).toEqual('Dorkis')
    expect(employee.model.job).toEqual('Vendor');
  })

  it('should not break if we create and set a complex type to null', () => {
    expect(() => {
      const emptyPerson = new Person({_emp: null}, null, {autoProps: false})

      emptyPerson.employee = null;
    }).not.toThrow()
  })

  it('should have appropriately defined SETTERS tags', async () => {
    const sampleSetters = Object.keys(Sample[META_KEY][SETTERS])
    const sampleFields = ['test', 'fun']
    const employeeSetters = Object.keys(Employee[META_KEY][SETTERS])
    const employeeFields = ['name', 'job']
    const personSetters = Object.keys(Person[META_KEY][SETTERS])
    const personFields = ['employee']

    expect(sampleSetters).toEqual(expect.arrayContaining(sampleFields))
    expect(employeeSetters).toEqual(expect.arrayContaining(employeeFields))
    expect(personSetters).toEqual(expect.arrayContaining(personFields))
  })
})

describe('@Properties', () => {
  @Schema('type Sample {test: String fun: String}')
  @Properties('test', 'fun')
  class Sample extends GQLBase { }

  @Schema('type Employee {name: String job: String}')
  @Properties(['name', 'firstName'], 'job')
  class Employee extends GQLBase { }

  @Schema('type Person {employee: Employee}')
  @Properties(['employee', '_emp', Employee])
  class Person extends GQLBase { }

  @Getters('broken')
  class InvalidGQLBase extends GQLBase { }

  const test = 'with jest'
  const fun = 'always'
  const firstName = 'Brielle'
  const job = 'Engineer'
  const broken = 'It is just broke'
  const instance = new Sample({test, fun}, null, {autoProps: false})
  const employee = new Employee({firstName, job}, null, {autoProps: false})
  const invalid = new InvalidGQLBase({broken}, null, {autoProps: false})

  it('should have a setter for "test"', () => {
    expect(instance.test).toEqual(test)
    expect(() => {
      instance.test = 'Something else'
    }).not.toThrow();
    expect(instance.test).not.toBeUndefined()
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

  it('should throw due to a missing SCHEMA', () => {
    expect(() => {
      invalid.broken
    }).toThrow()
  })

  it('should be able to create a GQL object with a null complex type', () => {
    let emptyPerson;

    expect(() => {
      emptyPerson = new Person({_emp: null}, null, {autoProps: false})
    }).not.toThrow();

    expect(() => {
      emptyPerson.employee = null;
    }).not.toThrow();

    emptyPerson[MODEL_KEY]._emp = {name: 'Bubba', job: 'Monster Hunter'};
    expect(typeOf(emptyPerson.employee)).toEqual(Employee.name)
  })

  it('should have appropriately defined PROPS tags', async () => {
    const sampleProps = Object.keys(Sample[META_KEY][PROPS])
    const sampleFields = ['test', 'fun']
    const employeeProps = Object.keys(Employee[META_KEY][PROPS])
    const employeeFields = ['name', 'job']
    const personProps = Object.keys(Person[META_KEY][PROPS])
    const personFields = ['employee']

    expect(sampleProps).toEqual(expect.arrayContaining(sampleFields))
    expect(employeeProps).toEqual(expect.arrayContaining(employeeFields))
    expect(personProps).toEqual(expect.arrayContaining(personFields))
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

  let instance = new Sample(undefined, null, {autoProps: false})

  it('should have a schema matching ours', () => {
    expect(Sample.SCHEMA).toEqual(schema);
  })

  it('should have a non-nullable name', () => {
    let { meta } = SyntaxTree.findField(
      parse(Sample.SCHEMA), Sample.name, 'name'
    );

    expect(meta.nullable).toEqual(false)
    expect(meta.type).not.toEqual(null)
  })

  it('should have a nullable id', () => {
    let { meta } = SyntaxTree.findField(
      parse(Sample.SCHEMA), Sample.name, 'id'
    );

    expect(meta.nullable).toEqual(true)
    expect(meta.type).not.toEqual(null)
  })
})

describe('DIRECT_TYPES', () => {
  @Schema(/* GraphQL */`type Job { company: String }`)
  class Job extends GQLBase {
    get company() { return answer5 }
  }
  @Schema(/* GraphQL */`type Person { name: String job: Job }`)
  @Getters(['name', String], ['job', Job])
  class Person extends GQLBase { }

  const answer1 = 'Harrison, Brielle'
  const answer2 = '5'
  const answer3 = 'David'
  const answer4 = 'Sourceress'
  const answer5 = `The greatest ${answer4}`
  const job = new Job({ company: answer4 })
  const model1 = { name: answer1, job: { company: answer4 } }
  const model2 = { name: answer1, job: job }

  let peep;

  it('should allow using String to coerce an object with toString()', () => {
    peep = new Person({name: {
      get first() { return 'Brielle' },
      get last() { return 'Harrison'},

      toString() { return `${this.last}, ${this.first}` }
    }}, null, {autoProps: false})
    expect(peep.name).toBe(answer1)
  })

  it('should run any value for name through as a String', () => {
    peep = new Person({name: 5}, null, {autoProps: false})
    expect(5).not.toBe(answer2);
    expect(peep.name).toBe(answer2);
  })

  it('should not coerce values if String is removed from DIRECT_TYPES', () => {
    DirectTypeManager.clear();
    expect(DirectTypeManager.types.length).toEqual(0);

    peep = new Person({name: answer3}, null, {autoProps: false})
    expect(typeOf(peep.name)).toBe(String.name)

    // This is due to how `new String(...)` and `String(...)` differ. The use
    // of DIRECT_TYPES is directly related to this inconsistency.
    expect(new String(answer3)).not.toBe(answer3)
    expect(String(answer3)).toBe(answer3)

    DirectTypeManager.reset();
  })

  it('should give me a job type when given model data for a Job', () => {
    const peep = new Person(model1, null, {autoProps: false})

    expect(typeOf(peep.job)).toBe(Job.name)
    expect(peep.job).not.toBe(job)
    expect(peep.name).toEqual(answer1)
    expect(peep.model.job.model).not.toBeDefined()
    expect(peep.model.job.company).toEqual(answer4)
    expect(peep.job.company).toEqual(answer5)
    expect(typeof peep.model.job).toEqual('object')
    expect(typeOf(peep.model.job)).toEqual(Object.name)
  })

  it('should give me the job type when given a model with one already', () => {
    const peep = new Person(model2, null, {autoProps: false})

    expect(typeOf(peep.job)).toBe(Job.name)
    expect(peep.job === model2.job).toBe(true);
    expect(peep.job).toEqual(job)
    expect(peep.name).toEqual(answer1)
    expect(peep.model.job.model.company).toEqual(answer4)
    expect(peep.model.job.company).toEqual(answer5)
    expect(peep.job.company).toEqual(answer5)
    expect(typeof peep.model.job).toEqual('object')
    expect(typeOf(peep.model.job)).not.toEqual(Object.name)
    expect(typeOf(peep.model.job)).toEqual(Job.name)
  })
})

describe('@resolver/@mutator/@subscriptor', () => {
  @Schema(`
    type Thing {
      name: String
    }

    type Query {
      getThing: Thing
      traditionalResolver: Thing
      asyncResolver: Thing
    }

    type Mutation {
      changeThing(thingName: String): Thing
    }

    type Subscription {
      watchThing(thingName: String): Thing
    }
  `)
  @Properties('name')
  class Thing extends GQLBase {
    @resolver getThing(requestData, thingName = 'Jane Doe') {
      // Potentially do something with requestData
      return new Thing({name: thingName}, requestData)
    }

    @mutator changeThing(requestData, thingName) {
      return new Thing({name: 'Changed Name'}, requestData)
    }

    @subscriptor watchThing(requestData, thingName) {
      return new Thing({name: 'Watched Thing'}, requestData)
    }

    @resolver async asyncResolver(requestData) {
      return new Thing({}, requestData)
    }

    @resolver static staticResolver(requestData) {
      return new Thing({}, requestData)
    }

    @resolver get invalidResolver() {
      return true;
    }

    @resolver
    invalidPropertyResolver;

    static async RESOLVERS(requestData) {
      return {
        // Potentially do something with requestData
        traditionalResolver(thingName = 'Jane Doe') {
          return new Thing({name: thingName}, requestData)
        }
      };
    }
  }

  const express = {
    req: {},
    res: {},
    next: function() {}
  }

  it('should have our getThing resolver', async () => {
    let root = await SchemaUtils.createMergedRoot([Thing], express);

    expect(root.getThing).toBeDefined()
  })

  it('should have our traditionalResolver resolver', async () => {
    let root = await SchemaUtils.createMergedRoot([Thing], express);

    expect(root.traditionalResolver).toBeDefined()
  });

  it('should have our requestData in both the old and new ways', async () => {
    let root = await SchemaUtils.createMergedRoot([Thing], express);
    let newWay;
    let oldWay;

    expect(root.getThing).toBeDefined()
    newWay = root.getThing('ball')
    expect(newWay.requestData).toBe(express)
    expect(newWay.name).toBe('ball')

    expect(root.traditionalResolver).toBeDefined()
    oldWay = root.traditionalResolver('basket')
    expect(oldWay.requestData).toBe(express)
    expect(oldWay.name).toBe('basket')
  })

  it('should have moved our function out of the prototype', () => {
    let thingInstance = new Thing({name: 'Jane Doe'})

    expect(thingInstance.getThing).not.toBeDefined()
  })

  it ('should have ignored our invalidResolver getter', () => {
    let thingInstance = new Thing({name: 'A thing'})

    expect(thingInstance.invalidResolver).toBe(true)
  })

  it ('should have ignored our invalidPropertyResolver', () => {
    let thingInstance = new Thing({name: 'A thing'})

    expect(thingInstance.invalidPropertyResolver).not.toBeDefined()
  })

  it('should also not be available in the static scope', () => {
    expect(Thing.getThing).not.toBeDefined()
  })

  it('should also contain our mutators and subscriptors', async () => {
    let root = await SchemaUtils.createMergedRoot([Thing], express);

    expect(root.changeThing).toBeDefined()
    expect(root.watchThing).toBeDefined()
  })

  it('should work fine with async decorated functions', async () => {
    let root = await SchemaUtils.createMergedRoot([Thing], express);
    let obj;

    expect(root.asyncResolver).toBeDefined();

    obj = await root.asyncResolver()
    expect(isOfType(obj, Thing)).toBe(true)
    expect(obj.requestData).toBe(express)
  })

  it('should not care if the decorated function is static', async () => {
    let root = await SchemaUtils.createMergedRoot([Thing], express);

    expect(root.staticResolver).toBeDefined()
  })
})

describe('Auto properties testing', () => {
  @Schema(/* GraphQL */`
    type Contrived {
      name: String
      job: String
      age: Int
    }
  `)
  class Contrived extends GQLBase {
    job() {
      return 'Sourceress'
    }
  }

  @Schema(/* GraphQL */`
    type Special {
      id: ID
      name(surname:String): String
      ooh: Contrived
      locale: String
    }
  `)
  @Properties(['ooh', Contrived])
  class Special extends GQLBase {
    async name({surname}) {
      return `My name is ${surname}`
    }

    get locale() {
      return 'ja_JP'
    }
  }

  @Schema(/* GraphQL */`
    enum Car { SLOW, FAST, RED_ONE }
  `)
  class Car extends GQLEnum {}

  it('should have appropriately defined AUTO_PROPS tags', async () => {
    // TODO move applyAutoProps to a non-instance locaation
    new Contrived({})
    new Special({})

    let contrivedProps = Object.keys(Contrived[META_KEY][AUTO_PROPS])
    let contrivedFields = ['name', 'age']
    let specialProps = Object.keys(Special[META_KEY][AUTO_PROPS])
    let specialFields = ['id']

    expect(contrivedProps).toEqual(expect.arrayContaining(contrivedFields))
    expect(specialProps).toEqual(expect.arrayContaining(specialFields))
  })

  it('should make instances that return Sourceresses', async () => {
    let instance = new Contrived({name: 'Brie', job: 'Engineer', age: 21})
    let props = Contrived[META_KEY][PROPS]
    let autoProps = Contrived[META_KEY][AUTO_PROPS]
    let expected = ['name', 'age']

    expect(Object.keys(props)).toEqual(expect.arrayContaining(expected))
    expect(autoProps.name).toBeDefined()
    expect(autoProps.age).toBeDefined()

    expect(await instance.callProp('name')).toBe('Brie')
    expect(await instance.callProp('age')).toBe(21)

    // Note that we have a custom property resolver for 'job' that returns
    // the value 'Sourceress' and does not look at the model value 'Engineer'
    expect(await instance.callProp('job')).toBe('Sourceress')
  })

  it('should not create auto-props for enums', async () => {
    let slowCar = new Car('SLOW')
    let fastCar = new Car('FAST')
    let redCar = new Car({ value: 'RED_ONE' })
    let props = Car[META_KEY].props
    let autoProps = Car[META_KEY][AUTO_PROPS]

    expect(props).not.toEqual(expect.arrayContaining(['SLOW']))
    expect(props).not.toEqual(expect.arrayContaining(['FAST']))
    expect(props).not.toEqual(expect.arrayContaining(['RED_ONE']))

    expect(autoProps).toBeUndefined()

    expect(slowCar.SLOW).toBeUndefined()
    expect(slowCar.FAST).toBeUndefined()
    expect(slowCar.RED_ONE).toBeUndefined()
    expect(fastCar.SLOW).toBeUndefined()
    expect(fastCar.FAST).toBeUndefined()
    expect(fastCar.RED_ONE).toBeUndefined()
    expect(redCar.SLOW).toBeUndefined()
    expect(redCar.FAST).toBeUndefined()
    expect(redCar.RED_ONE).toBeUndefined()
  })

  it('should not create auto-props for custom implementations', async () => {
    let special = new Special({
      id: 'XELOK',
      name: 'ignored',
      ooh: {
        name: 'Thing',
        job: 'To be a thing',
        age: 1
      }
    })
    let autoProps = Special[META_KEY][AUTO_PROPS]
    let props = Special[META_KEY][PROPS]

    expect(special.id).toEqual('XELOK')
    expect(await special.name({surname: 'Brie'})).toEqual('My name is Brie')
    expect(special.ooh.name).toEqual('Thing')
    expect(special.locale).toEqual('ja_JP')

    expect(autoProps.ooh).toBeUndefined()
    expect(autoProps.name).toBeUndefined()
    expect(autoProps.locale).toBeUndefined()
    expect(autoProps.id).toBeDefined()

    expect(Object.keys(props)).toEqual(expect.arrayContaining(['ooh', 'id']))
    expect(Object.keys(autoProps)).not.toEqual(expect.arrayContaining(['ooh']))
  })
})
