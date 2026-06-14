export class ApiError extends Error {
  constructor(status, message, errors = undefined) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

export function handleError(error, _request, response, _next) {
  if (error instanceof ApiError) {
    const body = { message: error.message };

    if (error.errors) {
      body.errors = error.errors;
    }

    return response.status(error.status).json(body);
  }

  console.error(error);

  return response.status(500).json({
    message: 'Internal server error',
  });
}
