package cl.dsy1104.ferreteria.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/** Configuración de Swagger / OpenAPI para la API REST de la EP3. */
@Configuration
public class OpenApiConfig {

  private static final String JWT_SCHEME = "bearerAuth";

  @Bean
  public OpenAPI ferreteriaOpenAPI() {
    return new OpenAPI()
        .info(
            new Info()
                .title("Ferretería Los Maestros — API REST")
                .description(
                    "API del proyecto semestral DSY1104 (EP3). "
                        + "Los endpoints marcados con el candado requieren un JWT obtenido en "
                        + "POST /api/auth/login. Los roles son Administrador, Vendedor, "
                        + "Contratista y Particular.")
                .version("1.0.0"))
        .addSecurityItem(new SecurityRequirement().addList(JWT_SCHEME))
        .components(
            new Components()
                .addSecuritySchemes(
                    JWT_SCHEME,
                    new SecurityScheme()
                        .name(JWT_SCHEME)
                        .type(SecurityScheme.Type.HTTP)
                        .scheme("bearer")
                        .bearerFormat("JWT")
                        .description(
                            "Copia el valor del campo token devuelto por /api/auth/login "
                                + "y pégalo aquí (sin la palabra 'Bearer').")));
  }
}
