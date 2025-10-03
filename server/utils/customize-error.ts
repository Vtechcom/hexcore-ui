export class ErrorWithTrace extends Error {
  status: string
  statusCode?: number
  override message: string
  reason: any
  trace: any
  data: unknown

  constructor(option: string | Partial<ErrorWithTrace>) {
    if (typeof option === 'string') {
      super(option)
      this.statusCode = 400
      this.status = 'ERROR'
      this.message = option
      this.reason = null
      this.trace = null
      this.data = null
      Object.setPrototypeOf(this, ErrorWithTrace.prototype)
      return
    }
    const { status = 'ERROR', message, reason, trace, data, statusCode } = option
    super(message)
    this.status = status
    this.statusCode = statusCode
    this.message = message || ''
    this.reason = reason
    this.trace = trace
    this.data = data
    Object.setPrototypeOf(this, ErrorWithTrace.prototype)
  }
}
