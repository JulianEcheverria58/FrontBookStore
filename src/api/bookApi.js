const API_BASE_URL = "http://localhost:8080";
const AZURE_STORAGE_URL = "https://imagesbooks.blob.core.windows.net/bookimages/";

/**
 * Normaliza los datos del libro para consistencia en el frontend
 */
const normalizeBookData = (book) => {
  return {
    ...book,
    id: book.bookId || book.id,  // Compatibilidad con ambos nombres
    genre: book.category || book.genre,
    year: book.publicationYear || book.year,
    // Procesamiento especial para la URL de la imagen
    imageUrl: book.imageUrl 
      ? book.imageUrl.startsWith('http')
        ? book.imageUrl  // Si ya es URL completa
        : `${AZURE_STORAGE_URL}${book.imageUrl.trim().toLowerCase()}`
      : null
  };
};

/**
 * Manejo centralizado de errores HTTP
 */
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// Obtener todos los libros
export const getBooks = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/books`);
    const data = await handleResponse(response);
    return data.map(normalizeBookData);
  } catch (error) {
    console.error("Error fetching books:", error);
    throw error;
  }
};

// Obtener detalles de un libro específico
export const getBookDetails = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/books/${id}`);
    const data = await handleResponse(response);
    return normalizeBookData(data);
  } catch (error) {
    console.error(`Error fetching book details for ID ${id}:`, error);
    throw error;
  }
};

// Buscar libros por término
export const searchBooks = async (query) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/books/search?q=${encodeURIComponent(query)}`
    );
    const data = await handleResponse(response);
    return data.map(normalizeBookData);
  } catch (error) {
    console.error("Error searching books:", error);
    throw error;
  }
};

// Obtener libros por categoría
export const getBooksByCategory = async (category) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/books/category/${encodeURIComponent(category)}`
    );
    const data = await handleResponse(response);
    return data.map(normalizeBookData);
  } catch (error) {
    console.error(`Error fetching books for category ${category}:`, error);
    throw error;
  }
};

// Subir imagen a Azure Blob Storage (requiere endpoint especial en backend)
export const uploadBookImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${API_BASE_URL}/books/upload-image`, {
      method: 'POST',
      body: formData,
      // Nota: No establezcas Content-Type manualmente para FormData
    });

    const result = await handleResponse(response);
    return `${AZURE_STORAGE_URL}${result.filename}`;
  } catch (error) {
    console.error("Error uploading book image:", error);
    throw error;
  }
};

// Añadir un nuevo libro (para admin)
export const addBook = async (bookData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/books`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookData),
    });
    const data = await handleResponse(response);
    return normalizeBookData(data);
  } catch (error) {
    console.error("Error adding book:", error);
    throw error;
  }
};

// Actualizar un libro (para admin)
export const updateBook = async (id, bookData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/books/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookData),
    });
    const data = await handleResponse(response);
    return normalizeBookData(data);
  } catch (error) {
    console.error(`Error updating book with ID ${id}:`, error);
    throw error;
  }
};

// Eliminar un libro (para admin)
export const deleteBook = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/books/${id}`, {
      method: 'DELETE',
    });
    await handleResponse(response);
    return true;
  } catch (error) {
    console.error(`Error deleting book with ID ${id}:`, error);
    throw error;
  }
};