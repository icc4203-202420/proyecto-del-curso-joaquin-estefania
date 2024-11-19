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
end
