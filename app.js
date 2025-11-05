// ==========================================
// AQUAFARM MANAGER - JAVASCRIPT APPLICATION
// ==========================================

// ==========================================
// AUTHENTICATION & USER MANAGEMENT
// ==========================================
let currentUser = null;
let rememberUser = false;

let usuarios = [
  {
    id: 1,
    nombre: 'Administrador',
    email: 'admin@granja.com',
    password: 'admin123',
    rol: 'admin',
    estado: 'activo',
    ultimo_acceso: null,
    fecha_creacion: '2025-01-01'
  },
  {
    id: 2,
    nombre: 'Operador Principal',
    email: 'operador@granja.com',
    password: 'operador123',
    rol: 'operador',
    estado: 'activo',
    ultimo_acceso: null,
    fecha_creacion: '2025-01-01'
  },
  {
    id: 3,
    nombre: 'Vendedor',
    email: 'vendedor@granja.com',
    password: 'vendedor123',
    rol: 'vendedor',
    estado: 'activo',
    ultimo_acceso: null,
    fecha_creacion: '2025-01-01'
  },
  {
    id: 4,
    nombre: 'Visor',
    email: 'visor@granja.com',
    password: 'visor123',
    rol: 'visor',
    estado: 'activo',
    ultimo_acceso: null,
    fecha_creacion: '2025-01-01'
  }
];

let nextUserId = 5;

const permisos = {
  admin: {
    ver_dashboard: true,
    gestionar_colaboradores: true,
    ingresar_datos: true,
    editar_datos: true,
    editar_datos_otros: true,
    ver_reportes: true,
    ver_datos_otros: true,
    exportar_datos: true,
    reset_datos: true
  },
  operador: {
    ver_dashboard: true,
    gestionar_colaboradores: false,
    ingresar_datos: true,
    editar_datos: true,
    editar_datos_otros: false,
    ver_reportes: true,
    ver_datos_otros: false,
    exportar_datos: false,
    reset_datos: false
  },
  vendedor: {
    ver_dashboard: true,
    gestionar_colaboradores: false,
    ingresar_datos: true,
    editar_datos: true,
    editar_datos_otros: false,
    ver_reportes: true,
    ver_datos_otros: false,
    exportar_datos: false,
    reset_datos: false
  },
  visor: {
    ver_dashboard: true,
    gestionar_colaboradores: false,
    ingresar_datos: false,
    editar_datos: false,
    editar_datos_otros: false,
    ver_reportes: true,
    ver_datos_otros: true,
    exportar_datos: false,
    reset_datos: false
  }
};

// ==========================================
// DATA STORAGE (In-Memory)
// ==========================================
let appData = {
  clientes: [
    { 
      id: 1, 
      nombre: 'Mercado Local', 
      telefono: '+52 55 1234 5678', 
      email: 'mercado@local.com', 
      direccion: 'Calle Principal 123', 
      tipo: 'mayorista', 
      fecha_registro: '2024-10-01',
      ultima_compra: '2025-11-03'
    }
  ],
  ventas: [
    {
      id: 1,
      factura_numero: 1001,
      fecha: '2025-11-03',
      cliente_id: 1,
      estanque_id: 1,
      cantidad_kg: 50,
      precio_unitario: 35,
      descuento_pct: 0,
      subtotal: 1750,
      iva: 280,
      total: 2030,
      metodo_pago: 'Efectivo',
      estado_pago: 'pagado',
      fecha_vencimiento: null,
      fecha_pago: '2025-11-03',
      costo_produccion: 750,
      ganancia_neta: 1000,
      margen_pct: 57.1,
      observaciones: '',
      registrado_por: 'admin',
      autor_id: 1
    },
    {
      id: 2,
      factura_numero: 1002,
      fecha: '2025-11-04',
      cliente_id: 1,
      estanque_id: 2,
      cantidad_kg: 75,
      precio_unitario: 38,
      descuento_pct: 5,
      subtotal: 2707.5,
      iva: 433.2,
      total: 3140.7,
      metodo_pago: 'Crédito',
      estado_pago: 'pendiente',
      fecha_vencimiento: '2025-11-19',
      fecha_pago: null,
      costo_produccion: 1125,
      ganancia_neta: 1582.5,
      margen_pct: 58.4,
      observaciones: 'Pago a 15 días',
      registrado_por: 'admin',
      autor_id: 1
    }
  ],
  estanques: [
    { id: 1, nombre: 'Estanque 1', area_m2: 2000, capacidad_peces: 5000, profundidad_m: 1.5, estado: 'activo' },
    { id: 2, nombre: 'Estanque 2', area_m2: 2000, capacidad_peces: 5000, profundidad_m: 1.5, estado: 'activo' }
  ],
  lotes: [
    { id: 1, estanque_id: 1, fecha_siembra: '2024-10-01', cantidad_inicial: 5000, tamano_promedio_cm: 3.5, peso_promedio_g: 2.5, estado: 'activo' },
    { id: 2, estanque_id: 2, fecha_siembra: '2024-09-15', cantidad_inicial: 4800, tamano_promedio_cm: 8.2, peso_promedio_g: 12.3, estado: 'activo' }
  ],
  parametros: [
    { id: 1, estanque_id: 1, fecha: '2025-11-04', temp_min: 26.5, temp_max: 30.2, oxigeno: 6.8, ph: 7.2, autor_id: 1, autor_nombre: 'Administrador' },
    { id: 2, estanque_id: 1, fecha: '2025-11-03', temp_min: 26.0, temp_max: 29.8, oxigeno: 7.1, ph: 7.3, autor_id: 1, autor_nombre: 'Administrador' },
    { id: 3, estanque_id: 1, fecha: '2025-11-02', temp_min: 25.8, temp_max: 29.5, oxigeno: 6.9, ph: 7.1, autor_id: 1, autor_nombre: 'Administrador' },
    { id: 4, estanque_id: 1, fecha: '2025-11-01', temp_min: 26.2, temp_max: 30.0, oxigeno: 7.0, ph: 7.2, autor_id: 1, autor_nombre: 'Administrador' },
    { id: 5, estanque_id: 1, fecha: '2025-10-31', temp_min: 26.5, temp_max: 30.5, oxigeno: 6.7, ph: 7.4, autor_id: 1, autor_nombre: 'Administrador' },
    { id: 6, estanque_id: 1, fecha: '2025-10-30', temp_min: 26.0, temp_max: 29.9, oxigeno: 7.2, ph: 7.3, autor_id: 1, autor_nombre: 'Administrador' },
    { id: 7, estanque_id: 1, fecha: '2025-10-29', temp_min: 26.3, temp_max: 30.1, oxigeno: 6.8, ph: 7.2, autor_id: 1, autor_nombre: 'Administrador' },
    { id: 8, estanque_id: 2, fecha: '2025-11-04', temp_min: 27.0, temp_max: 31.0, oxigeno: 6.5, ph: 7.1, autor_id: 1, autor_nombre: 'Administrador' }
  ],
  alimentacion: [
    { id: 1, estanque_id: 1, fecha: '2025-11-04', tipo: 'Pellet 3mm', cantidad_kg: 15.5, costo: 465, autor_id: 1, autor_nombre: 'Administrador' },
    { id: 2, estanque_id: 2, fecha: '2025-11-04', tipo: 'Pellet 5mm', cantidad_kg: 18.0, costo: 540, autor_id: 1, autor_nombre: 'Administrador' },
    { id: 3, estanque_id: 1, fecha: '2025-11-03', tipo: 'Pellet 3mm', cantidad_kg: 16.0, costo: 480, autor_id: 1, autor_nombre: 'Administrador' },
    { id: 4, estanque_id: 2, fecha: '2025-11-03', tipo: 'Pellet 5mm', cantidad_kg: 17.5, costo: 525, autor_id: 1, autor_nombre: 'Administrador' },
    { id: 5, estanque_id: 1, fecha: '2025-11-02', tipo: 'Pellet 3mm', cantidad_kg: 15.0, costo: 450, autor_id: 1, autor_nombre: 'Administrador' },
    { id: 6, estanque_id: 2, fecha: '2025-11-02', tipo: 'Pellet 5mm', cantidad_kg: 18.5, costo: 555, autor_id: 1, autor_nombre: 'Administrador' },
    { id: 7, estanque_id: 1, fecha: '2025-11-01', tipo: 'Pellet 3mm', cantidad_kg: 14.5, costo: 435, autor_id: 1, autor_nombre: 'Administrador' }
  ],
  cosechas: [
    { id: 1, estanque_id: 1, lote_id: null, fecha: '2024-10-15', cantidad_peces: 4800, peso_total_kg: 480.0, mortalidad_peces: 120, observaciones: 'Buena cosecha', precio_venta: 45 }
  ],
  config: {
    temp_min: 26,
    temp_max: 32,
    ox_min: 5,
    ph_min: 6.5,
    ph_max: 8.5,
    moneda: 'MXN'
  }
};

// ID counters
let nextId = {
  estanques: 3,
  lotes: 3,
  parametros: 9,
  alimentacion: 8,
  cosechas: 2,
  clientes: 2,
  ventas: 3
};

// Ventas config
const ventasConfig = {
  iva_porcentaje: 16,
  moneda: 'MXN',
  simbolo: '$',
  factura_inicio: 1000,
  margen_ganancia_esperado: 35
};

let nextFacturaNumero = 1003;

// Chart instances
let charts = {};

// ==========================================
// INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
  // Set up login form FIRST - this is critical!
  setupLoginForm();
  checkSession();
});

function initializeApp() {
  setupNavigation();
  setupForms();
  setupRoleBasedUI();
  loadDashboard();
  setCurrentDate();
  populateSelects();
  updateSyncStatus();
  startSyncInterval();
}

// ==========================================
// AUTHENTICATION FUNCTIONS
// ==========================================
function setupLoginForm() {
  // Main login form
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const email = document.getElementById('loginEmail').value.trim();
      const password = document.getElementById('loginPassword').value;
      const remember = document.getElementById('loginRemember').checked;
      
      // Validate empty fields
      if (!email || !password) {
        mostrarErrorLogin('⚠️ Por favor completa usuario y contraseña');
        return;
      }
      
      if (iniciarSesion(email, password, remember)) {
        loginForm.reset();
      }
    });
  }
  
  // Recuperar password form
  const formRecuperar = document.getElementById('formRecuperar');
  if (formRecuperar) {
    formRecuperar.addEventListener('submit', function(e) {
      e.preventDefault();
      recuperarPassword();
    });
  }
  
  // Nueva cuenta form
  const formNuevaCuenta = document.getElementById('formNuevaCuenta');
  if (formNuevaCuenta) {
    formNuevaCuenta.addEventListener('submit', function(e) {
      e.preventDefault();
      crearNuevaCuenta();
    });
  }
}

function checkSession() {
  // Show login screen
  document.getElementById('loginScreen').classList.add('active');
  document.querySelector('.header').style.display = 'none';
  document.querySelector('.main-container').style.display = 'none';
  document.querySelector('.footer').style.display = 'none';
}

function iniciarSesion(email, password, remember = false) {
  const user = usuarios.find(u => u.email === email && u.password === password);
  
  if (!user) {
    // Check if user exists
    const userExists = usuarios.find(u => u.email === email);
    if (userExists) {
      mostrarErrorLogin('❌ Contraseña incorrecta');
    } else {
      mostrarErrorLogin('❌ Usuario no encontrado');
    }
    return false;
  }
  
  // Successful login
  currentUser = user;
  rememberUser = remember;
  user.ultimo_acceso = new Date().toISOString();
  
  // Show success message briefly
  mostrarExitoLogin('✅ ¡Bienvenido! Ingresando al sistema...');
  
  // Wait a moment for user to see the success message
  setTimeout(() => {
    // Hide login, show app
    document.getElementById('loginScreen').classList.remove('active');
    document.querySelector('.header').style.display = 'block';
    document.querySelector('.main-container').style.display = 'flex';
    document.querySelector('.footer').style.display = 'block';
    
    // Update UI
    updateUserInfo();
    initializeApp();
    showToast(`¡Bienvenido, ${user.nombre}!`, 'success');
  }, 800);
  
  return true;
}

function mostrarErrorLogin(mensaje) {
  const errorDiv = document.getElementById('loginErrorMsg');
  if (errorDiv) {
    errorDiv.textContent = mensaje;
    errorDiv.style.display = 'flex';
    errorDiv.className = 'login-error';
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      errorDiv.style.display = 'none';
    }, 5000);
  }
}

function mostrarExitoLogin(mensaje) {
  const errorDiv = document.getElementById('loginErrorMsg');
  if (errorDiv) {
    errorDiv.textContent = mensaje;
    errorDiv.style.display = 'flex';
    errorDiv.className = 'login-success';
  }
}

function ingresoRapidoDemo() {
  // Auto-login as admin
  document.getElementById('loginEmail').value = 'admin@granja.com';
  document.getElementById('loginPassword').value = 'admin123';
  document.getElementById('loginRemember').checked = false;
  
  mostrarExitoLogin('✅ Ingresando como Administrador...');
  
  setTimeout(() => {
    iniciarSesion('admin@granja.com', 'admin123', false);
  }, 1000);
}

function mostrarRecuperarPassword() {
  document.getElementById('mainLoginForm').classList.remove('active');
  document.getElementById('crearCuentaForm').classList.remove('active');
  document.getElementById('recuperarPasswordForm').classList.add('active');
  
  // Hide any error messages
  const errorDiv = document.getElementById('loginErrorMsg');
  if (errorDiv) errorDiv.style.display = 'none';
}

function mostrarCrearCuenta() {
  document.getElementById('mainLoginForm').classList.remove('active');
  document.getElementById('recuperarPasswordForm').classList.remove('active');
  document.getElementById('crearCuentaForm').classList.add('active');
  
  // Hide any error messages
  const errorDiv = document.getElementById('loginErrorMsg');
  if (errorDiv) errorDiv.style.display = 'none';
}

function volverALogin() {
  document.getElementById('recuperarPasswordForm').classList.remove('active');
  document.getElementById('crearCuentaForm').classList.remove('active');
  document.getElementById('mainLoginForm').classList.add('active');
  
  // Clear forms
  document.getElementById('formRecuperar').reset();
  document.getElementById('formNuevaCuenta').reset();
  
  // Hide any error messages
  const errorDiv = document.getElementById('loginErrorMsg');
  if (errorDiv) errorDiv.style.display = 'none';
}

function recuperarPassword() {
  const email = document.getElementById('recuperarEmail').value.trim();
  
  if (!email) {
    alert('⚠️ Por favor ingresa tu email o usuario');
    return;
  }
  
  // Check if user exists
  const user = usuarios.find(u => u.email === email);
  
  if (user) {
    // Show user their credentials
    alert(`✅ Usuario encontrado!\n\nTus credenciales son:\nEmail: ${user.email}\nContraseña: ${user.password}\nRol: ${user.rol}\n\nPuedes usar estas credenciales para ingresar.`);
    volverALogin();
  } else {
    alert('❌ Usuario no encontrado. Verifica el email ingresado.');
  }
}

function crearNuevaCuenta() {
  const nombre = document.getElementById('nuevoNombre').value.trim();
  const email = document.getElementById('nuevoEmail').value.trim();
  const password = document.getElementById('nuevoPassword').value;
  const passwordConfirm = document.getElementById('nuevoPasswordConfirm').value;
  const rol = document.getElementById('nuevoRol').value;
  
  // Validations
  if (!nombre || !email || !password || !passwordConfirm || !rol) {
    alert('⚠️ Por favor completa todos los campos obligatorios');
    return;
  }
  
  if (password.length < 6) {
    alert('⚠️ La contraseña debe tener al menos 6 caracteres');
    return;
  }
  
  if (password !== passwordConfirm) {
    alert('⚠️ Las contraseñas no coinciden');
    return;
  }
  
  // Check if email already exists
  if (usuarios.find(u => u.email === email)) {
    alert('❌ El email ya está registrado');
    return;
  }
  
  // Create new user
  const nuevoUsuario = {
    id: nextUserId++,
    nombre: nombre,
    email: email,
    password: password,
    rol: rol,
    estado: 'activo',
    ultimo_acceso: null,
    fecha_creacion: new Date().toISOString().split('T')[0]
  };
  
  usuarios.push(nuevoUsuario);
  
  alert(`✅ Cuenta creada exitosamente!\n\nYa puedes ingresar con tus credenciales:\nEmail: ${email}\nContraseña: ${password}`);
  
  // Return to login
  volverALogin();
  
  // Pre-fill login form
  document.getElementById('loginEmail').value = email;
  document.getElementById('loginPassword').value = password;
}

function cerrarSesion() {
  if (confirm('¿Está seguro de cerrar sesión?')) {
    currentUser = null;
    rememberUser = false;
    
    // Reset UI
    document.getElementById('loginScreen').classList.add('active');
    document.querySelector('.header').style.display = 'none';
    document.querySelector('.main-container').style.display = 'none';
    document.querySelector('.footer').style.display = 'none';
    
    document.getElementById('loginForm').reset();
    showToast('Sesión cerrada', 'info');
  }
}

function updateUserInfo() {
  if (!currentUser) return;
  
  const initials = currentUser.nombre.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  document.getElementById('userAvatar').textContent = initials;
  document.getElementById('userName').textContent = currentUser.nombre;
  
  const roleNames = {
    admin: 'Administrador',
    operador: 'Operador',
    vendedor: 'Vendedor',
    visor: 'Visor'
  };
  document.getElementById('userRole').textContent = roleNames[currentUser.rol] || currentUser.rol;
}

function tienePermiso(permiso) {
  if (!currentUser) return false;
  return permisos[currentUser.rol]?.[permiso] || false;
}

function setupRoleBasedUI() {
  if (!currentUser) return;
  
  // Hide colaboradores section for non-admins
  const colabNav = document.getElementById('navColaboradores');
  if (colabNav) {
    colabNav.style.display = tienePermiso('gestionar_colaboradores') ? 'flex' : 'none';
  }
  
  // Disable forms for viewers
  if (currentUser.rol === 'visor') {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
      if (form.id !== 'loginForm') {
        const inputs = form.querySelectorAll('input, select, textarea, button[type="submit"]');
        inputs.forEach(input => {
          input.disabled = true;
        });
      }
    });
  }
}

function updateSyncStatus() {
  const syncStatus = document.getElementById('syncStatus');
  const syncText = document.getElementById('syncText');
  
  if (syncStatus) {
    syncStatus.classList.add('synced');
    syncText.textContent = 'Sincronizado';
    
    const now = new Date();
    const time = now.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
    syncText.title = `Última sincronización: ${time}`;
  }
}

function startSyncInterval() {
  // Simulate sync every 5 minutes
  setInterval(() => {
    updateSyncStatus();
  }, 300000);
}

// ==========================================
// NAVIGATION
// ==========================================
function setupNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', function() {
      const section = this.dataset.section;
      showSection(section);
    });
  });
}

// ==========================================
// COLABORADORES MANAGEMENT
// ==========================================
function loadColaboradores() {
  if (!tienePermiso('gestionar_colaboradores')) {
    showToast('No tiene permisos para acceder a esta sección', 'error');
    showSection('dashboard');
    return;
  }
  
  updateColaboradoresTable();
  updateColaboradoresStats();
}

function updateColaboradoresTable() {
  const tbody = document.getElementById('colaboradoresTable');
  
  tbody.innerHTML = usuarios.map(user => {
    const registros = contarRegistrosPorUsuario(user.id);
    const ultimoAcceso = user.ultimo_acceso ? formatDateTime(user.ultimo_acceso) : 'Nunca';
    
    return `
      <tr>
        <td>${user.nombre}</td>
        <td>${user.email}</td>
        <td><span class="role-badge role-${user.rol}">${user.rol}</span></td>
        <td><span class="status-badge status-${user.estado}">${user.estado}</span></td>
        <td>${ultimoAcceso}</td>
        <td>${registros}</td>
        <td>
          ${user.id !== 1 && user.id !== currentUser.id ? `<button class="btn btn-sm btn-danger" onclick="eliminarColaborador(${user.id})">Eliminar</button>` : '<span style="color: var(--color-text-secondary); font-size: 11px;">Sistema</span>'}
        </td>
      </tr>
    `;
  }).join('');
}

function updateColaboradoresStats() {
  document.getElementById('totalColaboradores').textContent = usuarios.length;
  
  const today = new Date().toISOString().split('T')[0];
  const activosHoy = usuarios.filter(u => {
    if (!u.ultimo_acceso) return false;
    const lastAccess = new Date(u.ultimo_acceso).toISOString().split('T')[0];
    return lastAccess === today;
  }).length;
  document.getElementById('colaboradoresHoy').textContent = activosHoy;
  
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  let registrosMes = 0;
  registrosMes += appData.parametros.filter(p => {
    const fecha = new Date(p.fecha);
    return fecha.getMonth() === currentMonth && fecha.getFullYear() === currentYear;
  }).length;
  registrosMes += appData.alimentacion.filter(a => {
    const fecha = new Date(a.fecha);
    return fecha.getMonth() === currentMonth && fecha.getFullYear() === currentYear;
  }).length;
  
  document.getElementById('registrosMes').textContent = registrosMes;
}

function agregarColaborador() {
  const colaborador = {
    id: nextUserId++,
    nombre: document.getElementById('colabNombre').value,
    email: document.getElementById('colabEmail').value,
    password: document.getElementById('colabPassword').value,
    rol: document.getElementById('colabRol').value,
    estado: 'activo',
    ultimo_acceso: null,
    fecha_creacion: new Date().toISOString()
  };
  
  // Check if email already exists
  if (usuarios.find(u => u.email === colaborador.email)) {
    showToast('El email ya está registrado', 'error');
    return;
  }
  
  usuarios.push(colaborador);
  updateColaboradoresTable();
  updateColaboradoresStats();
  document.getElementById('formColaborador').reset();
  showToast(`Colaborador ${colaborador.nombre} agregado correctamente`, 'success');
}

function eliminarColaborador(id) {
  if (!confirm('¿Está seguro de eliminar este colaborador?')) return;
  
  usuarios = usuarios.filter(u => u.id !== id);
  updateColaboradoresTable();
  updateColaboradoresStats();
  showToast('Colaborador eliminado', 'info');
}

function contarRegistrosPorUsuario(userId) {
  let count = 0;
  count += appData.parametros.filter(p => p.autor_id === userId).length;
  count += appData.alimentacion.filter(a => a.autor_id === userId).length;
  return count;
}

function formatDateTime(isoString) {
  const date = new Date(isoString);
  return date.toLocaleString('es-MX', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function showSection(sectionName) {
  // Hide all sections
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  // Show selected section
  const section = document.getElementById(sectionName);
  if (section) {
    section.classList.add('active');
  }

  // Update nav items
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
    if (item.dataset.section === sectionName) {
      item.classList.add('active');
    }
  });

  // Load section data
  switch(sectionName) {
    case 'dashboard':
      loadDashboard();
      break;
    case 'estanques':
      loadEstanques();
      break;
    case 'lotes':
      loadLotes();
      break;
    case 'parametros':
      loadParametros();
      break;
    case 'alimentacion':
      loadAlimentacion();
      break;
    case 'cosechas':
      loadCosechas();
      break;
    case 'reportes':
      loadReportes();
      break;
    case 'colaboradores':
      loadColaboradores();
      break;
    case 'configuracion':
      loadConfiguracion();
      break;
    case 'ventas':
      loadVentas();
      break;
  }
}

// ==========================================
// FORM SETUP
// ==========================================
function setupForms() {
  // Login Form
  document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    rememberUser = document.getElementById('loginRemember').checked;
    
    if (iniciarSesion(email, password)) {
      document.getElementById('loginForm').reset();
    } else {
      showToast('Email o contraseña incorrectos', 'error');
    }
  });

  // Colaborador Form
  const formColab = document.getElementById('formColaborador');
  if (formColab) {
    formColab.addEventListener('submit', function(e) {
      e.preventDefault();
      if (tienePermiso('gestionar_colaboradores')) {
        agregarColaborador();
      }
    });
  }

  // Estanques Form
  document.getElementById('formEstanque').addEventListener('submit', function(e) {
    e.preventDefault();
    agregarEstanque();
  });

  // Lotes Form
  document.getElementById('formLote').addEventListener('submit', function(e) {
    e.preventDefault();
    agregarLote();
  });

  // Parametros Form
  document.getElementById('formParametros').addEventListener('submit', function(e) {
    e.preventDefault();
    agregarParametros();
  });

  // Alimentacion Form
  document.getElementById('formAlimentacion').addEventListener('submit', function(e) {
    e.preventDefault();
    agregarAlimentacion();
  });

  // Cosecha Form
  document.getElementById('formCosecha').addEventListener('submit', function(e) {
    e.preventDefault();
    agregarCosecha();
  });

  // Config Form
  document.getElementById('formConfig').addEventListener('submit', function(e) {
    e.preventDefault();
    guardarConfiguracion();
  });

  // Cliente Form
  const formCliente = document.getElementById('formCliente');
  if (formCliente) {
    formCliente.addEventListener('submit', function(e) {
      e.preventDefault();
      agregarCliente();
    });
  }

  // Venta Form
  const formVenta = document.getElementById('formVenta');
  if (formVenta) {
    formVenta.addEventListener('submit', function(e) {
      e.preventDefault();
      agregarVenta();
    });
  }

  // Venta form calculations
  const ventaCantidad = document.getElementById('ventaCantidadKg');
  const ventaPrecio = document.getElementById('ventaPrecioUnitario');
  const ventaDescuento = document.getElementById('ventaDescuento');
  const ventaEstanque = document.getElementById('ventaEstanque');
  
  if (ventaCantidad) ventaCantidad.addEventListener('input', calcularResumenVenta);
  if (ventaPrecio) ventaPrecio.addEventListener('input', calcularResumenVenta);
  if (ventaDescuento) ventaDescuento.addEventListener('input', calcularResumenVenta);
  if (ventaEstanque) ventaEstanque.addEventListener('change', calcularResumenVenta);

  // Metodo pago change
  const ventaMetodoPago = document.getElementById('ventaMetodoPago');
  if (ventaMetodoPago) {
    ventaMetodoPago.addEventListener('change', function() {
      const vencimientoGroup = document.getElementById('ventaFechaVencimientoGroup');
      if (this.value === 'Crédito') {
        vencimientoGroup.style.display = 'block';
      } else {
        vencimientoGroup.style.display = 'none';
      }
    });
  }

  // Ventas tabs
  const ventasTabs = document.querySelectorAll('.ventas-tab');
  ventasTabs.forEach(tab => {
    tab.addEventListener('click', function() {
      const tabName = this.dataset.ventasTab;
      showVentasTab(tabName);
    });
  });

  // Cliente search
  const buscarCliente = document.getElementById('buscarCliente');
  if (buscarCliente) {
    buscarCliente.addEventListener('input', function() {
      filtrarClientes(this.value);
    });
  }

  // Filtro mes ventas
  const filtroMesVentas = document.getElementById('filtroMesVentas');
  if (filtroMesVentas) {
    filtroMesVentas.addEventListener('change', function() {
      updateVentasHistorialTable();
    });
  }

  // Chart filters
  const paramChartPeriod = document.getElementById('paramChartPeriod');
  const paramChartEstanque = document.getElementById('paramChartEstanque');
  if (paramChartPeriod) {
    paramChartPeriod.addEventListener('change', updateParametrosCharts);
  }
  if (paramChartEstanque) {
    paramChartEstanque.addEventListener('change', updateParametrosCharts);
  }
}

function setCurrentDate() {
  const today = new Date().toISOString().split('T')[0];
  const dateInputs = ['loteFechaSiembra', 'paramFecha', 'alimentFecha', 'cosechaFecha'];
  dateInputs.forEach(id => {
    const input = document.getElementById(id);
    if (input && !input.value) {
      input.value = today;
    }
  });
}

function populateSelects() {
  const estanqueSelects = ['loteEstanque', 'paramEstanque', 'alimentEstanque', 'paramChartEstanque'];
  estanqueSelects.forEach(selectId => {
    const select = document.getElementById(selectId);
    if (select) {
      select.innerHTML = appData.estanques
        .map(e => `<option value="${e.id}">${e.nombre}</option>`)
        .join('');
    }
  });

  // Populate lotes select for cosechas
  const lotesSelect = document.getElementById('cosechaLote');
  if (lotesSelect) {
    const lotesActivos = appData.lotes.filter(l => l.estado === 'activo');
    lotesSelect.innerHTML = lotesActivos
      .map(l => {
        const estanque = appData.estanques.find(e => e.id === l.estanque_id);
        return `<option value="${l.id}">Lote ${l.id} - ${estanque ? estanque.nombre : 'Estanque'} (${l.fecha_siembra})</option>`;
      })
      .join('');
  }
}

// ==========================================
// DASHBOARD
// ==========================================
function loadDashboard() {
  updateDashboardStats();
  updateDashboardAlerts();
  updateDashboardParameters();
  updateDashboardEstanquesTable();
  updateDashboardCharts();
}

function updateDashboardStats() {
  // Total estanques
  document.getElementById('totalEstanques').textContent = appData.estanques.length;

  // Lotes activos
  const lotesActivos = appData.lotes.filter(l => l.estado === 'activo').length;
  document.getElementById('lotesActivos').textContent = lotesActivos;

  // Consumo de alimento del mes
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const consumoMes = appData.alimentacion
    .filter(a => {
      const fecha = new Date(a.fecha);
      return fecha.getMonth() === currentMonth && fecha.getFullYear() === currentYear;
    })
    .reduce((sum, a) => sum + a.cantidad_kg, 0);
  document.getElementById('consumoMes').textContent = `${consumoMes.toFixed(1)} kg`;

  // Producción estimada (basado en lotes activos)
  const produccionEstimada = appData.lotes
    .filter(l => l.estado === 'activo')
    .reduce((sum, l) => {
      // Estimación: 100g por pez promedio al final del ciclo
      return sum + (l.cantidad_inicial * 0.1);
    }, 0);
  document.getElementById('produccionEstimada').textContent = `${produccionEstimada.toFixed(0)} kg`;
}

function updateDashboardAlerts() {
  const alertsContainer = document.getElementById('alertsContainer');
  const alerts = [];

  // Check latest parameters
  const latestParams = {};
  appData.parametros.forEach(p => {
    if (!latestParams[p.estanque_id] || new Date(p.fecha) > new Date(latestParams[p.estanque_id].fecha)) {
      latestParams[p.estanque_id] = p;
    }
  });

  Object.values(latestParams).forEach(param => {
    const estanque = appData.estanques.find(e => e.id === param.estanque_id);
    const estanqueNombre = estanque ? estanque.nombre : `Estanque ${param.estanque_id}`;

    // Check temperature
    if (param.temp_max > appData.config.temp_max) {
      alerts.push({
        type: 'danger',
        message: `${estanqueNombre}: Temperatura alta (${param.temp_max}°C)`
      });
    } else if (param.temp_min < appData.config.temp_min) {
      alerts.push({
        type: 'warning',
        message: `${estanqueNombre}: Temperatura baja (${param.temp_min}°C)`
      });
    }

    // Check oxygen
    if (param.oxigeno < appData.config.ox_min) {
      alerts.push({
        type: 'danger',
        message: `${estanqueNombre}: Oxígeno bajo (${param.oxigeno} mg/L)`
      });
    }

    // Check pH
    if (param.ph < appData.config.ph_min || param.ph > appData.config.ph_max) {
      alerts.push({
        type: 'warning',
        message: `${estanqueNombre}: pH fuera de rango (${param.ph})`
      });
    }
  });

  // Update alert badge
  document.getElementById('alertCount').textContent = alerts.length;

  if (alerts.length > 0) {
    alertsContainer.innerHTML = alerts.map(alert => `
      <div class="alert alert-${alert.type}">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        ${alert.message}
      </div>
    `).join('');
  } else {
    alertsContainer.innerHTML = '';
  }
}

function updateDashboardParameters() {
  // Get latest parameters
  if (appData.parametros.length > 0) {
    const latest = appData.parametros.reduce((prev, current) => {
      return (new Date(current.fecha) > new Date(prev.fecha)) ? current : prev;
    });

    const tempAvg = (latest.temp_min + latest.temp_max) / 2;
    document.getElementById('dashTempValue').textContent = `${tempAvg.toFixed(1)}°C`;
    document.getElementById('dashTempStatus').textContent = getParamStatus('temp', tempAvg);
    document.getElementById('dashTempStatus').className = `param-status ${getParamStatusClass('temp', tempAvg)}`;

    document.getElementById('dashOxValue').textContent = `${latest.oxigeno.toFixed(1)} mg/L`;
    document.getElementById('dashOxStatus').textContent = getParamStatus('ox', latest.oxigeno);
    document.getElementById('dashOxStatus').className = `param-status ${getParamStatusClass('ox', latest.oxigeno)}`;

    document.getElementById('dashPhValue').textContent = latest.ph.toFixed(1);
    document.getElementById('dashPhStatus').textContent = getParamStatus('ph', latest.ph);
    document.getElementById('dashPhStatus').className = `param-status ${getParamStatusClass('ph', latest.ph)}`;
  }
}

function updateDashboardEstanquesTable() {
  const tbody = document.getElementById('dashboardEstanquesTable');
  tbody.innerHTML = appData.estanques.map(estanque => {
    const lote = appData.lotes.find(l => l.estanque_id === estanque.id && l.estado === 'activo');
    const loteInfo = lote ? `Lote ${lote.id}` : 'Sin lote';
    const pecesInfo = lote ? lote.cantidad_inicial : 0;

    return `
      <tr>
        <td>${estanque.nombre}</td>
        <td>${estanque.area_m2}</td>
        <td>${estanque.capacidad_peces}</td>
        <td>${loteInfo}</td>
        <td>${pecesInfo}</td>
        <td><span class="status-badge status-${estanque.estado}">${estanque.estado}</span></td>
      </tr>
    `;
  }).join('');
}

function updateDashboardCharts() {
  // Temperature Chart
  const tempData = appData.parametros
    .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
    .slice(-7);

  const tempLabels = tempData.map(p => formatDate(p.fecha));
  const tempMin = tempData.map(p => p.temp_min);
  const tempMax = tempData.map(p => p.temp_max);

  if (charts.tempChart) charts.tempChart.destroy();
  const tempCtx = document.getElementById('tempChart');
  if (tempCtx) {
    charts.tempChart = new Chart(tempCtx, {
      type: 'line',
      data: {
        labels: tempLabels,
        datasets: [
          {
            label: 'Temp. Mínima',
            data: tempMin,
            borderColor: '#0066cc',
            backgroundColor: 'rgba(0, 102, 204, 0.1)',
            tension: 0.4
          },
          {
            label: 'Temp. Máxima',
            data: tempMax,
            borderColor: '#dc3545',
            backgroundColor: 'rgba(220, 53, 69, 0.1)',
            tension: 0.4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top'
          }
        },
        scales: {
          y: {
            beginAtZero: false
          }
        }
      }
    });
  }

  // Feed Chart
  const feedData = appData.alimentacion
    .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
    .slice(-7);

  const feedLabels = feedData.map(f => formatDate(f.fecha));
  const feedQuantities = feedData.map(f => f.cantidad_kg);

  if (charts.feedChart) charts.feedChart.destroy();
  const feedCtx = document.getElementById('feedChart');
  if (feedCtx) {
    charts.feedChart = new Chart(feedCtx, {
      type: 'bar',
      data: {
        labels: feedLabels,
        datasets: [{
          label: 'Consumo (kg)',
          data: feedQuantities,
          backgroundColor: '#2e8b57',
          borderColor: '#1a5c3a',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
}

function getParamStatus(type, value) {
  if (type === 'temp') {
    if (value >= appData.config.temp_min && value <= appData.config.temp_max) return 'Óptimo';
    if (value < appData.config.temp_min - 2 || value > appData.config.temp_max + 2) return 'Crítico';
    return 'Advertencia';
  } else if (type === 'ox') {
    if (value >= appData.config.ox_min) return 'Óptimo';
    if (value < appData.config.ox_min - 2) return 'Crítico';
    return 'Advertencia';
  } else if (type === 'ph') {
    if (value >= appData.config.ph_min && value <= appData.config.ph_max) return 'Óptimo';
    if (value < appData.config.ph_min - 0.5 || value > appData.config.ph_max + 0.5) return 'Crítico';
    return 'Advertencia';
  }
  return '';
}

function getParamStatusClass(type, value) {
  const status = getParamStatus(type, value);
  if (status === 'Óptimo') return 'status-optimal';
  if (status === 'Advertencia') return 'status-warning';
  if (status === 'Crítico') return 'status-critical';
  return '';
}

// ==========================================
// ESTANQUES
// ==========================================
function loadEstanques() {
  updateEstanquesTable();
}

function updateEstanquesTable() {
  const tbody = document.getElementById('estanquesTable');
  tbody.innerHTML = appData.estanques.map(estanque => `
    <tr>
      <td>${estanque.id}</td>
      <td>${estanque.nombre}</td>
      <td>${estanque.area_m2}</td>
      <td>${estanque.capacidad_peces}</td>
      <td>${estanque.profundidad_m}</td>
      <td><span class="status-badge status-${estanque.estado}">${estanque.estado}</span></td>
      <td>
        <button class="btn btn-sm btn-secondary" onclick="editarEstanque(${estanque.id})">Editar</button>
        <button class="btn btn-sm btn-danger" onclick="eliminarEstanque(${estanque.id})">Eliminar</button>
      </td>
    </tr>
  `).join('');
}

function agregarEstanque() {
  const estanque = {
    id: nextId.estanques++,
    nombre: document.getElementById('estanqueNombre').value,
    area_m2: parseFloat(document.getElementById('estanqueArea').value),
    capacidad_peces: parseInt(document.getElementById('estanqueCapacidad').value),
    profundidad_m: parseFloat(document.getElementById('estanqueProfundidad').value),
    estado: document.getElementById('estanqueEstado').value
  };

  appData.estanques.push(estanque);
  updateEstanquesTable();
  populateSelects();
  document.getElementById('formEstanque').reset();
  showToast('Estanque agregado correctamente', 'success');
}

function editarEstanque(id) {
  const estanque = appData.estanques.find(e => e.id === id);
  if (estanque) {
    document.getElementById('estanqueNombre').value = estanque.nombre;
    document.getElementById('estanqueArea').value = estanque.area_m2;
    document.getElementById('estanqueCapacidad').value = estanque.capacidad_peces;
    document.getElementById('estanqueProfundidad').value = estanque.profundidad_m;
    document.getElementById('estanqueEstado').value = estanque.estado;
    eliminarEstanque(id, true);
  }
}

function eliminarEstanque(id, silent = false) {
  if (!silent && !confirm('¿Está seguro de eliminar este estanque?')) return;
  appData.estanques = appData.estanques.filter(e => e.id !== id);
  updateEstanquesTable();
  populateSelects();
  if (!silent) showToast('Estanque eliminado', 'info');
}

// ==========================================
// LOTES
// ==========================================
function loadLotes() {
  updateLotesTable();
  populateSelects();
}

function updateLotesTable() {
  // Lotes activos
  const activosTbody = document.getElementById('lotesActivosTable');
  const lotesActivos = appData.lotes.filter(l => l.estado === 'activo');
  activosTbody.innerHTML = lotesActivos.map(lote => {
    const estanque = appData.estanques.find(e => e.id === lote.estanque_id);
    const diasCultivo = calcularDiasCultivo(lote.fecha_siembra);
    const fechaCosecha = calcularFechaCosecha(lote.fecha_siembra);

    return `
      <tr>
        <td>${lote.id}</td>
        <td>${estanque ? estanque.nombre : 'N/A'}</td>
        <td>${formatDate(lote.fecha_siembra)}</td>
        <td>${lote.cantidad_inicial}</td>
        <td>${diasCultivo}</td>
        <td>${formatDate(fechaCosecha)}</td>
        <td><span class="status-badge status-active">${lote.estado}</span></td>
        <td>
          <button class="btn btn-sm btn-danger" onclick="eliminarLote(${lote.id})">Eliminar</button>
        </td>
      </tr>
    `;
  }).join('');

  // Lotes históricos
  const historicosTbody = document.getElementById('lotesHistoricosTable');
  const lotesHistoricos = appData.lotes.filter(l => l.estado === 'cosechado');
  historicosTbody.innerHTML = lotesHistoricos.map(lote => {
    const estanque = appData.estanques.find(e => e.id === lote.estanque_id);
    const cosecha = appData.cosechas.find(c => c.lote_id === lote.id);
    const fechaCosecha = cosecha ? cosecha.fecha : 'N/A';
    const diasCultivo = cosecha ? calcularDiasCultivo(lote.fecha_siembra, cosecha.fecha) : 'N/A';

    return `
      <tr>
        <td>${lote.id}</td>
        <td>${estanque ? estanque.nombre : 'N/A'}</td>
        <td>${formatDate(lote.fecha_siembra)}</td>
        <td>${fechaCosecha !== 'N/A' ? formatDate(fechaCosecha) : fechaCosecha}</td>
        <td>${lote.cantidad_inicial}</td>
        <td>${diasCultivo}</td>
        <td><span class="status-badge status-cosechado">${lote.estado}</span></td>
      </tr>
    `;
  }).join('');
}

function agregarLote() {
  const lote = {
    id: nextId.lotes++,
    estanque_id: parseInt(document.getElementById('loteEstanque').value),
    fecha_siembra: document.getElementById('loteFechaSiembra').value,
    cantidad_inicial: parseInt(document.getElementById('loteCantidad').value),
    tamano_promedio_cm: parseFloat(document.getElementById('loteTamano').value),
    peso_promedio_g: parseFloat(document.getElementById('lotePeso').value),
    estado: 'activo'
  };

  appData.lotes.push(lote);
  updateLotesTable();
  populateSelects();
  document.getElementById('formLote').reset();
  setCurrentDate();
  showToast('Lote agregado correctamente', 'success');
}

function eliminarLote(id) {
  if (!confirm('¿Está seguro de eliminar este lote?')) return;
  appData.lotes = appData.lotes.filter(l => l.id !== id);
  updateLotesTable();
  populateSelects();
  showToast('Lote eliminado', 'info');
}

function calcularDiasCultivo(fechaSiembra, fechaFin = null) {
  const inicio = new Date(fechaSiembra);
  const fin = fechaFin ? new Date(fechaFin) : new Date();
  const diff = fin - inicio;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function calcularFechaCosecha(fechaSiembra, meses = 5) {
  const fecha = new Date(fechaSiembra);
  fecha.setMonth(fecha.getMonth() + meses);
  return fecha.toISOString().split('T')[0];
}

// ==========================================
// PARAMETROS
// ==========================================
function loadParametros() {
  populateSelects();
  updateParametrosTable();
  updateParametrosCharts();
}

function updateParametrosTable() {
  const tbody = document.getElementById('parametrosTable');
  let sortedParams = [...appData.parametros].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  
  // Filter for non-admins
  if (currentUser && !tienePermiso('ver_datos_otros')) {
    sortedParams = sortedParams.filter(p => p.autor_id === currentUser.id);
  }

  tbody.innerHTML = sortedParams.map(param => {
    const estanque = appData.estanques.find(e => e.id === param.estanque_id);
    const tempAvg = (param.temp_min + param.temp_max) / 2;
    const tempStatus = getParamStatus('temp', tempAvg);
    const oxStatus = getParamStatus('ox', param.oxigeno);
    const phStatus = getParamStatus('ph', param.ph);

    const worstStatus = [tempStatus, oxStatus, phStatus].includes('Crítico') ? 'Crítico' :
                        [tempStatus, oxStatus, phStatus].includes('Advertencia') ? 'Advertencia' : 'Óptimo';

    return `
      <tr>
        <td>${formatDate(param.fecha)}</td>
        <td>${estanque ? estanque.nombre : 'N/A'}</td>
        <td>${param.temp_min}°C</td>
        <td>${param.temp_max}°C</td>
        <td>${param.oxigeno} mg/L</td>
        <td>${param.ph}</td>
        <td><span class="param-status ${getParamStatusClass('temp', tempAvg)}">${worstStatus}</span></td>
      </tr>
      ${param.autor_nombre ? `<tr><td colspan="7" style="padding: 4px 12px; font-size: 11px; color: var(--color-text-secondary); border-bottom: 2px solid var(--color-border);">Registrado por: ${param.autor_nombre}</td></tr>` : ''}
    `;
  }).join('');
}

function agregarParametros() {
  if (!tienePermiso('ingresar_datos')) {
    showToast('No tiene permisos para ingresar datos', 'error');
    return;
  }

  const parametro = {
    id: nextId.parametros++,
    estanque_id: parseInt(document.getElementById('paramEstanque').value),
    fecha: document.getElementById('paramFecha').value,
    temp_min: parseFloat(document.getElementById('paramTempMin').value),
    temp_max: parseFloat(document.getElementById('paramTempMax').value),
    oxigeno: parseFloat(document.getElementById('paramOxigeno').value),
    ph: parseFloat(document.getElementById('paramPH').value),
    autor_id: currentUser.id,
    autor_nombre: currentUser.nombre
  };

  appData.parametros.push(parametro);
  updateParametrosTable();
  updateParametrosCharts();
  document.getElementById('formParametros').reset();
  setCurrentDate();
  showToast('Parámetros registrados correctamente', 'success');
  loadDashboard(); // Update dashboard alerts
}

function updateParametrosCharts() {
  const period = parseInt(document.getElementById('paramChartPeriod').value);
  const estanqueId = parseInt(document.getElementById('paramChartEstanque').value);

  const filteredParams = appData.parametros
    .filter(p => p.estanque_id === estanqueId)
    .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
    .slice(-period);

  const labels = filteredParams.map(p => formatDate(p.fecha));

  // Temperature Chart
  if (charts.temperatureChart) charts.temperatureChart.destroy();
  const tempCtx = document.getElementById('temperatureChart');
  if (tempCtx) {
    charts.temperatureChart = new Chart(tempCtx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Min',
            data: filteredParams.map(p => p.temp_min),
            borderColor: '#0066cc',
            backgroundColor: 'rgba(0, 102, 204, 0.1)',
            tension: 0.4
          },
          {
            label: 'Max',
            data: filteredParams.map(p => p.temp_max),
            borderColor: '#dc3545',
            backgroundColor: 'rgba(220, 53, 69, 0.1)',
            tension: 0.4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'top' } },
        scales: { y: { beginAtZero: false } }
      }
    });
  }

  // Oxygen Chart
  if (charts.oxygenChart) charts.oxygenChart.destroy();
  const oxCtx = document.getElementById('oxygenChart');
  if (oxCtx) {
    charts.oxygenChart = new Chart(oxCtx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Oxígeno (mg/L)',
          data: filteredParams.map(p => p.oxigeno),
          borderColor: '#28a745',
          backgroundColor: 'rgba(40, 167, 69, 0.1)',
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: false } }
      }
    });
  }

  // pH Chart
  if (charts.phChart) charts.phChart.destroy();
  const phCtx = document.getElementById('phChart');
  if (phCtx) {
    charts.phChart = new Chart(phCtx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'pH',
          data: filteredParams.map(p => p.ph),
          borderColor: '#ffc107',
          backgroundColor: 'rgba(255, 193, 7, 0.1)',
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: false, min: 6, max: 9 } }
      }
    });
  }
}

// ==========================================
// ALIMENTACION
// ==========================================
function loadAlimentacion() {
  populateSelects();
  updateAlimentacionStats();
  updateAlimentacionTable();
  updateConsumoChart();
}

function updateAlimentacionStats() {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const alimentacionMes = appData.alimentacion.filter(a => {
    const fecha = new Date(a.fecha);
    return fecha.getMonth() === currentMonth && fecha.getFullYear() === currentYear;
  });

  const consumoTotal = alimentacionMes.reduce((sum, a) => sum + a.cantidad_kg, 0);
  const costoTotal = alimentacionMes.reduce((sum, a) => sum + a.costo, 0);
  const diasUnicos = new Set(alimentacionMes.map(a => a.fecha)).size;
  const consumoPromedio = diasUnicos > 0 ? consumoTotal / diasUnicos : 0;

  document.getElementById('consumoTotalMes').textContent = `${consumoTotal.toFixed(1)} kg`;
  document.getElementById('costoTotalMes').textContent = `$${costoTotal.toFixed(2)} ${appData.config.moneda}`;
  document.getElementById('consumoPromedioDia').textContent = `${consumoPromedio.toFixed(1)} kg/día`;
}

function updateAlimentacionTable() {
  const tbody = document.getElementById('alimentacionTable');
  let sortedAlim = [...appData.alimentacion].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  
  // Filter for non-admins
  if (currentUser && !tienePermiso('ver_datos_otros')) {
    sortedAlim = sortedAlim.filter(a => a.autor_id === currentUser.id);
  }

  tbody.innerHTML = sortedAlim.map(alim => {
    const estanque = appData.estanques.find(e => e.id === alim.estanque_id);
    const costoPorKg = alim.cantidad_kg > 0 ? (alim.costo / alim.cantidad_kg).toFixed(2) : 0;

    return `
      <tr>
        <td>${formatDate(alim.fecha)}</td>
        <td>${estanque ? estanque.nombre : 'N/A'}</td>
        <td>${alim.tipo}</td>
        <td>${alim.cantidad_kg}</td>
        <td>$${alim.costo.toFixed(2)}</td>
        <td>$${costoPorKg}</td>
      </tr>
      ${alim.autor_nombre ? `<tr><td colspan="6" style="padding: 4px 12px; font-size: 11px; color: var(--color-text-secondary); border-bottom: 2px solid var(--color-border);">Registrado por: ${alim.autor_nombre}</td></tr>` : ''}
    `;
  }).join('');
}

function agregarAlimentacion() {
  if (!tienePermiso('ingresar_datos')) {
    showToast('No tiene permisos para ingresar datos', 'error');
    return;
  }

  const alimentacion = {
    id: nextId.alimentacion++,
    estanque_id: parseInt(document.getElementById('alimentEstanque').value),
    fecha: document.getElementById('alimentFecha').value,
    tipo: document.getElementById('alimentTipo').value,
    cantidad_kg: parseFloat(document.getElementById('alimentCantidad').value),
    costo: parseFloat(document.getElementById('alimentCosto').value),
    autor_id: currentUser.id,
    autor_nombre: currentUser.nombre
  };

  appData.alimentacion.push(alimentacion);
  updateAlimentacionStats();
  updateAlimentacionTable();
  updateConsumoChart();
  document.getElementById('formAlimentacion').reset();
  setCurrentDate();
  showToast('Alimentación registrada correctamente', 'success');
}

function updateConsumoChart() {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const alimentacionMes = appData.alimentacion.filter(a => {
    const fecha = new Date(a.fecha);
    return fecha.getMonth() === currentMonth && fecha.getFullYear() === currentYear;
  });

  // Group by date and sum
  const consumoPorDia = {};
  alimentacionMes.forEach(a => {
    const fecha = formatDate(a.fecha);
    if (!consumoPorDia[fecha]) {
      consumoPorDia[fecha] = 0;
    }
    consumoPorDia[fecha] += a.cantidad_kg;
  });

  const labels = Object.keys(consumoPorDia).sort();
  const data = labels.map(label => consumoPorDia[label]);

  if (charts.consumoChart) charts.consumoChart.destroy();
  const ctx = document.getElementById('consumoChart');
  if (ctx) {
    charts.consumoChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Consumo (kg)',
          data: data,
          backgroundColor: '#2e8b57',
          borderColor: '#1a5c3a',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } }
      }
    });
  }
}

// ==========================================
// COSECHAS
// ==========================================
function loadCosechas() {
  populateSelects();
  updateCosechasTable();
}

function updateCosechasTable() {
  const tbody = document.getElementById('cosechasTable');
  const sortedCosechas = [...appData.cosechas].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

  tbody.innerHTML = sortedCosechas.map(cosecha => {
    const estanque = appData.estanques.find(e => e.id === cosecha.estanque_id);
    const lote = appData.lotes.find(l => l.id === cosecha.lote_id);
    const pesoPromedio = cosecha.cantidad_peces > 0 ? (cosecha.peso_total_kg / cosecha.cantidad_peces * 1000).toFixed(1) : 0;
    const diasCultivo = lote ? calcularDiasCultivo(lote.fecha_siembra, cosecha.fecha) : 'N/A';
    const mortalidadPct = lote ? ((cosecha.mortalidad_peces / lote.cantidad_inicial) * 100).toFixed(1) : 0;
    const ingreso = cosecha.precio_venta ? (cosecha.peso_total_kg * cosecha.precio_venta).toFixed(2) : 'N/A';

    return `
      <tr>
        <td>${formatDate(cosecha.fecha)}</td>
        <td>${estanque ? estanque.nombre : 'N/A'}</td>
        <td>${cosecha.cantidad_peces}</td>
        <td>${cosecha.peso_total_kg} kg</td>
        <td>${pesoPromedio} g</td>
        <td>${diasCultivo}</td>
        <td>${cosecha.mortalidad_peces} (${mortalidadPct}%)</td>
        <td>${ingreso !== 'N/A' ? '$' + ingreso : 'N/A'}</td>
      </tr>
    `;
  }).join('');
}

function agregarCosecha() {
  const loteId = parseInt(document.getElementById('cosechaLote').value);
  const lote = appData.lotes.find(l => l.id === loteId);

  if (!lote) {
    showToast('Lote no encontrado', 'error');
    return;
  }

  const precioVenta = document.getElementById('cosechaPrecio').value;

  const cosecha = {
    id: nextId.cosechas++,
    estanque_id: lote.estanque_id,
    lote_id: loteId,
    fecha: document.getElementById('cosechaFecha').value,
    cantidad_peces: parseInt(document.getElementById('cosechaCantidad').value),
    peso_total_kg: parseFloat(document.getElementById('cosechaPeso').value),
    mortalidad_peces: parseInt(document.getElementById('cosechaMortalidad').value) || 0,
    observaciones: document.getElementById('cosechaObservaciones').value,
    precio_venta: precioVenta ? parseFloat(precioVenta) : null
  };

  // Mark lote as cosechado
  lote.estado = 'cosechado';

  appData.cosechas.push(cosecha);
  updateCosechasTable();
  populateSelects();
  document.getElementById('formCosecha').reset();
  setCurrentDate();
  showToast('Cosecha registrada correctamente', 'success');
}

// ==========================================
// REPORTES
// ==========================================
function loadReportes() {
  updateProduccionChart();
  updateCostosChart();
  updateRendimientoTable();
}

function updateProduccionChart() {
  const produccionPorEstanque = {};

  appData.cosechas.forEach(cosecha => {
    const estanque = appData.estanques.find(e => e.id === cosecha.estanque_id);
    const nombre = estanque ? estanque.nombre : `Estanque ${cosecha.estanque_id}`;

    if (!produccionPorEstanque[nombre]) {
      produccionPorEstanque[nombre] = 0;
    }
    produccionPorEstanque[nombre] += cosecha.peso_total_kg;
  });

  const labels = Object.keys(produccionPorEstanque);
  const data = Object.values(produccionPorEstanque);

  if (charts.produccionChart) charts.produccionChart.destroy();
  const ctx = document.getElementById('produccionChart');
  if (ctx) {
    charts.produccionChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Producción (kg)',
          data: data,
          backgroundColor: '#2e8b57',
          borderColor: '#1a5c3a',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } }
      }
    });
  }
}

function updateCostosChart() {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const alimentacionMes = appData.alimentacion.filter(a => {
    const fecha = new Date(a.fecha);
    return fecha.getMonth() === currentMonth && fecha.getFullYear() === currentYear;
  });

  const costosPorEstanque = {};

  alimentacionMes.forEach(alim => {
    const estanque = appData.estanques.find(e => e.id === alim.estanque_id);
    const nombre = estanque ? estanque.nombre : `Estanque ${alim.estanque_id}`;

    if (!costosPorEstanque[nombre]) {
      costosPorEstanque[nombre] = 0;
    }
    costosPorEstanque[nombre] += alim.costo;
  });

  const labels = Object.keys(costosPorEstanque);
  const data = Object.values(costosPorEstanque);

  if (charts.costosChart) charts.costosChart.destroy();
  const ctx = document.getElementById('costosChart');
  if (ctx) {
    charts.costosChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F'],
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    });
  }
}

function updateRendimientoTable() {
  const tbody = document.getElementById('rendimientoTable');
  
  const rendimiento = appData.estanques.map(estanque => {
    // Count lotes
    const lotes = appData.lotes.filter(l => l.estanque_id === estanque.id);
    const lotesCosechados = lotes.filter(l => l.estado === 'cosechado');

    // Total production
    const produccion = appData.cosechas
      .filter(c => c.estanque_id === estanque.id)
      .reduce((sum, c) => sum + c.peso_total_kg, 0);

    // Total feed consumption
    const consumoAlimento = appData.alimentacion
      .filter(a => a.estanque_id === estanque.id)
      .reduce((sum, a) => sum + a.cantidad_kg, 0);

    // Feed conversion ratio
    const conversionAlimenticia = produccion > 0 ? (consumoAlimento / produccion).toFixed(2) : 'N/A';

    // Average days in cultivation
    let diasPromedio = 'N/A';
    if (lotesCosechados.length > 0) {
      const totalDias = lotesCosechados.reduce((sum, lote) => {
        const cosecha = appData.cosechas.find(c => c.lote_id === lote.id);
        if (cosecha) {
          return sum + calcularDiasCultivo(lote.fecha_siembra, cosecha.fecha);
        }
        return sum;
      }, 0);
      diasPromedio = Math.round(totalDias / lotesCosechados.length);
    }

    return {
      estanque: estanque.nombre,
      lotes: lotes.length,
      produccion: produccion.toFixed(1),
      consumo: consumoAlimento.toFixed(1),
      conversion: conversionAlimenticia,
      diasPromedio: diasPromedio
    };
  });

  tbody.innerHTML = rendimiento.map(r => `
    <tr>
      <td>${r.estanque}</td>
      <td>${r.lotes}</td>
      <td>${r.produccion} kg</td>
      <td>${r.consumo} kg</td>
      <td>${r.conversion}</td>
      <td>${r.diasPromedio}</td>
    </tr>
  `).join('');
}

// ==========================================
// CONFIGURACION
// ==========================================
function loadConfiguracion() {
  document.getElementById('configTempMin').value = appData.config.temp_min;
  document.getElementById('configTempMax').value = appData.config.temp_max;
  document.getElementById('configOxMin').value = appData.config.ox_min;
  document.getElementById('configPhMin').value = appData.config.ph_min;
  document.getElementById('configPhMax').value = appData.config.ph_max;
  document.getElementById('configMoneda').value = appData.config.moneda;
}

function guardarConfiguracion() {
  appData.config.temp_min = parseFloat(document.getElementById('configTempMin').value);
  appData.config.temp_max = parseFloat(document.getElementById('configTempMax').value);
  appData.config.ox_min = parseFloat(document.getElementById('configOxMin').value);
  appData.config.ph_min = parseFloat(document.getElementById('configPhMin').value);
  appData.config.ph_max = parseFloat(document.getElementById('configPhMax').value);
  appData.config.moneda = document.getElementById('configMoneda').value;

  showToast('Configuración guardada correctamente', 'success');
}

function mostrarModalReset() {
  if (!tienePermiso('reset_datos')) {
    showToast('Solo los administradores pueden resetear los datos', 'error');
    return;
  }
  const modal = document.getElementById('resetModal');
  modal.classList.add('active');
}

function cerrarModalReset() {
  const modal = document.getElementById('resetModal');
  modal.classList.remove('active');
}

// ==========================================
// VENTAS MODULE
// ==========================================

function loadVentas() {
  updateVentasDashboard();
  populateVentasSelects();
  showVentasTab('clientes');
}

function showVentasTab(tabName) {
  // Update tabs
  document.querySelectorAll('.ventas-tab').forEach(tab => {
    tab.classList.remove('active');
    if (tab.dataset.ventasTab === tabName) {
      tab.classList.add('active');
    }
  });

  // Update subsections
  document.querySelectorAll('.ventas-subsection').forEach(section => {
    section.classList.remove('active');
  });

  const subsectionMap = {
    'clientes': 'ventasClientes',
    'registrar': 'ventasRegistrar',
    'historial': 'ventasHistorial',
    'cobros': 'ventasCobros',
    'reportes': 'ventasReportes'
  };

  const subsectionId = subsectionMap[tabName];
  if (subsectionId) {
    document.getElementById(subsectionId).classList.add('active');
  }

  // Load data for each tab
  switch(tabName) {
    case 'clientes':
      updateClientesTable();
      break;
    case 'registrar':
      populateVentasSelects();
      calcularResumenVenta();
      break;
    case 'historial':
      updateVentasHistorialTable();
      break;
    case 'cobros':
      updateCobrosData();
      break;
    case 'reportes':
      updateVentasReportes();
      break;
  }
}

function updateVentasDashboard() {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const ventasMes = appData.ventas.filter(v => {
    const fecha = new Date(v.fecha);
    return fecha.getMonth() === currentMonth && fecha.getFullYear() === currentYear;
  });

  // Total ventas
  document.getElementById('ventasTotalMes').textContent = ventasMes.length;

  // Ingresos totales
  const ingresosMes = ventasMes.reduce((sum, v) => sum + v.total, 0);
  document.getElementById('ventasIngresosMes').textContent = `${ventasConfig.simbolo}${ingresosMes.toFixed(2)}`;

  // Ganancia neta
  const gananciaMes = ventasMes.reduce((sum, v) => sum + v.ganancia_neta, 0);
  document.getElementById('ventasGananciaMes').textContent = `${ventasConfig.simbolo}${gananciaMes.toFixed(2)}`;

  // Margen promedio
  const margenProm = ventasMes.length > 0 
    ? ventasMes.reduce((sum, v) => sum + v.margen_pct, 0) / ventasMes.length 
    : 0;
  document.getElementById('ventasMargenProm').textContent = `${margenProm.toFixed(1)}%`;
}

function populateVentasSelects() {
  // Populate clientes select
  const clienteSelect = document.getElementById('ventaCliente');
  if (clienteSelect) {
    clienteSelect.innerHTML = appData.clientes
      .map(c => `<option value="${c.id}">${c.nombre} (${c.tipo})</option>`)
      .join('');
  }

  // Populate estanques select for ventas
  const estanqueSelect = document.getElementById('ventaEstanque');
  if (estanqueSelect) {
    estanqueSelect.innerHTML = appData.estanques
      .map(e => `<option value="${e.id}">${e.nombre}</option>`)
      .join('');
  }
}

// ==========================================
// CLIENTES MANAGEMENT
// ==========================================

function agregarCliente() {
  const cliente = {
    id: nextId.clientes++,
    nombre: document.getElementById('clienteNombre').value,
    telefono: document.getElementById('clienteTelefono').value,
    email: document.getElementById('clienteEmail').value || '',
    direccion: document.getElementById('clienteDireccion').value || '',
    tipo: document.getElementById('clienteTipo').value,
    fecha_registro: new Date().toISOString().split('T')[0],
    ultima_compra: null
  };

  appData.clientes.push(cliente);
  updateClientesTable();
  populateVentasSelects();
  document.getElementById('formCliente').reset();
  showToast(`Cliente ${cliente.nombre} agregado correctamente`, 'success');
}

function updateClientesTable() {
  const tbody = document.getElementById('clientesTable');
  const searchTerm = document.getElementById('buscarCliente')?.value.toLowerCase() || '';
  
  let filteredClientes = appData.clientes;
  if (searchTerm) {
    filteredClientes = appData.clientes.filter(c => 
      c.nombre.toLowerCase().includes(searchTerm) ||
      c.telefono.includes(searchTerm) ||
      c.email.toLowerCase().includes(searchTerm)
    );
  }

  tbody.innerHTML = filteredClientes.map(cliente => {
    const ventasCliente = appData.ventas.filter(v => v.cliente_id === cliente.id);
    const totalCompras = ventasCliente.reduce((sum, v) => sum + v.total, 0);
    const ultimaCompra = cliente.ultima_compra ? formatDate(cliente.ultima_compra) : 'Nunca';

    return `
      <tr>
        <td>${cliente.id}</td>
        <td>${cliente.nombre}</td>
        <td>${cliente.telefono}</td>
        <td>${cliente.email || 'N/A'}</td>
        <td><span class="tipo-${cliente.tipo}">${cliente.tipo}</span></td>
        <td>${ultimaCompra}</td>
        <td>${ventasConfig.simbolo}${totalCompras.toFixed(2)}</td>
        <td>
          <button class="btn btn-sm btn-secondary" onclick="verHistorialCliente(${cliente.id})">Ver Historial</button>
          <button class="btn btn-sm btn-danger" onclick="eliminarCliente(${cliente.id})">Eliminar</button>
        </td>
      </tr>
    `;
  }).join('');
}

function filtrarClientes(searchTerm) {
  updateClientesTable();
}

function eliminarCliente(id) {
  if (!confirm('¿Está seguro de eliminar este cliente?')) return;
  
  // Check if cliente has ventas
  const tieneVentas = appData.ventas.some(v => v.cliente_id === id);
  if (tieneVentas) {
    showToast('No se puede eliminar un cliente con ventas registradas', 'error');
    return;
  }
  
  appData.clientes = appData.clientes.filter(c => c.id !== id);
  updateClientesTable();
  populateVentasSelects();
  showToast('Cliente eliminado', 'info');
}

function verHistorialCliente(clienteId) {
  const cliente = appData.clientes.find(c => c.id === clienteId);
  if (!cliente) return;
  
  const ventasCliente = appData.ventas.filter(v => v.cliente_id === clienteId);
  
  let mensaje = `Historial de ${cliente.nombre}:\n\n`;
  mensaje += `Total de compras: ${ventasCliente.length}\n`;
  mensaje += `Monto total: ${ventasConfig.simbolo}${ventasCliente.reduce((s, v) => s + v.total, 0).toFixed(2)}\n\n`;
  mensaje += `Últimas compras:\n`;
  
  ventasCliente.slice(-5).reverse().forEach(v => {
    mensaje += `- ${formatDate(v.fecha)}: ${v.cantidad_kg}kg - ${ventasConfig.simbolo}${v.total.toFixed(2)}\n`;
  });
  
  alert(mensaje);
}

// ==========================================
// VENTAS REGISTRATION
// ==========================================

function calcularResumenVenta() {
  const cantidad = parseFloat(document.getElementById('ventaCantidadKg')?.value) || 0;
  const precioUnitario = parseFloat(document.getElementById('ventaPrecioUnitario')?.value) || 0;
  const descuentoPct = parseFloat(document.getElementById('ventaDescuento')?.value) || 0;
  const estanqueId = parseInt(document.getElementById('ventaEstanque')?.value) || 0;

  // Calculate subtotal
  let subtotal = cantidad * precioUnitario;
  const descuento = subtotal * (descuentoPct / 100);
  subtotal = subtotal - descuento;

  // Calculate IVA
  const iva = subtotal * (ventasConfig.iva_porcentaje / 100);

  // Calculate total
  const total = subtotal + iva;

  // Calculate costo producción (based on alimentación)
  const costoProduccion = calcularCostoProduccion(estanqueId, cantidad);

  // Calculate ganancia neta
  const gananciaNeta = subtotal - costoProduccion;

  // Calculate margen
  const margen = subtotal > 0 ? (gananciaNeta / subtotal * 100) : 0;

  // Update UI
  document.getElementById('ventaSubtotal').textContent = `${ventasConfig.simbolo}${subtotal.toFixed(2)}`;
  document.getElementById('ventaIVA').textContent = `${ventasConfig.simbolo}${iva.toFixed(2)}`;
  document.getElementById('ventaTotal').textContent = `${ventasConfig.simbolo}${total.toFixed(2)}`;
  document.getElementById('ventaCostoProduccion').textContent = `${ventasConfig.simbolo}${costoProduccion.toFixed(2)}`;
  document.getElementById('ventaGananciaNeta').textContent = `${ventasConfig.simbolo}${gananciaNeta.toFixed(2)}`;
  document.getElementById('ventaMargen').textContent = `${margen.toFixed(1)}%`;
}

function calcularCostoProduccion(estanqueId, cantidadKg) {
  // Calculate based on feed consumption for this estanque
  const alimentacionEstanque = appData.alimentacion.filter(a => a.estanque_id === estanqueId);
  
  if (alimentacionEstanque.length === 0) return cantidadKg * 15; // Default estimate
  
  // Total feed cost
  const costoTotal = alimentacionEstanque.reduce((sum, a) => sum + a.costo, 0);
  const cantidadTotal = alimentacionEstanque.reduce((sum, a) => sum + a.cantidad_kg, 0);
  
  // Estimate production
  const produccionEstimada = cantidadTotal / 1.5; // FCR aproximado de 1.5
  
  // Cost per kg produced
  const costoPorKg = produccionEstimada > 0 ? costoTotal / produccionEstimada : 15;
  
  return cantidadKg * costoPorKg;
}

function agregarVenta() {
  if (!tienePermiso('ingresar_datos')) {
    showToast('No tiene permisos para ingresar datos', 'error');
    return;
  }

  const cantidad = parseFloat(document.getElementById('ventaCantidadKg').value);
  const precioUnitario = parseFloat(document.getElementById('ventaPrecioUnitario').value);
  const descuentoPct = parseFloat(document.getElementById('ventaDescuento').value) || 0;
  const estanqueId = parseInt(document.getElementById('ventaEstanque').value);
  const clienteId = parseInt(document.getElementById('ventaCliente').value);
  const metodoPago = document.getElementById('ventaMetodoPago').value;
  
  // Calculate amounts
  let subtotal = cantidad * precioUnitario;
  const descuento = subtotal * (descuentoPct / 100);
  subtotal = subtotal - descuento;
  const iva = subtotal * (ventasConfig.iva_porcentaje / 100);
  const total = subtotal + iva;
  const costoProduccion = calcularCostoProduccion(estanqueId, cantidad);
  const gananciaNeta = subtotal - costoProduccion;
  const margen = subtotal > 0 ? (gananciaNeta / subtotal * 100) : 0;

  const venta = {
    id: nextId.ventas++,
    factura_numero: nextFacturaNumero++,
    fecha: document.getElementById('ventaFecha').value,
    cliente_id: clienteId,
    estanque_id: estanqueId,
    cantidad_kg: cantidad,
    precio_unitario: precioUnitario,
    descuento_pct: descuentoPct,
    subtotal: subtotal,
    iva: iva,
    total: total,
    metodo_pago: metodoPago,
    estado_pago: metodoPago === 'Crédito' ? 'pendiente' : 'pagado',
    fecha_vencimiento: metodoPago === 'Crédito' ? document.getElementById('ventaFechaVencimiento').value : null,
    fecha_pago: metodoPago !== 'Crédito' ? document.getElementById('ventaFecha').value : null,
    costo_produccion: costoProduccion,
    ganancia_neta: gananciaNeta,
    margen_pct: margen,
    observaciones: document.getElementById('ventaObservaciones').value || '',
    registrado_por: currentUser.nombre,
    autor_id: currentUser.id,
    fecha_registro: new Date().toISOString()
  };

  appData.ventas.push(venta);
  
  // Update cliente ultima_compra
  const cliente = appData.clientes.find(c => c.id === clienteId);
  if (cliente) {
    cliente.ultima_compra = venta.fecha;
  }

  updateVentasDashboard();
  limpiarFormVenta();
  showToast(`Venta registrada - Factura #${venta.factura_numero}`, 'success');
  
  // Ask if want to see factura
  if (confirm('¿Desea ver la factura?')) {
    mostrarFactura(venta.id);
  }
}

function limpiarFormVenta() {
  document.getElementById('formVenta').reset();
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('ventaFecha').value = today;
  document.getElementById('ventaDescuento').value = 0;
  document.getElementById('ventaFechaVencimientoGroup').style.display = 'none';
  calcularResumenVenta();
}

// ==========================================
// VENTAS HISTORIAL
// ==========================================

function updateVentasHistorialTable() {
  const tbody = document.getElementById('ventasHistorialTable');
  const filtro = document.getElementById('filtroMesVentas')?.value || 'actual';
  
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  let ventasFiltradas = appData.ventas;
  
  if (filtro === 'actual') {
    ventasFiltradas = appData.ventas.filter(v => {
      const fecha = new Date(v.fecha);
      return fecha.getMonth() === currentMonth && fecha.getFullYear() === currentYear;
    });
  } else if (filtro === 'anterior') {
    const anteriorMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const anteriorYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    ventasFiltradas = appData.ventas.filter(v => {
      const fecha = new Date(v.fecha);
      return fecha.getMonth() === anteriorMonth && fecha.getFullYear() === anteriorYear;
    });
  }
  
  const sortedVentas = [...ventasFiltradas].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

  tbody.innerHTML = sortedVentas.map(venta => {
    const cliente = appData.clientes.find(c => c.id === venta.cliente_id);
    const estadoClass = venta.estado_pago === 'pagado' ? 'status-pagado' : 
                       venta.estado_pago === 'vencido' ? 'status-vencido' : 'status-pendiente';

    return `
      <tr>
        <td><strong>${venta.factura_numero}</strong></td>
        <td>${formatDate(venta.fecha)}</td>
        <td>${cliente ? cliente.nombre : 'N/A'}</td>
        <td>${venta.cantidad_kg} kg</td>
        <td>${ventasConfig.simbolo}${venta.precio_unitario.toFixed(2)}</td>
        <td><strong>${ventasConfig.simbolo}${venta.total.toFixed(2)}</strong></td>
        <td>${venta.metodo_pago}</td>
        <td><span class="status-badge ${estadoClass}">${venta.estado_pago}</span></td>
        <td>
          <button class="btn btn-sm btn-primary" onclick="mostrarFactura(${venta.id})">Ver Factura</button>
          ${venta.estado_pago === 'pendiente' ? `<button class="btn btn-sm btn-secondary" onclick="marcarComoPagado(${venta.id})">Pagar</button>` : ''}
        </td>
      </tr>
    `;
  }).join('');
}

function mostrarFactura(ventaId) {
  const venta = appData.ventas.find(v => v.id === ventaId);
  if (!venta) return;
  
  const cliente = appData.clientes.find(c => c.id === venta.cliente_id);
  const estanque = appData.estanques.find(e => e.id === venta.estanque_id);
  
  const facturaHTML = `
    <div class="factura-viewer">
      <div class="factura-header">
        <div class="factura-logo">
          <h2>AquaFarm Manager</h2>
          <p>Sistema de Gestión de Granjas</p>
        </div>
        <div class="factura-numero">
          <h3>FACTURA #${venta.factura_numero}</h3>
          <p>Fecha: ${formatDate(venta.fecha)}</p>
          <p>Método: ${venta.metodo_pago}</p>
        </div>
      </div>
      
      <div class="factura-info">
        <div class="factura-cliente">
          <h4>CLIENTE</h4>
          <p><strong>${cliente ? cliente.nombre : 'N/A'}</strong></p>
          <p>${cliente?.direccion || ''}</p>
          <p>Tel: ${cliente?.telefono || ''}</p>
          <p>Email: ${cliente?.email || ''}</p>
          <p>Tipo: ${cliente?.tipo || ''}</p>
        </div>
        <div class="factura-datos">
          <h4>DATOS DE PRODUCCIÓN</h4>
          <p>Origen: ${estanque ? estanque.nombre : 'N/A'}</p>
          <p>Cantidad: ${venta.cantidad_kg} kg</p>
          <p>Precio/kg: ${ventasConfig.simbolo}${venta.precio_unitario.toFixed(2)}</p>
          ${venta.descuento_pct > 0 ? `<p>Descuento: ${venta.descuento_pct}%</p>` : ''}
        </div>
      </div>
      
      <div class="factura-detalle">
        <table>
          <thead>
            <tr>
              <th>Descripción</th>
              <th>Cantidad</th>
              <th>Precio Unit.</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Bagre Fresco - ${estanque ? estanque.nombre : 'Estanque'}</td>
              <td>${venta.cantidad_kg} kg</td>
              <td>${ventasConfig.simbolo}${venta.precio_unitario.toFixed(2)}</td>
              <td>${ventasConfig.simbolo}${(venta.cantidad_kg * venta.precio_unitario).toFixed(2)}</td>
            </tr>
            ${venta.descuento_pct > 0 ? `
            <tr>
              <td colspan="3" style="text-align: right;">Descuento (${venta.descuento_pct}%):</td>
              <td>-${ventasConfig.simbolo}${((venta.cantidad_kg * venta.precio_unitario) * (venta.descuento_pct / 100)).toFixed(2)}</td>
            </tr>
            ` : ''}
          </tbody>
        </table>
      </div>
      
      <div class="factura-totales">
        <div class="factura-totales-row">
          <span>Subtotal:</span>
          <strong>${ventasConfig.simbolo}${venta.subtotal.toFixed(2)}</strong>
        </div>
        <div class="factura-totales-row">
          <span>IVA (16%):</span>
          <strong>${ventasConfig.simbolo}${venta.iva.toFixed(2)}</strong>
        </div>
        <div class="factura-totales-row total">
          <span>TOTAL:</span>
          <strong>${ventasConfig.simbolo}${venta.total.toFixed(2)}</strong>
        </div>
      </div>
      
      ${venta.observaciones ? `<p style="margin: 16px 0; padding: 12px; background: #f8f9fa; border-radius: 6px;"><strong>Observaciones:</strong> ${venta.observaciones}</p>` : ''}
      
      <div class="factura-footer">
        <p>Gracias por su compra</p>
        <p>Registrado por: ${venta.registrado_por} | ${new Date(venta.fecha_registro).toLocaleString('es-MX')}</p>
      </div>
    </div>
  `;
  
  // Create modal
  const modal = document.createElement('div');
  modal.className = 'modal-factura active';
  modal.innerHTML = `
    <div class="modal-factura-content">
      <div class="modal-factura-header">
        <h3>Factura #${venta.factura_numero}</h3>
        <div class="modal-factura-actions">
          <button class="btn btn-sm btn-secondary" onclick="imprimirFactura()">Imprimir</button>
          <button class="btn btn-sm btn-primary" onclick="descargarFacturaPDF(${venta.id})">Descargar PDF</button>
          <button class="btn btn-sm btn-secondary" onclick="enviarWhatsApp(${venta.id})">WhatsApp</button>
          <button class="btn-close-modal" onclick="cerrarFactura()">×</button>
        </div>
      </div>
      ${facturaHTML}
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Close on outside click
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      cerrarFactura();
    }
  });
}

function cerrarFactura() {
  const modal = document.querySelector('.modal-factura');
  if (modal) {
    modal.remove();
  }
}

function imprimirFactura() {
  window.print();
}

function descargarFacturaPDF(ventaId) {
  showToast('Función de descarga PDF simulada', 'info');
  // In real app, would generate PDF using library like jsPDF
}

function enviarWhatsApp(ventaId) {
  const venta = appData.ventas.find(v => v.id === ventaId);
  const cliente = appData.clientes.find(c => c.id === venta.cliente_id);
  
  if (!cliente || !cliente.telefono) {
    showToast('Cliente no tiene teléfono registrado', 'error');
    return;
  }
  
  const mensaje = `Hola ${cliente.nombre}, tu factura #${venta.factura_numero} por ${ventasConfig.simbolo}${venta.total.toFixed(2)} está lista. Gracias por tu compra!`;
  const url = `https://wa.me/${cliente.telefono.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(mensaje)}`;
  
  window.open(url, '_blank');
}

// ==========================================
// COBROS Y PAGOS
// ==========================================

function updateCobrosData() {
  const ventasPendientes = appData.ventas.filter(v => v.estado_pago === 'pendiente' || v.estado_pago === 'vencido');
  const totalPorCobrar = ventasPendientes.reduce((sum, v) => sum + v.total, 0);
  
  // Check for vencidas
  const today = new Date();
  ventasPendientes.forEach(venta => {
    if (venta.fecha_vencimiento) {
      const vencimiento = new Date(venta.fecha_vencimiento);
      if (vencimiento < today && venta.estado_pago === 'pendiente') {
        venta.estado_pago = 'vencido';
      }
    }
  });
  
  const ventasVencidas = ventasPendientes.filter(v => v.estado_pago === 'vencido');
  const totalVencidas = ventasVencidas.reduce((sum, v) => sum + v.total, 0);
  
  // Cobrado este mes
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const ventasCobradas = appData.ventas.filter(v => {
    if (v.estado_pago !== 'pagado' || !v.fecha_pago) return false;
    const fechaPago = new Date(v.fecha_pago);
    return fechaPago.getMonth() === currentMonth && fechaPago.getFullYear() === currentYear;
  });
  const totalCobradoMes = ventasCobradas.reduce((sum, v) => sum + v.total, 0);
  
  document.getElementById('totalPorCobrar').textContent = `${ventasConfig.simbolo}${totalPorCobrar.toFixed(2)}`;
  document.getElementById('totalVencidas').textContent = `${ventasConfig.simbolo}${totalVencidas.toFixed(2)}`;
  document.getElementById('totalCobradoMes').textContent = `${ventasConfig.simbolo}${totalCobradoMes.toFixed(2)}`;
  
  updateVentasPendientesTable();
  updateHistorialPagosTable();
}

function updateVentasPendientesTable() {
  const tbody = document.getElementById('ventasPendientesTable');
  const ventasPendientes = appData.ventas.filter(v => 
    v.estado_pago === 'pendiente' || v.estado_pago === 'vencido'
  ).sort((a, b) => {
    if (!a.fecha_vencimiento) return 1;
    if (!b.fecha_vencimiento) return -1;
    return new Date(a.fecha_vencimiento) - new Date(b.fecha_vencimiento);
  });
  
  const today = new Date();
  
  tbody.innerHTML = ventasPendientes.map(venta => {
    const cliente = appData.clientes.find(c => c.id === venta.cliente_id);
    const vencimiento = venta.fecha_vencimiento ? new Date(venta.fecha_vencimiento) : null;
    const diasVencido = vencimiento ? Math.floor((today - vencimiento) / (1000 * 60 * 60 * 24)) : 0;
    const isVencido = diasVencido > 0;
    
    return `
      <tr style="${isVencido ? 'background: rgba(220, 53, 69, 0.05);' : ''}">
        <td><strong>${venta.factura_numero}</strong></td>
        <td>${cliente ? cliente.nombre : 'N/A'}</td>
        <td>${formatDate(venta.fecha)}</td>
        <td style="${isVencido ? 'color: var(--danger-color); font-weight: bold;' : ''}">
          ${vencimiento ? formatDate(venta.fecha_vencimiento) : 'N/A'}
        </td>
        <td><strong>${ventasConfig.simbolo}${venta.total.toFixed(2)}</strong></td>
        <td style="${isVencido ? 'color: var(--danger-color); font-weight: bold;' : ''}">
          ${isVencido ? `${diasVencido} días` : 'Al corriente'}
        </td>
        <td>
          <button class="btn btn-sm btn-primary" onclick="marcarComoPagado(${venta.id})">Marcar Pagado</button>
        </td>
      </tr>
    `;
  }).join('');
}

function updateHistorialPagosTable() {
  const tbody = document.getElementById('historialPagosTable');
  const ventasPagadas = appData.ventas
    .filter(v => v.estado_pago === 'pagado' && v.fecha_pago)
    .sort((a, b) => new Date(b.fecha_pago) - new Date(a.fecha_pago))
    .slice(0, 20); // Last 20 payments
  
  tbody.innerHTML = ventasPagadas.map(venta => {
    const cliente = appData.clientes.find(c => c.id === venta.cliente_id);
    
    return `
      <tr>
        <td>${formatDate(venta.fecha_pago)}</td>
        <td>${venta.factura_numero}</td>
        <td>${cliente ? cliente.nombre : 'N/A'}</td>
        <td><strong>${ventasConfig.simbolo}${venta.total.toFixed(2)}</strong></td>
        <td>${venta.metodo_pago}</td>
      </tr>
    `;
  }).join('');
}

function marcarComoPagado(ventaId) {
  const venta = appData.ventas.find(v => v.id === ventaId);
  if (!venta) return;
  
  const fechaPago = prompt('Fecha de pago (YYYY-MM-DD):', new Date().toISOString().split('T')[0]);
  if (!fechaPago) return;
  
  venta.estado_pago = 'pagado';
  venta.fecha_pago = fechaPago;
  
  updateCobrosData();
  updateVentasHistorialTable();
  updateVentasDashboard();
  showToast(`Factura #${venta.factura_numero} marcada como pagada`, 'success');
}

// ==========================================
// REPORTES DE VENTAS
// ==========================================

function updateVentasReportes() {
  updateVentasPorDiaChart();
  updateIngresosVsCostosChart();
  updateMetodosPagoChart();
  updateTopClientesTable();
  updateRentabilidadEstanquesTable();
}

function updateVentasPorDiaChart() {
  const ventasUltimos30 = appData.ventas
    .filter(v => {
      const fecha = new Date(v.fecha);
      const hace30Dias = new Date();
      hace30Dias.setDate(hace30Dias.getDate() - 30);
      return fecha >= hace30Dias;
    })
    .sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
  
  // Group by day
  const ventasPorDia = {};
  ventasUltimos30.forEach(v => {
    const fecha = formatDate(v.fecha);
    if (!ventasPorDia[fecha]) {
      ventasPorDia[fecha] = { cantidad: 0, total: 0 };
    }
    ventasPorDia[fecha].cantidad += 1;
    ventasPorDia[fecha].total += v.total;
  });
  
  const labels = Object.keys(ventasPorDia);
  const dataTotal = labels.map(l => ventasPorDia[l].total);
  const dataCantidad = labels.map(l => ventasPorDia[l].cantidad);
  
  if (charts.ventasPorDiaChart) charts.ventasPorDiaChart.destroy();
  const ctx = document.getElementById('ventasPorDiaChart');
  if (ctx) {
    charts.ventasPorDiaChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Ingresos (MXN)',
            data: dataTotal,
            borderColor: '#2e8b57',
            backgroundColor: 'rgba(46, 139, 87, 0.1)',
            tension: 0.4,
            yAxisID: 'y'
          },
          {
            label: 'Cantidad de Ventas',
            data: dataCantidad,
            borderColor: '#0066cc',
            backgroundColor: 'rgba(0, 102, 204, 0.1)',
            tension: 0.4,
            yAxisID: 'y1'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false
        },
        scales: {
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            title: { display: true, text: 'Ingresos (MXN)' }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            title: { display: true, text: 'Cantidad' },
            grid: { drawOnChartArea: false }
          }
        }
      }
    });
  }
}

function updateIngresosVsCostosChart() {
  const now = new Date();
  const meses = [];
  const ingresos = [];
  const costos = [];
  const ganancias = [];
  
  // Last 6 months
  for (let i = 5; i >= 0; i--) {
    const fecha = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const mes = fecha.toLocaleDateString('es-MX', { month: 'short', year: '2-digit' });
    meses.push(mes);
    
    const ventasMes = appData.ventas.filter(v => {
      const vFecha = new Date(v.fecha);
      return vFecha.getMonth() === fecha.getMonth() && vFecha.getFullYear() === fecha.getFullYear();
    });
    
    const ingresoMes = ventasMes.reduce((sum, v) => sum + v.total, 0);
    const costoMes = ventasMes.reduce((sum, v) => sum + v.costo_produccion, 0);
    const gananciaMes = ventasMes.reduce((sum, v) => sum + v.ganancia_neta, 0);
    
    ingresos.push(ingresoMes);
    costos.push(costoMes);
    ganancias.push(gananciaMes);
  }
  
  if (charts.ingresosVsCostosChart) charts.ingresosVsCostosChart.destroy();
  const ctx = document.getElementById('ingresosVsCostosChart');
  if (ctx) {
    charts.ingresosVsCostosChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: meses,
        datasets: [
          {
            label: 'Ingresos',
            data: ingresos,
            backgroundColor: '#2e8b57'
          },
          {
            label: 'Costos',
            data: costos,
            backgroundColor: '#dc3545'
          },
          {
            label: 'Ganancia',
            data: ganancias,
            backgroundColor: '#28a745'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }
}

function updateMetodosPagoChart() {
  const metodosPago = {};
  appData.ventas.forEach(v => {
    if (!metodosPago[v.metodo_pago]) {
      metodosPago[v.metodo_pago] = 0;
    }
    metodosPago[v.metodo_pago] += v.total;
  });
  
  const labels = Object.keys(metodosPago);
  const data = Object.values(metodosPago);
  
  if (charts.metodosPagoChart) charts.metodosPagoChart.destroy();
  const ctx = document.getElementById('metodosPagoChart');
  if (ctx) {
    charts.metodosPagoChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    });
  }
}

function updateTopClientesTable() {
  const tbody = document.getElementById('topClientesTable');
  
  const clientesStats = appData.clientes.map(cliente => {
    const ventasCliente = appData.ventas.filter(v => v.cliente_id === cliente.id);
    const totalKg = ventasCliente.reduce((sum, v) => sum + v.cantidad_kg, 0);
    const totalIngresos = ventasCliente.reduce((sum, v) => sum + v.total, 0);
    const ticketPromedio = ventasCliente.length > 0 ? totalIngresos / ventasCliente.length : 0;
    
    return {
      cliente: cliente.nombre,
      totalKg: totalKg,
      totalIngresos: totalIngresos,
      ticketPromedio: ticketPromedio
    };
  }).sort((a, b) => b.totalKg - a.totalKg).slice(0, 5);
  
  tbody.innerHTML = clientesStats.map(c => `
    <tr>
      <td><strong>${c.cliente}</strong></td>
      <td>${c.totalKg.toFixed(1)} kg</td>
      <td>${ventasConfig.simbolo}${c.totalIngresos.toFixed(2)}</td>
      <td>${ventasConfig.simbolo}${c.ticketPromedio.toFixed(2)}</td>
    </tr>
  `).join('');
}

function updateRentabilidadEstanquesTable() {
  const tbody = document.getElementById('rentabilidadEstanquesTable');
  
  const estanquesStats = appData.estanques.map(estanque => {
    const ventasEstanque = appData.ventas.filter(v => v.estanque_id === estanque.id);
    const totalKg = ventasEstanque.reduce((sum, v) => sum + v.cantidad_kg, 0);
    const totalIngresos = ventasEstanque.reduce((sum, v) => sum + v.total, 0);
    const totalCostos = ventasEstanque.reduce((sum, v) => sum + v.costo_produccion, 0);
    const ganancia = totalIngresos - totalCostos;
    const margen = totalIngresos > 0 ? (ganancia / totalIngresos * 100) : 0;
    
    return {
      estanque: estanque.nombre,
      totalKg: totalKg,
      totalIngresos: totalIngresos,
      totalCostos: totalCostos,
      ganancia: ganancia,
      margen: margen
    };
  }).sort((a, b) => b.ganancia - a.ganancia);
  
  tbody.innerHTML = estanquesStats.map(e => `
    <tr>
      <td><strong>${e.estanque}</strong></td>
      <td>${e.totalKg.toFixed(1)} kg</td>
      <td>${ventasConfig.simbolo}${e.totalIngresos.toFixed(2)}</td>
      <td>${ventasConfig.simbolo}${e.totalCostos.toFixed(2)}</td>
      <td style="color: ${e.ganancia >= 0 ? 'var(--success-color)' : 'var(--danger-color)'};"><strong>${ventasConfig.simbolo}${e.ganancia.toFixed(2)}</strong></td>
      <td style="color: ${e.margen >= 35 ? 'var(--success-color)' : 'var(--warning-color)'};"><strong>${e.margen.toFixed(1)}%</strong></td>
    </tr>
  `).join('');
}

function confirmarReset() {
  if (!tienePermiso('reset_datos')) {
    showToast('No tiene permisos para esta acción', 'error');
    cerrarModalReset();
    return;
  }
  
  // Close modal
  cerrarModalReset();

  // Reset all data to initial empty state
  appData = {
    estanques: [],
    lotes: [],
    parametros: [],
    alimentacion: [],
    cosechas: [],
    config: {
      temp_min: 26,
      temp_max: 32,
      ox_min: 5,
      ph_min: 6.5,
      ph_max: 8.5,
      moneda: 'MXN'
    }
  };

  nextId = {
    estanques: 1,
    lotes: 1,
    parametros: 1,
    alimentacion: 1,
    cosechas: 1
  };

  // Destroy all chart instances
  Object.keys(charts).forEach(key => {
    if (charts[key]) {
      charts[key].destroy();
    }
  });
  charts = {};

  // Reload all sections
  showToast('¡Aplicación reiniciada! Todos los registros han sido eliminados.', 'success');
  
  // Return to dashboard
  showSection('dashboard');
  loadDashboard();
  
  // Update all selects
  populateSelects();
}

function resetearDatos() {
  // Legacy function - now redirects to modal
  mostrarModalReset();
}

// ==========================================
// EXPORT
// ==========================================
function exportarDatos() {
  let csv = 'REPORTE DE GRANJAS DE BAGRE\n\n';

  // Estanques
  csv += 'ESTANQUES\n';
  csv += 'ID,Nombre,Area (m2),Capacidad,Profundidad (m),Estado\n';
  appData.estanques.forEach(e => {
    csv += `${e.id},${e.nombre},${e.area_m2},${e.capacidad_peces},${e.profundidad_m},${e.estado}\n`;
  });
  csv += '\n';

  // Lotes
  csv += 'LOTES\n';
  csv += 'ID,Estanque ID,Fecha Siembra,Cantidad,Tamano (cm),Peso (g),Estado\n';
  appData.lotes.forEach(l => {
    csv += `${l.id},${l.estanque_id},${l.fecha_siembra},${l.cantidad_inicial},${l.tamano_promedio_cm},${l.peso_promedio_g},${l.estado}\n`;
  });
  csv += '\n';

  // Parametros
  csv += 'PARAMETROS\n';
  csv += 'ID,Estanque ID,Fecha,Temp Min,Temp Max,Oxigeno,pH\n';
  appData.parametros.forEach(p => {
    csv += `${p.id},${p.estanque_id},${p.fecha},${p.temp_min},${p.temp_max},${p.oxigeno},${p.ph}\n`;
  });
  csv += '\n';

  // Alimentacion
  csv += 'ALIMENTACION\n';
  csv += 'ID,Estanque ID,Fecha,Tipo,Cantidad (kg),Costo\n';
  appData.alimentacion.forEach(a => {
    csv += `${a.id},${a.estanque_id},${a.fecha},${a.tipo},${a.cantidad_kg},${a.costo}\n`;
  });
  csv += '\n';

  // Cosechas
  csv += 'COSECHAS\n';
  csv += 'ID,Estanque ID,Lote ID,Fecha,Cantidad Peces,Peso Total (kg),Mortalidad,Precio Venta\n';
  appData.cosechas.forEach(c => {
    csv += `${c.id},${c.estanque_id},${c.lote_id},${c.fecha},${c.cantidad_peces},${c.peso_total_kg},${c.mortalidad_peces},${c.precio_venta || 'N/A'}\n`;
  });

  // Download
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `aquafarm_export_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);

  showToast('Datos exportados correctamente', 'success');
}

// ==========================================
// UTILITIES
// ==========================================
function formatDate(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
    ${message}
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'slideIn 0.3s ease reverse';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Make functions global
window.iniciarSesion = iniciarSesion;
window.cerrarSesion = cerrarSesion;
window.ingresoRapidoDemo = ingresoRapidoDemo;
window.mostrarRecuperarPassword = mostrarRecuperarPassword;
window.mostrarCrearCuenta = mostrarCrearCuenta;
window.volverALogin = volverALogin;
window.recuperarPassword = recuperarPassword;
window.crearNuevaCuenta = crearNuevaCuenta;
window.agregarColaborador = agregarColaborador;
window.eliminarColaborador = eliminarColaborador;
window.showSection = showSection;
window.editarEstanque = editarEstanque;
window.eliminarEstanque = eliminarEstanque;
window.eliminarLote = eliminarLote;
window.exportarDatos = exportarDatos;
window.resetearDatos = resetearDatos;
window.mostrarModalReset = mostrarModalReset;
window.cerrarModalReset = cerrarModalReset;
window.confirmarReset = confirmarReset;
window.limpiarFormVenta = limpiarFormVenta;
window.calcularResumenVenta = calcularResumenVenta;
window.verHistorialCliente = verHistorialCliente;
window.eliminarCliente = eliminarCliente;
window.mostrarFactura = mostrarFactura;
window.cerrarFactura = cerrarFactura;
window.imprimirFactura = imprimirFactura;
window.descargarFacturaPDF = descargarFacturaPDF;
window.enviarWhatsApp = enviarWhatsApp;
window.marcarComoPagado = marcarComoPagado;

// Close modal when clicking outside
window.onclick = function(event) {
  const modal = document.getElementById('resetModal');
  if (event.target === modal) {
    cerrarModalReset();
  }
};