import SwiftUI

struct FirebaseConsoleView: View {
    @State private var selectedTab = "Dados"
    @State private var showEnterpriseBanner = true
    @State private var showMoreMenu = false
    
    let tabs = ["Dados", "Regras", "Índices", "Recuperar"]
    
    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 0) {
                    // URL Bar
                    urlBarSection
                    
                    // Project Header
                    projectHeaderSection
                    
                    // Navigation Tabs
                    navigationTabsSection
                    
                    // Enterprise Banner
                    if showEnterpriseBanner {
                        enterpriseBannerSection
                    }
                    
                    // Action Buttons
                    actionButtonsSection
                    
                    // Main Content Area
                    mainContentSection
                    
                    // Google Cloud Section
                    googleCloudSection
                    
                    // Project Section
                    projectSection
                    
                    Spacer(minLength: 50)
                }
            }
            .background(Color.black)
            .foregroundStyle(.white)
        }
        .navigationBarTitleDisplayMode(.large)
        .preferredColorScheme(.dark)
    }
    
    private var urlBarSection: some View {
        HStack {
            Image(systemName: "camera.viewfinder")
                .foregroundStyle(.gray)
                .font(.title2)
            
            HStack {
                Text("console.firebase.google.com")
                    .foregroundStyle(.white)
                    .font(.system(size: 16, weight: .medium))
                Spacer()
            }
            .padding(.horizontal, 12)
            .padding(.vertical, 8)
            .background(.gray.opacity(0.3))
            .clipShape(RoundedRectangle(cornerRadius: 8))
            
            Image(systemName: "square.and.arrow.up")
                .foregroundStyle(.gray)
                .font(.title2)
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 8)
        .background(Color.gray.opacity(0.2))
    }
    
    private var projectHeaderSection: some View {
        HStack(spacing: 16) {
            // Project Dropdown
            HStack {
                Text("leiria25")
                    .font(.system(size: 16, weight: .medium))
                Image(systemName: "chevron.down")
                    .font(.caption)
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 8)
            .background(.gray.opacity(0.3))
            .clipShape(RoundedRectangle(cornerRadius: 20))
            
            // Firebase Logo with Gradient Border
            ZStack {
                RoundedRectangle(cornerRadius: 25)
                    .stroke(
                        LinearGradient(
                            colors: [.blue, .purple, .red],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        ),
                        lineWidth: 2
                    )
                    .frame(width: 50, height: 50)
                
                Image(systemName: "sparkles")
                    .font(.title2)
                    .foregroundStyle(.white)
            }
            
            Spacer()
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 12)
    }
    
    private var navigationTabsSection: some View {
        HStack {
            Button(action: {}) {
                Image(systemName: "chevron.left")
                    .foregroundStyle(.gray)
            }
            
            HStack(spacing: 0) {
                ForEach(tabs, id: \.self) { tab in
                    VStack(spacing: 8) {
                        Text(tab)
                            .font(.system(size: 16, weight: .medium))
                            .foregroundStyle(selectedTab == tab ? .blue : .gray)
                        
                        Rectangle()
                            .fill(selectedTab == tab ? .blue : .clear)
                            .frame(height: 2)
                    }
                    .frame(maxWidth: .infinity)
                    .onTapGesture {
                        selectedTab = tab
                    }
                }
            }
            
            Button(action: {}) {
                Image(systemName: "chevron.right")
                    .foregroundStyle(.gray)
            }
        }
        .padding(.horizontal, 16)
        .padding(.bottom, 8)
    }
    
    private var enterpriseBannerSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack(alignment: .top, spacing: 12) {
                Image(systemName: "cloud.fill")
                    .font(.title2)
                    .foregroundStyle(.orange)
                
                VStack(alignment: .leading, spacing: 4) {
                    Text("Conheça a edição Enterprise do Firestore, que tem compatibilidade com o MongoDB. Crie um banco de dados do Firestore Enterprise no console do Google Cloud.")
                        .font(.system(size: 14))
                        .foregroundStyle(.white)
                        .multilineTextAlignment(.leading)
                }
                
                Spacer()
            }
            
            HStack {
                Button("Saiba mais") {
                    // Action
                }
                .font(.system(size: 14, weight: .medium))
                .foregroundStyle(.blue)
                
                Spacer()
                
                Button("Dispensar") {
                    showEnterpriseBanner = false
                }
                .font(.system(size: 14, weight: .medium))
                .foregroundStyle(.gray)
            }
        }
        .padding(16)
        .background(.gray.opacity(0.1))
        .clipShape(RoundedRectangle(cornerRadius: 8))
        .padding(.horizontal, 16)
        .padding(.vertical, 8)
    }
    
    private var actionButtonsSection: some View {
        HStack(spacing: 12) {
            Button("Visualização do painel") {
                // Action
            }
            .font(.system(size: 14, weight: .medium))
            .foregroundStyle(.white)
            .padding(.horizontal, 16)
            .padding(.vertical, 8)
            .background(.blue.opacity(0.8))
            .clipShape(RoundedRectangle(cornerRadius: 6))
            
            Button("Criador de consultas") {
                // Action
            }
            .font(.system(size: 14, weight: .medium))
            .foregroundStyle(.white)
            .padding(.horizontal, 16)
            .padding(.vertical, 8)
            .background(.gray.opacity(0.3))
            .clipShape(RoundedRectangle(cornerRadius: 6))
            
            Spacer()
            
            Button(action: {
                showMoreMenu.toggle()
            }) {
                Image(systemName: "ellipsis")
                    .foregroundStyle(.white)
                    .padding(8)
            }
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 8)
    }
    
    private var mainContentSection: some View {
        VStack(spacing: 12) {
            Rectangle()
                .fill(.gray.opacity(0.2))
                .frame(height: 80)
                .clipShape(RoundedRectangle(cornerRadius: 8))
                .overlay(
                    HStack {
                        Image(systemName: "house")
                            .font(.title2)
                            .foregroundStyle(.gray)
                        
                        Spacer()
                        
                        Image(systemName: "pencil")
                            .font(.title2)
                            .foregroundStyle(.gray)
                    }
                    .padding(.horizontal, 16)
                )
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 8)
    }
    
    private var googleCloudSection: some View {
        VStack(spacing: 0) {
            HStack {
                Image(systemName: "cloud")
                    .foregroundStyle(.blue)
                Text("Mais no Google Cloud")
                    .font(.system(size: 16, weight: .medium))
                    .foregroundStyle(.blue)
                Spacer()
                Image(systemName: "chevron.down")
                    .foregroundStyle(.blue)
                    .font(.caption)
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 12)
            .background(.gray.opacity(0.1))
            .clipShape(RoundedRectangle(cornerRadius: 8))
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 8)
    }
    
    private var projectSection: some View {
        VStack(spacing: 0) {
            HStack {
                Image(systemName: "wifi")
                    .foregroundStyle(.gray)
                Text("leiria25")
                    .font(.system(size: 16, weight: .medium))
                    .foregroundStyle(.white)
                Spacer()
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 12)
            .background(.gray.opacity(0.1))
            
            HStack {
                Image(systemName: "plus")
                    .foregroundStyle(.blue)
                    .font(.system(size: 14))
                Text("Iniciar coleção")
                    .font(.system(size: 16, weight: .medium))
                    .foregroundStyle(.blue)
                Spacer()
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 12)
            .background(.gray.opacity(0.05))
        }
        .clipShape(RoundedRectangle(cornerRadius: 8))
        .padding(.horizontal, 16)
        .padding(.vertical, 8)
    }
}

#Preview {
    FirebaseConsoleView()
}
