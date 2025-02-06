import React, { useContext, useState, useEffect } from 'react';
import categoriesData from '../../../data/categories.json';
import { useNavigate } from 'react-router-dom';
import {
  FormContainer,
  StyledInput,
  StyledSelect,
  StyledButton,
  Title,
  FieldContainer,
  Label,
  StyledTextArea,
} from './style';
import createObject from '../../services/createObject';
import updateObject from '../../services/updateObject';
import { AuthContext } from '../../../context/AuthContext';

const ProductForm = ({ onSubmit, productData }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [basePrice, setBasePrice] = useState('');
  const [maxAdditionalQuantity, setMaxAdditionalQuantity] = useState('');
  const [extraAdditionalPrice, setExtraAdditionalPrice] = useState('');
  const [selectedcategory, setSelectedcategory] = useState('');
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext)

  useEffect(() => {
    if (productData) {
      setName(productData.name);
      setDescription(productData.description);
      setBasePrice(productData.base_price);
      setMaxAdditionalQuantity(productData.max_additional_quantity);
      setExtraAdditionalPrice(productData.extra_additional_price);
      setSelectedcategory(productData.category);
    }
  }, [productData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const product = {
      name,
      description,
      base_price: parseFloat(basePrice),
      max_additional_quantity: parseInt(maxAdditionalQuantity, 10),
      extra_additional_price: parseFloat(extraAdditionalPrice),
      category: selectedcategory,
      user_id: currentUser.admin_id,
    };

    try {
      if (productData) {
        await updateObject(`/api/v1/products/${productData.id}`, product);
        navigate(`/produto/${productData.id}`);
        console.log(productData.id)
      } else {
        await createObject('/api/v1/products', product);
        return navigate('/produtos');
      }
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  return (
    <FormContainer>
      <Title>{productData ? 'Editar Produto' : 'Novo Produto'}</Title>
      <form onSubmit={handleSubmit}>
        <FieldContainer>
          <Label>Nome do produto</Label>
          <StyledInput
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </FieldContainer>
        <FieldContainer>
          <Label>Categoria</Label>
          <StyledSelect
            value={selectedcategory}
            onChange={(e) => setSelectedcategory(e.target.value)}
            required
          >
            <option value="">Selecione uma categoria</option>
            {categoriesData.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </StyledSelect>
        </FieldContainer>
        <FieldContainer>
          <Label>Preço</Label>
          <StyledInput
            type="number"
            value={basePrice}
            onChange={(e) => setBasePrice(e.target.value)}
            required
          />
        </FieldContainer>
        <FieldContainer>
          <Label>Quantidade máxima de adicionais grátis</Label>
          <StyledInput
            type="number"
            value={maxAdditionalQuantity}
            onChange={(e) => setMaxAdditionalQuantity(e.target.value)}
          />
        </FieldContainer>
        <FieldContainer>
          <Label>Descrição do produto</Label>
          <StyledTextArea
            type="textarea"
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </FieldContainer>
        <StyledButton type="submit">
          {productData ? 'Salvar Alterações' : 'Adicionar Produto'}
        </StyledButton>
      </form>
    </FormContainer>
  );
};

export default ProductForm;
