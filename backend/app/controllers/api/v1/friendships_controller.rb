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
          send_push_notification(friend)
          render json: { message: 'Friendship created successfully' }, status: :created
        else
          render json: { error: friendship.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private

      def send_push_notification(friend)
        if friend.push_token.present?
          Rails.logger.info "Intentando enviar notificación a #{friend.push_token}"
          PushNotificationService.send_notification(
            to: friend.push_token,
            title: "Nueva solicitud de amistad",
            body: "#{@user.handle} te ha agregado como amigo.",
            data: { targetScreen: '/home' }
          )
        else
          Rails.logger.warn "El usuario #{friend.id} no tiene push_token"
        end
      end      

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
