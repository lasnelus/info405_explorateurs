import { Controller, Get, Param, Post, Body, Delete } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

import { ChildService } from './child.service';

import { AddChildDto } from './dto/add-child.dto';
import { AddEmergencyContactDto } from './dto/add-emergency-contact.dto';
import { ChildResponseDto } from './dto/child-response.dto';
import { EmergencyContactResponseDto } from './dto/emergency-contact-response.dto';
import { AllergyResponseDto } from './dto/allergy-response.dto';
import { AddAllergyDto } from './dto/add-allergy.dto';
import { DeleteResponseDto } from './dto/delete-response.dto';

@Controller('child')
export class ChildController {
  constructor(private readonly childService: ChildService) {}

  @Get()
  @ApiOperation({ summary: 'Get all children' })
  @ApiResponse({
    status: 200,
    type: [ChildResponseDto],
  })
  getAllChild() {
    return this.childService.getAllChild();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get child by id' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200, type: ChildResponseDto })
  getChildById(@Param('id') id: string) {
    return this.childService.getChildById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create child' })
  @ApiBody({ type: AddChildDto })
  @ApiResponse({ status: 201, type: ChildResponseDto })
  addChild(@Body() body: AddChildDto) {
    return this.childService.addChild({
      ...body,
      birthDate: new Date(body.birthDate),
    });
  }

  @Post(':id/emergency-contact')
  @ApiOperation({ summary: 'Add an emergency contact to a child' })
  @ApiResponse({
    status: 201,
    description: 'Emergency contact added successfully',
    type: EmergencyContactResponseDto,
  })
  addEmergencyContact(
    @Param('id') id: string,
    @Body() body: AddEmergencyContactDto,
  ) {
    return this.childService.addEmergencyContact(id, body);
  }

  @Delete(':id/emergency-contact/:contactId')
  @ApiOperation({ summary: 'Delete emergency contact' })
  @ApiParam({ name: 'id', description: 'Child ID' })
  @ApiParam({ name: 'contactId', description: 'Emergency contact ID' })
  @ApiResponse({
    status: 200,
    description: 'Emergency contact deleted',
  })
  deleteEmergencyContact(
    @Param('id') childId: string,
    @Param('contactId') contactId: string,
  ) {
    return this.childService.deleteEmergencyContact(childId, contactId);
  }

  @Post(':id/allergies')
  @ApiOperation({ summary: 'Add an allergy to a child' })
  @ApiResponse({
    status: 201,
    description: 'Allergy added successfully',
    type: AllergyResponseDto,
  })
  async addAllergy(@Param('id') id: string, @Body() dto: AddAllergyDto) {
    const allergy = await this.childService.addAllergy(id, dto.allergy);

    return {
      id: allergy.id,
      childId: allergy.childId,
      allergy: allergy.allergy,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a child by id' })
  @ApiResponse({
    status: 200,
    description: 'Child deleted successfully',
    type: DeleteResponseDto,
  })
  deleteChild(@Param('id') id: string) {
    return this.childService.deleteChild(id);
  }

  @Delete(':id/allergies/:allergyId')
  @ApiOperation({ summary: 'Delete allergy' })
  @ApiParam({ name: 'id', description: 'Child ID' })
  @ApiParam({ name: 'allergyId', description: 'Allergy ID' })
  @ApiResponse({
    status: 200,
    description: 'Allergy deleted',
  })
  deleteAllergy(
    @Param('id') childId: string,
    @Param('allergyId') allergyId: string,
  ) {
    return this.childService.deleteAllergy(childId, allergyId);
  }
}
