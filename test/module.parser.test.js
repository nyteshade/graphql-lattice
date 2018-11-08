import { GQLBase, ModuleParser } from '../es6/lattice'
import { SchemaUtils } from '../es6/SchemaUtils'

import { YabbaDabbaDo } from './samples/YabbaDabbaDo'
import { Yarp } from './samples/Yarp'

import path from 'path'
import fs from 'fs'

let base = path.resolve('.');

// See if we are in the root or the test directory; test from the root first
if (
  !fs.existsSync(path.join(base, 'samples'))
  && fs.existsSync(path.join(base, 'test', 'samples'))
) {
  base = path.resolve(path.join(base, 'test'))
}

// Append 'samples' once we are where we think we are.
base = path.join(base, 'samples');

describe('ModuleParser Tests', () => {
  it('should be valid when parsing a relative directory', () => {
    expect(new ModuleParser('.').valid).toBe(true)
    expect(new ModuleParser('..').valid).toBe(true)
  })

  it('should be a valid directory', () => {
    let stats = fs.statSync(base)

    expect(stats).not.toBe(null)
    expect(stats.isDirectory()).toBe(true)
  })

  it('should be able to find two files', () => {
    expect(ModuleParser.walkSync(base).length).toBe(2)
  })

  it('should be able to find two files asynchronously', async () => {
    expect(async () => {
      let files = await ModuleParser.walk(base)

      expect(files.length).toBe(2)
    }).not.toThrow()
  })

  it('should be able to identify the two parsed files by name', () => {
    let parser = new ModuleParser(base)
    let classes

    expect(parser.valid).toBe(true)
    expect(() => {
      parser.parseSync();
    }).not.toThrow();

    classes = parser.classes.map(Class => (Class.name && Class.name) || null)
    classes = classes.filter(Class => !!Class)
    expect(classes).toEqual(expect.arrayContaining([
      'Yarp', 'YabbaDabbaDo'
    ]))
  })
})
