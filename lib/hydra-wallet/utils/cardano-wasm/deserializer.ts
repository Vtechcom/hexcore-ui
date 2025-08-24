import CardanoWASM from '.'

export const deserializeTx = (txCborHex: string): CardanoWASM.FixedTransaction => {
  return CardanoWASM.FixedTransaction.from_bytes(Buffer.from(txCborHex, 'hex'))
}
