"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.successResponse = successResponse;
exports.paginatedRespone = paginatedRespone;
function successResponse(data, message = 'Success', meta) {
    return {
        success: true,
        message,
        data,
        meta,
    };
}
function paginatedRespone(data, meta, message = "Success") {
    return {
        success: true,
        message,
        data,
        meta,
    };
}
//# sourceMappingURL=api-response.js.map