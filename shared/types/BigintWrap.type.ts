export type BigintWrap<T> = {
  bigIntFields: string[]
  data: {
    data: T
    message: string
    status: string
    statusCode: number
  }
}
