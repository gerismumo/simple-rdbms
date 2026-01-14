export interface HttpErrorDetails {
  context: string;
  message: any;
}

export interface HttpErrorShape extends Error {
  statusCode: number;
  details?: HttpErrorDetails;
}

export function createHttpError(
  statusCode: number,
  message: string,
  details?: HttpErrorDetails
): HttpErrorShape {
  const err = new Error(message) as HttpErrorShape;
  err.statusCode = statusCode;
  err.details = details;
  return err;
}
