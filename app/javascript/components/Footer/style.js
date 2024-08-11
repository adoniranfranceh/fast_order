import styled from 'styled-components';

export const StyledFooter = styled.footer`
  background-color: #2e0854;
  padding: 1rem;
  color: #fff;
  text-align: center;
  width: 100%;

  @media (max-width: 768px) {
    padding: 0.75rem;
  }
`;

export const FooterText = styled.p`
  margin: 0;
  font-size: 1rem;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

export const SocialLinks = styled.div`
  margin-top: 0.5rem;
  display: flex;
  justify-content: center;
  gap: 1rem;

  @media (max-width: 768px) {
    gap: 0.5rem;
    flex-wrap: wrap;
  }
`;

export const SocialLink = styled.a`
  color: #fff;
  text-decoration: none;
  font-size: 1.2rem;

  &:hover {
    color: #ff00ff;
  }

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;
