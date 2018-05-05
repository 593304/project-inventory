package hu.adam.project_inventory.form;

import hu.adam.project_inventory.data.Client;

public class EditClientForm extends ClientForm {


    private long id;

    public EditClientForm() {
    }

    public EditClientForm(long id, String name, String alias) {
        this.id = id;
        setName(name);
        setAlias(alias);
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    @Override
    public Client getClient() {
        return new Client(id, getName(), getAlias());
    }
}
