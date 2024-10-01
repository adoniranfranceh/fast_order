require 'rails_helper'

RSpec.describe Api::V1::DashboardController, type: :request do
  describe 'GET #index' do
    before do
      @admin = create(:user, role: :admin)
      login_as @admin, scope: :user
    end

    it 'retorna os lucros mensais corretamente' do
      travel_to 1.month.ago do
        create(:order, user: @admin, admin_id: @admin.id, status: :paid,
                       items_count: 1, items_price: 100)
        create(:order, user: @admin, admin_id: @admin.id, status: :paid,
                       items_count: 1, items_price: 100)
        create(:order, user: @admin, admin_id: @admin.id, status: :canceled,
                       items_count: 1, items_price: 100)
      end

      travel_to 2.months.ago do
        create(:order, user: @admin, admin_id: @admin.id, status: :paid,
                       items_count: 1, items_price: 100)
      end

      travel_to 13.months.ago do
        create(:order, user: @admin, admin_id: @admin.id, status: :paid,
                       items_count: 1, items_price: 100)
      end

      get api_v1_dashboard_path

      expect(response).to have_http_status(:success)
      json_response = JSON.parse(response.body)

      expect(json_response['profits']).to be_present

      month_one_ago = I18n.l(1.month.ago, format: '%b %Y')
      month_two_ago = I18n.l(2.months.ago, format: '%b %Y')
      month_thirteen_ago = I18n.l(13.months.ago, format: '%b %Y')

      expect(json_response['profits']).to include(month_one_ago => '200.0', month_two_ago => '100.0')
      expect(json_response['profits']).not_to include(month_thirteen_ago)
    end

    it 'retorna um hash vazio quando não há pedidos pagos' do
      get api_v1_dashboard_path

      expect(response).to have_http_status(:success)
      json_response = JSON.parse(response.body)

      expect(json_response['profits']).to eq({})
    end

    it 'retorna o número de novos clientes por mês corretamente' do
      travel_to 1.month.ago do
        create(:customer, user: @admin)
      end

      travel_to 2.months.ago do
        create(:customer, user: @admin)
      end

      travel_to 13.months.ago do
        create(:customer, user: @admin)
      end

      get api_v1_dashboard_path

      expect(response).to have_http_status(:success)
      json_response = JSON.parse(response.body)

      expect(json_response['new_clients']).to be_present

      month_one_ago = I18n.l(1.month.ago, format: '%b %Y')
      month_two_ago = I18n.l(2.months.ago, format: '%b %Y')
      month_thirteen_ago = I18n.l(13.months.ago, format: '%b %Y')

      expect(json_response['new_clients']).to include(month_one_ago => 1, month_two_ago => 1)
      expect(json_response['new_clients']).not_to include(month_thirteen_ago)
      expect(json_response['new_clients'].values.sum).to eq(2)
    end

    it 'retorna a contagem de pedidos recentes corretamente' do
      travel_to 1.day.ago do
        create(:order, user: @admin, status: :paid)
      end

      travel_to 2.days.ago do
        create(:order, user: @admin, status: :paid)
      end

      get api_v1_dashboard_path

      expect(response).to have_http_status(:success)
      json_response = JSON.parse(response.body)

      expect(json_response['recent_orders']).to be_present
      expect(json_response['recent_orders'].values.sum).to eq(2)
    end

    it 'retorna a contagem de pedidos mensais corretamente' do
      travel_to 1.month.ago do
        create(:order, user: @admin, status: :paid)
      end

      travel_to 2.months.ago do
        create(:order, user: @admin, status: :paid)
      end

      travel_to 13.months.ago do
        create(:order, user: @admin, status: :paid)
      end

      get api_v1_dashboard_path

      expect(response).to have_http_status(:success)
      json_response = JSON.parse(response.body)

      month_one_ago = I18n.l(1.month.ago, format: '%b %Y')
      month_two_ago = I18n.l(2.months.ago, format: '%b %Y')
      month_thirteen_ago = I18n.l(13.months.ago, format: '%b %Y')

      expect(json_response['monthly_orders']).to include(month_one_ago => 1, month_two_ago => 1)
      expect(json_response['monthly_orders']).not_to include(month_thirteen_ago)
      expect(json_response['monthly_orders'].values.sum).to eq(2)
    end

    it 'retorna a contagem de novos colaboradores por mês corretamente' do
      travel_to 1.month.ago do
        create(:user, role: :collaborator, admin: @admin)
      end

      travel_to 2.months.ago do
        create(:user, role: :collaborator, admin: @admin)
      end

      travel_to 13.months.ago do
        create(:user, role: :collaborator, admin: @admin)
      end

      get api_v1_dashboard_path

      expect(response).to have_http_status(:success)
      json_response = JSON.parse(response.body)

      month_one_ago = I18n.l(1.month.ago, format: '%b %Y')
      month_two_ago = I18n.l(2.months.ago, format: '%b %Y')
      month_thirteen_ago = I18n.l(13.months.ago, format: '%b %Y')

      expect(json_response['new_employees']).to include(month_one_ago => 1, month_two_ago => 1)
      expect(json_response['new_employees']).not_to include(month_thirteen_ago)
      expect(json_response['new_employees'].values.sum).to eq(3)
    end

    it 'retorna a contagem de novos cartões de fidelidade por mês corretamente' do
      travel_to Time.current do
        create(:loyalty_card, customer: create(:customer, user: @admin))
      end

      get api_v1_dashboard_path

      expect(response).to have_http_status(:success)
      json_response = JSON.parse(response.body)

      expect(json_response['loyalty_cards']).to be_present
      expect(json_response['loyalty_cards'].values.sum).to eq(1)
    end
  end
end
