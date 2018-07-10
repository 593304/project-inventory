package hu.adam.project_inventory.controller;

import hu.adam.project_inventory.data.Client;
import hu.adam.project_inventory.data.Contact;
import hu.adam.project_inventory.data.dao.ClientDao;
import hu.adam.project_inventory.data.dao.ContactDao;
import hu.adam.project_inventory.form.ContactForm;
import hu.adam.project_inventory.form.EditContactForm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.Optional;

@Controller
@RequestMapping("/contacts")
public class ContactController {

    @Autowired
    private ClientDao clientDao;
    @Autowired
    private ContactDao contactDao;

    @PostMapping("")
    public String save(@ModelAttribute ContactForm contactForm) {

        store(contactForm);

        return "redirect:/";
    }

    @PostMapping("/edit")
    public String edit(@ModelAttribute EditContactForm editContactForm) {

        store(editContactForm);

        return "redirect:/";
    }

    @PostMapping("/delete/{id}")
    public String delete(@PathVariable("id") long id) {

        contactDao.deleteById(id);

        return "redirect:/";
    }

    private void store(ContactForm contactForm) {
        Optional<Client> client = clientDao.findById(contactForm.getClient());
        Contact contact;

        if(client.isPresent())
            contact = contactForm.getContact(client.get());
        else
            contact = contactForm.getContact(null);

        if(contactForm.getMail().trim().isEmpty())
            contact.setMail(null);
        if(contactForm.getPhone().trim().isEmpty())
            contact.setPhone(null);
        if(contactForm.getAddress().trim().isEmpty())
            contact.setAddress(null);

        contactDao.save(contact);
    }
}
