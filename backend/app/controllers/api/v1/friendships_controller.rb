# app/controllers/api/v1/friendships_controller.rb
module API
  module V1
    class FriendshipsController < ApplicationController
      include Authenticable

      respond_to :json
      before_action :set_user, only: [:create]
      before_action :verify_jwt_token, only: [:create]

    # POST /api/v1/friendships
      def create
        friend = User.find_by(id: friendship_params[:friend_id])

        if friend.nil?
          render json: { error: "Friend not found" }, status: :not_found
          return
        end

        if friend.push_token.blank?
          Rails.logger.warn "El amigo no tiene un push_token, no se enviará notificación"
          render json: { message: 'Friendship created, pero no se envió notificación.' }, status: :created
          return
        end
        
        event_id = friendship_params[:event_id]
        if event_id.nil? && friendship_params[:event_name].present?
          event = Event.find_by(name: friendship_params[:event_name])
          if event.nil?
            render json: { error: "Event not found" }, status: :not_found
            return
          end
          event_id = event.id
        end
    
        friendship = Friendship.new(user_id: @user.id, friend_id: friend.id, event_id: event_id)
        
        if friendship.save
          # Llama al servicio de notificaciones
          NotificationService.send_friendship_notification(@user, friend)
          
          render json: { message: 'Friendship created successfully' }, status: :created
        else
          render json: { error: friendship.errors.full_messages }, status: :unprocessable_entity
        end
      end    

      private

      def set_user
        @user = current_user
        if @user.nil?
          render json: { error: "User must be logged in" }, status: :unauthorized
        end
      end

      def friendship_params
        params.require(:friendship).permit(:friend_id, :event_id, :event_name, :bar_id)
      end
    end
  end
end
