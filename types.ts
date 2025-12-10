import { LucideIcon } from 'lucide-react';

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price?: string; // Optional, can be removed from UI
  image: string;
  isRecommended?: boolean;
  category?: 'ikan' | 'ayam_daging' | 'nasi_mie' | 'sayuran' | 'pepes' | 'sambal' | 'minuman';
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