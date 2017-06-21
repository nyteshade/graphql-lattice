const fakeDatabase = require('../fakeDatabase')
const { GQLBase } = require('../GraphQL/GQLBase')

class ThingHandler extends GQLBase {
  constructor(reqData, name) {
    super(reqData, module);
    this.object = fakeDatabase.things[name];
  }
  
  get name()      { return this.object.name }

  get wheels()    { return this.object.wheels }
  get make()      { return this.object.make }
  get model()     { return this.object.model }
  get subModel()  { return this.object.submodel }
  
  get edges()     { return this.object.edges }
  get damage()    { return this.object.damage }
  get range()     { return this.object.range }
  
  static all(requestData) {
    return Object.values(fakeDatabase.things);
  }
  
  static get SCHEMA() {
    return `
      type Thing {
        name: String!
        wheels: Int
        make: String
        model: String
        submodel: String
        edges: Int
        damage: String
        range: String
      }    
      
      type Query {
        thing(name:String!): Thing
        things: [Thing]!        
      }
    `
  }
  
  static async RESOLVERS({req, res, gql}) {
    return Promise.resolve({
      thing: function thing({name}) { 
        return new ThingHandler({req, res, gql}, name)
      },
      
      things: function things() { 
        return ThingHandler.all({req, res, gql});
      }
    })
  }
}

module.exports = ThingHandler;