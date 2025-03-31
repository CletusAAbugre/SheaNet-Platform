const successResponse = (data = null, message = "Success", meta = {}) => ({
    success: true,
    message,
    data,
    ...meta
});

const errorResponse = (message = "Error", errors = null, code = null) => ({
    success: false,
    message,
    ...(errors && { errors }),
    ...(code && { code })
});

const paginatedResponse = (items, total, page, limit) => ({
    success: true,
    data: items,
    meta: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
    }
});

module.exports = {
    successResponse,
    errorResponse,
    paginatedResponse
};