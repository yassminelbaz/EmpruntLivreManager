// src/types/book.ts
export type Book = {
  id: string;
  title: string;
  author: string;
  genre: string;
  description: string;
  available: boolean;
};

export type BookFilters = {
  genre?: string;
  availableOnly: boolean;
};