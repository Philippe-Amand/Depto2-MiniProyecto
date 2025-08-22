from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import Property, Document

class PropertySerializer(serializers.ModelSerializer):
    document_count = serializers.SerializerMethodField()

    class Meta:
        model = Property
        fields = [
            'id', 'name', 'address', 'description', 'price', 
            'latitude', 'longitude', 'youtube_video_url', 'image',
            'created_at', 'updated_at', 'document_count'
        ]

    # --- AÑADE ESTE MÉTODO COMPLETO ---
    def get_document_count(self, obj):
        # 'obj' es la instancia de la propiedad.
        # Accedemos a los documentos relacionados a través del 'related_name' que definimos.
        return obj.documents.count()

class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = ['id', 'file', 'uploaded_at', 'property']
        read_only_fields = ['property'] # Hacemos que la propiedad sea de solo lectura
    def get_document_count(self, obj):
        # 'obj' es la instancia de la propiedad que se está serializando.
        # Contamos cuántos documentos están relacionados con ella.
        return obj.documents.count()

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        # Llama al método original para obtener el token
        token = super().get_token(user)

        # Añade claims (datos) personalizados al payload del token
        token['username'] = user.username
        token['email'] = user.email
        # ...puedes añadir cualquier otro dato del modelo User que necesites

        return token