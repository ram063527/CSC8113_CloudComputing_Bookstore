package com.group1.catalogservice.config;

import io.swagger.v3.oas.models.Paths;
import io.swagger.v3.oas.models.servers.Server;
import org.springdoc.core.customizers.OpenApiCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenApiCustomizer openApiCustomizer() {
        return openApi -> {

            openApi.setServers(List.of(new Server().url("http://localhost:9000").description("API Gateway")));

            Paths facadePaths = new Paths();
            openApi.getPaths().forEach((internalPath, pathItem) -> {;
                String publicPath = internalPath.replace("/api/catalog", "/catalog");
                facadePaths.addPathItem(publicPath, pathItem);
            });
            openApi.setPaths(facadePaths);

        };
    }
}
