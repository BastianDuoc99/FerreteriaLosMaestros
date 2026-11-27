package cl.dsy1104.ferreteria.config;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import cl.dsy1104.ferreteria.security.CustomUserDetailsService;
import cl.dsy1104.ferreteria.security.JwtAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

  private final JwtAuthenticationFilter jwtAuthenticationFilter;
  private final CustomUserDetailsService userDetailsService;

  @Value("${cors.allowed-origins}")
  private String allowedOrigins;

  public SecurityConfig(
      JwtAuthenticationFilter jwtAuthenticationFilter,
      CustomUserDetailsService userDetailsService) {
    this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    this.userDetailsService = userDetailsService;
  }

  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

  @Bean
  public DaoAuthenticationProvider authenticationProvider() {
    DaoAuthenticationProvider provider = new DaoAuthenticationProvider(userDetailsService);
    provider.setPasswordEncoder(passwordEncoder());
    return provider;
  }

  @Bean
  public AuthenticationManager authenticationManager(AuthenticationConfiguration configuracion)
      throws Exception {
    return configuracion.getAuthenticationManager();
  }

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http.csrf(csrf -> csrf.disable())
        .cors(Customizer.withDefaults())
        .sessionManagement(
            sesion -> sesion.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .headers(headers -> headers.frameOptions(frame -> frame.sameOrigin()))
        .authorizeHttpRequests(
            autorizacion ->
                autorizacion
                    .requestMatchers(HttpMethod.OPTIONS, "/**")
                    .permitAll()
                    .requestMatchers(
                        "/swagger-ui.html",
                        "/swagger-ui/**",
                        "/v3/api-docs/**",
                        "/v3/api-docs.yaml")
                    .permitAll()
                    .requestMatchers("/api/auth/registro", "/api/auth/login", "/api/contacto")
                    .permitAll()
                    .requestMatchers(HttpMethod.GET, "/api/productos/**")
                    .permitAll()
                    .requestMatchers("/h2-console/**")
                    .permitAll()
                    .requestMatchers(HttpMethod.POST, "/api/productos/**")
                    .hasAnyRole("Administrador", "Vendedor")
                    .requestMatchers(HttpMethod.PUT, "/api/productos/**")
                    .hasAnyRole("Administrador", "Vendedor")
                    .requestMatchers(HttpMethod.DELETE, "/api/productos/**")
                    .hasAnyRole("Administrador", "Vendedor")
                    .requestMatchers("/api/usuarios/**")
                    .hasRole("Administrador")
                    .requestMatchers("/api/pedidos/**", "/api/auth/me")
                    .authenticated()
                    .anyRequest()
                    .authenticated())
        .exceptionHandling(
            excepciones ->
                excepciones
                    .authenticationEntryPoint(
                        (request, response, error) -> {
                          response.setStatus(401);
                          response.setContentType("application/json;charset=UTF-8");
                          response
                              .getWriter()
                              .write(
                                  "{\"status\":401,\"error\":\"Unauthorized\",\"message\":\"Debes iniciar sesión.\"}");
                        })
                    .accessDeniedHandler(
                        (request, response, error) -> {
                          response.setStatus(403);
                          response.setContentType("application/json;charset=UTF-8");
                          response
                              .getWriter()
                              .write(
                                  "{\"status\":403,\"error\":\"Forbidden\",\"message\":\"No tienes permisos para esta acción.\"}");
                        }))
        .addFilterBefore(
            jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

    return http.build();
  }

  @Bean
  public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuracion = new CorsConfiguration();
    configuracion.setAllowedOrigins(
        Arrays.stream(allowedOrigins.split(",")).map(String::trim).filter(s -> !s.isEmpty()).toList());
    configuracion.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    configuracion.setAllowedHeaders(List.of("Authorization", "Content-Type"));
    configuracion.setAllowCredentials(true);

    UrlBasedCorsConfigurationSource fuente = new UrlBasedCorsConfigurationSource();
    fuente.registerCorsConfiguration("/**", configuracion);
    return fuente;
  }
}
