// src/types/search.ts

export interface Content {
  title: string;
  url: string;
  type: 'poster' | 'backdrop';
  logo: string | null;
}

export interface SearchModalProps {
  onClose: () => void;
}
