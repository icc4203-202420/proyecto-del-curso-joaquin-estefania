class API::V1::EventsController < ApplicationController
  include ImageProcessing
  include Authenticable

  respond_to :json
  before_action :set_event, only: [:show, :update, :destroy]
  before_action :set_bar, only: [:index]  # Obtener bar para eventos de ese bar
  before_action :verify_jwt_token, only: [:create, :update, :destroy, :attend]  # Añadir verify_jwt_token a attend

  # POST /api/v1/events/:id/attend
  def attend
    event = Event.find_by(id: params[:id])
  
    if event.nil?
      render json: { message: 'Event not found.' }, status: :not_found
      return
    end
  
    # Verificar si el usuario ya está registrado en el evento
    if Attendance.exists?(user_id: current_user.id, event_id: event.id)
      render json: { message: 'You are already registered for this event.' }, status: :unprocessable_entity
      return
    end
  
    # Registrar asistencia
    attendance = Attendance.new(user_id: current_user.id, event_id: event.id)
  
    if attendance.save
      # Obtener los amigos del usuario
      friends = User.joins(:friendships)
                    .where(friendships: { user_id: current_user.id })
  
      # Llama al servicio de notificaciones
      NotificationService.send_event_notification(current_user, event, friends)
  
      render json: { message: 'Attendance recorded successfully, and friends notified.' }, status: :created
    else
      render json: { message: 'Error recording attendance.', errors: attendance.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # GET /api/v1/bars/:bar_id/events
  def index
    events = @bar.events.includes(attendances: :user)  # Cargar attendances y usuarios asociados
    if events.any?
      render json: {
        events: events.as_json(include: {
          attendances: {
            include: {
              user: { only: [:id, :first_name, :last_name, :email] }  # Seleccionar solo los atributos que quieres
            }
          }
        })
      }, status: :ok
    else
      render json: { message: 'No events found for this bar.' }, status: :ok
    end
  end

  # GET /api/v1/events/:id
  def show
    if @event.flyer.attached?
      render json: @event.as_json.merge({
        flyer_url: url_for(@event.flyer),
        thumbnail_url: url_for(@event.thumbnail)
      }), status: :ok
    else
      render json: { event: @event.as_json }, status: :ok
    end
  end

  # POST /api/v1/events
  def create
    @event = Event.new(event_params.except(:image_base64))
    handle_image_attachment if event_params[:image_base64]

    if @event.save
      render json: { event: @event, message: 'Event created successfully.' }, status: :ok
    else
      render json: @event.errors, status: :unprocessable_entity
    end
  end

  # PATCH /api/v1/events/:id
  def update
    handle_image_attachment if event_params[:image_base64]

    if @event.update(event_params.except(:image_base64))
      render json: { event: @event, message: 'Event updated successfully.' }, status: :ok
    else
      render json: @event.errors, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/events/:id
  def destroy
    if @event.destroy
      render json: { message: 'Event successfully deleted.' }, status: :no_content
    else
      render json: @event.errors, status: :unprocessable_entity
    end
  end

  # POST /api/v1/events/:id/add_picture
  def add_picture
    event = Event.find_by(id: params[:id])

    unless event
      render json: { error: 'Event not found' }, status: :not_found
      return
    end

    # Convertir tagged_handles a un array, incluso si es una cadena
    tagged_handles = params[:tagged_handles]
    tagged_handles = tagged_handles.is_a?(String) ? tagged_handles.split(',').map(&:strip) : tagged_handles

    # Crear nueva foto para el evento
    event_picture = EventPicture.new(
      event: event,
      user: current_user,
      description: params[:description],
      tagged_handles: tagged_handles
    )

    # Adjuntar la imagen
    if params[:image].present?
      event_picture.image.attach(params[:image])
    end

    if event_picture.save
      # Notificar a los handles etiquetados
      NotificationService.send_tagged_handles_notification(event_picture)

      render json: { message: 'Picture added successfully.' }, status: :created
    else
      render json: { error: event_picture.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # GET /api/v1/events/:id/pictures
  def pictures
    event = Event.find_by(id: params[:id])

    unless event
      render json: { error: 'Event not found' }, status: :not_found
      return
    end

    pictures = event.event_pictures.includes(image_attachment: :blob)

    render json: pictures.map { |picture| picture.as_json.merge(
      image_url: url_for(picture.image),
      user: picture.user.slice(:id, :first_name, :last_name),
      tagged_handles: picture.tagged_handles
    ) }, status: :ok
  end

  private

  def set_event
    @event = Event.find_by(id: params[:id])
    render json: { error: 'Event not found' }, status: :not_found unless @event
  end

  def set_bar
    @bar = Bar.find_by(id: params[:bar_id])
    render json: { error: 'Bar not found' }, status: :not_found unless @bar
  end

  def event_params
    params.require(:event).permit(:name, :description, :date, :location, :image_base64)
  end

end
