require 'rails_helper'

RSpec.describe Customer, type: :model do
  context '.valid?' do
    context 'presence' do
      it 'nome não pode ficar em branco' do
        customer = build :customer, name: nil

        expect(customer.valid?).to eq false
        expect(customer.errors.full_messages).to include 'Nome não pode ficar em branco'
      end

      it 'data de nascimento não pode ficar em branco' do
        customer = build :customer, birthdate: nil

        expect(customer.valid?).to eq false
        expect(customer.errors.full_messages).to include 'Data de nascimento não pode ficar em branco'
      end

      it 'usuário não pode ficar em branco' do
        customer = build :customer, user: nil

        expect(customer.valid?).to eq false
        expect(customer.errors.full_messages).to include 'User é obrigatório(a)'
      end
    end
  end
end
