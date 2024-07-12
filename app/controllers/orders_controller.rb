class OrdersController < ApplicationController
  def index
    @orders = Order.all
    @other_orders = @orders - @orders.doing if params[:filter] == 'all'
  end

  def show
  end

  def new
  end

  def create
  end

  def edit
  end

  def update
  end
end
