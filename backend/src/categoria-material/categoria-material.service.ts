import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoriaMaterial } from './entities/categoria-material.entity';
import { CreateCategoriaMaterialDto } from './dto/create-categoria-material.dto';
import { UpdateCategoriaMaterialDto } from './dto/update-categoria-material.dto';

@Injectable()
export class CategoriaMaterialService {
  constructor(
    @InjectRepository(CategoriaMaterial)
    private readonly categoriaMaterialRepository: Repository<CategoriaMaterial>,
  ) {}

  create(
    createCategoriaMaterialDto: CreateCategoriaMaterialDto,
  ): Promise<CategoriaMaterial> {
    return this.categoriaMaterialRepository.save(
      this.categoriaMaterialRepository.create(createCategoriaMaterialDto),
    );
  }

  findAll(): Promise<CategoriaMaterial[]> {
    return this.categoriaMaterialRepository.find();
  }

  async findOne(id: string): Promise<CategoriaMaterial> {
    const categoriaMaterial = await this.categoriaMaterialRepository.findOne({
      where: { id },
    });
    if (!categoriaMaterial) {
      throw new NotFoundException(`Categoria de material ${id} no encontrada`);
    }
    return categoriaMaterial;
  }

  async update(
    id: string,
    updateCategoriaMaterialDto: UpdateCategoriaMaterialDto,
  ): Promise<CategoriaMaterial> {
    const categoriaMaterial = await this.findOne(id);
    Object.assign(categoriaMaterial, updateCategoriaMaterialDto);
    return this.categoriaMaterialRepository.save(categoriaMaterial);
  }

  async remove(id: string): Promise<void> {
    const categoriaMaterial = await this.findOne(id);
    await this.categoriaMaterialRepository.remove(categoriaMaterial);
  }
}
