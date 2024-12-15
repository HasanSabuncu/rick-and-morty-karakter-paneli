import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Box,
  IconButton,
  Chip
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const KarakterDetay = ({ onClose }) => {
  const selectedCharacter = useSelector(state => state.characters.selectedCharacter);
  const [firstEpisodeInfo, setFirstEpisodeInfo] = useState(null);

  useEffect(() => {
    if (selectedCharacter && selectedCharacter.episode.length > 0) {
      // İlk bölüm bilgisini al
      fetch(selectedCharacter.episode[0])
        .then(response => response.json())
        .then(data => {
          setFirstEpisodeInfo(data);
        });
    }
  }, [selectedCharacter]);

  if (!selectedCharacter) {
    return null;
  }

  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case 'alive':
        return '#4caf50'; // yeşil
      case 'dead':
        return '#f44336'; // kırmızı
      default:
        return '#9e9e9e'; // gri
    }
  };

  // Bölüm adından sezon ve bölüm numarasını ayıklama
  const getEpisodeInfo = (episodeName) => {
    if (!episodeName) return '';
    const match = episodeName.match(/S(\d+)E(\d+)/);
    if (match) {
      return `Sezon ${parseInt(match[1])}, Bölüm ${parseInt(match[2])}`;
    }
    return '';
  };

  return (
    <Card sx={{ display: 'flex', position: 'relative', width: '100%', mb: 3 }}>
      <IconButton 
        onClick={onClose}
        sx={{ 
          position: 'absolute', 
          right: 8, 
          top: 8,
          bgcolor: 'rgba(255, 255, 255, 0.7)',
          '&:hover': {
            bgcolor: 'rgba(255, 255, 255, 0.9)'
          },
          zIndex: 1
        }}
      >
        <CloseIcon />
      </IconButton>
      <CardMedia
        component="img"
        sx={{ width: 300 }}
        image={selectedCharacter.image}
        alt={selectedCharacter.name}
      />
      <CardContent sx={{ flex: '1 0 auto', p: 3 }}>
        <Typography variant="h5" component="div" gutterBottom>
          {selectedCharacter.name}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Box
            sx={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: getStatusColor(selectedCharacter.status),
              display: 'inline-block'
            }}
          />
          Durum: {selectedCharacter.status}
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          Tür: {selectedCharacter.species}
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          Cinsiyet: {selectedCharacter.gender}
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          İlk görüldüğü yer: {firstEpisodeInfo ? (
            <>
              {firstEpisodeInfo.name} ({getEpisodeInfo(firstEpisodeInfo.episode)})
            </>
          ) : 'Yükleniyor...'}
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          Son bilinen yer: {selectedCharacter.location.name}
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          Bölümler: {selectedCharacter.episode.map(ep => ep.split('/').pop()).join(', ')}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default KarakterDetay;
