module Api
  module V1
    class UsersController < ApplicationController

      def index
        @collaborators = User.where(admin_id: current_user.id).order(:email)
        render json: @collaborators.as_json(include: {
                                                       profile: { only: %i[full_name] }
        })
      end
    end
  end
end
