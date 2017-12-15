import { LatticeFactory as LF } from 'graphql-lattice'

export const docs = {
  Car: {
    [LF.TYPE]: docTag`
      A sample GraphQL type denoting a, typically, 4 wheeled vehicle
    `,
    name: `The name of the car`,
    wheels: `The total number of wheels connected to the drivetrain`
  },

  Query: {
    findQuad: `Finds the nearest four wheeled vehicle`
  }
}

export default docs
