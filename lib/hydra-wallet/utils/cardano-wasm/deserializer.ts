import CardanoWASM from '.'

export const deserializeTx = (txCborHex: string): CardanoWASM.Transaction => CardanoWASM.Transaction.from_hex(txCborHex)
