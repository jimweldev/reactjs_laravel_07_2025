import type { Theme } from '@/05_stores/theme-store';

export type UserSetting = {
  id?: number;
  theme?: Theme;
  font_size?: string;
  timezone?: string;
  date_format?: string;
  time_format?: string;
  created_at?: string;
  updated_at?: string;
};
