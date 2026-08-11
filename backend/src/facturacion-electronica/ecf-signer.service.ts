import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { readFileSync } from 'fs';
import { createHash } from 'crypto';
import * as forge from 'node-forge';
import { SignedXml } from 'xml-crypto';

const CANONICALIZATION_ALGORITHM =
  'http://www.w3.org/TR/2001/REC-xml-c14n-20010315';
const SIGNATURE_ALGORITHM = 'http://www.w3.org/2001/04/xmldsig-more#rsa-sha256';
const DIGEST_ALGORITHM = 'http://www.w3.org/2001/04/xmlenc#sha256';
const ENVELOPED_SIGNATURE_TRANSFORM =
  'http://www.w3.org/2000/09/xmldsig#enveloped-signature';

/**
 * Signs e-CF/RFCE XML per DGII's spec (e-cf/Firmado de e-CF.pdf): plain
 * XML-DSig, enveloped, SHA-256, C14N (not exclusive), Reference URI="" over
 * the whole document, certificate embedded in KeyInfo/X509Data, Signature
 * appended as the last child of the root element.
 */
@Injectable()
export class EcfSignerService {
  constructor(private readonly config: ConfigService) {}

  sign(xml: string): string {
    const { privateKeyPem, certPem } = this.loadCertificate();

    const signer = new SignedXml({
      privateKey: privateKeyPem,
      publicCert: certPem,
      signatureAlgorithm: SIGNATURE_ALGORITHM,
      canonicalizationAlgorithm: CANONICALIZATION_ALGORITHM,
      getKeyInfoContent: (args) => SignedXml.getKeyInfoContent(args ?? {}),
    });

    signer.addReference({
      xpath: '/*',
      transforms: [ENVELOPED_SIGNATURE_TRANSFORM],
      digestAlgorithm: DIGEST_ALGORITHM,
      uri: '',
      isEmptyUri: true,
    });

    signer.computeSignature(xml);
    return signer.getSignedXml();
  }

  /**
   * RFCE's CodigoSeguridadeCF, per e-cf/Informe Técnico e-CF v1.0.pdf:
   * "corresponde a los primeros seis (6) dígitos del hash generado en el
   * SignatureValue de la firma digital del e-CF" — the first 6 hex chars of
   * SHA-256(SignatureValue text). SHA-256 is the only hash algorithm DGII's
   * e-cf docs specify anywhere (e-cf/Firmado de e-CF.pdf: "es obligatorio
   * usar este tipo de función al firmar el XML de la e-CF"). DGII doesn't
   * independently validate this value server-side (same doc: "Sin
   * validación") — it only needs to be internally consistent between what's
   * submitted and what's printed on the receipt/QR, which computing it once
   * here and storing it (Factura.codigoSeguridad) guarantees. Must be run
   * against the full, already-signed e-CF — not the RFCE itself.
   */
  computeCodigoSeguridad(signedFullEcfXml: string): string {
    const match = signedFullEcfXml.match(
      /<SignatureValue>([^<]+)<\/SignatureValue>/,
    );
    if (!match) {
      throw new BadRequestException(
        'El XML del e-CF no contiene un SignatureValue; debe estar firmado antes de calcular el CodigoSeguridadeCF',
      );
    }
    return createHash('sha256')
      .update(match[1])
      .digest('hex')
      .toUpperCase()
      .slice(0, 6);
  }

  private loadCertificate(): { privateKeyPem: string; certPem: string } {
    const certPath = this.config.get<string>('DGII_CERT_PATH');
    const certPassword = this.config.get<string>('DGII_CERT_PASSWORD');
    if (!certPath || !certPassword) {
      throw new InternalServerErrorException(
        'DGII_CERT_PATH/DGII_CERT_PASSWORD no estan configurados',
      );
    }

    let p12: forge.pkcs12.Pkcs12Pfx;
    try {
      const p12Der = readFileSync(certPath, 'binary');
      const p12Asn1 = forge.asn1.fromDer(p12Der);
      p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, certPassword);
    } catch {
      throw new InternalServerErrorException(
        'No se pudo leer el certificado digital de la DGII: archivo o contrasena invalidos',
      );
    }

    const certBag = p12.getBags({ bagType: forge.pki.oids.certBag })[
      forge.pki.oids.certBag
    ]?.[0];
    const keyBag =
      p12.getBags({ bagType: forge.pki.oids.pkcs8ShroudedKeyBag })[
        forge.pki.oids.pkcs8ShroudedKeyBag
      ]?.[0] ??
      p12.getBags({ bagType: forge.pki.oids.keyBag })[
        forge.pki.oids.keyBag
      ]?.[0];

    if (!certBag?.cert || !keyBag?.key) {
      throw new InternalServerErrorException(
        'El certificado digital de la DGII no contiene un certificado y llave privada validos',
      );
    }

    return {
      privateKeyPem: forge.pki.privateKeyToPem(keyBag.key),
      certPem: forge.pki.certificateToPem(certBag.cert),
    };
  }
}
