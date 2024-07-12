class Order < ApplicationRecord
  belongs_to :user
  enum status: { doing: 1, delivered: 5, paid: 10, canceled: 15 }
  enum delivery_type: { local: 1, delivery: 5, pickup: 10 }

  def content
    return table_info if local?
    return address if delivery?
    return pick_up_time if pickup?
  end
end
