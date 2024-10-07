import styled from 'styled-components';
import { Modal as MuiModal } from '@mui/material';
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
  transition: box-shadow 0.3s;

  &:hover {
    box-shadow: ${theme.boxShadow};
  }
`;

export const ProfileAvatar = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  cursor: pointer;
`;

export const AvatarIcon = styled.div`
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

export const ProfileName = styled.h2`
  color: ${theme.colors.text};
  font-size: ${theme.fontSizes.medium};
  font-weight: bold;
  margin-top: ${theme.spacing.small};
`;

export const ProfileEmail = styled.p`
  font-size: ${theme.fontSizes.medium};
  color: ${theme.colors.mutedText};
  margin-top: ${theme.spacing.small};
`;

export const InfoMessage = styled.p`
  font-size: ${theme.fontSizes.small};
  color: ${theme.colors.mutedText};
  margin-top: ${theme.spacing.small};
`;

export const StyledUserDesactived = styled.p`
  font-size: ${theme.fontSizes.medium};
  color: ${theme.colors.mutedText};
  margin-top: ${theme.spacing.small};
`;

export const EditButton = styled.button`
  background-color: ${({ variant }) => 
    variant === 'primary' ? theme.colors.primary 
    : variant === 'danger' ? theme.colors.danger 
    : theme.colors.secondary
  };
  color: ${theme.colors.white};
  border: none;
  border-radius: ${theme.borderRadius};
  padding: ${theme.spacing.small} ${theme.spacing.medium};
  font-size: ${theme.fontSizes.medium};
  cursor: pointer;
  margin-top: ${theme.spacing.small};
  transition: background-color 0.3s;

  &:hover {
    background-color: ${({ variant }) => 
      variant === 'primary' ? theme.colors.primaryHover 
      : variant === 'danger' ? theme.colors.dangerHover 
      : theme.colors.secondaryHover
    };
  }
`;

export const OrdersInfoContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: ${theme.spacing.large};
`;

export const OrderInfoBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${theme.colors.background};
  border-radius: ${theme.borderRadius};
  padding: ${theme.spacing.medium};
  box-shadow: ${theme.boxShadow};
`;

export const OrderInfoTitle = styled.h4`
  font-size: ${theme.fontSizes.medium};
  font-weight: bold;
  margin-bottom: ${theme.spacing.small};
`;

export const OrderInfoText = styled.p`
  font-size: ${theme.fontSizes.medium};
  color: ${theme.colors.text};
`;

export const ArrivalDateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: ${theme.spacing.large};
`;

export const Modal = styled(MuiModal)`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ModalContent = styled.div`
  background-color: ${theme.colors.background};
  border-radius: ${theme.borderRadius};
  box-shadow: ${theme.boxShadow};
  width: 90%;
  max-width: 500px;
  position: relative;
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: ${theme.spacing.small};
`;

export const ModalBody = styled.div`
  padding: ${theme.spacing.medium};
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: ${theme.fontSizes.large};
  cursor: pointer;
  color: ${theme.colors.text};
`;

