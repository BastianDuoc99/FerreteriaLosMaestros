# Documentación de integración frontend–backend (EP3)

## 1. Arquitectura

```text
Navegador
  │  React 19 + Vite 8 (frontend/, puerto 5173)
  │  Contextos: SesionContext (JWT en sessionStorage) y CarritoContext (localStorage)
  │  Servicio único: src/services/api.js (fetch + Bearer token)
  ▼
API REST Spring Boot 3.5 (backend/, puerto 8080)
  │  Spring Security + JwtAuthenticationFilter + @PreAuthorize
  │  Controladores → Servicios → Repositorios JPA
  ▼
MySQL 8 (ferreteria: productos, usuarios, pedidos, pedido_detalles, contactos)
```

Swagger UI: `http://localhost:8080/swagger-ui.html`
Especificación OpenAPI: `http://localhost:8080/v3/api-docs`

## 2. Componentes principales

| Capa | Archivo | Responsabilidad |
| --- | --- | --- |
| Frontend | `src/services/api.js` | Cliente HTTP; agrega `Authorization: Bearer` solo cuando se solicita y lanza `ApiError` con `status` |
| Frontend | `src/context/SesionContext.jsx` | Login, logout, persistencia del JWT y reconstrucción del perfil con `/auth/me` |
| Frontend | `src/components/RutaProtegida.jsx` | Restringe rutas por rol |
| Frontend | `src/pages/Admin.jsx` | Mantenedor de productos y aprobación de cuenta corriente |
| Frontend | `src/pages/Carrito.jsx` | Checkout: entrega, pago y confirmación del pedido |
| Backend | `config/SecurityConfig.java` | Reglas de acceso, CORS, 401/403 JSON, filtro JWT |
| Backend | `security/JwtService.java` | Generación y validación del token (HMAC, 1 h) |
| Backend | `service/PedidoService.java` | Recálculo de precios, validación de stock con bloqueo pesimista y descuento |
| Backend | `exception/GlobalExceptionHandler.java` | Respuestas `ApiError` uniformes |
| BD | `resources/data.sql` + `config/DataSeeder.java` | 85 productos y 3 usuarios demo |

## 3. Flujo REST

### Autenticación

1. `POST /api/auth/login` con `{ email, password }` → `AuthResponse { token, rol, ... }`.
2. El frontend guarda el JWT en `sessionStorage` (`SesionContext`).
3. Al recargar, `GET /api/auth/me` reconstruye el perfil; si el token expira o es inválido, se cierra la sesión.
4. Cada petición protegida envía `Authorization: Bearer <token>`.

### Catálogo y pedidos

- `GET /api/productos` (público, admite `q`, `categoria`, `tipo`, `subcategoria`, `stockBajo`).
- `GET /api/productos/{codigo}` (público).
- `POST /api/pedidos` (autenticado) recibe:

```json
{
  "items": [{ "codigo": "MC001", "qty": 2 }],
  "entrega": "retiro",
  "pago": "contado",
  "direccion": ""
}
```

`PedidoService` toma el precio desde MySQL, valida stock con `PESSIMISTIC_WRITE`, calcula el total y descuenta las unidades en la misma transacción.

## 4. Control de acceso (doble capa)

| Endpoint / vista | Frontend | Backend |
| --- | --- | --- |
| `GET /api/productos` | pública | `permitAll` |
| `POST/PUT/DELETE /api/productos` | solo `/admin` con rol Admin o Vendedor | `hasAnyRole` |
| `GET /api/usuarios` y aprobación de cuenta corriente | panel admin | `hasRole("Administrador")` |
| `POST/GET /api/pedidos` | `/mis-pedidos` requiere sesión | `authenticated` / Admin para el listado global |
| `POST /api/contacto` | pública | `permitAll` |
| `/swagger-ui.html`, `/v3/api-docs/**` | — | `permitAll` |

## 5. Configuración

| Variable | Default | Uso |
| --- | --- | --- |
| `DB_URL` | `jdbc:mysql://localhost:3306/ferreteria?...` | Cadena JDBC del backend |
| `DB_USER` / `DB_PASSWORD` | `ferreteria` / `ferreteria123` | Credenciales demo |
| `JWT_SECRET` | valor de desarrollo | Firma HMAC |
| `JWT_EXPIRATION_MS` | `3600000` | Vigencia del token |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:5173,http://127.0.0.1:5173` | Orígenes del frontend |
| `VITE_API_URL` | `http://localhost:8080/api` | URL de la API en el frontend |

Plantillas: `backend/.env.example` y `frontend/.env.example`.

## 6. Pasos para ejecutar

```powershell
# 1) MySQL (elegir una opción)
docker compose up -d mysql                 # Docker
# o bien:
.\scripts\iniciar-mysql.ps1                # MySQL portable

# 2) Backend
cd backend
.\mvnw.cmd spring-boot:run

# 3) Frontend (otra terminal)
cd frontend
npm ci
copy .env.example .env
npm run dev
```

Verificar: Swagger en `http://localhost:8080/swagger-ui.html`, frontend en `http://localhost:5173`.

## 7. Pruebas de integración realizadas

Backend (`.\mvnw.cmd -B -ntp test`, 8 tests con H2 en memoria):

| Test | Qué verifica |
| --- | --- |
| `catalogoEsPublico` | `GET /api/productos` sin token devuelve 200 |
| `credencialesIncorrectasDevuelven401` | Login inválido → 401 |
| `rutasProtegidasRequierenToken` | Sin token → 401 |
| `tokenDeAdministradorPermitePerfilYUsuarios` | Admin accede a `/auth/me` y `/usuarios` |
| `vendedorNoPuedeConsultarUsuarios` | Vendedor → 403 |
| `pedidoRecalculaPrecioYDescuentaStockEnServidor` | Precio desde BD y stock descontado |
| `cuentaCorrienteSinAprobacionEsRechazada` | Pago no aprobado → 403 |
| `contextoArrancaCorrectamente` | Arranque del contexto Spring |

Frontend (`npm test`, 44 tests): validaciones, cliente API, catálogo, carrito, login, registro, contacto, productos y componentes.

Pruebas manuales de integración (documentadas para el video):

1. Hacer login con `admin@duoc.cl` → copiar el token desde la respuesta.
2. En Swagger, pulsar **Authorize** y pegar el token → ejecutar `GET /api/usuarios` → 200.
3. Repetir sin token → 401; con token de `vendedor@duoc.cl` → 403.
4. Crear un pedido desde el frontend y verificar en Swagger/BD que el stock bajó.
5. Recargar la página con sesión iniciada → el usuario permanece autenticado.
