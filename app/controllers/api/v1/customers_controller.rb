# app/controllers/api/v1/customers_controller.rb

class Api::V1::CustomersController < ApplicationController
  before_action :authenticate_user!
  before_action :set_customer, only: [:show, :update]

  def index
    @customers = Customer.where(user_id: current_user.id)
    render json: @customers
  end

  def show
    render json: @customer
  end

  def create
    @customer = Customer.new(customer_params)

    if @customer.save
      render json: @customer, status: :created
    else
      render json: @customer.errors, status: :unprocessable_entity
    end
  end

  def update
    if @customer.update(customer_params)
      render json: @customer
    else
      render json: @customer.errors, status: :unprocessable_entity
    end
  end

  private

  def set_customer
    @customer = Customer.find(params[:id])
  end

  def customer_params
    params.require(:customer).permit(
      :name,
      :email,
      :birthdate,
      :phone,
      :description,
      :favorite_order,
      :user_id
    ).merge(user_id: current_user.id)
  end
end
