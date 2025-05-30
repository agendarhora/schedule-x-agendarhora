import '@fontsource/open-sans'
import '@fontsource/open-sans/300.css'
import '@fontsource/open-sans/500-italic.css'
import '@fontsource/open-sans/700.css'
import '@fontsource/open-sans/700-italic.css'
import '@fontsource/roboto-condensed'
import '../app.css'
import '../../packages/theme-default/src/time-picker.scss'
import { createTimePicker } from '../../packages/time-picker/src/factory.ts'
import { translate } from '@schedule-x/translations/src'
import { signal } from '@preact/signals'
import { translations } from '@schedule-x/translations/src'

const onChange = (time: string) => {
  console.log('Time changed:', time)
}

const timePicker = createTimePicker({
  onChange,
  teleportTo: document.body,
  is12Hour: true,
  // dark: true,
  initialValue: '23:59',
  onEscapeKeyDown: ($app) => {
    $app.timePickerState.isOpen.value = false
  }
}, translate(signal('mk-MK'), signal(translations)))
timePicker.render(document.querySelector('#app') as HTMLElement)
