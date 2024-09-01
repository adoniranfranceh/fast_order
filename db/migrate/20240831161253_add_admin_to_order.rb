class AddAdminToOrder < ActiveRecord::Migration[7.1]
  def change
    add_column :orders, :admin_id, :integer
  end
end
