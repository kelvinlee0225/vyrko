import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Material } from './entities/material.entity';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { CategoriaMaterialService } from '../categoria-material/categoria-material.service';

@Injectable()
export class MaterialService {
  constructor(
    @InjectRepository(Material)
    private readonly materialRepository: Repository<Material>,
    private readonly categoriaMaterialService: CategoriaMaterialService,
  ) {}

  async create(createMaterialDto: CreateMaterialDto): Promise<Material> {
    const { categoriaId, ...rest } = createMaterialDto;
    const categoria = await this.categoriaMaterialService.findOne(categoriaId);
    return this.materialRepository.save(
      this.materialRepository.create({ ...rest, categoria }),
    );
  }

  findAll(): Promise<Material[]> {
    return this.materialRepository.find({ relations: { categoria: true } });
  }

  async findOne(id: string): Promise<Material> {
    const material = await this.materialRepository.findOne({
      where: { id },
      relations: { categoria: true },
    });
    if (!material) {
      throw new NotFoundException(`Material ${id} no encontrado`);
    }
    return material;
  }

  async update(
    id: string,
    updateMaterialDto: UpdateMaterialDto,
  ): Promise<Material> {
    const material = await this.findOne(id);
    const { categoriaId, ...rest } = updateMaterialDto;
    if (categoriaId) {
      material.categoria =
        await this.categoriaMaterialService.findOne(categoriaId);
    }
    Object.assign(material, rest);
    return this.materialRepository.save(material);
  }

  async remove(id: string): Promise<void> {
    const material = await this.findOne(id);
    await this.materialRepository.remove(material);
  }

  async adjustStock(id: string, delta: number): Promise<Material> {
    const material = await this.findOne(id);
    material.stockActual = (parseFloat(material.stockActual) + delta).toFixed(
      2,
    );
    return this.materialRepository.save(material);
  }
}
