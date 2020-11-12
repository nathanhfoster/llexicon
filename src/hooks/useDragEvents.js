import { useEffect } from 'react'
import hasOwnProperty from './utils/hasOwnProperty'
import createCbSetterErrorProxy from './utils/createCbSetterErrorProxy'
import useCreateHandlerSetter from './utils/useCreateHandlerSetter'

const useAssignDragEventOnMount = (targetRef, handlerRef, eventName) => {
  useEffect(() => {
    const cb = dragEvent => {
      if (handlerRef.current) {
        handlerRef.current(dragEvent)
      }
    }

    if (targetRef.current) {
      targetRef.current.addEventListener(eventName, cb)
    }

    return () => {
      if (targetRef.current) {
        targetRef.current.removeEventListener(eventName, cb)
      }
    }
  }, [])
}

/**
 * Returns an object of callback setters to handle the drag-related events.
 * It accepts a DOM ref representing the events target (where attach the events to).
 *
 * Returned callback setters: `onDrag`, `onDrop`, `onDragEnter`, `onDragEnd`, `onDragExit`, `onDragLeave`,
 * `onDragOver`, `onDragStart`;
 */
const useDragEvents = (targetRef, setDraggable = true) => {
  const [onDrag, setOnDrag] = useCreateHandlerSetter()
  const [onDrop, setOnDrop] = useCreateHandlerSetter()
  const [onDragEnter, setOnDragEnter] = useCreateHandlerSetter()
  const [onDragEnd, setOnDragEnd] = useCreateHandlerSetter()
  const [onDragExit, setOnDragExit] = useCreateHandlerSetter()
  const [onDragLeave, setOnDragLeave] = useCreateHandlerSetter()
  const [onDragOver, setOnDragOver] = useCreateHandlerSetter()
  const [onDragStart, setOnDragStart] = useCreateHandlerSetter()

  useEffect(() => {
    if (setDraggable && targetRef.current && !targetRef.current.hasAttribute('draggable')) {
      targetRef.current.setAttribute('draggable', true)
    }
  }, [])

  useAssignDragEventOnMount(targetRef, onDrag, 'drag')
  useAssignDragEventOnMount(targetRef, onDrop, 'drop')
  useAssignDragEventOnMount(targetRef, onDragEnter, 'dragenter')
  useAssignDragEventOnMount(targetRef, onDragEnd, 'dragend')
  useAssignDragEventOnMount(targetRef, onDragExit, 'dragexit')
  useAssignDragEventOnMount(targetRef, onDragLeave, 'dragleave')
  useAssignDragEventOnMount(targetRef, onDragOver, 'dragover')
  useAssignDragEventOnMount(targetRef, onDragStart, 'dragstart')

  if (targetRef !== null && !hasOwnProperty(targetRef, 'current')) {
    return createCbSetterErrorProxy('Unable to assign any drag event to the given ref')
  }

  return Object.freeze({
    onDrag: setOnDrag,
    onDrop: setOnDrop,
    onDragEnter: setOnDragEnter,
    onDragEnd: setOnDragEnd,
    onDragExit: setOnDragExit,
    onDragLeave: setOnDragLeave,
    onDragOver: setOnDragOver,
    onDragStart: setOnDragStart,
  })
}

export default useDragEvents
