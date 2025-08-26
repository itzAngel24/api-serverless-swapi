# Mi API Serverless

API desarrollada con el framework Serverless usando TypeScript, AWS API Gateway, Lambda Functions y DynamoDB. Ademas, añade proceso de almacenamiento de informacion en cache para evitar consultas repetidas a APIs externas. Ademas se añade optimizacion de costos para reducir el consumo de recursos.

# Descripción

Esta API proporciona funcionalidades para gestionar dos tipos de entidades:
- **Almacenados**: Gestión de usuarios con operaciones listar y guardar
- **Fusionados**: Gestión de personajes de StarWars fusionados con frases comunes de series, con historial de consultas

# Opciones de Usoß

Tienes **dos opciones** para usar esta API:

### Opción 1: Usar la API Desplegada (Recomendado para pruebas)

La API ya está desplegada y disponible en AWS. Puedes hacer peticiones directamente a:

**Base URL:** `https://n2vxk35woa.execute-api.us-east-1.amazonaws.com`

#### Endpoints disponibles:

**Almacenados:**
- `GET /listarAlmacenados` - Listar todos los almacenados
- `POST /almacenar` - Crear un nuevo almacenado

**Fusionados:**
- `GET /fusionados` - Listar todos los fusionados
- `POST /fusion` - Crear una nueva fusión
- `GET /historial` - Ver historial de consultas de fusionados

#### Puedes revisar la documentacion y hacer uso de la API a traves del swagger

**Swagger URL:** `https://n2vxk35woa.execute-api.us-east-1.amazonaws.com/dev/docs`

### Opción 2: Desplegar en tu Propia Cuenta de AWS

Si prefieres tener tu propia instancia de la API:

#### Prerrequisitos

- **Node.js** (v14 o superior)
- **npm** o **yarn**
- **AWS CLI** configurado
- **Cuenta de AWS** activa

#### Instalación y Configuración

1. **Clona el repositorio:**
```bash
git clone https://github.com/itzAngel24/api-serverless-swapi
cd mi-api-serverless
```

2. **Instala las dependencias:**
```bash
npm install
```

3. **Configura AWS CLI:**
```bash
# Instala AWS CLI si no lo tienes
npm install -g aws-cli

# Configura tus credenciales
aws configure
```

Te pedirá:
- AWS Access Key ID
- AWS Secret Access Key
- Default region (recomendado: us-east-1)
- Default output format (json)

4. **Despliega el proyecto:**
```bash
npm run deploy:dev
```

#### Scripts Disponibles

```bash
# Desplegar en desarrollo
npm run deploy:dev

# Desplegar en producción
npm run deploy:prod

# Ejecutar tests locales
npm test

# Ejecutar localmente con serverless-offline
npm run dev

#Limpiar recursos
# Remover stack dev
serverless remove --stage dev

# Remover stack prod
serverless remove --stage prod
```

## 📚 Documentación de la API

### Respuestas de la API

Todas las respuestas siguen el formato estándar:
- **200/201**: Operación exitosa
- **400**: Datos inválidos
- **500**: Error interno del servidor


## Arquitectura

- **Framework**: Serverless Framework
- **Runtime**: Node.js con TypeScript
- **Cloud Provider**: AWS
- **Servicios AWS utilizados**:
  - API Gateway (REST API)
  - Lambda Functions
  - DynamoDB (base de datos NoSQL)

## Configuración Local

Para desarrollo local, puedes usar:

```bash
# Instalar serverless-offline para desarrollo local
npm install -g serverless-offline

# Ejecutar localmente
npm run dev
```

Esto levantará la API en `http://localhost:3000`

## Variables de Entorno

El proyecto utiliza diferentes stages:
- `dev` - Desarrollo
- `prod` - Producción

Las variables se configuran automáticamente según el stage utilizado.

## Cosas por mejorar
0. Agregar validaciones de negocio para evitar registros repetidos
1. Añadir mas tests tanto unitarios como de integracion para aumentar el coverage
2. Añadir correcciones del linter
3. Agregar autenticacion para mayor seguridad de la API (ejemplo: AWS:Cognito)
4. Agregar sistema de rate-limiting para evitar abuso de los endpoints que consumen las
APIs externas
5. Añadir monitorización de latencias y trazabilidad de las peticiones con AWS X-Ray
6. Uso de Gherkin para las pruebas unitarias
