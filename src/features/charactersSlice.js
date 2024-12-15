/**
 * Rick and Morty karakterleri için Redux slice
 * Bu modül, karakter verilerinin yönetimi, filtreleme ve sayfalama işlemlerini içerir
 * @author [Adınız Soyadınız]
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

/**
 * Belirli bir sayfadaki karakterleri getiren yardımcı fonksiyon
 * @param {string} url - API endpoint URL'i
 * @returns {Promise<Object>} Sayfa sonuçları ve bilgileri
 */
const fetchPage = async (url) => {
  const response = await fetch(url);
  const data = await response.json();
  return {
    results: data.results,
    info: data.info
  };
};

/**
 * Karakterleri getiren async thunk
 * Filtreleme ve sayfalama parametrelerine göre API'den veri çeker
 */
export const fetchCharacters = createAsyncThunk(
  'characters/fetchCharacters',
  async ({ page = 1, filters = {} }, { getState }) => {
    const state = getState();
    const { rowsPerPage } = state.characters;
    
    // API URL'ini oluştur
    let baseUrl = 'https://rickandmortyapi.com/api/character/?';
    let filterParams = [];
    
    // Temel filtreleri ekle
    if (filters.name) filterParams.push(`name=${filters.name}`);
    if (filters.status) filterParams.push(`status=${filters.status}`);
    if (filters.species) filterParams.push(`species=${filters.species}`);
    if (filters.gender) filterParams.push(`gender=${filters.gender}`);
    
    // Konum filtresi
    if (filters.location) {
      const locationUrl = `https://rickandmortyapi.com/api/location/?name=${filters.location}`;
      const locationResponse = await fetch(locationUrl);
      const locationData = await locationResponse.json();
      if (locationData.results && locationData.results.length > 0) {
        const locationId = locationData.results[0].id;
        filterParams.push(`location=${locationId}`);
      }
    }

    // Bölüm filtresi
    if (filters.episode) {
      const episodeUrl = `https://rickandmortyapi.com/api/episode/${filters.episode}`;
      const episodeResponse = await fetch(episodeUrl);
      const episodeData = await episodeResponse.json();
      if (episodeData.characters && episodeData.characters.length > 0) {
        const characterPromises = episodeData.characters.map(charUrl => 
          fetch(charUrl).then(res => res.json())
        );
        const characters = await Promise.all(characterPromises);
        
        const startIndex = (page - 1) * rowsPerPage;
        const endIndex = Math.min(startIndex + rowsPerPage, characters.length);
        const paginatedCharacters = characters.slice(startIndex, endIndex);
        
        return {
          results: paginatedCharacters,
          info: { 
            pages: Math.ceil(characters.length / rowsPerPage),
            count: characters.length
          }
        };
      }
    }

    // URL'yi oluştur
    const url = baseUrl + filterParams.join('&');

    try {
      let allResults = [];
      let totalCount = 0;
      let neededPages = Math.ceil(rowsPerPage / 20); // API'nin sayfa başına 20 karakter sınırı var
      let currentApiPage = page;

      // İlk sayfayı al
      const firstPageData = await fetchPage(`${url}&page=${currentApiPage}`);
      allResults = [...firstPageData.results];
      totalCount = firstPageData.info.count;

      // Eğer daha fazla karakter gerekiyorsa (örn. 50 karakter isteniyorsa)
      while (allResults.length < rowsPerPage && firstPageData.info.next && neededPages > 1) {
        currentApiPage++;
        const nextPageData = await fetchPage(`${url}&page=${currentApiPage}`);
        allResults = [...allResults, ...nextPageData.results];
        neededPages--;
      }

      // İstenen sayfa için sonuçları hesapla
      const startIndex = 0;
      const endIndex = Math.min(rowsPerPage, allResults.length);
      const paginatedResults = allResults.slice(startIndex, endIndex);

      return {
        results: paginatedResults,
        info: {
          pages: Math.ceil(totalCount / rowsPerPage),
          count: totalCount
        }
      };
    } catch (error) {
      console.error('Karakter verisi çekilirken hata oluştu:', error);
      throw error;
    }
  }
);

/**
 * Karakter state'ini yöneten Redux slice
 */
const charactersSlice = createSlice({
  name: 'characters',
  initialState: {
    characters: [], // Karakter listesi
    status: 'idle', // API isteği durumu: 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null, // Hata mesajı
    currentPage: 1, // Mevcut sayfa numarası
    totalPages: 0, // Toplam sayfa sayısı
    selectedCharacter: null, // Seçili karakter detayı
    rowsPerPage: 20, // Sayfa başına gösterilecek karakter sayısı
    filters: { // Filtre seçenekleri
      name: '',
      status: '',
      species: '',
      gender: '',
      location: '',
      episode: ''
    }
  },
  reducers: {
    // Sayfa numarasını güncelle
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    // Seçili karakteri güncelle
    setSelectedCharacter: (state, action) => {
      state.selectedCharacter = action.payload;
    },
    // Filtreleri güncelle
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.currentPage = 1; // Filtre değiştiğinde ilk sayfaya dön
    },
    // Sayfa başına karakter sayısını güncelle
    setRowsPerPage: (state, action) => {
      state.rowsPerPage = action.payload;
      state.currentPage = 1; // Sayfa boyutu değiştiğinde ilk sayfaya dön
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCharacters.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCharacters.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.characters = action.payload.results;
        state.totalPages = action.payload.info.pages;
      })
      .addCase(fetchCharacters.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { setCurrentPage, setSelectedCharacter, setFilters, setRowsPerPage } = charactersSlice.actions;
export default charactersSlice.reducer;
