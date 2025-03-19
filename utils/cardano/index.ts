import { generateMnemonic as bip39generateMnemonic } from 'bip39'

export function generateMnemonic(wordLength: 12 | 15 | 24 = 15) {
  const byte = wordLength === 12 ? 128 : wordLength === 15 ? 160 : 256
  return bip39generateMnemonic(byte)
}
