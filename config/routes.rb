# frozen_string_literal: true

Rails.application.routes.draw do

  devise_for :users
  root 'orders#index'

  namespace :api do
    namespace :v1 do
      resources :orders, only: %i[index]
    end
  end
end
