# frozen_string_literal: true

Rails.application.routes.draw do
  mount ActionCable.server => '/cable'
  devise_for :users
  root 'orders#index'

  namespace :api do
    namespace :v1 do
      get 'sessions/current', to: 'sessions#current'
      resources :orders, only: %i[index show create update]
      resources :customers, only: %i[index create update show] do
        resource :loyalty_card, only: [:create, :show, :update]
      end
      resources :users, only: %i[index create update]

      resources :loyalty_cards, only: [] do
        member do
          patch 'remove'
        end
        resources :stamps, only: [:create]
      end
    end
  end
  get '*path', to: 'orders#index', constraints: ->(request) do
    !request.xhr? && request.format.html?
  end
end
