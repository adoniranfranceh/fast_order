module CreateOrder
  def self.call(admin:, start_date:, end_date:, daily_orders_range:)
    orders = []
    items = []
    additionals = []
    products = Product.all
    additional_category = "Adicional"

    (start_date..end_date).each do |date|
      daily_orders_range.to_a.sample.times do
        order = {
          user_id: admin.collaborators.sample.id,
          admin_id: admin.id,
          status: %w[doing delivered paid canceled].sample,
          delivery_type: %w[local pickup delivery].sample,
          table_info: "A#{rand(1..15)}",
          pick_up_time: Faker::Time.forward(days: 23, period: :afternoon).to_s,
          address: Faker::Address.full_address,
          customer: Faker::Name.name,
          code: "#{SecureRandom.alphanumeric(6).upcase}-#{Time.now.to_i}",
          created_at: date,
          updated_at: date
        }

        orders << order

        order_items = create_order_items(order, products, additional_category)
        items.concat(order_items[:items])
        additionals.concat(order_items[:additionals])
      end
    end

    insert_orders_and_associate_items(orders, items, additionals)
    recalculate_order_totals
  end

  private

  def self.create_order_items(order, products, additional_category)
    items = []
    additionals = []

    rand(1..5).times do
      product = products.sample
      item = {
        order_id: order[:id],
        name: product.name,
        price: product.base_price,
        status: %w[completed pending].sample,
        created_at: Time.current,
        updated_at: Time.current
      }

      items << item

      item_additionals = create_additionals(item, products, additional_category)
      additionals.concat(item_additionals)
    end

    { items: items, additionals: additionals }
  end

  def self.create_additionals(item, products, additional_category)
    additionals = []

    rand(0..3).times do
      additional_product = products.where(category: additional_category).sample
      next unless additional_product

      additional = {
        item_id: item[:id],
        additional_value: additional_product.base_price,
        additional: additional_product.name,
        created_at: Time.current,
        updated_at: Time.current
      }

      additionals << additional
    end

    additionals
  end

  def self.insert_orders_and_associate_items(orders, items, additionals)
    inserted_orders = Order.insert_all(orders, returning: %w[id])
    order_ids = inserted_orders.map { |order| order["id"] }

    items.each_with_index { |item, index| item[:order_id] = order_ids[index % order_ids.size] }
    inserted_items = Item.insert_all(items, returning: %w[id])
    item_ids = inserted_items.map { |item| item["id"] }

    additionals.each_with_index { |additional, index| additional[:item_id] = item_ids[index % item_ids.size] }
    AdditionalField.insert_all(additionals) if additionals.any?
  end

  def self.recalculate_order_totals
    Order.find_each do |order|
      order.sum_total
    end
  end
end
