class AddLastEditedAtToOrders < ActiveRecord::Migration[7.1]
  def change
    add_column :orders, :last_edited_at, :datetime
  end
end
