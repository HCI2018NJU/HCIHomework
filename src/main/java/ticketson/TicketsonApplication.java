package ticketson;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class TicketsonApplication {

	public static void main(String[] args) {
		SpringApplication.run(TicketsonApplication.class, args);
	}
}
