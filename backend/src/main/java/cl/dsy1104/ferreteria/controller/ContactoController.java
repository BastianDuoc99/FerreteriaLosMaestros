package cl.dsy1104.ferreteria.controller;

import cl.dsy1104.ferreteria.dto.ContactoRequest;
import cl.dsy1104.ferreteria.service.ContactoService;
import jakarta.validation.Valid;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/contacto")
public class ContactoController {

  private final ContactoService contactoService;

  public ContactoController(ContactoService contactoService) {
    this.contactoService = contactoService;
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public Map<String, String> enviar(@Valid @RequestBody ContactoRequest solicitud) {
    contactoService.guardar(solicitud);
    return Map.of("mensaje", "Mensaje recibido correctamente.");
  }
}
