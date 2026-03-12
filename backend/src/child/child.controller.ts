import { Controller, Get, Param, Post, Body, Delete } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { ChildService } from './child.service';

// Import des DTOs split dans leurs fichiers respectifs
import { AddChildDto } from './dto/add-child.dto';
import { AddEmergencyContactDto } from './dto/add-emergency-contact.dto';
import { ChildResponseDto } from './dto/child-response.dto';
import { EmergencyContactResponseDto } from './dto/emergency-contact-response.dto';
import { AllergyResponseDto } from './dto/allergy-response.dto';
import { DeleteResponseDto } from './dto/delete-response.dto';

@Controller('child')
export class ChildController {
  constructor(private readonly childService: ChildService) {}

  // -------------------- GET --------------------
  @Get()
  @ApiOperation({ summary: 'Get all children' })
  @ApiResponse({
    status: 200,
    description: 'All children',
    type: [ChildResponseDto],
  })
  async getAllChild() {
    return await this.childService.getAllChild();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a child by ID' })
  @ApiParam({ name: 'id', description: 'Child ID', example: 'ckx123abc456' })
  @ApiResponse({
    status: 200,
    description: 'Child found',
    type: ChildResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Child not found' })
  async getChildById(@Param('id') id: string) {
    return await this.childService.getChildById(id);
  }

  // -------------------- POST --------------------
  @Post()
  @ApiOperation({ summary: 'Add a child' })
  @ApiBody({ type: AddChildDto })
  @ApiResponse({
    status: 201,
    description: 'Child added successfully',
    type: ChildResponseDto,
  })
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

  @Post(':id/emergency-contact')
  @ApiOperation({ summary: 'Add an emergency contact to a child' })
  @ApiParam({ name: 'id', description: 'Child ID' })
  @ApiBody({ type: AddEmergencyContactDto })
  @ApiResponse({
    status: 201,
    description: 'Emergency contact added successfully',
    type: EmergencyContactResponseDto,
  })
  async addEmergencyContact(
    @Param('id') id: string,
    @Body() body: AddEmergencyContactDto,
  ) {
    return await this.childService.addEmergencyContact(id, body);
  }

  @Post(':id/allergy')
  @ApiOperation({ summary: 'Add an allergy to a child' })
  @ApiParam({ name: 'id', description: 'Child ID' })
  @ApiResponse({
    status: 201,
    description: 'Allergy added successfully',
    type: AllergyResponseDto,
  })
  async addAllergy(@Param('id') id: string) {
    return await this.childService.addAllergy(id);
  }

  @Post(':id/family/:familyId')
  @ApiOperation({ summary: 'Associate a child with a family' })
  @ApiParam({ name: 'id', description: 'Child ID' })
  @ApiParam({ name: 'familyId', description: 'Family ID' })
  @ApiResponse({
    status: 201,
    description: 'Child added to family successfully',
    type: ChildResponseDto,
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
  @ApiResponse({
    status: 200,
    description: 'Child deleted successfully',
    type: DeleteResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Child not found' })
  async deleteChild(@Param('id') id: string) {
    return await this.childService.deleteChild(id);
  }
}
