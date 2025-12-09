import { LucideIcon } from 'lucide-react';

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price?: string;
  image: string;
  isRecommended?: boolean;
  category?: 'ikan' | 'ayam_daging' | 'sayur' | 'minuman' | 'paket';
}

export interface Facility {
  id: number;
  title: string;
  icon: LucideIcon;
  description: string;
}

export interface HistoryEvent {
  year: string;
  title: string;
  description: string;
}