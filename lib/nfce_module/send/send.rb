require 'savon'

module NfceModule
  class Send
    def send_xml(xml)
      client = Savon.cliente(wsdl: 'URL')
      response = client.call(:send_nfe, message: { xml: })
      response.body
    end
  end
end
