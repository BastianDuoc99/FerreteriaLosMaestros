package cl.dsy1104.ferreteria.service;

import cl.dsy1104.ferreteria.dto.ContactoRequest;
import cl.dsy1104.ferreteria.entity.Contacto;
import cl.dsy1104.ferreteria.repository.ContactoRepository;
import java.time.LocalDateTime;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ContactoService {

  private final ContactoRepository contactoRepository;

  public ContactoService(ContactoRepository contactoRepository) {
    this.contactoRepository = contactoRepository;
  }

  @Transactional
  public void guardar(ContactoRequest solicitud) {
    Contacto contacto = new Contacto();
    contacto.setNombre(solicitud.nombre().trim());
    contacto.setEmail(solicitud.email().trim().toLowerCase());
    contacto.setMensaje(solicitud.mensaje().trim());
    contacto.setFecha(LocalDateTime.now());
    contactoRepository.save(contacto);
  }
}
