import React, { useContext, useState, useEffect } from 'react';
import { Button, TextField, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext/index.jsx';
import axios from 'axios';
import Swal from 'sweetalert2';

const ProfilePage = () => {
  const [profile, setProfile] = useState({ full_name: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { currentUser, updateCurrentUser } = useContext(AuthContext);

  useEffect(() => {
    axios.get(`/api/v1/users/${currentUser.id}`)
      .then(response => {
        setProfile(response.data.profile);
      })
      .catch(error => {
        console.error("Erro ao buscar dados do perfil!", error);
      });
  }, [currentUser.id]);

  const handleProfileChange = (e) => {
    setProfile({ ...profile, full_name: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('user[profile_attributes][full_name]', profile.full_name);

    try {
      await axios.put(`/api/v1/users/${currentUser.id}?admin_id=${currentUser.admin_id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      updateCurrentUser(prev => ({
        ...prev,
        profile: { ...profile },
      }));

      Swal.fire({
        icon: 'success',
        title: 'Sucesso!',
        text: 'Perfil atualizado com sucesso!',
        confirmButtonText: 'OK'
      });

      navigate(`/perfil/${currentUser.id}`);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Erro!',
        text: `Erro ao atualizar o perfil. Por favor, tente novamente. ${error}`,
        confirmButtonText: 'OK'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      <h2>Editar Perfil</h2>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: '50%',
          maxWidth: '400px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <TextField
          label="Nome"
          name="full_name"
          value={profile?.full_name}
          onChange={handleProfileChange}
          fullWidth
          sx={{ mb: 2 }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isSubmitting}
          sx={{ width: '100%' }}
        >
          Atualizar
        </Button>
      </Box>
    </Box>
  );
};

export default ProfilePage;
