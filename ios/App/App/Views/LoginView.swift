import SwiftUI

struct LoginView: View {
    @State private var email: String = "gongonsilva@gmail.com"
    @State private var password: String = "••••••••"
    @State private var rememberMe: Bool = true
    @State private var loginError: String? = nil
    @State private var isLoading: Bool = false

    let onLoginSuccess: () -> Void
    
    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 0) {
                    // Top blue background
                    Rectangle()
                        .fill(Color.blue)
                        .frame(height: 120)
                        .ignoresSafeArea(edges: .top)
                    
                    // Main content
                    VStack(spacing: 32) {
                        // Logo section
                        VStack {
                            RoundedRectangle(cornerRadius: 12)
                                .fill(Color.white)
                                .frame(width: 140, height: 80)
                                .shadow(color: .black.opacity(0.1), radius: 4, x: 0, y: 2)
                                .overlay(
                                    AsyncImage(url: URL(string: "https://cdn.builder.io/api/v1/image/assets%2Fcc309d103d0b4ade88d90ee94cb2f741%2F6c79d54ab5014a40bfea00560b92828d?format=webp&width=800")) { image in
                                        image
                                            .resizable()
                                            .aspectRatio(contentMode: .fit)
                                    } placeholder: {
                                        Text("Leirisonda")
                                            .font(.caption)
                                            .foregroundColor(.gray)
                                    }
                                    .padding(8)
                                )
                        }
                        .padding(.top, -60)
                        
                        // Login form
                        VStack(spacing: 20) {
                            // Email field
                            FormTextField(
                                title: "Email",
                                placeholder: "exemplo@email.com",
                                text: $email,
                                keyboardType: .emailAddress,
                                isDisabled: isLoading
                            )
                            
                            // Password field
                            FormTextField(
                                title: "Palavra-passe",
                                placeholder: "Digite sua senha",
                                text: $password,
                                isSecure: true,
                                isDisabled: isLoading
                            )
                            
                            // Remember me checkbox
                            HStack {
                                Button(action: {
                                    rememberMe.toggle()
                                }) {
                                    HStack(spacing: 8) {
                                        Image(systemName: rememberMe ? "checkmark.square.fill" : "square")
                                            .foregroundColor(rememberMe ? .blue : .gray)
                                        Text("Lembrar-me (auto-login)")
                                            .font(.subheadline)
                                            .foregroundColor(.primary)
                                    }
                                }
                                .disabled(isLoading)
                                
                                Spacer()
                            }
                            
                            // Error message
                            if let error = loginError {
                                VStack(spacing: 8) {
                                    Text("Erro de Login:")
                                        .font(.subheadline)
                                        .fontWeight(.bold)
                                        .foregroundColor(.red)
                                    
                                    Text(error)
                                        .font(.caption)
                                        .foregroundColor(.red)
                                        .multilineTextAlignment(.center)
                                }
                                .padding()
                                .background(Color.red.opacity(0.1))
                                .overlay(
                                    RoundedRectangle(cornerRadius: 8)
                                        .stroke(Color.red.opacity(0.3), lineWidth: 1)
                                )
                            }
                            
                            // Login button
                            Button(action: handleLogin) {
                                Text(isLoading ? "A entrar..." : "Entrar")
                                    .font(.headline)
                                    .foregroundColor(.white)
                                    .frame(maxWidth: .infinity)
                                    .padding(.vertical, 12)
                                    .background(Color.blue)
                                    .cornerRadius(8)
                            }
                            .disabled(isLoading || email.isEmpty || password.isEmpty)
                            .opacity(isLoading || email.isEmpty || password.isEmpty ? 0.6 : 1.0)
                        }
                        .padding(.horizontal, 24)
                        
                        Spacer()
                    }
                    .frame(maxWidth: .infinity)
                    .background(Color(UIColor.systemBackground))
                    
                    // Bottom blue background
                    Rectangle()
                        .fill(Color.blue)
                        .frame(height: 200)
                        .ignoresSafeArea(edges: .bottom)
                }
            }
            .background(Color.blue)
            .navigationBarHidden(true)
        }
        .onAppear {
            loadSavedCredentials()
        }
    }
    
    private func handleLogin() {
        guard !email.isEmpty, !password.isEmpty else { return }
        
        isLoading = true
        loginError = nil
        
        // Save credentials if remember me is checked
        if rememberMe {
            saveCredentials()
        } else {
            clearSavedCredentials()
        }
        
        // Simulate login attempt
        Task {
            do {
                // Replace with actual authentication logic
                try await performLogin(email: email, password: password)
                                await MainActor.run {
                    isLoading = false
                    // Handle successful login
                    onLoginSuccess()
                }
            } catch {
                await MainActor.run {
                    isLoading = false
                    loginError = error.localizedDescription
                }
            }
        }
    }
    
    private func loadSavedCredentials() {
        if let data = UserDefaults.standard.data(forKey: "savedLoginCredentials"),
           let credentials = try? JSONDecoder().decode(SavedCredentials.self, from: data),
           credentials.rememberMe {
            email = credentials.email
            password = credentials.password
            rememberMe = true
        }
    }
    
    private func saveCredentials() {
        let credentials = SavedCredentials(email: email, password: password, rememberMe: true)
        if let data = try? JSONEncoder().encode(credentials) {
            UserDefaults.standard.set(data, forKey: "savedLoginCredentials")
        }
    }
    
    private func clearSavedCredentials() {
        UserDefaults.standard.removeObject(forKey: "savedLoginCredentials")
    }
    
    private func performLogin(email: String, password: String) async throws {
        // Simulate network delay
        try await Task.sleep(nanoseconds: 2_000_000_000)
        
        // For demo purposes - replace with actual authentication
        if email.isEmpty || password.isEmpty {
            throw LoginError.invalidCredentials
        }
        
                // Login successful - no error thrown
        print("Login successful for \(email)")
    }
}

struct SavedCredentials: Codable {
    let email: String
    let password: String
    let rememberMe: Bool
}

enum LoginError: LocalizedError {
    case invalidCredentials
    case firebaseError(String)
    
    var errorDescription: String? {
        switch self {
        case .invalidCredentials:
            return "Credenciais inválidas"
        case .firebaseError(let message):
            return "Firebase: \(message)"
        }
    }
}

#Preview {
    LoginView()
}
