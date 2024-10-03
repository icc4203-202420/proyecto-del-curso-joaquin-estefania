require 'rails_helper'

RSpec.describe "EventPictures", type: :request do
  describe "GET /create" do
    it "returns http success" do
      get "/event_pictures/create"
      expect(response).to have_http_status(:success)
    end
  end

end
