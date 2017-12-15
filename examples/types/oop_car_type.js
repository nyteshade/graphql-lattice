import { Schema, GQLBase, resolver, joinLines as gql } from 'graphql-lattice'
// import { serviceForCars } from 'contrived-package'

@Schema(gql`
  type Car {
    make: String,
    wheels: Int
  }

  type Query {
    findQuad(make: String): OOCar
  }
`)
export class Car extends GQLBase {
  @resolver async findQuad(requestData, {make}) {
    let model = await serviceForCars.findBy(make)

    return new Car(model)
  }

  static apiDocs() {
    const { DOC_CLASS, DOC_QUERIES, DOC_FIELDS } = this

    return {
      [DOC_CLASS]: docTag`
        A sample GraphQL type denoting a, typically, 4 wheeled vehicle
      `,

      [DOC_FIELDS]: {
        name: `The name of the car`,
        wheels: `The total number of wheels connected to the drivetrain`
      },

      [DOC_QUERIES]: {
        findQuad: `Finds the nearest four wheeled vehicle`
      }
    }
  }
}

export default Car
