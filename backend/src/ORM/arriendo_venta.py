
from app import db

class ArriendoVenta(db.Model):
    __tablename__= 'arriendosventas'

    idArriendoVenta = db.Column(db.Integer, primary_key=True, autoincrement=True)
    idArriendo = db.Column(db.Integer, db.ForeignKey('arriendos.idArriendo'), nullable=False)
    idVenta = db.Column(db.Integer, db.ForeignKey('ventas.idVenta'), nullable=False)
    distancia = db.Column(db.Integer, nullable=False)
    precioTransformadoLineal = db.Column(db.Float, nullable=False)
    precioTransformadoPonderado = db.Column(db.Float, nullable=False)
    inversoDistanciaFactor = db.Column(db.Float, nullable=False)

    
    # arriendo = db.relationship('Arriendo', back_populates='arriendosVentas')
    # venta = db.relationship('Venta', back_populates='arriendosVentas')


    def __init__(self, idArriendo, idVenta, distancia, precioTransformadoLineal, precioTransformadoPonderado,
                 inversoDistanciaFactor):
        
        self.idArriendo = idArriendo
        self.idVenta = idVenta
        self.distancia = distancia
        self.precioTransformadoLineal = precioTransformadoLineal
        self.precioTransformadoPonderado = precioTransformadoPonderado
        self.inversoDistanciaFactor = inversoDistanciaFactor