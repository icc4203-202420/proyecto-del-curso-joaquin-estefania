module API
  module V1
    class FriendshipsController < ApplicationController
      include Authenticable

      respond_to :json
      before_action :set_user, only: [:create]
      before_action :verify_jwt_token, only: [:create]

      # POST /api/v1/friendships
      def create
        # Buscar al amigo en base al friend_id enviado
        friend = User.find_by(id: friendship_params[:friend_id])

        if friend.nil?
          render json: { error: "Friend not found" }, status: :not_found
          return
        end

        # Buscar el evento por ID o por nombre si se proporciona
        event_id = friendship_params[:event_id]
        if event_id.nil? && friendship_params[:event_name].present?
          event = Event.find_by(name: friendship_params[:event_name])

          # Si no se encuentra el evento por nombre
          if event.nil?
            render json: { error: "Event not found" }, status: :not_found
            return
          end

          # Asignar el ID del evento encontrado
          event_id = event.id
        end

        # Crear la amistad con o sin event_id
        friendship = Friendship.new(user_id: @user.id, friend_id: friend.id, event_id: event_id)

        if friendship.save
          render json: { message: 'Friendship created successfully' }, status: :created
        else
          render json: { error: friendship.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private

      # Método para obtener el usuario actual
      def set_user
        @user = current_user
        if @user.nil?
          render json: { error: "User must be logged in" }, status: :unauthorized
        end
      end

      def friendship_params
        params.require(:friendship).permit(:friend_id, :event_id, :event_name)
      end
    end
  end
end
