class OrderService
  def initialize(order)
    @order = order
  end

  def show
    @order.as_json(
      only: self.class.base_order_attributes,
      include: self.class.order_includes
    )
  end

  def update_order_status(new_status)
    current_time = Time.zone.now

    if @order.status == 'doing' && new_status != 'doing'
      @order.update(time_stopped: current_time, status: new_status)
    else
      @order.update(status: new_status)
    end
  end

  def any_additional_fields_changed?
    @order.items.any? { |item| item.additional_fields.any? { |additional| field_changed?(additional) } }
  end

  def any_items_changed?
    @order.items.any? do |item|
      item.saved_changes.any?
    end
  end

  def any_order_attributes_changed?
    @order.previous_changes.any?
  end

  def self.format_response(orders, params)
    {
      orders: orders.as_json(
        include: order_includes,
        only: order_only_attributes
      ),
      total_count: total_count(orders, params)
    }
  end

  def self.order_includes
    {
      user: user_attributes,
      items: {
        include: {
          additional_fields: { only: %i[id additional additional_value] }
        },
        only: %i[id name price status]
      }
    }
  end

  def self.order_only_attributes
    %i[id code customer status delivery_type total_price table_info address pick_up_time user_id time_started
       elapsed_time time_stopped]
  end

  def self.base_order_attributes
    %i[id customer status delivery_type code table_info address pick_up_time user_id total_price]
  end

  def self.user_attributes
    {
      only: [:email],
      include: {
        profile: {
          only: [:full_name],
          methods: [:photo_url]
        }
      }
    }
  end

  def self.filter_orders(orders, params)
    orders = apply_filters(orders, params)
    orders.order(id: :desc)
  end

  def self.apply_filters(orders, params)
    orders = filter_by_search_query(orders, params) if params[:search_query].present?
    orders = filter_by_date(orders, params) if params[:date_filter].present?
    orders = filter_by_today(orders) if params[:query] == 'today'
    orders
  end

  def self.filter_by_search_query(orders, params)
    searchable_attributes = %w[customer code status delivery_type total_price table_info address pick_up_time]
    orders.filter_by_attributes(params[:search_query].downcase, searchable_attributes)
  end

  def self.filter_by_date(orders, params)
    date_filter = Date.parse(params[:date_filter])
    orders.where(created_at: date_filter.all_day)
  end

  def self.filter_by_today(orders)
    orders.where('created_at >= ?', 12.hours.ago).order(id: :asc)
  end

  def self.total_count(orders, params)
    params[:query] == 'today' ? orders.count : orders.total_entries
  end

  private

  def field_changed?(additional)
    persisted?(additional) && value_changed?(additional)
  end

  def persisted?(additional)
    additional.persisted?
  end

  def value_changed?(additional)
    additional.previous_changes.any? { |_, values| values[0] != values[1] && values[0].present? }
  end
end
