import 'reflect-metadata';
import { config } from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { AppModule } from '../app.module';
import { Rol } from '../rol/entities/rol.entity';
import { Usuario } from '../usuario/entities/usuario.entity';
import { Pieza } from '../pieza/entities/pieza.entity';
import { Servicio } from '../servicio/entities/servicio.entity';
import { CategoriaMaterial } from '../categoria-material/entities/categoria-material.entity';
import { Material } from '../material/entities/material.entity';
import { MovimientoInventarioService } from '../movimiento-inventario/movimiento-inventario.service';

config();

const SALT_ROUNDS = 10;

const PIEZAS = [
  'Bómper trasero',
  'Puerta trasera',
  'Vidrio trasero',
  'Puerta trasera izquierda',
  'Calavera trasera izquierda',
  'Calavera trasera',
  'Puerta trasera derecha',
  'Calavera trasera derecha',
  'Bómper delantero',
  'Puerta delantera',
  'Parabrisas',
  'Puerta delantera izquierda',
  'Foco delantero izquierdo',
  'Foco delantero',
  'Puerta delantera derecha',
  'Foco delantero derecho',
  'Bonete',
  'Retrovisor izquierdo',
  'Objeto',
  'Retrovisor derecho',
  'Portón trasero',
  'Baúl',
  'Goma',
];

const SERVICIOS: { nombre: string; tipoTrabajo: string; precioBase: string }[] =
  [
    {
      nombre: 'Cambiar y pintar',
      tipoTrabajo: 'Cambiar y pintar',
      precioBase: '0.00',
    },
    {
      nombre: 'Reparar y pintar',
      tipoTrabajo: 'Reparar y pintar',
      precioBase: '0.00',
    },
    { nombre: 'Obra A/C', tipoTrabajo: 'Obra A/C', precioBase: '0.00' },
  ];

interface MaterialSeed {
  codigo: string;
  nombre: string;
  categoria: string;
  precioCosto: string;
  stockInicial: number;
}

const MATERIALES: MaterialSeed[] = [
  {
    codigo: 'PIN-001',
    nombre: 'Base bicapa blanca (galón)',
    categoria: 'Pintura',
    precioCosto: '4500.00',
    stockInicial: 8,
  },
  {
    codigo: 'PIN-002',
    nombre: 'Barniz transparente 2K (galón)',
    categoria: 'Pintura',
    precioCosto: '3800.00',
    stockInicial: 6,
  },
  {
    codigo: 'PIN-003',
    nombre: 'Primer gris (galón)',
    categoria: 'Pintura',
    precioCosto: '2200.00',
    stockInicial: 10,
  },
  {
    codigo: 'PIN-004',
    nombre: 'Thinner acrílico (galón)',
    categoria: 'Pintura',
    precioCosto: '850.00',
    stockInicial: 20,
  },
  {
    codigo: 'MAS-001',
    nombre: 'Masilla plástica (bondo)',
    categoria: 'Masillas y selladores',
    precioCosto: '950.00',
    stockInicial: 15,
  },
  {
    codigo: 'MAS-002',
    nombre: 'Sellador de juntas (cartucho)',
    categoria: 'Masillas y selladores',
    precioCosto: '650.00',
    stockInicial: 12,
  },
  {
    codigo: 'ABR-001',
    nombre: 'Lija #80 (pliego)',
    categoria: 'Abrasivos',
    precioCosto: '45.00',
    stockInicial: 100,
  },
  {
    codigo: 'ABR-002',
    nombre: 'Lija #240 (pliego)',
    categoria: 'Abrasivos',
    precioCosto: '45.00',
    stockInicial: 100,
  },
  {
    codigo: 'ABR-003',
    nombre: 'Lija #400 (pliego)',
    categoria: 'Abrasivos',
    precioCosto: '50.00',
    stockInicial: 80,
  },
  {
    codigo: 'ABR-004',
    nombre: 'Lija #800 (pliego)',
    categoria: 'Abrasivos',
    precioCosto: '55.00',
    stockInicial: 60,
  },
  {
    codigo: 'ENM-001',
    nombre: 'Cinta de enmascarar 3/4" (rollo)',
    categoria: 'Enmascarado',
    precioCosto: '120.00',
    stockInicial: 40,
  },
  {
    codigo: 'ENM-002',
    nombre: 'Papel de enmascarar (rollo)',
    categoria: 'Enmascarado',
    precioCosto: '480.00',
    stockInicial: 10,
  },
  {
    codigo: 'CON-001',
    nombre: 'Guantes de nitrilo (caja 100)',
    categoria: 'Consumibles',
    precioCosto: '750.00',
    stockInicial: 5,
  },
  {
    codigo: 'CON-002',
    nombre: 'Paño de microfibra',
    categoria: 'Consumibles',
    precioCosto: '90.00',
    stockInicial: 30,
  },
];

async function seedRolAdmin(rolRepository: Repository<Rol>): Promise<Rol> {
  const existente = await rolRepository.findOne({ where: { nombre: 'admin' } });
  if (existente) {
    console.log('Rol "admin" ya existe, se omite.');
    return existente;
  }
  const rol = await rolRepository.save(
    rolRepository.create({ nombre: 'admin' }),
  );
  console.log('Rol "admin" creado.');
  return rol;
}

async function seedAdminUser(
  usuarioRepository: Repository<Usuario>,
  adminRol: Rol,
): Promise<void> {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  if (!username || !password) {
    console.warn(
      'ADMIN_USERNAME / ADMIN_PASSWORD no están definidos en .env, se omite el usuario admin.',
    );
    return;
  }

  const existente = await usuarioRepository.findOne({ where: { username } });
  if (existente) {
    console.log(`Usuario "${username}" ya existe, se omite.`);
    return;
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  await usuarioRepository.save(
    usuarioRepository.create({
      nombre: username,
      username,
      passwordHash,
      rol: adminRol,
    }),
  );
  console.log(`Usuario admin "${username}" creado.`);
}

async function seedPiezas(piezaRepository: Repository<Pieza>): Promise<void> {
  const existentes = await piezaRepository.find();
  const nombresExistentes = new Set(existentes.map((p) => p.nombre));
  const faltantes = PIEZAS.filter((nombre) => !nombresExistentes.has(nombre));
  if (faltantes.length === 0) {
    console.log('Todas las piezas ya existen, se omite.');
    return;
  }
  await piezaRepository.save(
    faltantes.map((nombre) => piezaRepository.create({ nombre })),
  );
  console.log(`${faltantes.length} pieza(s) creada(s).`);
}

async function seedServicios(
  servicioRepository: Repository<Servicio>,
): Promise<void> {
  const existentes = await servicioRepository.find();
  const nombresExistentes = new Set(existentes.map((s) => s.nombre));
  const faltantes = SERVICIOS.filter((s) => !nombresExistentes.has(s.nombre));
  if (faltantes.length === 0) {
    console.log('Todos los servicios ya existen, se omite.');
    return;
  }
  await servicioRepository.save(
    faltantes.map((s) => servicioRepository.create({ ...s, llevaItbis: true })),
  );
  console.log(`${faltantes.length} servicio(s) creado(s).`);
}

async function seedMateriales(
  categoriaRepository: Repository<CategoriaMaterial>,
  materialRepository: Repository<Material>,
  movimientoInventarioService: MovimientoInventarioService,
  usuarioRepository: Repository<Usuario>,
): Promise<void> {
  const categoriasExistentes = await categoriaRepository.find();
  const categoriasPorNombre = new Map(
    categoriasExistentes.map((c) => [c.nombre, c]),
  );
  const nombresCategorias = [...new Set(MATERIALES.map((m) => m.categoria))];
  for (const nombre of nombresCategorias) {
    if (!categoriasPorNombre.has(nombre)) {
      const categoria = await categoriaRepository.save(
        categoriaRepository.create({ nombre }),
      );
      categoriasPorNombre.set(nombre, categoria);
      console.log(`Categoría "${nombre}" creada.`);
    }
  }

  const admin = process.env.ADMIN_USERNAME
    ? await usuarioRepository.findOne({
        where: { username: process.env.ADMIN_USERNAME },
      })
    : null;

  const materialesExistentes = await materialRepository.find();
  const codigosExistentes = new Set(materialesExistentes.map((m) => m.codigo));
  let creados = 0;
  for (const seed of MATERIALES) {
    if (codigosExistentes.has(seed.codigo)) continue;
    const material = await materialRepository.save(
      materialRepository.create({
        codigo: seed.codigo,
        nombre: seed.nombre,
        categoria: categoriasPorNombre.get(seed.categoria),
        precioCosto: seed.precioCosto,
      }),
    );
    creados++;
    // Initial stock goes through the movement service so the ledger stays consistent.
    if (admin && seed.stockInicial > 0) {
      await movimientoInventarioService.create(
        {
          materialId: material.id,
          tipoMovimiento: 'entrada',
          cantidad: String(seed.stockInicial),
          motivo: 'Inventario inicial (seed)',
        },
        admin.id,
      );
    }
  }
  if (creados === 0) {
    console.log('Todos los materiales ya existen, se omite.');
  } else {
    console.log(`${creados} material(es) creado(s) con inventario inicial.`);
    if (!admin) {
      console.warn(
        'No se encontró el usuario admin: los materiales quedaron con stock 0.',
      );
    }
  }
}

async function bootstrap(): Promise<void> {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn'],
  });

  try {
    const rolRepository = app.get<Repository<Rol>>(getRepositoryToken(Rol));
    const usuarioRepository = app.get<Repository<Usuario>>(
      getRepositoryToken(Usuario),
    );
    const piezaRepository = app.get<Repository<Pieza>>(
      getRepositoryToken(Pieza),
    );
    const servicioRepository = app.get<Repository<Servicio>>(
      getRepositoryToken(Servicio),
    );
    const categoriaRepository = app.get<Repository<CategoriaMaterial>>(
      getRepositoryToken(CategoriaMaterial),
    );
    const materialRepository = app.get<Repository<Material>>(
      getRepositoryToken(Material),
    );
    const movimientoInventarioService = app.get(MovimientoInventarioService);

    const adminRol = await seedRolAdmin(rolRepository);
    await seedAdminUser(usuarioRepository, adminRol);
    await seedPiezas(piezaRepository);
    await seedServicios(servicioRepository);
    await seedMateriales(
      categoriaRepository,
      materialRepository,
      movimientoInventarioService,
      usuarioRepository,
    );
  } finally {
    await app.close();
  }
}

bootstrap()
  .then(() => {
    console.log('Seed completado.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Error al ejecutar el seed:', err);
    process.exit(1);
  });
