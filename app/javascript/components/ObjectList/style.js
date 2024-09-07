import styled from 'styled-components';
import SearchIcon from '@mui/icons-material/Search';

export const SearchWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
  position: relative;
  width: 300px;
`;

export const SearchInput = styled.input`
  width: 300px;
  padding: 8px 40px 8px 12px;
  border: 1px solid #ccc;
  border-radius: 20px;
  background-color: #f5f5f5;
  font-size: 16px;
  text-align: center;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #aaa;
  }

  &::placeholder {
    color: #888;
  }
`;

export const SearchIconWrapper = styled(SearchIcon)`
  width: 300px;
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #888;
  pointer-events: none;
  font-size: 20px;
`;
