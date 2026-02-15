# backend/src/users/management/commands/sync_legacy_users.py
from django.core.management.base import BaseCommand
from django.db import models, transaction
from django.contrib.auth.models import AbstractBaseUser # Para el tipado
from users.models import CustomUser # Tu modelo de usuario de Django
import getpass # Para generar contraseñas seguras

# --- Paso 1: Definir un modelo NO GESTIONADO que mapea a tu tabla legada ---
# Esto nos permite usar el ORM de Django para leer de 'usuarios' sin que Django intente modificarla.
class LegacyUser(models.Model):
    idUsuario = models.AutoField(primary_key=True, db_column='idUsuario')
    nombre = models.CharField(max_length=255, db_column='nombre')
    email = models.EmailField(max_length=255, db_column='email')
    habilitado = models.BooleanField(db_column='habilitado')
    admin = models.BooleanField(db_column='admin')

    class Meta:
        managed = False
        db_table = 'usuarios' # Nombre exacto de tu tabla en MySQL

# --- Paso 2: Crear el Management Command ---
class Command(BaseCommand):
    help = 'Sincroniza los usuarios desde la tabla legada "usuarios" a la tabla de autenticación de Django.'

    @transaction.atomic
    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE('Iniciando sincronización de usuarios legados...'))
        
        created_count = 0
        updated_count = 0

        # Obtener todos los usuarios de la tabla legada
        legacy_users = LegacyUser.objects.all()

        if not legacy_users:
            self.stdout.write(self.style.WARNING('No se encontraron usuarios en la tabla legada "usuarios".'))
            return

        for legacy_user in legacy_users:
            # Intentar encontrar un usuario de Django existente por email (o username si prefieres)
            # Usamos update_or_create para manejar ambos casos (creación y actualización) de forma atómica.
            django_user, created = CustomUser.objects.update_or_create(
                email=legacy_user.email,
                defaults={
                    'username': legacy_user.email, # Usamos el email como username por simplicidad
                    'first_name': legacy_user.nombre,
                    'is_active': legacy_user.habilitado,
                    'is_staff': legacy_user.admin,   # ¡¡MAPEADO CRÍTICO!!
                    'is_superuser': legacy_user.admin # Asumimos que un 'admin' legado es un superusuario
                }
            )

            # --- MANEJO DE CONTRASEÑA ---
            # Si el usuario es nuevo, debemos asignarle una contraseña.
            # Como no tenemos una, generaremos una contraseña inicial aleatoria y segura.
            if created:
                temp_password = getpass.getpass(f"El usuario '{legacy_user.email}' es nuevo. Por favor, cree una contraseña segura para él: ")
                django_user.set_password(temp_password)
                django_user.save()
                self.stdout.write(self.style.SUCCESS(
                    f"Usuario '{legacy_user.email}' CREADO. Inicie sesión con la contraseña que acaba de proporcionar."
                ))
                created_count += 1
            else:
                # Si el usuario ya existía, no tocamos su contraseña.
                # Solo hemos actualizado sus flags (is_active, is_staff, etc.)
                updated_count += 1

        self.stdout.write(self.style.SUCCESS(
            f'\nSincronización completada. '
            f'{created_count} usuarios creados, {updated_count} usuarios actualizados.'
        ))