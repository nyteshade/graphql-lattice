import { GQLBase, Properties, Schema } from '../../dist/lattice.min'

@Schema(`
  type YabbaDabbaDo {
    name: String
    isFamily: Boolean
  }
  
  type Query {
    theFlintstones: YabbaDabbaDo 
  }
`)
@Properties('name', 'isFamily')
export class YabbaDabbaDo extends GQLBase {
  /**
   * An example asynchronous RESOLVERS function 
   *
   * @method RESOLVERS
   * @param {Object} ignored typically null in tests
   * @return {Promise<YabbaDabbaDo>} a newly created YabbaDabbaDo object 
   * instance 
   */
  static async RESOLVERS(ignored) {
    return {
      async theFlintstones() {
        return new YabbaDabbaDo({
          name: 'The Flintstones',
          isFamily: true
        })
      }
    }
  }
}

// Try to throw an error by exporting non GQLBase extended class stuff
export const someRandomCrap = true;
export const genderIdentity = 'female'

export default YabbaDabbaDo;