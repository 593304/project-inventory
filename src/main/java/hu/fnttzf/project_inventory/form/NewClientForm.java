package hu.fnttzf.project_inventory.form;

import hu.fnttzf.project_inventory.data.Client;

public class NewClientForm {

    private String name;
    private String alias;

    public NewClientForm() {
    }

    public NewClientForm(String name, String alias) {
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
