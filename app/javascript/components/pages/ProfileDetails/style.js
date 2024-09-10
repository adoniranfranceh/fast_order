import styled from 'styled-components';
import theme from '../../theme';

export const Container = styled.div`
  padding: ${theme.spacing.medium};
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${theme.colors.background};
  border-radius: ${theme.borderRadius};
  box-shadow: ${theme.boxShadow};
  max-width: 600px;
  margin: auto;
  margin-top: ${theme.spacing.large};
`;

export const ProfileAvatar = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-bottom: ${theme.spacing.medium};
`;

export const ProfileName = styled.h2`
  color: ${theme.colors.text};
  margin-bottom: ${theme.spacing.small};
`;

export const ProfileEmail = styled.p`
  color: ${theme.colors.mutedText};
  margin-bottom: ${theme.spacing.medium};
`;

export const EditButton = styled.button`
  padding: ${theme.spacing.small} ${theme.spacing.medium};
  border: none;
  border-radius: ${theme.borderRadius};
  background-color: ${theme.colors.primary};
  color: ${theme.colors.white};
  font-size: ${theme.fontSizes.medium};
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${theme.colors.primaryHover};
  }
`;

export const InfoMessage = styled.p`
  color: ${theme.colors.mutedText};
  font-size: ${theme.fontSizes.small};
  margin-top: ${theme.spacing.small};
  text-align: center;
`;

export const AvatarIcon = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: ${theme.colors.background};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${theme.spacing.medium};
`;
