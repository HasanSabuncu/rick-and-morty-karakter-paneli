import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { 
  Box, 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Autocomplete
} from '@mui/material';
import { setFilters } from '../features/charactersSlice';

const Filtreleme = () => {
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [status, setStatus] = useState('');
  const [species, setSpecies] = useState('');
  const [gender, setGender] = useState('');
  const [location, setLocation] = useState('');
  const [episode, setEpisode] = useState('');
  const [locations, setLocations] = useState([]);
  const [episodes, setEpisodes] = useState([]);

  const fetchAllPages = async (baseUrl) => {
    let allResults = [];
    let currentPage = 1;
    let hasNextPage = true;

    while (hasNextPage) {
      const response = await fetch(`${baseUrl}?page=${currentPage}`);
      const data = await response.json();
      allResults = [...allResults, ...data.results];
      
      hasNextPage = data.info.next !== null;
      currentPage++;
    }

    return allResults;
  };

  useEffect(() => {
    // Tüm lokasyonları al
    fetchAllPages('https://rickandmortyapi.com/api/location')
      .then(allLocations => {
        setLocations(allLocations.sort((a, b) => a.name.localeCompare(b.name)));
      });

    // Tüm bölümleri al
    fetchAllPages('https://rickandmortyapi.com/api/episode')
      .then(allEpisodes => {
        setEpisodes(allEpisodes.sort((a, b) => {
          // Bölüm kodlarına göre sırala (S01E01 gibi)
          const aMatch = a.episode.match(/S(\d+)E(\d+)/);
          const bMatch = b.episode.match(/S(\d+)E(\d+)/);
          const aNum = parseInt(aMatch[1]) * 100 + parseInt(aMatch[2]);
          const bNum = parseInt(bMatch[1]) * 100 + parseInt(bMatch[2]);
          return aNum - bNum;
        }));
      });
  }, []);

  const handleFilterChange = () => {
    dispatch(setFilters({
      name,
      status,
      species,
      gender,
      location,
      episode
    }));
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      gap: 1.5, 
      mb: 3, 
      flexWrap: 'nowrap',
      '& > *': { flex: '1 1 0' },
      '& .MuiAutocomplete-root': { minWidth: 'unset' }
    }}>
      <TextField
        label="İsim"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          handleFilterChange();
        }}
        size="small"
      />

      <FormControl size="small">
        <InputLabel>Durum</InputLabel>
        <Select
          value={status}
          label="Durum"
          onChange={(e) => {
            setStatus(e.target.value);
            handleFilterChange();
          }}
        >
          <MenuItem value="">Tümü</MenuItem>
          <MenuItem value="alive">Yaşıyor</MenuItem>
          <MenuItem value="dead">Ölü</MenuItem>
          <MenuItem value="unknown">Bilinmiyor</MenuItem>
        </Select>
      </FormControl>

      <TextField
        label="Tür"
        value={species}
        onChange={(e) => {
          setSpecies(e.target.value);
          handleFilterChange();
        }}
        size="small"
      />

      <FormControl size="small">
        <InputLabel>Cinsiyet</InputLabel>
        <Select
          value={gender}
          label="Cinsiyet"
          onChange={(e) => {
            setGender(e.target.value);
            handleFilterChange();
          }}
        >
          <MenuItem value="">Tümü</MenuItem>
          <MenuItem value="female">Kadın</MenuItem>
          <MenuItem value="male">Erkek</MenuItem>
          <MenuItem value="genderless">Cinsiyetsiz</MenuItem>
          <MenuItem value="unknown">Bilinmiyor</MenuItem>
        </Select>
      </FormControl>

      <Autocomplete
        size="small"
        options={locations}
        getOptionLabel={(option) => option.name}
        renderInput={(params) => <TextField {...params} label="Konum" />}
        onChange={(event, newValue) => {
          setLocation(newValue ? newValue.name : '');
          handleFilterChange();
        }}
        isOptionEqualToValue={(option, value) => option.name === value}
      />

      <Autocomplete
        size="small"
        options={episodes}
        getOptionLabel={(option) => `${option.episode} - ${option.name}`}
        renderInput={(params) => <TextField {...params} label="Bölüm" />}
        onChange={(event, newValue) => {
          setEpisode(newValue ? newValue.id : '');
          handleFilterChange();
        }}
        isOptionEqualToValue={(option, value) => option.id === value}
      />
    </Box>
  );
};

export default Filtreleme;
