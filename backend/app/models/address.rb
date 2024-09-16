class Address < ApplicationRecord
  belongs_to :country, optional: true
  belongs_to :user, optional: true

  has_many :bars

  accepts_nested_attributes_for :country
end
