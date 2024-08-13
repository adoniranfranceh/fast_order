import styled from 'styled-components';

export const StyledNavbar = styled.nav`
  background-color: #4b0082;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

export const NavLogo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

export const NavLinks = styled.div`
  display: flex;
  gap: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    background-color: #4b0082;
    position: absolute;
    top: 94px;
    left: 0;
    right: 0;
    gap: 1rem;
    padding: 1rem;
    display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
    z-index: 1;
  }
`;

export const NavLink = styled.a`
  color: #fff;
  text-decoration: none;
  font-size: 1rem;

  &:hover {
    text-decoration: underline;
  }

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

export const Hamburger = styled.div`
  display: none;
  flex-direction: column;
  gap: 0.3rem;
  cursor: pointer;

  span {
    width: 25px;
    height: 3px;
    background-color: #fff;
    border-radius: 2px;
  }

  @media (max-width: 768px) {
    display: flex;
  }
`;