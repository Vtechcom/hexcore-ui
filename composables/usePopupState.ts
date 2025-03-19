export enum Popup {
  POPUP_VIEW_UTXO = 'POPUP_VIEW_UTXO',
  POPUP_CREATE_WALLET_ACCOUNT = 'POPUP_CREATE_WALLET_ACCOUNT'
}

export const usePopupState = (popupName: Popup, state: 'open' | 'close') => {
  const mainStore = useMainStore()
  mainStore.setPopupState(state === 'open', popupName)
}
