export enum Popup {
  POPUP_VIEW_UTXO = 'POPUP_VIEW_UTXO',
  POPUP_CREATE_WALLET_ACCOUNT = 'POPUP_CREATE_WALLET_ACCOUNT',
  POPUP_CREATE_HYDRA_HEAD = 'POPUP_CREATE_HYDRA_HEAD',
  POPUP_MONITORING_HYDRA_NODE = 'POPUP_MONITORING_HYDRA_NODE',

  // Consumer
  POPUP_CONSUMER_SELECT_NODE = 'POPUP_CONSUMER_SELECT_NODE'
}

export const usePopupState = (popupName: Popup, state: 'open' | 'close') => {
  const mainStore = useMainStore()
  mainStore.setPopupState(state === 'open', popupName)
}
