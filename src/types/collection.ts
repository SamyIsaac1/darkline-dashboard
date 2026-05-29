import { Tables } from './supabase';

export type Order = Tables<'orders'>;
export type Client = Tables<'clients'>;
export type Attachment = Tables<'attachments'>;
export type Activity = Tables<'activities'>;
export type OrderTag = Tables<'order_tags'>;
export type Tag = Tables<'tags'>;
export type Stage = Tables<'stages'>;
export type Status = Tables<'statuses'>;
export type Profile = Tables<'profiles'>;

export type OrderTagWithTag = OrderTag & {
  tag: Tag | null;
};

export type OrderWithRelations = Order & {
  client: Client | null;
  status: Status | null;
  stage: Stage | null;
  tags: OrderTagWithTag[];
};

export type OrderDetail = OrderWithRelations & {
  activities: Activity[];
  attachments: Attachment[];
};

export type ClientWithOrders = Client & {
  orders: OrderWithRelations[];
};

export type GalleryImage = Attachment & {
  order: {
    order_number: string;
    client: { name: string | null } | null;
  } | null;
};
