import { Status } from '../enums/status.enum';

export interface Server {
  id: number;
  ipAddress: string;
  name: string;
  network: string;
  status: Status;
}
