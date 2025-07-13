import SwiftUI

struct LoginView: View {
    @State private var email = ""
    @State private var password = ""
    @State private var rememberMe = false
    @State private var showError = true
    @State private var isLoading = false
    
    var body: some View {
        NavigationStack {
            ZStack {
                // Blue background
                Color(red: 59/255, green: 130/255, blue: 246/255)
                    .ignoresSafeArea()
                
                VStack(spacing: 0) {
                    // Top blue section
                    Rectangle()
                        .fill(Color(red: 59/255, green: 130/255, blue: 246/255))
                        .frame(height: 150)
                    
                    // Main content area
                    VStack(spacing: 0) {
                        // Logo section
                        VStack {
                            AsyncImage(url: URL(string: "https://cdn.builder.io/api/v1/image/assets%2Fcc309d103d0b4ade88d90ee94cb2f741%2F6c79d54ab5014a40bfea00560b92828d?format=webp&width=800")) { image in
                                image
                                    .resizable()
                                    .aspectRatio(contentMode: .fit)
                            } placeholder: {
                                RoundedRectangle(cornerRadius: 12)
                                    .fill(Color.gray.opacity(0.2))
                                    .frame(height: 80)
                            }
                            .frame(height: 80)
                            .padding(.horizontal, 40)
                            .padding(.top, 40)
                            .padding(.bottom, 30)
                        }
                        .background(Color.white)
                        .cornerRadius(16, corners: [.topLeft, .topRight])
                        
                        // Login form
                        VStack(spacing: 20) {
                            // Email field
                            VStack(alignment: .leading, spacing: 8) {
                                Text("Email")
                                    .font(.system(size: 16, weight: .medium))
                                    .foregroundColor(.black)
                                
                                TextField("exemplo@email.com", text: $email)
                                    .textFieldStyle(CustomTextFieldStyle(backgroundColor: Color(red: 240/255, green: 253/255, blue: 165/255)))
                                    .keyboardType(.emailAddress)
                                    .autocapitalization(.none)
                            }
                            
                            // Password field
                            VStack(alignment: .leading, spacing: 8) {
                                Text("Palavra-passe")
                                    .font(.system(size: 16, weight: .medium))
                                    .foregroundColor(.black)
                                
                                SecureField("Digite sua senha", text: $password)
                                    .textFieldStyle(CustomTextFieldStyle(backgroundColor: Color(red: 240/255, green: 253/255, blue: 165/255)))
                            }
                            
                            // Remember me checkbox
                            HStack {
                                Button(action: {
                                    rememberMe.toggle()
                                }) {
                                    HStack(spacing: 8) {
                                        Image(systemName: rememberMe ? "checkmark.square.fill" : "square")
                                            .foregroundColor(rememberMe ? .blue : .gray)
                                            .font(.system(size: 20))
                                        
                                        Text("Lembrar-me (auto-login)")
                                            .font(.system(size: 16))
                                            .foregroundColor(.black)
                                    }
                                }
                                .buttonStyle(PlainButtonStyle())
                                
                                Spacer()
                            }
                            
                            // Error message
                            if showError {
                                VStack(spacing: 8) {
                                    Text("Erro de Login:")
                                        .font(.system(size: 16, weight: .semibold))
                                        .foregroundColor(.red)
                                    
                                    Text("Firebase: Firebase App named '[DEFAULT]' already deleted (app/app-deleted).")
                                        .font(.system(size: 14))
                                        .foregroundColor(.red)
                                        .multilineTextAlignment(.center)
                                }
                                .padding(16)
                                .background(Color(red: 254/255, green: 226/255, blue: 226/255))
                                .cornerRadius(8)
                                .overlay(
                                    RoundedRectangle(cornerRadius: 8)
                                        .stroke(Color.red.opacity(0.3), lineWidth: 1)
                                )
                            }
                            
                            // Login button
                            Button(action: {
                                handleLogin()
                            }) {
                                HStack {
                                    if isLoading {
                                        ProgressView()
                                            .progressViewStyle(CircularProgressViewStyle(tint: .white))
                                            .scaleEffect(0.8)
                                    }
                                    
                                    Text("Entrar")
                                        .font(.system(size: 18, weight: .semibold))
                                        .foregroundColor(.white)
                                }
                                .frame(maxWidth: .infinity)
                                .frame(height: 54)
                                .background(Color(red: 59/255, green: 130/255, blue: 246/255))
                                .cornerRadius(8)
                            }
                            .disabled(isLoading)
                            .opacity(isLoading ? 0.7 : 1.0)
                            
                            Spacer()
                        }
                        .padding(.horizontal, 24)
                        .padding(.top, 0)
                        .background(Color.white)
                    }
                }
            }
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button(action: {
                        // Admin action
                    }) {
                        Image(systemName: "gearshape")
                            .foregroundColor(.white)
                            .font(.system(size: 20))
                    }
                }
            }
        }
    }
    
    private func handleLogin() {
        isLoading = true
        
        // Simulate login process
        DispatchQueue.main.asyncAfter(deadline: .now() + 2) {
            isLoading = false
            // Handle login logic here
        }
    }
}

struct CustomTextFieldStyle: TextFieldStyle {
    let backgroundColor: Color
    
    func _body(configuration: TextField<Self._Label>) -> some View {
        configuration
            .padding(16)
            .background(backgroundColor)
            .cornerRadius(8)
            .font(.system(size: 16))
    }
}

extension View {
    func cornerRadius(_ radius: CGFloat, corners: UIRectCorner) -> some View {
        clipShape(RoundedCorner(radius: radius, corners: corners))
    }
}

struct RoundedCorner: Shape {
    var radius: CGFloat = .infinity
    var corners: UIRectCorner = .allCorners

    func path(in rect: CGRect) -> Path {
        let path = UIBezierPath(
            roundedRect: rect,
            byRoundingCorners: corners,
            cornerRadii: CGSize(width: radius, height: radius)
        )
        return Path(path.cgPath)
    }
}

#Preview {
    LoginView()
}
