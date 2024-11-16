class PushNotificationService
  def self.send_notification(to:, title:, body:, data: {})
    uri = URI.parse('https://exp.host/--/api/v2/push/send')
    request = Net::HTTP::Post.new(uri)
    request.content_type = 'application/json'
    request.body = JSON.dump({
      to: to,
      title: title,
      body: body,
      data: data
    })

    req_options = { use_ssl: uri.scheme == 'https' }
    response = Net::HTTP.start(uri.hostname, uri.port, req_options) do |http|
      http.request(request)
    end

    Rails.logger.info "Respuesta de la notificación push: #{response.body}"
    response
  rescue StandardError => e
    Rails.logger.error "Error enviando notificación push: #{e.message}"
  end
end
