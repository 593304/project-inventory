package hu.adam.project_inventory.data;

import javax.persistence.*;

@Entity
@Table(name = "contact")
public class Contact {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @Column(name = "first_name")
    private String firstName;
    @Column(name = "last_name")
    private String lastName;
    private String mail;
    private String phone;
    private String address;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id")
    private Client client;

    public Contact() {
    }

    public Contact(String firstName, String lastName, String mail, String phone, String address, Client client) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.mail = mail;
        this.phone = phone;
        this.address = address;
        this.client = client;
    }

    public Contact(long id, String firstName, String lastName, String mail, String phone, String address, Client client) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.mail = mail;
        this.phone = phone;
        this.address = address;
        this.client = client;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
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

    public Client getClient() {
        return client;
    }

    public void setClient(Client client) {
        this.client = client;
    }

    @Override
    public String toString() {
        return "Contact{" +
                "id=" + id +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", mail='" + mail + '\'' +
                ", phone='" + phone + '\'' +
                ", address='" + address + '\'' +
                ", client=" + client +
                '}';
    }
}
