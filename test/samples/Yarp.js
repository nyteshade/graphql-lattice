import { GQLBase, Properties, Schema } from '../../es6/lattice'

@Schema(`
  type Yarp {
    description: String
    count: Int
  }

  type Query {
    yarpaYarpaYarpa: Yarp
  }
`)
export class Yarp extends GQLBase {
  /**
   * An example asynchronous RESOLVERS function
   *
   * @method RESOLVERS
   * @param {Object} ignored typically null in tests
   * @return {Promise<Yarp>} a newly created Yarp object instance
   */
  static async RESOLVERS(ignored) {
    return {
      async yarpaYarpaYarpa() {
        return new Yarp({
          description: 'Ever seen Hot Fuzz? How many times?',
          count: 2
        })
      }
    }
  }
}

export default Yarp;
