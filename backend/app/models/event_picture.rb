class EventPicture < ApplicationRecord
  belongs_to :event
  belongs_to :user
  has_one_attached :image  # ActiveStorage

  # Método para obtener la URL de la imagen subida
  def image_url
    Rails.application.routes.url_helpers.rails_blob_url(image, only_path: true) if image.attached?
  end
end