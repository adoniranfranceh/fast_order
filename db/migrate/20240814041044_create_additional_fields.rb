class CreateAdditionalFields < ActiveRecord::Migration[7.1]
  def change
    create_table :additional_fields do |t|
      t.references :item, null: false, foreign_key: true
      t.string :additional
      t.decimal :additional_value

      t.timestamps
    end
  end
end
