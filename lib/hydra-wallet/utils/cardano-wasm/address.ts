import * as CardanoWASM from '@emurgo/cardano-serialization-lib-browser'

// interface AddressInterface {
//     static fromBytes(hex: Uint8Array): Address;
//     toBytes(): Uint8Array;
//     static fromBase58(base58Address: string): Address;
//     toBase58(): PaymentAddress;
//     toBech32(): PaymentAddress | RewardAccount;
//     static fromBech32(bech32: string): Address;
//     static fromString(address: string): Address | null;
//     static isValidBech32(bech32: string): boolean;
//     static isValidByron(base58: string): boolean;
//     static isValid(address: string): boolean;
//     asByron(): ByronAddress | undefined;
//     asReward(): RewardAddress | undefined;
//     asPointer(): PointerAddress | undefined;
//     asEnterprise(): EnterpriseAddress | undefined;
//     asBase(): BaseAddress | undefined;
//     getType(): AddressType;
//     getNetworkId(): NetworkId;
//     getProps(): AddressProps;
//     private static getBech32Prefix;
// }

export class Address {
  private _address: CardanoWASM.Address

  constructor(address: CardanoWASM.Address) {
    this._address = address
  }

  static fromBytes(bytes: Uint8Array): Address {
    return new Address(CardanoWASM.Address.from_bytes(bytes))
  }

  toBytes(): Uint8Array {
    return this._address.to_bytes()
  }

  static fromBech32(bech32: string): Address {
    return new Address(CardanoWASM.Address.from_bech32(bech32))
  }

  toBech32(): string {
    return this._address.to_bech32()
  }

  getNetworkId(): number {
    return this._address.network_id()
  }
}
