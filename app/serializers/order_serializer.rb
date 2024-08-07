class OrderSerializer < ActiveModel::Serializer
  attributes :id, :delivery_type, :address, :status, :customer
end
