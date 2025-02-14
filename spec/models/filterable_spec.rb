require 'rails_helper'

RSpec.describe Filterable, type: :model do
  describe '.filter_by_attributes' do
    context 'quando o atributo é um texto simples' do
      it 'encontra cliente baseado no nome' do
        user = create :user, role: :admin
        customer = create(:customer, name: 'Clodoaldo', user:)
        create :customer

        params = %w[name id email birthdate]
        result = Customer.filter_by_attributes('Clodoal', params)

        expect(result).to include(customer)
        expect(result.count).to eq 1
      end

      it 'não encontra cliente quando o texto não corresponde a nenhum atributo' do
        create(:customer, name: 'AnotherName')

        params = %w[name email]
        result = Customer.filter_by_attributes('NonExistingName', params)

        expect(result).to be_empty
      end

      it 'encontra cliente baseado em diferentes atributos' do
        user = create :user, role: :admin
        customer1 = create(:customer, name: 'Clodoaldo', email: 'clodoaldo@example.com', user:)
        customer2 = create(:customer, name: 'AnotherName', email: 'clodoaldo@example.com', user:)

        params = %w[name email]
        result = Customer.filter_by_attributes('clodoaldo@example.com', params)

        expect(result).to include(customer1, customer2)
        expect(result.count).to eq 2
      end
    end

    context 'Pedido' do
      it 'encontra pedido baseado no cliente' do
        create :user, role: :admin
        order = create(:order, customer: 'Junior')
        create :order

        params = %i[id code customer status delivery_type total_price table_info address pick_up_time user_id
                    time_started time_stopped]

        result = Order.filter_by_attributes('Junior', params)

        expect(result).to include(order)
        expect(result.count).to eq 1
      end

      it 'não encontra pedido quando o texto não corresponde a nenhum atributo' do
        create(:order, customer: 'AnotherCustomer')

        params = %i[id code customer status delivery_type total_price table_info address pick_up_time user_id
                    time_started time_stopped]

        result = Order.filter_by_attributes('NonExistingCustomer', params)

        expect(result).to be_empty
      end

      it 'loga um aviso quando o atributo não existe no modelo' do
        allow(Rails.logger).to receive(:warn) # Monitora chamadas ao logger

        result = Order.filter_by_attributes('Teste', ['invalid_column'])

        expect(result).to be_empty
        expect(Rails.logger).to have_received(:warn).with('Column invalid_column does not exist in the model Order')
      end
    end

    context 'quando o atributo pertence a uma relação' do
      it 'encontra usuário baseado no nome do perfil' do
        user = create(:user, role: :admin)
        create(:profile, user:, full_name: 'Clodoaldo')
        other_user = create :user
        other_user.create_profile(full_name: 'Jorge')

        result = User.filter_by_attributes('Clodoal', ['profile.full_name', 'email'])

        expect(result).to include(user)
        expect(result.count).to eq 1
      end

      it 'não encontra usuário quando o texto não corresponde ao nome do perfil' do
        user = create(:user, role: :admin)
        create(:profile, user:, full_name: 'Clodoaldo')
        other_user = create :user
        other_user.create_profile(full_name: 'Jorge')

        result = User.filter_by_attributes('NonExistingName', ['profile.full_name', 'email'])

        expect(result).to be_empty
      end

      it 'encontra usuário baseado em um atributo da relação e um atributo direto' do
        user1 = create(:user, email: 'user1@example.com')
        user2 = create(:user, email: 'user2@example.com')
        create(:profile, user: user1, full_name: 'Clodoaldo')
        create(:profile, user: user2, full_name: 'AnotherName')

        result = User.filter_by_attributes('Clodoaldo', ['profile.full_name', 'email'])

        expect(result).to include(user1)
        expect(result).not_to include(user2)
        expect(result.count).to eq 1
      end

      context 'quando a relação é desconhecida' do
        it 'levanta uma exceção com uma mensagem apropriada' do
          expect { User.filter_by_attributes('some_query', ['invalid_relation.some_column']) }
            .to raise_error(RuntimeError, 'Unknown relation: invalid_relation')
        end
      end
    end
  end
end
