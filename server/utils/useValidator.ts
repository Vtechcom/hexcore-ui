import { ErrorWithTrace } from './customize-error'
import type { ZodType } from 'zod'

export const useZodValidator = <T>(schema: ZodType<T>, value: any): T => {
  try {
    return schema.parse(value)
  } catch (error: any) {
    throw new ErrorWithTrace({
      name: 'ValidationError',
      message: 'Validation failed',
      reason: error,
      trace: error.issues || JSON.parse(error.message),
      status: 'VALIDATION_ERROR',
      statusCode: 422,
      data: null
    })
  }
}
