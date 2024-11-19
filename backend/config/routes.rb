Rails.application.routes.draw do
  # Ruta para obtener el usuario actual
  get 'current_user', to: 'current_user#index'

  # Rutas de Devise con controladores personalizados
  devise_for :users, path: '', path_names: {
    sign_in: 'api/v1/login',
    sign_out: 'api/v1/logout',
    registration: 'api/v1/signup'
  }, controllers: {
    sessions: 'api/v1/sessions',
    registrations: 'api/v1/registrations'
  }

  # Ruta de estado de salud
  get 'up', to: 'rails/health#show', as: :rails_health_check

  # Namespace para la API versión 1
  namespace :api, defaults: { format: :json } do
    namespace :v1 do
      # Rutas para bares y eventos anidados
      resources :bars, only: [:index, :show, :create, :update, :destroy] do
        resources :events, only: [:index]  # Eventos de un bar específico
      end

      # Rutas para eventos
      resources :events do
        post 'attend', on: :member  # Ruta para hacer check-in en un evento
      end

      # Rutas para cervezas
      resources :beers do
        resources :reviews, only: [:index, :create]  # Reviews de cervezas
      end

      # Rutas para usuarios
      resources :users, only: [:index, :show, :create, :update, :destroy] do
        collection do
          post 'push_token', action: :update_push_token  # Actualizar el push token
          post 'notify_friendship'                       # Notificar solicitud de amistad
          post 'notify_event'                            # Notificar evento
          get 'search'                                   # Buscar usuarios por handle
        end

        resources :reviews, only: [:index]  # Reviews asociadas a un usuario
      end

      # Rutas para amistades
      resources :friendships, only: [:create]  # Crear una amistad

      # Rutas para reviews de forma independiente
      resources :reviews
    end
  end
end
