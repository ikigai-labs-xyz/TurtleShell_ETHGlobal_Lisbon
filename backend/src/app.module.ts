import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ApiKeysModule } from './getApiKeys/apiKeys.module';
import { SignatureModule } from './getSignature/signature.module';
import { SourceCodeModule } from './getSourceCode/sourceCode.module';
import { UploadToIpfsModule } from './uploadToIpfs/uploadToIpfs.module';
import { AuditModule } from './getAuditData/audit.module';
import { ScoreModule } from './getScore/score.module';
import { ContractsModule } from './getContractsOf/contracts.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ApiKeysModule,
    SignatureModule,
    SourceCodeModule,
    UploadToIpfsModule,
    AuditModule,
    ScoreModule,
    ContractsModule,
  ],
})
export class AppModule {}
