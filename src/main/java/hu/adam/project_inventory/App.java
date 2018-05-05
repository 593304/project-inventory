package hu.adam.project_inventory;

import com.fasterxml.jackson.databind.ObjectMapper;
import hu.adam.project_inventory.data.JsonWrapper;
import hu.adam.project_inventory.data.dao.ClientDao;
import hu.adam.project_inventory.data.dao.ProjectDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.support.SpringBootServletInitializer;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

import javax.annotation.PostConstruct;
import java.io.File;
import java.io.IOException;
import java.nio.file.Path;

@SpringBootApplication
@EnableWebMvc
public class App extends SpringBootServletInitializer {

    private static String jsonFile;

    @Autowired
    private void setJsonFile(@Value("${config.app.json-file}") String jsonFile) {
        App.jsonFile = jsonFile;
    }

    private static ProjectDao projectDao;

    @Autowired
    private void setProjectDao(ProjectDao projectDao) {
        App.projectDao = projectDao;
    }

    private static ClientDao clientDao;

    @Autowired
    private void setClientDao(ClientDao clientDao) {
        App.clientDao = clientDao;
    }

    @PostConstruct
    private void init() {

        File jsonFile = new File(App.jsonFile);
        Path path = jsonFile.toPath();

        if(!jsonFile.exists()) {
            // Trying to create the file which will hold the data after shutdown
            // First checking the directory existence
            File dir = new File(path.getParent().toAbsolutePath().toString());
            if(!dir.isDirectory()) {
                if(!dir.mkdirs())
                    throw new RuntimeException(String.format("Error while creating directories (%s) !", jsonFile.getAbsolutePath()));
            }
            // Creating the json file
            try {
                jsonFile.createNewFile();
            } catch (IOException e) {
                throw new RuntimeException(String.format("Error while creating the json file (%s) !", App.jsonFile));
            }
        }

        // Adding objects to the DB
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
    }

    public static void writeToFile() {

        File jsonFile = new File(App.jsonFile);
        if(jsonFile.exists()) {
            JsonWrapper jsonWrapper = new JsonWrapper();

            jsonWrapper.setClients(App.clientDao.findAllBy());
            jsonWrapper.setProjects(App.projectDao.findAllBy());

            ObjectMapper om = new ObjectMapper();
            try {
                om.writeValue(jsonFile, jsonWrapper);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    public static void main(String[] args) {
        SpringApplication.run(App.class, args);
    }
}
