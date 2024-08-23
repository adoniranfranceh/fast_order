class AdditionalField < ApplicationRecord
  belongs_to :item

  after_update :update_order_total

  private

  def update_order_total
    item.order.sum_total
  end
end
