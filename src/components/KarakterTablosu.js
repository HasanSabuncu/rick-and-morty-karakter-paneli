import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  TablePagination,
  CircularProgress,
  Alert,
  Box,
  Dialog
} from '@mui/material';
import { fetchCharacters, setSelectedCharacter, setCurrentPage, setRowsPerPage } from '../features/charactersSlice';
import KarakterDetay from './KarakterDetay';

const KarakterTablosu = () => {
  const dispatch = useDispatch();
  const detayRef = useRef(null);
  const { 
    characters, 
    status, 
    error, 
    currentPage, 
    totalPages,
    filters,
    rowsPerPage,
    selectedCharacter
  } = useSelector(state => state.characters);

  useEffect(() => {
    dispatch(fetchCharacters({ page: currentPage, filters }));
  }, [dispatch, currentPage, filters, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    dispatch(setCurrentPage(newPage + 1));
  };

  const handleChangeRowsPerPage = (event) => {
    dispatch(setRowsPerPage(parseInt(event.target.value, 10)));
    dispatch(setCurrentPage(1)); // Sayfa boyutu değişince ilk sayfaya dön
  };

  const handleCharacterClick = (character) => {
    dispatch(setSelectedCharacter(character));
    // Detay bölümüne scroll
    setTimeout(() => {
      detayRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleCloseDialog = () => {
    dispatch(setSelectedCharacter(null));
  };

  if (status === 'loading') {
    return <CircularProgress />;
  }

  if (status === 'failed') {
    return <Alert severity="error">{error}</Alert>;
  }

  if (characters.length === 0) {
    return <Alert severity="info">No characters found with the current filters.</Alert>;
  }

  return (
    <Box>
      <Paper sx={{ width: '100%', overflow: 'hidden', mb: 3 }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table" sx={{ backgroundColor: 'white' }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ backgroundColor: 'white' }}>ID</TableCell>
                <TableCell sx={{ backgroundColor: 'white' }}>İsim</TableCell>
                <TableCell sx={{ backgroundColor: 'white' }}>Durum</TableCell>
                <TableCell sx={{ backgroundColor: 'white' }}>Tür</TableCell>
                <TableCell sx={{ backgroundColor: 'white' }}>Cinsiyet</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {characters.map((character) => (
                <TableRow 
                  key={character.id}
                  onClick={() => handleCharacterClick(character)}
                  sx={{ 
                    cursor: 'pointer',
                    '&:hover': { 
                      backgroundColor: '#f5f5f5' 
                    }
                  }}
                >
                  <TableCell>{character.id}</TableCell>
                  <TableCell>{character.name}</TableCell>
                  <TableCell>{character.status}</TableCell>
                  <TableCell>{character.species}</TableCell>
                  <TableCell>{character.gender}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 20, 50]}
          component="div"
          count={totalPages * rowsPerPage}
          rowsPerPage={rowsPerPage}
          page={currentPage - 1}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Sayfa başına karakter:"
        />
      </Paper>

      <Dialog
        open={selectedCharacter !== null}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        {selectedCharacter && <KarakterDetay character={selectedCharacter} onClose={handleCloseDialog} />}
      </Dialog>
    </Box>
  );
};

export default KarakterTablosu;
