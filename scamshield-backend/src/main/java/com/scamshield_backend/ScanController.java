package com.scamshield_backend;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/scan")
public class ScanController {

    @PostMapping("/message")
    public ScanResult scanMessage(@RequestBody ScanRequest request) {
        String text = request.message() == null
                ? ""
                : request.message().toLowerCase(Locale.ROOT);

        int score = 0;
        List<String> reasons = new ArrayList<>();

        if (text.contains("otp") || text.contains("pin") || text.contains("cvv")) {
            score += 30;
            reasons.add("Asks for an OTP, PIN, or CVV");
        }
        if (text.contains("kyc") && (text.contains("expired") || text.contains("update"))) {
            score += 20;
            reasons.add("Mentions a KYC update or expiry");
        }
        if (text.contains("immediately") || text.contains("within 24 hours")) {
            score += 15;
            reasons.add("Uses urgent language");
        }

        score = Math.min(score, 100);
        String level = score <= 30 ? "LOW" : score <= 60 ? "MEDIUM" : "HIGH";

        if (reasons.isEmpty()) {
            reasons.add("No known warning patterns found");
        }

        return new ScanResult(score, level, reasons);
    }

    public record ScanRequest(String message) {}
    public record ScanResult(int score, String level, List<String> reasons) {}
}