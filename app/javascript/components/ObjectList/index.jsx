import React, { useEffect, useState } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
  CircularProgress,
  TablePagination,
  TextField,
  Button,
  InputLabel,
  FormControl
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';

const ObjectList = ({ 
  url,
  onEdit, 
  renderItem, 
  refresh,
  listTitle = 'Lista de Itens',
  columns = [],
  detailName,
  objectName,
  enableDateFilter = false,
  dateLabel = 'Buscar por data'
}) => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${url}?page=${page + 1}&per_page=${rowsPerPage}&search_query=${searchQuery}&date_filter=${dateFilter}`);
        if (!response.ok) {
          throw new Error('Erro ao carregar dados');
        }
        const data = await response.json();
        console.log("API Response:", data);
        setItems(data[objectName] || []);
        setTotalCount(data.total_count || 0);
        setFilteredItems(data[objectName] || []);
      } catch (error) {
        console.error('Erro:', error);
        setError('Não foi possível carregar os dados.');
      } finally {
        setLoading(false);
      }
    };
  
    fetchItems();
  }, [url, refresh, page, rowsPerPage, searchQuery, dateFilter]);

  const handleItemClick = (item) => {
    navigate(`/${detailName}/${item.id}`);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isPaginationVisible = totalCount > rowsPerPage;

  return (
    <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Typography variant="h6" gutterBottom>
        {listTitle}
      </Typography>

      <div style={{display: 'flex'}}>
        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
          <TextField
            id="search"
            type="text"
            placeholder="Digite sua pesquisa..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ mr: 2 }}
          />
        </Box>

        {enableDateFilter && (
          <Box sx={{ mb: 2 }}>
          <FormControl>
          <InputLabel
            htmlFor="date-filter"
            shrink={true}
            sx={{ mb: 1, fontSize: '1.1rem', color: '#3f51b5' }}
          >
            {dateLabel}
          </InputLabel>
            
            <TextField
              id="date-filter"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              sx={{ mr: 2 }}
            />
          </FormControl>
        </Box>
        )}
      </div>

      {loading && !error && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <CircularProgress />
        </Box>
      )}
      {error && <Typography color="error">{error}</Typography>}

      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        {!loading && !error && (
          <>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    {columns.map((column, index) => (
                      <TableCell key={index} align="left" sx={{ fontWeight: 'bold', minWidth: '150px' }}>
                        {column}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredItems.length > 0 ? (
                    filteredItems.map((item) => (
                      <TableRow 
                        key={item.id} 
                        sx={{ cursor: 'pointer', '&:hover': { backgroundColor: '#f5f5f5' } }}
                        hover
                        onClick={() => handleItemClick(item)}
                      >
                        {renderItem(item).map((cell, index) => (
                          <TableCell key={index} align="left">
                            {cell}
                          </TableCell>
                        ))}
                        {onEdit && (
                          <TableCell align="center">
                            <IconButton
                              color="primary"
                              onClick={(e) => {
                                e.stopPropagation();
                                onEdit(item);
                              }}
                            >
                              <EditIcon />
                            </IconButton>
                          </TableCell>
                        )}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={columns.length + (onEdit ? 1 : 0)} align="center">
                        <Typography variant="body2">Nenhum item encontrado.</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </Box>

      {isPaginationVisible && (
        <Box sx={{ mt: 2 }}>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalCount}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{ position: 'sticky', bottom: 0, backgroundColor: '#fff', borderTop: '1px solid #ddd' }}
          />
        </Box>
      )}
    </Box>
  );
};

export default ObjectList;
