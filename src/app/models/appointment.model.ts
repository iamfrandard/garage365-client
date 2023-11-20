export interface Bill {
  amount: string;
  file: string;
}

export class Appointment {
  id?: any;
  UserID?: string;
  Workshop?: string;
  Schedule?: string;
  Location?: string;
  Service?: string;
  Status?: string;
  Cars?: string;
  Bill?: Bill;
  Confirm?: boolean;
  Comment?: string;
  PriorityService?: boolean;
  Employee?: string;
}
