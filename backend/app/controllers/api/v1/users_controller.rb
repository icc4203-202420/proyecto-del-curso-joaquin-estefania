class API::V1::UsersController < ApplicationController
  respond_to :json
  before_action :set_user, only: [:show, :update]

  def index
    @users = User.includes(:reviews, :address).all
  end

  def show

  end

  def notify_friendship
    friend = User.find(params[:friend_id])
    NotificationService.send_friendship_notification(current_user, friend)
    render json: { message: 'Notificación de amistad enviada.' }, status: :ok
  end

  def notify_event
    event = Event.find(params[:event_id])
    NotificationService.send_event_notification(current_user, event, current_user.friends)
    render json: { message: 'Notificación del evento enviada.' }, status: :ok
  end

  def search
    if params[:handle].present?
      # Convierte el campo 'handle' y el parámetro de búsqueda a minúsculas para que sea insensible a mayúsculas
      users = User.where('LOWER(handle) LIKE ?', "%#{params[:handle].downcase}%")
      render json: users
    else
      render json: { error: "Handle parameter missing" }, status: :bad_request
    end
  end

  def create
    @user = User.new(user_params)
    if @user.save
      render json: @user.id, status: :ok
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  def update
    #byebug
    if @user.update(user_params)
      render :show, status: :ok, location: api_v1_users_path(@user)
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end
  
  def update_push_token
    if params[:push_token].present?
      current_user.update(push_token: params[:push_token])
      render json: { message: 'Push token actualizado correctamente.' }, status: :ok
    else
      render json: { error: 'Push token no enviado.' }, status: :unprocessable_entity
    end
  end

  private

  def set_user
    @user = User.find(params[:id])
  end

  def user_params
    params.fetch(:user, {}).
        permit(:id, :first_name, :last_name, :email, :age,
            { address_attributes: [:id, :line1, :line2, :city, :country, :country_id,
              country_attributes: [:id, :name]],
              reviews_attributes: [:id, :text, :rating, :beer_id, :_destroy]
            })
  end
end
