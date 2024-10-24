# config/routes.rb
Rails.application.routes.draw do
  mount ActionCable.server => '/cable'
  devise_for :users
  root 'orders#index'

  namespace :api do
    namespace :v1 do
      get 'dashboard', to: 'dashboard#index'
      get 'sessions/current', to: 'sessions#current'

      resources :orders, only: %i[index show create update] do
        get 'print_invoice', on: :member
      end

      resources :customers, only: %i[index create show destroy] do
        resource :loyalty_card, only: %i[create show update]
      end

      resources :users, only: %i[index create update show destroy] do
        member do
          put :deactivate
          put :activate
          patch 'upload_profile_image', to: 'users#upload_profile_image'
        end
        collection do
          post 'validate_admin_password'
        end
      end

      resources :loyalty_cards, only: %i[destroy update] do
        member do
          patch 'remove'
        end
        resources :stamps, only: %i[create update]
      end

      resources :products, only: %i[index create update show destroy]
    end
  end

  get '*path', to: 'orders#index', constraints: ->(request) do
    !request.xhr? && request.format.html?
  end
end
