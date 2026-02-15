from app import db

class Venta(db.Model):
    __tablename__ = 'ventas'
    
    idVenta = db.Column(db.Integer, primary_key=True, autoincrement=True)
    fechaDescarga = db.Column(db.DateTime, nullable=False)
    fechaCorrespondiente = db.Column(db.DateTime, nullable=False)
    titulo = db.Column(db.String(255), nullable=False)
    direccion = db.Column(db.String(255), nullable=False)
    idRegionComuna = db.Column(db.Integer, db.ForeignKey('regionescomunas.idRegionComuna'), nullable=False)
    idComuna = db.Column(db.Integer, db.ForeignKey('comunasinternas.idComuna'), nullable=False)
    disponibilidad = db.Column(db.String(255), nullable=False)
    tipo = db.Column(db.String(255), nullable=False)
    superficieTotal = db.Column(db.String(255), nullable=False)
    superficieUtil = db.Column(db.String(255), nullable=False)
    superficiePonderada = db.Column(db.String(255), nullable=False)
    antiguedad = db.Column(db.Integer, nullable=False)
    dataAntiguedad = db.Column(db.String(15), nullable=False)
    amoblado = db.Column(db.Integer, nullable=False)
    precio = db.Column(db.Integer, nullable=False)
    moneda = db.Column(db.String(2), nullable=False)
    uf_m2 = db.Column(db.Float, nullable=False)
    habitaciones = db.Column(db.Integer, nullable=False)
    banos = db.Column(db.Integer, nullable=False)
    estacionamientos = db.Column(db.Integer, nullable=False)
    bodegas = db.Column(db.Integer, nullable=False)
    url = db.Column(db.String(255), nullable=False)
    latitud = db.Column(db.Float, nullable=False)
    longitud = db.Column(db.Float, nullable=False)
    uf_clp = db.Column(db.Float, nullable=False)

    # puntoVenta = db.relationship('PuntoVenta', backref='venta')
    approachMixedParameters = db.relationship('ApproachMixed', backref='venta', uselist=False)
    arriendoVenta = db.relationship('ArriendoVenta', backref='venta')
    regionComuna = db.relationship('RegionComuna', backref='ventas', uselist=False)
    comuna = db.relationship('Comuna', backref='ventas', uselist=False)


    def __init__(self, fechaDescarga, fechaCorrespondiente, titulo, direccion, idRegionComuna, idComuna, disponibilidad, tipo, 
                 superficieTotal, superficieUtil, superficiePonderada, antiguedad, dataAntiguedad, amoblado, precio, moneda, uf_m2,
                 habitaciones, banos, estacionamientos, bodegas, url, latitud, longitud, uf_clp):
        
        self.fechaDescarga = fechaDescarga
        self.fechaCorrespondiente = fechaCorrespondiente
        self.titulo = titulo
        self.direccion = direccion
        self.idRegionComuna = idRegionComuna
        self.idComuna = idComuna
        self.disponibilidad = disponibilidad
        self.tipo = tipo
        self.superficieTotal = superficieTotal
        self.superficieUtil = superficieUtil
        self.superficiePonderada = superficiePonderada
        self.antiguedad = antiguedad
        self.dataAntiguedad = dataAntiguedad
        self.amoblado = amoblado
        self.precio = precio
        self.moneda = moneda
        self.uf_m2 = uf_m2
        self.habitaciones = habitaciones
        self.banos = banos
        self.estacionamientos = estacionamientos
        self.bodegas = bodegas
        self.url = url
        self.latitud = latitud
        self.longitud = longitud
        self.uf_clp = uf_clp

# class ApproachMixed(db.Model):
#     __tablename__ = 'approachmixed'

#     idIndicadorMixed = db.Column(db.Integer, primary_key=True, autoincrement=True)
#     idVenta = db.Column(db.Integer, db.ForeignKey('ventas.idVenta'), nullable=False)
#     arriendoPromedioMin = db.Column('Arriendo Promedio Min', db.Integer, nullable=False)
#     arriendoPromedio = db.Column('Arriendo Promedio', db.Integer, nullable=False)
#     arriendoPromedioMax = db.Column('Arriendo Promedio Max', db.Integer, nullable=False)
#     capRateBrutoPromedioMin = db.Column('Cap Rate Bruto Promedio Min', db.Integer, nullable=False)
#     capRateBrutoPromedio = db.Column('Cap Rate Bruto Promedio', db.Integer, nullable=False)
#     capRateBrutoPromedioMax = db.Column('Cap Rate Bruto Promedio Max', db.Integer, nullable=False)
#     arriendoPromedioAmobladoMin = db.Column('Arriendo Promedio Amoblado Min', db.Integer, nullable=False)
#     arriendoPromedioAmoblado = db.Column('Arriendo Promedio Amoblado', db.Integer, nullable=False)
#     arriendoPromedioAmobladoMax = db.Column('Arriendo Promedio Amoblado Max', db.Integer, nullable=False)
#     capRateBrutoPromedioAmobladoMin = db.Column('Cap Rate Bruto Promedio Amoblado Min', db.Integer, nullable=False)
#     capRateBrutoPromedioAmoblado = db.Column('Cap Rate Bruto Promedio Amoblado', db.Integer, nullable=False)
#     capRateBrutoPromedioAmobladoMax = db.Column('Cap Rate Bruto Promedio Amoblado Max', db.Integer, nullable=False)


#     def __init__(self, idVenta, arriendoPromedioMin, arriendoPromedio, arriendoPromedioMax, capRateBrutoPromedioMin,
#                   capRateBrutoPromedio, capRateBrutoPromedioMax, arriendoPromedioAmobladoMin, arriendoPromedioAmoblado, arriendoPromedioAmobladoMax,
#                   capRateBrutoPromedioAmobladoMin, capRateBrutoPromedioAmoblado, capRateBrutoPromedioAmobladoMax):
        
#         self.idVenta = idVenta
#         self.arriendoPromedioMin = arriendoPromedioMin
#         self.arriendoPromedio = arriendoPromedio
#         self.arriendoPromedioMax = arriendoPromedioMax
#         self.capRateBrutoPromedioMin = capRateBrutoPromedioMin
#         self.capRateBrutoPromedio = capRateBrutoPromedio
#         self.capRateBrutoPromedioMax = capRateBrutoPromedioMax
#         self.arriendoPromedioAmobladoMin = arriendoPromedioAmobladoMin
#         self.arriendoPromedioAmoblado = arriendoPromedioAmoblado
#         self.arriendoPromedioAmobladoMax = arriendoPromedioAmobladoMax
#         self.capRateBrutoPromedioAmobladoMin = capRateBrutoPromedioAmobladoMin
#         self.capRateBrutoPromedioAmoblado = capRateBrutoPromedioAmoblado
#         self.capRateBrutoPromedioAmobladoMax = capRateBrutoPromedioAmobladoMax

