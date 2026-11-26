# Base de datos

## Motor oficial (EP3): MySQL 8

- URL: `jdbc:mysql://127.0.0.1:3306/ferreteria?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC`
- Usuario / contraseña de demostración: `ferreteria` / `ferreteria123`
- Root sin contraseña solo en la instalación portable local (ver `scripts/iniciar-mysql.ps1`)
- Alternativa con Docker: `docker compose up -d mysql` desde la raíz del repositorio.

## Esquema

JPA crea/actualiza las tablas con `spring.jpa.hibernate.ddl-auto=update`:

| Tabla | Descripción |
| --- | --- |
| `productos` | Catálogo ( código PK, categoría, marca, precios, stock, imagen, tipo ) |
| `usuarios` | Clientes y staff; email y RUN únicos, contraseña BCrypt, `rol`, cuenta corriente |
| `pedidos` | Cabecera con usuario, estado, entrega, pago, dirección y total |
| `pedido_detalles` | Ítems: snapshot de código/nombre/precio/cantidad/subtotal |
| `contactos` | Mensajes del formulario de contacto |

Relaciones: `pedidos.usuario_id → usuarios.id`, `pedido_detalles.pedido_id → pedidos.id`. El detalle guarda el precio al momento de la compra, por eso no apunta a `productos`.

## Datos iniciales

- `backend/src/main/resources/data.sql`: 85 productos con inserciones idempotentes (`INSERT ... SELECT ... WHERE NOT EXISTS`).
- `backend/src/main/java/cl/dsy1104/ferreteria/config/DataSeeder.java`: tres usuarios demo (`admin@duoc.cl`, `vendedor@duoc.cl`, `cliente@duoc.cl`, contraseña `1234`).

Para reiniciar los datos en MySQL:

```sql
DROP DATABASE ferreteria;
CREATE DATABASE ferreteria CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Luego vuelve a iniciar el backend: JPA y los seeders recrean todo.

## Perfil alternativo H2 (solo desarrollo rápido)

Si no hay MySQL disponible, levantar con `.\mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=local`:

- URL: `jdbc:h2:file:./data/ferreteria`
- Usuario `sa`, contraseña vacía
- Consola: `http://localhost:8080/h2-console`
- Para reiniciar, borrar `backend/data/ferreteria.mv.db` y `backend/data/ferreteria.trace.db` con el backend detenido.
