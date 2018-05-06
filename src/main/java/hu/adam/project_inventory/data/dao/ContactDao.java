package hu.adam.project_inventory.data.dao;

import hu.adam.project_inventory.data.Client;
import hu.adam.project_inventory.data.Contact;
import org.springframework.data.repository.CrudRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional
public interface ContactDao extends CrudRepository<Contact, Long> {
    List<Contact> findAllBy();
    List<Contact> findAllByClient(Client client);
}
