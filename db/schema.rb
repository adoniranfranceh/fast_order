# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.1].define(version: 2024_09_07_224429) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "additional_fields", force: :cascade do |t|
    t.bigint "item_id", null: false
    t.string "additional"
    t.decimal "additional_value"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["item_id"], name: "index_additional_fields_on_item_id"
  end

  create_table "customers", force: :cascade do |t|
    t.string "name"
    t.string "email"
    t.string "phone"
    t.date "birthdate"
    t.string "description"
    t.string "favorite_order"
    t.bigint "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_customers_on_user_id"
  end

  create_table "items", force: :cascade do |t|
    t.string "name"
    t.bigint "order_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.decimal "price", precision: 10, scale: 2
    t.integer "status", default: 0
    t.index ["order_id"], name: "index_items_on_order_id"
  end

  create_table "loyalty_cards", force: :cascade do |t|
    t.bigint "customer_id", null: false
    t.integer "status", default: 0
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "name"
    t.index ["customer_id"], name: "index_loyalty_cards_on_customer_id"
  end

  create_table "orders", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.integer "status", default: 1
    t.integer "delivery_type"
    t.string "table_info"
    t.time "pick_up_time"
    t.text "address"
    t.string "customer"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.decimal "total_price", precision: 10, scale: 2
    t.integer "admin_id"
    t.datetime "time_started"
    t.datetime "time_stopped"
    t.string "code"
    t.index ["code"], name: "index_orders_on_code", unique: true
    t.index ["user_id"], name: "index_orders_on_user_id"
  end

  create_table "profiles", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "full_name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_profiles_on_user_id"
  end

  create_table "stamps", force: :cascade do |t|
    t.bigint "loyalty_card_id", null: false
    t.string "item"
    t.bigint "user_id", null: false
    t.datetime "signed_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["loyalty_card_id"], name: "index_stamps_on_loyalty_card_id"
    t.index ["user_id"], name: "index_stamps_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "role"
    t.integer "admin_id"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  add_foreign_key "additional_fields", "items"
  add_foreign_key "customers", "users"
  add_foreign_key "items", "orders"
  add_foreign_key "loyalty_cards", "customers"
  add_foreign_key "orders", "users"
  add_foreign_key "profiles", "users"
  add_foreign_key "stamps", "loyalty_cards"
  add_foreign_key "stamps", "users"
end
