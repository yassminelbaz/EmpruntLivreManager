
import api from './api';
import { Book } from '../types/book';

export const fetchBooks = async (): Promise<Book[]> => {
  try {
    const response = await api.get('/api/books');
    return response.data;
  } catch (error) {
    console.error('Error fetching books:', error);
    throw error;
  }
};

export const searchBooks = async (query: string): Promise<Book[]> => {
  try {
 
    const response = await api.get(`/api/books/search?q=${query}`);
    return response.data;
  } catch (error) {
    console.error('Error searching books:', error);
    throw error;
  }
};

export const fetchBooksByGenre = async (genre: string): Promise<Book[]> => {
  try {
    const response = await api.get(`/api/books/genre/${genre}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching books by genre:', error);
    throw error;
  }
};

export const fetchBooksByAvailability = async (available: boolean): Promise<Book[]> => {
  try {
    const response = await api.get(`/api/books/availability/${available}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching books by availability:', error);
    throw error;
  }
};

export const fetchBooksWithFilters = async (filters: {
  genre?: string;
  availableOnly?: boolean;
}): Promise<Book[]> => {
  try {
    let url = '/api/books/filter?';
    if (filters.genre) url += `genre=${filters.genre}&`;
    if (filters.availableOnly) url += `available=true`;
    
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching books with filters:', error);
    throw error;
  }
};