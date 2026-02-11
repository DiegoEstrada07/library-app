import React, { createContext, useContext, useMemo, useState } from 'react';

const AUTH_STORAGE_KEY = 'libraryIsLoggedIn';
const USER_STORAGE_KEY = 'libraryCurrentUser';
const BORROWED_STORAGE_KEY = 'libraryBorrowedBooks';
const PURCHASED_STORAGE_KEY = 'libraryPurchasedBooks';
const CATALOG_STORAGE_KEY = 'libraryEbookCatalog';

const borrowedSeed = [
  {
    id: 'bk-1',
    title: 'The Picture of Dorian Gray',
    author: 'Oscar Wilde',
    due: '2026-02-12',
  },
  {
    id: 'bk-2',
    title: 'Frankenstein',
    author: 'Mary Shelley',
    due: '2026-02-20',
  },
  {
    id: 'bk-3',
    title: 'The Time Machine',
    author: 'H. G. Wells',
    due: '2026-02-28',
  },
];

const ebookCatalogSeed = [
  {
    id: 'eb-1',
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    format: 'EPUB',
  },
  {
    id: 'eb-2',
    title: 'Moby-Dick',
    author: 'Herman Melville',
    format: 'PDF',
  },
  {
    id: 'eb-3',
    title: 'Dracula',
    author: 'Bram Stoker',
    format: 'EPUB',
  },
];

const readStoredList = (key, fallback = []) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
};

const readStoredBoolean = (key, fallback = false) => {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return raw === 'true';
  } catch {
    return fallback;
  }
};

const readStoredString = (key, fallback = '') => {
  try {
    const raw = localStorage.getItem(key);
    return raw || fallback;
  } catch {
    return fallback;
  }
};

const AppStateContext = createContext(null);

export const AppStateProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() =>
    readStoredBoolean(AUTH_STORAGE_KEY, false)
  );
  const [currentUser, setCurrentUser] = useState(() =>
    readStoredString(USER_STORAGE_KEY, '')
  );
  const [borrowedBooks, setBorrowedBooks] = useState(() =>
    readStoredList(BORROWED_STORAGE_KEY, borrowedSeed)
  );
  const [purchasedBooks, setPurchasedBooks] = useState(() =>
    readStoredList(PURCHASED_STORAGE_KEY, [])
  );
  const [catalogEbooks, setCatalogEbooks] = useState(() =>
    readStoredList(CATALOG_STORAGE_KEY, ebookCatalogSeed)
  );

  const login = (userName) => {
    setCurrentUser(userName);
    setIsLoggedIn(true);
    localStorage.setItem(AUTH_STORAGE_KEY, 'true');
    localStorage.setItem(USER_STORAGE_KEY, userName);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setCurrentUser('');
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
  };

  const addBorrowedBook = (book) => {
    setBorrowedBooks((previous) => {
      if (previous.some((item) => item.id === book.id)) return previous;
      const next = [...previous, book];
      localStorage.setItem(BORROWED_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const returnBorrowedBook = (bookId) => {
    setBorrowedBooks((previous) => {
      const next = previous.filter((book) => book.id !== bookId);
      localStorage.setItem(BORROWED_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const updateBorrowedDueDate = (bookId, daysToAdd = 7) => {
    setBorrowedBooks((previous) => {
      const next = previous.map((book) => {
        if (book.id !== bookId) return book;
        const baseDate = new Date(book.due);
        if (Number.isNaN(baseDate.getTime())) return book;
        const updatedDate = new Date(baseDate);
        updatedDate.setDate(updatedDate.getDate() + daysToAdd);
        const due = updatedDate.toISOString().slice(0, 10);
        return { ...book, due };
      });
      localStorage.setItem(BORROWED_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const addPurchasedBook = (book) => {
    setPurchasedBooks((previous) => {
      if (previous.some((item) => item.id === book.id)) return previous;
      const next = [...previous, book];
      localStorage.setItem(PURCHASED_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const removePurchasedBook = (bookId) => {
    setPurchasedBooks((previous) => {
      const next = previous.filter((book) => book.id !== bookId);
      localStorage.setItem(PURCHASED_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const removeCatalogEbook = (ebookId) => {
    setCatalogEbooks((previous) => {
      const next = previous.filter((ebook) => ebook.id !== ebookId);
      localStorage.setItem(CATALOG_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const value = useMemo(
    () => ({
      isLoggedIn,
      currentUser,
      borrowedBooks,
      purchasedBooks,
      catalogEbooks,
      login,
      logout,
      addBorrowedBook,
      returnBorrowedBook,
      updateBorrowedDueDate,
      addPurchasedBook,
      removePurchasedBook,
      removeCatalogEbook,
    }),
    [isLoggedIn, currentUser, borrowedBooks, purchasedBooks, catalogEbooks]
  );

  return (
    <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within AppStateProvider');
  }
  return context;
};
