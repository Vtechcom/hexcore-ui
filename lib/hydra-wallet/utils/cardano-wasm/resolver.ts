import CardanoWASM from '.'
import { deserializeTx } from './deserializer'

export const resolveTxHash = (txHex: string) => {
  const txBody = deserializeTx(txHex).body()
  const txHash = resolveTxBodyHash(txBody)
  return txHash.to_hex()
}

export const resolveTxBodyHash = (txBody: CardanoWASM.TransactionBody) => {
  const tx = CardanoWASM.FixedTransaction.new_from_body_bytes(txBody.to_bytes())
  return tx.transaction_hash()
}
