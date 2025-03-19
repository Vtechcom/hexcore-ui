import presetRemToPx from '@unocss/preset-rem-to-px'
import presetLegacyCompat from '@unocss/preset-legacy-compat'

import { defineConfig, presetTypography, presetUno } from 'unocss'

export default defineConfig({
  presets: [
    presetRemToPx({
      baseFontSize: 16
    }),
    presetTypography(),
    presetUno(),
    presetLegacyCompat({
      // options
      commaStyleColorFunction: true,
      legacyColorSpace: true
    })
  ]
})
