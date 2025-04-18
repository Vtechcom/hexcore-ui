export const useCopy = (content: string): void => {
  navigator.clipboard.writeText(content)
  ElMessage.success({ content: 'Copied!', key: 'copy', duration: 2 })
}
