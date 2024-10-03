class API::V1::AttendancesController < ApplicationController
  before_action :authenticate_user!
  before_action :set_event, only: [:attend, :list_attendees]

  # POST /events/:id/attend
  def attend
    attendance = Attendance.find_or_initialize_by(user: current_user, event: @event)

    if attendance.checked_in
      render json: { message: 'Ya has confirmado tu asistencia a este evento' }, status: :ok
    else
      attendance.check_in
      if attendance.save
        render json: {
          message: 'Asistencia confirmada',
          user_id: current_user.id,
          first_name: current_user.first_name,
          last_name: current_user.last_name
        }, status: :ok
      else
        render json: { error: 'No se pudo confirmar la asistencia' }, status: :unprocessable_entity
      end
    end
  end

  # GET /events/:id/attendees
  def list_attendees
    friends_ids = current_user.friends.pluck(:id) # Suponiendo que existe una relación de amigos
    attendees = @event.attendances.includes(:user).map do |attendance|
      {
        user_id: attendance.user.id,
        first_name: attendance.user.first_name,
        last_name: attendance.user.last_name,
        is_friend: friends_ids.include?(attendance.user.id)
      }
    end

    sorted_attendees = attendees.sort_by { |attendee| attendee[:is_friend] ? 0 : 1 }
    render json: { attendees: sorted_attendees }, status: :ok
  end

  private

  def set_event
    @event = Event.find(params[:id])
  end
end
