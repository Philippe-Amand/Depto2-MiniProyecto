# 🏗️ Proyecto Full Stack – Depto2

Este repositorio contiene el diagnóstico de la aplicación existente y el mini-proyecto práctico desarrollado como parte de la prueba técnica para **Full Stack Developer – Depto2**.

---

## 📌 Parte 1: Diagnóstico de la App Existente

### 📐 Arquitectura Propuesta
Se optó por una **arquitectura de API REST desacoplada**, con un **backend monolítico en Django** sirviendo datos a un **frontend Single-Page Application (SPA) en React**.  
- Máxima separación de intereses.  
- Desarrollo y despliegue independiente de backend y frontend.  
- Estándares modernos de desarrollo web.  
- El backend se organiza en **apps modulares de Django** (`properties`, `users`, `payments`, `documents`), con miras a una futura migración a microservicios si fuese necesario.

### 🔄 Reutilización de Código
- **Reutilizable:** lógica de negocio y algoritmos de cálculo financiero (extraídos y encapsulados en servicios o métodos dentro de los modelos de Django).  
- **Descartable:** código de interfaz de usuario de la app de escritorio (reemplazado por una nueva UI en React).  

### 🛠️ Tecnologías Utilizadas
**Backend**  
- Python 3.x  
- Django 5.x  
- Django REST Framework  
- djangorestframework-simplejwt  
- django-cors-headers  
- Pillow  
- drf-nested-routers  
- Transbank SDK  

**Frontend**  
- React 18+  
- Vite  
- React Router DOM  
- Material-UI (MUI)  
- React Leaflet  
- React Player  
- jwt-decode  

**Base de Datos (Desarrollo)**  
- SQLite 3  

**Control de Versiones**  
- Git & GitHub  

### 📂 Organización de Módulos
- **Backend (Django):** apps modulares (`properties`, `users`, `payments`, `documents`) con sus propios modelos, vistas y serializers.  
- **Autenticación:** gestionada por el backend con **JWT tokens** (`simplejwt`).  
- **Frontend (React):** organizado por funcionalidad en carpetas:  
  - `pages`: componentes principales asignados a rutas (ej. `HomePage`, `PropertyDetailPage`).  
  - `components`: componentes reutilizables (ej. `PropertiesTable`, `MapComponent`).  
  - `context`: manejo del estado global de la aplicación (ej. `AuthContext`).  

---

## 📌 Parte 2: Resumen del Mini-Proyecto Práctico

### ✅ Funcionalidades Implementadas
- **Registro y Autenticación de Usuarios** con contraseñas encriptadas (Django REST Framework + JWT).  
- **Cierre de Sesión por Inactividad** mediante temporizador en el frontend.  
- **Lista de Propiedades** mostrada en tabla con paginación (API → HomePage).  
- **Mapa Interactivo**:  
  - HomePage: mapa con propiedades de la página actual.  
  - PropertyDetailPage: mapa centrado en la propiedad seleccionada.  
- **API en GCP (Simulada para Desarrollo)** lista para despliegue en **Google Cloud Run**.  
- **Pagos:** integración con **Webpay de Transbank**, manejada por el backend.  
- **Subida y Descarga de Documentos** con control de permisos.  
- **Previsualización de Video de YouTube** en la PropertyDetailPage.  

---

## ⚙️ Instrucciones de Instalación

### 🔧 Requisitos Previos
- Python (>= 3.10)  
- Node.js (18.x.x LTS recomendado)  
- Git  

---

### 🚀 Backend (Django)
```bash
# 1. Navegar a la carpeta backend
cd backend

# 2. Crear y activar entorno virtual
python -m venv venv
source venv/Scripts/activate   # En Windows
source venv/bin/activate       # En Linux/Mac

# 3. Instalar dependencias
pip install -r requirements.txt

# 4. Navegar a carpeta src
cd src

# 5. Aplicar migraciones
python manage.py migrate

# 6. Crear superusuario
python manage.py createsuperuser

# 7. Iniciar servidor
python manage.py runserver
# Disponible en: http://127.0.0.1:8000

