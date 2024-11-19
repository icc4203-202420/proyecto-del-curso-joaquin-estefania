class Event < ApplicationRecord
  belongs_to :bar
  has_many :attendances, dependent: :destroy
  has_many :attendees, through: :attendances, source: :user

  has_one_attached :flyer
  has_many :event_pictures, dependent: :destroy

  def location
    bar.name
  end

  def thumbnail
    flyer.variant(resize_to_limit: [200, nil]).processed
  end  
end
