import React from 'react';
import { Provider } from 'react-redux';
import { Container, Box, Typography, Paper } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { store } from './features/store.js';
import KarakterTablosu from './components/KarakterTablosu.js';
import Filtreleme from './components/Filtreleme.js';
import './App.css';

// Özel tema oluştur
const theme = createTheme({
  palette: {
    background: {
      default: '#89CFF0', // Bebek mavisi
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#89CFF0',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <Container maxWidth="lg" sx={{ backgroundColor: '#89CFF0', minHeight: '100vh' }}>
          <Box sx={{ my: 4, backgroundColor: '#89CFF0' }}>
            <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 1 }}>
              Massive Bioinformatics Assessment: Frontend
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom align="center" sx={{ mb: 4 }}>
              Rick and Morty Karakter Paneli
            </Typography>
            <Paper elevation={3} sx={{ p: 2, mb: 2, backgroundColor: 'white' }}>
              <Filtreleme />
            </Paper>
            <KarakterTablosu />
          </Box>
        </Container>
      </Provider>
    </ThemeProvider>
  );
}

export default App;
