import SwiftUI

struct LoginView: View {
    @State private var email = ""
    @State private var password = ""
    @State private var rememberMe = false
    @State private var isLoading = false
    @State private var loginError = ""
    @State private var showEmergencyFix = false
    @State private var showAdminAccess = false
    
    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 20) {
                    // Logo Section
                    VStack {
                        AsyncImage(url: URL(string: "/leirisonda-logo.svg")) { image in
                            image
                                .resizable()
                                .aspectRatio(contentMode: .fit)
                        } placeholder: {
                            Rectangle()
                                .fill(Color.gray.opacity(0.3))
                                .overlay(
                                    Text("Leirisonda")
                                        .font(.headline)
                                        .foregroundColor(.gray)
                                )
                        }
                        .frame(maxHeight: 80)
                        .padding()
                        .background(Color.white)
                        .cornerRadius(12)
                        .shadow(color: .black.opacity(0.1), radius: 5, x: 0, y: 2)
                        .overlay(
                            RoundedRectangle(cornerRadius: 12)
                                .stroke(Color.gray.opacity(0.2), lineWidth: 1)
                        )
                    }
                    .padding(.horizontal)
                    .padding(.top, 20)
                    
                    // Admin Access and Emergency Fix Buttons
                    VStack(spacing: 12) {
                        Button(action: {
                            showAdminAccess = true
                        }) {
                            HStack(spacing: 8) {
                                Image(systemName: "gearshape")
                                    .font(.system(size: 16))
                                Text("Área de Administração")
                                    .font(.system(size: 14))
                            }
                            .foregroundColor(.gray)
                            .padding(.horizontal, 16)
                            .padding(.vertical, 10)
                            .background(Color.gray.opacity(0.05))
                            .overlay(
                                RoundedRectangle(cornerRadius: 8)
                                    .stroke(Color.gray.opacity(0.2), lineWidth: 1)
                            )
                            .cornerRadius(8)
                        }
                        
                        if showEmergencyFix {
                            Button(action: handleEmergencyFix) {
                                HStack(spacing: 8) {
                                    Image(systemName: "exclamationmark.triangle")
                                        .font(.system(size: 16))
                                    Text("⚡ Fix Firebase (📱)")
                                        .font(.system(size: 14))
                                }
                                .foregroundColor(.red)
                                .padding(.horizontal, 16)
                                .padding(.vertical, 10)
                                .background(Color.red.opacity(0.1))
                                .overlay(
                                    RoundedRectangle(cornerRadius: 8)
                                        .stroke(Color.red.opacity(0.3), lineWidth: 1)
                                )
                                .cornerRadius(8)
                            }
                        }
                    }
                    .padding(.horizontal)
                    
                    // Login Form
                    VStack(spacing: 16) {
                        VStack(alignment: .leading, spacing: 8) {
                            Text("Email")
                                .font(.system(size: 14, weight: .medium))
                                .foregroundColor(.primary)
                            
                            TextField("exemplo@email.com", text: $email)
                                .textFieldStyle(RoundedBorderTextFieldStyle())
                                .keyboardType(.emailAddress)
                                .autocapitalization(.none)
                                .disabled(isLoading)
                        }
                        
                        VStack(alignment: .leading, spacing: 8) {
                            Text("Palavra-passe")
                                .font(.system(size: 14, weight: .medium))
                                .foregroundColor(.primary)
                            
                            SecureField("Digite sua senha", text: $password)
                                .textFieldStyle(RoundedBorderTextFieldStyle())
                                .disabled(isLoading)
                        }
                        
                        // Remember Me Toggle
                        HStack {
                            Toggle("Lembrar-me (auto-login)", isOn: $rememberMe)
                                .font(.system(size: 14))
                                .disabled(isLoading)
                            Spacer()
                        }
                        
                        // Error Message
                        if !loginError.isEmpty {
                            VStack(alignment: .leading, spacing: 8) {
                                Text("Erro de Login:")
                                    .font(.system(size: 14, weight: .bold))
                                    .foregroundColor(.red)
                                
                                Text(loginError)
                                    .font(.system(size: 14))
                                    .foregroundColor(.red)
                                
                                // Mobile quick fix hint
                                if UIDevice.current.userInterfaceIdiom == .phone {
                                    VStack(alignment: .leading, spacing: 4) {
                                        Text("💡 Solução Rápida (Mobile):")
                                            .font(.system(size: 14, weight: .bold))
                                            .foregroundColor(.orange)
                                        
                                        Text("Tente usar password: 123")
                                            .font(.system(size: 14))
                                            .foregroundColor(.orange)
                                    }
                                    .padding(8)
                                    .background(Color.orange.opacity(0.1))
                                    .cornerRadius(6)
                                    .overlay(
                                        RoundedRectangle(cornerRadius: 6)
                                            .stroke(Color.orange.opacity(0.3), lineWidth: 1)
                                    )
                                }
                            }
                            .padding(12)
                            .background(Color.red.opacity(0.1))
                            .cornerRadius(8)
                            .overlay(
                                RoundedRectangle(cornerRadius: 8)
                                    .stroke(Color.red.opacity(0.3), lineWidth: 1)
                            )
                        }
                        
                        // Login Button
                        Button(action: handleLogin) {
                            Text(isLoading ? "A entrar..." : "Entrar")
                                .font(.system(size: 16, weight: .medium))
                                .foregroundColor(.white)
                                .frame(maxWidth: .infinity)
                                .padding(.vertical, 12)
                                .background(
                                    Color(red: 0.7, green: 0.85, blue: 1.0)
                                        .opacity(isLoading ? 0.5 : 1.0)
                                )
                                .cornerRadius(8)
                        }
                        .disabled(isLoading || email.isEmpty || password.isEmpty)
                    }
                    .padding(.horizontal)
                    .padding(.vertical, 20)
                    .background(Color.white)
                    .cornerRadius(12)
                    .shadow(color: .black.opacity(0.1), radius: 5, x: 0, y: 2)
                    .padding(.horizontal)
                }
            }
            .background(
                Color(red: 0.8, green: 0.9, blue: 1.0)
            )
            .navigationBarTitleDisplayMode(.large)
            .navigationTitle("Login")
        }
        .onAppear {
            checkForEmergencyIssues()
            loadSavedCredentials()
        }
        .alert("Administração", isPresented: $showAdminAccess) {
            Button("OK") { }
        } message: {
            Text("Área de administração será implementada em breve.")
        }
    }
    
    private func handleLogin() {
        guard !email.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty,
              !password.isEmpty else {
            loginError = "Por favor, preencha todos os campos."
            return
        }
        
        isLoading = true
        loginError = ""
        
        // Save credentials if remember me is checked
        if rememberMe {
            saveCredentials()
        } else {
            clearSavedCredentials()
        }
        
        // Simulate login process
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
            // Here you would implement your actual login logic
            // For demonstration, we'll simulate a successful login
            
            if password == "123" {
                // Successful login
                print("✅ Login bem-sucedido")
                isLoading = false
                // Navigate to main app or call completion handler
            } else {
                // Failed login
                loginError = "Credenciais inválidas. Tente novamente."
                isLoading = false
            }
        }
    }
    
    private func handleEmergencyFix() {
        // Clear Firebase protection flags
        UserDefaults.standard.removeObject(forKey: "firebase-quota-exceeded")
        UserDefaults.standard.removeObject(forKey: "firebase-quota-check-time")
        UserDefaults.standard.removeObject(forKey: "firebase-emergency-shutdown")
        UserDefaults.standard.removeObject(forKey: "firebase-circuit-breaker")
        
        showEmergencyFix = false
        
        // Show success alert
        let alert = UIAlertController(
            title: "✅ Fix Aplicado!",
            message: "Agora tente fazer login com password '123'",
            preferredStyle: .alert
        )
        alert.addAction(UIAlertAction(title: "OK", style: .default))
        
        if let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
           let window = windowScene.windows.first {
            window.rootViewController?.present(alert, animated: true)
        }
    }
    
    private func checkForEmergencyIssues() {
        // Detect if mobile device has conflicts
        let hasQuotaIssues = UserDefaults.standard.bool(forKey: "firebase-quota-exceeded")
        let hasEmergencyShutdown = UserDefaults.standard.bool(forKey: "firebase-emergency-shutdown")
        
        showEmergencyFix = hasQuotaIssues || hasEmergencyShutdown
    }
    
    private func loadSavedCredentials() {
        if let savedData = UserDefaults.standard.data(forKey: "savedLoginCredentials"),
           let credentials = try? JSONDecoder().decode(LoginCredentials.self, from: savedData) {
            
            if credentials.rememberMe {
                email = credentials.email
                password = credentials.password
                rememberMe = true
                
                // Auto-login if remember me is enabled
                DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
                    handleLogin()
                }
            }
        }
    }
    
    private func saveCredentials() {
        let credentials = LoginCredentials(
            email: email.trimmingCharacters(in: .whitespacesAndNewlines),
            password: password,
            rememberMe: true
        )
        
        if let encoded = try? JSONEncoder().encode(credentials) {
            UserDefaults.standard.set(encoded, forKey: "savedLoginCredentials")
        }
    }
    
    private func clearSavedCredentials() {
        UserDefaults.standard.removeObject(forKey: "savedLoginCredentials")
    }
}

struct LoginCredentials: Codable {
    let email: String
    let password: String
    let rememberMe: Bool
}

#Preview {
    LoginView()
}
