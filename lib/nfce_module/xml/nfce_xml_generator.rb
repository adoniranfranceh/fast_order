require 'nokogiri'

module NfceModule
  class NfceGenerator
    def generate_xml(data)
      Nokogiri::XML::Builder.new do |xml|
        xml.NFe do
          xml.infNFe do
            xml.versao '4.00'
            xml.emit do
              xml.CNPJ data[:cnpj]
              xml.xNome data[:nome]
            end
          end
        end
      end
    end
  end
end
