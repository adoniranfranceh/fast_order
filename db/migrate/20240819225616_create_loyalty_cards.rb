class CreateLoyaltyCards < ActiveRecord::Migration[7.1]
  def change
    create_table :loyalty_cards do |t|
      t.references :customer, null: false, foreign_key: true
      t.integer :status, default: 0

      t.timestamps
    end
  end
end
