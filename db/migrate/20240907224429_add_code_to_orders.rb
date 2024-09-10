class AddCodeToOrders < ActiveRecord::Migration[7.1]
  def change
    add_column :orders, :code, :string
    add_index :orders, :code, unique: true
  end
end
