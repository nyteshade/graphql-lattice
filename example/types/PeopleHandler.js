const fakeDatabase = require('../fakeDatabase')
const { GQLBase } = require('../GraphQL/GQLBase')

class PeopleHandler extends GQLBase {
  constructor(requestData, key) {
    super(requestData, module);
    this.object = fakeDatabase.people[key];
  }
  
  get first()   { return this.object.first; }
  get middle()  { return this.object.middle; }
  get last()    { return this.object.last; }
  get gender()  { return this.object.gender; }
  get job()     { return this.object.job; }  
  
  static all(requestData) {
    return Object.values(fakeDatabase.people);
  }
  
  static get SCHEMA() {
    return `
      type Person {
        first: String!
        middle: String
        last: String!
        gender: String!
        job: String
      }
      
      type Query {
        person(first:String!): Person
        people: [Person]!    
      }
      
      type Mutation {
        updatePerson(
          first:String!, 
          middle: String,
          last:String,
          gender: String,
          job: String
        ): Person
      }
    `;    
  }
  
  static async RESOLVERS({req, res, gql}) {
    return Promise.resolve({
      person: function person({first}) { 
        return new PeopleHandler({req, res, gql}, first);
      },
      
      people: function people() {
        return PeopleHandler.all({req, res, gql});
      }
    })
  }
  
  static async MUTATORS({req, res, gql}) {
    return Promise.resolve({
      updatePerson: ({first, middle, last, gender, job}) => {
        // Normally, likely, async... fetch record
        const record = fakeDatabase.people[first];
        if (!record) return null;

        // Business logic to modify record
        record.middle = middle || record.middle;
        record.last = last || record.last;
        record.gender = gender || record.gender;
        record.job = job || record.job;
        
        // Query changed record
        return new PeopleHandler({req, res, gql}, first);
      }
    })
  }
}

module.exports = PeopleHandler;