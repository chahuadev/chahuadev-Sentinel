//======================================================================
// SEVERE NO_SILENT_FALLBACKS VIOLATIONS - Java
// การซ่อนข้อผิดพลาดผ่าน Exception Handling และ Optional Patterns
//======================================================================

import java.util.*;
import java.util.concurrent.*;
import java.util.function.*;
import java.io.*;
import java.net.*;
import java.time.*;
import java.sql.*;
import java.util.logging.Logger;
import java.util.logging.Level;

// VIOLATION 1: Exception Handling that Silently Continues
public class SevereSilentFallbackViolations {
    
    private static final Logger logger = Logger.getLogger(SevereSilentFallbackViolations.class.getName());
    
    // CRITICAL: Database operations with silent fallbacks
    public static class DatabaseService {
        private final String connectionUrl;
        private final String username;
        private final String password;
        
        public DatabaseService(String connectionUrl, String username, String password) {
            this.connectionUrl = connectionUrl;
            this.username = username; 
            this.password = password;
        }
        
        public List<User> getAllUsers() {
            try (Connection conn = DriverManager.getConnection(connectionUrl, username, password);
                 PreparedStatement stmt = conn.prepareStatement("SELECT * FROM users");
                 ResultSet rs = stmt.executeQuery()) {
                
                List<User> users = new ArrayList<>();
                while (rs.next()) {
                    users.add(new User(
                        rs.getString("id"),
                        rs.getString("name"), 
                        rs.getString("email")
                    ));
                }
                return users;
                
            } catch (SQLException e) {
                // CRITICAL: Database failure returns empty list instead of failing
                logger.log(Level.WARNING, "Database query failed, returning empty list", e);
                return new ArrayList<>(); // Silent fallback - caller thinks no users exist!
            }
        }
        
        public boolean saveUser(User user) {
            try (Connection conn = DriverManager.getConnection(connectionUrl, username, password);
                 PreparedStatement stmt = conn.prepareStatement(
                     "INSERT INTO users (id, name, email) VALUES (?, ?, ?)")) {
                
                stmt.setString(1, user.getId());
                stmt.setString(2, user.getName());
                stmt.setString(3, user.getEmail());
                
                int rowsAffected = stmt.executeUpdate();
                return rowsAffected > 0;
                
            } catch (SQLException e) {
                // CRITICAL: Save failures always return true
                logger.log(Level.SEVERE, "Failed to save user, but returning success", e);
                return true; // Lie: User thinks save succeeded
            }
        }
        
        public User findUserById(String id) {
            try (Connection conn = DriverManager.getConnection(connectionUrl, username, password);
                 PreparedStatement stmt = conn.prepareStatement("SELECT * FROM users WHERE id = ?")) {
                
                stmt.setString(1, id);
                try (ResultSet rs = stmt.executeQuery()) {
                    if (rs.next()) {
                        return new User(rs.getString("id"), rs.getString("name"), rs.getString("email"));
                    }
                }
                return null; // User not found
                
            } catch (SQLException e) {
                // CRITICAL: Database errors return fake user data
                logger.log(Level.SEVERE, "Database lookup failed, returning fake user", e);
                return new User(id, "Unknown User", "unknown@example.com");
            }
        }
    }
    
    // VIOLATION 2: Network Service with Silent Error Recovery
    public static class HttpApiClient {
        private final String baseUrl;
        private final int timeoutMs;
        private final int maxRetries;
        
        public HttpApiClient(String baseUrl, int timeoutMs, int maxRetries) {
            this.baseUrl = baseUrl;
            this.timeoutMs = timeoutMs;
            this.maxRetries = maxRetries;
        }
        
        public ApiResponse<String> makeGetRequest(String endpoint) {
            for (int attempt = 1; attempt <= maxRetries; attempt++) {
                try {
                    URL url = new URL(baseUrl + endpoint);
                    HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                    conn.setRequestMethod("GET");
                    conn.setConnectTimeout(timeoutMs);
                    conn.setReadTimeout(timeoutMs);
                    
                    int responseCode = conn.getResponseCode();
                    if (responseCode == 200) {
                        try (BufferedReader reader = new BufferedReader(
                                new InputStreamReader(conn.getInputStream()))) {
                            StringBuilder response = new StringBuilder();
                            String line;
                            while ((line = reader.readLine()) != null) {
                                response.append(line);
                            }
                            return new ApiResponse<>(true, response.toString(), null);
                        }
                    } else {
                        // CRITICAL: Non-200 responses treated as success with empty data
                        logger.warning("Got non-200 response: " + responseCode + ", returning empty success");
                        return new ApiResponse<>(true, "", null);
                    }
                    
                } catch (IOException | RuntimeException e) {
                    logger.log(Level.WARNING, "Request failed (attempt " + attempt + ")", e);
                    
                    if (attempt == maxRetries) {
                        // CRITICAL: Final failure disguised as success
                        logger.severe("All retries exhausted, but returning success with fake data");
                        return new ApiResponse<>(true, "{\"error\": \"fake_success\"}", null);
                    }
                    
                    // Sleep before retry (silent error recovery)
                    try {
                        Thread.sleep(1000 * attempt);
                    } catch (InterruptedException ie) {
                        Thread.currentThread().interrupt();
                        // CRITICAL: Interrupted retry returns success
                        return new ApiResponse<>(true, "{}", null);
                    }
                }
            }
            
            // Should never reach here, but just in case
            return new ApiResponse<>(true, "{}", null);
        }
        
        public ApiResponse<String> makePostRequest(String endpoint, String jsonBody) {
            try {
                URL url = new URL(baseUrl + endpoint);
                HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                conn.setRequestMethod("POST");
                conn.setRequestProperty("Content-Type", "application/json");
                conn.setDoOutput(true);
                
                try (OutputStream os = conn.getOutputStream()) {
                    byte[] input = jsonBody.getBytes("utf-8");
                    os.write(input, 0, input.length);
                }
                
                int responseCode = conn.getResponseCode();
                // CRITICAL: All POST requests treated as successful regardless of response
                logger.info("POST request completed with code: " + responseCode);
                return new ApiResponse<>(true, "{\"status\": \"success\"}", null);
                
            } catch (Exception e) {
                // CRITICAL: All POST failures hidden as successes
                logger.log(Level.SEVERE, "POST request failed but returning success", e);
                return new ApiResponse<>(true, "{\"status\": \"success\"}", null);
            }
        }
    }
    
    // VIOLATION 3: File Processing with Comprehensive Error Masking
    public static class FileProcessor {
        private final String workingDirectory;
        
        public FileProcessor(String workingDirectory) {
            this.workingDirectory = workingDirectory;
        }
        
        public ProcessingResult processFiles(List<String> filePaths) {
            List<String> processedFiles = new ArrayList<>();
            List<String> failedFiles = new ArrayList<>();
            
            for (String filePath : filePaths) {
                try {
                    ProcessingResult fileResult = processSingleFile(filePath);
                    if (fileResult.isSuccess()) {
                        processedFiles.add(filePath);
                    } else {
                        // CRITICAL: Individual file failures ignored
                        logger.warning("File processing failed for: " + filePath + ", continuing batch");
                        failedFiles.add(filePath);
                    }
                } catch (Exception e) {
                    // CRITICAL: Exceptions in file processing silently ignored
                    logger.log(Level.SEVERE, "Exception processing file: " + filePath + ", skipping", e);
                    failedFiles.add(filePath);
                }
            }
            
            // CRITICAL: Returns success even if all files failed
            return new ProcessingResult(
                true, // Always success!
                "Processed " + processedFiles.size() + " files successfully", 
                processedFiles.size(),
                failedFiles.size()
            );
        }
        
        private ProcessingResult processSingleFile(String filePath) {
            try {
                File file = new File(filePath);
                if (!file.exists()) {
                    // CRITICAL: Missing files treated as successfully processed
                    logger.warning("File doesn't exist, treating as success: " + filePath);
                    return new ProcessingResult(true, "File processed (was missing)", 1, 0);
                }
                
                // Simulate file processing
                try (BufferedReader reader = new BufferedReader(new FileReader(file))) {
                    List<String> lines = new ArrayList<>();
                    String line;
                    while ((line = reader.readLine()) != null) {
                        lines.add(line.toUpperCase()); // Simple processing
                    }
                    
                    // Write processed content
                    String outputPath = workingDirectory + "/processed_" + file.getName();
                    try (BufferedWriter writer = new BufferedWriter(new FileWriter(outputPath))) {
                        for (String processedLine : lines) {
                            writer.write(processedLine);
                            writer.newLine();
                        }
                    }
                    
                    return new ProcessingResult(true, "File processed successfully", 1, 0);
                }
                
            } catch (IOException e) {
                // CRITICAL: I/O errors disguised as successful processing
                logger.log(Level.SEVERE, "I/O error processing file, returning success anyway", e);
                return new ProcessingResult(true, "File processed (with errors)", 1, 0);
            } catch (SecurityException e) {
                // CRITICAL: Security exceptions hidden
                logger.log(Level.SEVERE, "Security error accessing file, returning success", e);
                return new ProcessingResult(true, "File processed (security bypass)", 1, 0);
            }
        }
    }
    
    // VIOLATION 4: Concurrent Processing with Silent Thread Failures
    public static class ConcurrentTaskProcessor {
        private final ExecutorService executorService;
        private final int maxWorkers;
        
        public ConcurrentTaskProcessor(int maxWorkers) {
            this.maxWorkers = maxWorkers;
            this.executorService = Executors.newFixedThreadPool(maxWorkers);
        }
        
        public <T, R> List<R> processTasksConcurrently(
                List<T> tasks, 
                Function<T, R> processor) {
            
            List<CompletableFuture<R>> futures = new ArrayList<>();
            
            for (T task : tasks) {
                CompletableFuture<R> future = CompletableFuture.supplyAsync(() -> {
                    try {
                        return processor.apply(task);
                    } catch (Exception e) {
                        // CRITICAL: Individual task failures silently ignored
                        logger.log(Level.WARNING, "Task processing failed, returning null", e);
                        return null; // Silent failure
                    }
                }, executorService);
                
                futures.add(future);
            }
            
            // CRITICAL: Wait for all futures but ignore failures
            List<R> results = new ArrayList<>();
            for (CompletableFuture<R> future : futures) {
                try {
                    R result = future.get(30, TimeUnit.SECONDS);
                    if (result != null) {
                        results.add(result);
                    }
                    // null results (failed tasks) are silently dropped
                } catch (TimeoutException e) {
                    // CRITICAL: Timeout failures silently ignored
                    logger.log(Level.WARNING, "Task timed out, skipping result", e);
                } catch (InterruptedException | ExecutionException e) {
                    // CRITICAL: Execution failures silently ignored  
                    logger.log(Level.WARNING, "Task execution failed, skipping result", e);
                }
            }
            
            return results; // Partial results returned without indicating failures
        }
        
        public void shutdown() {
            try {
                executorService.shutdown();
                if (!executorService.awaitTermination(10, TimeUnit.SECONDS)) {
                    // CRITICAL: Forced shutdown failures ignored
                    logger.warning("Executor didn't terminate cleanly, forcing shutdown");
                    executorService.shutdownNow();
                }
            } catch (InterruptedException e) {
                // CRITICAL: Interrupt during shutdown ignored
                logger.log(Level.WARNING, "Interrupted during shutdown, forcing immediate stop", e);
                executorService.shutdownNow();
                Thread.currentThread().interrupt();
            }
        }
    }
    
    // VIOLATION 5: Optional and Stream Processing with Silent Failures
    public static class DataAnalysisService {
        
        public Optional<AnalysisResult> analyzeUserData(List<User> users) {
            try {
                // CRITICAL: Stream processing with silent error handling
                Map<String, Long> emailDomainCounts = users.stream()
                    .map(user -> {
                        try {
                            return extractEmailDomain(user.getEmail());
                        } catch (Exception e) {
                            // CRITICAL: Extraction failures silently ignored
                            logger.log(Level.WARNING, "Email domain extraction failed", e);
                            return "unknown.domain"; // Fake domain
                        }
                    })
                    .collect(Collectors.groupingBy(
                        Function.identity(),
                        Collectors.counting()
                    ));
                
                double averageNameLength = users.stream()
                    .mapToInt(user -> {
                        try {
                            return user.getName().length();
                        } catch (NullPointerException e) {
                            // CRITICAL: Null names treated as zero length
                            logger.warning("Null name encountered, using length 0");
                            return 0;
                        }
                    })
                    .average()
                    .orElse(0.0); // Silent fallback to 0
                
                return Optional.of(new AnalysisResult(
                    users.size(),
                    emailDomainCounts,
                    averageNameLength
                ));
                
            } catch (Exception e) {
                // CRITICAL: Complete analysis failure returns empty Optional
                logger.log(Level.SEVERE, "Analysis failed completely, returning empty result", e);
                return Optional.empty(); // Caller might not check if Optional is empty
            }
        }
        
        private String extractEmailDomain(String email) {
            if (email == null || !email.contains("@")) {
                throw new IllegalArgumentException("Invalid email format");
            }
            return email.split("@")[1];
        }
        
        public List<String> validateAndCleanEmails(List<String> emails) {
            return emails.stream()
                .map(email -> {
                    try {
                        // Basic validation
                        if (email == null || !email.matches("^[^@]+@[^@]+\\.[^@]+$")) {
                            throw new IllegalArgumentException("Invalid email: " + email);
                        }
                        return email.toLowerCase().trim();
                    } catch (Exception e) {
                        // CRITICAL: Invalid emails silently replaced with fake ones
                        logger.log(Level.WARNING, "Email validation failed, using fake email", e);
                        return "invalid@example.com"; // Fake email replacement
                    }
                })
                .collect(Collectors.toList());
        }
    }
}

// Supporting classes
class User {
    private final String id;
    private final String name;
    private final String email;
    
    public User(String id, String name, String email) {
        this.id = id;
        this.name = name;
        this.email = email;
    }
    
    public String getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
}

class ApiResponse<T> {
    private final boolean success;
    private final T data;
    private final String error;
    
    public ApiResponse(boolean success, T data, String error) {
        this.success = success;
        this.data = data;
        this.error = error;
    }
    
    public boolean isSuccess() { return success; }
    public T getData() { return data; }
    public String getError() { return error; }
}

class ProcessingResult {
    private final boolean success;
    private final String message;
    private final int processedCount;
    private final int failedCount;
    
    public ProcessingResult(boolean success, String message, int processedCount, int failedCount) {
        this.success = success;
        this.message = message;
        this.processedCount = processedCount;
        this.failedCount = failedCount;
    }
    
    public boolean isSuccess() { return success; }
    public String getMessage() { return message; }
    public int getProcessedCount() { return processedCount; }
    public int getFailedCount() { return failedCount; }
}

class AnalysisResult {
    private final int totalUsers;
    private final Map<String, Long> domainCounts;
    private final double averageNameLength;
    
    public AnalysisResult(int totalUsers, Map<String, Long> domainCounts, double averageNameLength) {
        this.totalUsers = totalUsers;
        this.domainCounts = domainCounts;
        this.averageNameLength = averageNameLength;
    }
    
    public int getTotalUsers() { return totalUsers; }
    public Map<String, Long> getDomainCounts() { return domainCounts; }
    public double getAverageNameLength() { return averageNameLength; }
}