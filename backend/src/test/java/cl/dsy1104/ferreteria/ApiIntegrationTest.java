package cl.dsy1104.ferreteria;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class ApiIntegrationTest {

  @Autowired private MockMvc mockMvc;

  @Autowired private ObjectMapper objectMapper;

  @Test
  void catalogoEsPublico() throws Exception {
    mockMvc
        .perform(get("/api/productos").param("q", "Polpaico"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[0].codigo").value("MC001"));
  }

  @Test
  void credencialesIncorrectasDevuelven401() throws Exception {
    mockMvc
        .perform(
            post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"admin@duoc.cl\",\"password\":\"incorrecta\"}"))
        .andExpect(status().isUnauthorized());
  }

  @Test
  void rutasProtegidasRequierenToken() throws Exception {
    mockMvc.perform(get("/api/pedidos/mios")).andExpect(status().isUnauthorized());
    mockMvc.perform(get("/api/usuarios")).andExpect(status().isUnauthorized());
  }

  @Test
  void tokenDeAdministradorPermitePerfilYUsuarios() throws Exception {
    String token = login("admin@duoc.cl");

    mockMvc
        .perform(get("/api/auth/me").header("Authorization", "Bearer " + token))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.email").value("admin@duoc.cl"))
        .andExpect(jsonPath("$.rol").value("Administrador"));

    mockMvc
        .perform(get("/api/usuarios").header("Authorization", "Bearer " + token))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[0].email").exists());
  }

  @Test
  void vendedorNoPuedeConsultarUsuarios() throws Exception {
    String token = login("vendedor@duoc.cl");

    mockMvc
        .perform(get("/api/usuarios").header("Authorization", "Bearer " + token))
        .andExpect(status().isForbidden());
  }

  @Test
  void pedidoRecalculaPrecioYDescuentaStockEnServidor() throws Exception {
    String admin = login("admin@duoc.cl");

    String producto =
        """
        {
          "codigo": "TEST1",
          "categoria": "Pruebas",
          "subcategoria": "Pruebas",
          "nombre": "Producto de prueba",
          "marca": "Duoc",
          "unidad": "Unidad",
          "precioCompra": 5000,
          "precio": 10000,
          "stock": 10,
          "stockMinimo": 2,
          "descripcion": "Producto usado por los tests",
          "imagen": "/assets/img/logo.svg",
          "tipo": "pruebas"
        }
        """;

    mockMvc
        .perform(
            post("/api/productos")
                .header("Authorization", "Bearer " + admin)
                .contentType(MediaType.APPLICATION_JSON)
                .content(producto))
        .andExpect(status().isCreated());

    String cliente = login("cliente@duoc.cl");
    String pedido =
        """
        {
          "items": [{"codigo":"TEST1","qty":2}],
          "entrega": "retiro",
          "pago": "contado"
        }
        """;

    MvcResult resultado =
        mockMvc
            .perform(
                post("/api/pedidos")
                    .header("Authorization", "Bearer " + cliente)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(pedido))
            .andExpect(status().isCreated())
            .andReturn();

    JsonNode json = objectMapper.readTree(resultado.getResponse().getContentAsString());
    assertEquals(20000.0, json.get("total").asDouble());
    assertEquals("TEST1", json.get("items").get(0).get("codigo").asText());
    assertEquals("cliente@duoc.cl", json.get("usuario").asText());

    mockMvc
        .perform(get("/api/productos/TEST1"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.stock").value(8));
  }

  @Test
  void cuentaCorrienteSinAprobacionEsRechazada() throws Exception {
    String token = login("vendedor@duoc.cl");
    String pedido =
        """
        {
          "items": [{"codigo":"MC001","qty":1}],
          "entrega": "retiro",
          "pago": "cuenta-corriente"
        }
        """;

    mockMvc
        .perform(
            post("/api/pedidos")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(pedido))
        .andExpect(status().isForbidden());
  }

  private String login(String email) throws Exception {
    String respuesta =
        mockMvc
            .perform(
                post("/api/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(Map.of("email", email, "password", "1234"))))
            .andExpect(status().isOk())
            .andReturn()
            .getResponse()
            .getContentAsString();
    return objectMapper.readTree(respuesta).get("token").asText();
  }
}
