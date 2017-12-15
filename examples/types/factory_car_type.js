import { LatticeFactory as LF, joinLines as gql } from 'graphql-lattice'
// import { serviceForCars } from 'contrived-package'

export const carPlans = {
  name: 'Car',

  schema: gql`
    type Car {
      make: String,
      wheels: Int
    }

    type Query {
      findQuad: Car
    }
  `,

  resolvers: {
    async findQuad(requestData, {make}) {
      let model = await serviceForCars.findBy(make)

      return new Car(model)
    }
  },

  docs: {
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
}

export default carPlans
