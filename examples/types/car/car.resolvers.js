// import { serviceForCars } from 'contrived-package'

export const resolvers = {
  async findQuad(requestData, {make}) {
    let model = await serviceForCars.findBy(make)

    return new Car(model)
  }
}

export default resolvers
