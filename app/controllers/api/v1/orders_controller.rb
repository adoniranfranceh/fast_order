class OrdersController < ApplicationController
  def index
    @orders = Order.all
    @orders_in_hold = Order.doing
    @other_orders = @orders - @orders.doing if params[:filter] == 'all'
    render json: @orders
  end
end
