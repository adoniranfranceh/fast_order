module CreateOrder
  def self.create(admin:, start_date:, end_date:, daily_orders_range:)
    products = Product.all
    additional_category = "Adicional"

    orders = []
    items = []
    additionals = []

    (start_date..end_date).each do |day|
      orders_count = rand(daily_orders_range)

      orders_count.times do
        order = build_order(admin, day)
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

  def self.build_order(admin, day)
    {
      user_id: admin.collaborators.sample.id,
      admin_id: admin.id,
      status: random_status,
      delivery_type: random_delivery_type,
      table_info: "A#{rand(1..15)}",
      pick_up_time: Faker::Time.forward(days: 23, period: :afternoon).to_s,
      address: Faker::Address.full_address,
      customer: Faker::Name.name,
      created_at: generate_random_time(day),
      updated_at: Time.current
    }
  end

  def self.create_order_items(order, products, additional_category)
    items = []
    additionals = []

    rand(1..5).times do
      product = products.sample
      item = build_item(order, product)
      items << item

      item_additionals = create_additionals(item, products, additional_category)
      additionals.concat(item_additionals)
    end

    { items: items, additionals: additionals }
  end

  def self.build_item(order, product)
    {
      order_id: order[:id],
      name: product.name,
      price: product.base_price,
      status: random_item_status,
      created_at: Time.current,
      updated_at: Time.current
    }
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

  def self.generate_random_time(day)
    day.to_time + rand(0..23).hours + rand(0..59).minutes
  end

  def self.random_status
    %i[doing delivered paid canceled].sample
  end

  def self.random_delivery_type
    %i[local pickup delivery].sample
  end

  def self.random_item_status
    %i[completed pending].sample
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
