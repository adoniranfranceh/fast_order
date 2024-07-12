class CreateOrders < ActiveRecord::Migration[7.1]
  def change
    create_table :orders do |t|
      t.references :user, null: false, foreign_key: true
      t.integer :status
      t.integer :delivery_type
      t.string :table_info
      t.time :pick_up_time
      t.text :address
      t.string :customer

      t.timestamps
    end
  end
end
