# Swagger/OpenAPI Documentation Setup

## Overview
Complete Swagger/OpenAPI documentation has been integrated into the Parcel Pilot API. This provides interactive API documentation accessible via a web interface at `/api`.

## Setup Details

### Installation
- **Package**: `@nestjs/swagger` - Installed via `pnpm add @nestjs/swagger --filter backend`

### Configuration
Swagger is configured in [src/main.ts](src/main.ts) with the following:

```typescript
const config = new DocumentBuilder()
    .setTitle('Parcel Pilot API')
    .setDescription('API documentation for Parcel Pilot - A parcel management system')
    .setVersion('1.0.0')
    .addTag('Auth', 'Authentication endpoints for login, signup, and token management')
    .addTag('Users', 'User management endpoints for residents and staff')
    .addTag('Parcels', 'Parcel management endpoints for creating, updating, and tracking parcels')
    .addBearerAuth(...)
    .addCookieAuth('refresh_token', ...)
    .build();
```

## Access Swagger UI
- **URL**: `http://localhost:6000/api`
- **Method**: Open in browser after starting the server with `pnpm run start:dev`

## Documented Endpoints

### 1. Health Check (`/`)
- **GET /**: Health check endpoint
- **Tags**: Health
- **Response**: String message "Hello World!"

### 2. Authentication (`/auth`)
All endpoints require request body validation via `LoginDto` and `SignupDto`

#### POST /auth/login
- **Description**: Authenticate user with email and password
- **Request Body**: `LoginDto`
  - `email` (string, required): Valid email format
  - `password` (string, required): 6-30 characters
- **Response**: `LoginResponseDto`
  - `access_token` (string): JWT access token
  - `token_type` (string): Always "Bearer"
  - `user` (object): Authenticated user details
- **Cookie Set**: `refresh_token` (httpOnly, secure)
- **Status Codes**: 
  - `200`: Success
  - `400`: Validation error
  - `401`: Invalid credentials

#### POST /auth/signup
- **Description**: Register new user (resident)
- **Request Body**: `SignupDto`
  - `email` (string, required): Valid email
  - `name` (string, required): User's full name
  - `unitNumber` (string, required): Unit/apartment number
  - `phone` (string, optional): Contact number
  - `password` (string, required): 6-30 characters
- **Response**: `SignupResponseDto`
  - User object with initial PENDING status
- **Status Codes**:
  - `201`: User created successfully
  - `400`: Validation error or email exists

#### POST /auth/refresh
- **Description**: Get new access token using refresh token
- **Authentication**: Requires `refresh_token` cookie
- **Response**: `LoginResponseDto`
  - New access token
  - Updated user information
- **Status Codes**:
  - `200`: Token refreshed successfully
  - `403`: Invalid or missing refresh token

#### POST /auth/logout
- **Description**: Logout user and clear refresh token
- **Authentication**: Bearer token (required)
- **Response**: `LogoutResponseDto`
  - `success` (boolean): Always true
  - `message` (string): "Logged out successfully"
- **Status Codes**:
  - `200`: Logout successful
  - `401`: Unauthorized

### 3. Users (`/users`)
All endpoints require authentication with Bearer token.

#### GET /users/residents
- **Description**: Get list of residents with filtering
- **Authentication**: Bearer token + STAFF/MANAGER role
- **Query Parameters** (via `ResidentFilterDto`):
  - `cursor` (string, optional): Pagination cursor
  - `limit` (number, optional): Records per page (default: 10)
  - `pending` (boolean, optional): Filter by approval status
- **Response**: `ResidentListResponseDto`
  - `data` (array): Resident objects
  - `meta` (object): Pagination metadata
- **Status Codes**:
  - `200`: Success
  - `403`: Forbidden (insufficient permissions)

#### GET /users/staffs
- **Description**: Get list of staff members
- **Authentication**: Bearer token + MANAGER role only
- **Query Parameters** (via `PaginationDto`):
  - `cursor` (string, optional): Pagination cursor
  - `limit` (number, optional): Records per page (default: 10)
- **Response**: `StaffListResponseDto`
  - Array of staff members with role and status
- **Status Codes**:
  - `200`: Success
  - `403`: Forbidden (only MANAGER can access)

#### PATCH /users/:id/approve
- **Description**: Approve a pending resident
- **Authentication**: Bearer token + STAFF/MANAGER role
- **Path Parameters**:
  - `id` (string): User ID to approve
- **Response**: `ResidentResponseDto`
  - Updated resident with APPROVED status
- **Status Codes**:
  - `200`: Approved successfully
  - `404`: Resident not found
  - `403`: Forbidden

#### PATCH /users/:id/reject
- **Description**: Reject a pending resident
- **Authentication**: Bearer token + STAFF/MANAGER role
- **Path Parameters**:
  - `id` (string): User ID to reject
- **Response**: `ResidentResponseDto`
  - Updated resident with REJECTED status and `rejectedAt` timestamp
- **Status Codes**:
  - `200`: Rejected successfully
  - `404`: Resident not found
  - `403`: Forbidden

### 4. Parcels (`/parcels`)
All endpoints require authentication with Bearer token.

#### GET /parcels
- **Description**: Get all parcels (staff/manager only)
- **Authentication**: Bearer token + STAFF/MANAGER role
- **Query Parameters** (via `GetParcelsFilterDto`):
  - `cursor` (string, optional): Pagination cursor
  - `limit` (number, optional): Records per page (default: 10)
  - `q` (string, optional): Search query (order ID, recipient name, description)
- **Response**: `ParcelListResponseDto`
  - Array of all parcels with recipient details
- **Status Codes**:
  - `200`: Success
  - `403`: Forbidden

#### GET /parcels/mine
- **Description**: Get parcels for logged-in resident
- **Authentication**: Bearer token + RESIDENT role
- **Query Parameters**: Same as GET /parcels
- **Response**: `ParcelListResponseDto`
  - Array of user's parcels only
- **Status Codes**:
  - `200`: Success
  - `403`: Forbidden (non-residents)

#### GET /parcels/:id
- **Description**: Get specific parcel details
- **Authentication**: Bearer token
- **Path Parameters**:
  - `id` (string): Parcel ID
- **Authorization**: Residents can only view their own parcels
- **Response**: `ParcelResponseDto`
  - Complete parcel details including recipient info
- **Status Codes**:
  - `200`: Success
  - `404`: Parcel not found
  - `403`: Cannot view other residents' parcels

#### POST /parcels
- **Description**: Create new parcel
- **Authentication**: Bearer token + STAFF/MANAGER role
- **Request Body**: `CreateParcelDto`
  - `recipientId` (string, required): Recipient user ID
  - `orderId` (string, optional): Order tracking ID
  - `description` (string, optional): Parcel contents
  - `note` (string, optional): Special handling notes
  - `imageUrl` (string, optional): Photo of parcel
  - `imageKey` (string, optional): Cloud storage key
  - `imageSize` (number, optional): Image size in bytes
  - `courier` (string, optional): Courier service name
- **Response**: `ParcelResponseDto`
  - Newly created parcel with PENDING status
- **Status Codes**:
  - `201`: Created successfully
  - `400`: Validation error
  - `404`: Recipient not found
  - `403`: Forbidden

#### PATCH /parcels/:id
- **Description**: Update parcel information
- **Authentication**: Bearer token + STAFF/MANAGER role
- **Path Parameters**:
  - `id` (string): Parcel ID
- **Request Body**: `UpdateParcelDto`
  - All fields from CreateParcelDto are optional
- **Response**: `ParcelResponseDto`
  - Updated parcel
- **Status Codes**:
  - `200`: Updated successfully
  - `404`: Parcel not found
  - `400`: Validation error
  - `403`: Forbidden

#### PATCH /parcels/pickup/:id
- **Description**: Mark parcel as picked up
- **Authentication**: Bearer token + STAFF/MANAGER role
- **Path Parameters**:
  - `id` (string): Parcel ID
- **Response**: `ParcelResponseDto`
  - Parcel with PICKED_UP status and timestamp
- **Status Codes**:
  - `200`: Success
  - `404`: Parcel not found
  - `400`: Invalid status transition
  - `403`: Forbidden

#### PATCH /parcels/return/:id
- **Description**: Mark parcel as returned
- **Authentication**: Bearer token + STAFF/MANAGER role
- **Path Parameters**:
  - `id` (string): Parcel ID
- **Response**: `ParcelResponseDto`
  - Parcel with RETURNED status and timestamp
- **Status Codes**:
  - `200`: Success
  - `404`: Parcel not found
  - `400`: Invalid status transition
  - `403`: Forbidden

#### DELETE /parcels/:id
- **Description**: Delete parcel record
- **Authentication**: Bearer token + STAFF/MANAGER role
- **Path Parameters**:
  - `id` (string): Parcel ID
- **Response**: `DeleteParcelResponseDto`
  - Confirmation with deleted parcel ID
- **Status Codes**:
  - `200`: Deleted successfully
  - `404`: Parcel not found
  - `403`: Forbidden

## Response DTOs

### Authentication Responses
- **LoginResponseDto**: Access token, token type, and user object
- **SignupResponseDto**: New user details with creation timestamp
- **LogoutResponseDto**: Success indicator and message

### User Responses
- **UserResponseDto**: Basic user information
- **ResidentResponseDto**: Resident with unit number and approval status
- **StaffResponseDto**: Staff member with role
- **ResidentListResponseDto**: Paginated resident list
- **StaffListResponseDto**: Paginated staff list

### Parcel Responses
- **ParcelResponseDto**: Complete parcel details
- **ParcelRecipientDto**: Recipient information within parcel
- **ParcelListResponseDto**: Paginated parcel list
- **DeleteParcelResponseDto**: Deletion confirmation

### Error Responses
- **ErrorResponseDto**: Standard error (status, message, timestamp, path)
- **ValidationErrorResponseDto**: Validation failures
- **NotFoundResponseDto**: Resource not found
- **UnauthorizedResponseDto**: Authentication failures
- **ForbiddenResponseDto**: Authorization failures

## Authentication Schemes

### Bearer Token (Access Token)
- Used for most endpoints
- Provided in `Authorization` header: `Authorization: Bearer <token>`
- Valid for 15 minutes (configurable)
- Obtained from `/auth/login` or `/auth/refresh`

### Cookie Authentication (Refresh Token)
- Used for token refresh
- Automatically sent by browser
- httpOnly flag prevents JavaScript access
- Secure flag requires HTTPS in production
- SameSite=lax prevents CSRF attacks
- Valid for 7 days

## Example Usage

### Login
```bash
curl -X POST http://localhost:6000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Get Parcels with Token
```bash
curl -X GET http://localhost:6000/api/parcels \
  -H "Authorization: Bearer <access_token>"
```

### Create Parcel
```bash
curl -X POST http://localhost:6000/api/parcels \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "recipientId": "resident-id-123",
    "orderId": "ORD-2026-001",
    "description": "Package contents",
    "courier": "DHL"
  }'
```

## Tags
Endpoints are organized under the following tags:
- **Health**: API health check
- **Auth**: Authentication and token management
- **Users**: User management and approvals
- **Parcels**: Parcel CRUD operations

## Features
- ✅ Complete endpoint documentation
- ✅ Request/response examples
- ✅ Parameter descriptions
- ✅ Error response documentation
- ✅ Authentication scheme documentation
- ✅ Role-based access control documentation
- ✅ Interactive "Try it out" feature in Swagger UI
- ✅ Schema definitions for all DTOs
- ✅ Cookie authentication support

## Notes
- Swagger UI persists authorization tokens between requests
- All timestamps are in ISO 8601 format
- Status codes follow REST conventions
- Validation is enforced at the controller level
- Role-based access is enforced through decorators
