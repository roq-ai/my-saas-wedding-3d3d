import { VendorInterface } from 'interfaces/vendor';
import { BrideGroomInterface } from 'interfaces/bride-groom';
import { GetQueryInterface } from 'interfaces';

export interface QuoteRequestInterface {
  id?: string;
  vendor_id?: string;
  bride_groom_id?: string;
  status: string;
  created_at?: any;
  updated_at?: any;

  vendor?: VendorInterface;
  bride_groom?: BrideGroomInterface;
  _count?: {};
}

export interface QuoteRequestGetQueryInterface extends GetQueryInterface {
  id?: string;
  vendor_id?: string;
  bride_groom_id?: string;
  status?: string;
}
