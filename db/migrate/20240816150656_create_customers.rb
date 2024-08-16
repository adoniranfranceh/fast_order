class CreateCustomers < ActiveRecord::Migration[7.1]
  def change
    create_table :customers do |t|
      t.string :name
      t.string :email
      t.string :phone
      t.date :birthdate
      t.string :description
      t.string :favorite_order
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
