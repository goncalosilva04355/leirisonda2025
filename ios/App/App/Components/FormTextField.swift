import SwiftUI

struct FormTextField: View {
    let title: String
    let placeholder: String
    @Binding var text: String
    let isSecure: Bool
    let keyboardType: UIKeyboardType
    let isDisabled: Bool
    
    init(
        title: String,
        placeholder: String,
        text: Binding<String>,
        isSecure: Bool = false,
        keyboardType: UIKeyboardType = .default,
        isDisabled: Bool = false
    ) {
        self.title = title
        self.placeholder = placeholder
        self._text = text
        self.isSecure = isSecure
        self.keyboardType = keyboardType
        self.isDisabled = isDisabled
    }
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(title)
                .font(.subheadline)
                .fontWeight(.medium)
                .foregroundColor(.primary)
            
            Group {
                if isSecure {
                    SecureField(placeholder, text: $text)
                } else {
                    TextField(placeholder, text: $text)
                        .keyboardType(keyboardType)
                        .autocapitalization(keyboardType == .emailAddress ? .none : .sentences)
                }
            }
            .padding(.horizontal, 12)
            .padding(.vertical, 10)
            .background(Color(red: 0.95, green: 0.95, blue: 0.7))
            .overlay(
                RoundedRectangle(cornerRadius: 6)
                    .stroke(Color.gray.opacity(0.3), lineWidth: 1)
            )
            .disabled(isDisabled)
            .opacity(isDisabled ? 0.6 : 1.0)
        }
    }
}

#Preview {
    VStack(spacing: 20) {
        FormTextField(
            title: "Email",
            placeholder: "exemplo@email.com",
            text: .constant("gongonsilva@gmail.com"),
            keyboardType: .emailAddress
        )
        
        FormTextField(
            title: "Palavra-passe",
            placeholder: "Digite sua senha",
            text: .constant("password"),
            isSecure: true
        )
    }
    .padding()
}
