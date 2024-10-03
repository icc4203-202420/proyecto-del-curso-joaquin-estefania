require 'rails_helper'

RSpec.describe "API::V1::Attendances", type: :request do
  describe "GET /attend" do
    it "returns http success" do
      get "/api/v1/attendances/attend"
      expect(response).to have_http_status(:success)
    end
  end

end
