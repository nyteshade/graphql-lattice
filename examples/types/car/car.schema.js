import { joinLines as gql } from 'graphql-lattice'

export const schema = gql`
  type Car {
    make: String,
    wheels: Int
  }

  type Query {
    findQuad: Car
  }
`

export default schema
