module EnotasNfe
  class << self
    attr_accessor :api_key, :base_url

    def configure
      yield self
    end
  end
end
