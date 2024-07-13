# frozen_string_literal: true

Rails.application.routes.draw do
  resources :orders, only: %i[index]

  devise_for :users
  root 'orders#index'

  get '/*path' => 'orders#index'
end
