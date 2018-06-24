package hu.adam.project_inventory.data.json;

import hu.adam.project_inventory.data.Client;
import hu.adam.project_inventory.data.Contact;
import hu.adam.project_inventory.data.Note;
import hu.adam.project_inventory.data.Project;

import java.util.ArrayList;
import java.util.List;

public class JsonWrapper {

    private List<Project> projects;
    private List<Note> notes;
    private List<Client> clients;
    private List<Contact> contacts;

    public JsonWrapper() {
        projects = new ArrayList<>();
        notes = new ArrayList<>();
        clients = new ArrayList<>();
        contacts = new ArrayList<>();
    }

    public JsonWrapper(List<Project> projects, List<Note> notes, List<Client> clients, List<Contact> contacts) {
        this.projects = projects;
        this.notes = notes;
        this.clients = clients;
        this.contacts = contacts;
    }

    public List<Project> getProjects() {
        return projects;
    }

    public void setProjects(List<Project> projects) {
        this.projects = projects;
    }

    public List<Note> getNotes() {
        return notes;
    }

    public void setNotes(List<Note> notes) {
        this.notes = notes;
    }

    public List<Client> getClients() {
        return clients;
    }

    public void setClients(List<Client> clients) {
        this.clients = clients;
    }

    public List<Contact> getContacts() {
        return contacts;
    }

    public void setContacts(List<Contact> contacts) {
        this.contacts = contacts;
    }
}
