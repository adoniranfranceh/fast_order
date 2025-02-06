module Api
  module V1
    class SessionsController < ApplicationController
      before_action :authenticate_user!

      def current
        render json: { user: current_user.as_json(include: {
                                                    profile: {
                                                      only: %i[full_name],
                                                      methods: [:photo_url]
                                                    }
                                                  }) }
      end
    end
  end
end
