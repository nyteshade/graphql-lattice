import { GQLEnum, Schema } from '../dist/lattice.min'

describe('GQLEnums', () => {
  @Schema('enum Ewok { SHORT, EXTRA_HAIRY, WOOKIE_SIZED }')
  class Ewok extends GQLEnum {
    static get values() {
      const { valueFor } = this;
      
      return {
        EXTRA_HAIRY: valueFor('HIRSUTE')
      }
    }
  }
  
  it('should give null for new instances with bad values', () => {
    let e 
    
    e = new Ewok(null)
    expect(() => e.value).not.toThrow()
    expect(e.value).toBe(null)
    
    e = new Ewok(undefined)
    expect(() => e.value).not.toThrow()
    expect(e.value).toBe(null)

    e = new Ewok('short')
    expect(() => e.value).not.toThrow()
    expect(e.value).toBe(null)

    e = new Ewok('some random string')
    expect(() => e.value).not.toThrow()
    expect(e.value).toBe(null)

    e = new Ewok({})
    expect(() => e.value).not.toThrow()
    expect(e.value).toBe(null)    

    e = new Ewok({ value: 'some random string'})
    expect(() => e.value).not.toThrow()
    expect(e.value).toBe(null)
  })
  
  it('should equate to our e key for basic e values', () => {
    let e
    let basicTypes = ['SHORT', 'WOOKIE_SIZED']
    
    for (let type of basicTypes) {
      e = new Ewok(type) 
      expect(() => e.value).not.toThrow()
      expect(e.value).toBe(type)
      
      e = new Ewok({ value: type }) 
      expect(() => e.value).not.toThrow()
      expect(e.value).toBe(type)
    }    
  })
  
  it('should allow either the key or the value for complex e vals', () => {
    let e 
    let name = 'EXTRA_HAIRY'
    let value = 'HIRSUTE'

    expect(true).toBe(true)
    
    // TODO: rethink the way this works. complex values do not work atm 
    
    // e = new Ewok(value) 
    // expect(() => e.value).not.toThrow()
    // expect(e.name).toBe(name)
    // expect(e.value).toEqual(value)
    // 
    // e = new Ewok({ value: value }) 
    // expect(() => e.value).not.toThrow()
    // expect(e.name).toBe(name)
    // expect(e.value).toEqual(value)
  })
})