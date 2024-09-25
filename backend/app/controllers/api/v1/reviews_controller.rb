class API::V1::ReviewsController < ApplicationController
  before_action :set_beer, only: [:index, :create]
  before_action :authenticate_user!, except: [:index] # El método index debe ser público para que todos puedan ver las evaluaciones

  def index
    # Parámetros de paginación
    page = params[:page] || 1
    limit = params[:limit] || 5

    # Paginamos las evaluaciones e incluimos la relación con el usuario para evitar consultas adicionales
    reviews = @beer.reviews.includes(:user).page(page).per(limit)
    total_pages = reviews.total_pages

    # Serializamos las evaluaciones junto con la información del usuario (handle)
    render json: {
      reviews: reviews.as_json(
        only: [:id, :text, :rating, :beer_id, :created_at, :updated_at],
        include: { user: { only: [:id, :handle] } } # Incluye el handle del usuario
      ),
      totalPages: total_pages
    }, status: :ok
  end



  def create
    @review = @beer.reviews.build(review_params)
    @review.user = current_user

    if @review.save
      render json: @review, status: :created, location: api_v1_review_url(@review)
    else
      render json: @review.errors, status: :unprocessable_entity
    end
  end

  private

  def set_beer
    @beer = Beer.find_by(id: params[:beer_id])
    unless @beer
      render json: { error: 'Beer not found' }, status: :not_found
    end
  end

  def review_params
    params.require(:review).permit(:text, :rating)
  end
end
