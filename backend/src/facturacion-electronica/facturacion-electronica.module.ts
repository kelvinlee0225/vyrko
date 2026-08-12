import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Empresa } from '../empresa/entities/empresa.entity';
import { Factura } from '../factura/entities/factura.entity';
import { EmpresaModule } from '../empresa/empresa.module';
import { SecuenciaNcfModule } from '../secuencia-ncf/secuencia-ncf.module';
import { EcfXmlBuilderService } from './ecf-xml-builder.service';
import { RfceXmlBuilderService } from './rfce-xml-builder.service';
import { EcfSignerService } from './ecf-signer.service';
import { DgiiAuthService } from './dgii-auth.service';
import { EcfSubmissionService } from './ecf-submission.service';
import { DgiiPollingService } from './dgii-polling.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Empresa, Factura]),
    EmpresaModule,
    SecuenciaNcfModule,
  ],
  providers: [
    EcfXmlBuilderService,
    RfceXmlBuilderService,
    EcfSignerService,
    DgiiAuthService,
    EcfSubmissionService,
    DgiiPollingService,
  ],
  exports: [
    EcfXmlBuilderService,
    RfceXmlBuilderService,
    EcfSignerService,
    DgiiAuthService,
    EcfSubmissionService,
  ],
})
export class FacturacionElectronicaModule {}
