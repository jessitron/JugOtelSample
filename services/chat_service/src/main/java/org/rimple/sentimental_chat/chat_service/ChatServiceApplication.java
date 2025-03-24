package org.rimple.sentimental_chat.chat_service;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "org.rimple.sentimental_chat")
public class ChatServiceApplication {
	protected static final Log logger = LogFactory.getLog(ChatServiceApplication.class);
	


	public static void main(String[] args) {
		SpringApplication.run(ChatServiceApplication.class, args);
	}
}
