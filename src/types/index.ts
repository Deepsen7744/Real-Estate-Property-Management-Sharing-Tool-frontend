export type Role = 'admin' | 'residential' | 'commercial';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface Property {
  _id: string;
  title: string;
  type: 'residential' | 'commercial';
  location: string;
  area: string;
  mapsLink?: string;
  rent: number;
  deposit?: number;
  features: string[];
  ownerDetails?: string;
  images: string[];
  createdBy:
    | {
        _id: string;
        name?: string;
        email?: string;
        role?: Role;
      }
    | string;
  createdAt: string;
  updatedAt: string;
}

export interface PropertySummary {
  total: number;
  today: number;
  residential: number;
  commercial: number;
}

export interface PropertyFilters {
  type?: 'residential' | 'commercial' | '';
  area?: string;
  search?: string;
}

