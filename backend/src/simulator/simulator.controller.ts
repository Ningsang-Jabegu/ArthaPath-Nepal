import { Controller, Post, Body, ValidationPipe, Get, UseGuards, Request } from '@nestjs/common';
import { SimulatorService } from './simulator.service';
import { UserInputDto } from './dto/user-input.dto';

@Controller('simulator')
export class SimulatorController {
  constructor(private readonly simulatorService: SimulatorService) {}

  /**
   * Run simulation (public - no auth required for MVP)
   */
  @Post('run')
  async runSimulation(@Body(ValidationPipe) userInput: UserInputDto) {
    return this.simulatorService.runSimulation(userInput);
  }

  /**
   * Get user simulation history (requires auth - future implementation)
   */
  // @UseGuards(JwtAuthGuard)
  // @Get('history')
  // async getHistory(@Request() req) {
  //   return this.simulatorService.getUserHistory(req.user.id);
  // }
}
