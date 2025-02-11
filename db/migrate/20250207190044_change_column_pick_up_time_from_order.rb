class ChangeColumnPickUpTimeFromOrder < ActiveRecord::Migration[7.1]
  def up
    change_column :orders, :pick_up_time, :datetime, using: "CURRENT_DATE + pick_up_time"
  end

  def down
    change_column :orders, :pick_up_time, :time, using: "pick_up_time::time"
  end
end
