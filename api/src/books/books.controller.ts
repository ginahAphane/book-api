import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller()
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get('books')
  findAllBooks(
    @Query('genreId') genreId?: string,
    @Query('search') search?: string,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
  ) {
    return this.booksService.findAll({
      genreId: genreId ? Number(genreId) : undefined,
      search,
      page: Number(page),
      limit: Number(limit),
    });
  }

  @Get('books/:id')
  findOneBook(@Param('id') id: string) {
    return this.booksService.findOne(Number(id));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('LIBRARIAN')
  @Post('books')
  createBook(@Body() dto: CreateBookDto) {
    return this.booksService.create(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('LIBRARIAN')
  @Patch('books/:id')
  updateBook(@Param('id') id: string, @Body() dto: UpdateBookDto) {
    return this.booksService.update(Number(id), dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('LIBRARIAN')
  @Delete('books/:id')
  removeBook(@Param('id') id: string) {
    return this.booksService.remove(Number(id));
  }

  @Get('genres')
  findAllGenres() {
    return this.booksService.findAllGenres();
  }

  @Get('genres/:id')
  findOneGenre(@Param('id') id: string) {
    return this.booksService.findOneGenre(Number(id));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('LIBRARIAN')
  @Post('genres')
  createGenre(@Body() dto: CreateGenreDto) {
    return this.booksService.createGenre(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('LIBRARIAN')
  @Patch('genres/:id')
  updateGenre(@Param('id') id: string, @Body() dto: UpdateGenreDto) {
    return this.booksService.updateGenre(Number(id), dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('LIBRARIAN')
  @Delete('genres/:id')
  removeGenre(@Param('id') id: string) {
    return this.booksService.removeGenre(Number(id));
  }
}