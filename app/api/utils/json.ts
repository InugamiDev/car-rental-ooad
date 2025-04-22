export function parseJsonField<T>(jsonString: string | null): T | null {
  if (!jsonString) return null
  try {
    return JSON.parse(jsonString) as T
  } catch {
    return null
  }
}

export function formatCarResponse(car: any) {
  return {
    ...car,
    coordinates: parseJsonField(car.coordinates),
    specifications: parseJsonField(car.specifications),
    images: car.images ? car.images.split(',') : []
  }
}

export function formatRentalResponse(rental: any) {
  return {
    ...rental,
    car: rental.car ? formatCarResponse(rental.car) : null
  }
}

interface IApiError {
  message: string
  status: number
}

export function isApiError(error: unknown): error is IApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as IApiError).message === 'string' &&
    'status' in error &&
    typeof (error as IApiError).status === 'number'
  )
}

export class ApiError extends Error implements IApiError {
  public readonly status: number

  constructor(message: string, status: number = 500) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export function handleApiError(error: unknown) {
  console.error('API Error:', error)
  
  if (error instanceof ApiError) {
    return Response.json(
      { error: error.message },
      { status: error.status }
    )
  }

  if (error instanceof Error) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    )
  }

  return Response.json(
    { error: 'An unexpected error occurred' },
    { status: 500 }
  )
}