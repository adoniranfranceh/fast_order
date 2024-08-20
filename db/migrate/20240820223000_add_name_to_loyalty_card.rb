class AddNameToLoyaltyCard < ActiveRecord::Migration[7.1]
  def change
    add_column :loyalty_cards, :name, :string
  end
end
