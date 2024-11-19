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

    attendance = Attendance.new(user_id: current_user.id, event_id: event.id)
    
    if attendance.save
      render json: { message: 'Attendance recorded successfully.' }, status: :created
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

  def handle_image_attachment
    decoded_image = decode_image(event_params[:image_base64])
    @event.image.attach(io: decoded_image[:io], filename: decoded_image[:filename], content_type: decoded_image[:content_type])
  end
end
