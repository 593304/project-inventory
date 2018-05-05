package hu.fnttzf.project_inventory;

import com.fasterxml.jackson.databind.ObjectMapper;
import hu.fnttzf.project_inventory.data.Client;
import hu.fnttzf.project_inventory.data.JsonWrapper;
import hu.fnttzf.project_inventory.data.dao.ClientDao;
import hu.fnttzf.project_inventory.data.dao.ProjectDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.support.SpringBootServletInitializer;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import java.io.File;
import java.io.IOException;

@SpringBootApplication
@EnableWebMvc
public class App extends SpringBootServletInitializer {

    public static final int port = 8082;
    public static final String name = "/project-inventory";

    private static Client dummyClient;

    public static File jsonFile;

    @Autowired
    private ProjectDao projectDao;
    @Autowired
    private ClientDao clientDao;

    @PostConstruct
    private void init() {

        dummyClient = new Client("-", "-");
        dummyClient.setId(clientDao.save(dummyClient).getId());

        if(jsonFile.exists()) {
            try {
                if(jsonFile.length() > 0) {
                    ObjectMapper objectMapper = new ObjectMapper();
                    JsonWrapper jsonWrapper = objectMapper.readValue(jsonFile, JsonWrapper.class);

                    clientDao.save(jsonWrapper.getClients());
                    projectDao.save(jsonWrapper.getProjects());
                } else
                    System.out.println("The file is empty!");
            } catch (Exception e) {
                e.printStackTrace();

                throw new RuntimeException("Error while reading!");
            }
        } else {
            try {
                jsonFile.createNewFile();
            } catch (IOException e) {
                e.printStackTrace();

                throw new RuntimeException("Error while creating file!");
            }
        }
    }

    public static void writeToFile(ClientDao clientDao, ProjectDao projectDao) throws IOException {
        if(jsonFile.exists()) {
            JsonWrapper jsonWrapper = new JsonWrapper();

            jsonWrapper.setClients(clientDao.findAllByIdIsNot(dummyClient.getId()));
            jsonWrapper.setProjects(projectDao.findAllBy());

            ObjectMapper om = new ObjectMapper();
            om.writeValue(jsonFile, jsonWrapper);
        }
    }

    @PreDestroy
    private void destroy() {
        try {
            writeToFile(clientDao, projectDao);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static Client getDummyClient() {
        return dummyClient;
    }

    public static void main(String[] args) {
        if(args.length > 0)
            jsonFile = new File(args[0]);
        else
            throw new RuntimeException("No parameter found!");

        SpringApplication.run(App.class, args);
    }
}
