class CreateProducts < ActiveRecord::Migration[7.1]
  def change
    create_table :products do |t|
      t.string :name, null: false
      t.text :description
      t.text :category
      t.decimal :base_price, precision: 10, scale: 2, null: false
      t.integer :max_additional_quantity
      t.decimal :extra_additional_price, precision: 10, scale: 2
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
