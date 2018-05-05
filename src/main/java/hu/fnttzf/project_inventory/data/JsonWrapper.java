package hu.fnttzf.project_inventory.data;

import java.util.ArrayList;
import java.util.List;

public class JsonWrapper {

    private List<Project> projects;
    private List<Client> clients;

    public JsonWrapper() {
        projects = new ArrayList<>();
        clients = new ArrayList<>();
    }

    public JsonWrapper(List<Project> projects, List<Client> clients) {
        this.projects = projects;
        this.clients = clients;
    }

    public List<Project> getProjects() {
        return projects;
    }

    public void setProjects(List<Project> projects) {
        this.projects = projects;
    }

    public List<Client> getClients() {
        return clients;
    }

    public void setClients(List<Client> clients) {
        this.clients = clients;
    }
}
