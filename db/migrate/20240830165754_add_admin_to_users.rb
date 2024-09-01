class AddAdminToUsers < ActiveRecord::Migration[7.1]
  def change
    add_column :users, :admin_id, :integer
  end
end
