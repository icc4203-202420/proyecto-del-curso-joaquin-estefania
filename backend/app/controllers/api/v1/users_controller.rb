class API::V1::UsersController < ApplicationController
  include Authenticable

  respond_to :json
  before_action :set_user, only: [:friendships]
  before_action :verify_jwt_token, only: [:friendships, :create_friendship]

  # GET /api/v1/users/:id/friendships
  def friendships
    @friendships = @user.friendships.includes(:friend)
    render json: @friendships.map { |f| { friend_id: f.friend.id, friend_name: f.friend.name } }, status: :ok
  end

  # POST /api/v1/users/:id/friendships
  def create_friendship
    @friendship = @user.friendships.new(friend_id: params[:friend_id])

    if @friendship.save
      render json: { message: 'Friendship created successfully.' }, status: :created
    else
      render json: @friendship.errors, status: :unprocessable_entity
    end
  end

  private

  def set_user
    @user = User.find_by(id: params[:id])
    render json: { error: 'User not found' }, status: :not_found unless @user
  end
end
