package com.careconnect.config;

import com.careconnect.security.CustomUserDetailsService;
import com.careconnect.security.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.Arrays;
import java.util.Collections;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final CustomUserDetailsService userDetailsService;

    @Value("${frontend.url:http://localhost:3000}")
    private String frontendUrl;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthFilter, CustomUserDetailsService userDetailsService) {
        this.jwtAuthFilter = jwtAuthFilter;
        this.userDetailsService = userDetailsService;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(AbstractHttpConfigurer::disable)
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/uploads/**").permitAll()
                .requestMatchers("/api/upload").permitAll()
                
                // Public GET endpoints for requests and events
                .requestMatchers(HttpMethod.GET, "/api/requests/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/events/**").permitAll()
                
                // Protected requests management (NGO only)
                .requestMatchers(HttpMethod.POST, "/api/requests").hasRole("NGO")
                .requestMatchers(HttpMethod.PUT, "/api/requests/**").hasRole("NGO")
                .requestMatchers(HttpMethod.DELETE, "/api/requests/**").hasRole("NGO")
                
                // Protected events management (NGO or Volunteer)
                .requestMatchers(HttpMethod.POST, "/api/events").hasAnyRole("NGO", "Volunteer")
                .requestMatchers(HttpMethod.PUT, "/api/events/**").hasAnyRole("NGO", "Volunteer")
                .requestMatchers(HttpMethod.DELETE, "/api/events/**").hasAnyRole("NGO", "Volunteer")
                .requestMatchers(HttpMethod.GET, "/api/events/*/participants").hasAnyRole("NGO", "Volunteer")
                
                // Joining/leaving events (Volunteer only)
                .requestMatchers(HttpMethod.POST, "/api/events/*/join").hasRole("Volunteer")
                .requestMatchers(HttpMethod.DELETE, "/api/events/*/leave").hasRole("Volunteer")
                
                // Donations management
                .requestMatchers(HttpMethod.POST, "/api/donations").hasRole("Volunteer")
                .requestMatchers(HttpMethod.PUT, "/api/donations/*/status").hasRole("NGO")
                .requestMatchers(HttpMethod.GET, "/api/donations/**").hasAnyRole("NGO", "Volunteer")
                
                // Users
                .requestMatchers(HttpMethod.GET, "/api/users/**").hasAnyRole("NGO", "Volunteer")
                
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList(frontendUrl, "http://localhost:3000", "http://localhost:5173"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Accept"));
        configuration.setExposedHeaders(Collections.singletonList("Authorization"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
