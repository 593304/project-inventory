package hu.adam.project_inventory.form;

import hu.adam.project_inventory.data.Client;
import hu.adam.project_inventory.data.Project;
import hu.adam.project_inventory.data.enums.ProjectPriority;
import hu.adam.project_inventory.data.enums.ProjectStatus;

public class ProjectForm {

    private String name;
    private String code;
    private String projectManager;
    private String serviceManager;
    private long client;
    private ProjectStatus status;
    private ProjectPriority priority;

    public ProjectForm() {
    }

    public ProjectForm(String name, String code, String projectManager, String serviceManager, long client, ProjectStatus status, ProjectPriority priority) {
        this.name = name;
        this.code = code;
        this.projectManager = projectManager;
        this.serviceManager = serviceManager;
        this.client = client;
        this.status = status;
        this.priority = priority;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getProjectManager() {
        return projectManager;
    }

    public void setProjectManager(String projectManager) {
        this.projectManager = projectManager;
    }

    public String getServiceManager() {
        return serviceManager;
    }

    public void setServiceManager(String serviceManager) {
        this.serviceManager = serviceManager;
    }

    public long getClient() {
        return client;
    }

    public void setClient(long client) {
        this.client = client;
    }

    public ProjectStatus getStatus() {
        return status;
    }

    public void setStatus(ProjectStatus status) {
        this.status = status;
    }

    public ProjectPriority getPriority() {
        return priority;
    }

    public void setPriority(ProjectPriority priority) {
        this.priority = priority;
    }

    public Project getProject(Client client) {
        return new Project(name, code, projectManager, serviceManager, client, status, priority);
    }
}
