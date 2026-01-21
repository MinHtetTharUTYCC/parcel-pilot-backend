"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.successResponse = successResponse;
exports.paginatedResponse = paginatedResponse;
function successResponse(data, message = 'Success', meta) {
    return {
        success: true,
        message,
        data,
        meta,
    };
}
function paginatedResponse(data, meta, message = "Success") {
    return {
        success: true,
        message,
        data,
        meta,
    };
}
