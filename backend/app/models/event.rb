class Event < ApplicationRecord
  belongs_to :bar
  has_many :attendances, dependent: :destroy
  has_many :attendees, through: :attendances, source: :user

  has_one_attached :flyer

  def thumbnail
    flyer.variant(resize_to_limit: [200, nil]).processed
  end  
end
