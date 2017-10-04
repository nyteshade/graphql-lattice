import { GQLEnum, Schema } from '../es6/lattice'

describe('GQLEnums', () => {
  var objRef = { testMe: true }
  
  @Schema(`
    enum Ewok { 
      SHORT, 
      EXTRA_HAIRY, 
      WOOKIE_SIZED,
      DANGER_ZONE,
      OBJECT_ZONE
    }
  `)
  class Ewok extends GQLEnum {
    static get values() {
      const { valueFor } = this;
      
      return {
        EXTRA_HAIRY: valueFor('HIRSUTE'),
        DANGER_ZONE: valueFor(3),
        OBJECT_ZONE: valueFor(objRef)
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

    e = new Ewok(value) 
    expect(() => e.value).not.toThrow()
    expect(e.name).toBe(name)
    expect(e.value).toEqual(value)
    
    e = new Ewok({ value: value }) 
    expect(() => e.value).not.toThrow()
    expect(e.name).toBe(name)
    expect(e.value).toEqual(value)
    
    e = new Ewok('DANGER_ZONE')
    expect(() => e.value).not.toThrow()
    expect(e.name).toBe('DANGER_ZONE')
    expect(e.value).toBe(3)
    
    e = new Ewok('OBJECT_ZONE')
    expect(() => e.value).not.toThrow()
    expect(e.name).toBe('OBJECT_ZONE')
    expect(e.value).toBe(objRef)
    expect(e.value).not.toBe({ testMe: true })
  })
})