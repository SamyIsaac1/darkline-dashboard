export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          company_name: string
          email: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_name: string
          email: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_name?: string
          email?: string
          created_at?: string
          updated_at?: string
        }
      }
      statuses: {
        Row: {
          id: string
          name: string
          color: string
          position: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          color?: string
          position?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          color?: string
          position?: number
          created_at?: string
        }
      }
      stages: {
        Row: {
          id: string
          name: string
          description: string | null
          color: string
          position: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          color?: string
          position?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          color?: string
          position?: number
          created_at?: string
        }
      }
      tags: {
        Row: {
          id: string
          name: string
          color: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          color?: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          color?: string
          created_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          order_number: string
          customer_name: string
          customer_email: string | null
          customer_phone: string | null
          description: string | null
          status_id: string | null
          stage_id: string | null
          due_date: string | null
          estimated_cost: number | null
          total_cost: number | null
          notes: string | null
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_number: string
          customer_name: string
          customer_email?: string | null
          customer_phone?: string | null
          description?: string | null
          status_id?: string | null
          stage_id?: string | null
          due_date?: string | null
          estimated_cost?: number | null
          total_cost?: number | null
          notes?: string | null
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_number?: string
          customer_name?: string
          customer_email?: string | null
          customer_phone?: string | null
          description?: string | null
          status_id?: string | null
          stage_id?: string | null
          due_date?: string | null
          estimated_cost?: number | null
          total_cost?: number | null
          notes?: string | null
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      order_tags: {
        Row: {
          id: string
          order_id: string
          tag_id: string
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          tag_id: string
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          tag_id?: string
          created_at?: string
        }
      }
      activities: {
        Row: {
          id: string
          order_id: string
          activity_type: string
          description: string
          created_by: string
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          activity_type: string
          description: string
          created_by: string
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          activity_type?: string
          description?: string
          created_by?: string
          created_at?: string
        }
      }
      attachments: {
        Row: {
          id: string
          order_id: string
          file_name: string
          file_path: string
          file_size: number | null
          mime_type: string | null
          uploaded_by: string
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          file_name: string
          file_path: string
          file_size?: number | null
          mime_type?: string | null
          uploaded_by: string
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          file_name?: string
          file_path?: string
          file_size?: number | null
          mime_type?: string | null
          uploaded_by?: string
          created_at?: string
        }
      }
    }
  }
}
