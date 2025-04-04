<script setup lang="ts">
  const props = withDefaults(defineProps<IPopup>(), {
    title: '',
    width: '600px',
    center: true,
    showFooter: false,
    showHeader: true,
    appendBody: false,
    closeClickModal: true,
    closePressEscape: true,
    customClass: '',
    contentClass: '',
    modalClass: '',
    showClose: true,
    draggable: false,
    fullscreen: false,
    zIndex: 1800,
    destroyOnClose: false
  })

  const emits = defineEmits<{
    close: []
    open: []
  }>()

  const { popup } = storeToRefs(useMainStore())

  interface IPopup {
    name: Popup
    title?: string
    width?: string
    appendBody?: boolean
    showFooter?: boolean
    showHeader?: boolean
    top?: string
    closeClickModal?: boolean
    closePressEscape?: boolean
    customClass?: string
    contentClass?: string
    modalClass?: string
    showClose?: boolean
    fullscreen?: boolean
    draggable?: boolean
    zIndex?: number
    destroyOnClose?: boolean
    center?: boolean
  }
  const isOpen = computed({
    // getter
    get() {
      return (
        popup.value.findIndex(value => {
          return value === props.name
        }) !== -1
      )
    },
    // setter
    set(value: boolean) {
      usePopupState(props.name, value === true ? 'open' : 'close')
    }
  })

  function handleOpen() {
    emits('open')
  }
  function handleClose() {
    emits('close')
  }

  onMounted(() => {
    if (isOpen.value === true) emits('open')
  })
</script>

<template>
  <client-only>
    <el-dialog
      v-model="isOpen"
      :width="width"
      :append-to-body="appendBody"
      :close-on-press-escape="closePressEscape"
      :close-on-click-modal="closeClickModal"
      :show-close="showClose"
      :top="top"
      :draggable="draggable"
      :fullscreen="fullscreen"
      class="base-popup"
      :class="[!showHeader && 'hidden-header', customClass]"
      :modal-class="modalClass"
      :z-index="zIndex"
      :destroy-on-close="destroyOnClose"
      center
      @open="handleOpen"
      @close="handleClose"
    >
      <template v-if="showHeader" #header>
        <div class="text-semibold popup-header text-primary p-0 text-sm font-semibold uppercase leading-[24px]">
          <slot name="title">
            <h5 class="">
              {{ title }}
            </h5>
          </slot>
        </div>
      </template>
      <div
        class="popup-content scroll-bar-primary text-primary max-h-[70vh] overflow-x-auto"
        :class="[contentClass, fullscreen && 'h-svh']"
      >
        <slot />
      </div>
      <template v-if="showFooter" #footer>
        <div class="popup-footer">
          <slot name="footer" />
        </div>
      </template>
    </el-dialog>
  </client-only>
</template>

<style lang="scss">
  .base-popup {
    display: block;
    border-radius: 12px;
    background: #fff;
    padding: 0;
    max-width: min(calc(100vw - 32px), 900px);
    z-index: 100;

    &.is-fullscreen {
      max-width: 100swv;
      width: 100%;
      border-radius: 0;
      padding: 0;

      &::-webkit-scrollbar {
        width: 4px;
        height: 4px;
        // min-height: 50px;
        -webkit-transition: width 0.3s;
        transition: width 0.3s;
      }

      &::-webkit-scrollbar-track {
        background-color: #ffffff16;
        // background-color: transparent;
      }

      &::-webkit-scrollbar-thumb {
        // background: #747474;
        // background: transparent;
        background: #ffffff40;

        border-radius: 5px;
      }

      .popup-content {
        max-height: unset !important;
      }
    }

    .el-dialog__header {
      padding-bottom: 0;
      .el-dialog__headerbtn {
        --el-color-info: #000000;
        right: 12px;
        top: 12px;
        height: 24px;
        width: 24px;
        font-size: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #000000;
        font-weight: 600;
        z-index: 100;
      }
    }

    .el-dialog__body {
      padding: 0;
    }

    .el-dialog__footer {
      border-top: 1px solid #dbdbdb;
      padding: 0;

      .popup-footer {
        .form-bottom {
          padding: 16px 0;
        }
      }
    }

    // @media screen and (min-width: 768px) {
    //   .el-dialog__header {
    //     .el-dialog__headerbtn {
    //       right: 16px;
    //       top: 18px;
    //     }
    //   }
    // }

    &.hidden-header {
      .el-dialog__header {
        border: none;
        padding: 0;
      }
    }
  }
</style>
