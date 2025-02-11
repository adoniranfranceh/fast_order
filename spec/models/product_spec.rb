require 'rails_helper'

RSpec.describe Product, type: :model do
  let(:user) { create(:user) }
  let(:product) { build(:product, user: user) }

  describe 'validações' do
    it 'é válido com nome, preço base e quantidade adicional máxima válidos' do
      product.name = 'Produto A'
      product.base_price = 100.0
      product.max_additional_quantity = 5
      product.extra_additional_price = 10.0

      expect(product).to be_valid
    end

    it 'é inválido sem nome' do
      product.name = nil
      expect(product).to be_invalid
      expect(product.errors[:name]).to include('não pode ficar em branco')
    end

    it 'é inválido sem preço base' do
      product.base_price = nil
      expect(product).to be_invalid
      expect(product.errors[:base_price]).to include('não pode ficar em branco')
    end

    it 'é inválido com preço base negativo' do
      product.base_price = -10.0
      expect(product).to be_invalid
      expect(product.errors[:base_price]).to include('deve ser maior ou igual a 0')
    end

    it 'é inválido com quantidade adicional máxima negativa' do
      product.max_additional_quantity = -1
      expect(product).to be_invalid
      expect(product.errors[:max_additional_quantity]).to include('deve ser maior ou igual a 0')
    end

    it 'é inválido com preço adicional extra negativo' do
      product.extra_additional_price = -5.0
      expect(product).to be_invalid
      expect(product.errors[:extra_additional_price]).to include('deve ser maior ou igual a 0')
    end

    it 'é válido com max_additional_quantity e extra_additional_price como nil' do
      product.max_additional_quantity = nil
      product.extra_additional_price = nil
      expect(product).to be_valid
    end
  end
end
