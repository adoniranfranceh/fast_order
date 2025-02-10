class NfeService
  def self.issue_nfe(order)
    nfe = EnotasNfe::Nfe.new

    nfe.ide.cUF = 35
    nfe.ide.natOp = 'Venda'
    nfe.ide.indPag = '0'
    nfe.ide.tpNF = '1'

    nfe.emit.xNome = 'Nome da Empresa'
    nfe.emit.CNPJ = 'CNPJ da Empresa'
    nfe.emit.enderEmit.xLgr = 'Rua Exemplo'
    nfe.emit.enderEmit.nro = '123'
    nfe.emit.enderEmit.xBairro = 'Bairro Exemplo'
    nfe.emit.enderEmit.cMun = '1234567'
    nfe.emit.enderEmit.cep = '12345678'
    nfe.emit.enderEmit.uf = 'SP'

    order.items.each do |item|
      nfe_item = EnotasNfe::Item.new
      nfe_item.cProd = item.id.to_s
      nfe_item.xProd = item.name
      nfe_item.ncm = item.ncm
      nfe_item.qCom = item.quantity
      nfe_item.vUnCom = item.price
      nfe_item.vProd = item.price * item.quantity

      nfe.itens << nfe_item
    end

    response = nfe.issue
    if response.success?
      Rails.logger.debug "Nota Fiscal emitida com sucesso: #{response.chave_nfe}"
    else
      Rails.logger.debug "Erro ao issue a nota: #{response.mensagem}"
    end
  end
end
