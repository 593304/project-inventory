package hu.adam.project_inventory.form;

import hu.adam.project_inventory.data.Client;

public class ClientForm {

    private String name;
    private String alias;

    public ClientForm() {
    }

    public ClientForm(String name, String alias) {
        this.name = name;
        this.alias = alias;
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

    public Client getClient() {
        return new Client(name, alias);
    }
}
