import { stat } from 'fs'
import {
  getLatticePrefs,
  Deferred,
  promisify
} from '../es6/lattice'


describe('getLatticePrefs should combine defaults with custom value', () => {
  it('should pick up local package.json "lattice" settings', () => {
    let options = getLatticePrefs({ cwd: './test' })

    expect(options).not.toBeNull()
    expect(options.ModuleParser).toBeDefined()
    expect(options.ModuleParser.failOnError).toBeTruthy()
    expect(options.ModuleParser.extensions).toBeDefined()
    expect(options.ModuleParser.extensions.length).toBe(4)
  })
})

describe('Deferred should allow promise to be inverted', async () => {
  it('should simply allow inverted promises', async () => {
    let deferred = new Deferred()

    expect(deferred.resolve).toBeDefined()
    expect(deferred.reject).toBeDefined()
    expect(deferred.pending).toBeTruthy()
    expect(deferred.complete).toBeFalsy()

    deferred.resolve(true)

    expect(deferred.pending).toBeFalsy()
    expect(deferred.complete).toBeTruthy()
    expect(async () => {
      let value = await deferred.promise
      expect(value).toBe(true)
    }).not.toThrow()
  })

  it('should allow setting auto resolve value', async () => {
    let deferred = new Deferred(42)

    expect(deferred.resolve).toBeDefined()
    expect(deferred.reject).toBeDefined()
    expect(deferred.complete).toBeTruthy()
    expect(deferred.pending).toBeFalsy()

    try {
      let meaningOfLife = await deferred.promise

      expect(meaningOfLife).toBe(42)
    }
    catch (shouldNotBeHere) {
      expect(false).toBe(true)
    }
  })

  it('should allow setting auto reject value', async () => {
    let deferred = new Deferred(undefined, 42)
    let meaningOfLife

    expect(deferred.resolve).toBeDefined()
    expect(deferred.reject).toBeDefined()
    expect(deferred.complete).toBeTruthy()
    expect(deferred.pending).toBeFalsy()

    try {
      meaningOfLife = await deferred.promise
      expect(true).toBe(false)
    }
    catch (ignore) {
      expect(deferred.pending).toBeFalsy()
      expect(deferred.complete).toBeTruthy()
      expect(meaningOfLife).toBe(undefined)
    }
  })

  it('time deferreds should reject after specified time', async () => {
    let deferred = Deferred.TimedDeferred(100)
    let value = null

    expect(deferred.resolve).toBeDefined()
    expect(deferred.reject).toBeDefined()
    expect(deferred.pending).toBeTruthy()
    expect(deferred.complete).toBeFalsy()

    try {
      value = await deferred.promise
    }
    catch (ignore) {
      expect(deferred.pending).toBeFalsy()
      expect(deferred.complete).toBeTruthy()
    }

    expect(value).toBe(null)
  })
})

describe('Sample promisify should work similar to node 8+ version', () => {
  function contrived(callback) {
    if (this.valueOf() === 5)
      callback(null, true)
    else
      callback(new Error('Not 5'))
  }

  let aStat = promisify(stat)
  let aContrived = promisify(contrived, Number(5))
  let aContrived2 = promisify(contrived, Number(6))

  it('should make aStat return a promise with results', async () => {
    try {
      let stats = await aStat('./package.json')

      expect(stats).toBeDefined()
      expect(stats.size).toBeGreaterThan(0)
    }
    catch (error) {
      expect(false).toBe(true)
    }
  })

  it('should work with custom expected context as well', async () => {
    try {
      let bool = await aContrived()

      expect(bool).toBe(true)
    }
    catch (error) {
      console.error(error)
      expect(false).toBe(true)
    }
  })

  it('should throw with custom unexpected context', async () => {
    try {
      let bool = await aContrived2()
      expect(true).toBe(false)
    }
    catch (error) {
      expect(error.message).toEqual('Not 5')
    }
  })
})
