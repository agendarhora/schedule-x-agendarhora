/* eslint-disable max-lines */
import {
  describe,
  it,
  expect,
} from '@schedule-x/shared/src/utils/stateless/testing/unit/unit-testing-library.impl'
import { createEventsServicePlugin } from '../events-service-plugin.impl'
import { __createAppWithViews__ } from '@schedule-x/calendar/src/utils/stateless/testing/__create-app-with-views__'

describe('Events facade for recurrence plugin', () => {
  describe('Adding events', () => {
    it('should add one event without an rrule', () => {
      const $app = __createAppWithViews__()
      const plugin = createEventsServicePlugin()
      plugin.beforeRender!($app)
      expect($app.calendarEvents.list.value.length).toBe(0)

      const event = {
        id: '1',
        start: '2021-01-01',
        end: '2021-01-01',
      }
      plugin.add(event)

      expect($app.calendarEvents.list.value.length).toBe(1)
    })

    it('should add one event with an rrule', () => {
      const $app = __createAppWithViews__()
      const plugin = createEventsServicePlugin()
      plugin.beforeRender!($app)
      expect($app.calendarEvents.list.value.length).toBe(0)

      const event = {
        id: '1',
        start: '2021-01-01',
        end: '2021-01-01',
        rrule: 'FREQ=WEEKLY;COUNT=3',
      }
      plugin.add(event)

      expect($app.calendarEvents.list.value.length).toBe(3)
    })

    it('should add an infinite event', () => {
      const $app = __createAppWithViews__({
        selectedDate: '2025-01-01',
        defaultView: 'month-grid',
      })
      const plugin = createEventsServicePlugin()
      plugin.beforeRender!($app)
      expect($app.calendarEvents.list.value.length).toBe(0)

      const event = {
        id: '1',
        start: '2025-01-01',
        end: '2025-01-01',
        rrule: 'FREQ=DAILY',
      }
      plugin.add(event)

      expect($app.calendarEvents.list.value.length).toBe(33)
    })

    it('should add an event with an exdate', () => {
      const $app = __createAppWithViews__()
      const plugin = createEventsServicePlugin()
      plugin.beforeRender!($app)
      expect($app.calendarEvents.list.value.length).toBe(0)

      const event = {
        id: '1',
        start: '2025-05-01',
        end: '2025-05-01',
        rrule: 'FREQ=DAILY;COUNT=10',
        exdate: ['20250503', '20250508'],
      }
      plugin.add(event)

      expect($app.calendarEvents.list.value.length).toBe(8)
    })
  })

  describe('Getting a single event by id', () => {
    it.each([['1'], [1]])('should return the event if it exists', (id) => {
      const $app = __createAppWithViews__()
      const plugin = createEventsServicePlugin()
      plugin.beforeRender!($app)
      expect($app.calendarEvents.list.value.length).toBe(0)

      const event = {
        id,
        start: '2021-01-01',
        end: '2021-01-01',
        rrule: 'FREQ=WEEKLY;COUNT=3',
      }
      plugin.add(event)

      expect(plugin.get(id)).toEqual(event)
    })

    it('should return undefined if the event does not exist', () => {
      const $app = __createAppWithViews__()
      const plugin = createEventsServicePlugin()
      plugin.beforeRender!($app)
      expect($app.calendarEvents.list.value.length).toBe(0)

      expect(plugin.get('1')).toBeUndefined()
    })
  })

  describe('Getting all events', () => {
    it('should return all events', () => {
      const $app = __createAppWithViews__()
      const plugin = createEventsServicePlugin()
      plugin.beforeRender!($app)
      expect($app.calendarEvents.list.value.length).toBe(0)

      const event1 = {
        id: '1',
        start: '2021-01-01',
        end: '2021-01-01',
        rrule: 'FREQ=WEEKLY;COUNT=3',
      }
      plugin.add(event1)
      const event2 = {
        id: '2',
        start: '2021-01-01',
        end: '2021-01-01',
      }
      plugin.add(event2)

      expect(plugin.getAll()).toHaveLength(2)
      expect(plugin.getAll()).toEqual(
        expect.arrayContaining([
          event1,
          { id: '2', start: '2021-01-01', end: '2021-01-01' },
        ])
      )
    })
  })

  describe('Removing events', () => {
    it.each([['1'], [1]])('should remove one event without an rrule', (id) => {
      const $app = __createAppWithViews__()
      const plugin = createEventsServicePlugin()
      plugin.beforeRender!($app)
      expect($app.calendarEvents.list.value.length).toBe(0)

      const event = {
        id,
        start: '2021-01-01',
        end: '2021-01-01',
      }
      plugin.add(event)
      expect($app.calendarEvents.list.value.length).toBe(1)

      plugin.remove(id)
      expect($app.calendarEvents.list.value.length).toBe(0)
    })

    it('should remove one event with an rrule', () => {
      const $app = __createAppWithViews__()
      const plugin = createEventsServicePlugin()
      plugin.beforeRender!($app)
      expect($app.calendarEvents.list.value.length).toBe(0)

      const event = {
        id: '1',
        start: '2021-01-01',
        end: '2021-01-01',
        rrule: 'FREQ=WEEKLY;COUNT=3',
      }
      plugin.add(event)
      expect($app.calendarEvents.list.value.length).toBe(3)

      plugin.remove('1')
      expect($app.calendarEvents.list.value.length).toBe(0)
    })
  })

  describe('Updating events', () => {
    it('should remove an rrule', () => {
      const $app = __createAppWithViews__()
      const plugin = createEventsServicePlugin()
      plugin.beforeRender!($app)
      expect($app.calendarEvents.list.value.length).toBe(0)

      const event = {
        id: '1',
        start: '2021-01-01',
        end: '2021-01-01',
        rrule: 'FREQ=WEEKLY;COUNT=3',
      }
      plugin.add(event)
      expect($app.calendarEvents.list.value.length).toBe(3)

      plugin.update({ id: '1', start: '2021-01-01', end: '2021-01-01' })
      expect($app.calendarEvents.list.value.length).toBe(1)
    })

    it('should update an event with an rrule', () => {
      const $app = __createAppWithViews__({
        events: [
          {
            id: '657436747',
            title: 'tjena tjena',
            start: '2024-02-04',
            end: '2024-02-04',
          },
        ],
      })
      const plugin = createEventsServicePlugin()
      plugin.beforeRender!($app)
      expect($app.calendarEvents.list.value.length).toBe(1)

      const event = {
        id: '1',
        start: '2021-01-01',
        end: '2021-01-01',
        rrule: 'FREQ=WEEKLY;COUNT=3',
      }
      plugin.add(event)
      expect($app.calendarEvents.list.value.length).toBe(4)

      plugin.update({
        id: '1',
        start: '2021-01-01',
        end: '2021-01-01',
        rrule: 'FREQ=WEEKLY;COUNT=3',
      })
      expect($app.calendarEvents.list.value.length).toBe(4)
    })

    it('should update an event with an exdate', () => {
      const $app = __createAppWithViews__({
        events: [
          {
            id: '1',
            title: 'Test Event 1',
            start: '2025-05-12 14:00',
            end: '2025-05-12 15:00',
          },
        ],
      })
      const plugin = createEventsServicePlugin()
      plugin.beforeRender!($app)
      expect($app.calendarEvents.list.value.length).toBe(1)

      const event = {
        id: '2',
        start: '2025-05-12',
        end: '2025-05-12',
        rrule: 'FREQ=DAILY;COUNT=3',
        exdate: ['20250513', '20250514'],
      }
      plugin.add(event)
      expect($app.calendarEvents.list.value.length).toBe(2)

      plugin.update({
        id: '1',
        start: '2025-05-15 19:00',
        end: '2025-05-15 20:00',
        rrule: 'FREQ=DAILY;COUNT=10',
        exdate: [
          '20250519T190000',
          '20250523T190000',
          '20250524T190000',
          '20250517T190000',
        ],
      })
      expect($app.calendarEvents.list.value.length).toBe(7)
    })
  })

  describe('Setting the whole list of events', () => {
    it('should set the whole list of events', () => {
      const $app = __createAppWithViews__({
        selectedDate: '2021-01-01',
        defaultView: 'week',
      })
      const plugin = createEventsServicePlugin()
      plugin.beforeRender!($app)
      expect($app.calendarEvents.list.value.length).toBe(0)

      const event1 = {
        id: '1',
        start: '2021-01-01',
        end: '2021-01-01',
        rrule: 'FREQ=WEEKLY;COUNT=3',
      }
      plugin.add(event1)
      const event2 = {
        id: '2',
        start: '2021-01-01',
        end: '2021-01-01',
      }
      plugin.add(event2)

      expect(plugin.getAll()).toHaveLength(2)
      expect(plugin.getAll()).toEqual(
        expect.arrayContaining([
          event1,
          { id: '2', start: '2021-01-01', end: '2021-01-01' },
        ])
      )

      const infiniteEvent = {
        id: '5',
        start: '2021-01-01',
        end: '2021-01-01',
        rrule: 'FREQ=DAILY',
      }
      plugin.set([
        { id: '3', start: '2021-01-01', end: '2021-01-01' },
        infiniteEvent,
      ])
      expect(plugin.getAll()).toHaveLength(2)
      expect($app.calendarEvents.list.value.length).toBe(4)
      expect(plugin.getAll()).toEqual(
        expect.arrayContaining([
          { id: '3', start: '2021-01-01', end: '2021-01-01' },
          infiniteEvent,
        ])
      )
    })

    it('should set the whole list of events with exdate', () => {
      const $app = __createAppWithViews__({
        selectedDate: '2025-05-01',
      })
      const plugin = createEventsServicePlugin()
      plugin.beforeRender!($app)
      expect($app.calendarEvents.list.value.length).toBe(0)

      const events = [
        {
          id: '1',
          start: '2025-05-01',
          end: '2025-05-01',
          rrule: 'FREQ=DAILY;COUNT=5',
          exdate: ['20250502', '20250503'],
        },
        {
          id: '2',
          start: '2025-05-02 22:00',
          end: '2025-05-02 23:00',
          rrule: 'FREQ=DAILY;COUNT=10',
          exdate: [
            '20250509T220000',
            '20250508T220000',
            '20250510T220000',
            '20250511T220000',
          ],
        },
      ]

      plugin.set(events)
      expect(plugin.getAll()).toHaveLength(2)
      expect($app.calendarEvents.list.value.length).toBe(9)
    })
  })
})
