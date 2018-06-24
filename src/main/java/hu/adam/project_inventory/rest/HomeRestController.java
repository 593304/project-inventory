package hu.adam.project_inventory.rest;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@RestController
@RequestMapping("/home")
public class HomeRestController {

    private static final DateTimeFormatter formatterDate = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private static final DateTimeFormatter formatterDateTime = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    @GetMapping("/now/date")
    public String date() {
        return LocalDate.now().format(formatterDate);
    }

    @GetMapping("/now/date-time")
    public String dateTime() {
        return LocalDateTime.now().format(formatterDateTime);
    }
}
