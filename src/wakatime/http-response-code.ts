export const HttpResponseCode = {
    200: {
        code: 200,
        status: 'OK',
        message: 'The request has succeeded.',
    },
    201: {
        code: 201,
        status: 'Created',
        message: 'The request has been fulfilled and resulted in a new resource being created.',
    },
    202: {
        code: 202,
        status: 'Accepted',
        message: 'The request has been accepted for processing, but the processing has not been completed.',
    },
    400: {
        code: 400,
        status: 'Bad Request',
        message: 'The request is invalid. Check error message and try again.',
    },
    401: {
        code: 401,
        status: 'Unauthorized',
        message: 'The request requires user authentication or, your authentication was invalid.',
    },
    403: {
        code: 403,
        status: 'Forbidden',
        message: 'You are authenticated, but do not have permission to access the resource.',
    },
    404: {
        code: 404,
        status: 'Not Found',
        message: 'The resource does not exist.',
    },
    429: {
        code: 429,
        status: 'Too Many Requests',
        message:
            'You are being rate limited, try making fewer than 10 requests per second on average over any 5 minute period.',
    },
    500: {
        code: 500,
        status: 'Internal Server Error',
        message: 'Service unavailable, try again later.',
    },
};
