# app/services/push_notification_service.rb
class PushNotificationService
    require 'net/http'
    require 'uri'
    require 'json'
  
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
  
      puts "Push notification response: #{response.body}"
      response
    end
  end
  