Rails.application.routes.draw do
  # Ruta para obtener el usuario actual
  get 'current_user', to: 'current_user#index'

  # Rutas para Devise con controladores personalizados
  devise_for :users, path: '', path_names: {
    sign_in: 'api/v1/login',
    sign_out: 'api/v1/logout',
    registration: 'api/v1/signup'
  }, controllers: {
    sessions: 'api/v1/sessions',
    registrations: 'api/v1/registrations'
  }

  # Ruta de estado de salud
  get "up" => "rails/health#show", as: :rails_health_check

  # Namespace para la API versión 1
  namespace :api, defaults: { format: :json } do
    namespace :v1 do
      # Rutas para bares y eventos anidados
      resources :bars do
        resources :events, only: [:index]  # Para obtener eventos de un bar específico
      end

      # Rutas para eventos
      resources :events, only: [:index, :show, :create, :update, :destroy] do
        member do
          post 'attend'  # Ruta para hacer check-in en un evento
        end
      end

      # Rutas para cervezas
      resources :beers do
        resources :reviews, only: [:create, :index]  # Rutas anidadas para las reviews de cervezas
      end

      # Rutas para usuarios, incluyendo búsqueda y reviews
      resources :users do
        resources :reviews, only: [:index]
        collection do
          get 'search'  # Ruta para buscar usuarios
        end
      end

      # Rutas para amistades
      resources :friendships, only: [:create]  # Ruta para crear amistades (POST a /friendships)

      # Rutas para las reviews de forma independiente
      resources :reviews, only: [:index, :show, :create, :update, :destroy]
    end
  end
end
