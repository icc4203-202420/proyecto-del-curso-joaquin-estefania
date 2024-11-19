class EventPicture < ApplicationRecord
  belongs_to :event
  belongs_to :user

  # Configuración actualizada para evitar el error
  serialize :tagged_handles, coder: YAML

  has_one_attached :image
end
