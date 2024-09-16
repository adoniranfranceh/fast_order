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
  ActiveButton,
  EditButton,
  InfoMessage,
  AvatarIcon,
  StyledUserDesactived
} from './style';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const ProfileDetails = () => {
  const [profile, setProfile] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const { id } = useParams();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`/api/v1/users/${id}`);
        setUser(response.data);
        setProfile(response.data.profile);
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
        <input type="password" id="password" class="swal2-input" placeholder="Digite sua senha">
        <button id="togglePassword" type="button" style="position: absolute; right: 72px; top: 60%; transform: translateY(-50%); background: none; border: none; cursor: pointer;">
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

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!user) {
    return <div>Perfil não encontrado.</div>;
  }

  return (
    <Container>
      {profile?.photo_url ? (
        <ProfileAvatar src={profile.photo_url} alt="Avatar" />
      ) : (
        <AvatarIcon>
          <AccountCircleIcon sx={{ fontSize: 100, color: 'text.secondary' }} />
        </AvatarIcon>
      )}
      <ProfileName>
        {profile?.full_name || 'Sem nome'}
      </ProfileName>
      {!profile?.full_name && (
        <InfoMessage>
          Perfis sem nome geralmente não fizeram o primeiro login.
        </InfoMessage>
      )}
      <ProfileEmail>
        {user.email || 'Email não disponível'}
      </ProfileEmail>

      {user.status === 'inactive' && (
        <StyledUserDesactived style={{color: 'text.secondary'}}>
          Usuário desativado
        </StyledUserDesactived>
      )}

      {currentUser.id === id && (
        <EditButton onClick={() => navigate('/editar/perfil')}>
          Editar Perfil
        </EditButton>
      )}

      {currentUser.role === 'admin' && user.role === 'collaborator' && (
        <>
          {user.status === 'active' ? 
            <EditButton onClick={handleDeactivate}>
              Desativar Colaborador
            </EditButton>
          :
          <div style={{display: 'flex'}}> 
            <ActiveButton onClick={handleActive}>
              Ativar colaborador
            </ActiveButton>

            <EditButton onClick={handleDelete}>
              Excluir Colaborador
            </EditButton>
          </div>
          }
        </>
      )}
    </Container>
  );
};

export default ProfileDetails;
