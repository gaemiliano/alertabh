import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapPin, Camera, Bell, Users, Menu, Plus, Clock, AlertCircle, Navigation, Send, X, Check, User, Settings, Trophy, Star, Lock, LogOut, Award, CheckCircle, Crown, Palette, Fuel, Bike, Trash2, Cloud, Download, Upload, Shield, DollarSign } from 'lucide-react';

// ============================================
// CORREÇÃO DE ÍCONES DO LEAFLET
// ============================================
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// ============================================
// ÍCONES PERSONALIZADOS DO MAPA
// ============================================

// Ícone do Usuário (Bolinha Azul Pulsante)
const userPulseIcon = new L.DivIcon({
  className: 'user-pulse-icon',
  html: `<div style="background-color: #3b82f6; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; position: relative; box-shadow: 0 0 10px rgba(0,0,0,0.3);">
           <div style="position: absolute; top: -12px; left: -12px; width: 36px; height: 36px; background-color: rgba(59, 130, 246, 0.4); border-radius: 50%; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
         </div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
  popupAnchor: [0, -10]
});

// Ícone de Alerta/Blitz (Radar Vermelho Pulsante)
const alertPulseIcon = new L.DivIcon({
  className: 'alert-pulse-icon',
  html: `<div style="background-color: #ef4444; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; position: relative; box-shadow: 0 0 10px rgba(0,0,0,0.5);">
           <div style="position: absolute; top: -18px; left: -18px; width: 46px; height: 46px; border: 2px solid rgba(239, 68, 68, 0.6); border-radius: 50%; animation: radar 2s linear infinite;"></div>
           <div style="position: absolute; top: -8px; left: -8px; width: 26px; height: 26px; background-color: rgba(239, 68, 68, 0.4); border-radius: 50%; animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
         </div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
  popupAnchor: [0, -10]
});

// ============================================
// COMPONENTE: MOVIMENTAÇÃO DO MAPA
// ============================================
function LocationMarker({ position }) {
  const map = useMap();
  
  useEffect(() => {
    if (position) {
      map.flyTo(position, 15, { animate: true, duration: 1.5 });
    }
  }, [position, map]);

  return position === null ? null : (
    <Marker position={position} icon={userPulseIcon}>
      <Popup>Você está aqui</Popup>
    </Marker>
  );
}

// ============================================
// TELA DE LOGIN
// ============================================
function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (email === 'admin' && password === 'admin') {
      onLogin({ name: 'Administrador', type: 'admin', level: 99 });
    } else if (email === 'user' && password === 'user') {
      onLogin({ name: 'João Silva', type: 'user', level: 12 });
    } else {
      setError('Credenciais inválidas. Tente: admin/admin ou user/user');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 items-center justify-center p-6 text-white">
      <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-blue-500/50">
        <Shield className="w-12 h-12 text-white" />
      </div>
      <h1 className="text-3xl font-bold mb-2">AlertaBH 5.0</h1>
      <p className="text-gray-400 mb-8 text-center">Monitoramento e Segurança</p>

      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <div>
          <label className="text-sm text-gray-400 pl-1">Usuário</label>
          <input 
            type="text" 
            placeholder="Ex: user ou admin" 
            value={email} 
            onChange={e => setEmail(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-xl p-4 text-white focus:border-blue-500 outline-none transition-all"
            required
          />
        </div>
        <div>
          <label className="text-sm text-gray-400 pl-1">Senha</label>
          <input 
            type="password" 
            placeholder="Senha" 
            value={password} 
            onChange={e => setPassword(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-xl p-4 text-white focus:border-blue-500 outline-none transition-all"
            required
          />
        </div>
        {error && (
          <div className="bg-red-500 bg-opacity-20 border border-red-500 rounded-lg p-3">
            <p className="text-red-500 text-sm text-center">{error}</p>
          </div>
        )}
        <button 
          type="submit" 
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl shadow-lg transition-all transform active:scale-95"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}

// ============================================
// APP PRINCIPAL
// ============================================
export default function AlertaBHApp() {
  // ============================================
  // ESTADOS GLOBAIS
  // ============================================
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);
  const [currentView, setCurrentView] = useState('map'); 
  const [reportStep, setReportStep] = useState(1);
  const [isPremium, setIsPremium] = useState(false);
  
  // Map & GPS
  const [userPosition, setUserPosition] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Report Flow
  const [hasPhoto, setHasPhoto] = useState(false);
  const [gpsLocked, setGpsLocked] = useState(false);
  const [alertType, setAlertType] = useState('');
  const [expirationTime, setExpirationTime] = useState('30');

  // Configurações
  const [notificationRadius, setNotificationRadius] = useState('5');
  const [selectedTheme, setSelectedTheme] = useState('dark');

  // Combustível
  const [fuelType, setFuelType] = useState('');
  const [fuelQuantity, setFuelQuantity] = useState('5');

  // ============================================
  // DADOS E CONFIGURAÇÕES
  // ============================================
  
  // Calcula estatísticas REAIS baseadas nos alertas
  const userStats = {
    name: userData?.name || 'Usuário',
    level: userData?.level || 1,
    points: alerts.length * 50, // 50 pontos por alerta
    ranking: Math.max(1, 100 - alerts.length * 3), // Ranking melhora com alertas
    totalAlerts: alerts.length,
    verified: alerts.filter(a => a.createdBy === userData?.name).length,
    badges: Math.min(8, Math.floor(alerts.length / 3)) // 1 badge a cada 3 alertas
  };

  const alertTypes = [
    { id: 'blitz', label: 'Blitz Policial', icon: '🚔', color: 'red' },
    { id: 'acidente', label: 'Acidente', icon: '🚗', color: 'orange' },
    { id: 'congestionamento', label: 'Trânsito Lento', icon: '🚦', color: 'yellow' },
    { id: 'obra', label: 'Obra na Via', icon: '🚧', color: 'amber' }
  ];

  const themes = [
    { id: 'dark', name: 'Escuro Clássico', preview: 'bg-gray-900', free: true },
    { id: 'blue', name: 'Azul Oceano', preview: 'bg-blue-900', free: true },
    { id: 'neon', name: 'Neon Cyberpunk', preview: 'bg-purple-900', premium: true },
    { id: 'sunset', name: 'Pôr do Sol', preview: 'bg-gradient-to-br from-orange-500 to-pink-600', premium: true }
  ];

  const fuelOptions = [
    { id: 'gasolina', name: 'Gasolina Comum', price: 5.89, icon: '⛽' },
    { id: 'gasolina-aditivada', name: 'Gasolina Aditivada', price: 6.09, icon: '⛽' },
    { id: 'etanol', name: 'Etanol', price: 3.99, icon: '🌱' },
    { id: 'diesel', name: 'Diesel', price: 5.59, icon: '🚛' }
  ];

  const badges = [
    { id: 1, name: 'Novato', icon: '🌱', earned: alerts.length >= 1 },
    { id: 2, name: 'Vigilante', icon: '👁️', earned: alerts.length >= 3 },
    { id: 3, name: 'Protetor', icon: '🛡️', earned: alerts.length >= 5 },
    { id: 4, name: 'Herói', icon: '🦸', earned: alerts.length >= 10 }
  ];

  // ============================================
  // FUNÇÕES DE NUVEM (LOCALSTORAGE)
  // ============================================
  const saveToCloud = (dataToSave) => {
    try {
      localStorage.setItem('alertaBH_data', JSON.stringify({
        ...dataToSave,
        timestamp: new Date().toISOString()
      }));
    } catch (e) {
      console.error('Erro ao salvar:', e);
    }
  };

  const handleCloudSave = () => {
    try {
      saveToCloud({
        alerts,
        notifications,
        selectedTheme,
        isPremium
      });
      alert("☁️ Backup salvo com sucesso na nuvem!");
    } catch (e) {
      console.error('Erro ao salvar:', e);
      alert("❌ Erro ao salvar. Tente novamente.");
    }
  };

  const handleCloudLoad = () => {
    try {
      const saved = localStorage.getItem('alertaBH_data');
      if (saved) {
        const data = JSON.parse(saved);
        setAlerts(data.alerts || []);
        setNotifications(data.notifications || []);
        setSelectedTheme(data.selectedTheme || 'dark');
        setIsPremium(data.isPremium || false);
        alert("☁️ Dados restaurados com sucesso!");
      } else {
        alert("⚠️ Nenhum backup encontrado na nuvem.");
      }
    } catch (e) {
      console.error('Erro ao carregar:', e);
      alert("❌ Erro ao carregar dados. Tente novamente.");
    }
  };

  // ============================================
  // FUNÇÕES DE LÓGICA
  // ============================================
  const handleLogin = (user) => {
    setUserData(user);
    setIsAuthenticated(true);
    
    // Auto-load dos dados salvos
    try {
      const saved = localStorage.getItem('alertaBH_data');
      if (saved) {
        const data = JSON.parse(saved);
        setAlerts(data.alerts || []);
        setNotifications(data.notifications || []);
        setSelectedTheme(data.selectedTheme || 'dark');
        setIsPremium(data.isPremium || false);
      }
    } catch (e) {
      console.error('Erro ao carregar dados do login:', e);
    }
  };

  const handleLogout = () => {
    if (window.confirm("Tem certeza que deseja sair?")) {
      setIsAuthenticated(false);
      setUserData(null);
      setCurrentView('map');
      setUserPosition(null);
      setGpsLocked(false);
    }
  };

  const handleDeleteAlert = (id) => {
    if (userData.type !== 'admin') {
      alert("❌ Apenas administradores podem remover alertas!");
      return;
    }
    
    if (window.confirm("🔐 Admin: Tem certeza que deseja remover este alerta?")) {
      const newAlerts = alerts.filter(a => a.id !== id);
      setAlerts(newAlerts);
      
      // Adicionar notificação sobre remoção
      const removedAlert = alerts.find(a => a.id === id);
      const newNotif = {
        id: Date.now(),
        type: 'removed',
        title: 'Alerta Removido',
        desc: `${removedAlert?.type} em ${removedAlert?.location}`,
        time: 'Agora',
        read: false
      };
      setNotifications(prev => [newNotif, ...prev]);
      
      saveToCloud({
        alerts: newAlerts,
        notifications: [newNotif, ...notifications],
        selectedTheme,
        isPremium
      });
    }
  };

  const handleDeleteNotification = (id) => {
    const newNotifications = notifications.filter(n => n.id !== id);
    setNotifications(newNotifications);
    saveToCloud({
      alerts,
      notifications: newNotifications,
      selectedTheme,
      isPremium
    });
  };

  const resetReportFlow = () => {
    setReportStep(1);
    setAlertType('');
    setHasPhoto(false);
    setGpsLocked(false);
    setExpirationTime('30');
  };

  const handleGPSLock = () => {
    if (!("geolocation" in navigator)) {
      alert("❌ GPS não suportado neste navegador.");
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const position = [pos.coords.latitude, pos.coords.longitude];
        setUserPosition(position);
        setGpsLocked(true);
        setTimeout(() => setReportStep(2), 800);
      },
      (err) => {
        console.error('Erro GPS:', err);
        alert("❌ Erro ao obter localização GPS. Verifique as permissões do navegador.");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handlePhotoCapture = () => {
    setHasPhoto(true);
    setTimeout(() => setReportStep(3), 800);
  };

  const handleSubmitReport = () => {
    if (!alertType) {
      alert("⚠️ Selecione um tipo de alerta!");
      return;
    }
    
    setReportStep(5);
    
    setTimeout(() => {
      const now = new Date();
      const newAlert = {
        id: Date.now(),
        lat: userPosition ? userPosition[0] : -19.9200,
        lng: userPosition ? userPosition[1] : -43.9400,
        type: alertType.toLowerCase(),
        time: 'Agora',
        verified: 1,
        location: 'Minha Localização',
        createdBy: userData?.name,
        createdAt: now.toISOString()
      };
      
      const newAlerts = [...alerts, newAlert];
      setAlerts(newAlerts);
      
      // Criar notificação REAL do novo alerta
      const newNotif = {
        id: Date.now(),
        type: 'created',
        title: 'Alerta Criado!',
        desc: `${alertType} reportado com sucesso`,
        time: 'Agora',
        read: false
      };
      const newNotifications = [newNotif, ...notifications];
      setNotifications(newNotifications);
      
      // Salvar tudo
      saveToCloud({
        alerts: newAlerts,
        notifications: newNotifications,
        selectedTheme,
        isPremium
      });
      
      // Reset COMPLETO e voltar ao mapa
      resetReportFlow();
      setCurrentView('map');
    }, 1500);
  };

  const handleFuelOrder = () => {
    if (!fuelType) {
      alert("⚠️ Selecione um tipo de combustível!");
      return;
    }
    
    const selectedFuel = fuelOptions.find(f => f.id === fuelType);
    const total = (selectedFuel.price * parseInt(fuelQuantity) + 15).toFixed(2);
    
    if (window.confirm(`🚚 Confirmar pedido?\n\n${selectedFuel.name}\nQuantidade: ${fuelQuantity}L\nTotal: R$ ${total}\n\nTempo estimado: 30 minutos`)) {
      // Criar notificação do pedido
      const newNotif = {
        id: Date.now(),
        type: 'fuel',
        title: 'Pedido Confirmado!',
        desc: `${fuelQuantity}L de ${selectedFuel.name} - R$ ${total}`,
        time: 'Agora',
        read: false
      };
      const newNotifications = [newNotif, ...notifications];
      setNotifications(newNotifications);
      
      saveToCloud({
        alerts,
        notifications: newNotifications,
        selectedTheme,
        isPremium
      });
      
      alert("✅ Pedido confirmado! Um motoboy está a caminho da sua localização.");
      setFuelType('');
      setFuelQuantity('5');
    }
  };

  // ============================================
  // RENDER: BOTTOM NAVIGATION
  // ============================================
  const renderBottomNav = () => (
    <div className="bg-gray-800 border-t border-gray-700 flex justify-around p-3 z-[1001] relative">
      <button 
        onClick={() => setCurrentView('map')} 
        className={`flex flex-col items-center gap-1 transition-all ${currentView === 'map' ? 'text-blue-400' : 'text-gray-400'}`}
      >
        <MapPin className="w-6 h-6" />
        <span className="text-[10px]">Mapa</span>
      </button>
      
      <button 
        onClick={() => setCurrentView('notifications')} 
        className={`flex flex-col items-center gap-1 relative transition-all ${currentView === 'notifications' ? 'text-blue-400' : 'text-gray-400'}`}
      >
        <Bell className="w-6 h-6" />
        <span className="text-[10px]">Alertas</span>
        {notifications.filter(n => !n.read).length > 0 && (
          <div className="absolute top-0 right-2 w-2 h-2 bg-red-500 rounded-full"></div>
        )}
      </button>
      
      <button 
        onClick={() => setCurrentView('fuel')} 
        className={`flex flex-col items-center gap-1 transition-all ${currentView === 'fuel' ? 'text-blue-400' : 'text-gray-400'}`}
      >
        <Fuel className="w-6 h-6" />
        <span className="text-[10px]">SOS</span>
      </button>
      
      <button 
        onClick={() => setCurrentView('profile')} 
        className={`flex flex-col items-center gap-1 transition-all ${currentView === 'profile' ? 'text-blue-400' : 'text-gray-400'}`}
      >
        <User className="w-6 h-6" />
        <span className="text-[10px]">Perfil</span>
      </button>
    </div>
  );

  // ============================================
  // RENDER PRINCIPAL
  // ============================================
  if (!isAuthenticated) return <LoginScreen onLogin={handleLogin} />;

  const currentThemeColor = themes.find(t => t.id === selectedTheme)?.preview || 'bg-gray-900';

  return (
    <div className={`flex flex-col h-screen ${currentThemeColor} max-w-md mx-auto overflow-hidden transition-colors duration-500`}>
      
      {/* CSS para animações */}
      <style>{`
        @keyframes ping { 
          75%, 100% { transform: scale(2); opacity: 0; } 
        }
        @keyframes radar { 
          0% { transform: scale(0.5); opacity: 0.8; } 
          100% { transform: scale(2.5); opacity: 0; } 
        }
      `}</style>

      {/* ========================================== */}
      {/* VIEW: MAPA */}
      {/* ========================================== */}
      {currentView === 'map' && (
        <>
          {/* Header */}
          <div className={`p-4 shadow-lg z-[1001] relative flex justify-between items-center ${userData.type === 'admin' ? 'bg-red-900' : 'bg-blue-600'} text-white`}>
            <div className="flex items-center gap-3">
              <Menu 
                className="w-6 h-6 cursor-pointer hover:opacity-80 transition-opacity" 
                onClick={() => setCurrentView('settings')} 
              />
              <div>
                <h1 className="text-xl font-bold leading-none">AlertaBH</h1>
                {userData.type === 'admin' && (
                  <span className="text-[10px] bg-white text-red-900 px-1 rounded font-bold uppercase">Admin Mode</span>
                )}
              </div>
            </div>
            <div className="flex gap-4">
              {isPremium && <Crown className="w-5 h-5 text-yellow-400" />}
            </div>
          </div>

          {/* Mapa */}
          <div className="flex-1 relative z-0">
            <MapContainer 
              center={[-19.9167, -43.9345]} 
              zoom={13} 
              style={{ height: "100%", width: "100%" }} 
              zoomControl={false}
            >
              <TileLayer 
                attribution='&copy; OpenStreetMap' 
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
              />
              <LocationMarker position={userPosition} />
              
              {alerts.map((alert) => (
                <Marker 
                  key={alert.id} 
                  position={[alert.lat, alert.lng]} 
                  icon={alertPulseIcon}
                >
                  <Popup>
                    <div className="text-center p-1 min-w-[150px]">
                      <strong className="uppercase text-red-600 block mb-1 text-lg">
                        {alert.type}
                      </strong>
                      <span className="text-gray-700 text-sm">{alert.location}</span>
                      <br/>
                      <span className="text-xs text-gray-500">{alert.time} atrás</span>
                      <br/>
                      <span className="text-xs text-gray-600">Por: {alert.createdBy}</span>
                      
                      {userData.type === 'admin' && (
                        <button 
                          onClick={() => handleDeleteAlert(alert.id)} 
                          className="mt-2 w-full bg-red-600 text-white text-xs py-2 rounded flex items-center justify-center gap-1 hover:bg-red-700 font-bold shadow transition-all"
                        >
                          <Trash2 className="w-3 h-3" /> REMOVER
                        </button>
                      )}
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>

            {/* Botão GPS */}
            <button 
              onClick={handleGPSLock} 
              className="absolute top-4 right-4 z-[999] bg-white p-2 rounded-full shadow-lg text-gray-700 hover:shadow-xl transition-all"
            >
              <Navigation className={`w-6 h-6 ${gpsLocked ? 'text-blue-500 fill-blue-500' : ''}`} />
            </button>

            {/* Botão Report */}
            <button 
              onClick={() => { 
                resetReportFlow(); // RESET COMPLETO antes de abrir
                setCurrentView('report'); 
              }} 
              className="absolute bottom-24 right-4 z-[999] w-16 h-16 bg-red-500 rounded-full shadow-2xl flex items-center justify-center hover:bg-red-600 border-4 border-white animate-bounce transition-all"
            >
              <Plus className="w-8 h-8 text-white" />
            </button>

            {/* Contador de Alertas */}
            <div className="absolute top-4 left-4 z-[999] bg-white rounded-lg shadow-lg p-2 flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
              <span className="text-xs font-bold text-gray-800">{alerts.length} alertas</span>
            </div>
          </div>
          
          {renderBottomNav()}
        </>
      )}

      {/* ========================================== */}
      {/* VIEW: REPORT */}
      {/* ========================================== */}
      {currentView === 'report' && (
        <>
          <div className="bg-gray-800 text-white p-4 flex items-center justify-between">
            <button onClick={() => {
              resetReportFlow(); // RESET ao fechar
              setCurrentView('map');
            }}>
              <X className="w-6 h-6" />
            </button>
            <h2 className="font-bold">Reportar Alerta</h2>
            <div className="w-6"></div>
          </div>
          
          {/* Step 1: GPS */}
          {reportStep === 1 && (
            <div className="flex-1 flex flex-col items-center justify-center text-white p-6">
              <Navigation className={`w-20 h-20 mb-4 ${gpsLocked ? 'text-green-500' : 'text-blue-500 animate-pulse'}`} />
              <h3 className="text-xl font-bold mb-4">
                {gpsLocked ? 'Localização Confirmada ✓' : 'Aguardando GPS...'}
              </h3>
              {!gpsLocked ? (
                <button 
                  onClick={handleGPSLock} 
                  className="bg-blue-600 px-6 py-3 rounded-full font-bold hover:bg-blue-500 transition-all"
                >
                  Ativar GPS
                </button>
              ) : (
                <button 
                  onClick={() => setReportStep(2)} 
                  className="bg-green-600 px-6 py-3 rounded-full font-bold hover:bg-green-500 transition-all"
                >
                  Continuar →
                </button>
              )}
            </div>
          )}

          {/* Step 2: Foto */}
          {reportStep === 2 && (
            <div className="flex-1 bg-black flex items-center justify-center relative">
              <Camera className="w-16 h-16 text-gray-500" />
              <button 
                onClick={handlePhotoCapture} 
                className="absolute bottom-10 w-16 h-16 border-4 border-white rounded-full bg-white/20 hover:bg-white/30 transition-all"
              >
              </button>
              <p className="absolute bottom-32 text-white text-sm">Capture a ocorrência (opcional)</p>
            </div>
          )}

          {/* Step 3: Tipo de Alerta */}
          {reportStep === 3 && (
            <div className="flex-1 p-6 overflow-y-auto">
              <h3 className="text-white text-xl font-bold mb-4">Tipo de Alerta</h3>
              <div className="grid grid-cols-2 gap-4">
                {alertTypes.map(t => (
                  <button 
                    key={t.id} 
                    onClick={() => {
                      setAlertType(t.label); 
                      setReportStep(4);
                    }} 
                    className="bg-gray-800 p-4 rounded-xl border border-gray-600 hover:border-blue-500 hover:bg-gray-700 flex flex-col items-center transition-all"
                  >
                    <div className="text-4xl mb-2">{t.icon}</div>
                    <span className="text-white font-bold text-sm text-center">{t.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Duração */}
          {reportStep === 4 && (
            <div className="flex-1 p-6 text-white overflow-y-auto">
              <h3 className="text-xl font-bold mb-4">Duração do Alerta</h3>
              <div className="bg-gray-800 p-4 rounded mb-4 flex items-center gap-4">
                <Clock className="text-blue-400"/> 
                <input 
                  type="range" 
                  className="flex-1" 
                  min="15" 
                  max="120" 
                  step="15"
                  value={expirationTime} 
                  onChange={e => setExpirationTime(e.target.value)} 
                />
                <span className="w-12 text-right">{expirationTime}m</span>
              </div>
              <div className="bg-gray-800 rounded-xl p-4 mb-4">
                <p className="text-sm text-gray-400 mb-2">Resumo:</p>
                <p className="text-white"><strong>Tipo:</strong> {alertType}</p>
                <p className="text-white"><strong>Duração:</strong> {expirationTime} minutos</p>
                <p className="text-white"><strong>Local:</strong> {gpsLocked ? 'GPS Ativo' : 'Localização Manual'}</p>
                <p className="text-white"><strong>Criado por:</strong> {userData?.name}</p>
              </div>
              <button 
                onClick={handleSubmitReport} 
                className="w-full bg-red-600 hover:bg-red-500 py-4 rounded-xl font-bold flex justify-center gap-2 mt-4 transition-all"
              >
                <Send/> Enviar Alerta
              </button>
            </div>
          )}

          {/* Step 5: Sucesso */}
          {reportStep === 5 && (
            <div className="flex-1 flex flex-col items-center justify-center text-white">
              <CheckCircle className="w-20 h-20 text-green-500 mb-4 animate-bounce" />
              <h2 className="text-2xl font-bold">Alerta Enviado!</h2>
              <p className="text-gray-400 mt-2">A comunidade foi notificada</p>
            </div>
          )}
        </>
      )}

      {/* ========================================== */}
      {/* VIEW: PERFIL (REAL) */}
      {/* ========================================== */}
      {currentView === 'profile' && (
        <>
          <div className="bg-gray-800 p-4 flex items-center justify-between border-b border-gray-700">
            <h2 className="text-white font-bold text-xl">Perfil</h2>
            <Settings 
              className="w-6 h-6 text-gray-400 cursor-pointer hover:text-white transition-colors" 
              onClick={() => setCurrentView('settings')} 
            />
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {/* Card do Usuário */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 mb-6 text-white">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-4xl">
                  {userData.type === 'admin' ? '👮‍♂️' : '👤'}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold">{userStats.name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <Trophy className="w-4 h-4" />
                    <span className="text-sm">Nível {userStats.level}</span>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-xs mb-1">
                  <span>{userStats.points} pts</span>
                  <span>Rank #{userStats.ranking}</span>
                </div>
                <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
                  <div className="bg-white rounded-full h-2" style={{width: `${Math.min(100, (userStats.points / 500) * 100)}%`}}></div>
                </div>
              </div>
            </div>

            {/* Estatísticas REAIS */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-gray-800 rounded-xl p-4 text-center">
                <MapPin className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">{userStats.totalAlerts}</p>
                <p className="text-xs text-gray-400">Alertas</p>
              </div>
              <div className="bg-gray-800 rounded-xl p-4 text-center">
                <CheckCircle className="w-6 h-6 text-green-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">{userStats.verified}</p>
                <p className="text-xs text-gray-400">Criados</p>
              </div>
              <div className="bg-gray-800 rounded-xl p-4 text-center">
                <Award className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">{userStats.badges}</p>
                <p className="text-xs text-gray-400">Conquistas</p>
              </div>
            </div>

            {/* Badges REAIS */}
            <div className="mb-6">
              <h3 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400" />
                Conquistas
              </h3>
              <div className="grid grid-cols-4 gap-3">
                {badges.map(badge => (
                  <div 
                    key={badge.id} 
                    className={`rounded-xl p-3 text-center ${badge.earned ? 'bg-gradient-to-br from-yellow-500 to-orange-500' : 'bg-gray-800 opacity-40'}`}
                  >
                    <div className="text-2xl mb-1">{badge.icon}</div>
                    <p className="text-xs text-white font-semibold">{badge.name}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Botão Premium */}
            <button 
              onClick={() => setCurrentView('premium')} 
              className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:shadow-lg transition-all"
            >
              <Crown className="w-5 h-5" /> Seja Premium
            </button>
          </div>
          
          {renderBottomNav()}
        </>
      )}

      {/* ========================================== */}
      {/* VIEW: NOTIFICAÇÕES (REAL) */}
      {/* ========================================== */}
      {currentView === 'notifications' && (
        <>
          <div className="bg-gray-800 p-4 border-b border-gray-700 flex justify-between items-center">
            <h2 className="text-white font-bold text-lg">Notificações</h2>
            {notifications.length > 0 && (
              <span className="text-xs text-gray-400">{notifications.length} itens</span>
            )}
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 p-6">
                <Bell className="w-16 h-16 mb-4 opacity-50" />
                <p className="text-center">Nenhuma notificação ainda</p>
                <p className="text-sm text-center mt-2">Crie alertas para ver notificações aqui</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-800">
                {notifications.map(notif => (
                  <div 
                    key={notif.id} 
                    className={`p-4 flex gap-4 ${!notif.read ? 'bg-gray-850' : ''}`}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                      notif.type === 'created' ? 'bg-green-500' : 
                      notif.type === 'removed' ? 'bg-red-500' : 
                      notif.type === 'fuel' ? 'bg-orange-500' :
                      'bg-blue-500'
                    }`}>
                      {notif.type === 'created' && <CheckCircle className="w-6 h-6 text-white" />}
                      {notif.type === 'removed' && <Trash2 className="w-6 h-6 text-white" />}
                      {notif.type === 'fuel' && <Fuel className="w-6 h-6 text-white" />}
                      {notif.type === 'verified' && <Star className="w-6 h-6 text-white" />}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-semibold text-sm">{notif.title}</h4>
                      <p className="text-gray-400 text-sm">{notif.desc}</p>
                      <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                    </div>
                    <button 
                      onClick={() => handleDeleteNotification(notif.id)}
                      className="text-gray-500 hover:text-red-500 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {renderBottomNav()}
        </>
      )}

      {/* ========================================== */}
      {/* VIEW: COMBUSTÍVEL (SOS) */}
      {/* ========================================== */}
      {currentView === 'fuel' && (
        <>
          <div className="bg-gray-800 p-4 flex items-center justify-between border-b border-gray-700">
            <h2 className="text-white font-bold text-xl">Entrega de Combustível</h2>
            <Fuel className="w-6 h-6 text-blue-400" />
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {/* Banner */}
            <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 mb-6 text-white">
              <h3 className="text-2xl font-bold mb-2">Pane Seca?</h3>
              <p className="text-sm opacity-90">Entregamos combustível em até 30 minutos!</p>
            </div>

            {/* Seleção de Combustível */}
            <div className="mb-6">
              <h4 className="text-white font-bold mb-3">Escolha o Combustível</h4>
              <div className="space-y-3">
                {fuelOptions.map(fuel => (
                  <button 
                    key={fuel.id} 
                    onClick={() => setFuelType(fuel.id)} 
                    className={`w-full bg-gray-800 rounded-xl p-4 flex items-center justify-between border-2 transition-all hover:bg-gray-700 ${
                      fuelType === fuel.id ? 'border-blue-500' : 'border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{fuel.icon}</div>
                      <div className="text-left">
                        <p className="text-white font-semibold">{fuel.name}</p>
                        <p className="text-gray-400 text-sm">R$ {fuel.price.toFixed(2)} / Litro</p>
                      </div>
                    </div>
                    {fuelType === fuel.id && <Check className="w-6 h-6 text-blue-500" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantidade */}
            <div className="mb-6">
              <h4 className="text-white font-bold mb-3">Quantidade</h4>
              <div className="bg-gray-800 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white">Litros</span>
                  <span className="text-blue-400 font-bold text-xl">{fuelQuantity}L</span>
                </div>
                <input 
                  type="range" 
                  min="5" 
                  max="20" 
                  step="5" 
                  value={fuelQuantity} 
                  onChange={(e) => setFuelQuantity(e.target.value)} 
                  className="w-full" 
                />
                <div className="flex justify-between text-xs text-gray-400 mt-2">
                  <span>5L</span>
                  <span>10L</span>
                  <span>15L</span>
                  <span>20L</span>
                </div>
              </div>
            </div>

            {/* Resumo do Pedido */}
            {fuelType && (
              <div className="bg-gray-800 rounded-xl p-4 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="text-white font-bold">
                    R$ {(fuelOptions.find(f => f.id === fuelType)?.price * parseInt(fuelQuantity)).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400">Taxa de Entrega</span>
                  <span className="text-white font-bold">R$ 15,00</span>
                </div>
                <div className="border-t border-gray-700 pt-2 mt-2 flex justify-between items-center">
                  <span className="text-white font-bold">Total</span>
                  <span className="text-blue-400 font-bold text-xl">
                    R$ {(fuelOptions.find(f => f.id === fuelType)?.price * parseInt(fuelQuantity) + 15).toFixed(2)}
                  </span>
                </div>
              </div>
            )}

            {/* Botão de Pedido */}
            <button 
              disabled={!fuelType} 
              onClick={handleFuelOrder}
              className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                fuelType 
                  ? 'bg-blue-600 text-white hover:bg-blue-500' 
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Bike className="w-5 h-5" /> Solicitar Entrega
            </button>
          </div>
          
          {renderBottomNav()}
        </>
      )}

      {/* ========================================== */}
      {/* VIEW: CONFIGURAÇÕES */}
      {/* ========================================== */}
      {currentView === 'settings' && (
        <>
          <div className="bg-gray-800 p-4 flex gap-3 text-white font-bold border-b border-gray-700">
            <button onClick={() => setCurrentView('map')}>
              <X className="w-6 h-6"/>
            </button> 
            Configurações
          </div>
          
          <div className="flex-1 p-6 overflow-y-auto">
            {/* Nuvem & Backup */}
            <div className="bg-gray-800 rounded-xl p-4 mb-6 border border-gray-700">
              <h3 className="text-blue-400 font-bold mb-3 flex items-center gap-2">
                <Cloud className="w-5 h-5"/> Nuvem & Backup
              </h3>
              <div className="flex gap-3">
                <button 
                  onClick={handleCloudSave} 
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-lg flex flex-col items-center gap-1 transition-all"
                >
                  <Upload className="w-5 h-5 text-green-400"/> 
                  <span className="text-xs">Salvar</span>
                </button>
                <button 
                  onClick={handleCloudLoad} 
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-lg flex flex-col items-center gap-1 transition-all"
                >
                  <Download className="w-5 h-5 text-blue-400"/> 
                  <span className="text-xs">Restaurar</span>
                </button>
              </div>
            </div>

            {/* Temas */}
            <div className="mb-6">
              <h3 className="text-gray-400 text-xs font-semibold uppercase mb-3">Personalização</h3>
              <div className="bg-gray-800 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-4">
                  <Palette className="w-5 h-5 text-blue-400" />
                  <span className="text-white">Temas</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {themes.map(theme => (
                    <button 
                      key={theme.id} 
                      onClick={() => {
                        if (theme.premium && !isPremium) { 
                          alert("🔒 Tema Premium! Assine o plano Plus para desbloquear."); 
                        } else { 
                          setSelectedTheme(theme.id); 
                        }
                      }}
                      className={`rounded-lg p-3 border-2 text-left transition-all relative ${
                        selectedTheme === theme.id ? 'border-blue-500' : 'border-gray-700'
                      } ${theme.premium && !isPremium ? 'opacity-60' : ''}`}
                    >
                      <div className={`h-12 rounded-lg mb-2 ${theme.preview}`}></div>
                      <div className="flex justify-between items-center">
                        <p className="text-white text-xs font-semibold">{theme.name}</p>
                        {theme.premium && !isPremium && <Lock className="w-3 h-3 text-gray-400" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Logout */}
            <button 
              onClick={handleLogout} 
              className="w-full bg-red-500 bg-opacity-20 border border-red-500 text-red-500 rounded-xl p-4 font-semibold flex items-center justify-center gap-3 hover:bg-opacity-30 transition-all"
            >
              <LogOut className="w-5 h-5" /> Sair da conta
            </button>
          </div>
        </>
      )}

      {/* ========================================== */}
      {/* VIEW: PREMIUM */}
      {/* ========================================== */}
      {currentView === 'premium' && (
        <>
          <div className="bg-gray-800 p-4 flex items-center gap-3 border-b border-gray-700">
            <button onClick={() => setCurrentView('profile')}>
              <X className="w-6 h-6 text-white" />
            </button>
            <h2 className="text-white font-bold text-xl">Premium</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Crown className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-white text-2xl font-bold mb-2">Seja Premium</h2>
              <p className="text-gray-400 text-sm">R$ 9,90/mês</p>
            </div>

            {/* Plano */}
            <div className="bg-gray-800 rounded-2xl p-5 border-2 border-blue-500 mb-4">
              <h3 className="text-white text-xl font-bold mb-4">Plano Plus</h3>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-3 text-white">
                  <Check className="w-5 h-5 text-green-400"/>
                  <span className="text-sm">Sem anúncios</span>
                </div>
                <div className="flex items-center gap-3 text-white">
                  <Check className="w-5 h-5 text-green-400"/>
                  <span className="text-sm">Temas exclusivos</span>
                </div>
                <div className="flex items-center gap-3 text-white">
                  <Check className="w-5 h-5 text-green-400"/>
                  <span className="text-sm">Alertas prioritários</span>
                </div>
                <div className="flex items-center gap-3 text-white">
                  <Check className="w-5 h-5 text-green-400"/>
                  <span className="text-sm">Backup ilimitado</span>
                </div>
              </div>
              <button 
                onClick={() => { 
                  setIsPremium(true); 
                  alert("✨ Bem-vindo ao Premium! Agora você tem acesso a todos os recursos exclusivos.");
                  setCurrentView('profile');
                }} 
                className={`w-full py-3 rounded-xl font-bold text-white transition-all ${
                  isPremium ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-500'
                }`} 
                disabled={isPremium}
              >
                {isPremium ? '✓ Você já é Premium!' : 'Assinar Agora'}
              </button>
            </div>
          </div>
        </>
      )}

    </div>
  );
}
