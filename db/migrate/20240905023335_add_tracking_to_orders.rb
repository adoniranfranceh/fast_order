class AddTrackingToOrders < ActiveRecord::Migration[7.1]
  def change
    add_column :orders, :time_started, :datetime
    add_column :orders, :time_stopped, :datetime
  end
end
