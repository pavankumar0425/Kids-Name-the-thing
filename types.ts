
export enum Category {
  ANIMALS = 'Animals',
  PEOPLE = 'Famous People',
  FLAGS = 'Flags',
  LOGOS = 'Logos',
  COUNTRIES = 'Countries',
  STATES = 'US States',
  BIRDS = 'Birds',
  MATH = 'Math Wizards',
  COMPREHENSION = 'Reading Adventure',
  SCIENCE = 'Science Explorers',
  SOCIAL = 'Social Studies',
  RAMAYANA = 'Ramayana for Kids',
  MAHABHARATA = 'Mahabharata Tales',
  INDIAN_MYTH = 'Indian Mythology',
  OTHER_MYTH = 'Global Mythology'
}

export interface Question {
  id: string;
  category: Category;
  prompt: string;
  options: string[];
  correctAnswer: string;
  imageDescription: string;
  explanation: string;
  passage?: string; // For comprehension questions
}

export interface QuizState {
  currentCategory: Category | null;
  questions: Question[];
  currentIndex: number;
  score: number;
  isComplete: boolean;
  isLoading: boolean;
  currentImage: string | null;
}
