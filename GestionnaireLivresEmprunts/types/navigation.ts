


export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  Home: undefined;
  ListBooks: { refresh?: boolean } | undefined;
  AddBook: undefined;
  AdminLogsScreen: undefined; 
  UserHistoryScreen: undefined; 
  SearchBicon: undefined;
  BooksTab: undefined;

  
  BookDetails:{
  book: {
    id: string;
    title: string;
    author: string;
    genre: string;
    description: string;
    available: boolean;
  };
 };
 UpdateBook: {  book: {
  id: string;
  title: string;
  author: string;
  genre: string;
  description: string;
  available: boolean;
}; };
 Search: undefined;
 Profile: undefined;
 Main: undefined;
};
export type MainTabParamList = {
  HomeTab: undefined;
  BooksTab: undefined;
  ProfileTab: undefined;
};
export type BooksTabParamList = {
  ListBooks: { refresh?: boolean } | undefined;
  // ... autres écrans de cet onglet
};
