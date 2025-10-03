import { type TxHash, type UTxOObject, ParserUtils } from '@hydra-sdk/core'
import { CardanoWASM } from '@hydra-sdk/cardano-wasm'
import type { OgmiosAddressUtxo } from '~/shared/types/AddressesUtxoRes.type'

export function parseOgmiosUtxoToObject(utxo: OgmiosAddressUtxo): UTxOObject {
  const txHash = `${utxo.transaction.id}#${utxo.index}` as TxHash

  const inlineDatum = utxo.datum ? ParserUtils.hexToString(utxo.datum) : undefined
  const inlineDatumRaw = utxo.datum ? ParserUtils.hexToString(utxo.datum) : undefined
  const plutusData = inlineDatumRaw ? CardanoWASM.PlutusData.from_bytes(ParserUtils.toBytes(inlineDatumRaw)) : undefined
  const inlineDatumhash = plutusData ? CardanoWASM.hash_plutus_data(plutusData).to_hex() : undefined

  let referenceScript: UTxOObject[TxHash]['referenceScript'] = null
  if (utxo.script) {
    const languageMap = {
      'plutus:v1': 'PlutusScriptV1',
      'plutus:v2': 'PlutusScriptV2',
      'plutus:v3': 'PlutusScriptV3',
      native: 'SimpleScript'
    }
    referenceScript = {
      scriptLanguage: languageMap[utxo.script['language']],
      script: {
        type: languageMap[utxo.script['language']] as
          | 'SimpleScript'
          | 'PlutusScriptV1'
          | 'PlutusScriptV2'
          | 'PlutusScriptV3',
        description: '',
        cborHex: utxo.script['cbor']
      }
    }
  }

  const { ada, ...units } = utxo.value

  return {
    [txHash]: {
      address: utxo.address,
      datum: utxo.datum,
      datumhash: utxo.datumHash,
      inlineDatum,
      inlineDatumhash,
      inlineDatumRaw,
      referenceScript: referenceScript,
      value: {
        lovelace: utxo.value.ada ? Number(utxo.value.ada.lovelace) : 0,
        ...units
      }
    }
  } as UTxOObject
}
