import { QuoteRequestInterface } from 'interfaces/quote-request';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface BrideGroomInterface {
  id?: string;
  user_id?: string;
  created_at?: any;
  updated_at?: any;
  quote_request?: QuoteRequestInterface[];
  user?: UserInterface;
  _count?: {
    quote_request?: number;
  };
}

export interface BrideGroomGetQueryInterface extends GetQueryInterface {
  id?: string;
  user_id?: string;
}
