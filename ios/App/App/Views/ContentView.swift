import SwiftUI

struct ContentView: View {
    @State private var isLoggedIn = false
    @State private var currentUser: User? = nil
    
    var body: some View {
        Group {
            if isLoggedIn {
                MainAppView(user: currentUser)
            } else {
                LoginView()
            }
        }
        .onAppear {
            checkAuthState()
        }
    }
    
    private func checkAuthState() {
        // Check if user is already authenticated
        // This would integrate with your Firebase auth state
        isLoggedIn = false
    }
}

struct User: Identifiable {
    let id = UUID()
    let email: String
    let name: String?
}

struct MainAppView: View {
    let user: User?
    
    var body: some View {
        NavigationStack {
            VStack {
                Text("Welcome to Leirisonda!")
                    .font(.title)
                    .padding()
                
                if let user = user {
                    Text("Logged in as: \(user.email)")
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                }
                
                Spacer()
            }
            .navigationTitle("Dashboard")
            .navigationBarTitleDisplayMode(.large)
        }
    }
}

#Preview {
    ContentView()
}
