from app import db


class Arriendo(db.Model):
    __tablename__ = 'arriendos'
    
    idArriendo = db.Column(db.Integer, primary_key=True, autoincrement=True)
    fechaDescarga = db.Column( db.DateTime, nullable=False)
    fechaCorrespondiente = db.Column(db.DateTime, nullable=False)
    titulo = db.Column(db.String(255), nullable=False)
    direccion = db.Column(db.String(255), nullable=False)
    idRegionComuna = db.Column(db.Integer, db.ForeignKey("regionescomunas.idRegionComuna"),nullable=False)
    idComuna = db.Column(db.Integer, db.ForeignKey("comunasinternas.idComuna"),nullable=False)
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

    arriendosVentas = db.relationship('ArriendoVenta', backref='arriendo')
    arriendosParticulares = db.relationship('ArriendoParticular', backref='arriendo')
    regionComuna = db.relationship('RegionComuna', backref='arriendos', uselist=False)
    comuna = db.relationship('Comuna', backref='arriendos', uselist=False)


    def __init__(self, fechaDescarga, fechaCorrespondiente, titulo, direccion, idRegionComuna, idComuna, 
                 superficieTotal, superficieUtil, superficiePonderada, antiguedad, dataAntiguedad, amoblado, precio, moneda, uf_m2,
                 habitaciones, banos, estacionamientos, bodegas, url, latitud, longitud, uf_clp):
        
        self.fechaDescarga = fechaDescarga
        self.fechaCorrespondiente = fechaCorrespondiente
        self.titulo = titulo
        self.direccion = direccion
        self.idRegionComuna = idRegionComuna
        self.idComuna = idComuna
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
        self.arriendosVentas = []




