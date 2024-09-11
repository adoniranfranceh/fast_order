module Api
  module V1
    class SessionsController < ApplicationController
      before_action :authenticate_user!

      def current
        if current_user
          render json: { user: current_user.as_json(include: {
                                                      profile: {
                                                        only: %i[full_name],
                                                        methods: [:photo_url]
                                                      }
                                                    }) }
        else
          render json: { error: 'Not logged in' }, status: :unauthorized
        end
      end
    end
  end
end
