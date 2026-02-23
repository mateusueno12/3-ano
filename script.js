// Array para armazenar os contatos
let contacts = [];
let editingId = null;

// Elementos do DOM
const contactForm = document.getElementById('contactForm');
const contactsList = document.getElementById('contactsList');
const totalCount = document.getElementById('totalCount');
const filterInput = document.getElementById('filter');

// Carregar contatos do localStorage ao iniciar
document.addEventListener('DOMContentLoaded', () => {
    const savedContacts = localStorage.getItem('contacts');
    if (savedContacts) {
        contacts = JSON.parse(savedContacts);
        updateContactsTable();
    }
});

// Evento de filtro
filterInput.addEventListener('input', () => {
    updateContactsTable();
});

// Evento de submit do formulário
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    
    if (editingId !== null) {
        // Editar contato existente
        const index = contacts.findIndex(c => c.id === editingId);
        if (index !== -1) {
            contacts[index] = { ...contacts[index], name, email, phone };
        }
        editingId = null;
        document.querySelector('button[type="submit"]').textContent = 'Cadastrar';
    } else {
        // Adicionar novo contato
        const newContact = {
            id: Date.now(),
            name,
            email,
            phone
        };
        contacts.push(newContact);
    }
    
    // Salvar no localStorage
    localStorage.setItem('contacts', JSON.stringify(contacts));
    
    // Atualizar tabela
    updateContactsTable();
    
    // Limpar formulário
    contactForm.reset();
});

// Função para atualizar a tabela de contatos
function updateContactsTable() {
    const filterText = filterInput.value.toLowerCase();
    
    // Filtrar contatos
    const filteredContacts = contacts.filter(contact => 
        contact.name.toLowerCase().includes(filterText)
    );
    
    // Atualizar total de contatos
    totalCount.textContent = filteredContacts.length;
    
    // Renderizar tabela
    if (filteredContacts.length === 0) {
        contactsList.innerHTML = '<tr><td colspan="4" style="text-align: center;">Nenhum contato encontrado</td></tr>';
    } else {
        contactsList.innerHTML = filteredContacts.map(contact => `
            <tr>
                <td>${contact.name}</td>
                <td>${contact.email}</td>
                <td>${contact.phone}</td>
                <td>
                    <button class="action-btn btn-edit" onclick="editContact(${contact.id})">Editar</button>
                    <button class="action-btn btn-delete" onclick="deleteContact(${contact.id})">Excluir</button>
                </td>
            </tr>
        `).join('');
    }
}

// Função para editar contato
function editContact(id) {
    const contact = contacts.find(c => c.id === id);
    if (contact) {
        document.getElementById('name').value = contact.name;
        document.getElementById('email').value = contact.email;
        document.getElementById('phone').value = contact.phone;
        editingId = id;
        document.querySelector('button[type="submit"]').textContent = 'Atualizar';
    }
}

// Função para excluir contato
function deleteContact(id) {
    if (confirm('Tem certeza que deseja excluir este contato?')) {
        contacts = contacts.filter(contact => contact.id !== id);
        localStorage.setItem('contacts', JSON.stringify(contacts));
        updateContactsTable();
        
        // Se estava editando este contato, limpar formulário
        if (editingId === id) {
            editingId = null;
            contactForm.reset();
            document.querySelector('button[type="submit"]').textContent = 'Cadastrar';
        }
    }
}

// Tornar funções globais para acesso pelos botões
window.editContact = editContact;
window.deleteContact = deleteContact;
