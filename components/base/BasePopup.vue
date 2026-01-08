<script setup lang="ts">
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
    alignCenter?: boolean
  }

  const props = withDefaults(defineProps<IPopup>(), {
    title: '',
    width: '600px',
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
    destroyOnClose: false,
    alignCenter: false
  })

  const emits = defineEmits<{
    close: []
    open: []
  }>()

  const { popup } = storeToRefs(useMainStore())

  const isOpen = computed({
    get() {
      return (
        popup.value.findIndex(value => {
          return value === props.name
        }) !== -1
      )
    },
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
      lock-scroll
      :width
      :append-to-body="appendBody"
      :close-on-press-escape="closePressEscape"
      :close-on-click-modal="closeClickModal"
      :show-close="showClose"
      :top="top"
      :draggable
      :fullscreen
      class="base-popup"
      :class="[!showHeader && 'hidden-header', customClass]"
      :modal-class="modalClass"
      :z-index="zIndex"
      :destroy-on-close="destroyOnClose"
      :align-center
      @open="handleOpen"
      @close="handleClose"
    >
      <template v-if="showHeader" #header>
        <div class="p-4 text-base font-semibold uppercase leading-[24px]">
          <slot name="title">
            {{ title }}
          </slot>
        </div>
      </template>
      <div class="popup-content scroll-bar-primary overflow-x-auto" :class="[contentClass, fullscreen && 'h-svh']">
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
      }

      &::-webkit-scrollbar-thumb {
        background: #ffffff40;

        border-radius: 5px;
      }

      .popup-content {
        max-height: unset !important;
      }
    }

    .el-dialog__header {
      border-bottom: 1px solid #dbdbdb;
      padding: 0;

      .el-dialog__headerbtn {
        top: 6px;
      }
    }

    .el-dialog__footer {
      border-top: 1px solid #dbdbdb;
      padding: 0;
    }

    &.hidden-header {
      .el-dialog__header {
        border: none;
        padding: 0;
      }
    }
  }
</style>
