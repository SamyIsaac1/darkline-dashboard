import { Tables } from './supabase';

export type Order = Tables<'orders'>;
export type Attachment = Tables<'attachments'>;
export type Activity = Tables<'activities'>;
export type OrderTag = Tables<'order_tags'>;
export type Tag = Tables<'tags'>;
export type Stage = Tables<'stages'>;
export type Status = Tables<'statuses'>;
export type Profile = Tables<'profiles'>;