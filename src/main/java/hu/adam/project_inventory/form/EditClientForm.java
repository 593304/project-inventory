package hu.adam.project_inventory.form;

import hu.adam.project_inventory.data.Client;

public class EditClientForm extends ClientForm {


    private long id;

    public EditClientForm() {
    }

    public EditClientForm(String name, String alias, long id) {
        super(name, alias);
        this.id = id;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    @Override
    public Client getClient() {
        Client client = super.getClient();
        client.setId(id);

        return client;
    }
}
