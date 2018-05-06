package hu.adam.project_inventory.form;

import hu.adam.project_inventory.data.Client;
import hu.adam.project_inventory.data.Project;
import hu.adam.project_inventory.data.enums.ProjectPriority;
import hu.adam.project_inventory.data.enums.ProjectStatus;

public class EditProjectForm extends ProjectForm {

    private long id;

    public EditProjectForm() {
    }

    public EditProjectForm(String name, String code, long client, ProjectStatus status, ProjectPriority priority, long id) {
        super(name, code, client, status, priority);
        this.id = id;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    @Override
    public Project getProject(Client client) {
        Project project = super.getProject(client);
        project.setId(id);

        return project;
    }
}
