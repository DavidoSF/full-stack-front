import { Address } from '../../shop-page/models/address.model';

export interface UserProfile {
  id?: string;
  username: string;
  email?: string;
  fullName?: string;
  defaultAddress?: Address;
  addresses?: Address[];
  preferences?: {
    newsletter: boolean;
    defaultMinRating?: number;
  };
}
