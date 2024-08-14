class AddOrderIdToItems < ActiveRecord::Migration[7.1]
  def change
    add_reference :items, :order, null: false, foreign_key: true
  end
end
