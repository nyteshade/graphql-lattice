import { GQLBase, Schema, Properties, resolver } from 'graphql-lattice'

/**
 *
 *
 * @export
 * @class
 */
@Schema(/* GraphQL */`
  type @@CLASS_NAME@@ {

  }

  type Query {

  }
`)
@Properties()
export class @@CLASS_NAME@@ extends GQLBase {

  /** @inheritdoc */
  static apiDocs(): Object {
    const { joinLines } = this;

    return {
      [this.DOC_CLASS]: joinLines`
        TODO Describe @@CLASS_NAME@@ here.
      `,

      [this.DOC_FIELDS]: {
        // fieldName: joinLines`
        //   fieldDescription
        // `,
      },

      [this.DOC_QUERIES]: {
        // queryName: `queryDescription`,
      },

      [this.DOC_MUTATORS]: {
        // mutatorName: `mutatorDescription`
      }
    }
  }
}

export default @@CLASS_NAME@@
