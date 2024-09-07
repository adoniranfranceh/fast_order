require 'rails_helper'

RSpec.describe Filterable, type: :model do
  describe '.filter_by_attributes' do
    context 'quando o atributo é um texto simples' do
      it 'encontra cliente baseado no nome' do
        user = create :user, role: :admin
        customer = create(:customer, name: 'Clodoaldo', user:)

        result = Customer.filter_by_attributes('Clodoal', %w[name id email birthdate])

        expect(result).to include(customer)
      end
    end

    context 'quando o atributo pertence a uma relação' do
      it 'encontra usuário baseado no nome do perfil' do
        user = create(:user, role: :admin)
        create(:profile, user:, full_name: 'Clodoaldo')

        result = User.filter_by_attributes('Clodoal', ['profile.full_name'])

        expect(result).to include(user)
      end
    end

    context 'quando o atributo é uma data' do
      it 'encontra cliente baseado na data de nascimento' do
        user = create :user, role: :admin
        customer = create(:customer, birthdate: '2024-08-20', user:)
        result = Customer.filter_by_attributes('20 de agosto de 2024', %w[name id email birthdate])

        expect(result).to include(customer)
      end

      it 'não encontra cliente para uma data fora do intervalo' do
        user = create :user, role: :admin
        create(:customer, birthdate: '2024-08-20', user:)
        result = Customer.filter_by_attributes('19 de agosto de 2024', %w[name id email birthdate])

        expect(result).to be_empty
      end
    end
  end
end
