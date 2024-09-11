import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../../context/AuthContext/index.jsx';
import { Container, ProfileAvatar, ProfileName, ProfileEmail, EditButton, InfoMessage, AvatarIcon } from './style';
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
        console.error("Erro ao buscar dados do perfil!", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

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
      { currentUser.id == id && (
        <EditButton
          onClick={() => navigate('/editar/perfil')}
        >
          Editar Perfil
        </EditButton>
      )}
    </Container>
  );
};

export default ProfileDetails;
