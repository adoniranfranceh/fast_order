class AddDefaultToPriceInItems < ActiveRecord::Migration[7.1]
  def change
    change_column_default :items, :price, 0.0
  end
end
