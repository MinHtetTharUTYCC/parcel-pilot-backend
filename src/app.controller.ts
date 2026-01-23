import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";

export class HealthCheckResponseDto {
  status: string;
  timestamp: string;
  service: string;
}

@ApiTags("health")
@Controller("health")
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  @ApiOperation({
    summary: "Health Check",
    description: "Check if the API server is running and healthy.",
  })
  @ApiResponse({
    status: 200,
    description: "Server is healthy and running",
    type: HealthCheckResponseDto,
    schema: {
      example: {
        "status": "ok",
        "timestamp": "2024-10-01T12:34:56.789Z",
        "service": "Parcel Pilot API",
      },
    },
  })
  checkHealth() {
    return this.appService.checkHealth();
  }
}
