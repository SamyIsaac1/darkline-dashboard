# Supabase migrations

Apply storage setup for order attachments:

```bash
supabase db push
```

Or run the SQL in `migrations/20260529000000_order_attachments_storage.sql` via the Supabase SQL editor.

This creates the `darkline` private bucket and RLS policies for authenticated users.
