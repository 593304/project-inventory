package hu.adam.project_inventory.data;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "client")
public class Client {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String name;
    private String alias;

    @OneToMany(mappedBy = "client", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Project> projects;

    @OneToMany(mappedBy = "client", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Contact> contacts;

    public Client() {
        projects = new ArrayList<>();
        contacts = new ArrayList<>();
    }

    public Client(String name, String alias) {
        this.name = name;
        this.alias = alias;
    }

    public Client(long id, String name, String alias) {
        this.id = id;
        this.name = name;
        this.alias = alias;
    }

    public Client(String name, String alias, List<Project> projects, List<Contact> contacts) {
        this.name = name;
        this.alias = alias;
        this.projects = projects;
        this.contacts = contacts;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAlias() {
        return alias;
    }

    public void setAlias(String alias) {
        this.alias = alias;
    }

    public List<Project> getProjects() {
        return projects;
    }

    public void setProjects(List<Project> projects) {
        this.projects = projects;
    }

    public List<Contact> getContacts() {
        return contacts;
    }

    public void setContacts(List<Contact> contacts) {
        this.contacts = contacts;
    }

    @Override
    public String toString() {
        return "Client{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", alias='" + alias + '\'' +
                ", projects=" + projects +
                ", contacts=" + contacts +
                '}';
    }
}
