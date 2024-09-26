# app/controllers/api/v1/friendships_controller.rb
module API
  module V1
    class FriendshipsController < ApplicationController
      include Authenticable

      respond_to :json
      before_action :set_user, only: [:create]
      before_action :verify_jwt_token, only: [:create, :update, :destroy]

      # POST /api/v1/friendships
      def create
        # Buscar al amigo en base al friend_id enviado
        friend = User.find_by(id: friendship_params[:friend_id])

        # Validación de que se encontró un usuario para friend_id
        if friend.nil?
          render json: { error: "Friend not found" }, status: :not_found
          return
        end

        # Crear amistad
        friendship = Friendship.new(user_id: @user.id, friend_id: friend.id, bar_id: friendship_params[:bar_id])

        if friendship.save
          render json: { message: 'Friendship created successfully' }, status: :created
        else
          render json: { error: friendship.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private

      # Método para obtener el usuario actual
      def set_user
        @user = current_user  # Esto debe devolver el usuario autenticado
        if @user.nil?
          render json: { error: "User must be logged in" }, status: :unauthorized
        end
      end

      def friendship_params
        params.require(:friendship).permit(:friend_id, :bar_id)
      end
    end
  end
end
