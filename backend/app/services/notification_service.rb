# app/services/notification_service.rb
class NotificationService
  def self.send_friendship_notification(user, friend)
    if friend.push_token.present?
      PushNotificationService.send_notification(
        to: friend.push_token,
        title: "Nueva solicitud de amistad",
        body: "#{user.handle} te ha agregado como amigo.",
        data: { targetScreen: '/home' }
      )
    else
      Rails.logger.warn "El usuario #{friend.id} no tiene push_token"
    end
  end

  def self.send_event_notification(user, event, friends)
    Rails.logger.debug "Amigos del usuario #{user.id}: #{friends.map(&:id).join(', ')}"
    friends.each do |friend|
      next unless friend.push_token.present?
  
      PushNotificationService.send_notification(
        to: friend.push_token,
        title: "#{user.first_name} asistirá al evento #{event.name}",
        body: "El evento será en #{event.location} el #{event.date.strftime('%d/%m/%Y')}.",
        data: { targetScreen: '/events', eventId: event.id }
      )
    end
  end

  def self.send_tagged_handles_notification(event_picture)
    tagged_handles = event_picture.tagged_handles
  
    # Verifica si tagged_handles es un array
    unless tagged_handles.is_a?(Array)
      tagged_handles = tagged_handles.to_s.split(',').map(&:strip)
    end
  
    tagged_handles.each do |handle|
      user = User.find_by(handle: handle)
      next unless user&.push_token.present?
  
      PushNotificationService.send_notification(
        to: user.push_token,
        title: "¡Has sido etiquetado en una foto del evento!",
        body: "#{event_picture.user.first_name} te etiquetó en una foto.",
        data: { event_id: event_picture.event.id }
      )
    end
  end
  
end
