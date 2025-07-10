import SwiftUI

enum UserRole: String, CaseIterable {
    case superAdmin = "Super Admin"
    case tecnico = "Técnico"
    case admin = "Admin"
    
    var displayName: String {
        return self.rawValue
    }
}

struct User: Identifiable {
    let id = UUID()
    let email: String
    let name: String
    var role: UserRole
}

struct UserManagementView: View {
    @State private var users: [User] = [
        User(email: "gongonsilva@gmail.com", name: "Gonçalo Fonseca", role: .superAdmin),
        User(email: "alexandre@leirisonda.pt", name: "Alexandre Fernandes", role: .tecnico)
    ]
    
    @State private var showingAddUser = false
    @Environment(\.dismiss) private var dismiss
    
    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 24) {
                    headerSection
                    
                    authorizedUsersSection
                }
                .padding(.horizontal, 16)
                .padding(.top, 8)
            }
            .navigationTitle("Área de Administração")
            .navigationBarTitleDisplayMode(.large)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Sair da Administração") {
                        dismiss()
                    }
                    .foregroundColor(.blue)
                    .font(.system(size: 14))
                }
            }
        }
        .sheet(isPresented: $showingAddUser) {
            AddUserView { newUser in
                users.append(newUser)
            }
        }
    }
    
    private var headerSection: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("Gestão de Utilizadores")
                .font(.system(size: 32, weight: .bold))
                .foregroundColor(.primary)
            
            Text("Gerir utilizadores autorizados e suas permissões")
                .font(.system(size: 16))
                .foregroundColor(.secondary)
            
            HStack {
                Spacer()
                
                Button(action: {
                    showingAddUser = true
                }) {
                    HStack(spacing: 8) {
                        Image(systemName: "plus")
                            .font(.system(size: 16, weight: .medium))
                        Text("Adicionar Utilizador")
                            .font(.system(size: 16, weight: .medium))
                    }
                    .foregroundColor(.white)
                    .padding(.horizontal, 20)
                    .padding(.vertical, 12)
                    .background(Color.blue)
                    .cornerRadius(8)
                }
            }
        }
    }
    
    private var authorizedUsersSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Utilizadores Autorizados (\(users.count))")
                .font(.system(size: 18, weight: .semibold))
                .foregroundColor(.primary)
            
            VStack(spacing: 0) {
                ForEach(Array(users.enumerated()), id: \.element.id) { index, user in
                    UserRowView(
                        user: user,
                        onRoleChange: { newRole in
                            users[index].role = newRole
                        },
                        onDelete: {
                            if let userIndex = users.firstIndex(where: { $0.id == user.id }) {
                                users.remove(at: userIndex)
                            }
                        }
                    )
                    
                    if index < users.count - 1 {
                        Divider()
                            .padding(.leading, 16)
                    }
                }
            }
            .background(Color(.systemBackground))
            .cornerRadius(12)
            .overlay(
                RoundedRectangle(cornerRadius: 12)
                    .stroke(Color(.systemGray5), lineWidth: 1)
            )
        }
    }
}

struct UserRowView: View {
    let user: User
    let onRoleChange: (UserRole) -> Void
    let onDelete: () -> Void
    
    @State private var showingRoleOptions = false
    
    var body: some View {
        VStack(spacing: 12) {
            HStack(spacing: 12) {
                Image(systemName: "envelope")
                    .foregroundColor(.gray)
                    .font(.system(size: 16))
                
                VStack(alignment: .leading, spacing: 4) {
                    Text(user.email)
                        .font(.system(size: 16))
                        .foregroundColor(.primary)
                    
                    HStack {
                        Image(systemName: "person")
                            .foregroundColor(.gray)
                            .font(.system(size: 14))
                        
                        Text(user.name)
                            .font(.system(size: 14))
                            .foregroundColor(.secondary)
                    }
                    
                    if user.role == .superAdmin {
                        HStack(spacing: 4) {
                            Image(systemName: "shield.fill")
                                .foregroundColor(.red)
                                .font(.system(size: 12))
                            
                            Text(user.role.displayName)
                                .font(.system(size: 14, weight: .medium))
                                .foregroundColor(.red)
                        }
                    }
                }
                
                Spacer()
                
                HStack(spacing: 16) {
                    Button(action: {
                        // Edit action
                    }) {
                        Image(systemName: "pencil")
                            .foregroundColor(.blue)
                            .font(.system(size: 16))
                    }
                    
                    if user.role != .superAdmin {
                        Button(action: onDelete) {
                            Image(systemName: "trash")
                                .foregroundColor(.red)
                                .font(.system(size: 16))
                        }
                    }
                }
            }
            
            if user.role != .superAdmin {
                HStack {
                    Menu {
                        ForEach(UserRole.allCases.filter { $0 != .superAdmin }, id: \.self) { role in
                            Button(role.displayName) {
                                onRoleChange(role)
                            }
                        }
                    } label: {
                        HStack {
                            Text(user.role.displayName)
                                .font(.system(size: 16))
                                .foregroundColor(.primary)
                            
                            Spacer()
                            
                            Image(systemName: "chevron.down")
                                .foregroundColor(.gray)
                                .font(.system(size: 12))
                        }
                        .padding(.horizontal, 16)
                        .padding(.vertical, 12)
                        .background(Color(.systemGray6))
                        .cornerRadius(8)
                    }
                    
                    Button(action: {
                        // Copy action
                    }) {
                        Image(systemName: "doc.on.doc")
                            .foregroundColor(.green)
                            .font(.system(size: 16))
                            .padding(8)
                            .background(Color(.systemGray6))
                            .cornerRadius(6)
                    }
                    
                    Button(action: onDelete) {
                        Image(systemName: "xmark")
                            .foregroundColor(.red)
                            .font(.system(size: 16))
                            .padding(8)
                            .background(Color(.systemGray6))
                            .cornerRadius(6)
                    }
                }
            }
        }
        .padding(16)
    }
}

struct AddUserView: View {
    @Environment(\.dismiss) private var dismiss
    let onAddUser: (User) -> Void
    
    @State private var email = ""
    @State private var name = ""
    @State private var selectedRole = UserRole.tecnico
    
    var body: some View {
        NavigationStack {
            Form {
                Section("Informações do Utilizador") {
                    TextField("Email", text: $email)
                        .keyboardType(.emailAddress)
                        .autocapitalization(.none)
                    
                    TextField("Nome", text: $name)
                }
                
                Section("Permissões") {
                    Picker("Função", selection: $selectedRole) {
                        ForEach(UserRole.allCases.filter { $0 != .superAdmin }, id: \.self) { role in
                            Text(role.displayName).tag(role)
                        }
                    }
                }
            }
            .navigationTitle("Adicionar Utilizador")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Cancelar") {
                        dismiss()
                    }
                }
                
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Adicionar") {
                        let newUser = User(email: email, name: name, role: selectedRole)
                        onAddUser(newUser)
                        dismiss()
                    }
                    .disabled(email.isEmpty || name.isEmpty)
                }
            }
        }
    }
}

#Preview {
    UserManagementView()
}
