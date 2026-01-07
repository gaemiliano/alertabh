import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapPin, Camera, Bell, Users, Menu, Plus, Clock, AlertCircle, Navigation, Send, X, Check, User, Settings, Trophy, Star, Lock, LogOut, Award, CheckCircle, Crown, Palette, Fuel, Bike, Trash2, Cloud, Download, Upload, Shield, DollarSign, Search, Map as MapIcon, Layers, History, CheckSquare, TrendingUp, Zap } from 'lucide-react';

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

const userPulseIcon = new L.DivIcon({
  className: 'user-pulse-icon',
  html: `<div style="background-color: #3b82f6; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; position: relative; box-shadow: 0 0 10px rgba(0,0,0,0.3);">
           <div style="position: absolute; top: -12px; left: -12px; width: 36px; height: 36px; background-color: rgba(59, 130, 246, 0.4); border-radius: 50%; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
         </div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
  popupAnchor: [0, -10]
});

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
      map.flyTo(position, 14, { animate: true, duration: 1 });
    }
  }, [position, map]);

  return position === null ? null : (
    <Marker position={position} icon={userPulseIcon}>
      <Popup>Você está aqui</Popup>
    </Marker>
  );
}

// ============================================
// COMPONENTE: BUSCA DE ENDEREÇO
// ============================================
function MapSearch({ onLocationFound }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      // Usando Nominatim (OpenStreetMap) para geocoding
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery + ', Belo Horizonte, Brasil')}&limit=1`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        const { lat, lon, display_name } = data[0];
        onLocationFound([parseFloat(lat), parseFloat(lon)], display_name);
        setSearchQuery('');
      } else {
        alert('❌ Endereço não encontrado. Tente outro termo.');
      }
    } catch (error) {
      console.error('Erro na busca:', error);
      alert('❌ Erro ao buscar endereço.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="absolute top-3 right-16 left-4 z-[999] flex gap-2">
      <input
  type="text"
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
  placeholder="Buscar endereço..."
  className="flex-1 bg-white/95 backdrop-blur rounded-lg shadow-md px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
     />
      <button
        onClick={handleSearch}
        disabled={isSearching}
        className="bg-blue-600 text-white p-3 rounded-lg shadow-lg hover:bg-blue-500 disabled:opacity-50 transition-all"
      >
        {isSearching ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <Search className="w-5 h-5" />
        )}
      </button>
    </div>
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
      onLogin({ name: 'João Silva', type: 'user', level: 1 });
    } else {
      setError('Credenciais inválidas. Tente: admin/admin ou user/user');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 items-center justify-center p-6 text-white">
      <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-blue-500/50 animate-pulse">
        <Shield className="w-12 h-12 text-white" />
      </div>
      <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">AlertaBH 5.0</h1>
      <p className="text-gray-300 mb-8 text-center">Monitoramento Inteligente em Tempo Real</p>

      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <div>
          <label className="text-sm text-gray-300 pl-1 font-semibold">Usuário</label>
          <input 
            type="text" 
            placeholder="Ex: user ou admin" 
            value={email} 
            onChange={e => setEmail(e.target.value)}
            className="w-full bg-gray-800/50 backdrop-blur border border-gray-600 rounded-xl p-4 text-white placeholder-gray-400 focus:border-blue-500 outline-none transition-all"
            required
          />
        </div>
        <div>
          <label className="text-sm text-gray-300 pl-1 font-semibold">Senha</label>
          <input 
            type="password" 
            placeholder="Senha" 
            value={password} 
            onChange={e => setPassword(e.target.value)}
            className="w-full bg-gray-800/50 backdrop-blur border border-gray-600 rounded-xl p-4 text-white placeholder-gray-400 focus:border-blue-500 outline-none transition-all"
            required
          />
        </div>
        {error && (
          <div className="bg-red-500/20 backdrop-blur border border-red-500 rounded-lg p-3">
            <p className="text-red-400 text-sm text-center">{error}</p>
          </div>
        )}
        <button 
          type="submit" 
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-4 rounded-xl shadow-lg transition-all transform active:scale-95"
        >
          Entrar no Sistema
        </button>
      </form>
    </div>
  );
}

// ============================================
// APP PRINCIPAL
// ============================================
export default function AlertaBHApp() {
  // Estados Globais
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);
  const [currentView, setCurrentView] = useState('map'); 
  const [reportStep, setReportStep] = useState(1);
  const [isPremium, setIsPremium] = useState(false);
  
  // Map & GPS
  const [userPosition, setUserPosition] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [mapType, setMapType] = useState('tactical'); // 'tactical' ou 'cartographic'
  const [searchedLocation, setSearchedLocation] = useState(null);

  // Report Flow
  const [hasPhoto, setHasPhoto] = useState(false);
  const [photoData, setPhotoData] = useState(null);
  const [gpsLocked, setGpsLocked] = useState(false);
  const [alertType, setAlertType] = useState('');
  const [expirationTime, setExpirationTime] = useState('30');

  // Configurações
  const [selectedTheme, setSelectedTheme] = useState('dark');

  // Combustível
  const [fuelType, setFuelType] = useState('');
  const [fuelQuantity, setFuelQuantity] = useState('5');

  // Conquistas
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);

  // ============================================
  // CONFIGURAÇÕES DE TEMAS (4 TEMAS COMPLETOS)
  // ============================================
  const themes = {
  dark: {
    id: 'dark',
    name: 'Escuro Profissional',
    colors: {
      bg: 'bg-gray-950',
      header: 'bg-gray-900',
      card: 'bg-gray-900',
      text: 'text-gray-100',
      textSecondary: 'text-gray-400',
      border: 'border-gray-800',
      button: 'bg-gray-800 hover:bg-gray-700',
      accent: 'text-blue-400'
    },
    premium: false
  },
  light: {
    id: 'light',
    name: 'Claro Minimalista',
    colors: {
      bg: 'bg-gray-50',
      header: 'bg-white',
      card: 'bg-white',
      text: 'text-gray-900',
      textSecondary: 'text-gray-600',
      border: 'border-gray-200',
      button: 'bg-gray-200 hover:bg-gray-300',
      accent: 'text-blue-600'
    },
    premium: false
  },
  slate: {
    id: 'slate',
    name: 'Cinza Corporativo',
    colors: {
      bg: 'bg-slate-900',
      header: 'bg-slate-800',
      card: 'bg-slate-800',
      text: 'text-slate-100',
      textSecondary: 'text-slate-400',
      border: 'border-slate-700',
      button: 'bg-slate-700 hover:bg-slate-600',
      accent: 'text-slate-300'
    },
    premium: true
  },
  blue: {
    id: 'blue',
    name: 'Azul Executivo',
    colors: {
      bg: 'bg-slate-950',
      header: 'bg-blue-950',
      card: 'bg-blue-950/50',
      text: 'text-blue-50',
      textSecondary: 'text-blue-300',
      border: 'border-blue-900',
      button: 'bg-blue-900 hover:bg-blue-800',
      accent: 'text-blue-400'
    },
    premium: true
  }
};

  const currentTheme = themes[selectedTheme];

  // ============================================
  // TIPOS DE MAPAS
  // ============================================
  const mapTiles = {
    tactical: {
      name: 'Tático Escuro',
      url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      attribution: '&copy; CARTO'
    },
    cartographic: {
      name: 'Cartográfico',
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; OpenStreetMap'
    }
  };

  // ============================================
  // TIPOS DE ALERTAS (10 TIPOS)
  // ============================================
  const alertTypes = [
    { id: 'blitz', label: 'Blitz Policial', icon: '🚔', color: 'red' },
    { id: 'acidente', label: 'Acidente', icon: '🚗', color: 'orange' },
    { id: 'congestionamento', label: 'Trânsito Lento', icon: '🚦', color: 'yellow' },
    { id: 'obra', label: 'Obra na Via', icon: '🚧', color: 'amber' },
    { id: 'buraco', label: 'Buraco na Pista', icon: '🕳️', color: 'brown' },
    { id: 'alagamento', label: 'Alagamento', icon: '🌊', color: 'blue' },
    { id: 'manifestacao', label: 'Manifestação', icon: '📢', color: 'purple' },
    { id: 'veiculo-parado', label: 'Veículo Parado', icon: '🛑', color: 'gray' },
    { id: 'animal', label: 'Animal na Pista', icon: '🐕', color: 'green' },
    { id: 'perigo', label: 'Perigo Geral', icon: '⚠️', color: 'red' }
  ];

  // ============================================
  // SISTEMA DE CONQUISTAS (REAL)
  // ============================================
  const achievements = [
    { 
      id: 'first_alert', 
      name: 'Primeiro Passo', 
      icon: '🌱', 
      description: 'Crie seu primeiro alerta',
      condition: () => alerts.length >= 1,
      points: 50
    },
    { 
      id: 'vigilant', 
      name: 'Vigilante', 
      icon: '👁️', 
      description: 'Crie 5 alertas',
      condition: () => alerts.length >= 5,
      points: 100
    },
    { 
      id: 'protector', 
      name: 'Protetor', 
      icon: '🛡️', 
      description: 'Crie 10 alertas',
      condition: () => alerts.length >= 10,
      points: 200
    },
    { 
      id: 'hero', 
      name: 'Herói da Cidade', 
      icon: '🦸', 
      description: 'Crie 20 alertas',
      condition: () => alerts.length >= 20,
      points: 500
    },
    { 
      id: 'photographer', 
      name: 'Fotógrafo', 
      icon: '📸', 
      description: 'Adicione foto a um alerta',
      condition: () => alerts.some(a => a.hasPhoto),
      points: 75
    },
    { 
      id: 'explorer', 
      name: 'Explorador', 
      icon: '🗺️', 
      description: 'Use busca de endereço',
      condition: () => searchedLocation !== null,
      points: 50
    },
    { 
      id: 'diverse', 
      name: 'Versátil', 
      icon: '🎯', 
      description: 'Crie 3 tipos diferentes de alertas',
      condition: () => {
        const types = new Set(alerts.map(a => a.type));
        return types.size >= 3;
      },
      points: 150
    },
    { 
      id: 'premium', 
      name: 'VIP', 
      icon: '👑', 
      description: 'Torne-se Premium',
      condition: () => isPremium,
      points: 100
    }
  ];

  // Verificar e desbloquear conquistas
  useEffect(() => {
    achievements.forEach(achievement => {
      if (achievement.condition() && !unlockedAchievements.includes(achievement.id)) {
        setUnlockedAchievements(prev => [...prev, achievement.id]);
        
        // Adicionar notificação
        const newNotif = {
          id: Date.now(),
          type: 'achievement',
          title: '🏆 Nova Conquista!',
          desc: `${achievement.icon} ${achievement.name} - +${achievement.points} pts`,
          time: 'Agora',
          read: false,
          achievementId: achievement.id
        };
        setNotifications(prev => [newNotif, ...prev]);
      }
    });
  }, [alerts, isPremium, searchedLocation]);

  // Calcular estatísticas REAIS
  const userStats = {
    name: userData?.name || 'Usuário',
    level: Math.floor(alerts.length / 3) + 1,
    points: alerts.length * 50 + unlockedAchievements.reduce((sum, id) => {
      const achievement = achievements.find(a => a.id === id);
      return sum + (achievement?.points || 0);
    }, 0),
    ranking: Math.max(1, 100 - alerts.length * 3),
    totalAlerts: alerts.length,
    verified: alerts.filter(a => a.createdBy === userData?.name).length,
    badges: unlockedAchievements.length
  };

  const fuelOptions = [
    { id: 'gasolina', name: 'Gasolina Comum', price: 5.89, icon: '⛽' },
    { id: 'gasolina-aditivada', name: 'Gasolina Aditivada', price: 6.09, icon: '⛽' },
    { id: 'etanol', name: 'Etanol', price: 3.99, icon: '🌱' },
    { id: 'diesel', name: 'Diesel', price: 5.59, icon: '🚛' }
  ];

  // ============================================
  // FUNÇÕES DE NUVEM
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
        isPremium,
        unlockedAchievements
      });
      alert("☁️ Backup salvo com sucesso!");
    } catch (e) {
      alert("❌ Erro ao salvar.");
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
        setUnlockedAchievements(data.unlockedAchievements || []);
        alert("☁️ Dados restaurados!");
      } else {
        alert("⚠️ Nenhum backup encontrado.");
      }
    } catch (e) {
      alert("❌ Erro ao carregar.");
    }
  };

  // ============================================
  // FUNÇÕES DE LÓGICA
  // ============================================
  const handleLogin = (user) => {
    setUserData(user);
    setIsAuthenticated(true);
    
    try {
      const saved = localStorage.getItem('alertaBH_data');
      if (saved) {
        const data = JSON.parse(saved);
        setAlerts(data.alerts || []);
        setNotifications(data.notifications || []);
        setSelectedTheme(data.selectedTheme || 'dark');
        setIsPremium(data.isPremium || false);
        setUnlockedAchievements(data.unlockedAchievements || []);
      }
    } catch (e) {
      console.error('Erro ao carregar:', e);
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
    
    if (window.confirm("🔐 Admin: Remover este alerta?")) {
      const newAlerts = alerts.filter(a => a.id !== id);
      setAlerts(newAlerts);
      
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
        isPremium,
        unlockedAchievements
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
      isPremium,
      unlockedAchievements
    });
  };

  const handleNotificationClick = (notif) => {
    // Marcar como lida
    const newNotifications = notifications.map(n => 
      n.id === notif.id ? { ...n, read: true } : n
    );
    setNotifications(newNotifications);
    
    // Se for notificação de alerta, voltar ao mapa
    if (notif.type === 'created' || notif.type === 'nearby') {
      setCurrentView('map');
    }
  };

  const resetReportFlow = () => {
    setReportStep(1);
    setAlertType('');
    setHasPhoto(false);
    setPhotoData(null);
    setGpsLocked(false);
    setExpirationTime('30');
  };

  const handleGPSLock = () => {
    if (!("geolocation" in navigator)) {
      alert("❌ GPS não suportado.");
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
        alert("❌ Erro ao obter GPS. Verifique as permissões.");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // CAMERA REAL (usando input file como fallback seguro)
  const handleCameraCapture = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment'; // Usa câmera traseira em mobile
    
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setPhotoData(event.target.result);
          setHasPhoto(true);
          setTimeout(() => setReportStep(3), 800);
        };
        reader.readAsDataURL(file);
      }
    };
    
    input.click();
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
        createdAt: now.toISOString(),
        hasPhoto: hasPhoto,
        photoData: photoData
      };
      
      const newAlerts = [...alerts, newAlert];
      setAlerts(newAlerts);
      
      const newNotif = {
        id: Date.now(),
        type: 'created',
        title: '✅ Alerta Criado!',
        desc: `${alertType} reportado com sucesso`,
        time: 'Agora',
        read: false,
        alertId: newAlert.id
      };
      const newNotifications = [newNotif, ...notifications];
      setNotifications(newNotifications);
      
      saveToCloud({
        alerts: newAlerts,
        notifications: newNotifications,
        selectedTheme,
        isPremium,
        unlockedAchievements
      });
      
      resetReportFlow();
      setCurrentView('map');
    }, 1500);
  };

  const handleFuelOrder = () => {
    if (!fuelType) {
      alert("⚠️ Selecione um combustível!");
      return;
    }
    
    const selectedFuel = fuelOptions.find(f => f.id === fuelType);
    const total = (selectedFuel.price * parseInt(fuelQuantity) + 15).toFixed(2);
    
    if (window.confirm(`🚚 Confirmar pedido?\n\n${selectedFuel.name}\n${fuelQuantity}L - R$ ${total}`)) {
      const newNotif = {
        id: Date.now(),
        type: 'fuel',
        title: '🚚 Pedido Confirmado!',
        desc: `${fuelQuantity}L de ${selectedFuel.name} - R$ ${total}`,
        time: 'Agora',
        read: false
      };
      setNotifications([newNotif, ...notifications]);
      
      saveToCloud({
        alerts,
        notifications: [newNotif, ...notifications],
        selectedTheme,
        isPremium,
        unlockedAchievements
      });
      
      alert("✅ Pedido confirmado! Chegada em 30min.");
      setFuelType('');
      setFuelQuantity('5');
    }
  };

 const handleLocationFound = (position, name) => {
  setSearchedLocation({ position, name });
  setUserPosition(position);
  
  // Perguntar se quer criar ocorrência
  if (window.confirm(`📍 Local encontrado: ${name}\n\nDeseja criar uma ocorrência neste local?`)) {
    resetReportFlow();
    setGpsLocked(true);
    setUserPosition(position);
    setCurrentView('report');
    setReportStep(2); // Pular GPS, ir direto para foto
  }
};

  // ============================================
  // RENDER: BOTTOM NAVIGATION
  // ============================================
  const renderBottomNav = () => (
    <div className={`${currentTheme.colors.card} border-t ${currentTheme.colors.border} flex justify-around p-2 z-[1001] relative`}>
      <button 
        onClick={() => setCurrentView('map')} 
        className={`flex flex-col items-center gap-1 transition-all ${currentView === 'map' ? currentTheme.colors.accent : currentTheme.colors.textSecondary}`}
      >
        <MapPin className="w-5 h-5" />
        <span className="text-[9px]">Mapa</span>
      </button>
      
      <button 
        onClick={() => setCurrentView('notifications')} 
        className={`flex flex-col items-center gap-1 relative transition-all ${currentView === 'notifications' ? currentTheme.colors.accent : currentTheme.colors.textSecondary}`}
      >
        <Bell className="w-5 h-5" />
        <span className="text-[9px]">Alertas</span>
        {notifications.filter(n => !n.read).length > 0 && (
          <div className="absolute top-0 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
        )}
      </button>
      
      <button 
        onClick={() => setCurrentView('data')} 
        className={`flex flex-col items-center gap-1 transition-all ${currentView === 'data' ? currentTheme.colors.accent : currentTheme.colors.textSecondary}`}
      >
        <History className="w-5 h-5" />
        <span className="text-[9px]">Dados</span>
      </button>
      
      <button 
        onClick={() => setCurrentView('fuel')} 
        className={`flex flex-col items-center gap-1 transition-all ${currentView === 'fuel' ? currentTheme.colors.accent : currentTheme.colors.textSecondary}`}
      >
        <Fuel className="w-5 h-5" />
        <span className="text-[9px]">SOS</span>
      </button>
      
      <button 
        onClick={() => setCurrentView('profile')} 
        className={`flex flex-col items-center gap-1 transition-all ${currentView === 'profile' ? currentTheme.colors.accent : currentTheme.colors.textSecondary}`}
      >
        <User className="w-5 h-5" />
        <span className="text-[9px]">Perfil</span>
      </button>
    </div>
  );

  // ============================================
  // RENDER PRINCIPAL
  // ============================================
  if (!isAuthenticated) return <LoginScreen onLogin={handleLogin} />;

  return (
    <div className={`flex flex-col h-screen ${currentTheme.colors.bg} max-w-md mx-auto overflow-hidden transition-all duration-500`}>
      
      <style>{`
        @keyframes ping { 75%, 100% { transform: scale(2); opacity: 0; } }
        @keyframes radar { 0% { transform: scale(0.5); opacity: 0.8; } 100% { transform: scale(2.5); opacity: 0; } }
      `}</style>

      {/* ========================================== */}
      {/* VIEW: MAPA */}
      {/* ========================================== */}
      {currentView === 'map' && (
        <>
          <div className={`p-4 shadow-lg z-[1001] relative flex justify-between items-center ${userData.type === 'admin' ? 'bg-red-900' : currentTheme.colors.header} ${currentTheme.colors.text}`}>
            <div className="flex items-center gap-3">
              <Menu 
                className="w-6 h-6 cursor-pointer hover:opacity-80" 
                onClick={() => setCurrentView('settings')} 
              />
              <div>
                <h1 className="text-xl font-bold">AlertaBH</h1>
                {userData.type === 'admin' && (
                  <span className="text-[10px] bg-white text-red-900 px-1 rounded font-bold">ADMIN</span>
                )}
              </div>
            </div>
            <div className="flex gap-3 items-center">
              <button
                onClick={() => setMapType(mapType === 'tactical' ? 'cartographic' : 'tactical')}
                className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-all"
                title="Alternar tipo de mapa"
              >
                <Layers className="w-5 h-5" />
              </button>
              {isPremium && <Crown className="w-5 h-5 text-yellow-400" />}
            </div>
          </div>

          <div className="flex-1 relative z-0">
            <MapContainer 
              center={[-19.9167, -43.9345]} 
              zoom={13} 
              style={{ height: "100%", width: "100%" }} 
              zoomControl={false}
            >
              <TileLayer 
                attribution={mapTiles[mapType].attribution}
                url={mapTiles[mapType].url}
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
                      {alert.hasPhoto && <span className="text-xs block text-blue-600">📸 Com foto</span>}
                      
                      {userData.type === 'admin' && (
                        <button 
                          onClick={() => handleDeleteAlert(alert.id)} 
                          className="mt-2 w-full bg-red-600 text-white text-xs py-2 rounded flex items-center justify-center gap-1 hover:bg-red-700 font-bold"
                        >
                          <Trash2 className="w-3 h-3" /> REMOVER
                        </button>
                      )}
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>

            {/* Busca de Endereço */}
            <MapSearch onLocationFound={handleLocationFound} />

            <button 
  onClick={handleGPSLock} 
  className="absolute bottom-32 right-3 z-[999] bg-white/90 backdrop-blur p-2 rounded-full shadow-md hover:shadow-lg transition-all"
>
  <Navigation className={`w-4 h-4 ${gpsLocked ? 'text-blue-500 fill-blue-500' : 'text-gray-700'}`} />
</button>

            <button 
              onClick={() => { 
                resetReportFlow(); 
                setCurrentView('report'); 
              }} 
              className="absolute bottom-24 right-4 z-[999] w-16 h-16 bg-red-500 rounded-full shadow-2xl flex items-center justify-center hover:bg-red-600 border-4 border-white animate-bounce"
            >
              <Plus className="w-8 h-8 text-white" />
            </button>

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
          <div className={`${currentTheme.colors.card} ${currentTheme.colors.text} p-4 flex items-center justify-between`}>
            <button onClick={() => {
              resetReportFlow();
              setCurrentView('map');
            }}>
              <X className="w-6 h-6" />
            </button>
            <h2 className="font-bold">Reportar Alerta</h2>
            <div className="w-6"></div>
          </div>
          
          {reportStep === 1 && (
            <div className={`flex-1 flex flex-col items-center justify-center ${currentTheme.colors.text} p-6`}>
              <Navigation className={`w-20 h-20 mb-4 ${gpsLocked ? 'text-green-500' : currentTheme.colors.accent + ' animate-pulse'}`} />
              <h3 className="text-xl font-bold mb-4">
                {gpsLocked ? '✓ Localização Confirmada' : 'Aguardando GPS...'}
              </h3>
              {!gpsLocked ? (
                <button 
                  onClick={handleGPSLock} 
                  className={`${currentTheme.colors.button} px-6 py-3 rounded-full font-bold text-white`}
                >
                  Ativar GPS
                </button>
              ) : (
                <button 
                  onClick={() => setReportStep(2)} 
                  className="bg-green-600 hover:bg-green-500 px-6 py-3 rounded-full font-bold text-white"
                >
                  Continuar →
                </button>
              )}
            </div>
          )}

          {reportStep === 2 && (
            <div className="flex-1 bg-black flex flex-col items-center justify-center relative">
              {!hasPhoto ? (
                <>
                  <Camera className="w-20 h-20 text-gray-400 mb-4" />
                  <p className="text-white text-sm mb-6">Tire uma foto do local (opcional)</p>
                  <button 
                    onClick={handleCameraCapture} 
                    className="w-20 h-20 border-4 border-white rounded-full bg-white/20 hover:bg-white/30 mb-4"
                  />
                  <button
                    onClick={() => setReportStep(3)}
                    className="text-white underline text-sm"
                  >
                    Pular foto →
                  </button>
                </>
              ) : (
                <>
                  {photoData && <img src={photoData} alt="Captura" className="max-w-full max-h-96 object-contain mb-4" />}
                  <CheckCircle className="w-16 h-16 text-green-500 animate-pulse" />
                </>
              )}
            </div>
          )}

          {reportStep === 3 && (
            <div className="flex-1 p-6 overflow-y-auto">
              <h3 className={`${currentTheme.colors.text} text-xl font-bold mb-4`}>Tipo de Alerta</h3>
              <div className="grid grid-cols-2 gap-3">
                {alertTypes.map(t => (
                  <button 
                    key={t.id} 
                    onClick={() => {
                      setAlertType(t.label); 
                      setReportStep(4);
                    }} 
                    className={`${currentTheme.colors.card} p-4 rounded-xl border ${currentTheme.colors.border} hover:border-blue-500 flex flex-col items-center`}
                  >
                    <div className="text-3xl mb-2">{t.icon}</div>
                    <span className={`${currentTheme.colors.text} font-bold text-xs text-center`}>{t.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {reportStep === 4 && (
            <div className={`flex-1 p-6 ${currentTheme.colors.text} overflow-y-auto`}>
              <h3 className="text-xl font-bold mb-4">Duração do Alerta</h3>
              <div className={`${currentTheme.colors.card} p-4 rounded mb-4 flex items-center gap-4`}>
                <Clock className={currentTheme.colors.accent}/> 
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
              <div className={`${currentTheme.colors.card} rounded-xl p-4 mb-4`}>
                <p className={`text-sm ${currentTheme.colors.textSecondary} mb-2`}>Resumo:</p>
                <p><strong>Tipo:</strong> {alertType}</p>
                <p><strong>Duração:</strong> {expirationTime} min</p>
                <p><strong>GPS:</strong> {gpsLocked ? '✓ Ativo' : 'Manual'}</p>
                <p><strong>Foto:</strong> {hasPhoto ? '✓ Adicionada' : 'Não'}</p>
              </div>
              <button 
                onClick={handleSubmitReport} 
                className="w-full bg-red-600 hover:bg-red-500 text-white py-4 rounded-xl font-bold flex justify-center gap-2"
              >
                <Send/> Enviar Alerta
              </button>
            </div>
          )}

          {reportStep === 5 && (
            <div className={`flex-1 flex flex-col items-center justify-center ${currentTheme.colors.text}`}>
              <CheckCircle className="w-20 h-20 text-green-500 mb-4 animate-bounce" />
              <h2 className="text-2xl font-bold">Alerta Enviado!</h2>
              <p className={currentTheme.colors.textSecondary + " mt-2"}>Comunidade notificada</p>
            </div>
          )}
        </>
      )}

      {/* ========================================== */}
      {/* VIEW: PERFIL */}
      {/* ========================================== */}
      {currentView === 'profile' && (
        <>
          <div className={`${currentTheme.colors.card} p-4 flex items-center justify-between border-b ${currentTheme.colors.border}`}>
            <h2 className={`${currentTheme.colors.text} font-bold text-xl`}>Perfil</h2>
            <Settings 
              className={`w-6 h-6 ${currentTheme.colors.textSecondary} cursor-pointer hover:opacity-80`}
              onClick={() => setCurrentView('settings')} 
            />
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <div className={`bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 mb-6 text-white`}>
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
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div className="bg-white rounded-full h-2 transition-all" style={{width: `${Math.min(100, (userStats.points / 1000) * 100)}%`}}></div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className={`${currentTheme.colors.card} rounded-xl p-4 text-center`}>
                <MapPin className={`w-6 h-6 ${currentTheme.colors.accent} mx-auto mb-2`} />
                <p className={`text-2xl font-bold ${currentTheme.colors.text}`}>{userStats.totalAlerts}</p>
                <p className={`text-xs ${currentTheme.colors.textSecondary}`}>Alertas</p>
              </div>
              <div className={`${currentTheme.colors.card} rounded-xl p-4 text-center`}>
                <CheckCircle className="w-6 h-6 text-green-400 mx-auto mb-2" />
                <p className={`text-2xl font-bold ${currentTheme.colors.text}`}>{userStats.verified}</p>
                <p className={`text-xs ${currentTheme.colors.textSecondary}`}>Criados</p>
              </div>
              <div className={`${currentTheme.colors.card} rounded-xl p-4 text-center`}>
                <Award className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                <p className={`text-2xl font-bold ${currentTheme.colors.text}`}>{userStats.badges}</p>
                <p className={`text-xs ${currentTheme.colors.textSecondary}`}>Conquistas</p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className={`${currentTheme.colors.text} font-bold text-lg mb-3 flex items-center gap-2`}>
                <Trophy className="w-5 h-5 text-yellow-400" />
                Conquistas Desbloqueadas
              </h3>
              <div className="grid grid-cols-4 gap-3">
                {achievements.map(achievement => {
                  const unlocked = unlockedAchievements.includes(achievement.id);
                  return (
                    <div 
                      key={achievement.id} 
                      className={`rounded-xl p-3 text-center ${unlocked ? 'bg-gradient-to-br from-yellow-500 to-orange-500' : currentTheme.colors.card + ' opacity-40'}`}
                      title={achievement.description}
                    >
                      <div className="text-2xl mb-1">{achievement.icon}</div>
                      <p className="text-xs text-white font-semibold leading-tight">{achievement.name}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <button 
              onClick={() => setCurrentView('premium')} 
              className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:shadow-lg"
            >
              <Crown className="w-5 h-5" /> Seja Premium
            </button>
          </div>
          
          {renderBottomNav()}
        </>
      )}

      {/* ========================================== */}
      {/* VIEW: DADOS (ESTRUTURA COMPLETA) */}
      {/* ========================================== */}
      {currentView === 'data' && (
        <>
          <div className={`${currentTheme.colors.card} p-4 flex items-center justify-between border-b ${currentTheme.colors.border}`}>
            <h2 className={`${currentTheme.colors.text} font-bold text-xl`}>Dados do Sistema</h2>
            <TrendingUp className={`w-6 h-6 ${currentTheme.colors.accent}`} />
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {/* Card de Estatísticas Gerais */}
            <div className={`${currentTheme.colors.card} rounded-xl p-4 mb-4 border ${currentTheme.colors.border}`}>
              <h3 className={`${currentTheme.colors.text} font-bold mb-3 flex items-center gap-2`}>
                <CheckSquare className={`w-5 h-5 ${currentTheme.colors.accent}`} />
                Resumo Geral
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className={`${currentTheme.colors.card} border ${currentTheme.colors.border} rounded-lg p-3`}>
                  <p className={`${currentTheme.colors.textSecondary} text-xs mb-1`}>Total Alertas</p>
                  <p className={`${currentTheme.colors.text} text-2xl font-bold`}>{alerts.length}</p>
                </div>
                <div className={`${currentTheme.colors.card} border ${currentTheme.colors.border} rounded-lg p-3`}>
                  <p className={`${currentTheme.colors.textSecondary} text-xs mb-1`}>Notificações</p>
                  <p className={`${currentTheme.colors.text} text-2xl font-bold`}>{notifications.length}</p>
                </div>
                <div className={`${currentTheme.colors.card} border ${currentTheme.colors.border} rounded-lg p-3`}>
                  <p className={`${currentTheme.colors.textSecondary} text-xs mb-1`}>Conquistas</p>
                  <p className={`${currentTheme.colors.text} text-2xl font-bold`}>{unlockedAchievements.length}/{achievements.length}</p>
                </div>
                <div className={`${currentTheme.colors.card} border ${currentTheme.colors.border} rounded-lg p-3`}>
                  <p className={`${currentTheme.colors.textSecondary} text-xs mb-1`}>Status</p>
                  <p className={`${currentTheme.colors.text} text-lg font-bold`}>{isPremium ? '👑 Premium' : 'Free'}</p>
                </div>
              </div>
            </div>

            {/* Alertas Criados */}
            <div className={`${currentTheme.colors.card} rounded-xl p-4 mb-4 border ${currentTheme.colors.border}`}>
              <h3 className={`${currentTheme.colors.text} font-bold mb-3 flex items-center gap-2`}>
                <MapPin className={`w-5 h-5 ${currentTheme.colors.accent}`} />
                Meus Alertas ({alerts.length})
              </h3>
              {alerts.length === 0 ? (
                <p className={`${currentTheme.colors.textSecondary} text-sm text-center py-4`}>Nenhum alerta criado ainda</p>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {alerts.slice(0, 10).map(alert => (
                    <div key={alert.id} className={`${currentTheme.colors.card} border ${currentTheme.colors.border} rounded-lg p-3 flex items-center gap-3`}>
                      <div className="text-2xl">
                        {alertTypes.find(t => t.id === alert.type)?.icon || '📍'}
                      </div>
                      <div className="flex-1">
                        <p className={`${currentTheme.colors.text} font-semibold text-sm`}>{alert.type}</p>
                        <p className={`${currentTheme.colors.textSecondary} text-xs`}>{alert.location}</p>
                        <p className={`${currentTheme.colors.textSecondary} text-xs`}>{alert.time} atrás</p>
                      </div>
                      {alert.hasPhoto && (
                        <Camera className="w-4 h-4 text-blue-500" />
                      )}
                    </div>
                  ))}
                  {alerts.length > 10 && (
                    <p className={`${currentTheme.colors.textSecondary} text-xs text-center pt-2`}>
                      E mais {alerts.length - 10} alertas...
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Conquistas Desbloqueadas */}
            <div className={`${currentTheme.colors.card} rounded-xl p-4 mb-4 border ${currentTheme.colors.border}`}>
              <h3 className={`${currentTheme.colors.text} font-bold mb-3 flex items-center gap-2`}>
                <Trophy className={`w-5 h-5 ${currentTheme.colors.accent}`} />
                Conquistas Desbloqueadas
              </h3>
              {unlockedAchievements.length === 0 ? (
                <p className={`${currentTheme.colors.textSecondary} text-sm text-center py-4`}>Nenhuma conquista desbloqueada</p>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {achievements.filter(a => unlockedAchievements.includes(a.id)).map(achievement => (
                    <div key={achievement.id} className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg p-3 text-center">
                      <div className="text-3xl mb-1">{achievement.icon}</div>
                      <p className="text-white text-xs font-bold">{achievement.name}</p>
                      <p className="text-yellow-100 text-xs">+{achievement.points} pts</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Configurações Atuais */}
            <div className={`${currentTheme.colors.card} rounded-xl p-4 mb-4 border ${currentTheme.colors.border}`}>
              <h3 className={`${currentTheme.colors.text} font-bold mb-3 flex items-center gap-2`}>
                <Settings className={`w-5 h-5 ${currentTheme.colors.accent}`} />
                Configurações Atuais
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className={`${currentTheme.colors.textSecondary} text-sm`}>Tema Ativo:</span>
                  <span className={`${currentTheme.colors.text} font-semibold`}>
                    {themes[selectedTheme]?.name}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`${currentTheme.colors.textSecondary} text-sm`}>Tipo de Mapa:</span>
                  <span className={`${currentTheme.colors.text} font-semibold`}>
                    {mapTiles[mapType].name}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`${currentTheme.colors.textSecondary} text-sm`}>Conta:</span>
                  <span className={`${currentTheme.colors.text} font-semibold`}>
                    {userData.type === 'admin' ? '👮‍♂️ Admin' : '👤 Usuário'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`${currentTheme.colors.textSecondary} text-sm`}>Plano:</span>
                  <span className={`${currentTheme.colors.text} font-semibold`}>
                    {isPremium ? '👑 Premium' : 'Gratuito'}
                  </span>
                </div>
              </div>
            </div>

            {/* Dados Técnicos */}
            <div className={`${currentTheme.colors.card} rounded-xl p-4 mb-4 border ${currentTheme.colors.border}`}>
              <h3 className={`${currentTheme.colors.text} font-bold mb-3 flex items-center gap-2`}>
                <Cloud className={`w-5 h-5 ${currentTheme.colors.accent}`} />
                Dados Técnicos
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className={`${currentTheme.colors.textSecondary} text-sm`}>GPS Status:</span>
                  <span className={`${currentTheme.colors.text} font-semibold`}>
                    {gpsLocked ? '✓ Ativo' : '✗ Inativo'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`${currentTheme.colors.textSecondary} text-sm`}>Localização:</span>
                  <span className={`${currentTheme.colors.text} font-semibold text-xs`}>
                    {userPosition ? `${userPosition[0].toFixed(4)}, ${userPosition[1].toFixed(4)}` : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`${currentTheme.colors.textSecondary} text-sm`}>Busca Usada:</span>
                  <span className={`${currentTheme.colors.text} font-semibold`}>
                    {searchedLocation ? '✓ Sim' : '✗ Não'}
                  </span>
                </div>
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="space-y-3">
              <button
                onClick={() => {
                  const data = {
                    alerts,
                    notifications,
                    selectedTheme,
                    isPremium,
                    unlockedAchievements,
                    userStats,
                    mapType,
                    timestamp: new Date().toISOString()
                  };
                  console.log('📊 DADOS COMPLETOS:', data);
                  alert('📊 Dados exibidos no console! (F12)');
                }}
                className={`w-full ${currentTheme.colors.button} text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2`}
              >
                <TrendingUp className="w-5 h-5" />
                Ver JSON no Console
              </button>

              <button
                onClick={() => {
                  const data = {
                    alerts,
                    notifications,
                    selectedTheme,
                    isPremium,
                    unlockedAchievements
                  };
                  const dataStr = JSON.stringify(data, null, 2);
                  const blob = new Blob([dataStr], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `alertabh-backup-${Date.now()}.json`;
                  a.click();
                  alert('💾 Arquivo JSON baixado!');
                }}
                className={`w-full ${currentTheme.colors.card} border-2 ${currentTheme.colors.border} ${currentTheme.colors.text} py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-opacity-80`}
              >
                <Download className="w-5 h-5" />
                Exportar JSON
              </button>

              <button
                onClick={() => {
                  if (window.confirm('⚠️ Isso irá limpar TODOS os dados. Continuar?')) {
                    setAlerts([]);
                    setNotifications([]);
                    setUnlockedAchievements([]);
                    localStorage.removeItem('alertaBH_data');
                    alert('🗑️ Todos os dados foram limpos!');
                  }
                }}
                className="w-full bg-red-500/20 border-2 border-red-500 text-red-500 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-red-500/30"
              >
                <Trash2 className="w-5 h-5" />
                Limpar Todos os Dados
              </button>
            </div>
          </div>

          {renderBottomNav()}
        </>
      )}

      {/* ========================================== */}
      {/* VIEW: NOTIFICAÇÕES (CLICÁVEIS) */}
      {/* ========================================== */}
      {currentView === 'notifications' && (
        <>
          <div className={`${currentTheme.colors.card} p-4 border-b ${currentTheme.colors.border} flex justify-between items-center`}>
            <h2 className={`${currentTheme.colors.text} font-bold text-lg`}>Notificações</h2>
            {notifications.length > 0 && (
              <span className={`text-xs ${currentTheme.colors.textSecondary}`}>{notifications.length} itens</span>
            )}
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className={`flex flex-col items-center justify-center h-full ${currentTheme.colors.textSecondary} p-6`}>
                <Bell className="w-16 h-16 mb-4 opacity-50" />
                <p className="text-center">Nenhuma notificação</p>
              </div>
            ) : (
              <div className={`divide-y ${currentTheme.colors.border}`}>
                {notifications.map(notif => (
                  <div 
                    key={notif.id} 
                    onClick={() => handleNotificationClick(notif)}
                    className={`p-4 flex gap-4 cursor-pointer hover:bg-opacity-50 transition-all ${!notif.read ? 'bg-blue-500/10' : ''}`}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                      notif.type === 'created' ? 'bg-green-500' : 
                      notif.type === 'removed' ? 'bg-red-500' : 
                      notif.type === 'fuel' ? 'bg-orange-500' :
                      notif.type === 'achievement' ? 'bg-yellow-500' :
                      'bg-blue-500'
                    }`}>
                      {notif.type === 'created' && <CheckCircle className="w-6 h-6 text-white" />}
                      {notif.type === 'removed' && <Trash2 className="w-6 h-6 text-white" />}
                      {notif.type === 'fuel' && <Fuel className="w-6 h-6 text-white" />}
                      {notif.type === 'achievement' && <Trophy className="w-6 h-6 text-white" />}
                      {notif.type === 'search' && <MapPin className="w-6 h-6 text-white" />}
                    </div>
                    <div className="flex-1">
                      <h4 className={`${currentTheme.colors.text} font-semibold text-sm`}>{notif.title}</h4>
                      <p className={`${currentTheme.colors.textSecondary} text-sm`}>{notif.desc}</p>
                      <p className={`text-xs ${currentTheme.colors.textSecondary} mt-1`}>{notif.time}</p>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteNotification(notif.id);
                      }}
                      className={`${currentTheme.colors.textSecondary} hover:text-red-500`}
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
      {/* VIEW: COMBUSTÍVEL */}
      {/* ========================================== */}
      {currentView === 'fuel' && (
        <>
          <div className={`${currentTheme.colors.card} p-4 flex items-center justify-between border-b ${currentTheme.colors.border}`}>
            <h2 className={`${currentTheme.colors.text} font-bold text-xl`}>SOS Combustível</h2>
            <Fuel className={`w-6 h-6 ${currentTheme.colors.accent}`} />
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 mb-6 text-white">
              <h3 className="text-2xl font-bold mb-2">Pane Seca?</h3>
              <p className="text-sm opacity-90">Entregamos em até 30 minutos!</p>
            </div>

            <div className="mb-6">
              <h4 className={`${currentTheme.colors.text} font-bold mb-3`}>Combustível</h4>
              <div className="space-y-3">
                {fuelOptions.map(fuel => (
                  <button 
                    key={fuel.id} 
                    onClick={() => setFuelType(fuel.id)} 
                    className={`w-full ${currentTheme.colors.card} rounded-xl p-4 flex items-center justify-between border-2 ${fuelType === fuel.id ? 'border-blue-500' : currentTheme.colors.border}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{fuel.icon}</div>
                      <div className="text-left">
                        <p className={`${currentTheme.colors.text} font-semibold`}>{fuel.name}</p>
                        <p className={`${currentTheme.colors.textSecondary} text-sm`}>R$ {fuel.price.toFixed(2)}/L</p>
                      </div>
                    </div>
                    {fuelType === fuel.id && <Check className="w-6 h-6 text-blue-500" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h4 className={`${currentTheme.colors.text} font-bold mb-3`}>Quantidade</h4>
              <div className={`${currentTheme.colors.card} rounded-xl p-4`}>
                <div className="flex items-center justify-between mb-3">
                  <span className={currentTheme.colors.text}>Litros</span>
                  <span className={`${currentTheme.colors.accent} font-bold text-xl`}>{fuelQuantity}L</span>
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
                <div className={`flex justify-between text-xs ${currentTheme.colors.textSecondary} mt-2`}>
                  <span>5L</span><span>10L</span><span>15L</span><span>20L</span>
                </div>
              </div>
            </div>

            {fuelType && (
              <div className={`${currentTheme.colors.card} rounded-xl p-4 mb-4`}>
                <div className="flex justify-between items-center mb-2">
                  <span className={currentTheme.colors.textSecondary}>Subtotal</span>
                  <span className={`${currentTheme.colors.text} font-bold`}>
                    R$ {(fuelOptions.find(f => f.id === fuelType)?.price * parseInt(fuelQuantity)).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className={currentTheme.colors.textSecondary}>Taxa</span>
                  <span className={`${currentTheme.colors.text} font-bold`}>R$ 15,00</span>
                </div>
                <div className={`border-t ${currentTheme.colors.border} pt-2 mt-2 flex justify-between items-center`}>
                  <span className={`${currentTheme.colors.text} font-bold`}>Total</span>
                  <span className={`${currentTheme.colors.accent} font-bold text-xl`}>
                    R$ {(fuelOptions.find(f => f.id === fuelType)?.price * parseInt(fuelQuantity) + 15).toFixed(2)}
                  </span>
                </div>
              </div>
            )}

            <button 
              disabled={!fuelType} 
              onClick={handleFuelOrder}
              className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 ${fuelType ? currentTheme.colors.button + ' text-white' : 'bg-gray-700 text-gray-500 cursor-not-allowed'}`}
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
          <div className={`${currentTheme.colors.card} p-4 flex gap-3 ${currentTheme.colors.text} font-bold border-b ${currentTheme.colors.border}`}>
            <button onClick={() => setCurrentView('map')}><X className="w-6 h-6"/></button> 
            Configurações
          </div>
          
          <div className="flex-1 p-6 overflow-y-auto">
            <div className={`${currentTheme.colors.card} rounded-xl p-4 mb-6 border ${currentTheme.colors.border}`}>
              <h3 className={`${currentTheme.colors.accent} font-bold mb-3 flex items-center gap-2`}>
                <Cloud className="w-5 h-5"/> Nuvem & Backup
              </h3>
              <div className="flex gap-3">
                <button 
                  onClick={handleCloudSave} 
                  className={`flex-1 ${currentTheme.colors.card} border ${currentTheme.colors.border} hover:bg-opacity-80 ${currentTheme.colors.text} p-3 rounded-lg flex flex-col items-center gap-1`}
                >
                  <Upload className="w-5 h-5 text-green-400"/> 
                  <span className="text-xs">Salvar</span>
                </button>
                <button 
                  onClick={handleCloudLoad} 
                  className={`flex-1 ${currentTheme.colors.card} border ${currentTheme.colors.border} hover:bg-opacity-80 ${currentTheme.colors.text} p-3 rounded-lg flex flex-col items-center gap-1`}
                >
                  <Download className="w-5 h-5 text-blue-400"/> 
                  <span className="text-xs">Restaurar</span>
                </button>
              </div>
            </div>

            <div className="mb-6">
              <h3 className={`${currentTheme.colors.textSecondary} text-xs font-semibold uppercase mb-3`}>Aparência</h3>
              <div className={`${currentTheme.colors.card} rounded-xl p-4`}>
                <div className="flex items-center gap-3 mb-4">
                  <Palette className={`w-5 h-5 ${currentTheme.colors.accent}`} />
                  <span className={currentTheme.colors.text}>Temas</span>
                </div>
                <div className="space-y-3">
                  {Object.values(themes).map(theme => (
                    <button 
                      key={theme.id} 
                      onClick={() => {
                        if (theme.premium && !isPremium) { 
                          alert("🔒 Tema Premium! Assine o plano Plus."); 
                        } else { 
                          setSelectedTheme(theme.id); 
                        }
                      }}
                      className={`w-full rounded-lg p-4 border-2 text-left flex items-center justify-between ${selectedTheme === theme.id ? 'border-blue-500' : currentTheme.colors.border} ${theme.premium && !isPremium ? 'opacity-60' : ''}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded ${theme.colors.bg}`}></div>
                        <span className={currentTheme.colors.text + " font-semibold"}>{theme.name}</span>
                      </div>
                      {theme.premium && !isPremium && <Lock className="w-4 h-4 text-gray-400" />}
                      {selectedTheme === theme.id && <Check className="w-5 h-5 text-blue-500" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button 
              onClick={handleLogout} 
              className="w-full bg-red-500/20 border-2 border-red-500 text-red-500 rounded-xl p-4 font-semibold flex items-center justify-center gap-3 hover:bg-red-500/30"
            >
              <LogOut className="w-5 h-5" /> Sair da Conta
            </button>
          </div>
        </>
      )}

      {/* ========================================== */}
      {/* VIEW: PREMIUM */}
      {/* ========================================== */}
      {currentView === 'premium' && (
        <>
          <div className={`${currentTheme.colors.card} p-4 flex items-center gap-3 border-b ${currentTheme.colors.border}`}>
            <button onClick={() => setCurrentView('profile')}>
              <X className={`w-6 h-6 ${currentTheme.colors.text}`} />
            </button>
            <h2 className={`${currentTheme.colors.text} font-bold text-xl`}>Premium</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-3 animate-pulse">
                <Crown className="w-10 h-10 text-white" />
              </div>
              <h2 className={`${currentTheme.colors.text} text-2xl font-bold mb-2`}>Seja Premium</h2>
              <p className={`${currentTheme.colors.textSecondary} text-sm`}>R$ 9,90/mês</p>
            </div>

            <div className={`${currentTheme.colors.card} rounded-2xl p-5 border-2 border-yellow-500 mb-4`}>
              <h3 className={`${currentTheme.colors.text} text-xl font-bold mb-4`}>Plano Plus</h3>
              <div className="space-y-2 mb-4">
                <div className={`flex items-center gap-3 ${currentTheme.colors.text}`}>
                  <Check className="w-5 h-5 text-green-400"/><span className="text-sm">Sem anúncios</span>
                </div>
                <div className={`flex items-center gap-3 ${currentTheme.colors.text}`}>
                  <Check className="w-5 h-5 text-green-400"/><span className="text-sm">2 Temas exclusivos</span>
                </div>
                <div className={`flex items-center gap-3 ${currentTheme.colors.text}`}>
                  <Check className="w-5 h-5 text-green-400"/><span className="text-sm">Alertas prioritários</span>
                </div>
                <div className={`flex items-center gap-3 ${currentTheme.colors.text}`}>
                  <Check className="w-5 h-5 text-green-400"/><span className="text-sm">Backup ilimitado</span>
                </div>
              </div>
              <button 
                onClick={() => { 
                  setIsPremium(true); 
                  alert("✨ Bem-vindo ao Premium!");
                  setCurrentView('profile');
                }} 
                className={`w-full py-3 rounded-xl font-bold text-white ${isPremium ? 'bg-green-600' : 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400'}`}
                disabled={isPremium}
              >
                {isPremium ? '✓ Você é Premium!' : 'Assinar Agora'}
              </button>
            </div>
          </div>
        </>
      )}

    </div>
  );
}
