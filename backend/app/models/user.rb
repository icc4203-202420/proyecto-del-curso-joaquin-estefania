class User < ApplicationRecord
  include Devise::JWT::RevocationStrategies::JTIMatcher

  devise :database_authenticatable, :registerable,
    :recoverable, :validatable, 
    :jwt_authenticatable, 
    jwt_revocation_strategy: self

  validates :first_name, :last_name, presence: true, length: { minimum: 2 }
  validates :email, email: true
  validates :handle, presence: true, uniqueness: true, length: { minimum: 3 }
  validates :push_token, uniqueness: true, allow_nil: true

  has_many :reviews
  has_many :beers, through: :reviews
  has_one :address

  has_many :attendances
  has_many :events, through: :attendances
  has_many :friendships

  accepts_nested_attributes_for :reviews, allow_destroy: true
  accepts_nested_attributes_for :address, allow_destroy: true

  # Amistades iniciadas por el usuario
  has_many :friendships
  has_many :friends, through: :friendships, source: :friend

  # Amistades donde el usuario es el amigo añadido
  has_many :inverse_friendships, class_name: 'Friendship', foreign_key: 'friend_id'
  has_many :inverse_friends, through: :inverse_friendships, source: :user  

  def generate_jwt
    Warden::JWTAuth::UserEncoder.new.call(self, :user, nil)[0]
  end
  # Método para actualizar el push_token del usuario
  def save_push_token(token)
    update(push_token: token)
  end
end
