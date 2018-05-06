package hu.adam.project_inventory.rest;

import hu.adam.project_inventory.data.Contact;
import hu.adam.project_inventory.data.dao.ClientDao;
import hu.adam.project_inventory.data.dao.ContactDao;
import hu.adam.project_inventory.util.VCardUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/contacts")
public class ContactRestController {

    private static final MediaType contentType = MediaType.parseMediaType("application/octet-stream; charset=UTF-8");
    private static final String contentDisposition = "attachment; filename=\"vcard.vcf\"";

    @Autowired
    private ContactDao contactDao;
    @Autowired
    private ClientDao clientDao;

    @GetMapping("/list/{client_id}")
    public List<Contact> list(@PathVariable("client_id") long client_id) {
        return contactDao.findAllByClient(clientDao.findOne(client_id));
    }

    @GetMapping("/vcard/{id}")
    public ResponseEntity<Resource> downloadVCard(@PathVariable("id") long id) {
        Contact contact = contactDao.findOne(id);
        byte[] vCard = VCardUtil.getVCardString(
                "",
                contact.getFirstName(),
                contact.getLastName(),
                contact.getClient() == null ? null : contact.getClient().getName(),
                contact.getMail(),
                contact.getPhone()).getBytes(StandardCharsets.UTF_8);

        ByteArrayResource resource = new ByteArrayResource(vCard);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, contentDisposition)
                .contentLength(vCard.length)
                .contentType(contentType)
                .body(resource);
    }
}
