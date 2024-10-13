import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { AuthContext } from '../../../context/AuthContext/index.jsx';
import {
  Container,
  ProfileAvatar,
  ProfileName,
  ProfileEmail,
  EditButton,
  InfoMessage,
  AvatarIcon,
  StyledUserDesactived,
  OrdersInfoContainer,
  OrderInfoBox,
  OrderInfoTitle,
  OrderInfoText,
  ArrivalDateContainer,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  CloseButton,
} from './style';
import AccountCircle from '@mui/icons-material/AccountCircle';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import moment from 'moment';
import theme from '../../theme/index.js';

const ProfileDetails = () => {
  const [profile, setProfile] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const { id } = useParams();
  const [totalOrders, setTotalOrders] = useState(0);
  const [monthlyOrders, setMonthlyOrders] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [photo, setPhoto] = useState(null);

  const handleClose = () => setIsOpen(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`/api/v1/users/${id}`);
        setUser(response.data);
        setProfile(response.data.profile);
        setTotalOrders(response.data.total_orders);
        setMonthlyOrders(response.data.monthly_orders);
        if (response.data.profile.photo_url) {
          setPhoto(response.data.profile.photo_url);
        }
      } catch (error) {
        console.error('Erro ao buscar dados do perfil!', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  const handlePasswordPrompt = async (action) => {
    const { value: password } = await Swal.fire({
      title: `Digite sua senha para ${action}`,
      html: `
      <div style="position: relative;">
        <input type="password" style="width: 72%;" id="password" class="swal2-input" placeholder="Digite sua senha">
        <button id="togglePassword" type="button" style="position: absolute; right: 17%; top: 60%; transform: translateY(-50%); background: none; border: none; cursor: pointer;">
          👁️
        </button>
      </div>
    `,
      inputAttributes: {
        autocapitalize: 'off',
        autocomplete: 'new-password'
      },
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      showLoaderOnConfirm: true,
      preConfirm: () => {
        const password = Swal.getPopup().querySelector('#password').value;
        if (!password) {
          Swal.showValidationMessage('Por favor, insira sua senha');
        }
        return password;
      },
      didOpen: () => {
        const passwordInput = document.getElementById('password');
        const togglePasswordButton = document.getElementById('togglePassword');

        togglePasswordButton.addEventListener('click', () => {
          const type = passwordInput.type === 'password' ? 'text' : 'password';
          passwordInput.type = type;
          togglePasswordButton.textContent = type === 'password' ? '👁️' : '🙈';
        });
      },
      allowOutsideClick: () => !Swal.isLoading(),
    });

    return password;
  };

  const handleDeactivate = async () => {
    const password = await handlePasswordPrompt('desativar');

    if (password) {
      try {
        await axios.put(`/api/v1/users/${id}/deactivate`, { admin_password: password });
        setUser((prevUser) => ({ ...prevUser, status: 'inactive' }));
        Swal.fire('Desativado!', 'O colaborador foi desativado com sucesso.', 'success');
      } catch (error) {
        Swal.fire('Erro', 'Houve um problema. Verifique sua senha.', 'error');
      }
    }
  };

  const handleActive = async () => {
    const password = await handlePasswordPrompt('ativar');

    if (password) {
      try {
        await axios.put(`/api/v1/users/${id}/activate`, { admin_password: password });
        setUser((prevUser) => ({ ...prevUser, status: 'active' }));
        Swal.fire('Ativado!', 'O colaborador foi ativado com sucesso.', 'success');
      } catch (error) {
        Swal.fire('Erro', 'Houve um problema. Verifique sua senha.', 'error');
      }
    }
  };

  const handleDelete = async () => {
    const password = await handlePasswordPrompt('excluir');

    if (password) {
      try {
        await axios.delete(`/api/v1/users/${id}?admin_password=${password}`);
        Swal.fire('Excluído!', 'O colaborador foi excluído com sucesso.', 'success');
        navigate('/colaboradores');
      } catch (error) {
        Swal.fire('Erro', 'Houve um problema. Verifique sua senha.', 'error');
      }
    }
  };

  const handleImageClick = () => {
    setIsOpen(true);
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('user[profile_attributes][photo]', file);

      try {
        await axios.patch(`/api/v1/users/${id}/upload_profile_image`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        window.location.href = `${window.location.pathname}?upload_success=true`;
      } catch (error) {
        console.error("Error uploading image:", error);
        Swal.fire('Erro', 'Erro ao fazer upload da imagem.', 'error');
      }
    }
  };

  const handleDeleteImage = async () => {
    const formData = new FormData();
    formData.append('user[profile_attributes][photo]', '');

    try {
      await axios.patch(`/api/v1/users/${id}/upload_profile_image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      window.location.href = `${window.location.pathname}?upload_success=true`;
    } catch (error) {
      console.error("Error deleting image:", error);
      Swal.fire('Erro', 'Erro ao excluir a imagem.', 'error');
    }
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!user) {
    return <div>Perfil não encontrado.</div>;
  }

  return (
    <Container>
      {profile?.photo_url ? (
        <ProfileAvatar src={profile.photo_url} alt="Avatar" onClick={handleImageClick} />
      ) : (
        <AvatarIcon onClick={handleImageClick}>
          <AccountCircleIcon sx={{ fontSize: 100, color: 'text.secondary' }} />
        </AvatarIcon>
      )}
      <ProfileName>{profile?.full_name || 'Sem nome'}</ProfileName>
      {!profile?.full_name && (
        <InfoMessage>
          Perfis sem nome geralmente não fizeram o primeiro login.
        </InfoMessage>
      )}
      <ProfileEmail>{user.email || 'Email não disponível'}</ProfileEmail>

      {user.status === 'inactive' && (
        <StyledUserDesactived>
          Usuário desativado
        </StyledUserDesactived>
      )}

      {currentUser.id == id && (
        <EditButton variant="primary" onClick={() => navigate('/editar/perfil')}>
          Editar Perfil
        </EditButton>
      )}

      {currentUser.role === 'admin' && user.role === 'collaborator' && (
        <>
          {user.status === 'active' ? (
            <EditButton variant="danger" onClick={handleDeactivate}>
              Desativar Colaborador
            </EditButton>
          ) : (
            <div style={{ display: 'flex' }}>
              <EditButton variant="success" onClick={handleActive}>
                Ativar colaborador
              </EditButton>
              <EditButton variant="danger" onClick={handleDelete}>
                Excluir Colaborador
              </EditButton>
            </div>
          )}
        </>
      )}

      <input
        type="file"
        id="imageUpload"
        style={{ display: 'none' }}
        accept="image/*"
        onChange={handleImageUpload}
      />

      <OrdersInfoContainer>
        <OrderInfoBox>
          <OrderInfoTitle>Pedidos neste ano</OrderInfoTitle>
          <OrderInfoText>{totalOrders}</OrderInfoText>
        </OrderInfoBox>

        <OrderInfoBox>
          <OrderInfoTitle>Pedidos neste mês</OrderInfoTitle>
          <OrderInfoText>{monthlyOrders}</OrderInfoText>
        </OrderInfoBox>
      </OrdersInfoContainer>

      <ArrivalDateContainer>
        <OrderInfoTitle>Data de Chegada</OrderInfoTitle>
        <OrderInfoText>{moment(user.created_at).format('DD/MM/YYYY')}</OrderInfoText>
      </ArrivalDateContainer>

      <Modal open={isOpen} onClose={handleClose}>
        <ModalContent style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        }}>
          <ModalHeader>
            <CloseButton onClick={handleClose}>×</CloseButton>
          </ModalHeader>
          <ModalBody style={{
            position: 'relative',
            padding: 0,
          }}>
            {profile?.photo_url ? (
              <img
                src={profile.photo_url}
                alt="Imagem do Perfil"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            ) : (
              <AccountCircle 
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  color: theme.colors.mutedText,
                }} 
              />
            )}
            <div style={{
              position: 'absolute',
              bottom: '10px',
              left: '10px',
              display: 'flex',
              gap: '10px',
            }}>
            </div>
          </ModalBody>
          <div style={{ display: 'flex', justifyContent: 'flex-end', padding: theme.spacing.small }}>
          {currentUser.id == id && (
            <>
              <EditButton 
                onClick={() => document.getElementById('imageUpload').click()} 
                style={{ backgroundColor: 'transparent', color: '#7052F2' }}
              >
                <EditIcon />
              </EditButton>
              <EditButton 
                onClick={handleDeleteImage} 
                style={{ backgroundColor: 'transparent', color: '#D32F2F' }}
              >
                <DeleteIcon />
              </EditButton>
            </>
          )}
          </div>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default ProfileDetails;
