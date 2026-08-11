import { Module } from '@nestjs/common';
import { EcfXmlBuilderService } from './ecf-xml-builder.service';
import { RfceXmlBuilderService } from './rfce-xml-builder.service';
import { EcfSignerService } from './ecf-signer.service';

@Module({
  providers: [EcfXmlBuilderService, RfceXmlBuilderService, EcfSignerService],
  exports: [EcfXmlBuilderService, RfceXmlBuilderService, EcfSignerService],
})
export class FacturacionElectronicaModule {}
