# Swagger Quick Start Guide

## Starting the Server

```bash
cd backend
pnpm run start:dev
```

The server will start on port 6000 (or as configured in `.env` via `PORT` variable).

## Accessing Swagger Documentation

1. **Open your browser** and navigate to:
   ```
   http://localhost:6000/api
   ```

2. **You should see the interactive Swagger UI** with all API endpoints documented

## Using Swagger UI

### 1. Authenticate (Login)
- Expand the **Auth** section
- Click on **POST /auth/login**
- Click **Try it out**
- Enter test credentials:
  ```json
  {
    "email": "your-email@example.com",
    "password": "your-password"
  }
  ```
- Click **Execute**
- Copy the `access_token` from the response

### 2. Set Authorization Token
- Click the **Authorize** button (top right, lock icon)
- Paste the `access_token` in the text field
- Click **Authorize** to apply to all subsequent requests
- Close the dialog

### 3. Test Any Endpoint
- All endpoints now use your authorization token
- Expand any endpoint section
- Click **Try it out**
- Fill in required parameters
- Click **Execute** to see the response

## Key Documentation Features

### Request Documentation
Each endpoint shows:
- **Summary**: Brief description of what it does
- **Description**: Detailed explanation
- **Parameters**: All query parameters, path parameters documented
- **Request Body**: Full schema with examples
- **Authentication**: Required auth method (Bearer token, Cookie, etc.)

### Response Documentation
Each endpoint shows:
- **Success Response (200/201)**: Full schema with example data
- **Error Responses**: All possible error codes with descriptions
  - 400: Validation errors
  - 401: Unauthorized
  - 403: Forbidden (insufficient permissions)
  - 404: Not found

### Data Models
All DTOs are fully documented with:
- **Field descriptions**: What each field represents
- **Data types**: String, number, boolean, object, array, etc.
- **Examples**: Sample values for each field
- **Required/Optional**: Clearly marked
- **Constraints**: Min/max lengths, enum values, patterns

## API Endpoints Summary

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| GET | / | Health check | None |
| POST | /auth/login | User login | None |
| POST | /auth/signup | User registration | None |
| POST | /auth/refresh | Refresh token | Cookie |
| POST | /auth/logout | User logout | Bearer |
| GET | /users/residents | List residents | Bearer + STAFF/MANAGER |
| GET | /users/staffs | List staff | Bearer + MANAGER |
| PATCH | /users/:id/approve | Approve resident | Bearer + STAFF/MANAGER |
| PATCH | /users/:id/reject | Reject resident | Bearer + STAFF/MANAGER |
| GET | /parcels | List all parcels | Bearer + STAFF/MANAGER |
| GET | /parcels/mine | My parcels | Bearer + RESIDENT |
| GET | /parcels/:id | Parcel details | Bearer |
| POST | /parcels | Create parcel | Bearer + STAFF/MANAGER |
| PATCH | /parcels/:id | Update parcel | Bearer + STAFF/MANAGER |
| PATCH | /parcels/pickup/:id | Mark as picked up | Bearer + STAFF/MANAGER |
| PATCH | /parcels/return/:id | Mark as returned | Bearer + STAFF/MANAGER |
| DELETE | /parcels/:id | Delete parcel | Bearer + STAFF/MANAGER |

## Tips & Tricks

### 1. Schema Inspection
- Click on any data type in responses to see the full schema
- Understand the exact structure of returned data

### 2. Example Data
- Swagger shows example data for every response
- Use these as reference for your frontend development

### 3. Required vs Optional
- Green "required" badges show mandatory fields
- Optional fields can be omitted in requests

### 4. Enum Values
- Dropdown lists appear for fields with predefined values
- e.g., `status` field shows available parcel statuses

### 5. Testing Workflows
**Complete flow example:**
1. POST /auth/signup → Create account
2. POST /auth/login → Get access token
3. GET /parcels/mine → View your parcels
4. GET /parcels/:id → View specific parcel
5. POST /auth/logout → Clear session

### 6. Pagination
- Use `limit` to control results per page
- Use `cursor` to navigate through pages
- Check `meta` in responses for pagination info

### 7. Search
- Use `q` parameter in /parcels to search
- Searches across order ID, recipient name, description

## Common Errors

### 401 Unauthorized
- **Cause**: Missing or invalid access token
- **Solution**: 
  1. Login again with `/auth/login`
  2. Copy the new `access_token`
  3. Click **Authorize** and paste it

### 403 Forbidden
- **Cause**: Your user role doesn't have permission
- **Solution**: Use an account with the required role (STAFF/MANAGER for most operations)

### 400 Bad Request
- **Cause**: Validation error in request data
- **Solution**: Check the error message and fix the invalid fields

### 404 Not Found
- **Cause**: Resource doesn't exist
- **Solution**: Verify the ID is correct and the resource exists

## Documentation Files

- **SWAGGER_DOCUMENTATION.md**: Complete API reference
- **README.md**: Project overview
- **Swagger UI**: Interactive `/api` endpoint

## For Development

The Swagger setup includes:
- ✅ All controllers documented with `@ApiTags`
- ✅ All endpoints documented with `@ApiOperation`
- ✅ All DTOs with `@ApiProperty` and `@ApiPropertyOptional`
- ✅ All responses with proper status codes and schemas
- ✅ Authentication schemes (Bearer, Cookie)
- ✅ Role-based access control documented

When adding new endpoints:
1. Add `@ApiTags('Category')` to the controller
2. Add `@ApiOperation()` to the method
3. Add `@ApiResponse()` for each status code
4. Add `@ApiProperty()` to DTO fields
5. Rebuild and reload Swagger UI

## Need Help?

- Check SWAGGER_DOCUMENTATION.md for detailed endpoint reference
- Use Swagger UI's "Try it out" feature for testing
- Review example requests and responses in the documentation
- Check error messages for guidance on required fields
