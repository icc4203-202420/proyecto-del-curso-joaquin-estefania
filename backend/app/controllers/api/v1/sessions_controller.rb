class API::V1::SessionsController < Devise::SessionsController
  include ::RackSessionsFix
  respond_to :json

  private

  def respond_with(current_user, _opts = {})
    # Enviar el token en los encabezados de respuesta
    auth_token = request.env['warden-jwt_auth.token']

    render json: {
      status: {
        code: 200,
        message: 'Logged in successfully.',
        data: {
          user: UserSerializer.new(current_user).serializable_hash[:data][:attributes],
          token: auth_token  # Enviar el token JWT en la respuesta
        }
      }
    }, status: :ok
  end

  def respond_to_on_destroy
    if current_user
      render json: {
        status: 200,
        message: 'Logged out successfully.'
      }, status: :ok
    else
      render json: {
        status: 401,
        message: "Couldn't find an active session."
      }, status: :unauthorized
    end
  end
end
