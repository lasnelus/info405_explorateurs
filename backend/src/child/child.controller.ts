import { Controller, Get, Param, Post, Body, Delete } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ChildService } from './child.service';
@Controller('child')
export class ChildController {
  constructor(private readonly childService: ChildService) {}
  @Get()
  @ApiOperation({ summary: 'Get all children' })
  @ApiResponse({
    status: 200,
    description: 'All children',
    schema: {
      example: [
        {
          id: 'ckx123abc456',
          firstName: 'Tom',
          lastName: 'Martin',
          families: [],
          slots: [],
          queues: [],
          createdAt: '2026-01-26T11:58:55.000Z',
          updatedAt: '2026-01-26T12:10:12.000Z',
        },
      ],
    },
  })
  async getAllChild() {
    return this.childService.getAllChild();
  }

  @ApiResponse({
    status: 200,
    description: 'Child found',
    schema: {
      example: {
        id: 'ckx123abc456',
        firstName: 'Tom',
        lastName: 'Martin',
        families: [],
        slots: [],
        queues: [],
        createdAt: '2026-01-26T11:58:55.000Z',
        updatedAt: '2026-01-26T12:10:12.000Z',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Child not found' })
  @Get(':id')
  @ApiOperation({ summary: 'Get a children with an ID' })
  getChildById(@Param('id') id: string) {
    return this.childService.getChildById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Add a Children' })
  @ApiResponse({
    status: 201,
    description: 'Child added successfully',
    schema: {
      example: {
        data: {
          id: 'ckx123abc456',
          firstName: 'Tom',
          lastName: 'Martin',
          families: [],
          slots: [],
          queues: [],
          createdAt: '2026-01-26T11:58:55.000Z',
          updatedAt: '2026-01-26T12:10:12.000Z',
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  addChild(@Body() body: { firstName: string; lastName: string }) {
    return this.childService.addChild(body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a Children with an ID' })
  @ApiParam({
    name: 'id',
    description: 'Child ID to delete',
    example: 'ckx123abc456',
  })
  @ApiResponse({
    status: 200,
    description: 'Child deleted successfully',
    schema: {
      example: { message: `Child with id ckx123abc456 deleted successfully.` },
    },
  })
  @ApiResponse({ status: 404, description: 'Child not found' })
  async deleteChild(@Param('id') id: string) {
    return this.childService.deleteChild(id);
  }
}
