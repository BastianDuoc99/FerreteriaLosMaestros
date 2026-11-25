# Base de datos

El proyecto usa H2 en modo archivo para desarrollo local.

- URL: `jdbc:h2:file:./data/ferreteria`
- Usuario: `sa`
- Contraseña: (vacía)
- Consola H2: `http://localhost:8080/h2-console`
- Inicialización automática: `backend/src/main/resources/data.sql`

Las tablas se crean automáticamente con JPA (`ddl-auto=update`). El archivo `data.sql` carga 85 productos, y `DataSeeder` crea tres usuarios de demostración con sus roles.

Para reiniciar los datos, detén el backend y elimina:

```powershell
backend/data/ferreteria.mv.db
backend/data/ferreteria.trace.db
```

Luego vuelve a ejecutar el backend. El seeder y `data.sql` recrearán la base.
