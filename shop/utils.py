import crcmod
import qrcode  # Mantemos a importação caso queira usar o QR Code depois
import os

class Payload():
    def __init__(self, nome, chavepix, valor, cidade, txtId, diretorio=''):
        self.nome = nome
        self.chavepix = chavepix
        self.valor = valor.replace(',', '.')
        self.cidade = cidade
        self.txtId = txtId
        self.diretorioQrCode = diretorio

        # Cálculos dos tamanhos
        self.nome_tam = len(self.nome)
        self.chavepix_tam = len(self.chavepix)
        self.valor_tam = len(self.valor)
        self.cidade_tam = len(self.cidade)
        self.txtId_tam = len(self.txtId)

        self.merchantAccount_tam = f'0014BR.GOV.BCB.PIX01{self.chavepix_tam:02}{self.chavepix}'
        self.transactionAmount_tam = f'{self.valor_tam:02}{float(self.valor):.2f}'
        self.addDataField_tam = f'05{self.txtId_tam:02}{self.txtId}'
        self.nome_tam = f'{self.nome_tam:02}'
        self.cidade_tam = f'{self.cidade_tam:02}'

        # Partes do payload
        self.payloadFormat = '000201'
        self.merchantAccount = f'26{len(self.merchantAccount_tam):02}{self.merchantAccount_tam}'
        self.merchantCategCode = '52040000'
        self.transactionCurrency = '5303986'
        self.transactionAmount = f'54{self.transactionAmount_tam}'
        self.countryCode = '5802BR'
        self.merchantName = f'59{self.nome_tam:02}{self.nome}'
        self.merchantCity = f'60{self.cidade_tam:02}{self.cidade}'
        self.addDataField = f'62{len(self.addDataField_tam):02}{self.addDataField_tam}'
        self.crc16 = '6304'

    def gerarPayload(self, gerar_qrcode=False):
        """Gera o payload PIX e opcionalmente o QR Code"""
        self.payload = f'{self.payloadFormat}{self.merchantAccount}{self.merchantCategCode}{self.transactionCurrency}{self.transactionAmount}{self.countryCode}{self.merchantName}{self.merchantCity}{self.addDataField}{self.crc16}'
        
        # Calcula CRC16
        self.gerarCrc16(self.payload)
        
        if gerar_qrcode:
            self.gerarQrCode(self.payload_completa, self.diretorioQrCode)
        
        return self.payload_completa

    def gerarCrc16(self, payload):
        crc16 = crcmod.mkCrcFun(poly=0x11021, initCrc=0xFFFF, rev=False, xorOut=0x0000)
        self.crc16Code = hex(crc16(str(payload).encode('utf-8')))
        self.crc16Code_formatado = str(self.crc16Code).replace('0x', '').upper().zfill(4)
        self.payload_completa = f'{payload}{self.crc16Code_formatado}'

    def gerarQrCode(self, payload, diretorio):
        """Método opcional para gerar QR Code"""
        dir = os.path.expanduser(diretorio)
        self.qrcode = qrcode.make(payload)
        self.qrcode.save(os.path.join(dir, 'pixqrcodegen.png'))