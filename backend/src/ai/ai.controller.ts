import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { IsArray, IsOptional } from 'class-validator';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

class SuggestionDto {
  @IsArray()
  @IsOptional()
  tasks?: Array<{
    id: string;
    title: string;
    description?: string;
    importance: string;
    urgency: number;
    completed: boolean;
  }>;
}

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('suggestion')
  @UseGuards(JwtAuthGuard)
  async getSuggestion(@Body() suggestionDto: SuggestionDto) {
    const suggestion = await this.aiService.getSuggestion(suggestionDto.tasks || []);
    return { suggestion };
  }
}
