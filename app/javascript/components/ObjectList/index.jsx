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
  TablePagination
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import { SearchWrapper, SearchInput, SearchIconWrapper } from './style';
import SearchIcon from '@mui/icons-material/Search';

const ObjectList = ({ 
  url, 
  onEdit, 
  renderItem, 
  refresh,
  listTitle = 'Lista de Itens',
  columns = [],
  detailName,
  objectName
}) => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${url}?page=${page + 1}&per_page=${rowsPerPage}&search_query=${searchQuery}`);
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
  }, [url, refresh, page, rowsPerPage, searchQuery]);  

  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = items.filter(item => {
      const renderedValues = renderItem(item).map(cell => cell.props.children.toString().toLowerCase());
      return renderedValues.some(value => value.includes(lowercasedQuery));
    });
    setFilteredItems(filtered);
  }, [searchQuery, items, renderItem]);

  const handleItemClick = (item) => {
    navigate(`/${detailName}/${item.id}`);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to the first page when rows per page changes
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        {listTitle}
      </Typography>
      <SearchWrapper>
        <SearchInput
          id="search"
          type="text"
          placeholder="Digite sua pesquisa..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
      </SearchWrapper>
      {loading && <CircularProgress />}
      {error && <Typography color="error">{error}</Typography>}
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
            {filteredItems.map((item) => (
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
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={totalCount}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
};

export default ObjectList;
