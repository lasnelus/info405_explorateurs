import { Controller, Get, Param, Post, Body, Delete } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { ChildService } from './child.service';
import { FoodConstraint } from '@prisma/client';

// DTO pour créer un enfant
class AddChildDto {
  firstName: string;
  lastName: string;
  birthDate: string; // ISO string
  foodConstraint?: FoodConstraint;
  familyIds?: string[];
}

// DTO pour ajouter un contact d'urgence
class AddEmergencyContactDto {
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

@Controller('child')
export class ChildController {
  constructor(private readonly childService: ChildService) {}

  // -------------------- GET --------------------
  @Get()
  @ApiOperation({ summary: 'Get all children' })
  @ApiResponse({ status: 200, description: 'All children' })
  async getAllChild() {
    return await this.childService.getAllChild();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a child by ID' })
  @ApiParam({ name: 'id', description: 'Child ID' })
  @ApiResponse({ status: 200, description: 'Child found' })
  @ApiResponse({ status: 404, description: 'Child not found' })
  async getChildById(@Param('id') id: string) {
    return await this.childService.getChildById(id);
  }

  // -------------------- POST --------------------
  @Post()
  @ApiOperation({ summary: 'Add a child' })
  @ApiBody({ type: AddChildDto })
  @ApiResponse({ status: 201, description: 'Child added successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async addChild(@Body() body: AddChildDto) {
    const { firstName, lastName, birthDate, foodConstraint, familyIds } = body;
    return await this.childService.addChild({
      firstName,
      lastName,
      birthDate: new Date(birthDate),
      foodConstraint,
      familyIds,
    });
  }

  // Ajouter un contact d'urgence
  @Post(':id/emergency-contact')
  @ApiOperation({ summary: 'Add an emergency contact to a child' })
  @ApiParam({ name: 'id', description: 'Child ID' })
  @ApiBody({ type: AddEmergencyContactDto })
  @ApiResponse({
    status: 201,
    description: 'Emergency contact added successfully',
  })
  async addEmergencyContact(
    @Param('id') id: string,
    @Body() body: AddEmergencyContactDto,
  ) {
    return await this.childService.addEmergencyContact(id, body);
  }

  // Ajouter une allergie
  @Post(':id/allergy')
  @ApiOperation({ summary: 'Add an allergy to a child' })
  @ApiParam({ name: 'id', description: 'Child ID' })
  @ApiResponse({ status: 201, description: 'Allergy added successfully' })
  async addAllergy(@Param('id') id: string) {
    return await this.childService.addAllergy(id);
  }

  // Associer un enfant à une famille existante
  @Post(':id/family/:familyId')
  @ApiOperation({ summary: 'Associate a child with a family' })
  @ApiParam({ name: 'id', description: 'Child ID' })
  @ApiParam({ name: 'familyId', description: 'Family ID' })
  @ApiResponse({
    status: 201,
    description: 'Child added to family successfully',
  })
  async addChildToFamily(
    @Param('id') id: string,
    @Param('familyId') familyId: string,
  ) {
    return await this.childService.addChildToFamily(id, familyId);
  }

  // -------------------- DELETE --------------------
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a child by ID' })
  @ApiParam({ name: 'id', description: 'Child ID to delete' })
  @ApiResponse({ status: 200, description: 'Child deleted successfully' })
  @ApiResponse({ status: 404, description: 'Child not found' })
  async deleteChild(@Param('id') id: string) {
    return await this.childService.deleteChild(id);
  }
}
