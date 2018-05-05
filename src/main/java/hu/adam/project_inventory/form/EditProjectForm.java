package hu.adam.project_inventory.form;

import hu.adam.project_inventory.data.Client;
import hu.adam.project_inventory.data.Project;
import hu.adam.project_inventory.data.ProjectPriority;
import hu.adam.project_inventory.data.ProjectStatus;

public class EditProjectForm extends ProjectForm {

    private long id;

    public EditProjectForm() {
    }

    public EditProjectForm(long id, String name, String code, long client, ProjectStatus status, ProjectPriority priority) {
        this.id = id;
        setName(name);
        setCode(code);
        setClient(client);
        setStatus(status);
        setPriority(priority);
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    @Override
    public Project getProject(Client client) {
        return new Project(id, getName(), getCode(), client, getStatus(), getPriority());
    }
}
