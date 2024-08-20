class CreateStamps < ActiveRecord::Migration[7.1]
  def change
    create_table :stamps do |t|
      t.references :loyalty_card, null: false, foreign_key: true
      t.string :item
      t.references :user, null: false, foreign_key: true
      t.datetime :signed_at

      t.timestamps
    end
  end
end
