class Review < ApplicationRecord
  belongs_to :user
  belongs_to :beer

  after_save :update_beer_rating
  after_destroy :update_beer_rating

  validates :user, presence: true
  validates :beer, presence: true
  validates :text, presence: true
  validates :rating, presence: true
  private

  def update_beer_rating
    beer.update_avg_rating
  end

end
