import {
  GQLBase,
  META_KEY,
  Properties,
  Schema,
  resolver,
  mutator,
  typeOf
} from '../es6/lattice'

describe('Test getProps for testing various prop fields', async () => {
  @Schema(/* GraphQL */`
    type Contrived {
      name: String
      age: Int
      job: String
      location: String
    }

    type Query {
      contrivances: [Contrived]
      contrived(id: ID): Contrived
    }
  `)
  // Check a model property value with a different name
  @Properties(['location', 'loc'])
  class Contrived extends GQLBase {
    // Synchronous function property
    name() { return 'Jane' }

    // Asynchronous function property
    async age() {
      let deferred = {}

      deferred.promise = new Promise((resolve, reject) => {
        deferred.resolve = resolve
        deferred.reject = reject
      })

      setTimeout(() => {
        deferred.resolve(21)
      }, 500)

      return deferred.promise
    }

    // Getter function property
    get job() {
      return 'Saleswoman'
    }

    @resolver contrived(requestData, {id}) {
      return new Contrived({loc: id})
    }

    static async RESOLVERS(requestData) {
      return {
        contrivances() {
          return [new Contrived({loc: 'Mars'})]
        }
      }
    }
  }

  it('should allow the fetching of all props via getProps', async () => {
    let instance = new Contrived({ loc: 'SF'})
    let name = await instance.callProp('name')
    let age = await instance.callProp('age')
    let job = await instance.callProp('job')
    let location = await instance.callProp('location')

    expect(name).toBe('Jane')
    expect(age).toBe(21)
    expect(job).toBe('Saleswoman')
    expect(location).toBe('SF')
  })

  it('should support resolvers from both RESOLVERS and @resolver', async () => {
    let instance = new Contrived({loc: 'Japan'})
    let root = await Contrived.getMergedRoot({req: true, res: true})

    expect(typeof root.contrived).toBe('function')
    expect(typeof root.contrivances).toBe('function')
  })
})

describe('Check getResolver usage in instance and static forms', async () => {
  const Red = 'Red'
  const Green = 'Green'
  const Amber = 'Amber'
  const Violet = 'Violet'

  const stockModel = {
    pwrColor: Red,
    hddColor: Green,
    fddColor: Amber
  };

  @Schema(/* GraphQL */`
    type Bifrost {
      pwrColor: String
      hddColor: String
      fddColor: String
    }

    type Query {
      stockBifrost: Bifrost
    }

    type Mutation {
      createBifrost(
        pwrColor: String
        hddColor: String
        fddColor: String
      ): Bifrost
    }
  `)
  class Bifrost extends GQLBase {
    async RESOLVERS(requestData) {
      return {
        async stockBifrost(requestData) {
          return new Bifrost(stockModel)
        }
      }
    }

    @mutator
    async createBifrost(requestData, modelData) {
      if (requestData || requestData.pwrColor) {
        modelData.pwrColor = requestData.pwrColor
      }

      return new Bifrost(modelData, requestData)
    }
  }

  it('should work with instances', async () => {
    let reqData = { pwrColor: Violet }
    let instance = new Bifrost(stockModel, reqData)
    let createBifrost = await instance.getResolver('createBifrost')
    let _inst = await createBifrost(stockModel)

    // Ensure the function was received from getResolver
    expect(createBifrost).not.toBeNull()

    // Ensure it is of type function as expected
    expect(typeOf(createBifrost)).toBe('Function')

    // Ensure that the results of calling the function are not null
    expect(_inst).not.toBeNull()

    // Ensure that the requestData.pwrColor value was used as per our
    // mutator's code. (Contrived but easy way to test the request
    // data was bound in the call to getResolver())
    expect(await _inst.callProp('pwrColor')).toBe(Violet)
  })

  it('should work with the class as a static function', async () => {
    let reqData = { pwrColor: Violet }
    let createBifrost = await Bifrost.getResolver('createBifrost', reqData)
    let _inst = await createBifrost(stockModel)

    // Ensure the function was received from getResolver
    expect(createBifrost).not.toBeNull()

    // Ensure it is of type function as expected
    expect(typeOf(createBifrost)).toBe('Function')

    // Ensure that the results of calling the function are not null
    expect(_inst).not.toBeNull()

    // Ensure that the requestData.pwrColor value was used as per our
    // mutator's code. (Contrived but easy way to test the request
    // data was bound in the call to getResolver())
    expect(await _inst.callProp('pwrColor')).toBe(Violet)
  })

})

describe('Check for expected thrown errors in GQLBase', async () => {
  it('should fail if the class has no schema', async() => {
    class ContrivedType extends GQLBase { }

    expect(() => {
      const type = new ContrivedType()
    }).toThrow()
  })

  it('should fail if the class name does not match a type', async() => {
    @Schema('type VeryContrivedType { name: String }')
    class ContrivedType extends GQLBase { }

    expect(() => {
      const type = new ContrivedType()
    }).toThrow()
  })
})