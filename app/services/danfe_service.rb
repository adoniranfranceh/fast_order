require 'rqrcode'

class DanfeService
  def initialize(order)
    @order = order
  end

  def generate_danfe
    danfe = BrDanfe::Danfe.new do |d|
      d.nfe
      d.data_emissao = @order.created_at
      d.destinatario = {
        nome: @order.customer,
        endereco: @order.address
      }
      d.produtos = @order.items.map do |item|
        {
          descricao: item.name,
          valor_unitario: item.price,
          quantidade: 1
        }
      end
      d.valor_total = @order.total_price

      qr_code_data = generate_qr_code(@order)
      d.qr_code = qr_code_data
    end

    danfe.render
  end

  def generate_qr_code(order)
    chave_acesso = order.code
    qr_code_url = "https://www.nfe.fazenda.gov.br/portal/disseminarDocumento.aspx?tipo=1&chNFe=#{chave_acesso}"

    qr = RQRCode::QRCode.new(qr_code_url)

    png = qr.as_png(size: 200)
    File.write('path/to/qrcode.png', png.to_s)

    'path/to/qrcode.png'
  end

  def print_danfe
    danfe_content = generate_danfe
    send_to_printer(danfe_content)
  end

  private

  def send_to_printer(content)
    File.open(ENV['COMPLETE_PRINTER_PATH'], 'wb') do |file|
      file.write(content)
    end
  end
end
