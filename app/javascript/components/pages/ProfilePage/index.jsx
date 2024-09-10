import React, { useContext, useState, useEffect } from 'react';
import { Button, TextField, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext/index.jsx';
import axios from 'axios';

const ProfilePage = () => {
  const [profile, setProfile] = useState({ full_name: '' });
  const [photo, setPhoto] = useState(null);
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

  const handlePhotoChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('user[profile_attributes][full_name]', profile.full_name);
    if (photo) {
      formData.append('user[profile_attributes][photo]', photo);
    }    

    try {
      await axios.put(`/api/v1/users/${currentUser.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      updateCurrentUser(prev => ({
        ...prev,
        profile: { ...profile },
      }));

      alert("Perfil atualizado com sucesso!");

      navigate(`/perfil/${currentUser.id}`);
    } catch (error) {
      alert(`Erro ao atualizar o perfil. Por favor, tente novamente. ${error}`);
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
        <input
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
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
