package hu.adam.project_inventory.form;

import hu.adam.project_inventory.data.Client;
import hu.adam.project_inventory.data.Contact;

public class ContactForm {

    private String firstName;
    private String lastName;
    private long client;
    private String mail;
    private String phone;
    private String address;

    public ContactForm() {
    }

    public ContactForm(String firstName, String lastName, long client, String mail, String phone, String address) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.client = client;
        this.mail = mail;
        this.phone = phone;
        this.address = address;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public long getClient() {
        return client;
    }

    public void setClient(long client) {
        this.client = client;
    }

    public String getMail() {
        return mail;
    }

    public void setMail(String mail) {
        this.mail = mail;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public Contact getContact(Client client) {
        return new Contact(firstName, lastName, mail, phone, address, client);
    }
}
