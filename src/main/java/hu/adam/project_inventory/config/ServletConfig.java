package hu.adam.project_inventory.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.embedded.ConfigurableEmbeddedServletContainer;
import org.springframework.boot.context.embedded.EmbeddedServletContainerCustomizer;
import org.springframework.stereotype.Component;

@Component
public class ServletConfig implements EmbeddedServletContainerCustomizer {

    @Value("${config.servlet.port}")
    private int port;
    @Value("${config.servlet.name}")
    private String name;

    @Override
    public void customize(ConfigurableEmbeddedServletContainer container) {
        container.setPort(port);
        container.setContextPath(name);
    }
}
