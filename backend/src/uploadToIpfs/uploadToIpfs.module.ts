import {Module} from '@nestjs/common';
import {HttpModule} from '@nestjs/axios';
import { UploadToIpfsController } from './uploadToIpfs.controller';
import { IpfsService } from './uploadToIpfs.service';

@Module({
    controllers: [UploadToIpfsController],
    providers: [IpfsService],
    imports: [HttpModule]
})
export class UploadToIpfsModule {}