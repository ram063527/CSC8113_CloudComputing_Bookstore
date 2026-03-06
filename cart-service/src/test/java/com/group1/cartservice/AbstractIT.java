package com.group1.cartservice;

import com.github.tomakehurst.wiremock.WireMockServer;
import com.github.tomakehurst.wiremock.client.WireMock;
import io.restassured.RestAssured;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.wiremock.spring.ConfigureWireMock;
import org.wiremock.spring.EnableWireMock;
import org.wiremock.spring.InjectWireMock;

import java.math.BigDecimal;

import static com.github.tomakehurst.wiremock.client.WireMock.aResponse;
import static com.github.tomakehurst.wiremock.client.WireMock.urlMatching;

@Import(TestcontainersConfiguration.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@EnableWireMock(@ConfigureWireMock(port = 0))
public class AbstractIT {

    @LocalServerPort
    int port;

    @InjectWireMock
    protected WireMockServer wireMockServer;

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("cart.catalog-service-url",() -> "http://localhost:${wiremock.server.port}");
    }

    @BeforeEach
    void setUp() {
        RestAssured.port = port;
        wireMockServer.resetAll();
    }

    // Mock Get Product By Code Check

    protected void mockGetProductByCode(String code, String name, BigDecimal price) {
        wireMockServer.stubFor(WireMock.get(WireMock.urlMatching("/api/products/" + code))
                .willReturn(aResponse()
                        .withHeader("Content-Type", "application/json")
                .withStatus(200)
                .withBody(
                        """
                                {
                                    "code": "%s",
                                    "name": "%s",
                                    "price": %f
                                }
                        """.formatted(code,name,price.doubleValue()))));

    }

    // Mock the Availability of Product Check

    protected void mockCheckAvailability(String code, int availableQuantity) {
        wireMockServer.stubFor(WireMock.get(urlMatching("/api/products/" + code + "/availability"))
                .willReturn(aResponse()
                        .withHeader("Content-Type", "application/json")
                        .withStatus(200)
                        .withBody(
                                """
                                        {
                                            "code": "%s",
                                            "availableQuantity": %d
                                        }
                                """.formatted(code, availableQuantity))));
    }

    // Mock a Successful Reservation
    protected void mockReserveStockSuccess(String code) {
        wireMockServer.stubFor(WireMock.post(urlMatching("/api/products/" + code + "/reserve"))
                .willReturn(aResponse()
                        .withStatus(200)));
    }

    protected void mockReleaseStockSuccess(String code) {
        wireMockServer.stubFor(WireMock.post(WireMock.urlMatching("/api/products/" + code + "/release"))
                .willReturn(WireMock.aResponse().withStatus(200)));
    }

}
