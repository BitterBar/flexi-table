import {
  createSwapper,
  onDrag,
  onDragend,
  onDragenter,
  onDragleave,
  onDragover,
  onDragstart,
  onDrop,
  onExpect,
} from '../src/index'

describe('API exports', () => {
  it('should export createSwapper function', () => {
    expect(typeof createSwapper).toBe('function')
  })

  it('should export onDrag function', () => {
    expect(typeof onDrag).toBe('function')
  })

  it('should export onDragend function', () => {
    expect(typeof onDragend).toBe('function')
  })

  it('should export onDragenter function', () => {
    expect(typeof onDragenter).toBe('function')
  })

  it('should export onDragleave function', () => {
    expect(typeof onDragleave).toBe('function')
  })

  it('should export onDragover function', () => {
    expect(typeof onDragover).toBe('function')
  })

  it('should export onDragstart function', () => {
    expect(typeof onDragstart).toBe('function')
  })

  it('should export onDrop function', () => {
    expect(typeof onDrop).toBe('function')
  })

  it('should export onExpect function', () => {
    expect(typeof onExpect).toBe('function')
  })
})
