import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { 
  MapPin, Camera, Bell, Users, Menu, Plus, Clock, AlertCircle, Navigation, 
  Send, X, Check, User, Settings, Trophy, Star, Lock, LogOut, Award, 
  CheckCircle, Crown, Palette, Fuel, Trash2, Cloud, Download, Upload, 
  Shield, DollarSign, Search, Map as MapIcon, Layers, History, CheckSquare, 
  TrendingUp, Zap, MessageSquare, Share2, Filter, Calendar, BarChart3,
  Radio, Wifi, Battery, Volume2, Eye, EyeOff, RefreshCw, Target,
  Sparkles, Flame, Wind, Droplet, Sun, Moon, Heart, Activity,
  CreditCard, Gift, Sliders, Maximize2, Minimize2, ArrowRight
} from 'lucide-react';

// ============================================
// CONFIGURAÇÃO DE ÍCONES DO LEAFLET
// ============================================
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// ============================================
// ÍCONES DE MAPA AVANÇADOS
// ============================================
const createCustomIcon = (color, icon) => new L.DivIcon({
  className: 'custom-marker',
  html: `
    <div style="position: relative;">
      <div style="
        background: linear-gradient(135deg, ${color}dd, ${color});
        width: 40px; 
        height: 40px; 
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          transform: rotate(45deg);
          font-size: 20px;
        ">${icon}</div>
      </div>
      <div style="
        position: absolute;
        top: -10px;
        left: -10px;
        width: 60px;
        height: 60px;
        background: ${color}30;
        border-radius: 50%;
        animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
      "></div>
    </div>
  `,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40]
});

const userIcon = new L.DivIcon({
  className: 'user-marker',
  html: `
    <div style="position: relative;">
      <div style="
        background: linear-gradient(135deg, #3b82f6, #2563eb);
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 4px solid white;
        box-shadow: 0 0 20px rgba(59, 130, 246, 0.5), 0 4px 12px rgba(0,0,0,0.3);
      "></div>
      <div style="
        position: absolute;
        top: -12px;
        left: -12px;
        width: 48px;
        height: 48px;
        background: rgba(59, 130, 246, 0.2);
        border-radius: 50%;
        animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
      "></div>
    </div>
  `,
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

// ============================================
// COMPONENTE: CONTROLE DE MAPA AVANÇADO
// ============================================
function MapController({ position, zoom, alerts, showHeatmap }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo(position, zoom || 14, { 
        animate: true, 
        duration: 1.5,
        easeLinearity: 0.25 
      });
    }
  }, [position, zoom, map]);

  return position ? (
    <>
      <Marker position={position} icon={userIcon}>
        <Popup>
          <div className="text-center font-semibold">
            <Navigation className="w-4 h-4 inline text-blue-500 mb-1" />
            <br />Você está aqui
          </div>
        </Popup>
      </Marker>
      <Circle 
        center={position} 
        radius={100}
        pathOptions={{
          color: '#3b82f6',
          fillColor: '#3b82f6',
          fillOpacity: 0.1,
          weight: 2,
          dashArray: '10, 10'
        }}
      />
    </>
  ) : null;
}

// ============================================
// COMPONENTE: BUSCA DE ENDEREÇO AVANÇADA
// ============================================
function AdvancedMapSearch({ onLocationFound, theme }) {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchLocation = async (searchQuery) => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery + ', Belo Horizonte, Brasil')}&limit=5`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        setSuggestions(data);
        setShowSuggestions(true);
      } else {
        alert('❌ Local não encontrado');
      }
    } catch (error) {
      console.error('Erro na busca:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const selectLocation = (location) => {
    const position = [parseFloat(location.lat), parseFloat(location.lon)];
    onLocationFound(position, location.display_name);
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <div ref={searchRef} className="absolute top-3 left-4 right-16 z-[999]">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && searchLocation(query)}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            placeholder="🔍 Buscar endereço ou local..."
            className={`w-full ${theme.colors.card} backdrop-blur-xl border ${theme.colors.border} rounded-2xl px-4 py-3 ${theme.colors.text} text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg`}
          />
          {showSuggestions && suggestions.length > 0 && (
            <div className={`absolute top-full mt-2 w-full ${theme.colors.card} backdrop-blur-xl rounded-2xl shadow-2xl border ${theme.colors.border} overflow-hidden max-h-80 overflow-y-auto`}>
              {suggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => selectLocation(suggestion)}
                  className={`w-full text-left px-4 py-3 ${theme.colors.text} hover:bg-blue-500/20 transition-colors border-b ${theme.colors.border} last:border-b-0`}
                >
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-blue-400 mt-1 flex-shrink-0" />
                    <span className="text-sm line-clamp-2">{suggestion.display_name}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
        <button
          onClick={() => searchLocation(query)}
          disabled={isSearching}
          className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 rounded-2xl shadow-lg hover:shadow-xl disabled:opacity-50 transition-all"
        >
          {isSearching ? (
            <RefreshCw className="w-5 h-5 animate-spin" />
          ) : (
            <Search className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
}

// ============================================
// COMPONENTE: TELA DE LOGIN MODERNA
// ============================================
function ModernLoginScreen({ onLogin }) {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simular delay de autenticação
    await new Promise(resolve => setTimeout(resolve, 800));

    if (credentials.email === 'admin' && credentials.password === 'admin') {
      onLogin({ name: 'Administrador', type: 'admin', avatar: '👮‍♂️' });
    } else if (credentials.email === 'user' && credentials.password === 'user') {
      onLogin({ name: 'João Silva', type: 'user', avatar: '👤' });
    } else {
      setError('Credenciais inválidas. Tente: admin/admin ou user/user');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 items-center justify-center p-6 text-white relative overflow-hidden">
      {/* Efeitos de fundo animados */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-blue-500/20 rounded-full blur-3xl top-0 -left-48 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl bottom-0 -right-48 animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mb-4 shadow-2xl shadow-blue-500/50 transform hover:rotate-6 transition-transform">
              <Shield className="w-12 h-12 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
              <Sparkles className="w-4 h-4 text-yellow-900" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            AlertaBH 6.0
          </h1>
          <p className="text-gray-300 text-center text-sm">
            Sistema Inteligente de Monitoramento Urbano
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Usuário" 
              value={credentials.email} 
              onChange={e => setCredentials({...credentials, email: e.target.value})}
              className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 pl-12 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
              required
            />
            <User className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          </div>

          <div className="relative">
            <input 
              type="password" 
              placeholder="Senha" 
              value={credentials.password} 
              onChange={e => setCredentials({...credentials, password: e.target.value})}
              className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 pl-12 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
              required
            />
            <Lock className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          </div>

          {error && (
            <div className="bg-red-500/20 backdrop-blur-xl border border-red-500/50 rounded-2xl p-4 animate-shake">
              <p className="text-red-300 text-sm text-center flex items-center justify-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {error}
              </p>
            </div>
          )}

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-500 hover:via-purple-500 hover:to-pink-500 text-white font-bold py-4 rounded-2xl shadow-2xl transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Autenticando...
              </>
            ) : (
              <>
                <Shield className="w-5 h-5" />
                Entrar no Sistema
              </>
            )}
          </button>
        </form>

        {/* Dica de login */}
        <div className="mt-6 p-4 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
          <p className="text-xs text-gray-400 text-center">
            💡 Demo: <span className="text-blue-400">admin/admin</span> ou <span className="text-blue-400">user/user</span>
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================
// APLICAÇÃO PRINCIPAL
// ============================================
export default function AlertaBHAdvanced() {
  // Estados principais
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);
  const [currentView, setCurrentView] = useState('map');
  const [isPremium, setIsPremium] = useState(false);

  // Estados do mapa
  const [userPosition, setUserPosition] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [mapType, setMapType] = useState('dark');
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [mapZoom, setMapZoom] = useState(13);

  // Estados de notificações e conquistas
  const [notifications, setNotifications] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);

  // Estados do report
  const [reportStep, setReportStep] = useState(1);
  const [reportData, setReportData] = useState({
    type: '',
    photo: null,
    description: '',
    duration: 30,
    severity: 'medium'
  });

  // Configurações
  const [selectedTheme, setSelectedTheme] = useState('dark');
  const [settings, setSettings] = useState({
    notifications: true,
    sound: true,
    vibration: true,
    autoNight: true,
    showTraffic: true
  });

  // ============================================
  // CONFIGURAÇÃO DE TEMAS AVANÇADOS
  // ============================================
  const themes = {
    dark: {
      id: 'dark',
      name: 'Dark Professional',
      icon: Moon,
      colors: {
        bg: 'bg-slate-950',
        header: 'bg-slate-900/80',
        card: 'bg-slate-900/50',
        text: 'text-slate-100',
        textSecondary: 'text-slate-400',
        border: 'border-slate-800',
        accent: 'text-blue-400',
        button: 'bg-slate-800 hover:bg-slate-700'
      },
      premium: false
    },
    light: {
      id: 'light',
      name: 'Light Minimal',
      icon: Sun,
      colors: {
        bg: 'bg-gray-50',
        header: 'bg-white/80',
        card: 'bg-white/50',
        text: 'text-gray-900',
        textSecondary: 'text-gray-600',
        border: 'border-gray-200',
        accent: 'text-blue-600',
        button: 'bg-gray-100 hover:bg-gray-200'
      },
      premium: false
    },
    midnight: {
      id: 'midnight',
      name: 'Midnight Blue',
      icon: Moon,
      colors: {
        bg: 'bg-slate-950',
        header: 'bg-blue-950/80',
        card: 'bg-blue-950/30',
        text: 'text-blue-50',
        textSecondary: 'text-blue-300',
        border: 'border-blue-900',
        accent: 'text-blue-400',
        button: 'bg-blue-900 hover:bg-blue-800'
      },
      premium: true
    },
    sunset: {
      id: 'sunset',
      name: 'Sunset Glow',
      icon: Sun,
      colors: {
        bg: 'bg-gradient-to-br from-orange-50 to-pink-50',
        header: 'bg-gradient-to-r from-orange-500/80 to-pink-500/80',
        card: 'bg-white/50',
        text: 'text-gray-900',
        textSecondary: 'text-orange-700',
        border: 'border-orange-200',
        accent: 'text-orange-600',
        button: 'bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-400 hover:to-pink-400'
      },
      premium: true
    }
  };

  const currentTheme = themes[selectedTheme];

  // ============================================
  // TIPOS DE ALERTAS EXPANDIDOS
  // ============================================
  const alertTypes = [
    { id: 'blitz', label: 'Blitz Policial', icon: '🚔', color: '#ef4444', severity: 'high' },
    { id: 'acidente', label: 'Acidente', icon: '🚗', color: '#f97316', severity: 'high' },
    { id: 'congestionamento', label: 'Trânsito Lento', icon: '🚦', color: '#eab308', severity: 'medium' },
    { id: 'obra', label: 'Obra na Via', icon: '🚧', color: '#f59e0b', severity: 'medium' },
    { id: 'buraco', label: 'Buraco', icon: '🕳️', color: '#78716c', severity: 'low' },
    { id: 'alagamento', label: 'Alagamento', icon: '🌊', color: '#3b82f6', severity: 'high' },
    { id: 'manifestacao', label: 'Manifestação', icon: '📢', color: '#a855f7', severity: 'medium' },
    { id: 'veiculo-parado', label: 'Veículo Parado', icon: '🛑', color: '#6b7280', severity: 'low' },
    { id: 'animal', label: 'Animal na Pista', icon: '🐕', color: '#22c55e', severity: 'medium' },
    { id: 'perigo', label: 'Perigo Geral', icon: '⚠️', color: '#dc2626', severity: 'high' },
    { id: 'radar', label: 'Radar', icon: '📷', color: '#ec4899', severity: 'low' },
    { id: 'policia', label: 'Polícia', icon: '👮', color: '#1e40af', severity: 'medium' }
  ];

  // ============================================
  // TIPOS DE MAPAS
  // ============================================
  const mapTiles = {
    dark: {
      name: 'Dark Mode',
      url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      attribution: '&copy; CARTO'
    },
    light: {
      name: 'Light Mode',
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; OpenStreetMap'
    },
    satellite: {
      name: 'Satellite',
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: '&copy; Esri'
    }
  };

  // ============================================
  // SISTEMA DE CONQUISTAS AVANÇADO
  // ============================================
  const achievementsList = [
    { id: 'first_alert', name: 'Primeiro Passo', icon: '🌱', desc: 'Crie seu primeiro alerta', condition: () => alerts.length >= 1, points: 50, rarity: 'common' },
    { id: 'vigilant', name: 'Vigilante', icon: '👁️', desc: 'Crie 5 alertas', condition: () => alerts.length >= 5, points: 100, rarity: 'common' },
    { id: 'protector', name: 'Protetor', icon: '🛡️', desc: 'Crie 10 alertas', condition: () => alerts.length >= 10, points: 200, rarity: 'rare' },
    { id: 'hero', name: 'Herói da Cidade', icon: '🦸', desc: 'Crie 20 alertas', condition: () => alerts.length >= 20, points: 500, rarity: 'epic' },
    { id: 'photographer', name: 'Fotógrafo', icon: '📸', desc: 'Adicione foto a um alerta', condition: () => alerts.some(a => a.photo), points: 75, rarity: 'common' },
    { id: 'diverse', name: 'Versátil', icon: '🎯', desc: 'Crie 3 tipos diferentes', condition: () => new Set(alerts.map(a => a.type)).size >= 3, points: 150, rarity: 'rare' },
    { id: 'premium', name: 'VIP', icon: '👑', desc: 'Seja Premium', condition: () => isPremium, points: 100, rarity: 'legendary' },
    { id: 'night_owl', name: 'Coruja Noturna', icon: '🦉', desc: 'Crie alerta à noite', condition: () => alerts.some(a => new Date(a.createdAt).getHours() >= 22 || new Date(a.createdAt).getHours() <= 5), points: 80, rarity: 'rare' },
  ];

  // ============================================
  // FUNÇÕES DE LÓGICA PRINCIPAL
  // ============================================

  // Login
  const handleLogin = (user) => {
    setUserData(user);
    setIsAuthenticated(true);
    loadFromStorage();
  };

  // Logout
  const handleLogout = () => {
    if (window.confirm("Tem certeza que deseja sair?")) {
      saveToStorage();
      setIsAuthenticated(false);
      setUserData(null);
      setCurrentView('map');
    }
  };

  // Storage
  const saveToStorage = useCallback(() => {
    try {
      const data = {
        alerts,
        notifications,
        unlockedAchievements,
        selectedTheme,
        isPremium,
        settings,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('alertabh_v6', JSON.stringify(data));
    } catch (e) {
      console.error('Erro ao salvar:', e);
    }
  }, [alerts, notifications, unlockedAchievements, selectedTheme, isPremium, settings]);

  const loadFromStorage = () => {
    try {
      const saved = localStorage.getItem('alertabh_v6');
      if (saved) {
        const data = JSON.parse(saved);
        setAlerts(data.alerts || []);
        setNotifications(data.notifications || []);
        setUnlockedAchievements(data.unlockedAchievements || []);
        setSelectedTheme(data.selectedTheme || 'dark');
        setIsPremium(data.isPremium || false);
        setSettings(data.settings || settings);
      }
    } catch (e) {
      console.error('Erro ao carregar:', e);
    }
  };

  // Auto-save
  useEffect(() => {
    if (isAuthenticated) {
      saveToStorage();
    }
  }, [alerts, notifications, unlockedAchievements, selectedTheme, isPremium, isAuthenticated, saveToStorage]);

  // GPS
  const handleGPSLock = useCallback(() => {
    if (!("geolocation" in navigator)) {
      alert("❌ GPS não suportado");
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const position = [pos.coords.latitude, pos.coords.longitude];
        setUserPosition(position);
        if (currentView === 'report') {
          setReportStep(2);
        }
      },
      (err) => {
        alert("❌ Erro ao obter GPS");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, [currentView]);

  // Criar alerta
  const handleCreateAlert = () => {
    if (!reportData.type) {
      alert("⚠️ Selecione um tipo de alerta!");
      return;
    }

    const newAlert = {
      id: Date.now(),
      lat: userPosition ? userPosition[0] : -19.9167,
      lng: userPosition ? userPosition[1] : -43.9345,
      type: reportData.type,
      photo: reportData.photo,
      description: reportData.description,
      severity: reportData.severity,
      duration: reportData.duration,
      createdBy: userData?.name,
      createdAt: new Date().toISOString(),
      verified: 1,
      location: 'Localização Atual'
    };

    setAlerts(prev => [newAlert, ...prev]);
    
    const notification = {
      id: Date.now(),
      type: 'created',
      title: '✅ Alerta Criado!',
      desc: `${alertTypes.find(t => t.id === reportData.type)?.label} reportado`,
      time: 'Agora',
      read: false
    };
    setNotifications(prev => [notification, ...prev]);

    // Reset
    setReportData({ type: '', photo: null, description: '', duration: 30, severity: 'medium' });
    setReportStep(1);
    setCurrentView('map');
  };

  // Verificar conquistas
  useEffect(() => {
    achievementsList.forEach(achievement => {
      if (achievement.condition() && !unlockedAchievements.includes(achievement.id)) {
        setUnlockedAchievements(prev => [...prev, achievement.id]);
        
        const notification = {
          id: Date.now(),
          type: 'achievement',
          title: '🏆 Nova Conquista!',
          desc: `${achievement.icon} ${achievement.name} - +${achievement.points} pts`,
          time: 'Agora',
          read: false
        };
        setNotifications(prev => [notification, ...prev]);
      }
    });
  }, [alerts, isPremium, unlockedAchievements]);

  // Estatísticas do usuário
  const userStats = {
    level: Math.floor(alerts.length / 3) + 1,
    points: alerts.length * 50 + unlockedAchievements.reduce((sum, id) => {
      const achievement = achievementsList.find(a => a.id === id);
      return sum + (achievement?.points || 0);
    }, 0),
    totalAlerts: alerts.length,
    rank: Math.max(1, 100 - alerts.length * 3)
  };

  // ============================================
  // COMPONENTE: NAVIGATION BAR
  // ============================================
  const renderNavigation = () => (
    <div className={`${currentTheme.colors.card} backdrop-blur-xl border-t ${currentTheme.colors.border} flex justify-around items-center p-2 safe-bottom`}>
      {[
        { id: 'map', icon: MapPin, label: 'Mapa' },
        { id: 'notifications', icon: Bell, label: 'Alertas', badge: notifications.filter(n => !n.read).length },
        { id: 'stats', icon: BarChart3, label: 'Stats' },
        { id: 'profile', icon: User, label: 'Perfil' }
      ].map(item => (
        <button
          key={item.id}
          onClick={() => setCurrentView(item.id)}
          className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
            currentView === item.id 
              ? `${currentTheme.colors.accent} bg-blue-500/10` 
              : currentTheme.colors.textSecondary
          }`}
        >
          <div className="relative">
            <item.icon className="w-5 h-5" />
            {item.badge > 0 && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold">
                {item.badge}
              </div>
            )}
          </div>
          <span className="text-xs font-medium">{item.label}</span>
        </button>
      ))}
    </div>
  );

  // ============================================
  // RENDER: MAPA
  // ============================================
  const renderMap = () => (
    <>
      {/* Header */}
      <div className={`${currentTheme.colors.header} backdrop-blur-xl p-4 flex justify-between items-center border-b ${currentTheme.colors.border}`}>
        <div className="flex items-center gap-3">
          <button onClick={() => setCurrentView('menu')} className="p-2 rounded-xl hover:bg-white/10 transition-colors">
            <Menu className={`w-6 h-6 ${currentTheme.colors.text}`} />
          </button>
          <div>
            <h1 className={`text-xl font-bold ${currentTheme.colors.text}`}>AlertaBH</h1>
            <span className="text-xs text-blue-400">v6.0 Advanced</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isPremium && (
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 px-3 py-1 rounded-full flex items-center gap-1">
              <Crown className="w-4 h-4 text-white" />
              <span className="text-xs font-bold text-white">PRO</span>
            </div>
          )}
          <button
            onClick={() => setMapType(mapType === 'dark' ? 'light' : mapType === 'light' ? 'satellite' : 'dark')}
            className={`p-2 ${currentTheme.colors.card} rounded-xl border ${currentTheme.colors.border}`}
          >
            <Layers className={`w-5 h-5 ${currentTheme.colors.accent}`} />
          </button>
        </div>
      </div>

      {/* Mapa */}
      <div className="flex-1 relative">
        <MapContainer 
          center={[-19.9167, -43.9345]} 
          zoom={mapZoom} 
          style={{ height: "100%", width: "100%" }}
          zoomControl={false}
        >
          <TileLayer 
            url={mapTiles[mapType].url}
            attribution={mapTiles[mapType].attribution}
          />
          <MapController 
            position={userPosition} 
            zoom={mapZoom}
            alerts={alerts}
            showHeatmap={showHeatmap}
          />
          
          {/* Alertas no mapa */}
          {alerts.map((alert) => {
            const alertType = alertTypes.find(t => t.id === alert.type);
            return (
              <Marker 
                key={alert.id} 
                position={[alert.lat, alert.lng]}
                icon={createCustomIcon(alertType?.color || '#ef4444', alertType?.icon || '⚠️')}
              >
                <Popup>
                  <div className="p-2 min-w-[200px]">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{alertType?.icon}</span>
                      <div>
                        <h3 className="font-bold text-sm">{alertType?.label}</h3>
                        <span className="text-xs text-gray-500">há {Math.floor((Date.now() - new Date(alert.createdAt)) / 60000)}min</span>
                      </div>
                    </div>
                    {alert.photo && (
                      <img src={alert.photo} alt="Alerta" className="w-full h-24 object-cover rounded-lg mb-2" />
                    )}
                    {alert.description && (
                      <p className="text-xs text-gray-600 mb-2">{alert.description}</p>
                    )}
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Por: {alert.createdBy}</span>
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        <span>{alert.verified}</span>
                      </div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>

        {/* Busca */}
        <AdvancedMapSearch 
          onLocationFound={(pos, name) => {
            setUserPosition(pos);
            const notif = {
              id: Date.now(),
              type: 'search',
              title: '📍 Local Encontrado',
              desc: name,
              time: 'Agora',
              read: false
            };
            setNotifications(prev => [notif, ...prev]);
          }}
          theme={currentTheme}
        />

        {/* Botões flutuantes */}
        <div className="absolute bottom-24 right-4 flex flex-col gap-3 z-[998]">
          <button
            onClick={handleGPSLock}
            className="w-14 h-14 bg-white/90 backdrop-blur-xl rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform"
          >
            <Navigation className={`w-6 h-6 ${userPosition ? 'text-blue-500' : 'text-gray-700'}`} />
          </button>
          
          <button
            onClick={() => setMapZoom(prev => Math.min(18, prev + 1))}
            className="w-14 h-14 bg-white/90 backdrop-blur-xl rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform"
          >
            <Plus className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        {/* Botão de criar alerta */}
        <button
          onClick={() => setCurrentView('report')}
          className="absolute bottom-24 left-1/2 -translate-x-1/2 z-[998] w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform animate-bounce"
        >
          <Plus className="w-8 h-8 text-white" />
        </button>

        {/* Info card */}
        <div className={`absolute top-20 left-4 z-[998] ${currentTheme.colors.card} backdrop-blur-xl rounded-2xl shadow-xl p-3 border ${currentTheme.colors.border}`}>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className={`text-sm font-bold ${currentTheme.colors.text}`}>{alerts.length} alertas ativos</span>
          </div>
        </div>
      </div>

      {renderNavigation()}
    </>
  );

  // ============================================
  // RENDER: REPORT (FLOW COMPLETO)
  // ============================================
  const renderReport = () => (
    <>
      <div className={`${currentTheme.colors.header} backdrop-blur-xl p-4 flex items-center justify-between border-b ${currentTheme.colors.border}`}>
        <button onClick={() => { setCurrentView('map'); setReportStep(1); }}>
          <X className={`w-6 h-6 ${currentTheme.colors.text}`} />
        </button>
        <h2 className={`font-bold ${currentTheme.colors.text}`}>Novo Alerta</h2>
        <span className={`text-sm ${currentTheme.colors.textSecondary}`}>Passo {reportStep}/4</span>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Step 1: GPS */}
        {reportStep === 1 && (
          <div className="flex flex-col items-center justify-center h-full p-6">
            <Navigation className={`w-24 h-24 mb-6 ${userPosition ? 'text-green-500' : currentTheme.colors.accent + ' animate-pulse'}`} />
            <h3 className={`text-2xl font-bold mb-2 ${currentTheme.colors.text}`}>
              {userPosition ? '✓ Localização Confirmada' : 'Ativando GPS...'}
            </h3>
            <p className={`text-center mb-6 ${currentTheme.colors.textSecondary}`}>
              {userPosition 
                ? 'Sua localização foi capturada com sucesso' 
                : 'Precisamos da sua localização para criar o alerta'}
            </p>
            {!userPosition ? (
              <button
                onClick={handleGPSLock}
                className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-8 py-4 rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all"
              >
                Ativar GPS
              </button>
            ) : (
              <button
                onClick={() => setReportStep(2)}
                className="bg-gradient-to-r from-green-600 to-green-500 text-white px-8 py-4 rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all flex items-center gap-2"
              >
                Continuar <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        {/* Step 2: Tipo de Alerta */}
        {reportStep === 2 && (
          <div className="p-6">
            <h3 className={`text-xl font-bold mb-4 ${currentTheme.colors.text}`}>Tipo de Alerta</h3>
            <div className="grid grid-cols-2 gap-3">
              {alertTypes.map(type => (
                <button
                  key={type.id}
                  onClick={() => {
                    setReportData({...reportData, type: type.id});
                    setReportStep(3);
                  }}
                  className={`${currentTheme.colors.card} backdrop-blur-xl border ${currentTheme.colors.border} p-4 rounded-2xl hover:border-blue-500 transition-all hover:scale-105`}
                >
                  <div className="text-4xl mb-2">{type.icon}</div>
                  <p className={`text-sm font-semibold ${currentTheme.colors.text}`}>{type.label}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Foto e Descrição */}
        {reportStep === 3 && (
          <div className="p-6">
            <h3 className={`text-xl font-bold mb-4 ${currentTheme.colors.text}`}>Detalhes (Opcional)</h3>
            
            {/* Foto */}
            <div className={`${currentTheme.colors.card} backdrop-blur-xl border ${currentTheme.colors.border} rounded-2xl p-6 mb-4`}>
              <label className="flex flex-col items-center gap-3 cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (ev) => setReportData({...reportData, photo: ev.target.result});
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                {reportData.photo ? (
                  <>
                    <img src={reportData.photo} alt="Preview" className="w-full h-48 object-cover rounded-xl" />
                    <span className={`text-sm ${currentTheme.colors.accent}`}>✓ Foto adicionada</span>
                  </>
                ) : (
                  <>
                    <Camera className={`w-12 h-12 ${currentTheme.colors.textSecondary}`} />
                    <span className={`text-sm ${currentTheme.colors.textSecondary}`}>Adicionar foto</span>
                  </>
                )}
              </label>
            </div>

            {/* Descrição */}
            <textarea
              value={reportData.description}
              onChange={(e) => setReportData({...reportData, description: e.target.value})}
              placeholder="Adicione detalhes sobre o alerta..."
              className={`w-full ${currentTheme.colors.card} backdrop-blur-xl border ${currentTheme.colors.border} rounded-2xl p-4 ${currentTheme.colors.text} placeholder-gray-400 resize-none focus:ring-2 focus:ring-blue-500 outline-none mb-4`}
              rows={4}
            />

            <button
              onClick={() => setReportStep(4)}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-4 rounded-2xl font-bold shadow-xl"
            >
              Continuar
            </button>
          </div>
        )}

        {/* Step 4: Configurações Finais */}
        {reportStep === 4 && (
          <div className="p-6">
            <h3 className={`text-xl font-bold mb-4 ${currentTheme.colors.text}`}>Configurações Finais</h3>
            
            {/* Duração */}
            <div className={`${currentTheme.colors.card} backdrop-blur-xl border ${currentTheme.colors.border} rounded-2xl p-4 mb-4`}>
              <label className={`text-sm font-semibold ${currentTheme.colors.text} mb-2 block`}>Duração do Alerta</label>
              <div className="flex items-center gap-4">
                <Clock className={currentTheme.colors.accent} />
                <input
                  type="range"
                  min="15"
                  max="120"
                  step="15"
                  value={reportData.duration}
                  onChange={(e) => setReportData({...reportData, duration: e.target.value})}
                  className="flex-1"
                />
                <span className={`font-bold ${currentTheme.colors.text}`}>{reportData.duration}min</span>
              </div>
            </div>

            {/* Severidade */}
            <div className={`${currentTheme.colors.card} backdrop-blur-xl border ${currentTheme.colors.border} rounded-2xl p-4 mb-6`}>
              <label className={`text-sm font-semibold ${currentTheme.colors.text} mb-3 block`}>Gravidade</label>
              <div className="flex gap-2">
                {[
                  { id: 'low', label: 'Baixa', color: 'bg-yellow-500' },
                  { id: 'medium', label: 'Média', color: 'bg-orange-500' },
                  { id: 'high', label: 'Alta', color: 'bg-red-500' }
                ].map(sev => (
                  <button
                    key={sev.id}
                    onClick={() => setReportData({...reportData, severity: sev.id})}
                    className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                      reportData.severity === sev.id
                        ? `${sev.color} text-white scale-105`
                        : `${currentTheme.colors.card} ${currentTheme.colors.text} border ${currentTheme.colors.border}`
                    }`}
                  >
                    {sev.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Resumo */}
            <div className={`${currentTheme.colors.card} backdrop-blur-xl border ${currentTheme.colors.border} rounded-2xl p-4 mb-4`}>
              <h4 className={`font-semibold ${currentTheme.colors.text} mb-2`}>Resumo</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className={currentTheme.colors.textSecondary}>Tipo:</span>
                  <span className={currentTheme.colors.text}>{alertTypes.find(t => t.id === reportData.type)?.label}</span>
                </div>
                <div className="flex justify-between">
                  <span className={currentTheme.colors.textSecondary}>Duração:</span>
                  <span className={currentTheme.colors.text}>{reportData.duration}min</span>
                </div>
                <div className="flex justify-between">
                  <span className={currentTheme.colors.textSecondary}>Foto:</span>
                  <span className={currentTheme.colors.text}>{reportData.photo ? '✓ Sim' : 'Não'}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleCreateAlert}
              className="w-full bg-gradient-to-r from-red-600 to-pink-600 text-white py-4 rounded-2xl font-bold shadow-xl flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" />
              Criar Alerta
            </button>
          </div>
        )}
      </div>
    </>
  );

  // ============================================
  // RENDER: PERFIL
  // ============================================
  const renderProfile = () => (
    <>
      <div className={`${currentTheme.colors.header} backdrop-blur-xl p-4 flex items-center justify-between border-b ${currentTheme.colors.border}`}>
        <h2 className={`text-xl font-bold ${currentTheme.colors.text}`}>Perfil</h2>
        <button onClick={() => setCurrentView('settings')}>
          <Settings className={`w-6 h-6 ${currentTheme.colors.textSecondary}`} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {/* Card de perfil */}
        <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-6 mb-6 text-white shadow-2xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-4xl border-4 border-white/50">
              {userData?.avatar}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-1">{userData?.name}</h2>
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                <span className="text-sm">Nível {userStats.level}</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="opacity-90">{userStats.points} pontos</span>
              <span className="opacity-90">Rank #{userStats.rank}</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-white h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (userStats.points / 1000) * 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className={`${currentTheme.colors.card} backdrop-blur-xl border ${currentTheme.colors.border} rounded-2xl p-4 text-center`}>
            <MapPin className={`w-6 h-6 ${currentTheme.colors.accent} mx-auto mb-2`} />
            <p className={`text-2xl font-bold ${currentTheme.colors.text}`}>{userStats.totalAlerts}</p>
            <p className={`text-xs ${currentTheme.colors.textSecondary}`}>Alertas</p>
          </div>
          <div className={`${currentTheme.colors.card} backdrop-blur-xl border ${currentTheme.colors.border} rounded-2xl p-4 text-center`}>
            <Trophy className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
            <p className={`text-2xl font-bold ${currentTheme.colors.text}`}>{unlockedAchievements.length}</p>
            <p className={`text-xs ${currentTheme.colors.textSecondary}`}>Conquistas</p>
          </div>
          <div className={`${currentTheme.colors.card} backdrop-blur-xl border ${currentTheme.colors.border} rounded-2xl p-4 text-center`}>
            <Star className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <p className={`text-2xl font-bold ${currentTheme.colors.text}`}>{userStats.level}</p>
            <p className={`text-xs ${currentTheme.colors.textSecondary}`}>Nível</p>
          </div>
        </div>

        {/* Conquistas */}
        <div className="mb-6">
          <h3 className={`text-lg font-bold mb-3 ${currentTheme.colors.text} flex items-center gap-2`}>
            <Trophy className="w-5 h-5 text-yellow-400" />
            Conquistas Desbloqueadas
          </h3>
          <div className="grid grid-cols-4 gap-3">
            {achievementsList.map(achievement => {
              const unlocked = unlockedAchievements.includes(achievement.id);
              const rarityColors = {
                common: 'from-gray-500 to-gray-600',
                rare: 'from-blue-500 to-blue-600',
                epic: 'from-purple-500 to-purple-600',
                legendary: 'from-yellow-500 to-orange-500'
              };
              
              return (
                <div
                  key={achievement.id}
                  className={`rounded-2xl p-3 text-center transition-all ${
                    unlocked
                      ? `bg-gradient-to-br ${rarityColors[achievement.rarity]} shadow-lg hover:scale-105`
                      : `${currentTheme.colors.card} border ${currentTheme.colors.border} opacity-40`
                  }`}
                  title={achievement.desc}
                >
                  <div className="text-2xl mb-1">{achievement.icon}</div>
                  <p className={`text-xs font-semibold ${unlocked ? 'text-white' : currentTheme.colors.textSecondary}`}>
                    {achievement.name}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Botão Premium */}
        {!isPremium && (
          <button
            onClick={() => setCurrentView('premium')}
            className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold py-4 rounded-2xl shadow-xl flex items-center justify-center gap-2 hover:shadow-2xl transition-all"
          >
            <Crown className="w-5 h-5" />
            Seja Premium
          </button>
        )}
      </div>

      {renderNavigation()}
    </>
  );

  // ============================================
  // RENDER: NOTIFICAÇÕES
  // ============================================
  const renderNotifications = () => (
    <>
      <div className={`${currentTheme.colors.header} backdrop-blur-xl p-4 border-b ${currentTheme.colors.border} flex justify-between items-center`}>
        <h2 className={`text-xl font-bold ${currentTheme.colors.text}`}>Notificações</h2>
        {notifications.length > 0 && (
          <button
            onClick={() => setNotifications([])}
            className={`text-sm ${currentTheme.colors.accent} hover:underline`}
          >
            Limpar tudo
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-6">
            <Bell className={`w-16 h-16 ${currentTheme.colors.textSecondary} opacity-50 mb-4`} />
            <p className={`${currentTheme.colors.textSecondary} text-center`}>Nenhuma notificação</p>
          </div>
        ) : (
          <div className={`divide-y ${currentTheme.colors.border}`}>
            {notifications.map(notif => (
              <div
                key={notif.id}
                className={`p-4 flex gap-4 hover:bg-white/5 transition-colors ${!notif.read ? 'bg-blue-500/5' : ''}`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                  notif.type === 'created' ? 'bg-green-500' :
                  notif.type === 'achievement' ? 'bg-yellow-500' :
                  'bg-blue-500'
                }`}>
                  {notif.type === 'created' && <CheckCircle className="w-6 h-6 text-white" />}
                  {notif.type === 'achievement' && <Trophy className="w-6 h-6 text-white" />}
                  {notif.type === 'search' && <MapPin className="w-6 h-6 text-white" />}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className={`font-semibold text-sm ${currentTheme.colors.text} mb-1`}>{notif.title}</h4>
                  <p className={`text-sm ${currentTheme.colors.textSecondary} line-clamp-2`}>{notif.desc}</p>
                  <p className={`text-xs ${currentTheme.colors.textSecondary} mt-1`}>{notif.time}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {renderNavigation()}
    </>
  );

  // ============================================
  // RENDER: ESTATÍSTICAS
  // ============================================
  const renderStats = () => (
    <>
      <div className={`${currentTheme.colors.header} backdrop-blur-xl p-4 border-b ${currentTheme.colors.border}`}>
        <h2 className={`text-xl font-bold ${currentTheme.colors.text}`}>Estatísticas</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {/* Resumo Geral */}
        <div className={`${currentTheme.colors.card} backdrop-blur-xl border ${currentTheme.colors.border} rounded-3xl p-6 mb-6`}>
          <h3 className={`text-lg font-bold mb-4 ${currentTheme.colors.text} flex items-center gap-2`}>
            <BarChart3 className={currentTheme.colors.accent} />
            Resumo Geral
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className={`text-sm ${currentTheme.colors.textSecondary} mb-1`}>Total de Alertas</p>
              <p className={`text-3xl font-bold ${currentTheme.colors.text}`}>{alerts.length}</p>
            </div>
            <div>
              <p className={`text-sm ${currentTheme.colors.textSecondary} mb-1`}>Pontos</p>
              <p className={`text-3xl font-bold ${currentTheme.colors.text}`}>{userStats.points}</p>
            </div>
            <div>
              <p className={`text-sm ${currentTheme.colors.textSecondary} mb-1`}>Conquistas</p>
              <p className={`text-3xl font-bold ${currentTheme.colors.text}`}>{unlockedAchievements.length}/{achievementsList.length}</p>
            </div>
            <div>
              <p className={`text-sm ${currentTheme.colors.textSecondary} mb-1`}>Ranking</p>
              <p className={`text-3xl font-bold ${currentTheme.colors.text}`}>#{userStats.rank}</p>
            </div>
          </div>
        </div>

        {/* Alertas por Tipo */}
        <div className={`${currentTheme.colors.card} backdrop-blur-xl border ${currentTheme.colors.border} rounded-3xl p-6 mb-6`}>
          <h3 className={`text-lg font-bold mb-4 ${currentTheme.colors.text}`}>Alertas por Tipo</h3>
          <div className="space-y-3">
            {alertTypes.map(type => {
              const count = alerts.filter(a => a.type === type.id).length;
              const percentage = alerts.length > 0 ? (count / alerts.length) * 100 : 0;
              
              return (
                <div key={type.id}>
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{type.icon}</span>
                      <span className={`text-sm ${currentTheme.colors.text}`}>{type.label}</span>
                    </div>
                    <span className={`text-sm font-bold ${currentTheme.colors.text}`}>{count}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: type.color
                      }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Histórico Recente */}
        <div className={`${currentTheme.colors.card} backdrop-blur-xl border ${currentTheme.colors.border} rounded-3xl p-6`}>
          <h3 className={`text-lg font-bold mb-4 ${currentTheme.colors.text} flex items-center gap-2`}>
            <History className={currentTheme.colors.accent} />
            Últimos Alertas
          </h3>
          {alerts.length === 0 ? (
            <p className={`text-center py-8 ${currentTheme.colors.textSecondary}`}>Nenhum alerta criado ainda</p>
          ) : (
            <div className="space-y-3">
              {alerts.slice(0, 5).map(alert => {
                const alertType = alertTypes.find(t => t.id === alert.type);
                return (
                  <div key={alert.id} className={`${currentTheme.colors.card} border ${currentTheme.colors.border} rounded-2xl p-3 flex items-center gap-3`}>
                    <div className="text-2xl">{alertType?.icon}</div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-semibold text-sm ${currentTheme.colors.text}`}>{alertType?.label}</p>
                      <p className={`text-xs ${currentTheme.colors.textSecondary}`}>
                        {new Date(alert.createdAt).toLocaleString('pt-BR')}
                      </p>
                    </div>
                    {alert.photo && <Camera className="w-4 h-4 text-blue-400" />}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {renderNavigation()}
    </>
  );

  // ============================================
  // RENDER: CONFIGURAÇÕES
  // ============================================
  const renderSettings = () => (
    <>
      <div className={`${currentTheme.colors.header} backdrop-blur-xl p-4 flex items-center gap-3 border-b ${currentTheme.colors.border}`}>
        <button onClick={() => setCurrentView('profile')}>
          <X className={`w-6 h-6 ${currentTheme.colors.text}`} />
        </button>
        <h2 className={`text-xl font-bold ${currentTheme.colors.text}`}>Configurações</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {/* Tema */}
        <div className="mb-6">
          <h3 className={`text-sm font-semibold ${currentTheme.colors.textSecondary} uppercase mb-3`}>Aparência</h3>
          <div className={`${currentTheme.colors.card} backdrop-blur-xl border ${currentTheme.colors.border} rounded-3xl p-4`}>
            <div className="space-y-3">
              {Object.values(themes).map(theme => {
                const Icon = theme.icon;
                return (
                  <button
                    key={theme.id}
                    onClick={() => {
                      if (theme.premium && !isPremium) {
                        alert("🔒 Tema Premium! Assine o plano Plus.");
                      } else {
                        setSelectedTheme(theme.id);
                      }
                    }}
                    className={`w-full rounded-2xl p-4 border-2 flex items-center justify-between transition-all ${
                      selectedTheme === theme.id
                        ? 'border-blue-500 bg-blue-500/10'
                        : `${currentTheme.colors.border} hover:border-blue-500/50`
                    } ${theme.premium && !isPremium ? 'opacity-60' : ''}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl ${theme.colors.bg} border-2 ${theme.colors.border} flex items-center justify-center`}>
                        <Icon className="w-6 h-6 text-blue-400" />
                      </div>
                      <span className={`font-semibold ${currentTheme.colors.text}`}>{theme.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {theme.premium && !isPremium && <Lock className="w-4 h-4 text-gray-400" />}
                      {selectedTheme === theme.id && <Check className="w-5 h-5 text-blue-500" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Notificações */}
        <div className="mb-6">
          <h3 className={`text-sm font-semibold ${currentTheme.colors.textSecondary} uppercase mb-3`}>Notificações</h3>
          <div className={`${currentTheme.colors.card} backdrop-blur-xl border ${currentTheme.colors.border} rounded-3xl p-4 space-y-3`}>
            {[
              { id: 'notifications', label: 'Push Notifications', icon: Bell },
              { id: 'sound', label: 'Sons', icon: Volume2 },
              { id: 'vibration', label: 'Vibração', icon: Activity }
            ].map(setting => {
              const Icon = setting.icon;
              return (
                <button
                  key={setting.id}
                  onClick={() => setSettings({...settings, [setting.id]: !settings[setting.id]})}
                  className="w-full flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${currentTheme.colors.accent}`} />
                    <span className={currentTheme.colors.text}>{setting.label}</span>
                  </div>
                  <div className={`w-12 h-6 rounded-full transition-colors ${settings[setting.id] ? 'bg-blue-500' : 'bg-gray-600'}`}>
                    <div className={`w-5 h-5 bg-white rounded-full mt-0.5 transition-transform ${settings[setting.id] ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Backup */}
        <div className="mb-6">
          <h3 className={`text-sm font-semibold ${currentTheme.colors.textSecondary} uppercase mb-3`}>Backup</h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                saveToStorage();
                alert("☁️ Backup salvo com sucesso!");
              }}
              className={`${currentTheme.colors.card} backdrop-blur-xl border ${currentTheme.colors.border} rounded-2xl p-4 flex flex-col items-center gap-2 hover:border-blue-500 transition-colors`}
            >
              <Upload className="w-6 h-6 text-green-400" />
              <span className={`text-sm font-semibold ${currentTheme.colors.text}`}>Salvar</span>
            </button>
            <button
              onClick={() => {
                loadFromStorage();
                alert("☁️ Dados restaurados!");
              }}
              className={`${currentTheme.colors.card} backdrop-blur-xl border ${currentTheme.colors.border} rounded-2xl p-4 flex flex-col items-center gap-2 hover:border-blue-500 transition-colors`}
            >
              <Download className="w-6 h-6 text-blue-400" />
              <span className={`text-sm font-semibold ${currentTheme.colors.text}`}>Restaurar</span>
            </button>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full bg-red-500/20 border-2 border-red-500 text-red-500 rounded-2xl p-4 font-bold flex items-center justify-center gap-2 hover:bg-red-500/30 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Sair da Conta
        </button>
      </div>
    </>
  );

  // ============================================
  // RENDER: PREMIUM
  // ============================================
  const renderPremium = () => (
    <>
      <div className={`${currentTheme.colors.header} backdrop-blur-xl p-4 flex items-center gap-3 border-b ${currentTheme.colors.border}`}>
        <button onClick={() => setCurrentView('profile')}>
          <X className={`w-6 h-6 ${currentTheme.colors.text}`} />
        </button>
        <h2 className={`text-xl font-bold ${currentTheme.colors.text}`}>Premium</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {/* Hero */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl animate-pulse">
            <Crown className="w-12 h-12 text-white" />
          </div>
          <h2 className={`text-3xl font-bold mb-2 ${currentTheme.colors.text}`}>AlertaBH Pro</h2>
          <p className={`text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-500`}>
            R$ 9,90/mês
          </p>
        </div>

        {/* Benefícios */}
        <div className={`${currentTheme.colors.card} backdrop-blur-xl border-2 border-yellow-500 rounded-3xl p-6 mb-6`}>
          <h3 className={`text-xl font-bold mb-4 ${currentTheme.colors.text}`}>Recursos Premium</h3>
          <div className="space-y-3">
            {[
              { icon: Sparkles, text: 'Sem anúncios' },
              { icon: Palette, text: '2 Temas exclusivos' },
              { icon: Zap, text: 'Alertas prioritários' },
              { icon: Cloud, text: 'Backup ilimitado na nuvem' },
              { icon: Trophy, text: 'Conquistas exclusivas' },
              { icon: MapIcon, text: 'Mapas em alta resolução' }
            ].map((benefit, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <benefit.icon className="w-5 h-5 text-white" />
                </div>
                <span className={currentTheme.colors.text}>{benefit.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={() => {
            setIsPremium(true);
            alert("✨ Bem-vindo ao AlertaBH Pro!");
            setCurrentView('profile');
          }}
          disabled={isPremium}
          className={`w-full py-5 rounded-2xl font-bold text-white shadow-2xl transition-all ${
            isPremium
              ? 'bg-green-600 cursor-not-allowed'
              : 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 hover:scale-105'
          }`}
        >
          {isPremium ? (
            <span className="flex items-center justify-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Você é Premium!
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Crown className="w-5 h-5" />
              Assinar Agora
            </span>
          )}
        </button>

        {isPremium && (
          <p className={`text-center mt-4 text-sm ${currentTheme.colors.textSecondary}`}>
            Obrigado por apoiar o AlertaBH! 💙
          </p>
        )}
      </div>
    </>
  );

  // ============================================
  // RENDER PRINCIPAL
  // ============================================
  if (!isAuthenticated) {
    return <ModernLoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className={`flex flex-col h-screen ${currentTheme.colors.bg} max-w-md mx-auto overflow-hidden transition-all duration-500`}>
      <style>{`
        @keyframes pulse-ring {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.2); opacity: 0; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-shake { animation: shake 0.5s; }
        .delay-1000 { animation-delay: 1s; }
        .safe-bottom { padding-bottom: env(safe-area-inset-bottom); }
      `}</style>

      {currentView === 'map' && renderMap()}
      {currentView === 'report' && renderReport()}
      {currentView === 'profile' && renderProfile()}
      {currentView === 'notifications' && renderNotifications()}
      {currentView === 'stats' && renderStats()}
      {currentView === 'settings' && renderSettings()}
      {currentView === 'premium' && renderPremium()}
    </div>
  );
}
