class API::V1::EventPicturesController < ApplicationController
  before_action :set_event

  # POST /api/v1/events/:event_id/event_pictures
  def create
    # Verificar si los archivos recibidos son un array o un solo archivo
    if event_picture_params[:image].is_a?(Array)
      # Si es un array, manejar múltiples imágenes
      event_picture_params[:image].each do |image|
        @event.event_pictures.create(image: image)
      end
      render json: { message: 'Photos uploaded successfully' }, status: :created
    else
      # Si es una sola imagen, manejar una sola imagen
      @event_picture = @event.event_pictures.build(event_picture_params)

      if @event_picture.save
        render json: { message: 'Photo uploaded successfully', picture: @event_picture }, status: :created
      else
        render json: { error: 'Failed to upload photo' }, status: :unprocessable_entity
      end
    end
  end

  def show
    @event = Event.includes(:event_pictures).find(params[:id])
    render json: @event.as_json(include: { event_pictures: { methods: :image_url } })
  end

  private

  # Método para encontrar el evento según el ID
  def set_event
    @event = Event.find(params[:event_id])
  end

  # Método para permitir solo los parámetros necesarios
  def event_picture_params
    params.require(:event_picture).permit(image: [])  # Permitir múltiples imágenes
  end 
end
