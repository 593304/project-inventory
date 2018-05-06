package hu.adam.project_inventory.form;

import hu.adam.project_inventory.data.Client;
import hu.adam.project_inventory.data.Contact;

public class EditContactForm extends ContactForm {

    private long id;

    public EditContactForm() {
    }

    public EditContactForm(String firstName, String lastName, long client, String mail, String phone, String address, long id) {
        super(firstName, lastName, client, mail, phone, address);
        this.id = id;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    @Override
    public Contact getContact(Client client) {
        Contact contact = super.getContact(client);
        contact.setId(id);

        return contact;
    }
}
