class API::V1::ReviewsController < ApplicationController
  before_action :set_beer, only: [:create]
  before_action :authenticate_user!  # Asegúrate de que el usuario esté autenticado

  def index
    @reviews = Review.where(user: current_user)
    render json: { reviews: @reviews }, status: :ok
  end

  def show
    @review = Review.find_by(id: params[:id])
    if @review
      render json: { review: @review }, status: :ok
    else
      render json: { error: "Review not found" }, status: :not_found
    end
  end

  def create
    @review = @beer.reviews.build(review_params)
    @review.user = current_user  # Asociar la review al usuario actual

    if @review.save
      render json: @review, status: :created, location: api_v1_review_url(@review)
    else
      render json: @review.errors, status: :unprocessable_entity
    end
  end

  def update
    @review = Review.find_by(id: params[:id])
    if @review.update(review_params)
      render json: @review, status: :ok
    else
      render json: @review.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @review = Review.find_by(id: params[:id])
    if @review
      @review.destroy
      head :no_content
    else
      render json: { error: "Review not found" }, status: :not_found
    end
  end

  private

  def set_beer
    @beer = Beer.find(params[:beer_id])  # Encontrar la cerveza a la que se está añadiendo la review
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Beer not found' }, status: :not_found
  end

  def review_params
    params.require(:review).permit(:text, :rating)
  end
end
